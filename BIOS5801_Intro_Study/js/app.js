(function () {
  const navLinks = [...document.querySelectorAll(".nav a")];
  const sections = navLinks
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  const setActive = () => {
    const y = window.scrollY + 90;
    let current = sections[0];
    for (const s of sections) if (s.offsetTop <= y) current = s;
    if (!current) return;
    navLinks.forEach((a) => {
      a.classList.toggle("active", a.getAttribute("href") === "#" + current.id);
    });
  };
  window.addEventListener("scroll", setActive, { passive: true });
  setActive();

  const escapeHtml = (s) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const highlightR = (src) => {
    const parts = [];
    const re = /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|#.*/g;
    let last = 0;
    let m;
    while ((m = re.exec(src))) {
      if (m.index > last) parts.push(["code", src.slice(last, m.index)]);
      parts.push([m[0][0] === "#" ? "com" : "str", m[0]]);
      last = m.index + m[0].length;
    }
    if (last < src.length) parts.push(["code", src.slice(last)]);

    const colorOps = (html) =>
      html
        .replace(/&lt;-/g, '<span class="tok-op">&lt;-</span>')
        .replace(/&lt;=/g, '<span class="tok-op">&lt;=</span>')
        .replace(/&gt;=/g, '<span class="tok-op">&gt;=</span>')
        .replace(/==/g, '<span class="tok-op">==</span>')
        .replace(/!=/g, '<span class="tok-op">!=</span>')
        .replace(/&lt;/g, '<span class="tok-op">&lt;</span>')
        .replace(/&gt;/g, '<span class="tok-op">&gt;</span>')
        .replace(/&amp;&amp;/g, '<span class="tok-op">&amp;&amp;</span>')
        .replace(/\|\|/g, '<span class="tok-op">||</span>')
        .replace(/&amp;/g, '<span class="tok-op">&amp;</span>')
        .replace(/(\s)\|(?=\s)/g, '$1<span class="tok-op">|</span>')
        .replace(/%\*%/g, '<span class="tok-op">%*%</span>')
        .replace(/%\/%/g, '<span class="tok-op">%/%</span>')
        .replace(/%%/g, '<span class="tok-op">%%</span>');

    return parts
      .map(([kind, text]) => {
        if (kind === "str") return '<span class="tok-str">' + escapeHtml(text) + "</span>";
        if (kind === "com") return '<span class="tok-com">' + escapeHtml(text) + "</span>";
        let s = escapeHtml(text);
        s = s.replace(
          /\b(TRUE|FALSE|NULL|NA|NaN|Inf|if|else|for|in|while|function|repeat|next|break)\b/g,
          '<span class="tok-kw">$1</span>'
        );
        s = s.replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="tok-num">$1</span>');
        s = s.replace(
          /\b([A-Za-z.][A-Za-z0-9._]*)(?=\()/g,
          '<span class="tok-fn">$1</span>'
        );
        s = colorOps(s);
        return s;
      })
      .join("");
  };

  document.querySelectorAll(".snippet pre code").forEach((el) => {
    const src = el.textContent.replace(/\u00a0/g, " ");
    el.dataset.src = src;
    el.innerHTML = highlightR(src);
  });

  document.querySelectorAll(".copy").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const code = btn.closest(".snippet")?.querySelector("pre code");
      const text = code?.dataset.src || code?.innerText || "";
      try {
        await navigator.clipboard.writeText(text);
        btn.textContent = "已複製";
        setTimeout(() => (btn.textContent = "複製"), 1200);
      } catch (e) {
        btn.textContent = "請手動選取";
      }
    });
  });

  const qSearch = document.getElementById("glossary-search");
  if (qSearch) {
    qSearch.addEventListener("input", () => {
      const q = qSearch.value.trim().toLowerCase();
      document.querySelectorAll(".g-item").forEach((el) => {
        el.style.display = el.textContent.toLowerCase().includes(q) ? "" : "none";
      });
    });
  }

  const answers = {
    q1: "b",
    q2: "c",
    q3: "a",
    q4: "d",
    q5: "b",
    q6: "c",
    q7: "a",
    q8: "d",
    q9: "b",
    q10: "c",
    q11: "a",
    q12: "d",
  };

  document.getElementById("grade-quiz")?.addEventListener("click", () => {
    let score = 0;
    Object.entries(answers).forEach(([name, key]) => {
      const q = document.querySelector(`[data-q="${name}"]`);
      if (!q) return;
      q.querySelectorAll("label").forEach((lab) => {
        lab.classList.remove("ok", "bad");
        const input = lab.querySelector("input");
        if (input.value === key) lab.classList.add("ok");
        if (input.checked && input.value !== key) lab.classList.add("bad");
      });
      const chosen = q.querySelector("input:checked");
      if (chosen && chosen.value === key) score += 1;
    });
    const board = document.getElementById("score");
    board.textContent = `得分：${score} / ${Object.keys(answers).length}`;
    board.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  document.getElementById("to-top")?.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );
})();
