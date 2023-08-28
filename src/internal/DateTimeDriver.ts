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
    private state!: DateTimeDriverState

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
        // Initialize the driver
        this.initialize()

        // Setup the clock cycle
        if (this.options.mode === "foreground") {
            this.runForeground()
        } else {
            this.runBackground()
        }
    }

    /**
     * Initialize the driver
     * 
     * @internal
     */
    private initialize() {
        const current = new Date()
        this.state = { current, previous: current }
    }

    /**
     * Run the clock cycle in the foreground
     * 
     * @internal
     */
    private runForeground() {
        requestSignalAnimationInterval(() => {
            this.runHandler()
        }, this.core.controller.signal, this.interval)
    }

    /**
     * Run the clock cycle in the background
     * 
     * @internal
     */
    private runBackground() {
        setSignalCounterInterval(() => {
            this.runHandler()
        }, this.core.controller.signal, this.interval)
    }

    /**
     * Run the clock cycle handler
     * 
     * @internal
     */
    private runHandler() {
        // Dispatch beforeupdate event
        this.core.dispatchEvent("beforeupdate", this.state)

        this.state.previous = this.state.current
        this.state.current = new Date()

        // Dispatch update event
        this.core.dispatchEvent("update", this.state)

        // Dispatch date/time events
        this.dispatchDateTimeEvents(this.state)
    }

    /**
     * Dispatch the date/time events
     * 
     * @internal
     */
    private dispatchDateTimeEvents(state: DateTimeDriverState) {
        const { current, previous } = state

        if (current.getSeconds() !== previous.getSeconds()) {
            this.core.dispatchEvent("second", { current, previous })
        }

        if (current.getMinutes() !== previous.getMinutes()) {
            this.core.dispatchEvent("minute", { current, previous })
        }

        if (current.getHours() !== previous.getHours()) {
            this.core.dispatchEvent("hour", { current, previous })
        }

        if (current.getDate() !== previous.getDate()) {
            this.core.dispatchEvent("day", { current, previous })
        }

        if (current.getMonth() !== previous.getMonth()) {
            this.core.dispatchEvent("month", { current, previous })
        }

        if (current.getFullYear() !== previous.getFullYear()) {
            this.core.dispatchEvent("year", { current, previous })
        }
    }
}
