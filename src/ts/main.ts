import emitterConfig from "../assets/emitter/emitter.json";
import { PARTICLE_EXAMPLE } from "./example/ParticleExample";
import { SPINE_EXAMPLE } from "./example/SpineExample";
import { SPRITE_EXAMPLE } from "./example/SpriteExample";
import { TEXT_EXAMPLE } from "./example/TextExample";
import { TWEEN_EXAMPLE } from "./example/TweenExample";
import { PixiApp } from "./utils/PixiApp";

window.onload = async () => {
    // Create the pixi app
    const APP = new PixiApp({
        resize: true, // Custom funtionality, to resize the app to the size of the HTML

        antialias: false,
        backgroundAlpha: 1,
        backgroundColor: 0x888800,
        sharedTicker: true,
        autoDensity: true,
        clearBeforeRender: true,
    });


    // -- SPRITE
    await APP.loadAsset("bunny", "/assets/image/bunny.png"); // Load the sprite image

    SPRITE_EXAMPLE(APP, "bunny", .5, .5, (sprite, dt) => {
        sprite.rotation += dt * .05;
    });

    
    // -- TEXT
    await APP.loadFont("SCRIPTIN", "/assets/font/SCRIPTIN.ttf"); // Load a custom font

    TEXT_EXAMPLE(APP, "SCRIPTIN", .5, .25);


    // -- SPINE
    await APP.loadAsset("spineboy", "/assets/spine/spineboy.json"); // Load the spine assets

    SPINE_EXAMPLE(APP, "spineboy", .25, .5);
    

    // -- PARTICLE
    await APP.loadAsset("monsters", "/assets/image/monsters.json"); // Load atlas with monsters to show on the particle emitter
    let textures = [
        { textures: ["eggHead", "flowerTop", "helmlok", "skully"], frameRate: 6 }, // Animated particle
        "bunny", // Static particle
    ];

    PARTICLE_EXAMPLE(APP, textures, emitterConfig, .5, .75);

    // -- TWEEN
    TWEEN_EXAMPLE(APP, .75, .5);
}