/* Original teaching material informed by the source map noted in each lesson. */
const COURSE = {
  title: "Embedded C: first program to firmware",
  lessons: [
    {
      id: "welcome", category: "Start here", title: "The machine beneath main()", time: "12 min", level: "Beginner", source: "Preface; Chapter 1, pp. 16-35",
      lede: "Embedded C becomes much less mysterious once you see the complete path from electricity to an instruction changing a physical pin.",
      objectives: ["Distinguish an embedded system from a desktop program", "Trace reset to main()", "Use a repeatable observe–model–build–measure loop"],
      sections: [
        { heading: "A computer with a physical job", html: `<p>An embedded system is a computer inside a larger product. Its success is measured in physical outcomes: a motor reaches speed, a display updates before a user notices, or a radio packet arrives within its deadline. That makes <b>time, power, pins, and failure behavior</b> part of the program.</p><div class="concept-grid"><div class="concept-card"><b>Inputs</b><span>Buttons, sensors, timers, packets and ADC samples describe the world.</span></div><div class="concept-card"><b>Processing</b><span>C code transforms state while respecting memory and timing limits.</span></div><div class="concept-card"><b>Outputs</b><span>GPIO, PWM, displays, motors and radios change the world.</span></div><div class="concept-card"><b>Feedback</b><span>Measurements tell us whether the system did what we intended.</span></div></div>` },
        { heading: "Reset to running firmware", html: `<p>After reset, the Cortex-M4 does not magically discover C. It reads the initial stack pointer and reset-handler address from the vector table. Startup code copies initialized data to RAM, clears zero-initialized data, configures the runtime, and calls <code>main()</code>.</p><div class="flow"><span>Reset</span><i>→</i><span>Vector table</span><i>→</i><span>Reset_Handler</span><i>→</i><span>.data/.bss</span><i>→</i><span>main()</span></div><div class="callout"><strong>Core idea</strong>Your source files describe intent. The compiler emits instructions, the linker assigns addresses, and startup code creates the C environment those instructions expect.</div>` },
        { heading: "The engineering loop", html: `<ol><li><b>Observe:</b> state exactly what the hardware does now.</li><li><b>Model:</b> identify registers, signals, timing and state.</li><li><b>Build:</b> change one understandable layer.</li><li><b>Measure:</b> use an LED, debugger, logic analyzer or UART to test the model.</li><li><b>Explain:</b> if you cannot explain why it works, the lesson is unfinished.</li></ol><p>This course follows that loop. The final project is not merely a TFT UI; it is a system you can reason about from reset to pixel.</p>` }
      ],
      example: { title: "The smallest honest firmware loop", code: `static void hardware_init(void) {}\nstatic void read_inputs(void) {}\nstatic void update_state(void) {}\nstatic void write_outputs(void) {}\n\nint main(void)\n{\n    hardware_init();\n\n    while (1)\n    {\n        read_inputs();\n        update_state();\n        write_outputs();\n    }\n}`, note: "The three phases form a useful mental model even after interrupts and a scheduler are added. This intentionally runs forever; use a debugger or simulator to stop it during study." },
      quiz: { q: "What runs before main() on a bare-metal Cortex-M system?", options: ["A desktop operating system", "The reset handler and startup code", "The C preprocessor", "The debugger"], answer: 1, why: "The CPU enters the reset handler through the vector table; startup code prepares RAM before calling main()." }
    },
    {
      id: "c-core", category: "C foundations", title: "C that maps cleanly to hardware", time: "18 min", level: "Beginner", source: "Ch. 1.5; Ch. 3.2-3.4, pp. 64-83 and 186-221",
      lede: "Firmware-friendly C is explicit about width, ownership, side effects, and units.",
      objectives: ["Choose fixed-width integer types", "Recognize undefined and implementation-defined traps", "Write interfaces that expose units and ownership"],
      sections: [
        { heading: "Types are design decisions", html: `<p>Use <code>uint32_t</code> when a hardware register is 32 bits, <code>uint8_t</code> for a byte protocol, and <code>bool</code> for a logical state. Plain <code>int</code> is still useful for ordinary arithmetic, but never assume its width when a protocol or register requires an exact representation.</p><div class="callout warning"><strong>Signedness trap</strong>Mixing signed and unsigned values can change comparison rules. Compile with warnings enabled and treat every conversion as a design choice.</div>` },
        { heading: "Names should carry meaning", html: `<p><code>timeout_ms</code> is safer than <code>timeout</code>. <code>adc_raw</code> is different from <code>millivolts</code>. A good embedded API makes illegal combinations awkward and correct use obvious.</p><div class="concept-grid"><div class="concept-card"><b>Value</b><span>The bits held by an object.</span></div><div class="concept-card"><b>Address</b><span>Where that object lives in memory.</span></div><div class="concept-card"><b>Lifetime</b><span>How long storage remains valid.</span></div><div class="concept-card"><b>Visibility</b><span>Which code is allowed to name it.</span></div></div>` },
        { heading: "Small functions, visible effects", html: `<p>A function that toggles a pin, waits, allocates memory, or modifies global state has an effect beyond its return value. Make those effects visible in the name and module boundary. Firmware is easier to verify when calculations are separated from device access.</p>` }
      ],
      example: { title: "Unit-aware conversion", code: `#include <stdint.h>\n\nuint32_t adc_to_millivolts(uint16_t adc_raw, uint32_t vref_mv)\n{\n    const uint32_t adc_levels = 4095U;\n    return ((uint32_t)adc_raw * vref_mv) / adc_levels;\n}`, note: "The cast widens the multiplication before it can overflow a 16-bit intermediate." },
      quiz: { q: "Why use uint32_t for a 32-bit peripheral register?", options: ["It always runs faster", "It documents and guarantees the required width", "It makes the variable volatile", "It stores floating-point values"], answer: 1, why: "Fixed-width types make the representation explicit across compilers." }
    },
    {
      id: "bits", category: "C foundations", title: "Binary, hex and bit masks", time: "20 min", level: "Beginner", source: "Ch. 1.4-1.5, pp. 50-83",
      lede: "Registers pack many independent switches into one word. Masks let you change exactly the switch you intend.",
      objectives: ["Translate between binary, hexadecimal and bit positions", "Set, clear, toggle and test bits", "Modify a field without damaging neighboring fields"],
      sections: [
        { heading: "One hexadecimal digit is four bits", html: `<p>Hexadecimal is not a different kind of number; it is a compact way to write bits. <code>0x20</code> equals binary <code>0010 0000</code>, so bit 5 is set. The expression <code>1U &lt;&lt; 5</code> constructs the same mask without mental conversion.</p><div class="bit-lab" data-bit-lab><b>Bit-mask playground</b><div class="bit-controls"><label>Value<input data-value value="0x12"></label><label>Bit (0-7)<input data-bit type="number" min="0" max="7" value="5"></label><label>Operation<select data-op><option value="set">Set</option><option value="clear">Clear</option><option value="toggle">Toggle</option><option value="test">Test</option></select></label></div><div class="bits" data-bits></div><p data-bit-result></p></div>` },
        { heading: "Read-modify-write", html: `<p><code>register |= mask</code> reads the register, ORs in the mask, then writes the result. Clearing uses AND with an inverted mask. Multi-bit fields require clearing the complete field before inserting the new value.</p><div class="callout"><strong>Atomicity matters</strong>A read-modify-write sequence can be interrupted. GPIO BSRR registers exist so a pin can be set or reset with one write.</div>` },
        { heading: "Boolean hardware logic", html: `<p>AND filters bits, OR combines options, XOR detects differences or toggles, and NOT inverts. These same ideas appear in pull-ups, open-drain buses, status flags, CRCs and digital logic.</p>` }
      ],
      example: { title: "Write a two-bit mode field", code: `#define FIELD_POS   10U\n#define FIELD_MASK  (3U << FIELD_POS)\n\nuint32_t set_field(uint32_t reg, uint32_t mode)\n{\n    reg &= ~FIELD_MASK;\n    reg |= (mode & 3U) << FIELD_POS;\n    return reg;\n}`, note: "Mask the incoming value too, so it cannot spill into adjacent fields." },
      quiz: { q: "Which expression clears bit 5 while preserving other bits?", options: ["x |= (1U << 5)", "x &= ~(1U << 5)", "x = 0", "x ^= 0xFF"], answer: 1, why: "The inverted mask has a zero only at bit 5; AND clears that bit and preserves the rest." }
    },
    {
      id: "pointers-volatile", category: "C foundations", title: "Pointers, const and volatile", time: "22 min", level: "Core", source: "Ch. 2.1-2.4; Ch. 4.6, pp. 95-168 and 296",
      lede: "A peripheral register is a typed memory address whose value can change outside the compiler’s view.",
      objectives: ["Read a register definition from right to left", "Use volatile for observable hardware access", "Understand what volatile does not guarantee"],
      sections: [
        { heading: "Addresses become objects through pointers", html: `<p>A pointer stores an address. Dereferencing it accesses the object at that address. Casting <code>0x48000000U</code> to a pointer tells C how wide the access is; dereferencing performs the bus transaction.</p>` },
        { heading: "Why volatile exists", html: `<p>The optimizer assumes ordinary memory changes only when visible C code changes it. Hardware status flags, memory-mapped I/O and values shared with an ISR violate that assumption. <code>volatile</code> requires the compiler to emit the observable reads and writes you wrote.</p><div class="callout warning"><strong>Not a lock</strong><code>volatile</code> does not make an operation atomic, order multiple cores, or protect a multi-step invariant. Critical sections and atomics solve different problems.</div>` },
        { heading: "Const has two positions", html: `<p><code>const uint8_t *p</code> points to data you promise not to change through <code>p</code>. <code>uint8_t * const p</code> is a pointer whose address cannot change. Hardware APIs often combine const with volatile deliberately.</p>` }
      ],
      example: { title: "Direct GPIO access", code: `#include <stdint.h>\n\n#define GPIOA_MODER (*(volatile uint32_t *)0x48000000U)\n#define LED_PIN 5U\n\nvoid led_pin_output(void)\n{\n    GPIOA_MODER &= ~(3U << (LED_PIN * 2U));\n    GPIOA_MODER |=  (1U << (LED_PIN * 2U));\n}`, note: "CMSIS normally provides typed register structures, but this form reveals exactly what happens." },
      quiz: { q: "What does volatile guarantee?", options: ["Thread safety", "Every written volatile access remains observable", "No interrupt can occur", "The value stays in Flash"], answer: 1, why: "It constrains compiler optimization around accesses; it is not synchronization." }
    },
    {
      id: "memory", category: "C foundations", title: "Flash, RAM, stack and linker", time: "24 min", level: "Core", source: "Ch. 2.1; Ch. 3.8, pp. 95-103 and 251-254",
      lede: "Every byte has both a lifetime and a physical home. The linker is the cartographer.",
      objectives: ["Place text, rodata, data, bss, heap and stack", "Explain startup copying and clearing", "Estimate memory before the linker rejects the build"],
      sections: [
        { heading: "The common sections", html: `<div class="concept-grid"><div class="concept-card"><b>.text / .rodata</b><span>Instructions and constants live in nonvolatile Flash.</span></div><div class="concept-card"><b>.data</b><span>Initialized globals run in RAM; initial bytes are stored in Flash.</span></div><div class="concept-card"><b>.bss</b><span>Zero-initialized globals occupy RAM but need no bytes in the image.</span></div><div class="concept-card"><b>Stack</b><span>Call frames and automatic variables grow and shrink at runtime.</span></div></div>` },
        { heading: "Why embedded teams fear unbounded allocation", html: `<p>A heap can fragment, allocation can fail, and execution time can vary. Static allocation is not automatically superior, but it makes capacity visible. For a tiny UI, a fixed task table and bounded event queue are excellent first designs.</p>` },
        { heading: "Read the map file", html: `<p>The ELF map answers which symbol consumed Flash, which object consumed RAM, and where every section landed. Make memory reports part of the build rather than waiting for a late surprise.</p>` }
      ],
      example: { title: "Lifetime is not scope", code: `static uint8_t frame_line[160 * 2]; // program lifetime, RAM\n\nvoid draw(void)\n{\n    uint8_t command[4];           // block scope, stack lifetime\n    static uint32_t frame_count;  // block scope, program lifetime\n    (void)command;\n    frame_count++;\n}`, note: "Scope controls naming; storage duration controls lifetime." },
      quiz: { q: "Where does an initialized global variable run?", options: ["Only in Flash", "In RAM, with initial bytes copied from Flash", "Only on the stack", "In the CPU registers forever"], answer: 1, why: "Startup copies its initial image from Flash into the .data region in RAM." }
    },
    {
      id: "architecture", category: "The MCU", title: "CPU core and microcontroller anatomy", time: "25 min", level: "Core", source: "Chapter 2, pp. 94-179",
      lede: "A CPU core defines instruction execution; a microcontroller surrounds it with memory, clocks, pins, timers, converters and communication peripherals.",
      objectives: ["Separate CPU, bus and peripheral responsibilities", "Understand the vector table and NVIC", "Navigate a reference manual without guessing"],
      sections: [
        { heading: "Core versus microcontroller", html: `<p>Arm defines the Cortex-M instruction set, registers, exception model, SysTick and NVIC behavior. Chip vendors surround that core with Flash, SRAM, GPIO, timers, converters, radios and their own peripheral register maps. Core concepts transfer; exact addresses and bit fields come from the chosen microcontroller's reference manual.</p>` },
        { heading: "Buses connect the machine", html: `<p>The CPU issues loads and stores. The bus fabric routes them to Flash, SRAM or a peripheral. Clock gating can make a peripheral inaccessible even when its address is correct, which is why initialization often begins in RCC.</p><div class="flow"><span>CPU load/store</span><i>→</i><span>AHB/APB bus</span><i>→</i><span>peripheral register</span><i>→</i><span>pin/signal</span></div>` },
        { heading: "Documents have different jobs", html: `<ul><li><b>Datasheet:</b> package pins, electrical limits and device variants.</li><li><b>Reference manual:</b> peripheral behavior and registers.</li><li><b>Programming manual:</b> Cortex-M core and instruction details.</li><li><b>Board schematic:</b> what your particular PCB connects to each pin.</li></ul>` }
      ],
      example: { title: "CMSIS register structure", code: `// Conceptual form used by vendor headers\ntypedef struct {\n    volatile uint32_t MODER;\n    volatile uint32_t OTYPER;\n    volatile uint32_t OSPEEDR;\n    volatile uint32_t PUPDR;\n} GPIO_Registers;\n\n#define GPIOA ((GPIO_Registers *)0x48000000U)`, note: "CMSIS names preserve the direct memory access while removing magic offsets from application code." },
      quiz: { q: "Where should you look for the legal voltage on a GPIO pin?", options: ["Linker script", "Datasheet electrical characteristics", "C standard", "Startup assembly"], answer: 1, why: "Electrical limits are device and package properties documented in the datasheet." }
    },
    {
      id: "gpio", category: "The MCU", title: "GPIO from clock to pin", time: "24 min", level: "Hands-on", source: "Ch. 1.4; Ch. 2.2 and 2.4; Ch. 4.5-4.8",
      lede: "A GPIO bug is usually one missing step: clock, mode, pull, output type, speed, alternate function, or board wiring.",
      objectives: ["Configure a push-pull output and pulled input", "Explain active-high and active-low", "Debounce a physical button as a state machine"],
      sections: [
        { heading: "Initialization order", html: `<ol><li>Enable the GPIO port clock.</li><li>Select input, output, alternate or analog mode.</li><li>Choose push-pull/open-drain, pull resistor and speed.</li><li>Set the initial output before exposing the pin if glitches matter.</li><li>For peripheral pins, select the correct alternate function.</li></ol>` },
        { heading: "Electrical behavior is part of software", html: `<p>Push-pull actively drives high and low. Open-drain actively pulls low and needs a pull-up for high; this lets multiple devices safely share a line. A pull resistor prevents an unconnected input from floating.</p>` },
        { heading: "Debouncing is temporal filtering", html: `<p>A mechanical switch can produce many transitions during one press. Sample it periodically, require a stable state for a chosen interval, and emit one logical event. Avoid burying a long delay inside the button interrupt.</p>` }
      ],
      example: { title: "Non-blocking debounce core", code: `typedef struct {\n    bool stable;\n    bool candidate;\n    uint32_t changed_at_ms;\n} button_t;\n\nbool button_update(button_t *b, bool raw, uint32_t now)\n{\n    if (raw != b->candidate) {\n        b->candidate = raw;\n        b->changed_at_ms = now;\n    }\n    if (raw != b->stable && now - b->changed_at_ms >= 20U) {\n        b->stable = raw;\n        return true;\n    }\n    return false;\n}`, note: "Unsigned subtraction remains correct when the millisecond counter wraps." },
      quiz: { q: "Why do many MCUs require a GPIO peripheral clock first?", options: ["To brighten the LED", "Clock-gated peripheral logic cannot operate", "To allocate stack memory", "To enable C pointers"], answer: 1, why: "Many microcontrollers gate unused peripheral clocks to save power." }
    },
    {
      id: "design", category: "Software design", title: "Modules, contracts and BSPs", time: "22 min", level: "Core", source: "Ch. 3.1-3.4, pp. 182-221",
      lede: "Good firmware architecture isolates reasons to change: board wiring, device protocol, policy, and presentation.",
      objectives: ["Design a narrow header contract", "Separate board support from device drivers", "Keep application policy out of interrupt handlers"],
      sections: [
        { heading: "Four useful layers", html: `<div class="concept-grid"><div class="concept-card"><b>BSP</b><span>Which MCU pin and peripheral connect to the board hardware.</span></div><div class="concept-card"><b>Driver</b><span>How a device protocol works: commands, status and transfers.</span></div><div class="concept-card"><b>Service</b><span>Reusable policy such as events, time or display composition.</span></div><div class="concept-card"><b>Application</b><span>What the product should do for the user.</span></div></div>` },
        { heading: "Headers are contracts", html: `<p>Expose operations and types clients need, not internal registers or buffers. Keep module state <code>static</code> in the implementation. A smaller public surface is easier to test and harder to misuse.</p>` },
        { heading: "Dependency direction", html: `<p>The calculator app may call UI services; UI may call drawing primitives; drawing may call the ST7735 driver; the driver may call the SPI BSP. The low layer must not call back into calculator policy.</p>` }
      ],
      example: { title: "A narrow display contract", code: `// display.h\nvoid display_init(void);\nvoid display_fill(uint16_t rgb565);\nvoid display_rect(int x, int y, int w, int h, uint16_t color);\n\n// Hardware handles and controller commands stay private in display.c.`, note: "The application asks for pixels, not SPI registers." },
      quiz: { q: "Where should the TFT chip-select pin mapping live?", options: ["Calculator app", "Board-support layer", "Font table", "Scheduler"], answer: 1, why: "Pin mapping is a property of the board wiring." }
    },
    {
      id: "fsm", category: "Software design", title: "Finite state machines", time: "25 min", level: "Core", source: "Ch. 3.5, pp. 222-236",
      lede: "State machines turn scattered flags into an explicit model of what can happen next.",
      objectives: ["Define states, events, guards and actions", "Implement a switch-based FSM", "Model UI navigation without blocking loops"],
      sections: [
        { heading: "State captures necessary history", html: `<p>A button event means different things on the home screen and inside settings. The current state is the minimum history required to interpret the next event. Transitions specify the legal changes.</p>` },
        { heading: "Moore and Mealy thinking", html: `<p>A Moore-style output depends on current state; a Mealy-style action depends on state plus the incoming event. You do not need the terminology to code well, but it helps separate persistent presentation from one-time transition actions.</p>` },
        { heading: "Make impossible states impossible", html: `<p>One enum with five valid states is safer than five booleans that permit 32 combinations. Add a default recovery path for corrupted or newly added values.</p>` }
      ],
      example: { title: "UI navigation FSM", code: `typedef enum { UI_HOME, UI_MENU, UI_SETTINGS } ui_state_t;\ntypedef enum { EVT_SELECT, EVT_BACK, EVT_NEXT } ui_event_t;\n\nvoid ui_dispatch(ui_event_t event)\n{\n    switch (state) {\n    case UI_HOME:     if (event == EVT_SELECT) state = UI_MENU; break;\n    case UI_MENU:     if (event == EVT_BACK) state = UI_HOME;\n                      else if (event == EVT_SELECT) state = UI_SETTINGS; break;\n    case UI_SETTINGS: if (event == EVT_BACK) state = UI_MENU; break;\n    default:           state = UI_HOME; break;\n    }\n}`, note: "Rendering can be a separate function of state, making navigation easy to test." },
      quiz: { q: "Why prefer one enum state over several state booleans?", options: ["Enums use no memory", "It restricts the model to declared valid states", "Switch is always faster", "Interrupts require enums"], answer: 1, why: "Multiple booleans create unintended combinations that an enum excludes." }
    },
    {
      id: "fifo", category: "Software design", title: "Queues and data ownership", time: "25 min", level: "Intermediate", source: "Ch. 3.6-3.7; Ch. 5.1-5.3, pp. 237-250 and 345-364",
      lede: "A bounded FIFO lets fast interrupt producers and slower foreground consumers meet without sharing every detail.",
      objectives: ["Implement a circular queue", "Define full and empty behavior", "Reason about single-producer/single-consumer ownership"],
      sections: [
        { heading: "Head and tail encode ownership", html: `<p>The producer writes at <code>head</code> then advances it. The consumer reads at <code>tail</code> then advances it. Modulo or a power-of-two mask wraps indices around fixed storage.</p>` },
        { heading: "Overflow is a product decision", html: `<p>When full, should new data be dropped, old data overwritten, the producer blocked, or an error counted? There is no universal answer. The worst answer is silent, undefined behavior.</p>` },
        { heading: "Communication beats shared mutation", html: `<p>An ISR can enqueue a compact event and return. Foreground code owns the UI state and processes the event later. That sharply reduces critical sections.</p>` }
      ],
      example: { title: "Power-of-two byte FIFO", code: `#define Q_CAPACITY 16U\ntypedef struct { uint8_t data[Q_CAPACITY]; uint8_t head, tail; } fifo_t;\n\nbool fifo_put(fifo_t *q, uint8_t value)\n{\n    uint8_t next = (q->head + 1U) & (Q_CAPACITY - 1U);\n    if (next == q->tail) return false;\n    q->data[q->head] = value;\n    q->head = next;\n    return true;\n}`, note: "This representation deliberately leaves one slot unused to distinguish full from empty." },
      quiz: { q: "What must be specified for every bounded queue?", options: ["A floating-point format", "Behavior when the queue is full", "A heap allocator", "USB descriptors"], answer: 1, why: "Capacity is finite, so overload behavior is part of the interface contract." }
    },
    {
      id: "time", category: "Real-time core", title: "Time, deadlines and SysTick", time: "26 min", level: "Core", source: "Ch. 2.5-2.6; Ch. 4.2; Ch. 5.7, pp. 169-174, 281-286 and 382-386",
      lede: "Real-time means correctness depends on both the result and when the result becomes available.",
      objectives: ["Separate latency, period, execution time and deadline", "Use a monotonic tick without blocking", "Handle counter wraparound correctly"],
      sections: [
        { heading: "Four different time questions", html: `<ul><li><b>Period:</b> how often should work be released?</li><li><b>Execution time:</b> how long does the CPU spend doing it?</li><li><b>Latency:</b> how long from event to response?</li><li><b>Deadline:</b> latest acceptable completion time?</li></ul>` },
        { heading: "A tick is a timestamp source", html: `<p>SysTick can interrupt every millisecond and increment a counter. Foreground tasks compare timestamps and return immediately when not due. Unlike <code>HAL_Delay()</code>, this keeps the CPU available for other work.</p>` },
        { heading: "Wraparound-safe comparisons", html: `<p>Unsigned subtraction gives correct elapsed time across wraparound. For deadline ordering within half the counter range, cast the difference to the matching signed type.</p><div class="callout"><strong>Measure, do not hope</strong>Toggle a spare GPIO around important work and inspect it with a logic analyzer. The pulse width is execution time; the offset from an input edge is latency.</div>` }
      ],
      example: { title: "Periodic release without drift", code: `bool deadline_reached(uint32_t now, uint32_t due)\n{\n    return (int32_t)(now - due) >= 0;\n}\n\nif (deadline_reached(now_ms, next_ms)) {\n    next_ms += period_ms; // schedule from the old deadline\n    sample_inputs();\n}`, note: "Scheduling from 'now' adds execution-time jitter to every future release." },
      quiz: { q: "Why schedule next_ms += period instead of next_ms = now + period?", options: ["To use less RAM", "To avoid accumulating execution-time drift", "To disable interrupts", "To reset SysTick"], answer: 1, why: "The intended timeline remains anchored to prior deadlines." }
    },
    {
      id: "sync", category: "Real-time core", title: "Hardware/software synchronization", time: "28 min", level: "Intermediate", source: "Chapter 4, pp. 274-340",
      lede: "Every peripheral conversation needs a rule for when data is valid and who may act next.",
      objectives: ["Compare blind delay, polling, interrupt and DMA synchronization", "Read status before touching data", "Choose a method from latency and CPU-budget needs"],
      sections: [
        { heading: "Four synchronization patterns", html: `<div class="concept-grid"><div class="concept-card"><b>Blind delay</b><span>Wait an assumed worst-case time. Simple but wasteful and fragile.</span></div><div class="concept-card"><b>Busy-wait</b><span>Poll a status flag. Precise but occupies the CPU.</span></div><div class="concept-card"><b>Interrupt</b><span>Hardware announces readiness. Good latency; adds shared-state concerns.</span></div><div class="concept-card"><b>DMA</b><span>A controller moves blocks while the CPU works elsewhere.</span></div></div>` },
        { heading: "Status creates a protocol", html: `<p>Transmit-ready means software may write the data register. Receive-ready means software may read it. Reading too early returns stale data; writing too early can overwrite a pending byte.</p>` },
        { heading: "Start simple, preserve the boundary", html: `<p>A blocking SPI transfer is excellent for the first solid-color TFT test. Keep it behind an interface so a later DMA implementation does not rewrite the UI.</p>` }
      ],
      example: { title: "Polling with a bounded timeout", code: `bool wait_ready(volatile uint32_t *status, uint32_t mask, uint32_t limit)\n{\n    while (((*status) & mask) == 0U) {\n        if (limit-- == 0U) return false;\n    }\n    return true;\n}`, note: "A timeout turns a disconnected peripheral into a reportable error instead of an eternal hang." },
      quiz: { q: "What is the main cost of busy-wait synchronization?", options: ["It cannot read registers", "The CPU cannot perform other foreground work", "It always loses data", "It requires dynamic allocation"], answer: 1, why: "Polling repeatedly consumes processor time until hardware becomes ready." }
    },
    {
      id: "interrupts", category: "Real-time core", title: "Interrupts and the NVIC", time: "32 min", level: "Intermediate", source: "Chapter 5, pp. 344-399",
      lede: "An interrupt is controlled preemption: hardware temporarily redirects execution to a handler through the vector table.",
      objectives: ["Trace exception entry and return", "Configure source, NVIC and handler", "Keep ISR work bounded and communicate safely"],
      sections: [
        { heading: "The complete interrupt path", html: `<div class="flow"><span>Hardware event</span><i>→</i><span>Peripheral pending flag</span><i>→</i><span>NVIC arbitration</span><i>→</i><span>Vector lookup</span><i>→</i><span>ISR</span><i>→</i><span>exception return</span></div><p>All links must be configured. Enabling only the NVIC cannot create a peripheral event; enabling only the peripheral leaves it pending but unserviced.</p>` },
        { heading: "ISR discipline", html: `<ul><li>Capture the minimum data needed.</li><li>Clear or acknowledge the interrupt source correctly.</li><li>Update a flag/counter or enqueue an event.</li><li>Return quickly; do formatting, drawing and policy later.</li></ul>` },
        { heading: "Priority and critical sections", html: `<p>Lower numerical priority values are often logically higher on Cortex-M, but implemented priority bits vary. A critical section should protect a specific invariant for the shortest possible time—not become a blanket solution.</p><div class="callout warning"><strong>Classic bug</strong>A non-volatile flag set only by an ISR may be cached by the optimizer. Volatile fixes visibility, but compound shared operations may still need atomicity.</div>` }
      ],
      example: { title: "Defer work out of the ISR", code: `static volatile bool button_event;\n\nvoid EXTI0_IRQHandler(void)\n{\n    clear_exti0_pending();\n    button_event = true;\n}\n\nvoid foreground_run(void)\n{\n    if (button_event) {\n        button_event = false;\n        ui_dispatch(EVT_SELECT);\n    }\n}`, note: "For repeated events, use a counter or queue so two presses cannot collapse into one boolean." },
      quiz: { q: "Which task does not belong in a button ISR?", options: ["Clear the pending flag", "Capture an event", "Render an entire TFT screen", "Return"], answer: 2, why: "Long display transfers inflate latency for every interrupt at the same or lower priority." }
    },
    {
      id: "scheduler", category: "Real-time core", title: "From superloop to tiny OS", time: "30 min", level: "Intermediate", source: "Ch. 3.6; Ch. 5.1-5.3 and 5.7",
      lede: "A cooperative scheduler adds explicit release times and task boundaries while remaining understandable in ordinary C.",
      objectives: ["Explain cooperative versus preemptive scheduling", "Build a fixed periodic task table", "State the response-time limitation of cooperative tasks"],
      sections: [
        { heading: "Cooperation first", html: `<p>Each task runs until it returns. There are no separate stacks and no involuntary context switches. The worst delay before an urgent task runs includes the longest other task execution, so every task must stay bounded.</p>` },
        { heading: "What makes it OS-shaped", html: `<p>The scheduler owns time-based release policy, task registration and dispatch. Drivers own devices. Apps own product behavior. This separation is more valuable than merely calling the loop an OS.</p>` },
        { heading: "When preemption earns its complexity", html: `<p>Use preemption when independent work has deadlines that cooperative execution cannot meet, or when blocking APIs must coexist. Then learn per-task stacks, context save/restore, priorities, races and priority inversion deliberately.</p>` }
      ],
      example: { title: "Cooperative dispatcher", code: `for (;;) {\n    uint32_t now = timer_now_ms();\n    for (size_t i = 0; i < task_count; ++i) {\n        if ((int32_t)(now - tasks[i].next_ms) >= 0) {\n            tasks[i].next_ms += tasks[i].period_ms;\n            tasks[i].run(tasks[i].context);\n        }\n    }\n}`, note: "This is the central idea of a small cooperative scheduler: ready tasks run to completion and return control to the dispatcher." },
      quiz: { q: "What determines worst-case dispatch delay in a cooperative scheduler?", options: ["Flash size only", "The longest non-returning task execution", "Variable names", "The UART baud rate only"], answer: 1, why: "A due task cannot run until the current cooperative task returns." }
    },
    {
      id: "timers", category: "Time & control", title: "Hardware timers and capture", time: "30 min", level: "Intermediate", source: "Ch. 6.1-6.2 and 6.4, pp. 400-424 and 429-436",
      lede: "General-purpose timers measure edges and create deadlines without spending CPU cycles counting loops.",
      objectives: ["Relate timer clock, prescaler and auto-reload", "Measure period with input capture", "Generate periodic events with compare/update"],
      sections: [
        { heading: "A configurable hardware counter", html: `<p>A prescaler divides the timer input clock; the counter advances; auto-reload sets the wrap period. Compare channels trigger when the counter matches a programmed value. Capture channels snapshot the counter when an input edge arrives.</p>` },
        { heading: "Derive settings with units", html: `<p>For a timer clock <i>f</i>, tick frequency is <code>f / (PSC + 1)</code>. Update frequency is then <code>tick / (ARR + 1)</code>. Derive these equations and check the clock tree instead of pasting magic constants.</p>` },
        { heading: "Frequency measurement", html: `<p>Capture two successive edges. Their modular counter difference is the signal period in timer ticks. Average multiple periods for resolution, but remember averaging increases response delay.</p>` }
      ],
      example: { title: "Capture difference with wraparound", code: `uint32_t period_ticks(uint16_t previous, uint16_t current)\n{\n    return (uint16_t)(current - previous);\n}\n\nfloat frequency_hz(uint32_t timer_hz, uint32_t ticks)\n{\n    return (ticks == 0U) ? 0.0f : (float)timer_hz / ticks;\n}`, note: "Casting the subtraction to the timer width naturally applies modular arithmetic." },
      quiz: { q: "What does input capture hardware store on an edge?", options: ["The whole program", "The current timer counter value", "A UART string", "The stack pointer only"], answer: 1, why: "That timestamp lets software compute edge-to-edge intervals accurately." }
    },
    {
      id: "pwm", category: "Time & control", title: "PWM and actuators", time: "28 min", level: "Intermediate", source: "Ch. 6.3 and 6.5-6.6, pp. 425-452",
      lede: "Pulse-width modulation controls average energy while the output pin remains digitally high or low.",
      objectives: ["Separate PWM frequency from duty cycle", "Choose safe actuator drive hardware", "Recognize the software boundary of a feedback controller"],
      sections: [
        { heading: "Frequency and duty are independent knobs", html: `<p>Auto-reload determines the period. A compare value determines how long the signal remains active within that period. Duty cycle is compare divided by period, with edge cases depending on the timer mode.</p>` },
        { heading: "Pins do not power loads", html: `<p>Motors, solenoids and high-power LEDs require a transistor/driver, current limiting and often a flyback path. Firmware can command safe limits but cannot compensate for an unsafe circuit.</p>` },
        { heading: "Closed-loop control", html: `<p>A controller samples a measurement, compares it with a target and adjusts the actuator. Saturate outputs and consider integral windup. Fixed sample periods matter because controller coefficients encode time.</p>` }
      ],
      example: { title: "Bounded integral controller", code: `int32_t control_step(int32_t target, int32_t measured)\n{\n    static int32_t integral;\n    int32_t error = target - measured;\n    integral = clamp(integral + error, -5000, 5000);\n    return clamp(KP * error + KI * integral, 0, PWM_MAX);\n}`, note: "Real coefficients need scaling and units; this sketch highlights saturation and persistent state." },
      quiz: { q: "What usually determines PWM duty cycle?", options: ["The compare value relative to the period", "The linker script", "The vector-table size", "The UART parity"], answer: 0, why: "Compare timing selects the active fraction of each PWM period." }
    },
    {
      id: "uart", category: "Communication", title: "UART: asynchronous bytes", time: "30 min", level: "Hands-on", source: "Ch. 4.9; Ch. 5.6; Ch. 7.1-7.4; Ch. 11.2",
      lede: "UART is the embedded engineer’s window: simple enough for first light, rich enough to teach framing, buffering and errors.",
      objectives: ["Describe start, data, parity and stop bits", "Calculate frame throughput", "Design interrupt-driven RX with a FIFO"],
      sections: [
        { heading: "No shared clock wire", html: `<p>Both endpoints agree on baud rate and frame format. A start bit creates alignment, data bits carry the value, optional parity detects some errors, and stop bits return the line idle.</p>` },
        { heading: "Baud is not payload throughput", html: `<p>At 115200 baud with 8-N-1, each byte consumes ten bit times, so maximum payload is about 11,520 bytes/s before higher-level protocol overhead.</p>` },
        { heading: "Receive in the background", html: `<p>The RX interrupt reads each ready byte into a FIFO. Foreground code parses complete messages. Record framing, overrun and queue-overflow errors; otherwise debugging a noisy link becomes folklore.</p>` }
      ],
      example: { title: "Tiny line protocol", code: `// Host sends: LED 1\\n\nvoid command_line(char *line)\n{\n    if (strcmp(line, "LED 1") == 0) led_set(true);\n    else if (strcmp(line, "LED 0") == 0) led_set(false);\n    else uart_write("ERR\\r\\n");\n}`, note: "Bound the line length and define what happens on malformed or partial input." },
      quiz: { q: "At 8-N-1, how many bit times does one byte typically consume?", options: ["8", "9", "10", "16"], answer: 2, why: "One start + eight data + one stop = ten bit times." }
    },
    {
      id: "spi", category: "Communication", title: "SPI and the TFT wire", time: "34 min", level: "Hands-on", source: "Ch. 7.5, pp. 484-496",
      lede: "SPI shifts one bit out while shifting one bit in; chip select and device-specific commands give those bits meaning.",
      objectives: ["Explain SCK, MOSI, MISO and CS", "Choose clock polarity and phase", "Separate transport from the ST7735 command protocol"],
      sections: [
        { heading: "Full-duplex shift registers", html: `<p>The controller produces SCK. On each edge, both devices shift bits. CPOL chooses idle clock level; CPHA chooses which edge samples data. A wrong mode often produces patterns that look almost correct.</p>` },
        { heading: "TFT adds DC and RESET", html: `<p>Many 1.8-inch modules use an ST7735-family controller. <b>CS</b> frames the transaction, <b>DC</b> marks command versus data, and <b>RESET</b> establishes a known controller state. Verify the actual module before coding offsets and initialization tables.</p>` },
        { heading: "Bandwidth shapes the UI", html: `<p>A 128×160 RGB565 frame contains 40,960 bytes. At 8 MHz, raw transmission alone takes about 41 ms, before commands and software overhead. Dirty rectangles and line buffers are architectural tools, not premature optimization.</p>` }
      ],
      example: { title: "Command/data boundary", code: `static void lcd_command(uint8_t command)\n{\n    gpio_write(LCD_DC, false);\n    gpio_write(LCD_CS, false);\n    spi_write(&command, 1U);\n    gpio_write(LCD_CS, true);\n}\n\nstatic void lcd_data(const uint8_t *data, size_t length)\n{\n    gpio_write(LCD_DC, true);\n    gpio_write(LCD_CS, false);\n    spi_write(data, length);\n    gpio_write(LCD_CS, true);\n}`, note: "Later, spi_write can use DMA without changing the controller command layer." },
      quiz: { q: "What does the TFT DC pin usually distinguish?", options: ["Power and ground", "Command bytes and data bytes", "MOSI and MISO", "Flash and RAM"], answer: 1, why: "The display controller needs to know whether a byte names an operation or supplies its parameters/pixels." }
    },
    {
      id: "i2c", category: "Communication", title: "I²C: shared addressed bus", time: "30 min", level: "Intermediate", source: "Ch. 7.6, pp. 497-515",
      lede: "I²C trades raw throughput for two-wire addressing and easy multi-device wiring.",
      objectives: ["Explain open-drain SDA/SCL and pull-ups", "Trace start, address, ACK, data and stop", "Recover from NACK, timeout and a stuck bus"],
      sections: [
        { heading: "Wired-AND signaling", html: `<p>Devices only pull SDA and SCL low; resistors return them high. This allows arbitration and clock stretching without two outputs fighting. Rise time depends on pull-up resistance and bus capacitance.</p>` },
        { heading: "A transaction is a conversation", html: `<div class="flow"><span>START</span><i>→</i><span>address + R/W</span><i>→</i><span>ACK</span><i>→</i><span>data</span><i>→</i><span>ACK/NACK</span><i>→</i><span>STOP</span></div>` },
        { heading: "Seven-bit address confusion", html: `<p>Datasheets may show a seven-bit address or the already-shifted address byte. Name your API contract explicitly. Log NACKs and bound every wait so a missing sensor cannot freeze the UI.</p>` }
      ],
      example: { title: "Register-read intent", code: `bool sensor_read(uint8_t address_7bit, uint8_t reg,\n                 uint8_t *result, size_t length)\n{\n    if (!i2c_write(address_7bit, &reg, 1U, false)) return false;\n    return i2c_read(address_7bit, result, length, true);\n}`, note: "The repeated-start behavior belongs in the transport API contract." },
      quiz: { q: "Why do SDA and SCL need pull-up resistors?", options: ["I²C devices normally only pull the lines low", "To increase Flash", "To enable DMA", "To generate PWM"], answer: 0, why: "Open-drain outputs release high rather than actively driving it." }
    },
    {
      id: "analog", category: "Signals", title: "ADC, DAC and analog reality", time: "34 min", level: "Intermediate", source: "Chapter 8, pp. 530-594",
      lede: "Digital code meets a continuous world through references, sampling, quantization and analog front ends.",
      objectives: ["Convert ADC codes to engineering units", "Recognize source impedance and acquisition-time effects", "Use filtering without hiding signal dynamics"],
      sections: [
        { heading: "Quantization", html: `<p>An N-bit ADC divides its input range into approximately <code>2^N</code> codes. The reference voltage defines the scale; reference error becomes measurement error. Never claim more meaningful digits than the system supports.</p>` },
        { heading: "The pin sees a circuit", html: `<p>The ADC sample capacitor must charge through the sensor and any filter resistance. High source impedance may require a longer sample time or buffer amplifier. Clamp voltages and respect absolute maximum ratings.</p>` },
        { heading: "Filtering and calibration", html: `<p>A moving average reduces high-frequency noise but adds delay. Calibration corrects repeatable offset and gain errors. Neither can repair aliasing caused by sampling too slowly.</p>` }
      ],
      example: { title: "Integer moving average", code: `#define WINDOW 8U\nstatic uint16_t samples[WINDOW];\nstatic uint32_t sum;\nstatic uint8_t index;\n\nuint16_t filter(uint16_t newest)\n{\n    sum -= samples[index];\n    samples[index] = newest;\n    sum += newest;\n    index = (index + 1U) & (WINDOW - 1U);\n    return (uint16_t)(sum / WINDOW);\n}`, note: "A running sum makes each update constant time; use a wide enough accumulator." },
      quiz: { q: "What sets the voltage represented by one ADC code?", options: ["Only the CPU clock", "Resolution and reference/input range", "The C variable name", "UART parity"], answer: 1, why: "Quantization step is determined by the analog range divided across the available codes." }
    },
    {
      id: "noise", category: "Signals", title: "Sampling, sensors and noise", time: "32 min", level: "Intermediate", source: "Chapter 10, pp. 619-680",
      lede: "A data-acquisition system is a chain; its weakest bandwidth, noise or calibration link limits the final measurement.",
      objectives: ["Build an end-to-end measurement error budget", "Explain aliasing and sample-rate selection", "Distinguish precision, accuracy, resolution and repeatability"],
      sections: [
        { heading: "The complete acquisition chain", html: `<div class="flow"><span>Physical quantity</span><i>→</i><span>transducer</span><i>→</i><span>conditioning</span><i>→</i><span>ADC</span><i>→</i><span>calibration</span><i>→</i><span>decision/UI</span></div>` },
        { heading: "Noise enters everywhere", html: `<p>Power supplies, ground currents, radio activity, switching edges, thermal noise and software timing can all affect measurements. Improve layout and references before asking software to average harder.</p>` },
        { heading: "Sample with intent", html: `<p>Sampling must be fast enough for the signal after analog anti-alias filtering. Timestamp samples if timing matters. Record saturation and missing samples; a plausible number is not always a valid number.</p>` }
      ],
      example: { title: "Calibrated fixed-point value", code: `// gain_q16 is a Q16.16 scale factor\nint32_t calibrate(int32_t raw, int32_t offset, int32_t gain_q16)\n{\n    int64_t corrected = (int64_t)(raw - offset) * gain_q16;\n    return (int32_t)(corrected >> 16);\n}`, note: "A 64-bit intermediate prevents overflow while retaining fractional precision." },
      quiz: { q: "Can digital averaging remove aliased frequencies?", options: ["Always", "No; aliasing must be prevented before/while sampling", "Only with volatile", "Only on Cortex-M4"], answer: 1, why: "Once different analog frequencies map to the same samples, the original distinction is lost." }
    },
    {
      id: "power", category: "System engineering", title: "Power and low-power firmware", time: "28 min", level: "Intermediate", source: "Ch. 5.8; Ch. 9.2-9.3, pp. 387-388 and 599-609",
      lede: "Low power is a system budget involving clock rate, active time, peripherals, radios, regulators and wakeup policy.",
      objectives: ["Estimate average current from duty cycle", "Choose sleep and wake sources", "Avoid polling that defeats sleep"],
      sections: [
        { heading: "Average, not headline current", html: `<p>If the MCU draws 8 mA for 5 ms and 20 µA for the remaining 995 ms, average current is approximately 60 µA. Measure the real board because regulators, LEDs and sensors may dominate.</p>` },
        { heading: "Race to sleep", html: `<p>Often the efficient design finishes bounded work quickly, disables unused clocks and sleeps until an interrupt. A forever polling loop keeps the core active even when nothing changes.</p>` },
        { heading: "Wakeup is architecture", html: `<p>Decide which state survives sleep, which clocks restart, how long the display takes to wake, and whether the radio core has shared-memory constraints. Test brownouts and partial initialization.</p>` }
      ],
      example: { title: "Event-driven idle", code: `for (;;) {\n    scheduler_run_ready();\n\n    __disable_irq();\n    if (!events_pending()) {\n        __DSB();\n        __WFI();\n    }\n    __enable_irq();\n}`, note: "Sleep entry has race details; use the MCU/HAL-recommended sequence for production." },
      quiz: { q: "Why can an empty polling loop waste power?", options: ["It erases Flash", "It keeps the CPU executing instead of sleeping", "It disables GPIO permanently", "It increases ADC resolution"], answer: 1, why: "Dynamic power is consumed while the core repeatedly checks unchanged state." }
    },
    {
      id: "debug", category: "System engineering", title: "Debugging with evidence", time: "30 min", level: "All levels", source: "Ch. 3.9; Ch. 5.9; Ch. 9.4, pp. 255-268, 389 and 610-611",
      lede: "Debugging is experimental science: form a falsifiable explanation, choose an observation, and reduce uncertainty.",
      objectives: ["Use breakpoints, watchpoints and fault state", "Instrument time without changing behavior too much", "Build observability into module interfaces"],
      sections: [
        { heading: "Start at the boundary", html: `<p>For a dark TFT: verify supply voltage, reset, backlight, clock, chip select, command/data and MOSI—in that order. Software inspection cannot prove a physical edge occurred.</p>` },
        { heading: "Faults leave clues", html: `<p>On HardFault, preserve stacked registers and SCB fault-status registers. The program counter often identifies the failing instruction. A permanent empty loop throws away evidence unless the debugger catches it.</p>` },
        { heading: "Instrumentation has cost", html: `<p>UART logging can block and alter timing. A GPIO pulse is cheap and visible on a scope. A memory event trace is fast but finite. Choose an instrument whose disturbance is smaller than the behavior being measured.</p>` }
      ],
      example: { title: "Assertion for firmware", code: `#define REQUIRE(condition) do {          \\\n    if (!(condition)) {                  \\\n        fault_record(__FILE__, __LINE__);\\\n        __BKPT(0);                       \\\n        for (;;) {}                      \\\n    }                                    \\\n} while (0)`, note: "In production, store a compact fault code and reset safely instead of relying only on a debugger." },
      quiz: { q: "What should you check first when no SPI waveform appears?", options: ["Font kerning", "Power/clock/pin/peripheral configuration", "Calculator algorithm", "Heap fragmentation"], answer: 1, why: "Debug from the physical and peripheral boundary before investigating higher UI layers." }
    },
    {
      id: "production", category: "System engineering", title: "Designing a product, not a demo", time: "34 min", level: "Advanced", source: "Chapter 9, pp. 595-618; Ch. 1.3 and 1.6",
      lede: "A demo works once on your desk. A product must tolerate manufacturing variation, users, faults, updates and years of operation.",
      objectives: ["Turn requirements into measurable specifications", "Design for testability and safe failure", "Consider tolerance, ethics and maintenance"],
      sections: [
        { heading: "Requirements must be testable", html: `<p>“Fast UI” is vague. “Button press changes the highlighted item within 50 ms at 3.0–3.6 V and −10–50 °C” creates a test. Include timing, voltage, current, accuracy, environment and failure response.</p>` },
        { heading: "Design for manufacturing and test", html: `<p>Add accessible programming/debug pads, test points, board identification and a factory self-test. Validate the correct TFT variant and pin map. A serial-numbered result record is cheaper than investigating mystery returns.</p>` },
        { heading: "Failure and ethics", html: `<p>Watchdogs, brownout reset, CRCs and range checks are technical choices with human consequences. Report uncertainty honestly, preserve safety limits, and never convert a sensor fault into a confident-looking number.</p>` }
      ],
      example: { title: "Explicit health state", code: `typedef enum {\n    HEALTH_OK,\n    HEALTH_SENSOR_TIMEOUT,\n    HEALTH_DISPLAY_FAULT,\n    HEALTH_LOW_BATTERY\n} health_t;\n\nvoid system_enter_safe_state(health_t reason);`, note: "A named failure model lets the UI, logger and recovery policy agree." },
      quiz: { q: "Which is a testable requirement?", options: ["The UI should feel nice", "The menu highlight updates within 50 ms of a valid press", "Use good code", "The battery should last long"], answer: 1, why: "It defines an event, observable result and measurable time bound." }
    },
    {
      id: "tft-ui", category: "Applied projects", title: "From pixels to a small TFT interface", time: "38 min", level: "Project", source: "General embedded display architecture",
      lede: "A maintainable UI is a pipeline from events and state to drawing commands—not application code poking SPI directly.",
      objectives: ["Layer TFT transport, controller, graphics and widgets", "Use RGB565 and bounded buffers", "Render only changed regions"],
      sections: [
        { heading: "The display stack", html: `<div class="flow"><span>App state</span><i>→</i><span>Widget/layout</span><i>→</i><span>graphics primitives</span><i>→</i><span>ST7735 windows</span><i>→</i><span>SPI BSP</span></div><p>Each layer has one reason to change. A new board changes SPI pins; a new panel changes controller offsets; a new theme changes widget colors.</p>` },
        { heading: "Memory-aware rendering", html: `<p>A full 128×160 RGB565 framebuffer needs 40,960 bytes. Whether that fits comfortably depends on the selected MCU and what else shares RAM. A line buffer needs only 256–320 bytes. Immediate drawing uses even less RAM but can flicker if updates are not ordered.</p>` },
        { heading: "Dirty regions", html: `<p>When the clock changes, redraw its bounding rectangle rather than the entire screen. Widgets mark themselves dirty when model state changes; the render task combines or clips regions and sends only those pixels.</p>` }
      ],
      example: { title: "RGB565 conversion", code: `uint16_t rgb565(uint8_t r, uint8_t g, uint8_t b)\n{\n    return (uint16_t)(((r & 0xF8U) << 8) |\n                      ((g & 0xFCU) << 3) |\n                       (b >> 3));\n}`, note: "Red and blue use 5 bits; green uses 6 because human vision is more sensitive there." },
      quiz: { q: "How much RAM does a 128×160 RGB565 framebuffer require?", options: ["20,480 bytes", "40,960 bytes", "128 bytes", "160 KB exactly"], answer: 1, why: "128 × 160 pixels × 2 bytes per pixel = 40,960 bytes." }
    }
  ]
};
