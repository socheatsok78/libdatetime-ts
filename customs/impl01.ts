import { foreground } from "./foreground"

/**
 * Sync with system clock (almost)
 */
export function impl01(callback: Function, signal?: AbortSignal, ms: number = 1000) {
    const initialDate = Date.now()
    let expected = initialDate + ms

    function queue(now: number) {
        callback(now)

        const delta = now - expected
        const driff = Math.max(0, ms - delta)
        let delay = Math.floor(driff)

        console.log({ delta, driff, delay }, { now, expected })

        // Keep the delay within the bounds of the clock cycle
        if (delay > ms) {
            delay = delay - ms
        }

        console.log("delay=", delay)

        if (delta > ms) {
            // something really bad happened. Maybe the browser (tab) was inactive?
            // possibly special handling to avoid futile "catch up" run
        }

        expected = now + delay
        foreground(queue, signal, delay)
    }

    foreground(queue, signal, ms)
}
