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
}