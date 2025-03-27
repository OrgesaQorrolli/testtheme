import Plugin from 'src/plugin-system/plugin.class';

export default class ProgressBarNavSliderPlugin extends Plugin {
    init() {
        const sliderElement = document.querySelector(".banner-slider-wrapper");
        const paginationButtons = document.querySelectorAll(".tns-nav button");
        let activeIndex = 0;

        if (!sliderElement || paginationButtons.length === 0) {
            return;
        }

        let sliderOptions = {};
        try {
            sliderOptions = JSON.parse(sliderElement.getAttribute("data-base-slider-options") || "{}");
        } catch (e) {
            console.warn("Slider options parse failed", e);
        }

        const autoPlayTimeout = sliderOptions?.slider?.autoplayTimeout || 4000;
        const totalSlides = paginationButtons.length;

        const updateProgress = () => {
            paginationButtons.forEach((button, index) => {
                if (index < activeIndex) {
                    button.style.background = "#FFFFFF";
                } else {
                    button.style.background = "#D9D9D9";
                }
                button.style.setProperty("--progress-duration", "0ms");
                button.classList.remove("tns-nav-active");
            });

            if (activeIndex < totalSlides) {
                const currentButton = paginationButtons[activeIndex];
                currentButton?.classList.add("tns-nav-active");
                currentButton?.style.setProperty("--progress-duration", `${autoPlayTimeout}ms`);
            }
        };

        const observer = new MutationObserver(() => {
            const newActiveIndex = [...paginationButtons].findIndex(button =>
                button.classList.contains("tns-nav-active")
            );

            if (newActiveIndex !== -1 && newActiveIndex !== activeIndex) {
                activeIndex = newActiveIndex;
                updateProgress();
            }

            if (activeIndex === totalSlides - 1) {
                setTimeout(() => {
                    paginationButtons.forEach(button => {
                        button.style.background = "#D9D9D9";
                    });
                }, autoPlayTimeout);
            }
        });

        const observerConfig = { attributes: true, subtree: true, attributeFilter: ["class"] };
        paginationButtons.forEach(button => observer.observe(button, observerConfig));

        setInterval(() => {
            const currentIndex = [...paginationButtons].findIndex(button =>
                button.classList.contains("tns-nav-active")
            );

            if (currentIndex !== -1 && currentIndex !== activeIndex) {
                activeIndex = currentIndex;
                updateProgress();
            }
        }, autoPlayTimeout);

        updateProgress();

        sliderElement.addEventListener("transitionend", () => {
            if (activeIndex === 0) {
                paginationButtons.forEach(button => {
                    button.style.setProperty("--progress-duration", "0ms");
                    button.classList.remove("tns-nav-active");
                });
                updateProgress();
            }
        });
    }
}
