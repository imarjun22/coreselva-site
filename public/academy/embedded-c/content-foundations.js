/*
 * Slow-start C pathway and missing deep-dive topics.
 * These lessons are deliberately placed before the earlier embedded pathway.
 */
const FOUNDATION_LESSONS = [
  {
    id: "course-welcome", category: "Start from zero", title: "Welcome: what you are about to build", time: "20 min", level: "No experience needed", source: "Course orientation",
    lede: "You do not need prior electronics, C, or microcontroller knowledge. You do need patience, curiosity, and the habit of testing what you think you understand.",
    objectives: ["Describe the course journey", "Know what software and hardware you need", "Adopt a professional learning loop from day one"],
    sections: [
      { heading: "From blank screen to physical machine", html: `<p>Ordinary C lessons begin with numbers and text. We will begin there too. Then we will follow those same ideas into memory addresses, hardware registers, timers, communication buses, displays, real-time scheduling, and finally a small operating-system-shaped UI.</p><p>The depth is not removed for beginners. It is <b>sequenced</b>. Every advanced idea is built from a smaller idea you have already used.</p>` },
      { heading: "How each lesson works", html: `<div class="concept-grid"><div class="concept-card"><b>Model</b><span>Build a clear mental picture before memorizing syntax.</span></div><div class="concept-card"><b>Trace</b><span>Walk through values and control flow by hand.</span></div><div class="concept-card"><b>Compile</b><span>Ask the real compiler what is valid and inspect warnings.</span></div><div class="concept-card"><b>Transfer</b><span>Use the idea in a slightly unfamiliar problem.</span></div></div>` },
      { heading: "Your laboratory notebook", html: `<p>For each experiment, write the question, prediction, change, observation, and explanation. “It works” is an observation, not an explanation. A professional asks which instruction, register bit, signal, or timing relationship made it work.</p><div class="callout"><strong>Course rule</strong>Never paste code you cannot explain line by line. Small understood programs beat large mysterious ones.</div>` },
      { heading: "Two worlds, one language", html: `<p>The built-in lab can compile and run normal C with native GCC. It can also compile freestanding code for an Arm Cortex-M4 and show the generated assembly. Early lessons use the native target for immediate output; embedded lessons explain which parts are portable and which must be adapted to a chosen microcontroller.</p>` }
    ],
    examples: [
      { title: "Your first complete C program", code: `#include <stdio.h>\n\nint main(void)\n{\n    printf("Hello, world!\\n");\n    return 0;\n}`, note: "Build this with a local C toolchain. Change the message, introduce a missing semicolon, and read the diagnostic." },
      { title: "A prediction experiment", code: `#include <stdio.h>\n\nint main(void)\n{\n    int value = 4;\n    value = value + 3;\n    printf("value = %d\\n", value);\n    return 0;\n}`, note: "Predict the output before running it. That habit becomes essential when hardware is attached." }
    ],
    practice: ["Run both programs and identify every punctuation mark the compiler cares about.", "Change the second program so it prints 21 using two operations.", "Write one sentence explaining the difference between source code and program output."],
    quiz: { q: "What is the main purpose of compiling an example during learning?", options: ["To avoid thinking", "To test a precise prediction against the language implementation", "To make the file larger", "To hide errors"], answer: 1, why: "Compilation and execution give evidence, but you still need a model and explanation." }
  },
  {
    id: "computer-basics", category: "Start from zero", title: "What a computer actually does", time: "28 min", level: "Beginner", source: "Book Ch. 1.1-1.2, pp. 17-34",
    lede: "Before C syntax, meet the machine C controls: processor, memory, inputs, outputs, and a clock coordinating tiny state changes.",
    objectives: ["Distinguish CPU, memory and peripheral", "Explain instruction fetch and execution", "Relate bits to physical and logical state"],
    sections: [
      { heading: "Five cooperating pieces", html: `<p>The <b>CPU</b> executes instructions. <b>Flash</b> remembers the program without power. <b>RAM</b> holds changing working data. <b>Peripherals</b> connect computation to timers, pins and communication. <b>Buses</b> carry addresses, data and control between them.</p>` },
      { heading: "The fetch-decode-execute rhythm", html: `<p>A program counter identifies the next instruction. The CPU fetches its encoded bits, decodes the operation, executes it, then chooses the next address. A branch changes that address; a function call also preserves where execution should return.</p><div class="flow"><span>fetch</span><i>→</i><span>decode</span><i>→</i><span>execute</span><i>→</i><span>next PC</span></div>` },
      { heading: "Bits are context-dependent", html: `<p>The same pattern <code>01000001</code> can mean decimal 65, the letter A, part of an instruction, or eight hardware flags. Bits have representation; software and hardware agreements give them meaning.</p>` },
      { heading: "Why microcontrollers feel different", html: `<p>A desktop operating system loads programs, manages files, and prints to a terminal. On a bare microcontroller, your firmware may be the only software. You configure the clock, decide what an input means, and define what happens forever after <code>main()</code> starts.</p>` }
    ],
    examples: [
      { title: "State changes one instruction at a time", code: `int a = 5;      // reserve storage and place 5 there\nint b = 2;      // reserve different storage\nint sum = a + b;// load a and b, add, store the result`, note: "The source is compact; the CPU needs multiple loads, arithmetic, and stores." },
      { title: "One byte, several meanings", code: `#include <stdio.h>\n\nint main(void)\n{\n    unsigned char bits = 0x41;\n    printf("number: %u, character: %c\\n", bits, bits);\n}`, note: "The bits do not change; the formatting instruction changes their interpretation." }
    ],
    practice: ["Draw CPU, Flash, RAM and GPIO as boxes and add arrows for a pin write.", "Explain why RAM loses changing variables after power removal.", "Run the byte example with 0x42, 0x30 and 0x0A."],
    quiz: { q: "Which component normally stores changing variables while a program runs?", options: ["RAM", "A GPIO pin", "The compiler", "A resistor"], answer: 0, why: "RAM provides fast volatile storage for working state." }
  },
  {
    id: "tools-first-program", category: "C language", title: "Compiler, linker and first program", time: "32 min", level: "Beginner", source: "C toolchain foundation",
    lede: "A C source file is not executable. Learn the transformation pipeline and make compiler messages part of the conversation.",
    objectives: ["Separate preprocessing, compilation, assembly and linking", "Read a basic compiler diagnostic", "Build and run a console program"],
    sections: [
      { heading: "Four transformations", html: `<ol><li>The <b>preprocessor</b> handles directives such as <code>#include</code> and macros.</li><li>The <b>compiler</b> checks C and emits assembly.</li><li>The <b>assembler</b> produces machine-code object files.</li><li>The <b>linker</b> combines objects and libraries, resolving symbol references.</li></ol>` },
      { heading: "Warnings are engineering feedback", html: `<p>An error prevents translation. A warning reports legal or recoverable code that is probably not what you intended. Build with <code>-Wall -Wextra -Wpedantic</code>, understand every warning, and avoid simply silencing them.</p>` },
      { heading: "main is a contract", html: `<p>In a hosted program, the runtime calls <code>main</code> and its returned integer reports success or failure to the operating system. In bare-metal firmware, startup code calls <code>main</code>, and returning usually makes no sense because there is no host waiting.</p>` },
      { heading: "Reading diagnostics", html: `<p>Start with the first error, because later errors may be consequences. Read filename, line, column, message, and any caret pointing at the token. The true mistake may be immediately before the highlighted place.</p>` }
    ],
    examples: [
      { title: "A warning worth understanding", code: `#include <stdio.h>\n\nint main(void)\n{\n    int temperature = 25;\n    printf("system ready\\n");\n    return 0;\n}`, note: "Compile it. GCC warns that temperature is unused: you created state but never observed it." },
      { title: "Multiple translation units, conceptually", code: `// led.h: declaration\nvoid led_set(int on);\n\n// led.c: definition\nvoid led_set(int on) { /* hardware work */ }\n\n// main.c: use\n#include "led.h"`, note: "Each .c file compiles separately; the linker connects the call to the definition." }
    ],
    practice: ["Remove a semicolon and identify the first diagnostic.", "Misspell printf and decide whether failure occurs at compile or link time.", "Explain why a header usually contains declarations rather than storage definitions."],
    quiz: { q: "Which stage combines object files and resolves function references?", options: ["Preprocessor", "Linker", "Text editor", "GPIO"], answer: 1, why: "The linker resolves symbols across compiled translation units and libraries." }
  },
  {
    id: "program-anatomy", category: "C language", title: "Anatomy of a C program", time: "32 min", level: "Beginner", source: "C syntax foundation",
    lede: "Braces, semicolons, declarations, expressions and comments form a grammar—not decoration.",
    objectives: ["Recognize declarations, statements and blocks", "Explain include directives and function definitions", "Format code so structure is visible"],
    sections: [
      { heading: "Tokens and grammar", html: `<p>Keywords such as <code>int</code> have language-defined meaning. Identifiers are names you choose. Literals write values directly. Operators combine expressions. Punctuation groups and terminates constructs. Whitespace usually separates tokens and makes structure readable.</p>` },
      { heading: "Declarations introduce names", html: `<p><code>int count;</code> declares an object named count with type int. <code>int add(int, int);</code> declares a function. A definition also provides storage or a function body.</p>` },
      { heading: "Statements perform steps", html: `<p>An expression followed by a semicolon is a statement. Selection and iteration statements control which steps occur. Braces form a compound statement and a scope.</p>` },
      { heading: "Comments explain decisions", html: `<p>Write why a constraint or unusual method exists. Do not narrate obvious syntax. <code>delay_ms(10); // wait 10 ms</code> adds little; <code>// Sensor requires 10 ms after reset</code> preserves a hardware reason.</p>` }
    ],
    examples: [
      { title: "Label every part", code: `#include <stdio.h>       // preprocessing directive\n\nint square(int value)     // function definition begins\n{\n    return value * value; // return statement\n}\n\nint main(void)\n{\n    int result = square(6); // declaration + initializer\n    printf("%d\\n", result);\n    return 0;\n}`, note: "Trace main, the function call, parameter value, return value, and printed result." },
      { title: "Formatting reveals a bug", code: `if (ready)\n    start_transfer();\n    transfer_count++; // always runs: it is not controlled by the if`, note: "Use braces consistently in firmware so later edits cannot silently change control flow." }
    ],
    practice: ["Add braces to the second example and describe the behavior change.", "Write a cube function and call it from main.", "Replace one useful comment with a useless narration, then improve it."],
    quiz: { q: "What does a semicolon usually do in C?", options: ["Ends many declarations and expression statements", "Starts every function", "Creates a hardware clock", "Comments out a line"], answer: 0, why: "It terminates many simple syntactic constructs, though blocks and control headers follow different rules." }
  },
  {
    id: "variables-types", category: "C language", title: "Variables, types and representation", time: "40 min", level: "Beginner", source: "Book Ch. 1.5, pp. 64-83",
    lede: "A variable is typed storage. Its type constrains representation, operations, range, and sometimes the hardware instructions chosen.",
    objectives: ["Declare and initialize objects", "Choose integer and floating types", "Recognize overflow, conversion and signedness hazards"],
    sections: [
      { heading: "Type is more than size", html: `<p>Type tells the compiler how to interpret bits and which operations are valid. <code>uint8_t</code> is an unsigned integer exactly eight bits wide; <code>float</code> is a finite approximation of real numbers; <code>bool</code> represents logical false or true.</p>` },
      { heading: "Range and overflow", html: `<p>An unsigned N-bit integer represents 0 through 2<sup>N</sup>-1 and wraps modulo 2<sup>N</sup>. Signed overflow is undefined behavior: the compiler is not required to wrap. Do range analysis before arithmetic.</p>` },
      { heading: "Initialization prevents ghosts", html: `<p>Automatic local variables have indeterminate values until initialized. Reading one is undefined behavior. Static-duration objects are zero-initialized, but explicit initialization can better document intent.</p>` },
      { heading: "Conversions deserve attention", html: `<p>Integer promotions, signed/unsigned mixing, and narrowing can change values. Enable conversion warnings for critical modules, use explicit casts only when the conversion is understood, and test boundary values.</p>` }
    ],
    examples: [
      { title: "Inspect type sizes", code: `#include <stdio.h>\n#include <stdint.h>\n\nint main(void)\n{\n    printf("char=%zu int=%zu uint32_t=%zu float=%zu\\n",\n           sizeof(char), sizeof(int), sizeof(uint32_t), sizeof(float));\n}`, note: "sizeof reports bytes. Exact-width integer types come from stdint.h." },
      { title: "Unsigned wrap is defined", code: `#include <stdio.h>\n#include <stdint.h>\n\nint main(void)\n{\n    uint8_t counter = 255U;\n    counter++;\n    printf("%u\\n", (unsigned)counter);\n}`, note: "The output is 0. Later, this modular behavior helps with timer wraparound." },
      { title: "Widen before multiplication", code: `uint32_t energy = (uint32_t)adc_sample * millivolts;`, note: "Casting after a narrow multiplication would be too late if the intermediate already overflowed." }
    ],
    practice: ["Find the maximum of uint16_t without memorizing it: compute 2^16-1.", "Modify the wrap example to start at 254 and print three increments.", "Explain why float equality can be unreliable after calculations."],
    quiz: { q: "What happens when uint8_t value 255 is incremented?", options: ["It becomes 256", "It wraps to 0", "The compiler always stops", "It becomes -1"], answer: 1, why: "Unsigned arithmetic is defined modulo 2 to the type width." }
  },
  {
    id: "io-formatting", category: "C language", title: "Output, newlines and format strings", time: "36 min", level: "Beginner", source: "Hosted C practice; embedded output bridge",
    lede: "Text output gives a new programmer immediate evidence, but formatting rules are type-sensitive and embedded output needs a real transport.",
    objectives: ["Print text and values", "Use printf format specifiers correctly", "Explain why printf may be avoided in small firmware"],
    sections: [
      { heading: "A format string is a contract", html: `<p><code>%d</code> expects int, <code>%u</code> expects unsigned int, <code>%ld</code> expects long, <code>%zu</code> expects size_t, and <code>%f</code> prints a promoted double. A mismatch is undefined behavior, not merely ugly output.</p>` },
      { heading: "Printing text and values", html: `<p>A string literal such as <code>"ready"</code> supplies fixed text. Conversion specifications insert typed values. Escape sequences such as <code>\n</code>, <code>\t</code>, <code>\\</code> and <code>\"</code> represent characters that are awkward to type directly.</p>` },
      { heading: "Embedded output has a route", html: `<p>A bare microcontroller has no terminal by default. To use <code>printf</code>, you retarget its character output to UART, a debug channel, USB or another transport. Formatting increases Flash use and may block, so production logging often uses compact records.</p>` },
      { heading: "Newline details", html: `<p><code>\n</code> is the C newline character. Serial terminals sometimes expect carriage return plus newline (<code>\r\n</code>). Learn the protocol rather than scattering both blindly.</p>` }
    ],
    examples: [
      { title: "Correctly format fixed-width integers", code: `#include <inttypes.h>\n#include <stdint.h>\n#include <stdio.h>\n\nint main(void)\n{\n    uint32_t ticks = 123456U;\n    printf("ticks=%" PRIu32 "\\n", ticks);\n}`, note: "inttypes.h provides portable macros for exact-width types." },
      { title: "Newlines and escapes", code: `#include <stdio.h>\n\nint main(void)\n{\n    printf("first line\\nsecond line\\n");\n    printf("quoted: \\"ready\\"\\n");\n    return 0;\n}`, note: "The backslash begins an escape sequence inside the string literal." }
    ],
    practice: ["Print an int in decimal and hexadecimal on the same line.", "Intentionally use the wrong specifier, compile with warnings, and explain the diagnostic.", "Print a tab, a backslash and a quoted word."],
    quiz: { q: "Why must printf specifiers match argument types?", options: ["The format string controls how variadic argument bits are interpreted", "Only for appearance", "To enable GPIO", "Because all integers are strings"], answer: 0, why: "Variadic arguments carry no per-argument type metadata for printf to discover." }
  },
  {
    id: "operators", category: "C language", title: "Operators and expressions", time: "42 min", level: "Beginner", source: "C expressions; Book Ch. 1.5",
    lede: "Expressions compute values and may also change state. Precedence, evaluation order, width and side effects determine whether they mean what you think.",
    objectives: ["Use arithmetic, comparison, logical and bitwise operators", "Read precedence safely", "Avoid unsequenced side effects"],
    sections: [
      { heading: "Arithmetic is typed", html: `<p>Integer division discards the remainder: <code>7 / 2</code> is 3. Remainder uses <code>%</code>. Multiplication can overflow before assignment to a wider result. Parenthesize for human clarity even when precedence is known.</p>` },
      { heading: "Logical is not bitwise", html: `<p><code>&amp;&amp;</code> and <code>||</code> produce logical truth and short-circuit. <code>&amp;</code>, <code>|</code>, <code>^</code> and <code>~</code> operate on each bit and evaluate both operands. Confusing them is a classic register bug.</p>` },
      { heading: "Side effects and sequence", html: `<p>A side effect changes an object or external state. Avoid expressions that modify and read the same object without guaranteed sequencing, such as <code>a[i] = i++;</code>. Separate steps are easier to reason about and debug.</p>` },
      { heading: "Comparison produces int truth", html: `<p>In C, zero is false and nonzero is true. Comparisons produce 0 or 1. Do not write <code>if (x = 3)</code> when you mean comparison; warnings help catch this assignment.</p>` }
    ],
    examples: [
      { title: "Integer versus floating division", code: `#include <stdio.h>\n\nint main(void)\n{\n    printf("integer: %d\\n", 7 / 2);\n    printf("floating: %.2f\\n", 7.0 / 2.0);\n}`, note: "The literal types select different arithmetic." },
      { title: "Short-circuit guards access", code: `if (pointer != NULL && pointer->ready) {\n    use(pointer);\n}`, note: "The second operand is evaluated only when pointer is non-null." },
      { title: "Extract a register field", code: `uint32_t field = (register_value >> FIELD_POS) & FIELD_MASK;`, note: "Shift the desired field down, then mask away unrelated high bits." }
    ],
    practice: ["Predict 10 / 3, 10 % 3 and 10.0 / 3 before running.", "Rewrite a dense expression as named intermediate steps.", "Explain the difference between flags && MASK and flags & MASK."],
    quiz: { q: "Which operator short-circuits when its left operand is false?", options: ["&", "&&", "^", "~"], answer: 1, why: "Logical AND does not evaluate its right side when the result is already false." }
  },
  {
    id: "decisions", category: "C language", title: "Decisions: if, else and switch", time: "36 min", level: "Beginner", source: "C control flow",
    lede: "Selection turns data into behavior. Clear condition ordering is the beginning of state-machine thinking.",
    objectives: ["Write mutually exclusive branches", "Use switch for discrete states", "Recognize boundary and fallthrough errors"],
    sections: [
      { heading: "Conditions partition possibilities", html: `<p>An <code>if</code>/<code>else if</code>/<code>else</code> chain chooses the first true branch. Order matters when ranges overlap. Write boundary cases explicitly and test values exactly at each boundary.</p>` },
      { heading: "switch matches integral values", html: `<p>A switch is useful for enums, command bytes and menu states. Each case is a label, not a private scope. Use <code>break</code> unless intentional fallthrough is documented with the compiler-recognized annotation.</p>` },
      { heading: "Boolean names improve reading", html: `<p><code>if (temperature &gt; 80 &amp;&amp; fan_enabled)</code> reads better when intermediate policy is named <code>over_temperature</code>. Separate measurement, decision and action.</p>` },
      { heading: "Defensive default cases", html: `<p>For external command values, default should reject input. For an internal enum, default may recover or assert. Never let an unexpected state silently perform a dangerous action.</p>` }
    ],
    examples: [
      { title: "Order ranges correctly", code: `if (temperature_c >= 100)\n    state = SHUTDOWN;\nelse if (temperature_c >= 80)\n    state = WARNING;\nelse\n    state = NORMAL;`, note: "Checking >=80 first would swallow the >=100 case." },
      { title: "Command decoder", code: `switch (command) {\ncase 's': start(); break;\ncase 'x': stop();  break;\ncase '?': help();  break;\ndefault:  report_bad_command(command); break;\n}`, note: "Every input has defined behavior." }
    ],
    practice: ["Write a battery classifier with LOW, OK and HIGH states.", "Test exact boundary values, one below, and one above.", "Remove a break from a switch, predict fallthrough, then verify."],
    quiz: { q: "In an else-if chain, which true branch runs?", options: ["All true branches", "The first true branch", "The last true branch", "A random branch"], answer: 1, why: "Later conditions are skipped once a branch is selected." }
  },
  {
    id: "loops", category: "C language", title: "Loops and bounded repetition", time: "42 min", level: "Beginner", source: "C control flow; real-time implications",
    lede: "Loops express repetition. In firmware, you must also know their upper bound, exit condition, and effect on response time.",
    objectives: ["Choose for, while or do-while", "Prevent off-by-one and infinite loops", "Relate loop bounds to real-time latency"],
    sections: [
      { heading: "Three loop shapes", html: `<p>Use <code>for</code> when initialization, condition and step form one counting idea. Use <code>while</code> when repetition depends on a condition checked first. Use <code>do-while</code> when the body must run at least once.</p>` },
      { heading: "Half-open ranges", html: `<p>Array loops conventionally use <code>0 &lt;= i &lt; count</code>. The upper bound is excluded, matching valid indices 0 through count-1 and making empty ranges natural.</p>` },
      { heading: "Termination is a proof obligation", html: `<p>Identify the value that moves toward exit. Hardware polling needs a timeout so failed hardware cannot trap the system forever. Watch unsigned countdown conditions such as <code>i &gt;= 0</code>, which never become false.</p>` },
      { heading: "Loops consume latency", html: `<p>A cooperative task containing 10,000 slow transfers delays every other task. Process work in chunks, use interrupts/DMA, or yield between bounded units.</p>` }
    ],
    examples: [
      { title: "Sum an array safely", code: `#include <stddef.h>\n#include <stdint.h>\n\nint32_t sum(const int16_t *values, size_t count)\n{\n    int32_t total = 0;\n    for (size_t i = 0; i < count; ++i)\n        total += values[i];\n    return total;\n}`, note: "The accumulator is wider than each sample." },
      { title: "Bound a hardware wait", code: `uint32_t timeout = 100000U;\nwhile ((STATUS & READY_MASK) == 0U && timeout > 0U)\n    --timeout;\nif (timeout == 0U)\n    report_timeout();`, note: "A timer-based deadline is better when real elapsed time matters." }
    ],
    practice: ["Print integers 0 through 9 with a for loop.", "Write the same behavior with while and compare clarity.", "Find and fix: for (size_t i = count - 1; i >= 0; --i)."],
    quiz: { q: "For an array of count elements, what is the usual loop condition?", options: ["i <= count", "i < count", "i != count + 1", "i >= count"], answer: 1, why: "The highest valid index is count-1." }
  },
  {
    id: "functions", category: "C language", title: "Functions, parameters and return values", time: "44 min", level: "Beginner", source: "Book Ch. 3.3-3.4, pp. 188-221",
    lede: "Functions divide a system into named, testable transformations and effects. Their contracts matter more than their length.",
    objectives: ["Declare and define functions", "Understand pass-by-value", "Design narrow contracts with status returns and output parameters"],
    sections: [
      { heading: "A function call creates a new context", html: `<p>Arguments are evaluated and their values initialize parameters. C passes all parameters by value—including pointer values. Local automatic objects normally live until the call returns.</p>` },
      { heading: "Declaration before use", html: `<p>A prototype tells the compiler the function name, parameter types and return type. It enables type checking across files. Include the declaring header in both caller and implementation to catch disagreement.</p>` },
      { heading: "Return data and report failure", html: `<p>A function may return a computed value, a status code, or nothing. For multiple results, provide validated output pointers or return a struct. Define behavior for invalid parameters rather than hoping callers behave.</p>` },
      { heading: "Pure calculation versus effect", html: `<p><code>celsius_to_fahrenheit</code> can be pure and easy to test. <code>sensor_read</code> changes hardware state and can fail. Separating conversion from transport makes both clearer.</p>` }
    ],
    examples: [
      { title: "Pass-by-value", code: `#include <stdio.h>\n\nvoid change(int value) { value = 99; }\n\nint main(void)\n{\n    int number = 7;\n    change(number);\n    printf("%d\\n", number);\n}`, note: "number stays 7 because change receives a copy." },
      { title: "Status plus output value", code: `bool divide(int numerator, int denominator, int *result)\n{\n    if (denominator == 0 || result == NULL) return false;\n    *result = numerator / denominator;\n    return true;\n}`, note: "The boolean reports validity; the pointer selects caller-owned output storage." },
      { title: "Document units in the interface", code: `uint32_t timer_ticks_from_us(uint32_t microseconds, uint32_t timer_hz);`, note: "Names make incompatible units visible at the call site." }
    ],
    practice: ["Write max_of_two and test equal, negative and positive inputs.", "Modify pass-by-value to use a pointer intentionally.", "Design a sensor conversion function that does not access hardware."],
    quiz: { q: "How are ordinary function arguments passed in C?", options: ["By value", "Always by global variable", "By hidden network packet", "Only through registers"], answer: 0, why: "The abstract C rule is pass-by-value; implementations may use registers or the stack to carry those values." }
  },
  {
    id: "scope-storage", category: "C language", title: "Scope, lifetime and storage duration", time: "42 min", level: "Core", source: "C object model; Book Ch. 3.4 and 3.8",
    lede: "Where a name is visible and how long its object exists are different questions.",
    objectives: ["Distinguish block, file and function scope", "Explain automatic and static storage duration", "Use static to hide module state rather than create accidental globals"],
    sections: [
      { heading: "Scope controls naming", html: `<p>A block-scope name is visible from its declaration to the block end. A file-scope name is visible through the translation unit. Shadowing creates a new object with the same spelling and often confuses debugging.</p>` },
      { heading: "Storage duration controls lifetime", html: `<p>Automatic objects normally exist during block execution. Static-duration objects exist for the entire program. Allocated objects exist from successful allocation until deallocation.</p>` },
      { heading: "static has contextual meanings", html: `<p>Inside a function, static gives persistent storage. At file scope, static gives internal linkage, keeping a function or object private to that translation unit. Both are useful, but neither makes shared state thread-safe.</p>` },
      { heading: "Global state raises coupling", html: `<p>Prefer a module that owns private state and exposes operations. When many modules can write a global, invariants become difficult to locate and interrupt safety becomes murky.</p>` }
    ],
    examples: [
      { title: "Persistent local counter", code: `uint32_t next_sequence(void)\n{\n    static uint32_t sequence;\n    return sequence++;\n}`, note: "The name is local to the function; the object persists for the program lifetime." },
      { title: "Private module state", code: `// button.c\nstatic bool initialized;\nstatic uint32_t press_count;\n\nvoid button_init(void) { initialized = true; }`, note: "Other files cannot name these objects directly." }
    ],
    practice: ["Draw scope and lifetime for a local, static local and file-static object.", "Find a global in a small program and wrap it behind a module function.", "Explain why returning a pointer to an automatic local is invalid."],
    quiz: { q: "How long does a static local object live?", options: ["Until its function returns", "For the program duration", "One loop iteration", "Until the next interrupt"], answer: 1, why: "Its name has block scope, but its storage duration is static." }
  }
];

