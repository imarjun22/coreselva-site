/* Focused C topics and course ordering informed by the W3Schools topic ladder. */
const FOCUSED_C_LESSONS = [
  {
    id: "comments", title: "Comments and readable statements", source: "C language foundations",
    lede: "Comments preserve intent; statements express actions. Good formatting makes control flow visible before the code runs.",
    objectives: ["Write line and block comments", "Distinguish comments from executable statements", "Explain decisions instead of narrating syntax"],
    sections: [
      { heading: "Two comment forms", html: `<p><code>//</code> comments continue to the end of the line. <code>/* ... */</code> comments can span lines but do not nest portably. Comments are removed during translation and cannot repair unclear structure.</p>` },
      { heading: "What deserves a comment", html: `<p>Record hardware timing requirements, units, protocol reasons, workarounds and non-obvious invariants. Avoid comments that merely repeat the next statement.</p>` },
      { heading: "Statements and blocks", html: `<p>Many simple statements end with a semicolon. Braces group statements into one compound statement and create scope. Use braces consistently around controlled blocks.</p>` }
    ],
    examples: [
      { title: "Comment the reason", code: `// The sensor requires 10 ms after reset before its first command.\ndelay_ms(10U);`, note: "The comment preserves a device requirement that the function call alone cannot explain." },
      { title: "Do not hide code in a comment", code: `if (ready) {\n    start_transfer(); // The braces make ownership of this statement obvious.\n}`, note: "Commented-out code belongs in version history, not permanent source clutter." }
    ],
    practice: ["Improve three comments in an existing file.", "Explain why block comments cannot safely disable code containing another block comment.", "Add braces to every conditional in a small program."],
    quiz: { q: "What is the most useful purpose of a comment?", options: ["Explain a non-obvious reason or constraint", "Repeat every operator", "Replace function names", "Make invalid C compile"], answer: 0, why: "Durable comments preserve intent and constraints the code cannot express directly." }
  },
  {
    id: "type-conversion", title: "Type conversion and casts", source: "C arithmetic conversions",
    lede: "C converts values automatically in many expressions. Learn when value, range or precision changes before adding an explicit cast.",
    objectives: ["Distinguish implicit and explicit conversion", "Predict integer and floating division", "Recognize narrowing and signedness loss"],
    sections: [
      { heading: "Usual arithmetic conversions", html: `<p>Operands are promoted to compatible types before arithmetic. A floating operand usually causes floating arithmetic; two integers use integer arithmetic even when assigned to float afterward.</p>` },
      { heading: "Narrowing", html: `<p>Converting to a type with smaller range can change the value. Converting negative signed values to unsigned uses modular rules. A cast documents intent but does not make an out-of-range result safe.</p>` },
      { heading: "Cast at the right time", html: `<p><code>(float)(a / b)</code> performs integer division first. <code>(float)a / b</code> converts before division. Likewise, widen before a multiplication that might overflow.</p>` }
    ],
    examples: [
      { title: "Conversion timing", code: `#include <stdio.h>\n\nint main(void)\n{\n    int a = 7, b = 2;\n    printf("after: %.1f\\n", (float)(a / b));\n    printf("before: %.1f\\n", (float)a / b);\n}`, note: "Run it and explain why the results differ." },
      { title: "Widen the intermediate", code: `uint32_t product = (uint32_t)sample16 * scale16;`, note: "Casting the final result would not undo an already-overflowed 16-bit intermediate." }
    ],
    practice: ["Predict conversions in 5 / 2, 5 / 2.0 and (double)(5 / 2).", "Compile with -Wconversion locally and study each warning.", "Write a checked conversion from int to uint8_t."],
    quiz: { q: "What is the result of (float)(7 / 2)?", options: ["3.0", "3.5", "4.0", "Undefined"], answer: 0, why: "Integer division happens before the cast." }
  },
  {
    id: "constants", title: "Constants, literals and read-only data", source: "C constants and qualifiers",
    lede: "A meaningful constant replaces unexplained numbers and gives units, type and ownership a visible home.",
    objectives: ["Use const objects and enum constants", "Choose literal suffixes", "Separate compile-time configuration from mutable state"],
    sections: [
      { heading: "Literal types matter", html: `<p><code>1000</code>, <code>1000U</code>, <code>1000L</code>, <code>3.0</code> and <code>3.0f</code> have different types. Hex and binary-looking masks still need appropriate unsigned width.</p>` },
      { heading: "const is a promise through a name", html: `<p>A const-qualified object cannot be modified through that lvalue. It may be placed in read-only storage on an embedded target, but const primarily belongs to the language type system.</p>` },
      { heading: "Macros versus typed constants", html: `<p>Use enum constants for related integer choices, const objects for typed values, and macros where preprocessing is truly required. Give units in names such as <code>BUTTON_DEBOUNCE_MS</code>.</p>` }
    ],
    examples: [
      { title: "Typed, unit-bearing constants", code: `#include <stdint.h>\n\nstatic const uint32_t BUTTON_DEBOUNCE_MS = 20U;\nstatic const float ADC_REFERENCE_VOLTS = 3.3f;`, note: "Names, types and units make call sites easier to review." },
      { title: "Related integer constants", code: `enum { SCREEN_WIDTH = 128, SCREEN_HEIGHT = 160 };`, note: "Enum constants are integer constant expressions useful for array bounds." }
    ],
    practice: ["Replace five magic numbers with named constants.", "Add correct suffixes to unsigned masks.", "Explain why const does not automatically make shared data thread-safe."],
    quiz: { q: "Why include units in a constant name?", options: ["To prevent confusing incompatible quantities", "To change CPU architecture", "To allocate a heap", "To disable warnings"], answer: 0, why: "The compiler usually cannot distinguish milliseconds from microseconds when both are integers." }
  },
  {
    id: "booleans", title: "Booleans and logical expressions", source: "C truth and stdbool.h",
    lede: "C treats zero as false and nonzero as true. Clear boolean expressions turn measurements into understandable decisions.",
    objectives: ["Use bool, true and false", "Apply logical operators and short-circuiting", "Avoid accidental assignment in conditions"],
    sections: [
      { heading: "Truth in C", html: `<p>Include <code>&lt;stdbool.h&gt;</code> for <code>bool</code>, <code>true</code> and <code>false</code>. Comparisons produce 0 or 1, while an <code>if</code> accepts any scalar expression and treats nonzero as true.</p>` },
      { heading: "Compose conditions", html: `<p><code>&amp;&amp;</code> means logical AND, <code>||</code> logical OR, and <code>!</code> logical NOT. Name complex subconditions so policy reads like a sentence.</p>` },
      { heading: "Short-circuit safely", html: `<p>The right operand of <code>&amp;&amp;</code> is skipped when the left is false; the right of <code>||</code> is skipped when the left is true. This can guard pointer access and expensive checks.</p>` }
    ],
    examples: [
      { title: "Readable safety decision", code: `bool over_temperature = temperature_c >= 80;\nbool sensor_valid = age_ms < 1000U;\n\nif (sensor_valid && over_temperature)\n    fan_set(true);`, note: "Measurement validity and policy remain visible." },
      { title: "Guard a dereference", code: `if (device != NULL && device->ready)\n    device_start(device);`, note: "device->ready is not evaluated when device is NULL." }
    ],
    practice: ["Write a condition for valid voltage between inclusive limits.", "Simplify a nested if using named booleans.", "Compile if (x = 5) with warnings and explain the risk."],
    quiz: { q: "Which C values are false in a condition?", options: ["Only zero", "Only one", "All positive values", "All pointers"], answer: 0, why: "Zero is false; nonzero scalar values are true." }
  },
  {
    id: "break-continue", title: "break, continue and loop control", source: "C loop control",
    lede: "Loop-control statements are precise tools. Use them when they simplify the exit rule, not to create a maze.",
    objectives: ["Use break to leave the nearest loop or switch", "Use continue to begin the next iteration", "Replace flag-heavy searches with clear exits"],
    sections: [
      { heading: "break exits one construct", html: `<p>Inside a loop, <code>break</code> transfers control after the nearest loop. Inside switch, it prevents fallthrough. It does not automatically leave nested outer loops.</p>` },
      { heading: "continue skips the remainder", html: `<p>In a for loop, continue proceeds to the iteration expression and then rechecks the condition. In a while loop, it goes directly to the condition—so ensure required progress is not skipped.</p>` },
      { heading: "Prefer one obvious exit story", html: `<p>Early exit is often clearer for searches and validation. Multiple scattered exits become difficult when cleanup is required; centralize resource release where appropriate.</p>` }
    ],
    examples: [
      { title: "Search with break", code: `int found = -1;\nfor (size_t i = 0; i < count; ++i) {\n    if (values[i] == target) {\n        found = (int)i;\n        break;\n    }\n}`, note: "The loop stops as soon as the answer is known." },
      { title: "Skip invalid samples", code: `for (size_t i = 0; i < count; ++i) {\n    if (!samples[i].valid) continue;\n    sum += samples[i].value;\n    valid_count++;\n}`, note: "Continue keeps the normal path less indented." }
    ],
    practice: ["Find the first negative number in an array.", "Rewrite a loop using continue and compare readability.", "Explain continue behavior in for versus while."],
    quiz: { q: "What does break exit inside nested loops?", options: ["Only the nearest loop", "Every function", "The entire program", "All interrupts"], answer: 0, why: "Leaving multiple levels needs a different structure." }
  },
  {
    id: "user-input", title: "User input and validation", source: "Hosted C input; embedded command parsing",
    lede: "Input is not trustworthy merely because it came from a keyboard. Read within bounds, parse deliberately, and define rejection behavior.",
    objectives: ["Read a bounded line", "Validate conversion results and ranges", "Transfer the same pattern to UART commands"],
    sections: [
      { heading: "Why not blindly use scanf", html: `<p>Formatted input can leave unread characters, overflow destinations when widths are omitted, and make recovery awkward. For interactive text, reading a line and parsing it separates transport from interpretation.</p>` },
      { heading: "Validation has layers", html: `<p>Check that input arrived, syntax converted, the complete intended token was consumed, the numeric value fits, and the value is allowed by product policy.</p>` },
      { heading: "Embedded input is still a stream", html: `<p>UART bytes arrive over time. Buffer to a defined delimiter or packet length, detect overflow, then pass a complete bounded message to the parser outside the ISR.</p>` }
    ],
    examples: [
      { title: "Parse a bounded integer", code: `#include <errno.h>\n#include <limits.h>\n#include <stdlib.h>\n\nchar *end;\nerrno = 0;\nlong value = strtol(line, &end, 10);\nbool ok = end != line && *end == '\\0' && errno == 0 &&\n          value >= 0 && value <= 100;`, note: "A production parser also handles an optional trailing newline/space policy explicitly." },
      { title: "UART ownership path", code: `RX interrupt -> byte FIFO -> line assembler -> command parser -> application event`, note: "Each boundary has one job and a defined overflow behavior." }
    ],
    practice: ["Accept an integer from 1 through 10 and reject everything else.", "Define what happens when a UART line exceeds capacity.", "Separate transport errors from command syntax errors."],
    quiz: { q: "Why read a bounded line before parsing?", options: ["It separates safe acquisition from interpretation", "It makes pointers unnecessary", "It disables malformed input", "It guarantees every number is valid"], answer: 0, why: "Bounds prevent uncontrolled storage writes; parsing still must validate content." }
  },
  {
    id: "pointer-to-pointer", title: "Pointers to pointers", source: "C indirect ownership and output parameters",
    lede: "A pointer-to-pointer lets a function change which object a caller's pointer refers to, or traverse arrays of pointers.",
    objectives: ["Read T ** declarations", "Modify a caller's pointer safely", "Recognize arrays of strings and linked ownership"],
    sections: [
      { heading: "Two levels of indirection", html: `<p>If <code>int *p</code> points to int, then <code>int **pp</code> can point to p. <code>*pp</code> is p; <code>**pp</code> is the integer. Draw the boxes and arrows rather than memorizing stars.</p>` },
      { heading: "Changing a caller pointer", html: `<p>Because C passes pointer values by value, a function that must replace the caller's pointer receives its address. Allocation APIs often use this shape with a status return.</p>` },
      { heading: "Pointer arrays", html: `<p><code>char *argv[]</code> is adjusted to <code>char **argv</code> as a parameter. Each element points to a separate character sequence; the characters and pointer array have distinct ownership.</p>` }
    ],
    examples: [
      { title: "Return allocated storage through an output", code: `bool make_buffer(size_t count, uint8_t **out)\n{\n    if (out == NULL) return false;\n    *out = malloc(count);\n    return *out != NULL;\n}`, note: "The caller remains responsible for free; count zero needs an explicit policy." },
      { title: "Trace two stars", code: `int value = 7;\nint *p = &value;\nint **pp = &p;\n**pp = 9; // modifies value`, note: "Draw value <- p <- pp with arrows pointing left." }
    ],
    practice: ["Draw memory for value, p and pp.", "Write a function that sets a caller pointer to NULL.", "Explain why int ** is not generally interchangeable with const int **."],
    quiz: { q: "If pp has type int **, what is the type of *pp?", options: ["int *", "int", "int ***", "void"], answer: 0, why: "One dereference removes one pointer level." }
  },
  {
    id: "math-library", title: "Math functions and numerical cost", source: "C <math.h>; embedded numerical design",
    lede: "The standard math library is useful, but types, domains, linking, precision and target hardware determine its cost and behavior.",
    objectives: ["Use common math functions with correct types", "Handle domain/range concerns", "Choose float, double or fixed point intentionally"],
    sections: [
      { heading: "Functions and variants", html: `<p><code>sqrt</code>, <code>sin</code> and <code>fabs</code> operate on double; <code>sqrtf</code>, <code>sinf</code> and <code>fabsf</code> use float. Some toolchains require linking the math library explicitly.</p>` },
      { heading: "Domains and special values", html: `<p>Square root of a negative real input and division by zero need policy. Floating systems may produce NaN or infinity. Validate inputs and decide how invalid results propagate.</p>` },
      { heading: "Embedded performance", html: `<p>A Cortex-M4F can accelerate single-precision arithmetic, but transcendental functions still require library algorithms. Measure cost; use lookup/interpolation or fixed point only when justified.</p>` }
    ],
    examples: [
      { title: "Distance with float", code: `#include <math.h>\n\nfloat distance(float x, float y)\n{\n    return sqrtf(x * x + y * y);\n}`, note: "Large values can overflow the squared intermediate; numerical robustness still matters." },
      { title: "Clamp an acos input", code: `float cosine = dot / magnitudes;\ncosine = fminf(1.0f, fmaxf(-1.0f, cosine));\nfloat angle = acosf(cosine);`, note: "Rounding can otherwise push a theoretically valid cosine slightly outside the function domain." }
    ],
    practice: ["Compile a math example and inspect the link command.", "Compare float and fixed-point error for one sensor conversion.", "Define invalid-input behavior for square root."],
    quiz: { q: "Which function is the single-precision square root?", options: ["sqrtf", "sqrt", "root32", "powint"], answer: 0, why: "The f suffix selects the float variant." }
  },
  {
    id: "file-io", title: "Files, streams and persistent data", source: "Hosted C files; embedded storage comparison",
    lede: "Hosted C provides file streams. Embedded systems may instead use Flash records, EEPROM, SD cards or network storage with very different failure rules.",
    objectives: ["Open, read, write and close a hosted file", "Check every operation", "Translate file concepts to embedded nonvolatile storage"],
    sections: [
      { heading: "Streams and modes", html: `<p><code>fopen</code> returns a stream or NULL. Modes choose read, write, append and text/binary behavior. Closing flushes buffered data but does not guarantee physical media durability on every system.</p>` },
      { heading: "Check counts and errors", html: `<p><code>fread</code>/<code>fwrite</code> report items transferred. Partial operations are possible. Text parsing must handle malformed and truncated files.</p>` },
      { heading: "Microcontroller persistence", html: `<p>Internal Flash requires erase-before-write, has finite endurance, and can lose power mid-update. Use versioned records, integrity checks and a recoverable commit scheme.</p>` }
    ],
    examples: [
      { title: "Write and verify a text file", code: `FILE *file = fopen("settings.txt", "w");\nif (file == NULL) return ERROR_OPEN;\nif (fprintf(file, "brightness=%u\\n", brightness) < 0) {\n    fclose(file);\n    return ERROR_WRITE;\n}\nif (fclose(file) != 0) return ERROR_CLOSE;`, note: "Every file operation is checked. On a hosted system, choose a disposable test directory while learning." },
      { title: "Two-slot embedded commit", code: `write(inactive_slot, record_with_crc);\nverify(inactive_slot);\nmark_valid(inactive_slot);\ninvalidate(old_slot);`, note: "Each step must be designed for reset or power loss." }
    ],
    practice: ["Write a program that stores and reloads three integers.", "Handle a truncated file.", "Draw power-loss points in a two-slot Flash update."],
    quiz: { q: "What must be checked after fopen?", options: ["Whether the returned pointer is NULL", "GPIO speed", "The vector table", "PWM duty"], answer: 0, why: "Opening can fail and returns NULL." }
  },
  {
    id: "date-random", title: "Time, dates and random numbers", source: "C <time.h>/<stdlib.h>; embedded entropy",
    lede: "Calendar time, monotonic duration, pseudo-random sequences and cryptographic randomness are four different tools.",
    objectives: ["Use hosted time APIs carefully", "Distinguish wall and monotonic time", "Know why rand is not a security generator"],
    sections: [
      { heading: "Calendar time", html: `<p><code>time</code> and conversion functions work with implementation-defined calendar representations. Time zones, daylight rules and leap handling belong above simple elapsed-time scheduling.</p>` },
      { heading: "Pseudo-random sequences", html: `<p><code>rand</code> produces a deterministic implementation-defined sequence. <code>srand</code> selects its starting state. Modulo reduction can bias ranges and rand is unsuitable for keys, nonces or security decisions.</p>` },
      { heading: "Embedded entropy", html: `<p>A hardware RNG still needs health checking and vendor guidance. Timer jitter or ADC noise is not automatically good entropy. Separate simulation/test randomness from security requirements.</p>` }
    ],
    examples: [
      { title: "Deterministic test sequence", code: `#include <stdio.h>\n#include <stdlib.h>\n\nint main(void)\n{\n    srand(1234U);\n    for (int i = 0; i < 5; ++i) printf("%d\\n", rand());\n}`, note: "A fixed seed makes tests repeatable; values may differ across library implementations." },
      { title: "Monotonic elapsed time", code: `uint32_t elapsed = now_ms - start_ms;`, note: "For a wrapping unsigned counter, subtraction is the usual elapsed-time operation." }
    ],
    practice: ["Explain why wall-clock correction must not break a deadline.", "Use a fixed seed to reproduce a randomized test.", "List requirements for security-grade random numbers."],
    quiz: { q: "Is rand appropriate for cryptographic keys?", options: ["No", "Always", "Only with seed 1", "Only on embedded systems"], answer: 0, why: "It is a predictable non-cryptographic generator." }
  },
  {
    id: "keywords-reference", title: "Keywords, headers and reading references", source: "C language/library reference skills",
    lede: "Tutorials build a model; references answer exact syntax, type and contract questions. Learn to move between them.",
    objectives: ["Distinguish keyword, identifier and library name", "Choose the correct standard header", "Read a function contract before calling it"],
    sections: [
      { heading: "Reserved language words", html: `<p>Keywords such as <code>if</code>, <code>return</code>, <code>static</code>, <code>const</code> and <code>volatile</code> are part of the grammar and cannot be identifiers. Library functions like <code>printf</code> are declarations provided by headers and libraries.</p>` },
      { heading: "Header map", html: `<p><code>&lt;stdint.h&gt;</code> fixed-width integers, <code>&lt;stdbool.h&gt;</code> booleans, <code>&lt;stddef.h&gt;</code> size/pointer basics, <code>&lt;string.h&gt;</code> byte/string operations, <code>&lt;stdlib.h&gt;</code> conversions/allocation, and <code>&lt;stdio.h&gt;</code> streams.</p>` },
      { heading: "Read the full contract", html: `<p>For every function, find parameter validity, buffer size rules, return value, errors, side effects, overlap/alias rules and thread/interrupt safety. A signature alone is not the contract.</p>` }
    ],
    examples: [
      { title: "Pick a header from the need", code: `#include <stdint.h> // uint32_t\n#include <stddef.h> // size_t, NULL\n#include <stdbool.h>// bool, true, false\n#include <string.h> // memcpy, strlen`, note: "Include what the file directly uses rather than relying on another header accidentally including it." },
      { title: "memcpy questions", code: `memcpy(destination, source, byte_count);`, note: "Before calling: are both regions valid for byte_count, properly alive, and non-overlapping?" }
    ],
    practice: ["Build your own one-page header reference.", "Look up every constraint of memcpy.", "Find three implementation-specific details in your compiler documentation."],
    quiz: { q: "Is printf a C keyword?", options: ["No, it is a standard-library function", "Yes", "Only on ARM", "It is a preprocessor directive"], answer: 0, why: "The language grammar does not reserve printf; stdio.h declares it." }
  },
  {
    id: "c-projects", title: "Projects: from exercises to systems", source: "Course integration",
    lede: "Projects turn isolated syntax into design judgment. Build in vertical slices so every stage runs, teaches, and leaves evidence.",
    objectives: ["Choose projects with incremental milestones", "Write acceptance tests before features", "Progress from hosted C to hardware"],
    sections: [
      { heading: "Hosted C projects", html: `<p>Start with a unit converter, number statistics tool, command parser, contact records, ring buffer and binary-file inspector. Each should have invalid-input tests and a clean compiler build.</p>` },
      { heading: "Hardware projects", html: `<p>Progress through LED/button, UART console, timer measurement, PWM output, sensor acquisition, SPI display and event-driven UI. Introduce one new hardware mechanism at a time.</p>` },
      { heading: "Definition of done", html: `<p>A project is done when requirements pass, warnings are understood, failure paths are tested, memory/timing budgets are recorded, and you can explain the data/control path without reading from a script.</p>` }
    ],
    examples: [
      { title: "Milestone template", code: `Question -> prediction -> smallest implementation -> observation -> explanation -> test`, note: "Keep this loop in the project README or lab notebook." },
      { title: "Vertical display slice", code: `power/reset -> one SPI byte -> one controller command -> solid color -> rectangle -> text -> widget`, note: "Avoid writing a whole UI before proving the physical link." }
    ],
    practice: ["Select one hosted project and define five milestones.", "Write three measurable acceptance tests.", "List what evidence proves each milestone works."],
    quiz: { q: "What is the best first hardware project milestone?", options: ["The smallest observable vertical slice", "Every feature at once", "A large copied framework", "No acceptance test"], answer: 0, why: "A narrow slice reduces simultaneous unknowns and produces evidence quickly." }
  }
];

