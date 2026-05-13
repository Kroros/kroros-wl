import PageTheme from "@/styles/PageTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity
} from 'react-native';
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ExerciseSet } from "@/components/types";
import { File, Paths } from "expo-file-system";
import type { Workout } from "@/components/types";
import DraggableFlatList, { RenderItemParams } from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Colours from "@/components/Colours";
import { useSharedValue, withTiming, withSequence } from "react-native-reanimated";

export default function Session() {
  const { wId } = useLocalSearchParams();
  const [ workout, setWorkout ] = useState<Workout>({id: 0, name: "null", exercises: []});

  const getWorkout = async () => {
      const file = new File(Paths.document, 'data', 'workouts.json');
      const existing: Workout[] = JSON.parse(await file.text());
      setWorkout(existing.find(w => w.id == Number(wId))!);
  };

  const [ currentIndex, setCurrentIndex ] = useState(0);
  const [ sets, setSets ] = useState<Record<number, ExerciseSet[]>>({});

  useEffect(() => {
    getWorkout();
  }, []);

  const addSet = () => {
    const exercise = workout.exercises[currentIndex];
    const newSet: ExerciseSet = {
      exerciseId: exercise.id,
      reps: 0,
      weight: 0,
      rir: 0,
    };

    if (exercise.unilateral) {
      const leftSet: ExerciseSet = { ...newSet, side: 'L' };
      const rightSet: ExerciseSet = { ...newSet, side: 'R' };
      setSets(prev => ({
        ...prev,
        [currentIndex]: [...(prev[currentIndex] ?? []), leftSet, rightSet],
      }));
    } else {
      setSets(prev => ({
        ...prev,
        [currentIndex]: [...(prev[currentIndex] ?? []), newSet],
      }));
    }
  }; 

  const updateSet = (index: number, field: keyof ExerciseSet, value: number) => {
    setSets(prev => {
      const updated = [...(prev[currentIndex] ?? [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, [currentIndex]: updated };
    });
  };

  const translateX = useSharedValue(0);

  const goNext = () => {
    setCurrentIndex(i => i + 1);
    translateX.value = withSequence(
      withTiming(400, { duration: 0 }),
      withTiming(0, { duration: 300 })
    );
  };

  const goPrev = () => {
    setCurrentIndex(i => i - 1);
    translateX.value = withSequence(
      withTiming(-400, { duration: 0 }),
      withTiming(0, { duration: 300 })
    );
  };

  return (<>
    {workout.exercises.length > 0 && (
      <SafeAreaView style={PageTheme.pageContainer}>
        <View style={PageTheme.workoutHeader}>
          <Text style={PageTheme.workoutHeaderText}>{workout.name}</Text>
        </View>

        <View style={PageTheme.exerciseHeader}>
          <Text style={PageTheme.exerciseHeaderText}>{workout.exercises[currentIndex].name}</Text>
        </View>

        <GestureHandlerRootView style={PageTheme.setInputFieldContainer}>
          <DraggableFlatList
            style={{width: "100%"}}
            data={sets[currentIndex] ?? []}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, drag, isActive }) => {
              const index = (sets[currentIndex] ?? []).indexOf(item);
              const setNumber = Math.floor(index / (workout.exercises[currentIndex].unilateral ? 2 : 1)) + 1;
              const label = item.side ? `Set ${item.side}${setNumber}` : `Set ${setNumber}`;
              return (
                <View style={PageTheme.setInputRow}>
                  <Text style={PageTheme.setLabel}>{label}</Text>
                  <TextInput
                    style={PageTheme.setInputField}
                    placeholder="kg"
                    keyboardType="numeric"
                    value={item.weight?.toString()}
                    onChangeText={(val) => updateSet(index, 'weight', Number(val))}
                  />
                  <TextInput
                    style={PageTheme.setInputField}
                    placeholder="reps"
                    keyboardType="numeric"
                    value={item.reps?.toString()}
                    onChangeText={(val) => updateSet(index, 'reps', Number(val))}
                  />
                  <TextInput
                    style={PageTheme.setInputField}
                    placeholder="RIR"
                    keyboardType="numeric"
                    value={item.rir?.toString()}
                    onChangeText={(val) => updateSet(index, 'rir', Number(val))}
                  />
                </View>
              );
            }}
            ListHeaderComponent={
              <View style={PageTheme.setInputRow}>
              <Text style={PageTheme.setLabel}>{}</Text>
              <Text style={[PageTheme.setLabel, { textAlign: 'center' }]}>Weight</Text>
              <Text style={[PageTheme.setLabel, { textAlign: 'center' }]}>Reps</Text>
              <Text style={[PageTheme.setLabel, { textAlign: 'center' }]}>RIR</Text>
              </View>
            }
            ListFooterComponent={
              <TouchableOpacity style={PageTheme.mainButton} onPress={addSet}>
                <Text style={PageTheme.mainButtonText}>Add Set</Text>
              </TouchableOpacity>}
          />
          
        </GestureHandlerRootView>

        <View style={PageTheme.arrows}>
          <TouchableOpacity style={PageTheme.arrowButton}
            onPress={goPrev}
          >
            <Text style={{
              color:Colours.cyan0,
              fontSize: 64,
            }}></Text>
          </TouchableOpacity>

          <TouchableOpacity style={PageTheme.arrowButton}
            onPress={goNext}
          >
            <Text style={{
              color:Colours.cyan0,
              fontSize: 64,
            }}></Text>
          </TouchableOpacity>

        </View>

      </SafeAreaView>
    )}
  </>)
}
