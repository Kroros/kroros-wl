import { Stack } from 'expo-router';

export default function WorkoutsStack() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} /> 
      <Stack.Screen name="selectWorkout" options={{ title: "Select Workout" }} /> 
    </Stack>
  )
}