const CORE_C_LESSONS = [
  {
    id: "arrays", category: "C language", title: "Arrays and indexed memory", time: "45 min", level: "Core", source: "C arrays; embedded buffers",
    lede: "An array is a fixed sequence of same-typed objects stored contiguously. That simplicity powers buffers, lookup tables, samples and frame lines.",
    objectives: ["Declare, initialize and traverse arrays", "Compute element counts safely", "Prevent out-of-bounds access"],
    sections: [
      { heading: "Indices are offsets", html: `<p>For <code>int values[4]</code>, valid indices are 0, 1, 2 and 3. Indexing computes an address relative to the first element. C performs no automatic bounds check; one wrong index can corrupt unrelated state.</p>` },
      { heading: "Array size and element count", html: `<p>Inside the array's own scope, <code>sizeof values / sizeof values[0]</code> computes its element count. When passed to a function, an array parameter adjusts to a pointer, so the function must receive a count separately.</p>` },
      { heading: "Initialization", html: `<p>Missing initializers become zero. A string literal initializes a character array including its terminator. Large constant lookup tables should be <code>const</code> so embedded linkers can keep them in Flash.</p>` },
      { heading: "Multidimensional layout", html: `<p><code>pixels[row][column]</code> is stored row by row in C. Contiguous traversal is cache-friendly on large machines and transfer-friendly for DMA/display hardware.</p>` }
    ],
    examples: [
      { title: "Average sensor samples", code: `#include <stddef.h>\n#include <stdint.h>\n\nuint16_t average(const uint16_t samples[], size_t count)\n{\n    if (count == 0U) return 0U;\n    uint32_t sum = 0U;\n    for (size_t i = 0; i < count; ++i) sum += samples[i];\n    return (uint16_t)(sum / count);\n}`, note: "The function receives both pointer and count; the accumulator is wider." },
      { title: "Compile-time element count", code: `uint16_t samples[] = {100, 104, 98, 102};\nsize_t count = sizeof samples / sizeof samples[0];`, note: "This works only where samples is still an array, not after it has become a pointer parameter." }
    ],
    practice: ["Find minimum and maximum in an integer array.", "Deliberately access index count under a debugger and explain why C cannot guarantee a friendly error.", "Create a 5x7 bitmap for one character."],
    quiz: { q: "What is the final valid index of an array containing count elements?", options: ["count", "count - 1", "count + 1", "Always 255"], answer: 1, why: "C array indexing begins at zero." }
  },
  {
    id: "strings", category: "C language", title: "Strings without mystery", time: "48 min", level: "Core", source: "C character arrays and library",
    lede: "A C string is not a magical object; it is a character sequence terminated by a zero byte. Capacity and termination are your responsibility.",
    objectives: ["Distinguish arrays, pointers and string literals", "Use length and copy functions safely", "Design bounded embedded text handling"],
    sections: [
      { heading: "The null terminator", html: `<p>The text <code>"LED"</code> occupies four bytes: 'L', 'E', 'D', and <code>'\0'</code>. Library functions keep reading until they find zero, so a missing terminator can make them read beyond the array.</p>` },
      { heading: "Length is not capacity", html: `<p><code>strlen</code> counts characters before the terminator; it does not know the destination capacity. A 16-byte array can hold at most 15 visible single-byte characters plus the terminator.</p>` },
      { heading: "Literals may be read-only", html: `<p>Use <code>const char *message = "ready";</code>. Attempting to modify the literal is undefined behavior. Use <code>char message[] = "ready";</code> when a writable copy is required.</p>` },
      { heading: "Protocols often prefer explicit lengths", html: `<p>UART and radio packets may contain zero bytes and are not necessarily text. Pass a pointer plus length for binary data. Parse text commands within bounded buffers and define overflow recovery.</p>` }
    ],
    examples: [
      { title: "Construct text with a bound", code: `#include <stdio.h>\n\nint main(void)\n{\n    char message[32];\n    int written = snprintf(message, sizeof message, "ADC=%u", 1234U);\n    if (written >= 0 && (size_t)written < sizeof message)\n        printf("%s\\n", message);\n}`, note: "snprintf reports the length it wanted to produce, allowing truncation detection." },
      { title: "Compare content, not addresses", code: `if (strcmp(command, "START") == 0)\n    motor_start();`, note: "The == operator compares pointer addresses here, not characters." }
    ],
    practice: ["Write your own bounded string-length function.", "Explain the storage difference between char a[]='...' and const char *a='...'.", "Design behavior for a UART line longer than its buffer."],
    quiz: { q: "How many bytes are required to store the string \"ABC\"?", options: ["3", "4", "2", "It cannot be stored"], answer: 1, why: "Three characters plus the terminating zero byte." }
  },
  {
    id: "pointers-zero", category: "C language", title: "Pointers from the beginning", time: "55 min", level: "Core", source: "C pointers; bridge to memory-mapped I/O",
    lede: "A pointer is a typed address. Understanding that one sentence unlocks functions, arrays, strings, dynamic storage and hardware registers.",
    objectives: ["Take an address and dereference it", "Use NULL as no-object", "Follow pointer constness and lifetime"],
    sections: [
      { heading: "Address and pointed-to value", html: `<p><code>&amp;value</code> produces value's address. A compatible pointer stores it. <code>*pointer</code> accesses the object at that address. The pointer type tells the compiler the accessed object's type and how pointer arithmetic advances.</p>` },
      { heading: "NULL means no valid target", html: `<p>Check a possibly null pointer before dereferencing. NULL does not mean an allocated empty object and does not provide storage. APIs should document whether NULL is accepted.</p>` },
      { heading: "Pointers do not extend lifetime", html: `<p>A pointer to an automatic local becomes invalid after the local's lifetime ends. A pointer into an array becomes invalid if it moves outside the permitted range. Address-looking bits are not proof of a valid object.</p>` },
      { heading: "Read declarations inside out", html: `<p><code>const uint8_t *data</code> is a pointer to read-only-through-this-pointer bytes. <code>uint8_t * const cursor</code> is an unchangeable pointer to writable bytes. Parentheses matter for function pointers.</p>` }
    ],
    examples: [
      { title: "Modify caller-owned storage", code: `#include <stdio.h>\n\nvoid double_value(int *value)\n{\n    if (value != NULL) *value *= 2;\n}\n\nint main(void)\n{\n    int n = 6;\n    double_value(&n);\n    printf("%d\\n", n);\n}`, note: "The pointer itself is passed by value; it points to main's n." },
      { title: "Pointer types control stride", code: `uint32_t values[3] = {10, 20, 30};\nuint32_t *p = values;\n// p + 1 points to values[1], advancing sizeof(uint32_t) bytes`, note: "Pointer arithmetic is scaled by pointed-to type." }
    ],
    practice: ["Draw n, p and the arrow between them for the first example.", "Write swap(int *a, int *b) and test it.", "List three ways a pointer can become invalid."],
    quiz: { q: "What does dereferencing a pointer do?", options: ["Accesses the object at its stored address", "Deletes the pointer", "Compiles the program", "Changes Flash size"], answer: 0, why: "Unary * applied to a valid pointer designates the pointed-to object." }
  },
  {
    id: "pointers-arrays", category: "C language", title: "Pointers, arrays and buffers", time: "50 min", level: "Core", source: "C memory model; driver APIs",
    lede: "Arrays and pointers are closely related in expressions, but they are not the same thing. That distinction prevents many buffer bugs.",
    objectives: ["Explain array-to-pointer conversion", "Use pointer-plus-count APIs", "Understand one-past-the-end without dereferencing it"],
    sections: [
      { heading: "Conversion, not identity", html: `<p>In most expressions, an array name converts to a pointer to its first element. The array still has fixed storage and size. <code>sizeof array</code> sees the whole array in its defining scope; <code>sizeof pointer</code> sees only an address representation.</p>` },
      { heading: "One past is a comparison position", html: `<p>C permits forming a pointer one past the last array element for loop termination, but not dereferencing it. Pointers outside the array-and-one-past range are not valid arithmetic results.</p>` },
      { heading: "Buffers need capacity and used length", html: `<p>A receive buffer has allocated capacity and currently valid length. Keep both. Never ask a function to write N bytes unless the destination has at least N bytes remaining.</p>` },
      { heading: "restrict and aliasing preview", html: `<p>Two pointers may refer to the same storage (alias). This limits optimization and complicates reasoning. Advanced APIs can use <code>restrict</code> as a promise of non-overlap—but breaking that promise is undefined behavior.</p>` }
    ],
    examples: [
      { title: "Pointer traversal", code: `uint32_t checksum(const uint8_t *data, size_t length)\n{\n    uint32_t sum = 0;\n    const uint8_t *end = data + length;\n    while (data != end) sum += *data++;\n    return sum;\n}`, note: "end may be one past the array; it is compared but never dereferenced." },
      { title: "Append with capacity", code: `bool append_byte(uint8_t *buffer, size_t capacity,\n                 size_t *used, uint8_t value)\n{\n    if (*used >= capacity) return false;\n    buffer[(*used)++] = value;\n    return true;\n}`, note: "The interface makes overflow behavior explicit." }
    ],
    practice: ["Compare sizeof(array) and sizeof(pointer) in the compiler.", "Write a reverse function using indices, then using pointers.", "Add NULL validation to append_byte and define zero-capacity behavior."],
    quiz: { q: "May a one-past-the-end pointer be dereferenced?", options: ["Yes", "No, it is only valid for arithmetic/comparison within the array rules", "Only during interrupts", "Only for char"], answer: 1, why: "It is a useful sentinel position, not an element." }
  },
  {
    id: "structs-enums-unions", category: "C language", title: "Structures, enums, unions and typedef", time: "58 min", level: "Core", source: "C aggregate types; state machines and protocols",
    lede: "Aggregate types let the program model meaningful things instead of carrying unrelated primitive variables.",
    objectives: ["Group related state in structs", "Represent finite states with enums", "Use unions only with a clear active-member rule"],
    sections: [
      { heading: "Structures model records", html: `<p>A struct contains named members with one shared lifetime. The compiler may insert padding for alignment, so <code>sizeof</code> can exceed the sum of member sizes. Do not transmit raw structs as portable wire formats.</p>` },
      { heading: "Enums name discrete choices", html: `<p>An enum creates named integer constants and communicates valid conceptual states. C does not automatically prevent storing other integer values, so validate external data before casting.</p>` },
      { heading: "Unions share storage", html: `<p>All union members overlap. A tagged union pairs an enum discriminator with a union payload so the program knows which member is active. This is useful for event queues without dynamic allocation.</p>` },
      { heading: "typedef names a type", html: `<p>Use typedef for domain clarity and complicated declarations, not to hide whether something is a pointer. In hardware code, keeping pointer-ness visible helps ownership review.</p>` }
    ],
    examples: [
      { title: "A coherent task record", code: `typedef void (*task_fn_t)(void *);\n\ntypedef struct {\n    task_fn_t run;\n    void *context;\n    uint32_t period_ms;\n    uint32_t next_ms;\n    bool active;\n} task_t;`, note: "The members describe one schedulable entity." },
      { title: "Tagged UI event", code: `typedef enum { EVENT_BUTTON, EVENT_TIMER } event_kind_t;\ntypedef struct {\n    event_kind_t kind;\n    union { uint8_t button_id; uint32_t tick_ms; } data;\n} event_t;`, note: "Read data.button_id only when kind is EVENT_BUTTON." }
    ],
    practice: ["Model a 2D point and compute distance squared.", "Print sizeof a struct with differently ordered members and explain padding.", "Create a switch that handles every event kind."],
    quiz: { q: "Why should raw structs usually not be sent directly over a protocol?", options: ["Padding, byte order and representation may differ", "Structs cannot contain integers", "UART rejects braces", "They always live in Flash"], answer: 0, why: "Wire formats need explicitly defined byte layouts independent of compiler choices." }
  },
  {
    id: "preprocessor-modules", category: "Professional C", title: "Preprocessor, headers and modules", time: "55 min", level: "Core", source: "Book Ch. 3.3-3.4, pp. 188-221",
    lede: "The preprocessor is powerful text transformation. Use it to configure and connect modules, not to invent a second, untyped language.",
    objectives: ["Use include guards and conditional compilation", "Separate interface from implementation", "Prefer typed C constructs over risky macros"],
    sections: [
      { heading: "Preprocessing happens before C parsing", html: `<p><code>#include</code> inserts a header's tokens. <code>#define</code> replaces macro tokens. <code>#if</code> selects code. The compiler sees the result, which explains surprising diagnostics from expansions.</p>` },
      { heading: "Headers declare shared contracts", html: `<p>A public header includes required types, declarations and documentation. It should compile when included alone. Include guards prevent repeated definitions during one translation unit.</p>` },
      { heading: "Macro hazards", html: `<p>Function-like macros can evaluate arguments multiple times and ignore types. Parenthesize every parameter and the complete expression, or prefer <code>static inline</code> functions.</p>` },
      { heading: "Configuration belongs at boundaries", html: `<p>Use compile-time flags for real target variants, not normal runtime policy. Keep board pin selection in one BSP configuration rather than sprinkling <code>#ifdef</code> across applications.</p>` }
    ],
    examples: [
      { title: "Self-contained header", code: `#ifndef GUIDE_LED_H\n#define GUIDE_LED_H\n\n#include <stdbool.h>\n\nvoid led_init(void);\nvoid led_set(bool on);\n\n#endif`, note: "The guard and required bool definition make the contract repeatably includable." },
      { title: "Macro versus inline", code: `#define BAD_SQUARE(x) ((x) * (x))\nstatic inline int square(int x) { return x * x; }\n// BAD_SQUARE(i++) increments twice; square(i++) increments once.`, note: "Inline functions retain type checking and single evaluation." }
    ],
    practice: ["Split a calculator into calculator.h, calculator.c and main.c.", "Inspect preprocessed output using gcc -E outside the page.", "Replace a MIN macro with a type-specific inline function."],
    quiz: { q: "What major hazard appears in BAD_SQUARE(i++)?", options: ["The argument is evaluated twice", "The compiler cannot multiply", "It allocates a heap", "It disables warnings"], answer: 0, why: "Textual substitution duplicates side effects." }
  },
  {
    id: "dynamic-memory", category: "Professional C", title: "Dynamic memory and embedded allocation", time: "50 min", level: "Intermediate", source: "Book Ch. 3.8, pp. 251-254",
    lede: "malloc is not forbidden magic. It is a policy with timing, failure, fragmentation and ownership consequences.",
    objectives: ["Use allocation and deallocation correctly", "Identify leaks, use-after-free and double-free", "Choose static pools when bounded behavior matters"],
    sections: [
      { heading: "Allocated lifetime", html: `<p><code>malloc</code> returns suitably aligned storage or NULL. The storage contains indeterminate bytes. <code>calloc</code> zeroes its allocation. <code>free</code> ends the allocated object's lifetime.</p>` },
      { heading: "Ownership must be explicit", html: `<p>Who frees the object? Can ownership transfer? May other pointers borrow it, and for how long? Many memory bugs are actually undocumented ownership rules.</p>` },
      { heading: "Fragmentation and timing", html: `<p>Repeated variable-size allocation can leave unusable gaps. Allocation time can depend on heap history. Long-lived embedded systems and real-time paths often prefer startup-only allocation or fixed-size pools.</p>` },
      { heading: "Static is bounded, not automatically correct", html: `<p>A static buffer can still overflow and wastes capacity if oversized. The advantage is inspectable, deterministic capacity. Choose from requirements, not slogans.</p>` }
    ],
    examples: [
      { title: "Checked hosted allocation", code: `int *values = malloc(count * sizeof *values);\nif (values == NULL) return ERROR_NO_MEMORY;\n/* use values within count elements */\nfree(values);\nvalues = NULL;`, note: "Also guard count multiplication overflow in general-purpose code." },
      { title: "Fixed event pool idea", code: `#define EVENT_CAPACITY 32U\nstatic event_t events[EVENT_CAPACITY];\nstatic bool used[EVENT_CAPACITY];`, note: "A pool trades flexible size for bounded storage and predictable allocation search." }
    ],
    practice: ["Draw ownership for an allocated buffer passed through two functions.", "Explain why setting one pointer to NULL does not fix other dangling aliases.", "Design a no-heap message queue with a declared capacity."],
    quiz: { q: "What must code do immediately after malloc?", options: ["Assume success", "Check for NULL before use", "Enable interrupts", "Erase Flash"], answer: 1, why: "Allocation failure is part of the interface." }
  },
  {
    id: "callbacks", category: "Professional C", title: "Function pointers and callbacks", time: "52 min", level: "Intermediate", source: "Book Ch. 3.6; modular drivers",
    lede: "A function pointer stores the address of executable behavior. Callbacks let generic mechanisms invoke application-specific policy.",
    objectives: ["Declare and call function pointers", "Use context pointers", "Avoid lifetime and ISR-context callback mistakes"],
    sections: [
      { heading: "Behavior becomes data", html: `<p><code>void (*handler)(int)</code> is a pointer to a function receiving int and returning void. A typedef makes this readable. The pointed-to function must have a compatible signature.</p>` },
      { heading: "Context avoids globals", html: `<p>A callback plus <code>void *context</code> forms a small object-like pair. The generic scheduler stores both and passes context back on invocation. The caller must keep that context alive.</p>` },
      { heading: "Execution context matters", html: `<p>A callback invoked from an ISR inherits ISR restrictions. A callback invoked from a foreground dispatcher may perform longer work. Document where and when callbacks run.</p>` },
      { heading: "Tables can replace giant switches", html: `<p>Command bytes can index or search a table of names and handlers. Validate indices and keep untrusted input from becoming an arbitrary function address.</p>` }
    ],
    examples: [
      { title: "Callback with context", code: `typedef void (*callback_t)(void *context);\n\ntypedef struct { callback_t function; void *context; } callback_slot_t;\n\nvoid invoke(callback_slot_t slot)\n{\n    if (slot.function != NULL) slot.function(slot.context);\n}`, note: "The function and its data travel together." },
      { title: "Command table", code: `typedef struct { char key; void (*run)(void); } command_t;\nstatic const command_t commands[] = {\n    {'s', start}, {'x', stop}, {'?', help}\n};`, note: "Search for a matching key; never index directly with arbitrary ASCII." }
    ],
    practice: ["Write for_each that applies a callback to every integer.", "Add context to a scheduled LED task.", "Explain why a callback to a nested automatic object can become invalid."],
    quiz: { q: "Why pair a callback with a context pointer?", options: ["To supply instance-specific state without global variables", "To increase clock speed", "To avoid all type checking", "To allocate Flash"], answer: 0, why: "The same function can operate on different caller-owned state." }
  },
  {
    id: "defensive-c", category: "Professional C", title: "Undefined behavior and defensive C", time: "60 min", level: "Intermediate", source: "C correctness; safety-oriented firmware",
    lede: "The most dangerous C bugs often compile cleanly. Professional firmware defines assumptions, validates boundaries and removes undefined behavior.",
    objectives: ["Recognize common undefined behavior", "Use assertions and error returns appropriately", "Apply compiler warnings and sanitizers on host tests"],
    sections: [
      { heading: "Undefined is not unpredictable-but-defined", html: `<p>Out-of-bounds access, signed overflow, invalid dereference, use-after-lifetime and certain shift operations have no required behavior. Optimization can make results differ from a debug build.</p>` },
      { heading: "Implementation-defined and unspecified", html: `<p>Some behavior is chosen and documented by the implementation; some allows several choices without documentation. Portable code identifies where it depends on a compiler, ABI or target property.</p>` },
      { heading: "Validate at trust boundaries", html: `<p>Check lengths, enum values, packet fields, pointer validity contracts and arithmetic ranges where data enters a module. Internal helpers can rely on documented invariants and assert them during development.</p>` },
      { heading: "Use the host as a microscope", html: `<p>Pure algorithms can be compiled with sanitizers, fuzzed and unit-tested on a PC. Target tests still matter for alignment, registers, timing and toolchain differences.</p>` }
    ],
    examples: [
      { title: "Overflow-safe size check", code: `if (count > SIZE_MAX / sizeof(element_t))\n    return ERROR_TOO_LARGE;\nsize_t bytes = count * sizeof(element_t);`, note: "Check before multiplication; checking the wrapped result is too late." },
      { title: "Shift precondition", code: `bool bit_mask(unsigned bit, uint32_t *mask)\n{\n    if (mask == NULL || bit >= 32U) return false;\n    *mask = UINT32_C(1) << bit;\n    return true;\n}`, note: "Shifting by the width or more is undefined." }
    ],
    practice: ["List every precondition of memcpy.", "Compile a host algorithm with -fsanitize=address,undefined outside the page.", "Review one driver API and write its valid input ranges."],
    quiz: { q: "Is signed integer overflow guaranteed to wrap in standard C?", options: ["Yes", "No, it is undefined behavior", "Only inside main", "Only on microcontrollers"], answer: 1, why: "Do not rely on two's-complement hardware to define the C abstract-machine result." }
  },
  {
    id: "testing-builds", category: "Professional C", title: "Testing, debugging and build discipline", time: "58 min", level: "Intermediate", source: "Book Ch. 3.9 and 9.4",
    lede: "Reliable firmware comes from repeatable builds, layered tests and observations chosen to answer one question at a time.",
    objectives: ["Separate unit, integration and hardware tests", "Read map and warning output", "Debug from evidence instead of random edits"],
    sections: [
      { heading: "The test pyramid for firmware", html: `<p>Run many fast host tests for pure logic, fewer target integration tests for drivers, and focused hardware-in-loop tests for electrical/timing behavior. Do not force every algorithm test to require a connected board.</p>` },
      { heading: "Reproducible builds", html: `<p>Pin toolchain versions, keep flags in source control, generate dependency files and build from a clean state. The map file and size report are test artifacts for memory budgets.</p>` },
      { heading: "A debugging hypothesis", html: `<p>State: “SPI clock is absent because the peripheral clock gate is disabled.” Then observe the RCC bit or SCK pin. Each experiment should distinguish competing explanations.</p>` },
      { heading: "Regression tests preserve lessons", html: `<p>Every fixed bug should leave behind a test or assertion that would have exposed it. Otherwise the team pays to learn the same lesson again.</p>` }
    ],
    examples: [
      { title: "Tiny assertion-based host test", code: `#include <assert.h>\n\nint clamp(int x, int low, int high);\n\nint main(void)\n{\n    assert(clamp(5, 0, 10) == 5);\n    assert(clamp(-1, 0, 10) == 0);\n    assert(clamp(99, 0, 10) == 10);\n}`, note: "Boundary cases tell more than a single happy-path input." },
      { title: "Build flags worth reading", code: `gcc -std=c17 -Wall -Wextra -Wpedantic -O0 -g main.c -o app`, note: "This is a useful teaching profile for a warning-enabled local build." }
    ],
    practice: ["Write tests for every boundary of a ring-buffer put operation.", "Run a clean build and record Flash/RAM use.", "Turn one current bug guess into a hypothesis and discriminating observation."],
    quiz: { q: "Where should a pure fixed-point conversion usually be tested first?", options: ["Only on final hardware", "With fast host unit tests plus target confirmation", "Nowhere", "Only through the TFT"], answer: 1, why: "Host tests provide speed and tooling; target tests cover implementation-specific behavior." }
  }
];

