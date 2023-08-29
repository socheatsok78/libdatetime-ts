export type DateTimeEventType = 
    | "beforeupdate"
    | "update"
    | "second"
    | "minute"
    | "hour"
    | "day"
    | "month"
    | "year"

export type DateTimeEventDetail = {
    readonly current: Date
    readonly previous: Date
}

export interface DateTimeEvent {
    type: DateTimeEventType
    detail: DateTimeEventDetail
}

export type DateTimeEventMap = Record<DateTimeEventType, DateTimeEvent>

export interface DateTimeInterface {
    controller: AbortController

    /**
     * Add an event listener
     * @param type 
     * @param callback 
     */
    addEventListener(type: DateTimeEventType, callback: (detail: DateTimeEvent) => void): void

    /**
     * Remove an event listener
     * @param type 
     * @param callback 
     */
    removeEventListener(type: DateTimeEventType, callback: (detail: DateTimeEvent) => void): void

    /**
     * Dispatch an event
     * @param event
     * @param detail
     * @internal
     */
    dispatchEvent(event: DateTimeEventType, detail: DateTimeEventDetail): void
}

export type DateTimeDriverClockCycleHandler = (...args: any[]) => void
export type DateTimeDriverClockCycle = (handler: DateTimeDriverClockCycleHandler, signal?: AbortSignal | undefined, ms?: number | undefined) => any
