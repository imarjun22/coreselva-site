/* Public-course pass: removes private projects and adds a consistent teaching layer. */
(() => {
  "use strict";

  const byId = id => COURSE.lessons.find(item => item.id === id);
  const tft = byId("tft-ui");
  if (tft) {
    tft.category = "Applied projects";
    tft.title = "From pixels to a small TFT interface";
    tft.lede = "Build a display stack in portable layers: transport, controller, drawing, widgets and application state. The design applies to many small color displays and microcontrollers.";
    tft.source = "General embedded display architecture";
  }

  Object.assign(byId("course-welcome"), {
    title: "Start here: C, embedded systems and this course",
    lede: "No programming or electronics experience is assumed. We begin with what a program is, learn ordinary C one idea at a time, and only then connect that knowledge to memory, pins, timers, buses and real hardware.",
    source: "Public course orientation",
    sections: [
      { heading: "What a program is", html: `<p>A <b>program</b> is a precise sequence of instructions and data. You write human-readable C source code. A toolchain translates it into machine instructions for a particular processor. When those instructions run, they read values, make decisions, repeat work and change state.</p><p>C is not the processor's language and it does not make hardware disappear. It gives us a portable way to describe computations while still making memory, representation and cost visible.</p>` },
      { heading: "What embedded means", html: `<p>An <b>embedded system</b> is a computer built into a larger product. A microcontroller commonly combines a processor core, Flash, RAM, timers, communication peripherals and input/output pins on one chip. Its program is called <b>firmware</b>.</p><p>A desktop C program may receive services from an operating system. Bare-metal firmware may start immediately after reset and must configure the hardware services it needs. The C language is shared; startup, libraries, memory layout and input/output environment differ.</p>` },
      { heading: "The learning path", html: `<ol><li><b>Ordinary C:</b> syntax, values, decisions, loops, arrays, strings, functions, pointers and structures.</li><li><b>Professional C:</b> modules, errors, testing, undefined behavior, memory and build discipline.</li><li><b>Hardware foundations:</b> bits, voltage, memory maps and safe electrical interfaces.</li><li><b>Firmware:</b> GPIO, interrupts, timing, drivers, buses, concurrency and production concerns.</li><li><b>Application:</b> combine small verified layers into a display or another embedded product.</li></ol>` },
      { heading: "How to study each lesson", html: `<p>First read the definition and say it in your own words. Next trace each worked example by hand: write down the value of every changed variable. Then change one thing and predict the consequence. Complete the practice without copying the example. Finally use the knowledge check and lesson recap to find gaps.</p><div class="callout"><strong>Do not race the sidebar</strong>Finishing many lesson titles is not mastery. Being able to predict, explain and rebuild a small example is.</div>` },
      { heading: "What you need", html: `<p>The C-language part needs only a text editor and, when you choose to run examples, a standards-aware local C toolchain. Hardware lessons can be read without a board. When you later use hardware, select any well-documented microcontroller board and consult its exact datasheet, reference manual and schematic. Vendor-specific names are examples, not universal C.</p>` },
      { heading: "How this guide uses sources", html: `<p>The course is original, modern teaching material. The attached C tutorial was reviewed across all 146 pages for topic order and classroom pacing. Its wording and examples are not reproduced. Dated or unsafe ideas—such as unbounded input, fixed size assumptions and calling pointer arguments “pass by reference”—are corrected here.</p>` }
    ],
    examples: [{
      title: "A complete first program",
      code: `#include <stdio.h>\n\nint main(void)\n{\n    printf("Hello, world!\\n");\n    return 0;\n}`,
      note: "You do not need to understand every symbol yet. This is a map of the ideas the next lessons will unpack."
    }],
    practice: [
      "Write one sentence that distinguishes source code from the running program.",
      "Name one desktop input/output service and one microcontroller input/output peripheral.",
      "Create a study notebook with four headings: prediction, trace, observation and explanation."
    ],
    quiz: { q: "What is firmware?", options: ["Software intended to run inside an embedded device", "A C keyword", "A type of resistor", "Only a desktop application"], answer: 0, why: "Firmware is software built for an embedded system; it may run bare-metal or above an embedded operating system." }
  });

  const firstProgram = byId("tools-first-program");
  if (firstProgram) {
    firstProgram.sections.push(
      { heading: "Translation errors, link errors and run-time errors", html: `<p>A missing semicolon or incompatible type is normally diagnosed while translating C. Calling a function whose implementation cannot be found usually fails during linking. A program that builds but calculates the wrong value has a run-time or logic defect. These stages matter because each failure requires different evidence.</p>` },
      { heading: "A repeatable local workflow", html: `<ol><li>Save source as a plain-text <code>.c</code> file.</li><li>Build with a chosen C language version and warnings enabled.</li><li>Read the <b>first</b> diagnostic before later cascade errors.</li><li>Run only code you understand in an appropriate environment.</li><li>Change one thing, predict the result, rebuild and record what happened.</li></ol><p>This website deliberately contains no execution service. Examples are lessons, not untrusted programs to run automatically.</p>` }
    );
  }

  const anatomy = byId("program-anatomy");
  if (anatomy) {
    anatomy.sections.push(
      { heading: "Punctuation carries grammar", html: `<p>Parentheses enclose a function's parameter list or an expression. Braces delimit a block. A semicolon terminates most declarations and expression statements. A comma separates function arguments. Quotation marks delimit a string literal. C is case-sensitive: <code>main</code>, <code>Main</code> and <code>MAIN</code> are different identifiers.</p>` },
      { heading: "What happens in order", html: `<p>Before translation, preprocessing handles directives such as <code>#include</code>. The program begins through implementation startup code, which calls <code>main</code> in a hosted program. Statements inside a block execute in sequence unless control-flow syntax changes that order. Returning zero from <code>main</code> reports successful hosted termination.</p>` }
    );
  }

  const pdfTopicPages = {
    "tools-first-program": "12–15",
    "program-anatomy": "14–18",
    "comments": "16–18",
    "io-formatting": "117–119",
    "variables-types": "19–25",
    "type-conversion": "132–134",
    "constants": "26–30",
    "operators": "34–43",
    "booleans": "37–38, 44–53",
    "decisions": "44–53",
    "loops": "54–61, 66–67",
    "break-continue": "62–66",
    "arrays": "78–87",
    "strings": "100–102",
    "user-input": "117–119",
    "pointers-zero": "88–90",
    "pointers-arrays": "90–99",
    "pointer-to-pointer": "95–99",
    "functions": "68–73",
    "scope-storage": "31–33, 74–77",
    "callbacks": "68–73",
    "recursion-stack": "138–139",
    "structs-enums-unions": "103–116",
    "preprocessor-modules": "124–131",
    "stdlib-streams": "117–119",
    "file-io": "120–123",
    "dynamic-memory": "142–144",
    "defensive-c": "135–137",
    "keywords-reference": "16–18, 124–131"
  };

  for (const [id, pages] of Object.entries(pdfTopicPages)) {
    const item = byId(id);
    if (item) item.source = `Original modern lesson; topic sequence cross-checked with ctutor.pdf, pp. ${pages}`;
  }

  function escapeHtml(text) {
    return text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
  }

  function explainLine(source) {
    const line = source.trim();
    if (/^\/\//.test(line) || /^\/\*/.test(line) || /^\*/.test(line)) return "A comment for the reader; it does not perform the program's work.";
    if (/^#include\b/.test(line)) return "A preprocessing directive that makes declarations from a header available in this translation unit.";
    if (/^#define\b/.test(line)) return "Defines a preprocessing replacement; the replacement happens before C syntax and type checking.";
    if (/^#(if|ifdef|ifndef|elif|else|endif)\b/.test(line)) return "Selects which source tokens are kept during preprocessing.";
    if (/^typedef\b/.test(line)) return "Begins or completes a type definition so later declarations can use a meaningful type name.";
    if (/^(struct|enum|union)\b/.test(line)) return "Introduces an aggregate or enumeration type; the following members define its representation or named choices.";
    if (/^for\s*\(/.test(line)) return "A for loop: initialize once, test before each iteration, then perform the update after the body.";
    if (/^while\s*\(/.test(line)) return "Repeats the following statement or block while its controlling expression is nonzero.";
    if (/^do\b/.test(line)) return "Starts a do-while loop whose body executes before the first condition test.";
    if (/^if\s*\(/.test(line)) return "Evaluates a condition; a nonzero result selects the following statement or block.";
    if (/^else if\s*\(/.test(line)) return "Tests another condition only when every earlier branch in the chain was false.";
    if (/^else\b/.test(line)) return "Selects the fallback path when the associated if condition was false.";
    if (/^switch\s*\(/.test(line)) return "Selects a labeled case using an integer or enumeration value.";
    if (/^(case\b|default\s*:)/.test(line)) return "A switch label; execution enters here when the controlling value matches, or at default when none matches.";
    if (/^break\s*;/.test(line)) return "Leaves the nearest loop or switch immediately.";
    if (/^continue\s*;/.test(line)) return "Skips the remaining loop body and proceeds to the next iteration step or condition test.";
    if (/^return\b/.test(line)) return "Ends this function and, when an expression is present, supplies its result to the caller.";
    if (line === "{") return "Opens a block: a grouped sequence of declarations and statements with its own scope.";
    if (/^}/.test(line)) return "Closes the current block; any automatic objects owned only by that block reach the end of their lifetime.";
    if (/^[A-Za-z_]\w*\s*\([^;]*\)\s*;/.test(line)) return "Calls a function. Arguments are evaluated and their values initialize the function's parameters.";
    if (/^(const\s+|static\s+|volatile\s+|extern\s+)*(unsigned\s+|signed\s+)?(void|char|short|int|long|float|double|bool|size_t|u?int\d+_t|[A-Za-z_]\w*_t)\b/.test(line)) return "Declares a typed name; an initializer after = supplies its first value.";
    if (/\+\+|--/.test(line)) return "Changes an integer or pointer by one step; prefix and postfix forms differ in the value produced by the expression.";
    if (/(^|[^=!<>])=(?!=)|\+=|-=|\*=|\/=|\|=|&=|\^=/.test(line)) return "Stores a computed value in the object named on the left; compound assignment also reads its previous value.";
    if (/;\s*$/.test(line)) return "A complete declaration or statement. Trace the named objects to see which value or side effect it produces.";
    return "Part of the surrounding declaration or expression; read it together with the adjacent lines before tracing values.";
  }

  function lineWalkthrough(code) {
    return code.split("\n")
      .map((source, index) => ({ source, index }))
      .filter(item => item.source.trim())
      .map(item => ({
        label: `line ${item.index + 1}`,
        text: `<code>${escapeHtml(item.source.trim())}</code> — ${explainLine(item.source)}`
      }));
  }

  COURSE.lessons.forEach((item, index) => {
    const previous = COURSE.lessons[index - 1];
    let terms = [...String(item.reference || "").matchAll(/<dt>(.*?)<\/dt>/g)]
      .map(match => match[1].replace(/<[^>]+>/g, ""))
      .slice(0, 6);
    if (!terms.length) {
      terms = [...String(item.reference || "").matchAll(/<code>(.*?)<\/code>/g)]
        .map(match => match[1].replace(/<[^>]+>/g, ""))
        .filter((term, termIndex, all) => term.length <= 32 && all.indexOf(term) === termIndex)
        .slice(0, 6);
    }

    item.startHere ||= {
      prerequisites: index === 0
        ? "Nothing. This course begins before programming and before microcontrollers."
        : `Be able to explain the main idea of “${previous.title}”. If not, use that lesson's recap before continuing.`,
      why: item.lede,
      words: terms
    };

    item.recap ||= item.objectives.slice(0, 5).map(objective => {
      const lower = objective.charAt(0).toLowerCase() + objective.slice(1);
      return `You should now be able to ${lower.replace(/[.]$/, "")}.`;
    });

    item.practice ||= [
      `Without looking back, define the central idea of “${item.title}” in two precise sentences.`,
      "Trace one worked example by hand and record every value or state change in order.",
      "Create one valid variation and one deliberately invalid boundary case; explain the expected difference before testing either."
    ];

    const examples = item.examples ?? (item.example ? [item.example] : []);
    examples.forEach(example => {
      example.walkthrough ||= lineWalkthrough(example.code);
    });
  });
})();
