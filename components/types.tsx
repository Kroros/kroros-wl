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
