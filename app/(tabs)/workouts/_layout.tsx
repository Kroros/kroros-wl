import { Stack } from 'expo-router';

export default function WorkoutsStack() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} /> 
      <Stack.Screen name="createWorkout" options={{ title: "Create Workout" }} />
      <Stack.Screen name="createExercise" options={{ title: "Create Exercise" }} />
    </Stack>
  )
}
