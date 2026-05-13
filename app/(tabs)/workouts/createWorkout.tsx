import PageTheme from '@/styles/PageTheme';
import { router, useLocalSearchParams } from 'expo-router';
import {
  View,
  Text,
  Pressable,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import type { Exercise, Workout } from '@/components/types';
import { useEffect, useState } from "react";
import { setCallback } from '@/extensions/exerciseCallback';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';
import Hr from '@/components/Hr';
import { Paths, File, Directory } from 'expo-file-system';

export default function CreateWorkout() {
  const [ exercises, setExercises ] = useState<Exercise[]>([]);
  const [ name, setName ] = useState("");
  const [ wId, setId ] = useState<number>();


  const { id, workoutName, exercises: exercisesParams } = useLocalSearchParams();

  useEffect(() => {
    if (id) {
      setId(Number(id));
      setName(workoutName as string);
      setExercises(JSON.parse(exercisesParams as string));
    }
  }, [])

  const renderItem = ({ item, drag, isActive }: RenderItemParams<Exercise>) => {
    return (
      <ScaleDecorator>
        <TouchableOpacity
          style={PageTheme.container}
          key={item.id}
          onLongPress={drag}
          disabled={isActive}
          onPress={() => { removeExercise(item.id) }}
        >
          <Text style={PageTheme.listText}>{ item.name }</Text>
        </TouchableOpacity>
      </ScaleDecorator>
    )
  }

  const removeExercise = (id: number) => {
    let filtered = exercises.filter(e => e.id != id);
    setExercises(filtered);
  }

  const deleteWorkout = async () => {
    const file = new File(Paths.document, 'data', 'workouts.json');
    const existing: Workout[] = file.exists ? JSON.parse(await file.text()) : [];
    const filtered = existing.filter(w => w.id != wId);
    file.write(JSON.stringify(filtered));
    router.back();
  }

  const addWorkout = async () => {
    const directory = new Directory(Paths.document, 'data');
    if (!directory.exists) {
      directory.create();
    }

    const file = new File(Paths.document, 'data', 'workouts.json');
    const existing: Workout[] = file.exists ? JSON.parse(await file.text()) : [];

    if (wId) {
      const updated = existing.map(w => w.id == wId ? { id: wId, name, exercises } : w);
      file.write(JSON.stringify(updated));
    } else if (exercises.length > 0) {
      existing.push({ id: Date.now(), name, exercises });
      if (!file.exists) file.create();
      file.write(JSON.stringify(existing));
    }
    router.back();
  };

  return (
    <GestureHandlerRootView style={PageTheme.pageContainer}>
          <DraggableFlatList
            data = {exercises}
            onDragEnd={ ({ data }) => setExercises(data) }
            keyExtractor={(item) => (item.id).toString()}
            renderItem={renderItem}
            ListHeaderComponent={
              <View style={PageTheme.container}> 
              <Text style={PageTheme.bodyText}> Workout Name </Text>
              <TextInput 
                onChangeText={setName}
                style={PageTheme.textInput}
                value={name}
              />
              </View>
            } 

            ListFooterComponent={<>
              <Pressable style={PageTheme.mainButton} onPress={() => {
                setCallback((exercise) => {
                  setExercises(prev => [...prev, exercise]);
                });
                router.push('/workouts/createExercise');
              }}>
              <Text style={PageTheme.mainButtonText}> Add Exercise </Text>
              </Pressable>

              <Hr/>

              <TouchableOpacity
              style={PageTheme.mainButton}
              onPressOut={addWorkout}
              >
              <Text style={PageTheme.mainButtonText}>Finish Workout</Text>
              </TouchableOpacity>
              {wId && (
                <Pressable
                style={PageTheme.redButton}       
                onPress={() => {
                  deleteWorkout();
                }}
                >
                <Text style={PageTheme.mainButtonText}> Delete Workout </Text>
                </Pressable>
              )}
            </>}
            />


    </GestureHandlerRootView>
  )
}
