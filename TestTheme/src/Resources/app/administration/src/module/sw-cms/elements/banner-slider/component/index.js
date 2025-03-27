import template from './sw-cms-el-banner-slider.html.twig';
import './sw-cms-el-banner-slider.scss';

const {Component, Mixin, Context, Utils} = Shopware;
const {cloneDeep} = Utils.object;

Component.register('sw-cms-el-banner-slider', {
    template,

    mixins: [Mixin.getByName('cms-element')],

    inject: ['repositoryFactory'],

    data() {
        return {
            previewBackgroundMedia: [],
            previewBackgroundMediaHasInitLoaded: false,
        };
    },

    computed: {
        mediaRepository() {
            return this.repositoryFactory.create('media');
        },

        previewSlides() {
            const config = this.element?.config;

            if (!config?.slides?.value || !Array.isArray(config.slides.value)) {
                return [];
            }

            const sliderSettings = config.sliderSettings?.value || {};

            const activeSlides = config.slides.value.filter(slide => slide.active);

            if (sliderSettings.loop && activeSlides.length < sliderSettings.items) {
                const missing = sliderSettings.items - activeSlides.length;
                for (let i = 0; i < missing; i++) {
                    activeSlides.push(activeSlides[i % activeSlides.length]);
                }
            }

            return activeSlides.slice(0, sliderSettings.items || activeSlides.length);
        },

        previewSlidesProxy() {
            return cloneDeep(this.previewSlides);
        },
    },

    created() {
        this.createdComponent();
    },

    methods: {
        createdComponent() {
            this.initElementConfig('banner-slider');
            this.initElementData('banner-slider');

            if (!this.element.config.slides.value[0].id) {
                this.element.config.slides.value[0].id = Utils.createId();
            }
        },
    },
});