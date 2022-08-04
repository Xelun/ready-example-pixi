import * as PIXI from '../utils/pixi';
import { PixiApp } from "../utils/PixiApp";

export const TEXT_EXAMPLE = (app: PixiApp, fontName: string, percentPosX: number, percentPosY: number, onUpdate?: (sprite: PIXI.Text, dt: number) => any) => {
    // Create a text
    let text = new PIXI.Text("", { fontFamily: fontName, fill: 0x883333, align: "center", fontSize: 30, fontWeight: "bold" });
    text.anchor.set(.5, .5);
    text.x = app.width * percentPosX;
    text.y = app.height * percentPosY;
    text.text = app.width + " x " + app.height;

    // Change the text and position everytime the app resizes
    app.onResize((width, height) => {
        text.x = width * percentPosX;
        text.y = height * percentPosY;
        text.text = width + " x " + height;
    });

    if(onUpdate) app.onTickerUpdate((dt) => onUpdate(text, dt));
    
    // Add the text to the scene
    app.addVisual(text);

    return text;
}