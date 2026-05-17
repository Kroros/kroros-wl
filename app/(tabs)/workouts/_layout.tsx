import { Stack } from 'expo-router';
import Colours from '@/components/Colours';

export default function WorkoutsStack() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colours.selection_background,
        },
        headerTintColor: Colours.foreground,
        headerTitleStyle: {
          fontFamily: 'NerdFont-Bold'
        }
      }}>
      <Stack.Screen name="index" options={{ headerShown: false }} /> 
      <Stack.Screen name="createWorkout" options={{ title: "Create Workout" }} />
      <Stack.Screen name="createExercise" options={{ title: "Create Exercise" }} />
    </Stack>
  )
}
