import { DefaultClockCycle } from './DefaultClockCycle'
import type { DateTimeDriverClockCycle, DateTimeInterface } from './types'

export interface DateTimeDriverOptions {
    /**
     * The clock cycle function
     * 
     * @default DefaultClockCycle
     */
    clockcycle?: DateTimeDriverClockCycle

    /**
     * The interval in milliseconds to run the clock cycle
     * 
     * @default 1000
     */
    interval?: number
}

interface DateTimeDriverState {
    current: Date
    previous: Date
}


export class DateTimeDriver {
    private state!: DateTimeDriverState

    private interval: number
    private clockcycle: DateTimeDriverClockCycle

    constructor(
        private core: DateTimeInterface,
        options: DateTimeDriverOptions = {}
    ) {
        this.interval = options.interval ?? 1000
        this.clockcycle = options.clockcycle ?? DefaultClockCycle
    }

    /**
     * Activate the driver
     */
    activate() {
        // Initialize the driver
        this.initialize()

        // Run the driver's clock cycle
        this.run()
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
     * @internal
     */
    private run() {
        this.clockcycle(() => this.runHandler(), this.core.controller.signal, this.interval)
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
