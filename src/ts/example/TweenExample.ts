import * as PIXI from '../utils/pixi';
import { PixiApp } from "../utils/PixiApp";
import { Tween } from "../utils/Tween";

export const TWEEN_EXAMPLE = (app: PixiApp, percentPosX: number, percentPosY: number) => {
    // Create the sprite to show the sprite, give it a size and position
    let sprite = PIXI.Sprite.from(PIXI.Texture.WHITE);
    sprite.tint = 0x333388;
    sprite.anchor.set(.5, .5);
    sprite.width = 50;
    sprite.height = 50;
    sprite.x = app.width * percentPosX;
    sprite.y = app.height * percentPosY;

    // Change the position of the sprite each time the app is resized
    app.onResize((width, height) => {
        sprite.x = width * percentPosX;
        sprite.y = height * percentPosY;
    });

    // Add the sprite to the scene
    app.addVisual(sprite);

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