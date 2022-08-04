import * as PIXI from '../utils/pixi';
import { PixiApp } from "../utils/PixiApp";

export const SPRITE_EXAMPLE = (app: PixiApp, name: string, percentPosX: number, percentPosY: number, onUpdate?: (sprite: PIXI.Sprite, dt: number) => any) => {
    // Create the sprite to show the sprite, give it a size and position
    let sprite = PIXI.Sprite.from(name);
    sprite.anchor.set(.5, .5);
    sprite.x = app.width * percentPosX;
    sprite.y = app.height * percentPosY;

    // Change the position of the sprite each time the app is resized
    app.onResize((width, height) => {
        sprite.x = width * percentPosX;
        sprite.y = height * percentPosY;
    });

    // Update the sprite
    if(onUpdate) app.onTickerUpdate((dt) => onUpdate(sprite, dt));

    // Add the sprite to the scene
    app.addVisual(sprite);

    return sprite;
}