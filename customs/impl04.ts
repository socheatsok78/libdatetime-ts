import { foreground } from "./foreground"

interface RequestClockCycleCallbackOptions {
    multiplier: number
}

const DefaultRequestClockCycleCallbackOptions: RequestClockCycleCallbackOptions = {
    multiplier: 1.2
}

/**
 * A fix for `impl03` to avoid the initial delay waiting too long.
 */
export function impl04(callback: Function, signal?: AbortSignal, ms: number = 1000, options = DefaultRequestClockCycleCallbackOptions) {
    const initialDate = Date.now()
    let expected = initialDate + ms

    function task(now: number, delay: number) {
        queue(now)
        callback(now + delay)
    }

    function queue(now: number) {
        const delta = now - expected
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
            console.log([
                `// something really bad happened. Maybe the browser (tab) was inactive?`,
                `// possibly special handling to avoid futile "catch up" run`
            ])
            delay = 0
        }

        expected = now + delay
        foreground(task, signal, delay, delay)
    }

    foreground(task, signal, ms, ms)
    callback(initialDate)
}