const SUPPLEMENT_LESSONS = [
  {
    id: "digital-electronics", category: "Hardware foundations", title: "Voltage, logic and safe interfacing", time: "60 min", level: "Beginner to core", source: "Book Ch. 1.4, pp. 50-63; Ch. 7.4, pp. 482-483",
    lede: "C can request a high pin; electronics determines the voltage, current, edge shape, loading and whether anything survives.",
    objectives: ["Relate logical and electrical levels", "Use pull resistors and open-drain safely", "Read absolute maximum and operating specifications"],
    sections: [
      { heading: "High and low are voltage ranges", html: `<p>Digital inputs classify a voltage using guaranteed thresholds. Outputs guarantee levels only under stated current and supply conditions. Never equate logical 1 with one universal voltage.</p>` },
      { heading: "Current needs a path and limit", html: `<p>An LED needs a series resistor. Motors need drivers. Inputs need defined states. Kirchhoff's laws still apply when software is elegant. Use Ohm's law <code>V = I × R</code> to estimate current.</p>` },
      { heading: "Open-drain and shared wires", html: `<p>An open-drain output pulls low or releases. A pull-up produces high. Multiple devices can share a line because none actively drives high against another pulling low; I²C relies on this.</p>` },
      { heading: "Ratings are not recommendations", html: `<p>Absolute maximum ratings mark damage boundaries, not normal operating points. Check recommended voltage, per-pin current, total port current, rise time, capacitance and 5 V tolerance for the exact pin.</p>` }
    ],
    examples: [
      { title: "Estimate an LED resistor", code: `// 3.3 V output, ~2.0 V LED, desired 5 mA\n// R = (3.3 - 2.0) / 0.005 = 260 ohms\n// Choose a nearby standard value such as 270 or 330 ohms.`, note: "Also verify GPIO current capability and actual LED forward voltage range." },
      { title: "Active-low naming", code: `bool pressed = (HAL_GPIO_ReadPin(BUTTON_PORT, BUTTON_PIN) == GPIO_PIN_RESET);`, note: "Translate electrical polarity once at the BSP boundary; the application uses logical pressed." }
    ],
    practice: ["Find VIH, VIL and current limits in the datasheet for any microcontroller you can access.", "Calculate LED current for 330 ohms using 3.3 V and 2.0 V.", "Draw two open-drain devices and one pull-up resistor."],
    quiz: { q: "What does an open-drain output do for logical high?", options: ["Actively drives the supply", "Releases the line so a pull-up can raise it", "Shorts power to ground", "Disables C"], answer: 1, why: "The shared pull-up creates high; devices actively assert only low." }
  },
  {
    id: "fixed-point", category: "Hardware foundations", title: "Binary fractions and fixed-point arithmetic", time: "65 min", level: "Intermediate", source: "Book Ch. 1.5 and 10.3, pp. 64-83 and 639-640",
    lede: "Fixed-point arithmetic represents fractional engineering values with integers and an agreed scale.",
    objectives: ["Choose a scale and range", "Multiply/divide with wide intermediates", "Track units and quantization error"],
    sections: [
      { heading: "The binary point is an agreement", html: `<p>In Q16.16, a signed 32-bit integer uses 16 fractional bits. Stored 65536 represents 1.0. The CPU performs integer arithmetic; your code interprets the scale.</p>` },
      { heading: "Range versus precision", html: `<p>More fractional bits improve resolution but leave fewer integer bits for range. Analyze the largest input, intermediate and accumulated value before selecting a format.</p>` },
      { heading: "Multiplication changes scale", html: `<p>Multiplying two Q16.16 values produces a Q32.32 intermediate. Use 64 bits, then shift right 16 with a deliberate rounding policy. Saturate if wraparound is unacceptable.</p>` },
      { heading: "Units are another scale", html: `<p>Millivolts, microseconds and milli-degrees are decimal fixed-point conventions. Put units in names and APIs; never add millivolts to raw ADC codes.</p>` }
    ],
    examples: [
      { title: "Q16.16 multiply", code: `typedef int32_t q16_t;\n\nq16_t q16_mul(q16_t a, q16_t b)\n{\n    int64_t product = (int64_t)a * b;\n    return (q16_t)((product + (1LL << 15)) >> 16);\n}`, note: "The added half-LSB implements positive-value rounding; signed symmetric rounding needs more care." },
      { title: "ADC to millivolts", code: `uint32_t millivolts = ((uint32_t)raw * vref_mv + 2047U) / 4095U;`, note: "The half-denominator term rounds instead of truncating." }
    ],
    practice: ["Encode 1.5 and -2.25 in Q16.16.", "Determine the Q16.16 numeric range.", "Write a saturating add and test both limits."],
    quiz: { q: "Why use a wider intermediate for fixed-point multiplication?", options: ["The product needs roughly the sum of operand widths", "To enable UART", "Because pointers are always 64-bit", "To avoid headers"], answer: 0, why: "A narrow product would overflow before rescaling." }
  },
  {
    id: "keypads-events", category: "Interfaces extended", title: "Buttons, key matrices and event design", time: "55 min", level: "Intermediate", source: "Book Ch. 4.10, pp. 330-336",
    lede: "A keypad is more than GPIO: it combines scanning, electrical states, debounce, rollover policy and application events.",
    objectives: ["Scan a row-column matrix", "Debounce without blocking", "Define ghosting and rollover behavior"],
    sections: [
      { heading: "Matrix scanning", html: `<p>Drive one row active at a time and read columns. A closed switch connects the active row to a column, identifying coordinates with fewer pins than one pin per key.</p>` },
      { heading: "Settle before sampling", html: `<p>Changing row drive creates finite electrical settling time. A scheduler can separate drive and sample phases or use a short documented hardware delay.</p>` },
      { heading: "Ghosting", html: `<p>Multiple pressed keys can create unintended current paths in a diode-less matrix. Decide whether to reject ambiguous combinations, add per-key diodes, or support limited rollover.</p>` },
      { heading: "Emit semantic events", html: `<p>The scanner owns electrical details and emits KEY_DOWN/KEY_UP with a key code. The calculator app should never know row pins or debounce counters.</p>` }
    ],
    examples: [
      { title: "Coordinate to key", code: `static const char keymap[4][3] = {\n    {'1','2','3'}, {'4','5','6'},\n    {'7','8','9'}, {'*','0','#'}\n};\nchar key = keymap[row][column];`, note: "Validate row and column before indexing." },
      { title: "One phase per scheduler tick", code: `drive_row(current_row);\ncolumns = read_columns();\nupdate_debounce(current_row, columns);\ncurrent_row = (current_row + 1U) % ROWS;`, note: "The full keyboard sample period is scheduler period × row count." }
    ],
    practice: ["Draw the current path for one pressed key.", "Calculate full scan rate for four rows sampled every 1 ms.", "Define behavior when three keys cause an ambiguous pattern."],
    quiz: { q: "Why use a matrix for many keys?", options: ["It reduces required GPIO pins", "It removes all debounce", "It provides analog output", "It increases Flash"], answer: 0, why: "Rows plus columns replace one dedicated pin per key." }
  },
  {
    id: "serial-electrical", category: "Interfaces extended", title: "RS-232, RS-485 and differential links", time: "60 min", level: "Intermediate", source: "Book Ch. 7.2-7.4, pp. 467-483",
    lede: "UART describes bits and timing at the peripheral. RS-232 and RS-485 describe electrical ways to carry those bits through the real world.",
    objectives: ["Separate UART framing from line standard", "Explain differential noise rejection", "Design direction and termination policy for RS-485"],
    sections: [
      { heading: "Protocol layer versus electrical layer", html: `<p>Microcontroller UART pins use logic-level voltages. Connecting them directly to legacy RS-232 voltage levels can damage the MCU. A transceiver converts voltage and drive characteristics.</p>` },
      { heading: "Differential signaling", html: `<p>A receiver decides from the voltage difference between two wires. Noise coupled similarly onto both wires is largely rejected. Twisted pairs help both wires experience similar interference.</p>` },
      { heading: "RS-485 shared bus", html: `<p>Half-duplex nodes share a differential pair. Firmware controls driver enable, waits until the final stop bit has physically shifted out, then releases the bus. Termination and biasing are board-level decisions.</p>` },
      { heading: "Build a packet above bytes", html: `<p>Add address, length, message type, payload and error check. Define escaping or framing so a receiver can recover after a lost byte.</p>` }
    ],
    examples: [
      { title: "Direction timing sketch", code: `rs485_driver_enable(true);\nuart_write(frame, length);\nuart_wait_transmission_complete(); // shift register empty, not just FIFO\nrs485_driver_enable(false);`, note: "Dropping enable when only the data register is empty can cut off the last byte." },
      { title: "Simple packet fields", code: `typedef struct {\n    uint8_t address, type, length;\n    uint8_t payload[32];\n    uint16_t crc;\n} packet_model_t;`, note: "Serialize fields explicitly; do not transmit the padded struct image." }
    ],
    practice: ["Explain why UART TX cannot directly drive RS-232.", "Identify where termination belongs on a bus.", "Design a receiver timeout and resynchronization rule."],
    quiz: { q: "What must firmware wait for before disabling an RS-485 transmitter?", options: ["The transmit shift register to finish", "main to return", "ADC calibration", "Heap allocation"], answer: 0, why: "FIFO/data-register empty may occur before the final bits leave the pin." }
  },
  {
    id: "analog-circuits", category: "Interfaces extended", title: "Resistors, capacitors, op-amps and filters", time: "75 min", level: "Intermediate", source: "Book Ch. 8.1-8.3, pp. 531-557",
    lede: "The ADC only sees the voltage presented to its pin. Analog circuits scale, bias, buffer and filter the physical signal before software receives a number.",
    objectives: ["Analyze simple RC behavior", "Recognize common op-amp configurations", "Connect analog bandwidth to sampling"],
    sections: [
      { heading: "RC time constant", html: `<p>A resistor-capacitor network has time constant <code>τ = RC</code>. A first-order low-pass cutoff is approximately <code>1/(2πRC)</code>. Real components have tolerance and source/load interaction.</p>` },
      { heading: "Op-amp assumptions and limits", html: `<p>Ideal analysis assumes infinite gain, no input current and output that enforces feedback. Real op-amps have input/output range, bandwidth, slew rate, offset, noise and stability constraints.</p>` },
      { heading: "Useful configurations", html: `<p>A voltage follower buffers a high-impedance source. A non-inverting amplifier scales without inversion. A differential stage rejects shared voltage. Verify rail-to-rail claims at your supply and load.</p>` },
      { heading: "Anti-alias filter", html: `<p>Frequencies above half the sample rate can appear as false lower frequencies. Analog filtering before the ADC limits out-of-band energy; digital filtering afterward cannot reconstruct what aliased.</p>` }
    ],
    examples: [
      { title: "Choose an RC cutoff", code: `// R = 10 kohm, C = 100 nF\n// tau = 10,000 * 0.0000001 = 0.001 s\n// fc ~= 1 / (2*pi*0.001) ~= 159 Hz`, note: "Check ADC source-impedance guidance; 10 kΩ may require longer acquisition time." },
      { title: "First-order IIR in fixed point", code: `// y += alpha * (x - y), alpha in Q15\nint32_t delta = input - state;\nstate += (alpha_q15 * delta) >> 15;`, note: "Derive alpha from sample rate and desired cutoff; analyze intermediate range." }
    ],
    practice: ["Calculate cutoff for 1 kΩ and 1 µF.", "Find your ADC's recommended source impedance/sample time relationship.", "Explain in words why aliasing cannot be fixed after sampling."],
    quiz: { q: "What is the purpose of an analog anti-alias filter?", options: ["Reduce signal content above the representable sample bandwidth", "Increase pointer size", "Format UART strings", "Allocate RAM"], answer: 0, why: "It limits high-frequency energy before irreversible sampling ambiguity." }
  },
  {
    id: "usb-overview", category: "Interfaces extended", title: "USB without hand-waving", time: "65 min", level: "Advanced overview", source: "Book Ch. 7.7, pp. 516-522",
    lede: "USB is a host-controlled, descriptor-driven protocol stack—not simply a faster UART connector.",
    objectives: ["Explain host/device roles and enumeration", "Recognize endpoint and transfer concepts", "Choose a class before writing low-level USB code"],
    sections: [
      { heading: "The host schedules the bus", html: `<p>Devices respond to host transactions. On connection/reset, the host learns descriptors, assigns an address and selects a configuration. A device that cannot answer control endpoint requests will not enumerate.</p>` },
      { heading: "Descriptors describe capability", html: `<p>Device, configuration, interface and endpoint descriptors form a structured declaration. Lengths and counts must agree exactly; a single malformed byte can produce opaque host errors.</p>` },
      { heading: "Endpoints and transfer types", html: `<p>Control handles configuration. Bulk favors reliable throughput, interrupt favors bounded polling intervals for small data, and isochronous favors timely streams without retry guarantees.</p>` },
      { heading: "Use a class when possible", html: `<p>CDC can look like a virtual serial port; HID works for keyboards and custom reports; MSC exposes block storage. Vendor middleware handles protocol state, but you still need to understand buffers and callbacks.</p>` }
    ],
    examples: [
      { title: "Descriptor length mindset", code: `// Conceptual descriptor header\ntypedef struct {\n    uint8_t length;\n    uint8_t descriptor_type;\n} descriptor_header_t;`, note: "Actual USB descriptors are byte-defined wire formats; serialize using specification layouts." },
      { title: "Callback boundary", code: `void usb_rx_callback(const uint8_t *data, size_t length)\n{\n    // Copy/enqueue quickly; parse commands in foreground context.\n}`, note: "Know whether middleware invokes callbacks from interrupt context." }
    ],
    practice: ["Compare CDC, HID and bulk vendor-specific choices for a debug console.", "Draw enumeration as a request-response sequence.", "Explain why USB data should enter a bounded queue."],
    quiz: { q: "Who normally schedules USB transfers?", options: ["The host", "Any device at any time", "The linker", "GPIOA"], answer: 0, why: "USB is centrally scheduled by the host/controller." }
  },
  {
    id: "wireless-iot", category: "Interfaces extended", title: "Wireless, packets and IoT systems", time: "70 min", level: "Advanced overview", source: "Book Ch. 11, pp. 682-716",
    lede: "A radio link is a lossy, shared system with energy, security, latency and update consequences far beyond sending a byte.",
    objectives: ["Build layered packet reasoning", "Design for loss, duplication and reordering", "Recognize security and update requirements"],
    sections: [
      { heading: "Layer responsibilities", html: `<p>Physical modulation carries symbols; link layers frame local packets; network layers route; transport/application layers define end-to-end meaning. Debug the lowest failed layer first.</p>` },
      { heading: "Packets fail normally", html: `<p>Wireless systems experience interference, fading and contention. Include sequence numbers, checks, timeouts and retry limits. Make commands idempotent where duplicates would be dangerous.</p>` },
      { heading: "Energy belongs in the protocol", html: `<p>Radio transmit/receive current can dominate battery life. Batch data, negotiate intervals and sleep intentionally. More retries can improve delivery while destroying energy budget and latency.</p>` },
      { heading: "Security is a system property", html: `<p>Authenticate commands, protect keys, prevent replay, validate update images and plan key rotation. Encryption without identity does not prove who sent a packet.</p>` }
    ],
    examples: [
      { title: "Versioned message model", code: `typedef struct {\n    uint8_t version;\n    uint8_t type;\n    uint16_t sequence;\n    uint32_t device_id;\n    uint8_t payload[16];\n} message_model_t;`, note: "Define explicit serialization, authentication and byte order separately." },
      { title: "Idempotent actuator command", code: `// Prefer: SET_LED(state=true, command_id=42)\n// Riskier: TOGGLE_LED(command_id=42)\n// A duplicated SET is harmless; a duplicated TOGGLE reverses itself.`, note: "Protocol semantics can remove whole classes of retry bugs." }
    ],
    practice: ["Design a packet that detects duplicates.", "Estimate average radio current from advertising/connection duty cycle.", "List threats for an unauthenticated remote firmware update."],
    quiz: { q: "Why is SET often safer than TOGGLE over an unreliable link?", options: ["SET can be idempotent when duplicated", "TOGGLE uses no bits", "SET needs no authentication", "Radios only send SET"], answer: 0, why: "Repeating the same desired-state command does not reverse the result." }
  },
  {
    id: "verification-ethics", category: "System mastery", title: "Verification, safety and engineering ethics", time: "70 min", level: "Advanced", source: "Book Ch. 1.3 and 1.6; Ch. 9, pp. 35-49, 84-87 and 595-618",
    lede: "The final firmware obligation is not clever code. It is justified confidence that the system satisfies requirements and fails without hiding danger.",
    objectives: ["Turn hazards into requirements and tests", "Use traceability and independent evidence", "Communicate limitations honestly"],
    sections: [
      { heading: "Verification versus validation", html: `<p>Verification asks whether the implementation meets its specification. Validation asks whether the specified system solves the real user need. Passing the wrong requirements is still failure.</p>` },
      { heading: "Hazard-driven design", html: `<p>Identify hazardous outcomes, causes, mitigations and residual risk. Use redundancy carefully: two copies of the same flawed assumption are not independent protection.</p>` },
      { heading: "Traceability", html: `<p>Connect each safety or performance requirement to design elements and tests. When code changes, traceability shows which evidence must be repeated.</p>` },
      { heading: "Honest interfaces", html: `<p>Expose sensor invalidity, stale data and uncertainty. Do not render an old value as current truth. Report known limitations, protect user data and resist pressure to conceal defects.</p>` }
    ],
    examples: [
      { title: "Measurement with validity", code: `typedef struct {\n    int32_t value_milliunits;\n    uint32_t timestamp_ms;\n    bool valid;\n    uint8_t quality;\n} measurement_t;`, note: "A number alone cannot communicate stale, saturated or failed sensing." },
      { title: "Requirement-to-test example", code: `// Requirement: button press updates highlight within 50 ms.\n// Instrument: input edge on channel 1, display DC/SPI completion on channel 2.\n// Test: 100 presses across voltage/temperature limits; record worst case.`, note: "The test defines observable start, end, environment and acceptance threshold." }
    ],
    practice: ["Write three measurable requirements for a small embedded UI.", "Create one hazard/mitigation/test chain.", "Design how the UI distinguishes stale sensor data."],
    quiz: { q: "What does validation ask?", options: ["Whether the designed system meets the real need", "Whether code has semicolons", "Whether Flash is black", "Whether all variables are global"], answer: 0, why: "A perfectly verified implementation can still implement an inadequate requirement." }
  }
];

