export interface Exercise {
  name: string,
  unilateral: boolean
}

export interface Workout {
  name: string,
  exercises: Exercise[]
}
