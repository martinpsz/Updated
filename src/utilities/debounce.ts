export const debounce = (func:Function, wait = 500) => {
    let timeout: ReturnType<typeof setTimeout>;

    return (...args: [Number | String]) => {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args)
        }, wait)
    }
}



