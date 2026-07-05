export type ProductFamily = "RV64" | "RV32" | "Peripherals";

export const products = [
  {
    slug: "csrv64i-sc", group: "RV64" as ProductFamily, family: "RV64 · Educational", name: "CSRV64I_SC", role: "Base educational core", status: "Stable", statusTone: "green",
    summary: "A deliberately small RV64I core for learning instruction execution and building a verification baseline.",
    features: ["RV64I base ISA", "Single-cycle datapath", "Machine mode", "No cache or MMU", "Readable SystemVerilog"],
    repo: "https://github.com/KaranArjunS/CSRV64I_SC",
  },
  {
    slug: "csrv64i-p5", group: "RV64" as ProductFamily, family: "RV64 · Pipelined", name: "CSRV64I-P5", role: "Five-stage FPGA core", status: "Stable", statusTone: "green",
    summary: "A five-stage RV64I pipeline with visible hazard, forwarding, stall and flush behavior.",
    features: ["IF/ID/EX/MEM/WB", "Hazard detection", "Forwarding paths", "Branch flush", "Artix-7 tested"],
    repo: "https://github.com/KaranArjunS/CoreSelva-RV64I-5-Stage-ArtyA7",
  },
  {
    slug: "csrv64-gs-lx", group: "RV64" as ProductFamily, family: "RV64 · Research", name: "CSRV64-GS-LX", role: "Linux-capable research profile", status: "Research", statusTone: "purple",
    summary: "The long-term path toward supervisor mode, Sv39, OpenSBI and a Linux-capable educational platform.",
    features: ["RV64G target", "Supervisor mode", "Sv39 MMU", "OpenSBI", "Linux boot"], repo: null,
  },
  {
    slug: "rv32i-sc", group: "RV32" as ProductFamily, family: "RV32 · Educational", name: "RV32I_SC", role: "Single-cycle educational core", status: "Stable", statusTone: "green",
    summary: "A compact single-cycle core for learning MCU-class RISC-V fundamentals without pipeline complexity.",
    features: ["RV32I base ISA", "Single-cycle datapath", "Machine mode", "FPGA-first design", "Small SoC focus"], repo: "https://github.com/vishal-17-selvan/RISC-V-RV32I-Single-Cycle",
  },
  {
    slug: "csrv32-im", group: "RV32" as ProductFamily, family: "RV32 · Pipelined", name: "CSRV32-IM", role: "Pipelined MCU core", status: "Planned", statusTone: "blue",
    summary: "A 32-bit embedded profile that introduces pipelining, multiply/divide operations, and interrupts.",
    features: ["RV32IM target", "Basic pipeline", "Interrupt support", "ASIC-ready direction", "Embedded workloads"], repo: null,
  },
  {
    slug: "csrv32-imc", group: "RV32" as ProductFamily, family: "RV32 · Compact", name: "CSRV32-IMC", role: "Compact MCU profile", status: "Planned", statusTone: "blue",
    summary: "A code-density-focused MCU roadmap profile for memory-constrained embedded systems.",
    features: ["RV32IMC target", "Compressed instructions", "Interrupt support", "Low-memory systems", "SoC integration focus"], repo: null,
  },
  {
    slug: "uart", group: "Peripherals" as ProductFamily, family: "SoC peripheral", name: "UART", role: "Serial communication IP", status: "Planned", statusTone: "blue",
    summary: "A readable transmit-and-receive block for teaching serial framing, buffering, status, and interrupts.",
    features: ["TX and RX paths", "Configurable baud timing", "Status flags", "Interrupt-ready", "Simulation-first"], repo: null,
  },
  {
    slug: "gpio", group: "Peripherals" as ProductFamily, family: "SoC peripheral", name: "GPIO", role: "Digital input/output IP", status: "Planned", statusTone: "blue",
    summary: "A small memory-mapped GPIO block for switches, LEDs, external signals, and interrupt experiments.",
    features: ["Input and output control", "Direction registers", "Bit-level access", "Edge interrupt direction", "Simulation-first"], repo: null,
  },
  {
    slug: "timer", group: "Peripherals" as ProductFamily, family: "SoC peripheral", name: "Timer", role: "Timing and compare IP", status: "Planned", statusTone: "blue",
    summary: "A deterministic counter and compare block for timekeeping, periodic interrupts, and firmware scheduling.",
    features: ["Free-running counter", "Compare events", "Periodic interrupt", "Memory-mapped control", "Simulation-first"], repo: null,
  },
] as const;

export const productGroups = [
  { key: "RV64" as ProductFamily, title: "RV64 cores", copy: "From a transparent single-cycle baseline to a pipelined FPGA core and a Linux-capable research direction." },
  { key: "RV32" as ProductFamily, title: "RV32 cores", copy: "MCU-class profiles that progress from the base ISA into pipelining, multiply/divide, and compact code." },
  { key: "Peripherals" as ProductFamily, title: "SoC peripherals", copy: "Readable UART, GPIO, and Timer blocks intended to turn the processor cores into teachable systems." },
] as const;
