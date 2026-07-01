document.addEventListener("DOMContentLoaded", () => {

  /* ══════════════════════════════════════
     EMAILJS SETUP
  ══════════════════════════════════════ */
  /* const EMAILJS_PUBLIC_KEY = "iM3lgP9z0LCImD4RX";
  const EMAILJS_SERVICE_ID = "service_vwxl158";
  const EMAILJS_TEMPLATE_ID = "template_gg2617i";

  if (typeof emailjs !== "undefined") {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  } */

  /* ══════════════════════════════════════
     CLOCK
  ══════════════════════════════════════ */
  function updateClock() {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const ss = String(now.getSeconds()).padStart(2, "0");
    const str = `${hh}:${mm}:${ss}`;
    ["lp-time", "inv-time", "vtime"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = str;
    });
  }
  updateClock();
  setInterval(updateClock, 1000);

  /* ══════════════════════════════════════
     JELLYFISH
  ══════════════════════════════════════ */
  const JELLY_COLS = ["pink", "cyan", "blue"];

  function makeJelly(container, count) {
    if (!container) return;
    for (let i = 0; i < count; i++) {
      const jelly = document.createElement("div");
      jelly.className = "jelly " + JELLY_COLS[Math.floor(Math.random() * JELLY_COLS.length)];
      const size = 36 + Math.random() * 64;
      const dur = 22 + Math.random() * 30;
      const delay = Math.random() * -40;
      const left = Math.random() * 100;
      const drift = (Math.random() - 0.5) * 160;
      const pulse = 2 + Math.random() * 3;
      jelly.style.cssText = `left:${left}%;width:${size}px;height:${size * 0.9}px;--drift:${drift}px;animation:jellyFloat ${dur}s linear ${delay}s infinite;`;
      const bell = document.createElement("div");
      bell.className = "jelly-bell";
      bell.style.animationDuration = pulse + "s";
      const legs = document.createElement("div");
      legs.className = "jelly-legs";
      const numLegs = 4 + Math.floor(Math.random() * 5);
      for (let l = 0; l < numLegs; l++) {
        const leg = document.createElement("div");
        leg.className = "jelly-leg";
        const lw = 1.5 + Math.random() * 2;
        const lh = size * (0.5 + Math.random() * 0.7);
        const wd = 1 + Math.random() * 2;
        leg.style.cssText = `width:${lw}px;height:${lh}px;animation-duration:${wd}s;animation-delay:${Math.random() * -2}s;`;
        legs.appendChild(leg);
      }
      jelly.appendChild(bell);
      jelly.appendChild(legs);
      container.appendChild(jelly);
    }
  }

  makeJelly(document.getElementById("jellies-ocean"), 7);

  /* ══════════════════════════════════════
     BUBBLES
  ══════════════════════════════════════ */
  function makeBubbles(container, count) {
    if (!container) return;
    for (let i = 0; i < count; i++) {
      const b = document.createElement("div");
      b.className = "bubble";
      const sz = 4 + Math.random() * 18;
      const dur = 9 + Math.random() * 14;
      const delay = Math.random() * -dur;
      const drift = (Math.random() - 0.5) * 70;
      b.style.cssText = `width:${sz}px;height:${sz}px;left:${Math.random() * 100}%;bottom:${Math.random() * 15}px;--drift:${drift}px;animation:rise ${dur}s linear ${delay}s infinite;`;
      container.appendChild(b);
    }
  }
  makeBubbles(document.getElementById("bubbles"), 22);

  /* ══════════════════════════════════════
     SCREEN 1 → SCREEN 2: ENTER LIFEPOD
  ══════════════════════════════════════ */
  const ocean = document.getElementById("screen-ocean");
  const lifepod = document.getElementById("screen-lifepod");
  const footer = document.querySelector("footer");
  const diveBtn = document.getElementById("dive-btn");

  diveBtn.addEventListener("click", () => {
    ocean.classList.add("dismissed");
    setTimeout(() => {
      ocean.style.display = "none";
      lifepod.style.display = "block";
      document.getElementById("depth-bar").classList.add("visible");
      if (footer) footer.classList.add("visible");
    }, 900);
  });

  /* ══════════════════════════════════════
     INVENTORY OPEN / CLOSE
  ══════════════════════════════════════ */
  const invOverlay = document.getElementById("inv-overlay");
  const invClose = document.getElementById("inv-close");
  let invOpen = false;

  function openInventory() {
    invOverlay.classList.add("open");
    invOverlay.setAttribute("aria-hidden", "false");
    document.getElementById("press-e-hint").style.opacity = "0";
    invOpen = true;
    animateBars();
  }

  function closeInventory() {
    invOverlay.classList.remove("open");
    invOverlay.setAttribute("aria-hidden", "true");
    document.getElementById("press-e-hint").style.opacity = "1";
    invOpen = false;
  }

  invClose.addEventListener("click", closeInventory);

  invOverlay.addEventListener("click", (e) => {
    if (e.target === invOverlay) closeInventory();
  });

  /* ══════════════════════════════════════
     EASTER EGG — LEVIATHAN
  ══════════════════════════════════════ */
  const levOverlay = document.getElementById("leviathan-overlay");
  const levClose = document.getElementById("lev-close");

  function triggerLeviathan() {
    levOverlay.classList.add("active");
    if (invOpen) closeInventory();
  }

  if (levClose) {
    levClose.addEventListener("click", () => levOverlay.classList.remove("active"));
  }


  /* ══════════════════════════════════════
     SINGLE KEYDOWN HANDLER
     Handles: E to open/close inventory,
              triple-E easter egg,
              Escape to close everything
  ══════════════════════════════════════ */
  let ePressCount = 0;
  let eTimer = null;

  document.addEventListener("keydown", (e) => {
    const tag = document.activeElement?.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

    // --- E key ---
    if (e.key.toLowerCase() === "e") {
      // Only act once we're past the ocean screen
      if (ocean.style.display !== "none" && !ocean.classList.contains("dismissed")) return;

      e.preventDefault();

      ePressCount++;
      clearTimeout(eTimer);

      // Triple-E triggers easter egg
      if (ePressCount >= 3) {
        ePressCount = 0;
        clearTimeout(eTimer);
        triggerLeviathan();
        return;
      }

      // Reset count if no third press within 1.5s
      eTimer = setTimeout(() => { ePressCount = 0; }, 1500);

      // First or second press: toggle inventory normally
      invOpen ? closeInventory() : openInventory();
      return;
    }

    // --- Escape key ---
    if (e.key === "Escape") {
      if (levOverlay.classList.contains("active")) {
        levOverlay.classList.remove("active");
      } else if (invOpen) {
        e.preventDefault();
        closeInventory();
      }
    }
  });

  /* ══════════════════════════════════════
     SIDEBAR NAV
  ══════════════════════════════════════ */
  document.querySelectorAll(".inv-row").forEach(row => {
    row.addEventListener("click", () => {
      document.querySelectorAll(".inv-row").forEach(r => r.classList.remove("active"));
      document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
      row.classList.add("active");
      const panel = document.getElementById("tab-" + row.dataset.tab);
      if (panel) {
        panel.classList.add("active");
        if (row.dataset.tab === "vitals") setTimeout(animateBars, 100);
      }
    });
  });

  /* ══════════════════════════════════════
     VITAL BARS ANIMATION
  ══════════════════════════════════════ */
  function animateBars() {
    document.querySelectorAll(".vfill").forEach(bar => {
      bar.style.width = "0%";
      setTimeout(() => { bar.style.width = bar.dataset.w + "%"; }, 80);
    });
  }

  /* ══════════════════════════════════════
     SCAN ITEMS (Inventory tab)
  ══════════════════════════════════════ */
  const GLITCH = "█▓▒░Ω◈▮◉◌▸●○◆■□▪";

  function randomGlitch(len) {
    let s = "";
    for (let i = 0; i < len; i++) s += GLITCH[Math.floor(Math.random() * GLITCH.length)];
    return s;
  }

  document.querySelectorAll(".scan-item").forEach(item => {
    item.addEventListener("click", () => {
      if (item.classList.contains("unlocked")) return;
      const text = item.dataset.text;
      const imgSrc = item.dataset.img;
      const cipher = item.querySelector(".scan-cipher");
      const real = item.querySelector(".scan-real");
      const scanBody = item.querySelector(".scan-body");

      real.textContent = text;
      item.classList.add("scanning");

      let tick = 0;
      const iv = setInterval(() => {
        cipher.textContent = randomGlitch(text.length + 6);
        if (++tick > 14) clearInterval(iv);
      }, 40);

      setTimeout(() => {
        item.classList.remove("scanning");
        item.classList.add("unlocked");
      }, 560);

      if (imgSrc && scanBody) {
        const img = document.createElement("img");
        img.src = imgSrc;
        img.className = "scanned-image";
        img.alt = "Scanned Data";
        
        scanBody.appendChild(img);
      }

    });
  });

  /* ══════════════════════════════════════
     PROJECTS — 3D CAROUSEL (auto-rotating)
  ══════════════════════════════════════ */
  const cards = Array.from(document.querySelectorAll(".car-card"));
  const dots = Array.from(document.querySelectorAll(".cdot"));
  const total = cards.length;
  let curIdx = 0;
  let autoTimer = null;

  function goTo(idx) {
    curIdx = (idx + total) % total;
    cards.forEach((card, i) => {
      card.classList.remove("active", "prev", "next");
      if (i === curIdx) card.classList.add("active");
      else if (i === (curIdx - 1 + total) % total) card.classList.add("prev");
      else if (i === (curIdx + 1) % total) card.classList.add("next");
    });
    dots.forEach((dot, i) => dot.classList.toggle("active", i === curIdx));
  }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(() => goTo(curIdx + 1), 2000);
  }

  function stopAuto() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  }

  dots.forEach(dot => {
    dot.addEventListener("click", () => {
      stopAuto();
      goTo(parseInt(dot.dataset.idx, 10));
      startAuto();
    });
  });

  cards.forEach(card => {
    card.addEventListener("mouseenter", stopAuto);
    card.addEventListener("mouseleave", startAuto);
  });

  goTo(0);
  startAuto();

  /* ══════════════════════════════════════
     CONTACT FORM — EmailJS
  ══════════════════════════════════════ */

  /* ══════════════════════════════════════
   CONTACT FORM — Web3Forms
══════════════════════════════════════ */
  const WEB3FORMS_ACCESS_KEY = "5896b196-65ea-450a-8ac7-419bf106e5a1";

  const sendBtn = document.getElementById("send-btn");
  const cfStatus = document.getElementById("cf-status");

  if (sendBtn) {
    sendBtn.addEventListener("click", async (e) => {
      if (e) e.preventDefault();

      const name = document.getElementById("fn")?.value.trim();
      const email = document.getElementById("fe")?.value.trim();
      const subject = document.getElementById("fs")?.value.trim();
      const message = document.getElementById("fm")?.value.trim();

      let hasError = false;
      ["fn", "fe", "fm"].forEach(id => {
        const el = document.getElementById(id);
        if (el && !el.value.trim()) {
          el.style.borderColor = "rgba(255,80,80,.55)";
          setTimeout(() => { el.style.borderColor = ""; }, 1800);
          hasError = true;
        }
      });
      if (hasError) {
        cfStatus.textContent = "// Missing fields — all required except subject";
        cfStatus.className = "cf-status error";
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        document.getElementById("fe").style.borderColor = "rgba(255,80,80,.55)";
        cfStatus.textContent = "// Invalid frequency — check your email address";
        cfStatus.className = "cf-status error";
        return;
      }

      sendBtn.disabled = true;
      cfStatus.textContent = "// Broadcasting signal...";
      cfStatus.className = "cf-status";

      try {
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            access_key: WEB3FORMS_ACCESS_KEY,
            name: name,
            email: email,
            subject: subject || "(no subject)",
            message: message,
          }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          const actualFormFields = document.querySelector(".cf");
          const successMsg = document.getElementById("success-msg");
          if (actualFormFields) actualFormFields.style.display = "none";
          if (successMsg) successMsg.style.setProperty("display", "flex", "important");
          if (cfStatus) cfStatus.textContent = "";
        } else {
          throw new Error(data.message || "Unknown error");
        }

      } catch (err) {
        console.error("Web3Forms error:", err);
        cfStatus.textContent = "// Transmission failed — try oliviashewmaker@gmail.com directly";
        cfStatus.className = "cf-status error";
        sendBtn.disabled = false;
      }
    });
  }

/* ══════════════════════════════════════
 LIFEPOD PARALLAX — 
══════════════════════════════════════ */
document.addEventListener("mousemove", (e) => {
  if (!lifepod || lifepod.style.display === "none" || lifepod.style.display === "") return;

  if (invOverlay.classList.contains("open")) {
    lifepod.style.transform = "scale(1.1) rotateY(0deg)";
    return;
  }

  const xPct = (e.clientX / window.innerWidth - 0.5) * 2;

  lifepod.style.transform = `scale(1.1) rotateY(${xPct * 6}deg)`;
  lifepod.style.backgroundPosition = `${50 + xPct * -3}% 50%`;
});

});