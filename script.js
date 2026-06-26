document.addEventListener("DOMContentLoaded", () => {
    let panels = document.querySelectorAll(".carousel-panel");
    let dots = document.querySelectorAll(".dot-btn"); 
    let curIndex = 0;
    let total = panels.length;
    let rotSpeed = 2000; 
    let autoCycleTimer = null; 

    function updateCar(index) {
        curIndex = index;

        dots.forEach((dot, idx) => {
            dot.classList.remove('active');
            if (idx === curIndex) {
                dot.classList.add('active');
            }
        });

        panels.forEach((panel, idx) => {
            panel.classList.remove('active', 'prev', 'next');

            if (idx === curIndex) {
                panel.classList.add('active');
            } else if (idx === (curIndex - 1 + total) % total) {
                panel.classList.add("prev");
            } else if (idx === (curIndex + 1) % total) {
                panel.classList.add('next');
            }
        });
    }

    function startAutoCycle() {
        if (autoCycleTimer === null) {
            autoCycleTimer = setInterval(() => {
                let nextIndex = (curIndex + 1) % total;
                updateCar(nextIndex);
            }, rotSpeed); 
        }
    }

    function stopAutoCycle() {
        if (autoCycleTimer !== null) {
            clearInterval(autoCycleTimer);
            autoCycleTimer = null;
        }
    }

    dots.forEach((dot, idx) => {
        dot.addEventListener("click", () => {
            updateCar(idx);
        });
    });

    updateCar(0);
    startAutoCycle();

    panels.forEach((panel) => {
        panel.addEventListener("mouseenter", () => {
            stopAutoCycle();
        });
        panel.addEventListener("mouseleave", () => {
            startAutoCycle();
        });
    });
});

function spawnJelly() {
  const wrap = document.getElementById('jelly-container');
  const el = document.createElement('div');
  el.className = 'flora';
  el.innerHTML = '<div class="jelly"></div>';
  el.style.cssText = `left:${Math.random()*100}%;bottom:-60px;transform:scale(${0.4+Math.random()*0.8});animation-duration:${18+Math.random()*22}s;animation-delay:${Math.random()*8}s;`;
  wrap.appendChild(el);
  el.addEventListener('animationend', () => el.remove());
  setTimeout(spawnJelly, 1800 + Math.random() * 3000);
}

spawnJelly(); spawnJelly(); spawnJelly();

let GLITCH = '█▓▒░Ω◈▮◉◌▸●○◆■□▪';
function randomGlitch(len) {
  let s = '';
  for (let i = 0; i < len; i++) s += GLITCH[Math.floor(Math.random() * GLITCH.length)];
  return s;
}

function scrambleReveal(item, realText) {
  let locked = item.querySelector('.fab-locked-text');
  let real = item.querySelector('.fab-real-text');
  real.textContent = realText;
  item.classList.add('scanning');
  let t = 0;
  let interval = setInterval(() => {
    locked.textContent = randomGlitch(realText.length + 10);
    if (++t > 12) clearInterval(interval);
  }, 40);
  setTimeout(() => {
    item.classList.remove('scanning');
    item.classList.add('unlocked');
  }, 520);
}

document.querySelectorAll('.fab-item').forEach(item => {
  item.addEventListener('click', () => {
    if (!item.classList.contains('unlocked'))
      scrambleReveal(item, item.dataset.text);
  });

  let depth = document.getElementById('depth-display');
  let states= ['Signal Nominal', 'Pressure Rising', 'Thermal Vent Detected', 'Deep Water Zone', 'Void Approaching'];
  window.addEventListener('scroll', () => {
    let scrollY = window.scrollY/(document.body.scrollHeight - window.innerHeight);
    let depth2 = Math.round(scrollY * 2500);
    let state = states[Math.min(Math.floor(scrollY * states.length), states.length - 1)];
    depth.textContent = `Depth: ${depth2}m — ${state}`;
  });
});