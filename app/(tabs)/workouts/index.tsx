import React from 'react';
import {
  Text,
  Pressable,
} from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import PageTheme from '@/styles/PageTheme';
import { setWorkoutCallback } from '@/extensions/exerciseCallback';
import { useState } from 'react';
import type { Workout } from '@/components/types';

export default function Workouts() {
  const [workouts, setWorkouts ] = useState<Workout[]>();


  return (
    <SafeAreaView 
      style={PageTheme.pageContainer}
    >
      <Link href="/workouts/createWorkout" asChild style={{ marginTop: "5%" }}>
        <Pressable style={PageTheme.mainButton}
          onPress={ () => {
            setWorkoutCallback((workout) => {
              setWorkouts(prev => [...prev, workout]);
            });
          }}
        >
          <Text style={PageTheme.mainButtonText}> Create Workout </Text>
        </Pressable>
      </Link>
    </SafeAreaView>
  );
}
