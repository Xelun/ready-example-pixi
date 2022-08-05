import { PixiApp } from "../utils/PixiApp";
import { Spine } from "../utils/Spine";
import * as PIXI from '../utils/pixi';

export const SPINE_EXAMPLE = (app: PixiApp, name: string, percentPosX: number, percentPosY: number, onUpdate?: (sprite: Spine, dt: number) => any) => {
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
    
    // Create a Spine
    let spine = new Spine(name);
    let scale = spine.width / spine.height;
    spine.height = 150;
    spine.width = spine.height * scale;
    spine.y = 75;
    container.addChild(spine);

    // On resize, reposition the spine, make it jump and continue walking
    app.onResize((width, height) => {
        spine.play([ "jump", { animations: "walk", loop: Infinity } ]);
    });

    // Update the spine
    if(onUpdate) app.onTickerUpdate((dt) => onUpdate(spine, dt));

    // Start the walk animation on an infinite loop
    spine.play({ animations: "walk", loop: Infinity });

    return spine;
}