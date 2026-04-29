import type { Exercise, Workout } from "@/components/types";

let callback: ((exercise: Exercise) => void) | null = null;

export const setCallback = (fn: typeof callback) => (callback = fn);
export const getCallback = () => callback;

let workoutCallback: ((workout: Workout) => void) | null = null;

export const setWorkoutCallback = (fn: typeof callback) => (callback = fn);
export const getWorkoutCallback = () => workoutCallback;