COURSE.lessons.push(...FOCUSED_C_LESSONS);

const COURSE_ORDER = [
  "course-welcome", "computer-basics",
  "tools-first-program", "program-anatomy", "comments", "io-formatting",
  "variables-types", "type-conversion", "constants", "operators", "booleans",
  "decisions", "loops", "break-continue", "arrays", "strings", "user-input",
  "pointers-zero", "pointers-arrays", "pointer-to-pointer", "functions",
  "scope-storage", "math-library", "callbacks", "recursion-stack",
  "structs-enums-unions", "preprocessor-modules", "stdlib-streams", "file-io",
  "dynamic-memory", "defensive-c", "testing-builds", "date-random",
  "keywords-reference", "c-projects",
  "digital-electronics", "bits", "fixed-point", "welcome", "c-core",
  "architecture", "memory", "pointers-volatile", "gpio", "design", "fsm",
  "fifo", "time", "sync", "interrupts", "scheduler", "rtos", "timers", "pwm",
  "uart", "serial-electrical", "keypads-events", "spi", "i2c", "usb-overview",
  "dma", "analog-circuits", "analog", "noise", "power", "clock-rtc", "debug",
  "watchdog-faults", "production", "verification-ethics", "wireless-iot",
  "boot-security", "optimization", "tft-ui"
];

