import * as PIXI from '../utils/pixi';
import { PixiApp } from "../utils/PixiApp";
import { Translate } from "../utils/Translate";

export const TRANSLATE_EXAMPLE = (app: PixiApp, fontName: string, percentPosX: number, percentPosY: number) => {
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

    // Create a text
    let text = new PIXI.Text(
        Translate.translate("hello"), 
        { fontFamily: fontName, fill: 0xCC5555, align: "center", fontSize: 30, fontWeight: "bold" }
    );
    text.anchor.set(.5, .5);
    text.y = -20;
    container.addChild(text);

    // Add a button to change the language to english
    let button1 = new PIXI.NineSlicePlane(PIXI.Texture.from("circle"), 55, 55, 55, 55);
    button1.width = 120;
    button1.height = 50;
    button1.x = -130;
    button1.y = 20;
    button1.interactive = true;
    button1.on("pointerdown", async () => {
        await Translate.setLanguage("en");
        text.text = Translate.translate("hello");
    });

    let textButton1 = new PIXI.Text("English", { fontFamily: fontName, fill: 0xffffff, align: "center", fontSize: 25 });
    textButton1.anchor.set(.5, .5);
    textButton1.x = -70;
    textButton1.y = 45;

    container.addChild(button1);
    container.addChild(textButton1);

    // Add a button to change the language to spanish
    let button2 = new PIXI.NineSlicePlane(PIXI.Texture.from("circle"), 55, 55, 55, 55);
    button2.width = 120;
    button2.height = 50;
    button2.x = 10;
    button2.y = 20;
    button2.interactive = true;
    button2.on("pointerdown", async () => {
        await Translate.setLanguage("es");
        text.text = Translate.translate("hello");
    });

    let textButton2 = new PIXI.Text("Spanish", { fontFamily: fontName, fill: 0xffffff, align: "center", fontSize: 25 });
    textButton2.anchor.set(.5, .5);
    textButton2.x = 70;
    textButton2.y = 45;

    container.addChild(button2);
    container.addChild(textButton2);

    return text;
}