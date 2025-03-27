import Plugin from 'src/plugin-system/plugin.class';

export default class VideoControlsPlugin extends Plugin {

    init() {
        const slider = document.querySelector('.cms-element-banner-slider');
        const videoElements = document.querySelectorAll('.cms-element-banner-slider video');

        videoElements.forEach(video => {
            video.setAttribute('muted', '');
            video.setAttribute('playsinline', '');
            video.setAttribute('autoplay', '');
            video.setAttribute('loop', '');
            video.pause();
        });

        if (slider && window.tns) {
            const sliderInstance = window.tns.get(slider.getAttribute('id'));

            sliderInstance.events.on('indexChanged', (info) => {
                const slides = document.querySelectorAll('.tns-item');
                slides.forEach((slide, index) => {
                    const video = slide.querySelector('video');
                    if (video) {
                        if (index === info.index) {
                            video.currentTime = 0;
                            video.play();
                        } else {
                            video.pause();
                        }
                    }
                });
            });
        }
    }
}
