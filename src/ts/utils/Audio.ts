import { Howl, Howler } from 'howler';

export class Audio {
    protected static _audio: Map<string, Howl> = new Map();
    protected static _multiAudio: Map<string, string> = new Map();
    protected static _volume: Map<string, number> = new Map();
    protected static _group: Map<string, string[]> = new Map();
    protected static _playing: Map<string, number> = new Map();

    public static async load(soundName: string, src: string[], sprite?: any): Promise<void> {
        return new Promise((resolve, reject) => {
            let sound = new Howl({
                src,
                sprite,
                onload: () => resolve(),
                onloaderror: (e) => reject(e),
            });

            this._audio.set(soundName, sound);

            if(sprite) {
                Object.keys(sprite).forEach(key => this._multiAudio.set(key, soundName));
            }
        });
    }

    public static play(soundName: string, loop?: boolean, fadeTime?: number, toVolume?: number) {
        let sound: Howl = this._audio.get(this.getSoundName(soundName));
        
        if(sound.playing()) sound.stop(); // Only allow the same sound once. Todo: Improve so you can use the pool. Check if it's paused
        
        let soundId = sound?.play(this._multiAudio.has(soundName)? soundName : undefined);
        this._playing.set(soundName, soundId);
        
        let id = this.getId(soundName);

        if(loop !== undefined) sound?.loop(loop, id);
        if(fadeTime) sound?.fade(0, toVolume ?? 1, fadeTime, id);
    }

    public static pause(soundName: string) {
        let sound = this._audio.get(this.getSoundName(soundName));
        let id = this.getId(soundName);

        sound?.pause(id);
    }

    public static resume(soundName: string) {
        let sound = this._audio.get(this.getSoundName(soundName));
        let id = this.getId(soundName);

        if(sound.playing()) return; // Only allow the same sound once. Todo: Improve so you can use the pool

        sound?.play(id);
    }

    public static stop(soundName?: string) {
        if(!soundName) {
            Howler.stop();
            return;
        }

        let sound = this._audio.get(this.getSoundName(soundName));
        let id = this.getId(soundName);
        
        sound?.stop(id);

        this._playing.delete(soundName);
    }

    public static mute(soundName?: string, stop?: boolean) {
        if(!soundName) {
            Howler.mute(true);
            if(stop) Howler.stop();
            return;
        }

        let sound = this._audio.get(this.getSoundName(soundName));
        let id = this.getId(soundName);

        sound?.mute(true, id);
        if(stop) this.stop(soundName);
    }

    public static unmute(soundName?: string) {
        if(!soundName) {
            Howler.mute(false);
            return;
        }

        let sound = this._audio.get(this.getSoundName(soundName));
        let id = this.getId(soundName);

        sound?.mute(false, id);

    }

    public static changeVolume(volume?: number, soundName?: string, time?: number) {
        if(!soundName) {
            Howler.volume(volume);
            return;
        }

        let sound = this._audio.get(this.getSoundName(soundName));
        let id = this.getId(soundName);

        if(time) sound?.fade((<number>sound.volume(id)), volume, time, id);
        else sound?.volume(volume, id);
    }

    public static changeSpeed(speed?: number, soundName?: string) {
        let sound = this._audio.get(this.getSoundName(soundName));
        let id = this.getId(soundName);

        sound?.rate(speed, id);
    }

    protected static getSoundName(soundName: string): string {
        return this._multiAudio.get(soundName) ?? soundName;
    }

    protected static getId(soundName: string): number {
        return this._playing.get(soundName);
    }
}