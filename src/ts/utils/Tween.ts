import * as TWEEN from '@tweenjs/tween.js';

export interface TweenConfig {
    /** Start values of the tween */
    from: any,
    /** End values of the tween */
    to: any,
    /** Time the animation of the tween will last */
    time: number,
    /** If the animation will go back to the initial position */
    yoyo?: boolean,
    /** Number of repetitions of the animation */
    repeat?: number,
    /** Easing the animation will have */
    easing?: (time: number) => number,

    /** Actions to do when the state of the tween change */
    actions?: {
        /** Action to do when the tween start */
        start?: (tween: Tween, value: any, ...data: any) => any,
        /** Action to do when the tween updates */
        update?: (tween: Tween, value: any, elapsed: number, ...data: any) => any,
        /** Action to do when the tween starts repeating the animation */
        repeat?: (tween: Tween, value: any, ...data: any) => any,
        /** Action to do when the tween pauses */
        pause?: (tween: Tween, ...data: any) => any,
        /** Action to do when the tween resume */
        resume?: (tween: Tween, ...data: any) => any,
        /** Action to do when the tween stop */
        stop?: (tween: Tween, value: any, ...data: any) => any,
        /** Action to do when the tween finish the animation normally */
        complete?: (tween: Tween, value: any, ...data: any) => any,
    },
}

export class Tween {
    protected _tween: TWEEN.Tween<any>;
    protected _from: any;
    
    protected _resolve: (...data: any) => any;
    protected _reject: (...data: any) => any;

    protected _onStart: (tween: Tween, value: any, ...data: any) => any;
    protected _onUpdate: (tween: Tween, value: any, elapsed: any, ...data: any) => any;
    protected _onPause: (tween: Tween, ...data: any) => any;
    protected _onResume: (tween: Tween, ...data: any) => any;
    protected _onRepeat: (tween: Tween, value:any, ...data: any) => any;
    protected _onStop: (tween: Tween, value: any, ...data: any) => any;
    protected _onComplete: (tween: Tween, value: any, ...data: any) => any;

    constructor(config: TweenConfig) { 
        this._initialize(config);
    }

    public static update(delta: number) { TWEEN.update(); }

    static create(config: TweenConfig) { return new Tween(config); }

    public time(value: number): Tween {
        if(this._tween) this._tween.duration(value);
        return this;
    }

    public to(value: any): Tween {
        if(this._tween) this._tween.to(value);
        return this;
    }

    public from(value: any): Tween {
        for (const prop of Object.getOwnPropertyNames(this._from)) delete this._from[prop];
        for (const prop of Object.getOwnPropertyNames(value)) this._from[prop] = value[prop];

        // @ts-ignore
        this._tween._valuesStart = value;

        return this;
    }

    public easing(value: (time: number) => number): Tween {
        if(this._tween) this._tween.easing(value);
        return this;
    }

    protected _initialize(config: TweenConfig) {
        this._from = config.from ?? {};
        this._tween = new TWEEN.Tween<any>(this._from);

        this._tween.to(config.to, config.time)
            .yoyo(config.yoyo)
            .repeat((config.yoyo && !config.repeat)? 1 : config.repeat);

        if(config.easing) this._tween.easing(config.easing);

        this._onStart = config.actions?.start;
        this._onUpdate = config.actions?.update;
        this._onRepeat = config.actions?.repeat;
        this._onPause = config.actions?.pause;
        this._onResume = config.actions?.resume;
        this._onStop = config.actions?.stop;
        this._onComplete = config.actions?.complete;
    }

    public async start(...data: any): Promise<any> {
        this.stop(...data);

        let promise = new Promise((resolve, reject) => { 
            this._resolve = resolve;
            this._reject = reject;
        });

        this._tween.onStart((from) => {
            if(this._onStart) this._onStart(this, from, ...data);
        });

        this._tween.onUpdate((from, elapsed) => {
            if(this._onUpdate) this._onUpdate(this, from, elapsed, ...data);
        });

        this._tween.onRepeat((from) => {
            if(this._onRepeat) this._onRepeat(this, from, ...data);
        });

        this._tween.onComplete((from) => {
            this._resolve();
            if(this._onComplete) this._onComplete(this, from, ...data);
        });

        this._tween.start();

        return promise;
    }

    public stop(...data: any): void {
        if(!this._tween.isPlaying()) return;

        this._tween.onStop((from) => {
            this._resolve();
            if(this._onStop) this._onStop(this, from, ...data);
        });

        this._tween.stop();
    }

    public pause(...data: any): void {
        if(!this._tween.isPlaying()) return;

        if(this._onPause) this._onPause(this, ...data);

        this._tween.pause();
    }

    public resume(...data: any) {
        if(this._tween.isPlaying()) return;
        
        if(this._onResume) this._onResume(this, ...data);

        this._tween.resume();
    }

    public setOnUpdate(value: (value: any, elapsed: any, ...data: any) => any): Tween {
        this._onUpdate = value;
        return this;
    }

    public getOnUpdate(): (value: any, elapsed: any, ...data: any) => any {
        return this._onUpdate;
    }
}