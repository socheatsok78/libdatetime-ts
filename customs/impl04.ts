import { foreground } from "./foreground"

interface RequestClockCycleCallbackOptions {
    multiplier: number
    trigger: "early" | "late"
    debug: boolean
}

const DefaultRequestClockCycleCallbackOptions: RequestClockCycleCallbackOptions = {
    multiplier: 1.05,
    trigger: "early",
    debug: false
}

/**
 * A fix for `impl03` to avoid the initial delay waiting too long.
 */
export function impl04(callback: Function, signal?: AbortSignal, ms: number = 1000, options?: Partial<RequestClockCycleCallbackOptions>) {
    const _options: RequestClockCycleCallbackOptions = Object.assign({}, DefaultRequestClockCycleCallbackOptions, options)

    const initialDate = Date.now()
    const initialUpcoming = initialDate + ms

    function task(now: number, upcoming: number) {
        if (_options.trigger === "late") {
            callback(upcoming)
        }
        queue(now, upcoming)
    }

    function queue(now: number, upcoming: number) {
        const delta1 = Date.now() - now
        const delta2 = now - upcoming
        const delta = delta1 + delta2
        const driff = ms - delta
        let delay = Math.max(0, driff)

        // Keep the delay within the bounds of the clock cycle
        if (delay > (ms * _options.multiplier)) {
            delay = ms
        }

        if (delta > ms) {
            if (_options.debug) {
                console.warn(...[
                    `The delta is greater than the interval, (delta=${delta} > ms=${ms}).`,
                    `Maybe the browser (tab) was inactive?`,
                    `Attempting to catch up by reducing the delay to ${ms}.`
                ])
            }
            delay = 0
        }

        upcoming = now + ms

        if (_options.trigger === "early") {
            callback(upcoming)
        }

        foreground(task, signal, delay, upcoming)

        // Print debug information
        if (_options.debug) {
            console.table({ delta1, delta2, delta, driff, delay, now, upcoming })
        }
    }

    foreground(queue, signal, ms, initialUpcoming)
}
