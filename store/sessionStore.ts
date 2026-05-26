import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ExerciseSet, Workout, Session } from '@/components/types';

interface SessionStore {
	activeWorkout: Workout | null;
	sets: Record<number, ExerciseSet[]>;
	exNotes: Record<number, string>;
	currentIndex: number,
	setActiveWorkout: (workout: Workout) => void;
	setSets:(sets: Record<number, ExerciseSet[]> | ((prev: Record<number, ExerciseSet[]>) => Record<number, ExerciseSet[]>)) => void; 
	setExNotes: (notes: Record<number, string> | ((prev: Record<number, string>) => Record<number, string>)) => void; 
	setCurrentIndex: (index: number | ((prev: number) => number)) => void; 
	clearSession: () => void;
}

export const useSessionStore = create<SessionStore>()(
		(set) => ({
			activeWorkout: null,
			sets: {},
			exNotes: {},
			currentIndex: 0,
			setActiveWorkout: (workout) => set({ activeWorkout: workout }),
			setSets:(sets: Record<number, ExerciseSet[]> | ((prev: Record<number, ExerciseSet[]>) => Record<number, ExerciseSet[]>)) => set(state => ({ sets: typeof sets === 'function' ? sets(state.sets) : sets })), 
			setExNotes:(notes: Record<number, string> | ((prev: Record<number, string>) => Record<number, string>)) => set(state => ({ exNotes: typeof notes === 'function' ? notes(state.exNotes) : notes })), 
			setCurrentIndex:(index: number | ((prev: number) => number)) => set(state => ({ currentIndex: typeof index === 'function' ? index(state.currentIndex) : index })), 
			clearSession: () => set({ activeWorkout: null, sets: {}, exNotes: {}, currentIndex: 0}),
		})
);
