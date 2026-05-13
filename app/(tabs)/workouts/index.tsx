import React, { useEffect } from 'react';
import {
  Text,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import PageTheme from '@/styles/PageTheme';
import { setWorkoutCallback } from '@/extensions/exerciseCallback';
import { useState, useCallback } from 'react';
import type { Workout } from '@/components/types';
import { Paths, File, Directory } from 'expo-file-system';
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFocusEffect } from 'expo-router';

export default function Workouts() {
  const [workouts, setWorkouts ] = useState<Workout[]>([]);

  const getWorkouts = async () => {
      const directory = new Directory(Paths.document, 'data');
      if (!directory.exists) {
        directory.create();
      }

      const file = new File(Paths.document, 'data', 'workouts.json');
      if (file.exists) {
        const existing = JSON.parse(await file.text());
        setWorkouts(existing);
      }
  };

  useFocusEffect(
    useCallback(() => {
      getWorkouts();
    }, [])
  );

  const renderItem = ({ item, drag, isActive }: RenderItemParams<Workout>) => {
    return (
      <ScaleDecorator>
        <TouchableOpacity
          style={PageTheme.container}
          key={item.id}
        >
          <Text style={PageTheme.listText}>{ item.name }</Text>
          <Text style={PageTheme.listSubtext}>{ item.exercises.length.toString() } Exercises</Text>
        </TouchableOpacity>
      </ScaleDecorator>
    )
  };


  return (
    <SafeAreaView style={PageTheme.pageContainer}>
    <GestureHandlerRootView>
      <DraggableFlatList
        data={workouts}
        keyExtractor={(item) => (item.id).toString()}
        renderItem={renderItem}
        ListFooterComponent={
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

        }
      />
          </GestureHandlerRootView>
    </SafeAreaView>
  );
}
