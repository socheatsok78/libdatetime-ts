import { foreground } from "./foreground"

/**
 * Clock move slightly ahead by one cycle each time and will sync with system clock over time.
 */
export function impl03(callback: Function, signal?: AbortSignal, ms: number = 1000) {
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
