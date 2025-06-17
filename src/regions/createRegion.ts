type Fn<T> = (value: T) => T;

export const createRegion = <T>(initialValue: T) => {
    let value = initialValue;
    return {
        get: () => value,
        set: (newValue: T | Fn<T>) => {
            if (typeof newValue === 'function') {
                value = (newValue as Fn<T>)(value);
            }
            else {
                value = newValue;
            }
        },
    }
}
