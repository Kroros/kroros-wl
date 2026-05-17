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
          fontWeight: 'bold',
        }
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} /> 
      <Stack.Screen name="selectWorkout" options={{ title: "Select Workout" }} /> 
    </Stack>
  )
}
