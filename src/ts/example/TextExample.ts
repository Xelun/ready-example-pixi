import * as PIXI from '../utils/pixi';
import { PixiApp } from "../utils/PixiApp";

export const TEXT_EXAMPLE = (app: PixiApp, fontName: string, percentPosX: number, percentPosY: number, onUpdate?: (sprite: PIXI.Text, dt: number) => any) => {
    // Create the container for the whole example
    let container = new PIXI.Container();
    container.x = app.width * percentPosX;
    container.y = app.height * percentPosY;

    app.onResize((width, height) => {
        container.x = width * percentPosX;
        container.y = height * percentPosY;
    });
    app.addVisual(container);

    // Background
    let bg = PIXI.Sprite.from(PIXI.Texture.WHITE);
    bg.tint = 0x333333;
    bg.alpha = .5;
    bg.width = 300;
    bg.height = 150;
    bg.anchor.set(.5, .5);
    container.addChild(bg);

    let title = new PIXI.Text("Text", { fontFamily: "Helvetica", fill: 0xffffff, fontSize: 20, fontWeight: "bold" });
    title.x = -145;
    title.y = -70;
    container.addChild(title);
    
    // Create a text
    let text = new PIXI.Text("", { fontFamily: fontName, fill: 0xCC5555, align: "center", fontSize: 30, fontWeight: "bold" });
    text.anchor.set(.5, .5);
    text.text = app.width + " x " + app.height;
    container.addChild(text);

    // Change the text and position everytime the app resizes
    app.onResize((width, height) => {
        text.text = width + " x " + height;
    });

    if(onUpdate) app.onTickerUpdate((dt) => onUpdate(text, dt));

    return text;
}