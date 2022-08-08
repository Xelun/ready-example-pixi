import * as PIXI from '../utils/pixi';
import { PixiApp } from "../utils/PixiApp";

export const SPRITE_EXAMPLE = (app: PixiApp, name: string, percentPosX: number, percentPosY: number, onUpdate?: (sprite: PIXI.Sprite, dt: number) => any) => {
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

    let title = new PIXI.Text("Sprite", { fontFamily: "Helvetica", fill: 0xffffff, fontSize: 20, fontWeight: "bold" });
    title.x = -145;
    title.y = -70;
    container.addChild(title);
    
    // Create the sprite to show the sprite, give it a size and position
    let sprite = PIXI.Sprite.from(name);
    sprite.anchor.set(.5, .5);
    container.addChild(sprite);

    // Update the sprite
    if(onUpdate) app.onTickerUpdate((dt) => onUpdate(sprite, dt));

    return sprite;
}