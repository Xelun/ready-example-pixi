import * as PIXI from '../utils/pixi';
import { PixiApp } from "../utils/PixiApp";
import Pretender from "pretender";
import { Utils } from "../utils/Utils";

const URL = "https://myMockServer.com/response";
const URL_2 = "/assets/json/response.json";

const OPTIONS: RequestInit = {
    headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
    },
    method: "POST",
    body: JSON.stringify({})
};

const OPTIONS_2: RequestInit = {
    headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
    },
    method: "GET",
};

export const MOCK_EXAMPLE = (app: PixiApp, percentPosX: number, percentPosY: number) => {
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

    let title = new PIXI.Text("HTTP Mock", { fontFamily: "Helvetica", fill: 0xffffff, fontSize: 20, fontWeight: "bold" });
    title.x = -145;
    title.y = -70;
    container.addChild(title);

    let button = new PIXI.NineSlicePlane(PIXI.Texture.from("circle"), 55, 55, 55, 55);
    button.width = 100;
    button.height = 35;
    button.y = -37.5;
    button.x = -120;
    button.interactive = true;
    button.on("pointerdown", async () => {
        let response = await Utils.httpCall(URL, OPTIONS);
        text.text = JSON.stringify(response);
    });
    container.addChild(button);

    let buttonText = new PIXI.Text("Mock call", { fontFamily: "Helvetica", fill: 0xffffff, align: "center", fontSize: 20 });
    buttonText.anchor.set(.5, .5);
    buttonText.x = -70;
    buttonText.y = -20;
    container.addChild(buttonText);

    let button2 = new PIXI.NineSlicePlane(PIXI.Texture.from("circle"), 55, 55, 55, 55);
    button2.width = 100;
    button2.height = 35;
    button2.y = -37.5;
    button2.x = 20;
    button2.interactive = true;
    button2.on("pointerdown", async () => {
        let response = await Utils.httpCall(URL_2, OPTIONS_2);
        text.text = JSON.stringify(response);
    });
    container.addChild(button2);

    let buttonText2 = new PIXI.Text("Real call", { fontFamily: "Helvetica", fill: 0xffffff, align: "center", fontSize: 20 });
    buttonText2.anchor.set(.5, .5);
    buttonText2.x = 70;
    buttonText2.y = -20;
    container.addChild(buttonText2);

    let text = new PIXI.Text("Press the button", { fontFamily: "Helvetica", fill: 0xffffff, fontSize: 18 });
    text.anchor.set(.5, .5);
    text.y = 30;
    container.addChild(text);


    // -- Create pretender
    let server = new Pretender();

    // Passthrough internal requests
    server.get(`${location.origin}/*`, server.passthrough);

    // Mock call
    server.post(URL,
        () => {
            return [
                200, 
                { "Content-Type": "application/json;charset=UTF-8" }, 
                JSON.stringify({
                    mock: true, 
                    data: "hello",
                }),
            ];
        }, 0);
}