import PageTheme from '@/styles/PageTheme';
import { Link, router } from 'expo-router';
import {
  View,
  ScrollView,
  Text,
  Button,
  Pressable,
  TextInput,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import type { Exercise } from '@/components/types';
import { useState, useEffect } from "react";
import { setCallback } from '@/extensions/exerciseCallback';

export default function CreateWorkout() {
  const [ exercises, setExercises ] = useState<Exercise[]>([]);
  const [ exerciseList, setExerciseList ] = useState([<View key={0}/>]);

  useEffect(() => {
    setExerciseList(exercises.map( e => <View style={PageTheme.container} key={e.id}>
                                  <Text style={PageTheme.listText}>{ e.name }</Text>
                                  </View>));
      }, [exercises]);

  return (
    <SafeAreaView style={PageTheme.pageContainer}>
      <ScrollView>
        <View style={PageTheme.container}> 
          <Text style={PageTheme.bodyText}> Workout Name </Text>
          <TextInput 
            style={PageTheme.textInput}
          />
        </View>
        {exerciseList}
        <Pressable style={PageTheme.mainButton} onPress={() => {
          setCallback((exercise) => {
            setExercises(prev => [...prev, exercise]);
          });
          router.push('/workouts/createExercise');
        }}>
          <Text style={PageTheme.mainButtonText}> Add Exercise </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  )
}
