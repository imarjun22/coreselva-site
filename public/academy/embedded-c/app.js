(() => {
  "use strict";

  const nav = document.querySelector("#lessonNav");
  const lessonRoot = document.querySelector("#lesson");
  const outline = document.querySelector("#pageOutline");
  const sourceMap = document.querySelector("#sourceMap");
  const searchInput = document.querySelector("#searchInput");
  const sidebar = document.querySelector("#sidebar");
  const menuButton = document.querySelector("#menuButton");
  const toast = document.querySelector("#toast");
  const progressText = document.querySelector("#progressText");
  const progressBar = document.querySelector("#progressBar");

  const storage = {
    get(key, fallback) {
      try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
      catch { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); }
      catch { /* The tutorial still works when storage is unavailable. */ }
    }
  };

  let completed = new Set(storage.get("coreselva-completed", []));
  let activeIndex = 0;

  const escapeHtml = value => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

  const slug = text => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 1800);
  }

  function categoryGroups(lessons) {
    return lessons.reduce((groups, item) => {
      (groups[item.category] ||= []).push(item);
      return groups;
    }, {});
  }

  function renderNav(filter = "") {
    const query = filter.trim().toLowerCase();
    const visible = COURSE.lessons.filter(item => {
      const examples = item.examples ?? (item.example ? [item.example] : []);
      const haystack = `${item.title} ${item.category} ${item.lede} ${item.objectives.join(" ")} ${item.sections.map(s => `${s.heading} ${s.html}`).join(" ")} ${examples.map(e => `${e.title} ${e.code} ${e.note}`).join(" ")}`.toLowerCase();
      return !query || haystack.includes(query);
    });

    if (!visible.length) {
      nav.innerHTML = `<div class="nav-group-title">No matching lessons</div>`;
      return;
    }

    nav.innerHTML = Object.entries(categoryGroups(visible)).map(([category, items]) => `
      <section class="nav-group">
        <div class="nav-group-title">${category}</div>
        ${items.map(item => {
          const index = COURSE.lessons.indexOf(item);
          return `<button class="lesson-link ${index === activeIndex ? "active" : ""}" data-lesson="${item.id}">
            <span class="lesson-number">${String(index + 1).padStart(2, "0")}</span>
            <span>${item.title}</span>
            <span class="lesson-check">${completed.has(item.id) ? "✓" : ""}</span>
          </button>`;
        }).join("")}
      </section>`).join("");

    nav.querySelectorAll("[data-lesson]").forEach(button => {
      button.addEventListener("click", () => navigate(button.dataset.lesson));
    });
  }

  function renderLesson(index) {
    activeIndex = Math.max(0, Math.min(index, COURSE.lessons.length - 1));
    const item = COURSE.lessons[activeIndex];
    const done = completed.has(item.id);
    const examples = item.examples ?? [item.example];

    lessonRoot.innerHTML = `
      <div class="breadcrumb"><b>Embedded C</b><span>/</span><span>${item.category}</span><span>/</span><span>Lesson ${activeIndex + 1}</span></div>
      <h1>${item.title}</h1>
      <p class="lesson-lede">${item.lede}</p>
      ${item.startHere ? `<section class="start-here">
        <p class="eyebrow">START HERE</p>
        <div class="start-grid">
          <div><h2>What you should already know</h2><p>${item.startHere.prerequisites}</p></div>
          <div><h2>Why this lesson matters</h2><p>${item.startHere.why}</p></div>
        </div>
        ${item.startHere.words?.length ? `<p class="new-words"><b>New words:</b> ${item.startHere.words.map(word => `<code>${word}</code>`).join(" ")}</p>` : ""}
      </section>` : ""}
      <section class="objective-box">
        <h2>By the end, you can...</h2>
        <ul>${item.objectives.map(objective => `<li>${objective}</li>`).join("")}</ul>
      </section>

      ${item.sections.map(section => {
        const id = slug(section.heading);
        return `<section class="lesson-section" id="${id}"><h2>${section.heading}</h2>${section.html}</section>`;
      }).join("")}

      ${item.reference ? `<section class="lesson-section deep-reference" id="complete-reference">
        <h2>Complete reference</h2>
        ${item.reference}
      </section>` : ""}

      ${item.mistakes?.length ? `<section class="lesson-section" id="common-mistakes">
        <h2>Common mistakes and why they fail</h2>
        <div class="mistake-list">${item.mistakes.map(mistake => `<article><h3>${mistake.title}</h3><p>${mistake.explanation}</p>${mistake.code ? `<code>${escapeHtml(mistake.code)}</code>` : ""}</article>`).join("")}</div>
      </section>` : ""}

      <section class="lesson-section" id="code-lab">
        <h2>Worked examples</h2>
        <p>Read each example from top to bottom. Predict what every statement changes before checking the explanation. Focused snippets may require the surrounding types or functions described in the lesson.</p>
        <div class="example-stack">
          ${examples.map((example, exampleIndex) => `<div class="code-lab">
            <div class="code-head"><span>${example.title}</span><button class="copy-button" data-copy="${exampleIndex}">Copy</button></div>
            <pre><code>${escapeHtml(example.code)}</code></pre>
            <div class="code-note">${example.note}</div>
            ${example.walkthrough?.length ? `<div class="walkthrough"><b>Walk through it</b>${example.walkthrough.map(step => `<div><span>${step.label}</span><p>${step.text}</p></div>`).join("")}</div>` : ""}
          </div>`).join("")}
        </div>
      </section>

      ${item.practice?.length ? `<section class="practice-box" id="practice">
        <p class="eyebrow">PRACTICE - DO NOT SKIP</p>
        <h2>Build the idea yourself</h2>
        <ol>${item.practice.map(task => `<li>${task}</li>`).join("")}</ol>
      </section>` : ""}

      ${item.recap?.length ? `<section class="lesson-section recap-box" id="lesson-recap">
        <h2>Lesson recap</h2>
        <ul>${item.recap.map(point => `<li>${point}</li>`).join("")}</ul>
        <p><b>Teach it back:</b> Close the page and explain these points in your own words. If one sentence is vague, return to that section and trace an example.</p>
      </section>` : ""}

      <section class="quiz-card" id="knowledge-check" data-quiz>
        <p class="eyebrow">KNOWLEDGE CHECK</p>
        <h2>${item.quiz.q}</h2>
        <div class="quiz-options">
          ${item.quiz.options.map((option, optionIndex) => `<button class="quiz-option" data-option="${optionIndex}">${option}</button>`).join("")}
        </div>
        <p class="quiz-feedback" aria-live="polite"></p>
      </section>

      <div class="lesson-actions">
        <button class="nav-button" data-direction="previous" ${activeIndex === 0 ? "disabled" : ""}>← Previous</button>
        <button class="complete-button ${done ? "done" : ""}" data-complete>${done ? "✓ Completed" : "Mark complete"}</button>
        <button class="nav-button" data-direction="next" ${activeIndex === COURSE.lessons.length - 1 ? "disabled" : ""}>Next →</button>
      </div>`;

    document.title = `${item.title} - CoreSelva Academy`;
    sourceMap.textContent = item.source;
    outline.innerHTML = [
      ...item.sections.map(section => `<a href="#" data-outline-target="${slug(section.heading)}">${section.heading}</a>`),
      ...(item.reference ? [`<a href="#" data-outline-target="complete-reference">Complete reference</a>`] : []),
      ...(item.mistakes?.length ? [`<a href="#" data-outline-target="common-mistakes">Common mistakes</a>`] : []),
      `<a href="#" data-outline-target="code-lab">Worked examples</a>`,
      ...(item.practice?.length ? [`<a href="#" data-outline-target="practice">Practice</a>`] : []),
      ...(item.recap?.length ? [`<a href="#" data-outline-target="lesson-recap">Lesson recap</a>`] : []),
      `<a href="#" data-outline-target="knowledge-check">Knowledge check</a>`
    ].join("");
    outline.querySelectorAll("[data-outline-target]").forEach(link => {
      link.addEventListener("click", event => {
        event.preventDefault();
        document.getElementById(link.dataset.outlineTarget)?.scrollIntoView({ behavior: "smooth" });
      });
    });

    wireLesson(item, examples);
    renderNav(searchInput.value);
    updateProgress();
    window.scrollTo({ top: 0, behavior: "instant" });
    sidebar.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  }

  function wireLesson(item, examples) {
    lessonRoot.querySelectorAll("[data-copy]").forEach(button => button.addEventListener("click", async event => {
      const example = examples[Number(event.currentTarget.dataset.copy)];
      try {
        await navigator.clipboard.writeText(example.code);
        event.currentTarget.textContent = "Copied";
        showToast("Code copied to clipboard");
      } catch {
        showToast("Select the code and copy it manually");
      }
    }));

    const quiz = lessonRoot.querySelector("[data-quiz]");
    quiz.querySelectorAll("[data-option]").forEach(button => {
      button.addEventListener("click", () => {
        const choice = Number(button.dataset.option);
        quiz.querySelectorAll("[data-option]").forEach(option => {
          option.disabled = true;
          if (Number(option.dataset.option) === item.quiz.answer) option.classList.add("correct");
        });
        if (choice !== item.quiz.answer) button.classList.add("wrong");
        quiz.querySelector(".quiz-feedback").textContent = `${choice === item.quiz.answer ? "Correct. " : "Not quite. "}${item.quiz.why}`;
      });
    });

    lessonRoot.querySelector("[data-complete]").addEventListener("click", () => {
      if (completed.has(item.id)) completed.delete(item.id); else completed.add(item.id);
      storage.set("coreselva-completed", [...completed]);
      renderLesson(activeIndex);
      showToast(completed.has(item.id) ? "Lesson completed" : "Lesson marked incomplete");
    });

    lessonRoot.querySelectorAll("[data-direction]").forEach(button => {
      button.addEventListener("click", () => {
        const offset = button.dataset.direction === "next" ? 1 : -1;
        navigate(COURSE.lessons[activeIndex + offset]?.id);
      });
    });

    setupBitLabs();
  }

  function setupBitLabs() {
    lessonRoot.querySelectorAll("[data-bit-lab]").forEach(lab => {
      const valueInput = lab.querySelector("[data-value]");
      const bitInput = lab.querySelector("[data-bit]");
      const opInput = lab.querySelector("[data-op]");
      const bitsRoot = lab.querySelector("[data-bits]");
      const result = lab.querySelector("[data-bit-result]");

      function update() {
        const original = Number(valueInput.value) & 0xFF;
        const bit = Math.max(0, Math.min(7, Number(bitInput.value) || 0));
        const mask = 1 << bit;
        let output = original;
        if (opInput.value === "set") output |= mask;
        if (opInput.value === "clear") output &= ~mask;
        if (opInput.value === "toggle") output ^= mask;
        bitsRoot.innerHTML = Array.from({ length: 8 }, (_, index) => {
          const n = 7 - index;
          const on = (output & (1 << n)) !== 0;
          return `<span class="bit ${on ? "on" : ""}" title="bit ${n}">${on ? 1 : 0}<small>${n}</small></span>`;
        }).join("");
        result.innerHTML = opInput.value === "test"
          ? `Bit ${bit} is <b>${(original & mask) ? "SET" : "CLEAR"}</b>.`
          : `<code>0x${original.toString(16).padStart(2, "0").toUpperCase()}</code> → <code>0x${(output & 0xFF).toString(16).padStart(2, "0").toUpperCase()}</code>`;
      }
      [valueInput, bitInput, opInput].forEach(control => control.addEventListener("input", update));
      update();
    });
  }

  function updateProgress() {
    const percent = Math.round((completed.size / COURSE.lessons.length) * 100);
    progressText.textContent = `${percent}%`;
    progressBar.style.width = `${percent}%`;
  }

  function navigate(id, replace = false) {
    if (!id) return;
    const index = COURSE.lessons.findIndex(item => item.id === id);
    if (index < 0) return;
    if (replace) history.replaceState(null, "", `#${id}`);
    else history.pushState(null, "", `#${id}`);
    renderLesson(index);
    lessonRoot.focus({ preventScroll: true });
  }

  searchInput.addEventListener("input", () => renderNav(searchInput.value));
  searchInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      const first = nav.querySelector("[data-lesson]");
      if (first) navigate(first.dataset.lesson);
    }
  });

  menuButton.addEventListener("click", () => {
    const open = sidebar.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
  });

  const referenceDialog = document.querySelector("#referenceDialog");
  document.querySelector("#referenceButton").addEventListener("click", () => referenceDialog.showModal());
  document.querySelector("#closeReference").addEventListener("click", () => referenceDialog.close());

  const savedTheme = storage.get("coreselva-theme", "dark");
  document.body.classList.toggle("light", savedTheme === "light");
  document.querySelector("#themeButton").addEventListener("click", () => {
    document.body.classList.toggle("light");
    storage.set("coreselva-theme", document.body.classList.contains("light") ? "light" : "dark");
  });

  window.addEventListener("popstate", () => {
    const index = COURSE.lessons.findIndex(item => item.id === location.hash.slice(1));
    renderLesson(index < 0 ? 0 : index);
  });

  document.addEventListener("keydown", event => {
    if (event.target.matches("input, textarea, select") || event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.key === "/") { event.preventDefault(); searchInput.focus(); }
    if (event.key.toLowerCase() === "j") navigate(COURSE.lessons[activeIndex + 1]?.id);
    if (event.key.toLowerCase() === "k") navigate(COURSE.lessons[activeIndex - 1]?.id);
  });

  const initialId = location.hash.slice(1);
  navigate(COURSE.lessons.some(item => item.id === initialId) ? initialId : COURSE.lessons[0].id, true);
  const initialParams = new URLSearchParams(location.search);
  const initialSection = initialParams.get("section");
  if (initialSection) requestAnimationFrame(() => document.getElementById(initialSection)?.scrollIntoView());
})();
