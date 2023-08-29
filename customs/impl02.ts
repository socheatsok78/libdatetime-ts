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
    let expected = initialDate + ms

    function task(now: number) {
        callback(now)
        queue(now)
    }

    function queue(now: number) {
        const delta = Math.abs(now - expected)
        const driff = Math.max(0, ms - delta)
        let delay = Math.floor(driff)

        console.log({ delta, driff, delay }, { now, expected })

        // Keep the delay within the bounds of the clock cycle
        if (delay > (ms * options.multiplier)) {
            delay = ms
        }

        if (delta > ms) {
            // something really bad happened. Maybe the browser (tab) was inactive?
            // possibly special handling to avoid futile "catch up" run
        }

        expected = now + ms
        foreground(task, signal, delay)
    }

    callback(initialDate)
    foreground(task, signal, ms)
}
