import { Utils } from "./Utils";
import i18n from 'i18next';

export interface TranslateConfig {
    /** Default ISO language to use if a translation doesn't exist for the current language */
    defaultLanguage?: string,
    /** Paths to download the translations */
    paths: ((language) => string)[],
    /** Current ISO language */
    language?: string,
}

export class Translate {
    protected static _language: string;
    protected static _defaultLanguage: string;
    protected static _translations: Map<string, any>;
    protected static _paths: ((language) => string)[];

    public static async init(config: TranslateConfig) {
        this._defaultLanguage = config.defaultLanguage ?? "en";
        this._paths = config.paths;
        this._translations = new Map();

        let i18nConfig = {
            ns: ["translation"],
            fallbackLng: this._defaultLanguage,
            resources: {},
        };

        await i18n.init(i18nConfig);

        await this.setLanguage(this._defaultLanguage);
        await this.setLanguage(config.language);
    }

    public static async setLanguage(language: string) {
        if(!language) return;

        if(!this._translations.has(language)) {
            await this.downloadTranslation(language);
        }
        
        i18n.addResources(language, "translation", this._translations.get(language));
        await i18n.changeLanguage(language);

        this._language = language;
    }

    public static translate(key: string, options?: any): string {
        return i18n.t(key, options);
    }

    protected static async downloadTranslation(language: string) {
        let promises = [];
        let translations = [];

        this._paths.forEach((path, index) => {
            let url = path(language);
            
            promises.push(new Promise<void>((resolve, reject) => {
                Utils.loadFile(url).then((translation) => {
                        // PLUGIN.log("LOADED DEFAULT FILE ", translation);
                        translations[index] = translation;
                        resolve();
                    },
                    (error) => reject(error));
            }));
        });

        return new Promise<void>((resolve, reject) => Promise.allSettled(promises)
            .then(() => {
                let result;
                translations.forEach((translation) => {
                    result = Utils.merge(result, translation);
                });

                this._translations.set(language, result);

                resolve(result);
            }, () => reject()));
    }

}