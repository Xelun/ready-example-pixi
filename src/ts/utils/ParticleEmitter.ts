
import * as PIXI from "./pixi";

export interface AnimatedParticle {
    /** Names of the textures to use as animated particle */
    textures: string[],

    /** FrameRate of the animation of the particle */
    frameRate?: number,
}

export interface EmitterConfig {
    /** Texture to use as particles */
    textures?: (AnimatedParticle | string)[],

    /** Configuration of the emitter (editor: https://pixijs.io/pixi-particles-editor/) */
    config?: any,

    /** Version of the configuration (true by default (the one used on the pixi editor)) */
    oldConfig?: boolean,

    /** Custom easing to apply the configuration based on the time passed */
    easing?: (time: number) => number,
}


export class ParticleEmitter extends PIXI.Container {
    protected _emitter: PIXI.particles.Emitter;
    protected _config: any;
    protected _oldConfig: boolean;
    protected _textures: any[] = [];
    protected _easing: (t: number) => number;

    constructor(config: EmitterConfig = {}) { 
        super(); 
        this._initialize(config);
    }

    protected _initialize(config: EmitterConfig) {
        this._easing = config.easing;
        this._config = config.config;
        this._oldConfig = config.oldConfig ?? true;

        this.setTextures(config.textures);
    }

    // -- SETTERS & GETTERS
    public setTextures(textures: (AnimatedParticle | string)[]): ParticleEmitter {
        this._textures = [];
        textures.forEach(texture => this.pushTexture(texture));
        this.updateEmitter();

        return this;
    }

    public set config(config: any) { 
        this._config = config; 
        if(this._emitter) this.updateEmitter();
    }

    public get config(): any {
        return this._config;
    }

    public set easing(easing: (t: number) => number) {
        this._easing = easing;
        if(this._emitter) this.updateEmitter();
    }

    public get easing(): (t: number) => number {
        return this._easing;
    }

    
    // -- FUNCTIONALITY
    public play(): void {
        if(!this._emitter && this._textures && this._config) this.updateEmitter();
        if(this._emitter) {
            this._emitter.autoUpdate = true;
            this._emitter.emit = true;
        }
    }

    public pause(): void {
        if(this._emitter) {
            this._emitter.emit = false;
        }
    }
    public resume(): void {
        if(this._emitter) {
            this._emitter.emit = true;
        }
    }

    public stop(): void {
        if(this._emitter) {
            this._emitter.cleanup();
            this._emitter.autoUpdate = false;
            this._emitter.emit = false;
        }
    }

    protected updateEmitter(): void {
        let config = this._oldConfig? PIXI.particles.upgradeConfig(this._config, this._textures) : this._config;
        this._emitter = new PIXI.particles.Emitter(this, config);
        this._emitter.updateOwnerPos(this.x ?? 0, this.y ?? 0);

        if(this._easing) this._emitter.customEase = this._easing;
    }

    protected pushTexture(texture: (AnimatedParticle | string)) {
        if(!texture) return;

        if(typeof texture === "string") {
            this._textures.push(this.getAnimatedParticle({ textures: [texture], frameRate: 0 }));
        } else {
            this._textures.push(this.getAnimatedParticle(texture));
        }
    }

    protected getAnimatedParticle(texture: AnimatedParticle) {
        let finalTextures = [];
        texture.textures.forEach(tex => { if(tex) finalTextures.push(PIXI.Texture.from(tex)); });

        return {
            framerate: texture.frameRate,
            loop: true,
            textures: finalTextures
        };
    }
}