const CATEGORY_BY_ID = {};
for (const id of ["course-welcome", "computer-basics"]) CATEGORY_BY_ID[id] = "Getting started";
for (const id of COURSE_ORDER.slice(2, 18)) CATEGORY_BY_ID[id] = "C basics";
for (const id of COURSE_ORDER.slice(18, 25)) CATEGORY_BY_ID[id] = "Functions & pointers";
for (const id of COURSE_ORDER.slice(25, 35)) CATEGORY_BY_ID[id] = "Professional C";
for (const id of ["digital-electronics", "bits", "fixed-point"]) CATEGORY_BY_ID[id] = "Hardware foundations";
for (const id of ["welcome", "c-core", "architecture", "memory", "pointers-volatile", "gpio"]) CATEGORY_BY_ID[id] = "Bare-metal foundations";
for (const id of ["design", "fsm", "fifo", "time", "sync", "interrupts", "scheduler", "rtos"]) CATEGORY_BY_ID[id] = "Real-time software";
for (const id of ["timers", "pwm", "uart", "serial-electrical", "keypads-events", "spi", "i2c", "usb-overview", "dma"]) CATEGORY_BY_ID[id] = "Peripherals & buses";
for (const id of ["analog-circuits", "analog", "noise"]) CATEGORY_BY_ID[id] = "Analog & acquisition";
for (const id of ["power", "clock-rtc", "debug", "watchdog-faults", "production", "verification-ethics", "wireless-iot", "boot-security", "optimization"]) CATEGORY_BY_ID[id] = "Production systems";
for (const id of ["tft-ui"]) CATEGORY_BY_ID[id] = "Applied projects";

for (const lesson of COURSE.lessons) {
  if (CATEGORY_BY_ID[lesson.id]) lesson.category = CATEGORY_BY_ID[lesson.id];
}

const lessonById = new Map(COURSE.lessons.map(lesson => [lesson.id, lesson]));
const orderedIds = new Set(COURSE_ORDER);
COURSE.lessons = [
  ...COURSE_ORDER.map(id => lessonById.get(id)).filter(Boolean),
  ...COURSE.lessons.filter(lesson => !orderedIds.has(lesson.id))
];
