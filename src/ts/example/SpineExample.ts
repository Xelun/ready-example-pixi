import { PixiApp } from "../utils/PixiApp";
import { Spine } from "../utils/Spine";

export const SPINE_EXAMPLE = (app: PixiApp, name: string, percentPosX: number, percentPosY: number, onUpdate?: (sprite: Spine, dt: number) => any) => {
    // Create a Spine
    let spine = new Spine(name);
    spine.x = app.width * percentPosX;
    spine.y = app.height * percentPosY;

    // On resize, reposition the spine, make it jump and continue walking
    app.onResize((width, height) => {
        spine.x = width * percentPosX;
        spine.y = height * percentPosY;
        spine.play([ "jump", { animations: "walk", loop: Infinity } ]);
    });

    // Update the spine
    if(onUpdate) app.onTickerUpdate((dt) => onUpdate(spine, dt));

    // Start the walk animation on an infinite loop
    spine.play({ animations: "walk", loop: Infinity });

    // Add spine to the scene
    app.addVisual(spine);

    return spine;
}