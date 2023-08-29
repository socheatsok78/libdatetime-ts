import { foreground } from "./foreground"

/**
 * Sync with system clock (almost)
 */
export function impl01(callback: Function, signal?: AbortSignal, ms: number = 1000) {
    const initialDate = Date.now()
    const initialUpcoming = initialDate + ms

    function queue(now: number, upcoming: number) {
        callback(now)

        const delta = now - upcoming
        const driff = Math.max(0, ms - delta)
        let delay = Math.floor(driff)

        console.log({ delta, driff, delay }, { now, upcoming })

        // Keep the delay within the bounds of the clock cycle
        if (delay > ms) {
            delay = delay - ms
        }

        if (delta > ms) {
            // something really bad happened. Maybe the browser (tab) was inactive?
            // possibly special handling to avoid futile "catch up" run
            delay = 0
        }

        upcoming = now + delay
        foreground(queue, signal, delay, upcoming)
    }

    foreground(queue, signal, ms, initialUpcoming)
}
