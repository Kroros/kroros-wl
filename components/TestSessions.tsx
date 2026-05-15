import type { Session } from "./types";

export const nullSesh: Session = {
  id: 0,
  date: '1970-01-01T00:00:01.000Z',
  workout: {
    id: 0,
    name: "null",
    exercises: [],
  },
  sets: [],
}

export const testSessions: Session[] = [
  {
    id: 1747123200005,
    date: "2026-05-14T09:30:00.000Z",
    workout: {
      id: 1,
      name: "Push Day",
      exercises: [
        { id: 1, name: "Bench Press", unilateral: false },
        { id: 2, name: "Dumbbell Shoulder Press", unilateral: false },
        { id: 3, name: "Cable Lateral Raise", unilateral: true },
      ]
    },
    sets: [
      { exerciseId: 1, reps: 7, weight: 70, rir: 1, setNote: "New PR :)" },
      { exerciseId: 1, reps: 6, weight: 70, rir: 0 },
      { exerciseId: 2, reps: 9, weight: 22, rir: 1 },
      { exerciseId: 2, reps: 8, weight: 22, rir: 0 },
      { exerciseId: 3, reps: 11, weight: 10, rir: 1, side: 'L' },
      { exerciseId: 3, reps: 11, weight: 10, rir: 1, side: 'R' },
    ]
  },
  //{
  //  id: 1747036800002,
  //  date: "2026-05-11T17:00:00.000Z",
  //  workout: {
  //    id: 2,
  //    name: "Pull Day",
  //    exercises: [
  //      { id: 4, name: "Deadlift", unilateral: false },
  //      { id: 5, name: "Pull Up", unilateral: false },
  //      { id: 6, name: "Single Arm Row", unilateral: true },
  //    ]
  //  },
  //  sets: [
  //    { exerciseId: 4, reps: 5, weight: 120, rir: 3 },
  //    { exerciseId: 4, reps: 5, weight: 120, rir: 2 },
  //    { exerciseId: 5, reps: 8, weight: 0, rir: 2 },
  //    { exerciseId: 5, reps: 7, weight: 0, rir: 1 },
  //    { exerciseId: 6, reps: 10, weight: 32, rir: 2, side: 'L' },
  //    { exerciseId: 6, reps: 10, weight: 32, rir: 1, side: 'R' },
  //  ]
  //}
];