const MASTER_LESSONS = [
  {
    id: "recursion-stack", category: "Professional C", title: "Recursion and stack discipline", time: "45 min", level: "Intermediate", source: "C functions; embedded stack analysis",
    lede: "Recursion is elegant when a problem is recursively structured, but every active call consumes bounded stack that firmware must budget.",
    objectives: ["Trace recursive calls and base cases", "Estimate stack growth", "Replace recursion when worst-case depth is unsafe"],
    sections: [
      { heading: "A base case stops expansion", html: `<p>A recursive function solves a smaller instance and must reach a non-recursive base case. Prove that each call moves toward it. Missing or unreachable base cases become stack exhaustion.</p>` },
      { heading: "Each call has state", html: `<p>Return address, saved registers, parameters and local variables may occupy a stack frame. Compiler optimization changes exact size, so inspect generated code and linker stack bounds for critical systems.</p>` },
      { heading: "Interrupts share or add stack demand", html: `<p>On Cortex-M exception entry pushes a hardware frame. Nested interrupts add frames at the deepest foreground call chain. Worst-case stack analysis must include this concurrency.</p>` },
      { heading: "Iterative alternatives", html: `<p>A loop or explicit fixed-capacity work stack can make memory bounds visible. Prefer clarity, but do not accept unbounded recursion in a hard real-time path.</p>` }
    ],
    examples: [
      { title: "Trace factorial", code: `uint32_t factorial(uint32_t n)\n{\n    if (n <= 1U) return 1U;\n    return n * factorial(n - 1U);\n}`, note: "This overflows uint32_t quickly and depth depends on n; it is a teaching example, not a robust general API." },
      { title: "Bounded iterative form", code: `bool factorial_checked(uint32_t n, uint32_t *out)\n{\n    if (out == NULL || n > 12U) return false;\n    uint32_t value = 1U;\n    for (uint32_t i = 2U; i <= n; ++i) value *= i;\n    *out = value;\n    return true;\n}`, note: "The bound addresses both overflow and execution time." }
    ],
    practice: ["Draw active calls for factorial(4).", "Convert recursive Fibonacci to an iterative form.", "Inspect Arm assembly and identify stack-pointer adjustments."],
    quiz: { q: "What makes recursive depth dangerous in embedded firmware?", options: ["Each active call can consume finite stack", "Recursion disables C", "It always uses Flash only", "It cannot return"], answer: 0, why: "Unbounded depth can exhaust RAM-backed stack and corrupt state." }
  },
  {
    id: "stdlib-streams", category: "Professional C", title: "The standard library and embedded substitutes", time: "55 min", level: "Intermediate", source: "Hosted versus freestanding C environments",
    lede: "The C standard defines both hosted and freestanding environments. Embedded systems deliberately provide only the services their platform supports.",
    objectives: ["Distinguish hosted and freestanding implementations", "Use memory/string functions with contracts", "Replace file/process assumptions with device abstractions"],
    sections: [
      { heading: "Hosted and freestanding", html: `<p>A hosted implementation supplies full runtime facilities and hosted <code>main</code>. A freestanding implementation guarantees a smaller library core and may enter through implementation-defined startup. Arm bare-metal GCC plus newlib often supplies library code whose system calls still need retargeting.</p>` },
      { heading: "Memory functions are byte tools", html: `<p><code>memcpy</code> requires valid non-overlapping regions; <code>memmove</code> supports overlap; <code>memset</code> fills bytes, not typed integer values. Every call needs proven sizes.</p>` },
      { heading: "Files may be devices or Flash records", html: `<p>A tiny MCU may have no filesystem. Configuration can live in internal Flash with erase/program constraints, version, CRC and wear policy. SD cards add a block device and filesystem stack.</p>` },
      { heading: "Retarget intentionally", html: `<p>Implementing <code>_write</code> can route printf to UART. Decide blocking behavior, ISR legality, newline policy and failure result. A familiar API does not erase underlying device timing.</p>` }
    ],
    examples: [
      { title: "Overlap requires memmove", code: `char text[] = "ABCDE";\nmemmove(&text[1], &text[0], 4U); // result begins AABCD`, note: "memcpy would have undefined behavior because source and destination overlap." },
      { title: "Versioned Flash record", code: `typedef struct {\n    uint32_t magic, version;\n    settings_t settings;\n    uint32_t crc;\n} settings_record_t;`, note: "Serialization, padding, atomic update and erase wear still require explicit design." }
    ],
    practice: ["State the contracts of memcpy and memmove.", "Design two-slot power-fail-safe settings storage.", "List what printf requires beneath it on a bare microcontroller."],
    quiz: { q: "Why might printf link but still not produce output on bare metal?", options: ["Its low-level write system call has not been retargeted to hardware", "C has no strings", "GPIO is analog", "The linker cannot use functions"], answer: 0, why: "Formatting can exist while the platform-specific output route is absent." }
  },
  {
    id: "dma", category: "System mastery", title: "DMA: moving data without moving the CPU", time: "65 min", level: "Advanced", source: "Advanced synchronization extension",
    lede: "DMA transfers data between peripherals and memory while the CPU performs other work, but buffer ownership and completion become concurrent.",
    objectives: ["Configure source, destination, count and trigger", "Design DMA buffer ownership", "Handle completion, error and cache/coherency concerns"],
    sections: [
      { heading: "A programmable transfer engine", html: `<p>DMA needs addresses, transfer direction, element width, count, increment policy, request source and priority. A peripheral event triggers each beat or a stream.</p>` },
      { heading: "Ownership states", html: `<p>Once DMA owns a transmit buffer, foreground code must not modify it until completion. For receive double buffering, one buffer fills while software processes the other.</p>` },
      { heading: "Completion is synchronization", html: `<p>The DMA interrupt clears flags, records completion and wakes/dequeues foreground work. Handle transfer error; do not treat every interrupt as success.</p>` },
      { heading: "Performance is more than bandwidth", html: `<p>DMA reduces CPU work but adds setup latency and bus contention. Small transfers may be faster with polling. Measure break-even size and account for memory/cache rules on the actual core.</p>` }
    ],
    examples: [
      { title: "Explicit display transfer state", code: `typedef enum { DISPLAY_IDLE, DISPLAY_DMA_ACTIVE, DISPLAY_ERROR } display_state_t;\nstatic volatile display_state_t state;\n\nbool display_submit(const uint8_t *pixels, size_t bytes)\n{\n    if (state != DISPLAY_IDLE) return false;\n    state = DISPLAY_DMA_ACTIVE;\n    return spi_dma_start(pixels, bytes);\n}`, note: "The caller must keep pixels unchanged until completion." },
      { title: "Double-buffer ownership", code: `// DMA owns fill_buffer; application owns ready_buffer.\n// Completion swaps roles atomically, then signals processing.`, note: "Write the ownership diagram before writing callbacks." }
    ],
    practice: ["Draw buffer ownership across submit, transfer and completion.", "Define recovery for a DMA transfer error.", "Measure polling versus DMA for 2, 32 and 4096 bytes."],
    quiz: { q: "May application code modify a DMA transmit buffer during transfer?", options: ["No, not unless the design explicitly supports coherent streaming", "Always", "Only because it is volatile", "DMA has no memory access"], answer: 0, why: "Concurrent modification can put inconsistent bytes on the wire." }
  },
  {
    id: "watchdog-faults", category: "System mastery", title: "Watchdogs, resets and fault recovery", time: "65 min", level: "Advanced", source: "Book system-level design and debugging",
    lede: "A watchdog is not a timer you feed everywhere. It is independent evidence that the complete system still makes required progress.",
    objectives: ["Design meaningful watchdog service", "Record reset/fault cause", "Enter safe state before recovery"],
    sections: [
      { heading: "Progress, not activity", html: `<p>Feed the watchdog only after critical tasks have each reported healthy progress. Feeding from a periodic interrupt can hide a deadlocked foreground forever.</p>` },
      { heading: "Reset cause is evidence", html: `<p>Read and preserve reset flags early, before initialization clears them. Maintain a boot counter and compact fault record with integrity protection when appropriate.</p>` },
      { heading: "HardFault forensics", html: `<p>Capture stacked PC/LR and SCB fault-status registers. Avoid doing complex logging from a corrupted context; store a bounded record and reset or halt according to product safety policy.</p>` },
      { heading: "Recovery has limits", html: `<p>Repeated reboot loops can drain batteries or rapidly cycle actuators. Use backoff, retry limits and a safe degraded mode. A watchdog cannot fix unsafe output hardware.</p>` }
    ],
    examples: [
      { title: "Health-vote idea", code: `if (input_alive && ui_alive && comms_alive) {\n    watchdog_refresh();\n    input_alive = ui_alive = comms_alive = false;\n}`, note: "Use atomic/critical handling if tasks update flags concurrently, and choose the review window from deadlines." },
      { title: "Persistent reset record", code: `typedef struct { uint32_t magic, boot_count, reset_flags, fault_pc, crc; } reset_record_t;`, note: "Place storage where the selected reset type preserves it and validate before use." }
    ],
    practice: ["Design a watchdog voting window for a set of periodic tasks.", "List reset causes worth showing in a debug screen.", "Define safe outputs during repeated boot failure."],
    quiz: { q: "Why is feeding a watchdog unconditionally from SysTick weak?", options: ["SysTick may continue while useful work is deadlocked", "SysTick cannot call functions", "Watchdogs use strings", "It increases Flash"], answer: 0, why: "The feed proves interrupt activity, not end-to-end progress." }
  },
  {
    id: "clock-rtc", category: "System mastery", title: "Clock trees, RTC and timekeeping", time: "70 min", level: "Advanced", source: "Book Ch. 2.5-2.6 and timer chapters",
    lede: "The CPU clock, peripheral clocks, timer clocks and civil time are related but different systems with different accuracy and power tradeoffs.",
    objectives: ["Trace a clock tree", "Separate monotonic time from calendar time", "Handle drift, synchronization and low-power continuity"],
    sections: [
      { heading: "Oscillator to peripheral", html: `<p>Sources such as MSI, HSI, HSE, LSI and LSE feed muxes, PLLs and prescalers. Peripheral kernels may select independent sources. Derive frequency along the exact configured path.</p>` },
      { heading: "Clock startup and failure", html: `<p>External crystals need startup time and can fail. Firmware should bound readiness waits and choose fallback policy. Flash latency and voltage range constrain maximum system frequency.</p>` },
      { heading: "Monotonic versus wall clock", html: `<p>Scheduling needs a monotonic counter that never jumps backward. User time-of-day can be corrected, time-zoned and synchronized. Do not use adjustable calendar time for deadlines.</p>` },
      { heading: "Drift and calibration", html: `<p>Crystal tolerance in ppm accumulates error. Temperature and aging matter. Store synchronization points and calibrate gently rather than creating backward jumps in monotonic event order.</p>` }
    ],
    examples: [
      { title: "Convert ppm to daily error", code: `// 20 ppm * 86400 seconds/day = 1.728 seconds/day worst-case scale`, note: "Actual sign and environment vary; this estimates magnitude." },
      { title: "Deadline uses monotonic time", code: `if ((int32_t)(monotonic_ms() - deadline_ms) >= 0) run_task();`, note: "Calendar corrections must not affect this comparison." }
    ],
    practice: ["Trace your current MSI 4 MHz configuration to SysTick.", "Estimate monthly drift at 20 ppm.", "Design behavior when LSE fails at boot."],
    quiz: { q: "Should adjustable calendar time drive short task deadlines?", options: ["No, use monotonic time", "Always", "Only after printf", "Only in Flash"], answer: 0, why: "Wall-clock corrections can jump and violate elapsed-time ordering." }
  },
  {
    id: "rtos", category: "System mastery", title: "Preemptive RTOS internals", time: "80 min", level: "Advanced", source: "Book thread/interrupt foundations; advanced RTOS extension",
    lede: "A preemptive RTOS gives each thread a stack and lets higher-priority ready work interrupt lower-priority work. That power creates new races and timing failure modes.",
    objectives: ["Explain context switching and thread states", "Use mutex, semaphore and queue appropriately", "Recognize priority inversion and stack risk"],
    sections: [
      { heading: "Thread context", html: `<p>A switch preserves registers and stack pointer, selects another ready thread, and restores its context. On Cortex-M, PendSV is commonly used for deferred low-priority context switching.</p>` },
      { heading: "Blocking changes scheduling", html: `<p>A blocked thread consumes no CPU until an event or timeout makes it ready. The scheduler chooses among ready threads using policy and priority.</p>` },
      { heading: "Synchronization primitives", html: `<p>A mutex protects ownership and may support priority inheritance. A semaphore counts events/resources. A queue transfers data and ownership. Choosing by name rather than semantics creates bugs.</p>` },
      { heading: "Priority inversion and deadlines", html: `<p>A high-priority thread can wait behind a low-priority mutex owner while medium work runs. Priority inheritance reduces this bounded inversion. Rate and deadline analysis still require execution-time measurements.</p>` }
    ],
    examples: [
      { title: "Prefer message ownership", code: `sensor_task -> measurement_queue -> ui_task\n// UI state has one owner; sensor task sends immutable measurements.`, note: "Queues often produce simpler invariants than a shared global protected everywhere." },
      { title: "Thread stack budget", code: `stack_required = deepest_call_chain + local_arrays + saved_context + nested_interrupt_margin;`, note: "Measure high-water marks, but also reason about paths not yet observed." }
    ],
    practice: ["Draw READY/RUNNING/BLOCKED transitions.", "Choose mutex, semaphore or queue for three scenarios.", "Construct a priority-inversion timeline."],
    quiz: { q: "What is a mutex primarily for?", options: ["Exclusive ownership of a shared resource/invariant", "Counting ADC bits", "Formatting strings", "Generating PWM"], answer: 0, why: "Mutex semantics model one owner and can integrate priority inheritance." }
  },
  {
    id: "boot-security", category: "System mastery", title: "Bootloaders, updates and secure firmware", time: "85 min", level: "Advanced", source: "Production systems extension",
    lede: "Once firmware can update itself, power loss, authenticity, rollback and recovery become part of the boot path.",
    objectives: ["Design image validation and handoff", "Plan power-fail-safe updates", "Separate authenticity, integrity and confidentiality"],
    sections: [
      { heading: "Boot decision", html: `<p>A bootloader validates image metadata, bounds, target compatibility, integrity and signature before execution. Then it disables/returns peripherals to known state, sets vector table/stack as required and transfers control.</p>` },
      { heading: "Power can fail anywhere", html: `<p>A/B slots or download-then-swap schemes preserve one bootable image. State transitions must be atomic enough to recover after reset at every write boundary.</p>` },
      { heading: "Cryptographic roles", html: `<p>A hash detects changes but not a malicious replacement when the attacker can replace the hash. A digital signature authenticates an approved signer. Encryption hides content; it does not alone prove origin.</p>` },
      { heading: "Rollback and key lifecycle", html: `<p>An authentic older image may contain a known vulnerability. Use monotonic version policy where required, protect keys, plan revocation and provide a recoverable manufacturing/debug process.</p>` }
    ],
    examples: [
      { title: "Image manifest model", code: `typedef struct {\n    uint32_t magic, format_version, image_size, firmware_version;\n    uint8_t image_hash[32];\n    uint8_t signature[64];\n} image_manifest_t;`, note: "Exact formats and algorithms require a reviewed cryptographic design and hardware capabilities." },
      { title: "Commit-last update state", code: `// 1 erase inactive slot\n// 2 program image and manifest\n// 3 verify entire image\n// 4 atomically mark candidate\n// 5 reboot, self-test, then confirm`, note: "Never mark incomplete bytes as bootable." }
    ],
    practice: ["Draw reset points during an A/B update.", "Explain why CRC is insufficient for malicious updates.", "Define what happens when a candidate image fails self-test."],
    quiz: { q: "What proves an update came from an authorized signer?", options: ["A verified digital signature", "A plain CRC", "File size", "UART baud rate"], answer: 0, why: "A CRC detects accidental changes, not an attacker who can recompute it." }
  },
  {
    id: "optimization", category: "System mastery", title: "Performance optimization with proof", time: "70 min", level: "Advanced", source: "System-level performance synthesis",
    lede: "Optimization begins with a measured bottleneck and ends with preserved correctness—not clever-looking C.",
    objectives: ["Measure time, memory and energy separately", "Read generated assembly without worshipping it", "Choose algorithm, transfer and compiler optimizations in order"],
    sections: [
      { heading: "Define the budget", html: `<p>Is the failure latency, throughput, Flash, RAM, stack, or energy? Improving one can worsen another. Record a before measurement and acceptance target.</p>` },
      { heading: "Algorithm before instruction", html: `<p>Dirty rectangles beat micro-optimizing a full-screen loop. DMA beats repeatedly polling large transfers. A lookup table trades Flash for CPU. Fix the amount of work before tuning each operation.</p>` },
      { heading: "Compiler optimization levels", html: `<p><code>-O0</code> is transparent for early debugging but slow and large. <code>-Og</code> balances debugging. <code>-O2</code> is common production territory. Undefined behavior may appear only after optimization because the compiler assumes valid C.</p>` },
      { heading: "Inspect and remeasure", html: `<p>Use cycle counters, GPIO pulses, map files and assembly output. Preserve tests. Document why a non-obvious optimization is safe and which measurement justified it.</p>` }
    ],
    examples: [
      { title: "Reduce display work", code: `// Full frame: 128 * 160 * 2 = 40960 bytes\n// Clock widget: 70 * 20 * 2 = 2800 bytes\n// Dirty update sends about 14.6x fewer pixel bytes.`, note: "Architecture dominates instruction-level tuning here." },
      { title: "Compare generated assembly", code: `uint32_t scale(uint32_t x)\n{\n    return (x * 10U) / 8U;\n}`, note: "With an appropriate local toolchain, compare host and target assembly; then change constants and observe what optimization simplifies." }
    ],
    practice: ["Measure full-screen versus dirty-region transfer time.", "Compare -O0 and -O2 assembly outside the page.", "Write a performance claim with metric, workload and hardware conditions."],
    quiz: { q: "What should happen before optimizing a function?", options: ["Measure and identify the relevant bottleneck/budget", "Remove all comments", "Use macros everywhere", "Disable warnings"], answer: 0, why: "Without a defined bottleneck, optimization is guesswork and may harm the real constraint." }
  }
];

COURSE.lessons = [
  ...FOUNDATION_LESSONS,
  ...CORE_C_LESSONS,
  ...SUPPLEMENT_LESSONS,
  ...MASTER_LESSONS,
  ...COURSE.lessons
];
