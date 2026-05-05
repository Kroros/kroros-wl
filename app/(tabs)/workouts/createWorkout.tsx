import PageTheme from '@/styles/PageTheme';
import { router } from 'expo-router';
import {
  View,
  ScrollView,
  Text,
  Pressable,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Exercise } from '@/components/types';
import { useState, useEffect } from "react";
import { setCallback } from '@/extensions/exerciseCallback';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';
import Hr from '@/components/Hr';

export default function CreateWorkout() {
  const [ exercises, setExercises ] = useState<Exercise[]>([]);

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

  return (
    <GestureHandlerRootView style={PageTheme.pageContainer}>
          <View style={PageTheme.container}> 
            <Text style={PageTheme.bodyText}> Workout Name </Text>
            <TextInput 
              style={PageTheme.textInput}
            />
          </View>
          
          <DraggableFlatList
            data = {exercises}
            onDragEnd={ ({ data }) => setExercises(data) }
            keyExtractor={(item) => (item.id).toString()}
            renderItem={renderItem}
          />

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
          >
            <Text style={PageTheme.mainButtonText}>Finish Workout</Text>
          </TouchableOpacity>
    </GestureHandlerRootView>
  )
}
