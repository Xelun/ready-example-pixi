import { DisplayObject } from "@pixi/display";
import * as PIXI from "./pixi";

export interface SpineConfig {
    /** Name of the file of the spine */
    path?: string,

    /** Name of the skin to set to the spine ("default" by default) */
    skin?: string,
}

export interface SpineAnimationBlock {
    animations: string | string[],
    loop?: number,
}

/**
 * Entity that allows to reproduce a Spine (image with bones animation)
 */
export class Spine extends PIXI.Spine {
    protected _animationQueue: SpineAnimationBlock[][] = [];

    protected _current: { names?: string[], loop: number, info?: SpineAnimationBlock, index?: number }[] = [];
    protected _skin: string;
    protected _timeScale: number;

    protected _actualAnimations: string[] = [];
    protected _animationsLength: number[] = [];
    protected _animationsLoop: boolean[] = [];

    protected _resolve: ((...data: any) => any)[] = [];
    protected _reject: ((...data: any) => any)[] = [];
    protected _promises: (Promise<any>)[] = [];

    constructor(name: string, skin?: string) { 
        super((<any>PIXI.Loader.shared.resources[name]).spineData);
        this.skin = skin;
        this._timeScale = 1;

        this.state.addListener({
            complete: (entry) => this._nextAnimation(entry.trackIndex),
        });
    }

    // -- FUNCTIONALITY
    public isRunning(): boolean {
        return !!this._actualAnimations;
    }
    
    public set skin(skinName: string) {
        this._skin = skinName ?? "default";

        if(this.skeleton) {
            this.skeleton.setSkinByName(this._skin);
            this.skeleton.setToSetupPose();
        }
    }

    public get skin(): string {
        return this._skin;
    }

    protected getSlot(name: string): PIXI.Container {
        let index = this.skeleton?.findSlotIndex(name);
        return index !== undefined? this.slotContainers[index] : undefined;
    }
    
    // -- FUNCTIONALITY
    /**
     * Plays 
     * @param animations 
     * @param timeScale 
     * @param trackIndex 
     * @returns A promise resolved when all the animations are finished, a promise rejected when the animations are forcibly stopped by the stop action or by playing a new animation on the same track
     */
    public async play(animations: string | SpineAnimationBlock | (string | SpineAnimationBlock)[], trackIndex: number = 0, timeScale?: number): Promise<any> {
        if(!animations) { return Promise.resolve(); }

        if(this._current[trackIndex] !== undefined) this._stop(trackIndex);

        if(timeScale !== undefined) this._timeScale = timeScale;

        this._animationQueue[trackIndex] = [];
        if(animations instanceof Array) {
            animations.forEach(animation => {
                let result =  { 
                    animations: (typeof animation === "string")? [ animation ] : ((typeof animation.animations === "string")? [ animation.animations ] : animation.animations), 
                    loop: (typeof animation === "string")? 0 : animation.loop ?? 0 
                };

                this._animationQueue[trackIndex].push(result);
            });
        } else {

            let result =  { 
                animations: (typeof animations === "string")? [ animations ] : ((typeof animations.animations === "string")? [ animations.animations ] : animations.animations), 
                loop: (typeof animations === "string")? 0 : animations.loop ?? 0 
            };

            this._animationQueue[trackIndex].push(result);
        }

        this._nextAnimation(trackIndex);

        let promise = new Promise((resolve, reject) => { 
            this._resolve[trackIndex] = resolve;
            this._reject[trackIndex] = reject;
        });

        this._promises[trackIndex] = promise;
        return promise;
    }

    public waitAnimations(trackIndex: number = 0): Promise<any> {
        return this._promises[trackIndex];
    }

    protected _nextAnimation(trackIndex: number): void {
        let current = this._current[trackIndex];
        let prevNames = current?.names;


        if(current && current.index < current.info?.animations?.length) {
            current.index++;
            return;

        } else if(!current || current.info.loop <= current.loop) {
            let info = this._animationQueue[trackIndex].shift();
            this._current[trackIndex] = {
                info,
                loop: 1,
                index: 0,
            };

            let animations = info?.animations;
            if(animations !== undefined) this._current[trackIndex].names = (typeof animations === "string")? [animations] : animations;

            current = this._current[trackIndex];
        } else {
            current.loop++;
            current.index = 0;
        }

        let animation = current.info;

        if(!animation) {
            this._stop(trackIndex, prevNames);

            return;
        }

        if(typeof animation.animations === "string") {
            this.state.setAnimation(trackIndex, animation.animations, false);
        } else {
            let anim = animation.animations.shift();

            if(anim) {
                this.state.setAnimation(trackIndex, anim, !!animation.loop);
                animation.animations.forEach(name => this.state.addAnimation(trackIndex, name, false, 0));
            }
        }

        this.state.tracks[trackIndex].timeScale = this._timeScale;
    }

    /** Stop the animation.
     * @param trackIndex Where the animation will be stopped. If not defined, it will stop all the tracks
     */
    public stop(trackIndex?: number): void {
        this._stop(trackIndex);
    }

    protected _stop(trackIndex: number = 0, prevNames?: string[]) {
        if((prevNames ?? this._current[trackIndex ?? 0]?.names)) {
            if(trackIndex !== undefined) {
                this.state.tracks[trackIndex].timeScale = 0;
                delete this._current[trackIndex];
            } else {
                this.state.tracks.forEach(track => track.timeScale = 0);
                this._current = [];
            }

            if(this._resolve[trackIndex]) this._resolve[trackIndex]();
        }
    }

    /** Pause the animation.
     * @param trackIndex Where the animation will be paused. If not defined, it will pause all the tracks.
     */
    public pause(trackIndex?: number): void {
        if(trackIndex !== undefined) this.state.tracks[trackIndex].timeScale = 0;
        else this.state.tracks.forEach(track => track.timeScale = 0);
    }

    /** Resume the animation.
     * @param trackIndex Where the animation will be resumed. If not defined, it will resume all the tracks.
     */
    public resume(trackIndex?: number): void {
        if(trackIndex !== undefined) this.state.tracks[trackIndex].timeScale = this._timeScale;
        else this.state.tracks.forEach(track => track.timeScale = this._timeScale);
    }
}