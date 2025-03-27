import './component';
import './config';
import './preview';

Shopware.Service('cmsService').registerCmsElement({
    name: 'banner-slider',
    label: 'Banner Slider',
    component: 'sw-cms-el-banner-slider',
    configComponent: 'sw-cms-el-config-banner-slider',
    previewComponent: 'sw-cms-el-preview-banner-slider',
    defaultConfig: {
        slides: {
            source: 'static',
            value: [
                {
                    active: true,
                    name: 'Slide 1',
                    text: 'Slide',
                    desktopMedia: '',
                    mobileMedia: ''
                },
            ],
        },
        sliderSettings: {
            source: 'static',
            value: {},
        },
    },
});