import { requestSignalAnimationInterval } from "signaltimer";

export function DefaultClockCycle(handler: (time: number) => void, signal?: AbortSignal, ms?: number) {
    return requestSignalAnimationInterval(handler, signal, ms)
}
