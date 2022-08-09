import * as PIXI from '../utils/pixi';
import { PixiApp } from "../utils/PixiApp";
import vertex from "../../assets/shader/default.vert";
import fragment from "../../assets/shader/custom.frag";

export const SHADER_EXAMPLE = (app: PixiApp, percentPosX: number, percentPosY: number) => {
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

    let title = new PIXI.Text("Shaders", { fontFamily: "Helvetica", fill: 0xffffff, fontSize: 20, fontWeight: "bold" });
    title.x = -145;
    title.y = -70;
    container.addChild(title);

    // Pixi shader 1
    let title1 = new PIXI.Text("Blur", { fontFamily: "Helvetica", fill: 0xffffff, fontSize: 18, align: "center" });
    title1.anchor.set(.5, .5);
    title1.x = -100;
    title1.y = -35;
    container.addChild(title1);

    let sprite1 = PIXI.Sprite.from("eggHead");
    sprite1.anchor.set(.5, .5);
    let scale1 = sprite1.width / sprite1.height;
    sprite1.height = 80;
    sprite1.width = sprite1.height * scale1;
    sprite1.x = -100;
    sprite1.y = 25;

    let filter1 = new PIXI.filters.BlurFilter( 5 );
    sprite1.filters = [ filter1 ];

    container.addChild(sprite1);

    // Pixi shader 2
    let title2 = new PIXI.Text("Glitch", { fontFamily: "Helvetica", fill: 0xffffff, fontSize: 18, align: "center" });
    title2.anchor.set(.5, .5);
    title2.y = -35;
    container.addChild(title2);

    let sprite2 = PIXI.Sprite.from("eggHead");
    sprite2.anchor.set(.5, .5);
    let scale2 = sprite2.width / sprite2.height;
    sprite2.height = 80;
    sprite2.width = sprite2.height * scale2;
    sprite2.y = 25;

    let filter2 = new PIXI.filters.GlitchFilter( { offset: 15, red: [ 0, 5 ], blue: [ 5, 2 ] } );
    sprite2.filters = [ filter2 ];

    let time2 = 0;
    app.onTickerUpdate((dt) => {
        time2 += dt;
        if(time2 >= 5) {
            time2 = 0;
            filter2.refresh();
        }
    });

    container.addChild(sprite2);

    // Custom shader
    let title3 = new PIXI.Text("Custom", { fontFamily: "Helvetica", fill: 0xffffff, fontSize: 18, align: "center" });
    title3.anchor.set(.5, .5);
    title3.x = 100;
    title3.y = -35;
    container.addChild(title3);

    let sprite3 = PIXI.Sprite.from("eggHead");
    sprite3.anchor.set(.5, .5);
    let scale3 = sprite3.width / sprite3.height;
    sprite3.height = 80;
    sprite3.width = sprite3.height * scale3;
    sprite3.x = 100;
    sprite3.y = 25;

    const uniforms = { 
        delta: 0,
        uPerlin: PIXI.Texture.from("perlin"),
    };
    let filter3 = new PIXI.Filter(vertex, fragment, uniforms);
    sprite3.filters = [ filter3 ];

    let time3 = -1;
    app.onTickerUpdate((dt) => {
        time3 += dt * .01;
        if(time3 > 1) time3 = -1;
        uniforms.delta = Math.abs(time3);
    });

    container.addChild(sprite3);
}