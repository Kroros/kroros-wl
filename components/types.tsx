export interface Exercise {
  name: string,
  id: number,
  unilateral: boolean
}

export interface Workout {
  name: string,
  exercises: Exercise[]
}
