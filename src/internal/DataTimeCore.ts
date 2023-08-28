import mitt from "mitt";
import type { DateTimeInterface, DateTimeEventMap, DateTimeEvent, DateTimeEventType, DateTimeEventDetail } from "./types";

export class DataTimeCore implements DateTimeInterface {
    /**
     * @internal
     */
    public controller = new AbortController()

    /**
     * @internal
     */
    private mitt = mitt<DateTimeEventMap>()

    /**
     * Activate the core controller
     */
    activate() {
        if (this.controller.signal.aborted) {
            this.controller = new AbortController()
        }

        return this
    }

    /**
     * Deactivate the core controller
     */
    deactivate() {
        this.controller.abort()

        return this
    }

    /**
     * Add an event listener
     * @param event 
     * @param callback 
     */
    addEventListener(type: DateTimeEventType, callback: (event: DateTimeEvent) => void) {
        this.mitt.on(type, callback)
    }

    /**
     * Remove an event listener
     * @param type 
     * @param callback 
     */
    removeEventListener(type: DateTimeEventType, callback: (event: DateTimeEvent) => void) {
        this.mitt.off(type, callback)
    }

    /**
     * Dispatch an event
     * @param type
     * @param detail
     * @internal
     */
    dispatchEvent(type: DateTimeEventType, detail: DateTimeEventDetail) {
        this.mitt.emit(type, { type, detail })
    }
}
