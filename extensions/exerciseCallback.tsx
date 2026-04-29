import type { Exercise } from "@/components/types";

let callback: ((exercise: Exercise) => void) | null = null;

export const setCallback = (fn: typeof callback) => (callback = fn);
export const getCallback = () => callback;
