import { DisplayObject } from "@pixi/display";
import * as PIXI from './pixi';
import { Tween } from "./Tween";

export interface PixiAppConfig extends PIXI.IApplicationOptions {
    canvasName?: string,
    resize?: boolean,
    maxFps?: number,
}

export class PixiApp {
    protected _app: PIXI.Application;
    protected _onResizeList: ((width: number, height: number) => any)[];
    protected _assetQueue: any[];

    constructor(config: PixiAppConfig = {}) {
        if(!config.view) config.view = document.getElementById(config.canvasName ?? "canvas") as HTMLCanvasElement;

        this._app = new PIXI.Application(config);
        this._onResizeList = [];
        this._assetQueue = [];

        // Recommended concurrency to download assets is minimum 100 (pixi have it as 10 by default)
        PIXI.Loader.shared.concurrency = 100;

        // Allow to set a maximum FPS
        if(config.maxFps) {
            this._app.ticker.minFPS = 0;
            this._app.ticker.maxFPS = config.maxFps;
        }

        this._app.renderer.plugins.interaction.interactionFrequency = 30;
        this._app.renderer.plugins.interaction.moveWhenInside = true;

        if(config.resize) {
            this.resize(document.body.clientWidth, document.body.clientHeight);

            window.addEventListener("resize", () => this.resize(document.body.clientWidth, document.body.clientHeight));
        }

        // Add tween to the app ticker
        this._app.ticker.add((delta) => Tween.update(delta));
    }

    public get width(): number {
        return this._app.renderer?.width ?? 0;
    }

    public get height(): number {
        return this._app.renderer?.height ?? 0;
    }

    /** Load an asset on Pixi */
    public loadAsset(name: string, url: string): Promise<void> {
        return new Promise((resolve) => {
            if(PIXI.Loader.shared.loading) {
                this._assetQueue.push({ assets: [ { name, url } ], resolve });
            } else {
                PIXI.Loader.shared.add({ name, url });
                PIXI.Loader.shared.load(() => this._loadedFinish(resolve));
            }
        });
    }

    public loadAssets(assets: { name: string, url: string }[]): Promise<void> {
        return new Promise((resolve) => {
            if(PIXI.Loader.shared.loading) {
                this._assetQueue.push({ assets, resolve });
            } else {
                assets.forEach(asset => {
                    PIXI.Loader.shared.add({ name: asset.name, url: asset.url });
                });
                PIXI.Loader.shared.load(() => this._loadedFinish(resolve));
            }
        });
    }

    /** Load a font, include it on the html and allow Pixi to use it */
    public loadFont(name, path): Promise<any> {
        return new Promise((resolve) => {
            let font = new (<any>globalThis).FontFace(name, `url(${path})`);
            font.load().then(function(loaded_face) {
                (<any>document).fonts.add(loaded_face);
                let span = document.createElement("span");
                span.style.fontFamily = name;
                document.body.appendChild(span);
                resolve(font);
            });
        });
    }

    /** Show the pixi application */
    public show() {
        this.resume();
        this._app.stage.visible = true;
    }

    /** Hide the pixi application */
    public hide() {
        this.pause();
        this._app.stage.visible = false;
    }

    /** Pause the ticker */
    public pause() {
        this._app.ticker?.stop();
    }

    /** Resume the ticker */
    public resume() {
        this._app.ticker?.start();
    }

    /** Resize the app */
    public resize(width: number, height: number) {
        this._app.renderer?.resize(width, height);
        this._onResizeList.forEach(fn => fn(width, height));
    }

    /** Return the actual Pixi Application */
    public getApp(): PIXI.Application {
        return this._app;
    }

    /** Add a new visual element on the root element of the scene graph */
    public addVisual(visual: DisplayObject) {
        this._app.stage?.addChild(visual);
    }

    /** Add a new action to do when the ticker updates */
    public onTickerUpdate(fn: (dt: number)=> any) {
        this._app.ticker?.add(fn);
    }

    /** Add a new action when the app change size */
    public onResize(fn: (width: number, height: number)=> any) {
        this._onResizeList.push(fn);
    }

    /** Check iof there is still pending assets to be loaded as once the loader is started, no new assets can be added to be load */
    protected _loadedFinish(resolve) {
        if(this._assetQueue.length > 0) {
            PIXI.Loader.shared.reset();

            let resolves = [];
            this._assetQueue.forEach(assetInfo => {
                assetInfo.assets.forEach(asset => {
                    PIXI.Loader.shared.add({
                        name: asset.name,
                        url: asset.url,
                    });
                });
                resolves.push(assetInfo.resolve);
            })

            this._assetQueue = [];
            PIXI.Loader.shared.load(() => this._loadedFinish(resolves));
        }

        if(typeof resolve === "function") resolve();
        else resolve.forEach(res => res());
    }
}