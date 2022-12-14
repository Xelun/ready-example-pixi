import { PARTICLE_EXAMPLE } from "./example/ParticleExample";
import { SPINE_EXAMPLE } from "./example/SpineExample";
import { SPRITE_EXAMPLE } from "./example/SpriteExample";
import { TEXT_EXAMPLE } from "./example/TextExample";
import { TRANSLATE_EXAMPLE } from "./example/TranslateExample";
import { TWEEN_EXAMPLE } from "./example/TweenExample";
import { PixiApp } from "./utils/PixiApp";
import { Translate } from "./utils/Translate";
import { Audio } from "./utils/Audio";
import emitterConfig from "../assets/emitter/emitter.json";
import { AUDIO_EXAMPLE } from "./example/AudioExample";
import { SHADER_EXAMPLE } from "./example/ShaderExample";
import { MOCK_EXAMPLE } from "./example/MockExample";

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

    // AUDIO
    await Audio.load("upbeat", [ "/assets/audio/upbeat.mp3"]);
    await Audio.load("count", [ "/assets/audio/count.webm"], {
        "one": [0, 450],
        "two": [2000, 250],
        "three": [4000, 350],
        "four": [6000, 380],
        "five": [8000, 340],
    });

    AUDIO_EXAMPLE(APP, .2, .1);


    // -- SPRITE
    await APP.loadAsset("bunny", "/assets/image/bunny.png"); // Load the sprite image

    SPRITE_EXAMPLE(APP, "bunny", .2, .3, (sprite, dt) => {
        sprite.rotation += dt * .05;
    });
    
    // -- TEXT
    await APP.loadFont("SCRIPTIN", "/assets/font/SCRIPTIN.ttf"); // Load a custom font

    TEXT_EXAMPLE(APP, "SCRIPTIN", .2, .5);
    

    // -- SPINE
    await APP.loadAsset("spineboy", "/assets/spine/spineboy.json"); // Load the spine assets

    SPINE_EXAMPLE(APP, "spineboy", .2, .7);


    // -- PARTICLE
    await APP.loadAsset("monsters", "/assets/image/monsters.json"); // Load atlas with monsters to show on the particle emitter
    let textures = [
        { textures: ["eggHead", "flowerTop", "helmlok", "skully"], frameRate: 6 }, // Animated particle
        "bunny", // Static particle
    ];

    PARTICLE_EXAMPLE(APP, textures, emitterConfig, .2, .9);

    // -- TWEEN
    TWEEN_EXAMPLE(APP, .8, .1);
    
    // -- TRANSLATE
    await Translate.init({
        defaultLanguage: "en",
        paths: [
            (language) => "/locale/" + language + "/translation.json",
        ],
    });
    
    TRANSLATE_EXAMPLE(APP, "Helvetica", .8, .3);

    // -- SHADERS
    await APP.loadAsset("perlin", "/assets/image/perlin.png"); // Load the perlin noise map

    SHADER_EXAMPLE(APP, .8, .5);

    // -- MOCK HTTP CALLS
    MOCK_EXAMPLE(APP, .8, .7);
}