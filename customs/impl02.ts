import { foreground } from "./foreground"

interface RequestClockCycleCallbackOptions {
    multiplier: number
}

const DefaultRequestClockCycleCallbackOptions: RequestClockCycleCallbackOptions = {
    multiplier: 1.2
}

/**
 * This will attempt to keep up with system clock by reduce the delay between each run.  
 * Once the clock is synced, it will run at the consistent rate.
 */
export function impl02(callback: Function, signal?: AbortSignal, ms: number = 1000, options = DefaultRequestClockCycleCallbackOptions) {
    const initialDate = Date.now()
    const initialUpcoming = initialDate + ms

    function task(now: number, upcoming: number) {
        callback(now)
        queue(now, upcoming)
    }

    function queue(now: number, upcoming: number) {
        const delta = Math.abs(now - upcoming)
        const driff = Math.max(0, ms - delta)
        let delay = Math.floor(driff)

        console.log({ delta, driff, delay }, { now, upcoming })

        // Keep the delay within the bounds of the clock cycle
        if (delay > (ms * options.multiplier)) {
            delay = ms
        }

        if (delta > ms) {
            // something really bad happened. Maybe the browser (tab) was inactive?
            // possibly special handling to avoid futile "catch up" run
            delay = 0
        }

        // Choose the one you prefer"
        // expected = now + ms
        // expected = now + delay
        upcoming = now + ms
        foreground(task, signal, delay, upcoming)
    }

    foreground(task, signal, ms, initialUpcoming)
}
