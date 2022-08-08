import { Audio } from "../utils/Audio";
import * as PIXI from '../utils/pixi';
import { PixiApp } from "../utils/PixiApp";

export let IS_MUTED: boolean = false;

export const AUDIO_EXAMPLE = async (app: PixiApp, percentPosX: number, percentPosY: number) => {
    await app.loadAssets([
        { name: "play", url: "/assets/image/play.png"},
        { name: "pause", url: "/assets/image/pause.png"},
        { name: "resume", url: "/assets/image/resume.png"},
        { name: "stop", url: "/assets/image/stop.png"},
        { name: "audio", url: "/assets/image/audio.png"},
        { name: "noaudio", url: "/assets/image/noaudio.png"},
        { name: "circle", url: "/assets/image/circle.png"},
    ]);

    let container = new PIXI.Container();
    container.x = app.width * percentPosX;
    container.y = app.height * percentPosY;

    app.onResize((width, height) => {
        container.x = width * percentPosX;
        container.y = height * percentPosY;
    });
    app.addVisual(container);

    let bg = PIXI.Sprite.from(PIXI.Texture.WHITE);
    bg.tint = 0x333333;
    bg.alpha = .5;
    bg.width = 300;
    bg.height = 150;
    bg.anchor.set(.5, .5);
    container.addChild(bg);

    let title = new PIXI.Text("Audio", { fontFamily: "Helvetica", fill: 0xffffff, fontSize: 20, fontWeight: "bold" });
    title.x = -145;
    title.y = -70;
    container.addChild(title);


    // -- Mute button
    let muteButton = PIXI.Sprite.from("audio");
    muteButton.anchor.set(.5, .5);
    muteButton.width = 40;
    muteButton.height = 40;
    muteButton.y = -45;
    muteButton.interactive = true;

    muteButton.on("pointerdown", async () => {
        muteButton.texture =  PIXI.Texture.from(IS_MUTED? "audio" : "noaudio");

        if(IS_MUTED) {
            Audio.unmute();
        } else {
            Audio.mute();
        }

        IS_MUTED = !IS_MUTED;
    });
    container.addChild(muteButton);


    // -- Ambient music
    let musicBg = PIXI.Sprite.from(PIXI.Texture.WHITE);
    musicBg.tint = 0x333333;
    musicBg.alpha = .5;
    musicBg.width = 130;
    musicBg.height = 70;
    musicBg.x = -75;
    musicBg.y = 30;
    musicBg.anchor.set(.5, .5);
    container.addChild(musicBg);

    let textMusic = new PIXI.Text("Music", { fontFamily: "Helvetica", fill: 0xCCCCCC, align: "center", fontSize: 20, fontWeight: "bold" });
    textMusic.anchor.set(.5, .5);
    textMusic.x = -75;
    textMusic.y = 10;
    container.addChild(textMusic);

    let play = PIXI.Sprite.from("play");
    play.width = 30;
    play.height = 30;
    play.x = -120;
    play.y = 45;
    play.anchor.set(.5, .5);
    play.interactive = true;
    play.on("pointerdown", async () => Audio.play("upbeat", true, 1000));
    container.addChild(play);

    let pause = PIXI.Sprite.from("pause");
    pause.width = 30;
    pause.height = 30;
    pause.x = -90;
    pause.y = 45;
    pause.anchor.set(.5, .5);
    pause.interactive = true;
    pause.on("pointerdown", async () => Audio.pause("upbeat"));
    container.addChild(pause);

    let resume = PIXI.Sprite.from("resume");
    resume.width = 30;
    resume.height = 30;
    resume.x = -60;
    resume.y = 45;
    resume.anchor.set(.5, .5);
    resume.interactive = true;
    resume.on("pointerdown", async () => Audio.resume("upbeat"));
    container.addChild(resume);

    let stop = PIXI.Sprite.from("stop");
    stop.width = 30;
    stop.height = 30;
    stop.x = -30;
    stop.y = 45;
    stop.anchor.set(.5, .5);
    stop.interactive = true;
    stop.on("pointerdown", async () => Audio.stop("upbeat"));
    container.addChild(stop);


    // -- Sounds
    let soundBg = PIXI.Sprite.from(PIXI.Texture.WHITE);
    soundBg.tint = 0x333333;
    soundBg.alpha = .5;
    soundBg.width = 130;
    soundBg.height = 70;
    soundBg.x = 75;
    soundBg.y = 30;
    soundBg.anchor.set(.5, .5);
    container.addChild(soundBg);

    let textSounds = new PIXI.Text("Sounds", { fontFamily: "Helvetica", fill: 0xCCCCCC, align: "center", fontSize: 20, fontWeight: "bold" });
    textSounds.anchor.set(.5, .5);
    textSounds.x = 75;
    textSounds.y = 10;
    container.addChild(textSounds);

    let sound1Button = new PIXI.NineSlicePlane(PIXI.Texture.from("circle"), 55, 55, 55, 55);
    sound1Button.width = 60;
    sound1Button.height = 35;
    sound1Button.x = 13;
    sound1Button.y = 25;
    sound1Button.interactive = true;
    sound1Button.on("pointerdown", async () => Audio.play("one"));
    container.addChild(sound1Button);

    let text1 = new PIXI.Text("One", { fontFamily: "Helvetica", fill: 0xffffff, align: "center", fontSize: 20 });
    text1.anchor.set(.5, .5);
    text1.x = 43;
    text1.y = 42;
    container.addChild(text1);

    let sound2Button = new PIXI.NineSlicePlane(PIXI.Texture.from("circle"), 55, 55, 55, 55);
    sound2Button.width = 60;
    sound2Button.height = 35;
    sound2Button.x = 77;
    sound2Button.y = 25;
    sound2Button.interactive = true;
    sound2Button.on("pointerdown", async () => Audio.play("two"));
    container.addChild(sound2Button);

    let text2 = new PIXI.Text("Two", { fontFamily: "Helvetica", fill: 0xffffff, align: "center", fontSize: 20 });
    text2.anchor.set(.5, .5);
    text2.x = 107;
    text2.y = 42;
    container.addChild(text2);
}