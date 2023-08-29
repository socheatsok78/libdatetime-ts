/**
 * Enqueue a callback with setTimeout and requestAnimationFrame
 * 
 * @param callback 
 * @param signal 
 * @param ms 
 * @returns 
 */
export function foreground(callback: Function, signal?: AbortSignal, ms?: number) {
    return setTimeout(() => requestAnimationFrame(() => {
        if (signal?.aborted) return
        callback(Date.now())
    }), ms)
}
