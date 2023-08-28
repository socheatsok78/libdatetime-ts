import { requestSignalAnimationInterval, setSignalCounterInterval} from 'signaltimer'
import type { DateTimeInterface } from './types'

/**
 * The mode to run the clock cycle in
 *
 * - `"foreground"`: The clock cycle will run in the foreground, and will
 *  be paused when the tab is not visible. Using `rAf+setTimeout` loop combination.
 * - `"background"`: The clock cycle will run in the background, and will
 * continue to run when the tab is not visible. Using `setTimeout` loop.
 * 
 * **Timeouts in inactive tabs**  
 * To reduce the load (and associated battery usage) from background tabs, browsers will enforce a minimum timeout delay in inactive tabs.
 */
type ClockCycleMode = 
    | "foreground"
    | "background"

export interface DateTimeDriverOptions {
    /**
     * The mode to run the clock cycle in
     *
     * - `"foreground"`: The clock cycle will run in the foreground, and will
     *  be paused when the tab is not visible. Using `rAf+setTimeout` loop combination.
     * - `"background"`: The clock cycle will run in the background, and will
     * continue to run when the tab is not visible. Using `setTimeout` loop.
     * 
     * **Timeouts in inactive tabs**  
     * To reduce the load (and associated battery usage) from background tabs, browsers will enforce a minimum timeout delay in inactive tabs.
     * 
     * **MDN References**  
     * [Timeouts in inactive tabs](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout#timeouts_in_inactive_tabs)
     * | [Throttling of tracking scripts](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout#throttling_of_tracking_scripts)
     * | [Late timeouts](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout#late_timeouts)
     *  
     * @default "background"
     */
    mode?: ClockCycleMode
}

interface DateTimeDriverState {
    current: Date
    previous: Date
}

export class DateTimeDriver {
    private readonly interval: number = 1000
    private state: DateTimeDriverState = createInitialState()

    constructor(
        private core: DateTimeInterface,
        private options: DateTimeDriverOptions = {}
    ) {
        options.mode = options.mode ?? "background"
    }

    /**
     * Activate the driver
     */
    activate() {
        if (this.options.mode === "foreground") {
            this.runForeground()
        } else {
            this.runBackground()
        }
    }

    /**
     * Run the clock cycle in the foreground
     */
    private runForeground() {
        requestSignalAnimationInterval(() => {
            this.runHandler()
        }, this.core.controller.signal, this.interval)
    }

    /**
     * Run the clock cycle in the background
     */
    private runBackground() {
        setSignalCounterInterval(() => {
            this.runHandler()
        }, this.core.controller.signal, this.interval)
    }

    /**
     * Run the clock cycle handler
     */
    private runHandler() {
        // Dispatch beforeupdate event
        this.core.dispatchEvent("beforeupdate", this.state)

        this.state.previous = this.state.current
        this.state.current = new Date()

        // Dispatch update event
        this.core.dispatchEvent("update", this.state)

        // Dispatch date/time events
        this.dispatchDateTimeEvents()
    }

    /**
     * Dispatch the date/time events
     */
    private dispatchDateTimeEvents() {
        const { current, previous } = this.state

        if (current.getSeconds() !== previous.getSeconds()) {
            this.core.dispatchEvent("second", this.state)
        }

        if (current.getMinutes() !== previous.getMinutes()) {
            this.core.dispatchEvent("minute", this.state)
        }

        if (current.getHours() !== previous.getHours()) {
            this.core.dispatchEvent("hour", this.state)
        }

        if (current.getDate() !== previous.getDate()) {
            this.core.dispatchEvent("day", this.state)
        }

        if (current.getMonth() !== previous.getMonth()) {
            this.core.dispatchEvent("month", this.state)
        }

        if (current.getFullYear() !== previous.getFullYear()) {
            this.core.dispatchEvent("year", this.state)
        }
    }
}

function createInitialState(): DateTimeDriverState {
    const current = new Date()
    return { current: current, previous: current }
}
