import * as PIXI from '../utils/pixi';
import { PixiApp } from "../utils/PixiApp";
import { Tween } from "../utils/Tween";

export const TWEEN_EXAMPLE = (app: PixiApp, percentPosX: number, percentPosY: number) => {
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

    let title = new PIXI.Text("Tweens", { fontFamily: "Helvetica", fill: 0xffffff, fontSize: 20, fontWeight: "bold" });
    title.x = -145;
    title.y = -70;
    container.addChild(title);
    
    // Create the sprite to show the sprite, give it a size and position
    let sprite = PIXI.Sprite.from(PIXI.Texture.WHITE);
    sprite.tint = 0x333388;
    sprite.anchor.set(.5, .5);
    sprite.width = 50;
    sprite.height = 50;
    container.addChild(sprite);

    // Create the tween
    let tween = new Tween({ 
        from: sprite, 
        to: { alpha: 0, width: 150, height: 150 }, 
        time: 1000, 
        yoyo: true, 
        repeat: Infinity,
    });

    // Start the tween
    tween.start();

    return sprite;
}