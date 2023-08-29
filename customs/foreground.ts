/**
 * Enqueue a callback with setTimeout and requestAnimationFrame
 * 
 * @param callback 
 * @param signal 
 * @param ms 
 * @returns 
 */
export function foreground(callback: Function, signal?: AbortSignal, ms?: number, ...args: any[]) {
    function task() {
        if (signal?.aborted) return
        callback(Date.now(), ...args)
    }
    return setTimeout(() => requestAnimationFrame(() => task()), ms)
}
