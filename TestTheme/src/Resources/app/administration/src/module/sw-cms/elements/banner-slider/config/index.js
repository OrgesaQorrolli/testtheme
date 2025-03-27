import template from './sw-cms-el-config-banner-slider.html.twig';
import './sw-cms-el-config-banner-slider.scss';

const {Component, Mixin, Context, Utils, Data} = Shopware;

Component.register('sw-cms-el-config-banner-slider', {
    template,

    mixins: [Mixin.getByName('cms-element')],

    inject: ['repositoryFactory'],

    data() {
        return {
            mediaRepository: null, slideDesktopMediaPreviews: [], slideMobileMediaPreviews: [],
        };
    },

    created() {
        this.createdComponent();
        this.getMediaEntityPreviews();
        this.initRepositories();
    },

    watch: {
        element: {
            deep: true, handler() {
                this.getMediaEntityPreviews();
            },
        },
    },

    methods: {
        initRepositories() {
            this.mediaRepository = this.repositoryFactory.create('media');
        },

        async createdComponent() {
            this.initElementConfig('banner-slider');
        },

        async getMediaEntityPreviews() {
            if (!this.element?.config?.slides?.value) return;

            this.slideDesktopMediaPreviews = [];
            this.slideMobileMediaPreviews = [];

            for (const [index, slide] of this.element.config.slides.value.entries()) {
                // Desktop
                if (slide.desktopMedia) {
                    try {
                        const mediaEntity = await this.mediaRepository.get(slide.desktopMedia, Context.api);
                        this.$set(this.slideDesktopMediaPreviews, index, mediaEntity.url);
                    } catch (e) {
                        console.warn('Failed to fetch desktop media:', e);
                        this.$set(this.slideDesktopMediaPreviews, index, null);
                    }
                } else {
                    this.$set(this.slideDesktopMediaPreviews, index, null);
                }

                // Mobile
                if (slide.mobileMedia) {
                    try {
                        const mediaEntity = await this.mediaRepository.get(slide.mobileMedia, Context.api);
                        this.$set(this.slideMobileMediaPreviews, index, mediaEntity.url);
                    } catch (e) {
                        console.warn('Failed to fetch mobile media:', e);
                        this.$set(this.slideMobileMediaPreviews, index, null);
                    }
                } else {
                    this.$set(this.slideMobileMediaPreviews, index, null);
                }
            }
        },

        async onChangeDesktopMedia(mediaEntity, index) {
            if (mediaEntity && mediaEntity[0]) {
                this.$set(this.slideDesktopMediaPreviews, index, mediaEntity[0].url);
                this.element.config.slides.value[index].desktopMedia = mediaEntity[0].id;
                this.$emit('element-update', this.element);
            }
        },

        async onChangeMobileMedia(mediaEntity, index) {
            if (mediaEntity && mediaEntity[0]) {
                this.$set(this.slideMobileMediaPreviews, index, mediaEntity[0].url);
                this.element.config.slides.value[index].mobileMedia = mediaEntity[0].id;
                this.$emit('element-update', this.element);
            }
        },

        async onFinishUploadDesktopMedia(mediaItem, index) {
            if (!mediaItem || typeof mediaItem.targetId !== 'string') {
                console.warn('[BannerSlider] Invalid mediaItem:', mediaItem, 'at index', index);
                return;
            }

            try {
                const mediaEntity = await this.mediaRepository.get(mediaItem.targetId, Context.api);

                if (!mediaEntity || !mediaEntity.id) {
                    console.warn('[BannerSlider] Media entity not found for ID:', mediaItem.targetId);
                    return;
                }

                this.$set(this.slideDesktopMediaPreviews, index, mediaEntity.url);
                this.element.config.slides.value[index].desktopMedia = mediaEntity.id;

                this.$emit('element-update', this.element);
            } catch (e) {
                console.error('[BannerSlider] Failed to fetch desktop media entity:', e);
            }
        },

        async onFinishUploadMobileMedia(mediaItem, index) {
            if (!mediaItem || !mediaItem.targetId || index === undefined) {
                return;
            }

            try {
                const mediaEntity = await this.mediaRepository.get(mediaItem.targetId, Context.api);
                this.$set(this.slideMobileMediaPreviews, index, mediaEntity.url);
                this.element.config.slides.value[index].mobileMedia = mediaEntity.id;
                this.$emit('element-update', this.element);
            } catch (e) {
                console.error('Failed to fetch mobile media entity:', e);
            }
        },

        onRemoveSlideMobileMedia(slide) {
            const index = this.element.config.slides.value.indexOf(slide);
            this.$set(this.slideMobileMediaPreviews, index, null);
            slide.mobileMedia = null;
        },

        onRemoveSlideDesktopMedia(slide) {
            const index = this.element.config.slides.value.indexOf(slide);
            this.$set(this.slideDesktopMediaPreviews, index, null);
            slide.desktopMedia = null;
        },

        onClickAddSlide() {
            const newSlide = {
                active: true,
                id: Utils.createId(),
                contentType: 'default',
                title: 'Lorem Ipsum',
                text: 'Lorem Ipsum',
                image: '',
                buttonText: 'Lorem Ipsum',
                buttonUrl: 'url',
                linkText: 'Lorem Ipsum',
                linkUrl: 'link',
                content: '',
                contentText: '',
                desktopMedia: null,
                mobileMedia: null
            };

            this.element.config.slides.value.push(newSlide);

            this.slideDesktopMediaPreviews.push(null);
            this.slideMobileMediaPreviews.push(null);

            this.getMediaEntityPreviews();
        },

        onClickMoveSlide(index, direction) {
            const slides = this.element.config.slides.value;
            let newIndex = null;

            if (direction === 'up') {
                newIndex = index - 1;
            } else if (direction === 'down') {
                newIndex = index + 1;
            }

            if (newIndex !== null) {
                slides.splice(newIndex, 0, slides.splice(index, 1)[0]);
            }

            this.element.config.slides.value = slides;
            this.getMediaEntityPreviews();
        },

        onClickDuplicateSlide(slide) {
            const slides = this.element.config.slides.value;
            const index = slides.indexOf(slide);

            const slideCopy = {
                ...slide,
                id: Utils.createId(),
                name: slide.name + ' ' + this.$tc('Copy'),
                desktopMedia: slide.desktopMedia,
                mobileMedia: slide.mobileMedia
            };

            slides.splice(index + 1, 0, slideCopy);
            this.element.config.slides.value = slides;
            this.getMediaEntityPreviews();
        },

        onClickRemoveSlide(slide) {
            const slides = this.element.config.slides.value;
            const index = slides.indexOf(slide);
            slides.splice(index, 1);
            this.element.config.slides.value = slides;
            this.getMediaEntityPreviews();
        },
    },
});