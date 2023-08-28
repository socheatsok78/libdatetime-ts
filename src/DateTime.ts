import { DataTimeCore } from "./internal/DataTimeCore";
import { DateTimeDriver, DateTimeDriverOptions } from "./internal/DateTimeDriver";

export interface DateTimeOptions {
    options?: DateTimeDriverOptions
}

export class DateTime extends DataTimeCore {
    private driver: DateTimeDriver

    constructor(options?: DateTimeOptions) {
        super()
        this.driver = new DateTimeDriver(this, options?.options)
    }

    /**
     * Activate the driver
     * 
     * @override
     */
    activate() {
        // Activate the core controller
        super.activate()

        // Activate the driver
        this.driver.activate()

        return this
    }

    /**
     * Deactivate the driver
     * 
     * @override
     */
    deactivate() {
        // Deactivate the core controller
        super.deactivate()

        return this
    }
}
