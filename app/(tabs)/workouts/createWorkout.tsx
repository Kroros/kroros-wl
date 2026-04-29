import PageTheme from '@/styles/PageTheme';
import { Link, router } from 'expo-router';
import {
  View,
  Text,
  Button,
  Pressable,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import type { Exercise } from '@/components/types';
import { useState, useEffect } from "react";
import { setCallback } from '@/extensions/exerciseCallback';

export default function CreateWorkout() {
  const [ exercises, setExercises ] = useState<Exercise[]>([]);

  useEffect(() => {
    console.log(exercises)
  }, [exercises]);

  return (
    <SafeAreaView style={PageTheme.pageContainer}>
          <Pressable style={PageTheme.mainButton} onPress={() => {
            setCallback((exercise) => {
              setExercises(prev => [...prev, exercise]);
            });
            router.push('/workouts/createExercise');
          }}>
          <Text style={PageTheme.mainButtonText}> Add Exercise </Text>
          </Pressable>
    </SafeAreaView>
  )
}
