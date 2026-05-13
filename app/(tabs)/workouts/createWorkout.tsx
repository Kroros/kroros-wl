import PageTheme from '@/styles/PageTheme';
import { router } from 'expo-router';
import {
  View,
  Text,
  Pressable,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import type { Exercise, Workout } from '@/components/types';
import { useState } from "react";
import { setCallback } from '@/extensions/exerciseCallback';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';
import Hr from '@/components/Hr';
import { Paths, File, Directory } from 'expo-file-system';


export default function CreateWorkout() {
  const [ exercises, setExercises ] = useState<Exercise[]>([]);
  const [ name, setName ] = useState("");

  const renderItem = ({ item, drag, isActive }: RenderItemParams<Exercise>) => {
    return (
      <ScaleDecorator>
        <TouchableOpacity
          style={PageTheme.container}
          key={item.id}
          onLongPress={drag}
          disabled={isActive}
        >
          <Text style={PageTheme.listText}>{ item.name }</Text>
        </TouchableOpacity>
      </ScaleDecorator>
    )
  }

  const addWorkout = async () => {
    if (exercises.length > 0){
      const w: Workout = {
        id: Date.now(),
        name: name,
        exercises: exercises,
      }

      const directory = new Directory(Paths.document, 'data');
      if (!directory.exists) {
        directory.create();
      }

      const file = new File(Paths.document, 'data', 'workouts.json');

      if (!file.exists) {
        file.create();
        file.write(JSON.stringify([w]));
      } else {
        const existing = JSON.parse(await file.text());
        existing.push(w);
        file.write(JSON.stringify(existing));
      }
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
            </>}
            />


    </GestureHandlerRootView>
  )
}
