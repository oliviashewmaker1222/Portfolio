document.addEventListener("DOMContentLoaded", () => {
    let panels = document.querySelectorAll(".carousel-panel");
    let dots = document.querySelectorAll(".dot-btn"); 
    let curIndex = 0;
    let total = panels.length;
    let rotSpeed = 3500; 
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