import ProgressBarNavSliderPlugin from "./js/progress-bar-nav-slider/progress-bar-nav-slider.plugin";
import VideoControlsPlugin from "./js/video-controls/video-controls.plugin";

const PluginManager = window.PluginManager;

if (!PluginManager.getPlugin('ProgressBarNavSliderPlugin')) {
    PluginManager.register(
        'ProgressBarNavSliderPlugin',
        ProgressBarNavSliderPlugin
    );
}
PluginManager.register('VideoControlsPlugin', VideoControlsPlugin);
