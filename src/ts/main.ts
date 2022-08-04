import { PixiApp } from "./utils/PixiApp";

window.onload = async () => {
    // Create the pixi app
    const APP = new PixiApp({
        resize: true, // Custom funtionality, to resize the app to the size of the HTML

        antialias: false,
        backgroundAlpha: 1,
        backgroundColor: 0x888800,
        sharedTicker: true,
        autoDensity: true,
        clearBeforeRender: true,
    });


}