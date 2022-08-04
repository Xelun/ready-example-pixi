import { AnimatedParticle, ParticleEmitter } from "../utils/ParticleEmitter";
import { PixiApp } from "../utils/PixiApp";

export const PARTICLE_EXAMPLE = (app: PixiApp, textures: (AnimatedParticle | string)[], emitterConfig: any, percentPosX: number, percentPosY: number) => {
    let emitter = new ParticleEmitter({
        textures: textures,
        config: emitterConfig,
    });
    emitter.x = app.width * percentPosX;
    emitter.y = app.height * percentPosY;

    emitter.play();

    app.onResize((width, height) => {
        emitter.x = width * percentPosX;
        emitter.y = height * percentPosY;
    });

    app.addVisual(emitter);

    return emitter;
}