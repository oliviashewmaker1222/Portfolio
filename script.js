document.addEventListener("DOMContentLoaded", () => {

    const inventoryPanel = document.getElementById("inventory-panel");
    let inventoryOpen = false;

    function toggleInventory(force) {
        if (!inventoryPanel) return;
        inventoryOpen = typeof force === "boolean" ? force : !inventoryOpen;
        inventoryPanel.classList.toggle("open", inventoryOpen);
        inventoryPanel.setAttribute("aria-hidden", String(!inventoryOpen));
    }

    inventoryPanel?.addEventListener("click", (event) => {
        if (event.target === inventoryPanel) toggleInventory(false);
    });

    document.addEventListener("keydown", (event) => {
        const activeTag = document.activeElement?.tagName;
        const typing = activeTag === "INPUT" || activeTag === "TEXTAREA" || activeTag === "SELECT";

        if (event.key.toLowerCase() === "e" && !typing) {
            event.preventDefault();
            toggleInventory();
        }

        if (event.key === "Escape" && inventoryOpen) {
            event.preventDefault();
            toggleInventory(false);
        }
    });

    /* ══════════════════════════════════════
       JELLYFISH — spawn in any container
    ══════════════════════════════════════ */
    const JELLY_COLOURS = ["pink", "cyan", "blue"];

    function makeJelly(container, count) {
        if (!container) return;

        for (let i = 0; i < count; i++) {
            const jelly = document.createElement("div");
            jelly.className = "jelly " + JELLY_COLOURS[Math.floor(Math.random() * JELLY_COLOURS.length)];

            const size = 36 + Math.random() * 64;        // 36–100px
            const dur = 22 + Math.random() * 30;         // 22–52s
            const delay = Math.random() * -40;             // stagger start
            const left = Math.random() * 100;
            const drift = (Math.random() - 0.5) * 160;
            const pulseDur = 2 + Math.random() * 3;

            jelly.style.cssText = `
        left: ${left}%;
        width: ${size}px;
        height: ${size * 0.9}px;
        --drift: ${drift}px;
        animation: jellyFloat ${dur}s linear ${delay}s infinite;
      `;

            // Bell
            const bell = document.createElement("div");
            bell.className = "jelly-bell";
            bell.style.animationDuration = pulseDur + "s";

            // Tentacles
            const legs = document.createElement("div");
            legs.className = "jelly-legs";
            const numLegs = 4 + Math.floor(Math.random() * 5);
            for (let l = 0; l < numLegs; l++) {
                const leg = document.createElement("div");
                leg.className = "jelly-leg";
                const legW = 1.5 + Math.random() * 2;
                const legH = size * (0.5 + Math.random() * 0.7);
                const waveDur = 1 + Math.random() * 2;
                leg.style.cssText = `
          width: ${legW}px;
          height: ${legH}px;
          animation-duration: ${waveDur}s;
          animation-delay: ${Math.random() * -2}s;
        `;
                legs.appendChild(leg);
            }

            jelly.appendChild(bell);
            jelly.appendChild(legs);
            container.appendChild(jelly);
        }
    }

    // Spawn jellyfish into each screen
    makeJelly(document.getElementById("jellies-ocean"), 7);
    makeJelly(document.getElementById("jellies-ext"), 9);
    makeJelly(document.getElementById("jellies-pod"), 5);


    /* ══════════════════════════════════════
       BUBBLES — spawn on ocean screen
    ══════════════════════════════════════ */
    function makeBubbles(container, count) {
        if (!container) return;

        for (let i = 0; i < count; i++) {
            const b = document.createElement("div");
            b.className = "bubble";
            const sz = 4 + Math.random() * 18;
            const dur = 9 + Math.random() * 14;
            const delay = Math.random() * 8;
            const drift = (Math.random() - 0.5) * 70;
            b.style.cssText = `
        width: ${sz}px; height: ${sz}px;
        left: ${Math.random() * 100}%;
        bottom: ${Math.random() * 15}px;
        --drift: ${drift}px;
        animation: rise ${dur}s linear ${delay}s infinite;
      `;
            container.appendChild(b);
        }
    }

    const oceanBubbles = document.getElementById("bubbles");
    const exteriorBubbles = document.getElementById("bubbles-ext");

    makeBubbles(oceanBubbles, 22);
    makeBubbles(exteriorBubbles, 14);


    /* ══════════════════════════════════════
       CLOCK
    ══════════════════════════════════════ */
    function updateClock() {
        const now = new Date();
        const hh = String(now.getHours()).padStart(2, "0");
        const mm = String(now.getMinutes()).padStart(2, "0");
        const ss = String(now.getSeconds()).padStart(2, "0");
        const str = `${hh}:${mm}:${ss}`;

        ["pod-time", "vtime", "ext-time"].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = str;
        });
    }
    updateClock();
    setInterval(updateClock, 1000);


    /* ══════════════════════════════════════
       SCREEN 1 → SCREEN 2: ENTER LIFEPOD
    ══════════════════════════════════════ */
    const diveButton = document.getElementById("dive-btn");
    const ocean = document.getElementById("screen-ocean");
    const ext = document.getElementById("screen-exterior");

    if (diveButton) {
        diveButton.addEventListener("click", () => {
            if (ocean) ocean.style.display = "none";
            if (ext) {
                ext.style.display = "flex";
                ext.style.opacity = "0";
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        ext.style.transition = "opacity 0.7s ease";
                        ext.style.opacity = "1";
                    });
                });
            }
        });
    }


    /* ══════════════════════════════════════
       SCREEN 2 → SCREEN 3: OPEN HATCH
    ══════════════════════════════════════ */
    document.addEventListener("keydown", (event) => {
        if (event.key === 'e' || event.key === 'E') {
            const ext = document.getElementById("screen-exterior");
            const pod = document.getElementById("screen-pod");

            ext.classList.add("dismissed");
            setTimeout(() => {
                ext.style.display = "none";
                pod.style.display = "flex";
                setTimeout(animateBars, 300);
            }, 900);
        }
    });


    /* ══════════════════════════════════════
       PDA TABS
    ══════════════════════════════════════ */
    document.querySelectorAll(".tab-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            const target = btn.dataset.tab;
            document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
            document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
            btn.classList.add("active");
            document.getElementById("tab-" + target).classList.add("active");
            if (target === "resume") setTimeout(animateBars, 150);
        });
    });


    /* ══════════════════════════════════════
       VITAL BARS ANIMATION
    ══════════════════════════════════════ */
    function animateBars() {
        document.querySelectorAll(".vfill").forEach((bar) => {
            bar.style.width = "0%";
            setTimeout(() => { bar.style.width = bar.dataset.w + "%"; }, 80);
        });
    }


    /* ══════════════════════════════════════
       ABOUT — FAB SCAN ITEMS
    ══════════════════════════════════════ */
    const GLITCH = "█▓▒░Ω◈▮◉◌▸●○◆■□▪";

    function randomGlitch(len) {
        let s = "";
        for (let i = 0; i < len; i++) s += GLITCH[Math.floor(Math.random() * GLITCH.length)];
        return s;
    }

    function scanItem(item) {
        if (item.classList.contains("unlocked")) return;
        const realText = item.dataset.text;
        const locked = item.querySelector(".fab-locked");
        const realEl = item.querySelector(".fab-real");

        realEl.textContent = realText;
        item.classList.add("scanning");

        let tick = 0;
        const iv = setInterval(() => {
            locked.textContent = randomGlitch(realText.length + 8);
            if (++tick > 12) clearInterval(iv);
        }, 40);

        setTimeout(() => {
            item.classList.remove("scanning");
            item.classList.add("unlocked");
        }, 520);
    }

    document.querySelectorAll(".fab-item").forEach(item => {
        item.addEventListener("click", () => scanItem(item));
    });


    /* ══════════════════════════════════════
       PROJECTS — 3D CAROUSEL
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
        if (!autoTimer) autoTimer = setInterval(() => goTo(curIdx + 1), 3200);
    }
    function stopAuto() {
        clearInterval(autoTimer); autoTimer = null;
    }

    dots.forEach(dot => {
        dot.addEventListener("click", () => {
            stopAuto(); goTo(parseInt(dot.dataset.idx, 10)); startAuto();
        });
    });

    cards.forEach(card => {
        card.addEventListener("mouseenter", stopAuto);
        card.addEventListener("mouseleave", startAuto);
    });

    goTo(0);
    startAuto();


    /* ══════════════════════════════════════
       CONTACT FORM
    ══════════════════════════════════════ */
    document.getElementById("send-btn").addEventListener("click", () => {
        const name = document.getElementById("fn").value.trim();
        const email = document.getElementById("fe").value.trim();
        const msg = document.getElementById("fm").value.trim();

        if (!name || !email || !msg) {
            ["fn", "fe", "fm"].forEach(id => {
                const el = document.getElementById(id);
                if (!el.value.trim()) {
                    el.style.borderColor = "rgba(255,80,80,0.5)";
                    setTimeout(() => { el.style.borderColor = ""; }, 1200);
                }
            });
            return;
        }

        document.getElementById("cf-form").style.display = "none";
        const success = document.getElementById("success-msg");
        success.style.display = "flex";
    });

});