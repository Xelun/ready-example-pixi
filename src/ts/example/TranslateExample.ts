import * as PIXI from '../utils/pixi';
import { PixiApp } from "../utils/PixiApp";
import { Translate } from "../utils/Translate";

export const TRANSLATE_EXAMPLE = (app: PixiApp, fontName: string, percentPosX: number, percentPosY: number) => {
    // Create a text
    let text = new PIXI.Text(
        Translate.translate("hello"), 
        { fontFamily: fontName, fill: 0x883333, align: "center", fontSize: 30, fontWeight: "bold" }
    );
    text.anchor.set(.5, .5);
    text.x = app.width * percentPosX;
    text.y = app.height * percentPosY;
    
    // Add the text to the scene
    app.addVisual(text);

    // Add a button to change the language to english
    let button1 = PIXI.Sprite.from(PIXI.Texture.WHITE);
    button1.tint = 0x333333;
    button1.width = 100;
    button1.height = 50;
    button1.anchor.set(.5, .5);
    button1.x = app.width * percentPosX - 70;
    button1.y = app.height * percentPosY + 50;
    button1.interactive = true;
    button1.on("pointerdown", async () => {
        await Translate.setLanguage("en");
        text.text = Translate.translate("hello");
    });

    let textButton1 = new PIXI.Text("English", { fontFamily: fontName, fill: 0xAAAAAA, align: "center", fontSize: 25, fontWeight: "bold" });
    textButton1.anchor.set(.5, .5);
    textButton1.x = app.width * percentPosX - 70;
    textButton1.y = app.height * percentPosY + 50;

    app.addVisual(button1);
    app.addVisual(textButton1);

    // Add a button to change the language to spanish
    let button2 = PIXI.Sprite.from(PIXI.Texture.WHITE);
    button2.tint = 0x333333;
    button2.width = 100;
    button2.height = 50;
    button2.anchor.set(.5, .5);
    button2.x = app.width * percentPosX + 70;
    button2.y = app.height * percentPosY + 50;
    button2.interactive = true;
    button2.on("pointerdown", async () => {
        await Translate.setLanguage("es");
        text.text = Translate.translate("hello");
    });

    let textButton2 = new PIXI.Text("Spanish", { fontFamily: fontName, fill: 0xAAAAAA, align: "center", fontSize: 25, fontWeight: "bold" });
    textButton2.anchor.set(.5, .5);
    textButton2.x = app.width * percentPosX + 70;
    textButton2.y = app.height * percentPosY + 50;

    app.addVisual(button2);
    app.addVisual(textButton2);

    // Change the position everytime the app resizes
    app.onResize((width, height) => {
        text.x = width * percentPosX;
        text.y = height * percentPosY;
        
        button1.x = app.width * percentPosX - 70;
        button1.y = app.height * percentPosY + 50;
        textButton1.x = app.width * percentPosX - 70;
        textButton1.y = app.height * percentPosY + 50;
        
        button2.x = app.width * percentPosX + 70;
        button2.y = app.height * percentPosY + 50;
        textButton2.x = app.width * percentPosX + 70;
        textButton2.y = app.height * percentPosY + 50;
    });

    return text;
}