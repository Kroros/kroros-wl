export interface Exercise {
  name: string,
  id: number,
  unilateral: boolean
}

export interface Workout {
  id: number,
  name: string,
  exercises: Exercise[]
}

export interface ExerciseSet {
  exerciseId: number,
  reps: number,
  weight: number,
  rir: number,
  side?: 'L' | 'R',
}

export interface Session {
  id: number,
  date: string,
  workout: Workout,
  sets: ExerciseSet[],
}
