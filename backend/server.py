#!/usr/bin/env python3
"""
RISC-V C-to-Hex Compiler Backend
Requires: riscv64-unknown-elf-gcc toolchain installed
Install on Ubuntu: sudo apt install gcc-riscv64-unknown-elf
"""

import os
import sys
import json
import tempfile
import subprocess
import base64
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse

# ─── Linker Script ────────────────────────────────────────────────────────────
LINKER_SCRIPT = """
MEMORY {
    ROM (rx)  : ORIGIN = 0x00000000, LENGTH = 64K
    RAM (rwx) : ORIGIN = 0x00010000, LENGTH = 64K
}

SECTIONS {
    .text : {
        KEEP(*(.text.start))
        *(.text*)
        *(.rodata*)
    } > ROM

    .data : {
        *(.data*)
    } > RAM AT > ROM

    .bss : {
        *(.bss*)
        *(COMMON)
    } > RAM

    .stack (NOLOAD) : {
        . = ALIGN(16);
        . += 0x1000;
        _stack_top = .;
    } > RAM
}

_heap_size  = 0;
_stack_size = 0x1000;
"""

# ─── Startup Assembly ─────────────────────────────────────────────────────────
STARTUP_S = """
.section .text.start
.global _start
_start:
    la   sp, _stack_top
    call main
_hang:
    j    _hang
"""

ALLOWED_ORIGINS = ["http://localhost:3000", "http://127.0.0.1:3000",
                   "http://localhost:5500", "http://127.0.0.1:5500",
                   "null", "*"]

def compile_c_to_hex(c_code: str, opt_level: str = "O0", output_format: str = "verilog"):
    """Compile C code to RISC-V hex using the installed toolchain."""
    with tempfile.TemporaryDirectory() as tmpdir:
        # Write source files
        main_c    = os.path.join(tmpdir, "main.c")
        link_ld   = os.path.join(tmpdir, "link.ld")
        startup_s = os.path.join(tmpdir, "startup.S")
        main_o    = os.path.join(tmpdir, "main.o")
        startup_o = os.path.join(tmpdir, "startup.o")
        main_elf  = os.path.join(tmpdir, "main.elf")
        main_hex  = os.path.join(tmpdir, "main.hex")
        main_asm  = os.path.join(tmpdir, "main.asm")

        with open(main_c,    "w") as f: f.write(c_code)
        with open(link_ld,   "w") as f: f.write(LINKER_SCRIPT)
        with open(startup_s, "w") as f: f.write(STARTUP_S)

        arch_flags = ["-march=rv32im", "-mabi=ilp32", f"-{opt_level}",
                      "-nostdlib", "-ffreestanding"]
        gcc     = "riscv64-unknown-elf-gcc"
        objcopy = "riscv64-unknown-elf-objcopy"
        objdump = "riscv64-unknown-elf-objdump"

        logs = []

        # Compile main.c
        r = subprocess.run(
            [gcc, *arch_flags, "-c", main_c, "-o", main_o],
            capture_output=True, text=True)
        logs.append(("compile main.c", r.returncode, r.stdout, r.stderr))
        if r.returncode != 0:
            return {"success": False, "error": r.stderr, "logs": logs}

        # Assemble startup.S
        r = subprocess.run(
            [gcc, *arch_flags, "-c", startup_s, "-o", startup_o],
            capture_output=True, text=True)
        logs.append(("assemble startup.S", r.returncode, r.stdout, r.stderr))
        if r.returncode != 0:
            return {"success": False, "error": r.stderr, "logs": logs}

        # Link
        r = subprocess.run(
            [gcc, *arch_flags, "-T", link_ld, startup_o, main_o, "-o", main_elf],
            capture_output=True, text=True)
        logs.append(("link", r.returncode, r.stdout, r.stderr))
        if r.returncode != 0:
            return {"success": False, "error": r.stderr, "logs": logs}

        # objcopy → verilog hex
        r = subprocess.run(
            [objcopy, "-O", "verilog", main_elf, main_hex],
            capture_output=True, text=True)
        logs.append(("objcopy", r.returncode, r.stdout, r.stderr))
        if r.returncode != 0:
            return {"success": False, "error": r.stderr, "logs": logs}

        # Convert to 8-digit hex, one 32-bit word per line, no @ lines
        with open(main_hex, "r") as f:
            raw = f.read()

        lines_out = []
        for line in raw.splitlines():
            if line.startswith("@"):
                continue  # skip address markers
            words = line.strip().split()
            for i in range(0, len(words), 4):
                chunk = words[i:i+4]
                while len(chunk) < 4:
                    chunk.append("00")
                lines_out.append("".join(chunk))

        hex_text = "\n".join(lines_out)

        # objdump → disassembly
        r = subprocess.run(
            [objdump, "-d", "--no-show-raw-insn", main_elf],
            capture_output=True, text=True)
        asm_text = r.stdout if r.returncode == 0 else "(disassembly unavailable)"

        with open(main_elf, "rb") as f:
            elf_b64 = base64.b64encode(f.read()).decode()

        log_text = "\n".join(
            f"[{name}] rc={rc}\n{stdout}{stderr}".strip()
            for name, rc, stdout, stderr in logs
        )

        return {
            "success": True,
            "hex": hex_text,
            "elf_b64": elf_b64,
            "asm": asm_text,
            "logs": log_text,
        }


class Handler(BaseHTTPRequestHandler):
    def log_message(self, fmt, *args):
        print(f"[{self.address_string()}] {fmt % args}")

    def _cors(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def do_OPTIONS(self):
        self.send_response(200)
        self._cors()
        self.end_headers()

    def do_POST(self):
        if urlparse(self.path).path != "/compile":
            self.send_response(404); self.end_headers(); return

        length = int(self.headers.get("Content-Length", 0))
        body   = self.rfile.read(length)
        try:
            payload = json.loads(body)
        except Exception:
            self.send_response(400); self.end_headers(); return

        c_code = payload.get("code", "")
        opt    = payload.get("opt", "O0")
        fmt    = payload.get("format", "verilog")

        result = compile_c_to_hex(c_code, opt, fmt)

        resp = json.dumps(result).encode()
        self.send_response(200)
        self._cors()
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", len(resp))
        self.end_headers()
        self.wfile.write(resp)


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8765
    print(f"RISC-V Compiler Backend running on http://localhost:{port}")
    print("Endpoint: POST /compile")
    HTTPServer(("", port), Handler).serve_forever()
