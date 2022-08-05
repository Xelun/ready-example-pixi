import { AnimatedParticle, ParticleEmitter } from "../utils/ParticleEmitter";
import { PixiApp } from "../utils/PixiApp";
import * as PIXI from '../utils/pixi';

export const PARTICLE_EXAMPLE = (app: PixiApp, textures: (AnimatedParticle | string)[], emitterConfig: any, percentPosX: number, percentPosY: number) => {
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

    // Create the emitter
    let emitter = new ParticleEmitter({
        textures: textures,
        config: emitterConfig,
    });
    container.addChild(emitter);

    emitter.play();

    return emitter;
}