import { requestSignalAnimationInterval } from "signaltimer";

/**
 * The default clock cycle function
 * 
 * - Accurate over time
 * - Updates visually steadily
 * - Avoids running in background
 * - Otherwise good CPU usage
 * 
 * @param handler 
 * @param signal 
 * @param ms 
 * @returns 
 */
export function DefaultClockCycle(handler: (time: number) => void, signal?: AbortSignal, ms?: number) {
    return requestSignalAnimationInterval(handler, signal, ms)
}
