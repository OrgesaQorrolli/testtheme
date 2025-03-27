import './component';
import './preview';

Shopware.Service('cmsService').registerCmsBlock({
    name: 'banner-slider',
    label: 'Banner Slider',
    category: 'test-theme',
    component: 'sw-cms-block-banner-slider',
    previewComponent: 'sw-cms-block-preview-banner-slider',
    defaultConfig: {
        marginBottom: '',
        marginTop: '',
        marginLeft: '',
        marginRight: '',
        sizingMode: 'boxed',
    },
    slots: {
        slider: {
            type: 'banner-slider',
        },
    },
});
