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
export function DefaultClockCycle(handler: (...args: any[]) => void, signal?: AbortSignal, ms?: number, ...args: any[]) {
    return requestSignalAnimationInterval(() => handler(Date.now(), ...args), signal, ms)
}
