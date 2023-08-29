import { foreground } from "./foreground"

/**
 * Clock move slightly ahead by one cycle each time and will sync with system clock over time.
 */
export function impl03(callback: Function, signal?: AbortSignal, ms: number = 1000) {
    const initialDate = Date.now()
    const initialUpcoming = initialDate + ms

    function task(now: number, upcoming: number) {
        callback(now)
        queue(now, upcoming)
    }

    function queue(now: number, upcoming: number) {
        const delta = now - initialUpcoming
        const driff = Math.max(0, ms - delta)
        let delay = Math.floor(driff)

        if (delta > ms) {
            // something really bad happened. Maybe the browser (tab) was inactive?
            // possibly special handling to avoid futile "catch up" run
            console.log([
                `// something really bad happened. Maybe the browser (tab) was inactive?`,
                `// possibly special handling to avoid futile "catch up" run`
            ])
            delay = 0
        }

        upcoming = now + ms
        foreground(task, signal, delay, upcoming)
    }

    foreground(task, signal, ms, initialUpcoming)
}
