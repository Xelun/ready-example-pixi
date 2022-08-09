export class Utils {
    /** Load a file */
    public static loadFile (src: string, isJson: boolean = true) {
        return new Promise((resolve, reject) => {
            fetch(src)
                .then((value: Response) => { 
                    if(!value.ok) reject();
                    else return isJson? value.json() : value.text(); 
                },
                (error) => reject(error))
                .then((value) => resolve(value));
        });
    }

    /** Merge 2 objects and return a new merged object */
    public static merge(base: any, merge: any, arrayMerge: boolean = false): any {
        if(!merge) return {...base};
        if(!base) return {...merge};
        
        base = {...base};
        merge = {...merge};

        let baseKeys = Object.keys(base);
        let mergeKeys = Object.keys(merge);

        // Add no repited keys to the baseKeys array from mergeKeys
        mergeKeys.forEach(key => { if (baseKeys.indexOf(key) === -1) baseKeys.push(key); });

        let kCount = baseKeys.length;
        while (kCount--) {
            let key = baseKeys[kCount];
            const mergeValue = merge[key];

            if (typeof base[key] === "undefined") {
                base[key] = mergeValue;
            } else if (typeof mergeValue !== "undefined") {
                if (Array.isArray(mergeValue)) {
                    if(!arrayMerge) base[key] = [];
                    base[key].push(...mergeValue);
                } else if (typeof mergeValue === "object") {
                    base[key] = Utils.merge(base[key], mergeValue, arrayMerge);
                } else {
                    base[key] = mergeValue;
                }
            }
        }

        return base;
    }

    /**
     * Do an http call
     * @param url Url to call
     * @param options Options of the http call
     * @param retryAttempts Maximum number of attempts before return an error if the url is not reachable
     */
    public static httpCall(url: string, options: RequestInit, json: boolean = true) {
        options.headers = new Headers(options.headers);
        
        return new Promise<any>((resolve, reject) => {
            fetch(url, options)
                .then((response) => {
                    if(!response) reject();
    
                    if(json) {
                        response.json().then((result) => {
                            if(response.ok) resolve(result)
                            else reject(result);
                        });
                    } else {
                        response.text().then((result) => {
                            if(response.ok) resolve(result)
                            else reject(result);
                        });
                    }
                }, (error) => reject(error))
        });
    }
}