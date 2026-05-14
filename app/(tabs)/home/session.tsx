import PageTheme from "@/styles/PageTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity
} from 'react-native';
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState, useMemo } from "react";
import { ExerciseSet } from "@/components/types";
import type { Session, Workout } from "@/components/types";
import DraggableFlatList, { RenderItemParams } from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Colours from "@/components/Colours";
import { useSharedValue, withTiming, withSequence } from "react-native-reanimated";
import { Paths, File, Directory } from 'expo-file-system';

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
  const [ prevSesh, setPrevSesh ] = useState<Session>();

  const stats = useMemo(() => {
    let exercises = 0, totalSets = 0, reps = 0, volume = 0;
    for (let i = 0; i < workout.exercises.length; i++) {
      const exerciseSets = sets[i] ?? [];
      if (exerciseSets.length > 0) exercises++;
      totalSets += exerciseSets.length;
      for (const set of exerciseSets) {
        reps += set.reps;
        volume += set.reps * (set.weight ?? 0);
      }
    }
    return { exercises, totalSets, reps, volume };
  }, [sets, workout]);

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
    if (currentIndex < workout.exercises.length) {
      setCurrentIndex(i => i + 1);
      translateX.value = withSequence(
        withTiming(400, { duration: 0 }),
        withTiming(0, { duration: 300 })
      );
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(i => i - 1);
      translateX.value = withSequence(
        withTiming(-400, { duration: 0 }),
        withTiming(0, { duration: 300 })
      );
    }
  };

  const endSession = async () => {
    let eSets: ExerciseSet[] = workout.exercises.flatMap((_, i) => sets[i] ?? []);
    
    const s: Session = {
      id: Date.now(),
      date: new Date().toISOString(),
      workout: workout,
      sets: eSets
    }
    if (stats.reps > 0) {
      const directory = new Directory(Paths.document, 'data');
      if (!directory.exists) {
        directory.create();
      }

      const file = new File(Paths.document, 'data', 'sessions.json');
      if (!file.exists) {
        file.create();
        file.write(JSON.stringify([]));
      }

      const text = await file.text();
      const existing: Session[] = text.length > 0 ? JSON.parse(text): [];
      existing.push(s);
      file.write(JSON.stringify(existing));
      console.log(await file.text());
    } 
    router.dismiss(2);
  }

  return (<>
          <Stack.Screen options={{ headerShown: false }} />
    {workout.exercises.length > 0 && (
      <SafeAreaView style={PageTheme.pageContainer}>
        <View style={PageTheme.workoutHeader}>
          <Text style={PageTheme.workoutHeaderText}>{workout.name}</Text>
        </View>
        {currentIndex < workout.exercises.length ? (
        <>
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
        </>) : (
        <>
          <View style={PageTheme.summaryContainer}>
            <View style={PageTheme.setInputRow}>
              <View style={PageTheme.summaryItem}>
                <Text style={PageTheme.summaryText}>Exercises</Text>
                <Text style={PageTheme.summaryText}>{stats.exercises}</Text>
              </View>

              <View style={PageTheme.summaryItem}>
                <Text style={PageTheme.summaryText}>Sets</Text>
                <Text style={PageTheme.summaryText}>{stats.totalSets}</Text>
              </View>
            </View>

            <View style={PageTheme.setInputRow}>
              <View style={PageTheme.summaryItem}>
                <Text style={PageTheme.summaryText}>Reps</Text>
                <Text style={PageTheme.summaryText}>{stats.reps}</Text>
              </View>

              <View style={PageTheme.summaryItem}>
                <Text style={PageTheme.summaryText}>Volume</Text>
                <Text style={PageTheme.summaryText}>{stats.volume + " kg"}</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={PageTheme.mainButton}
            onPress={endSession}
          >
            <Text style={PageTheme.mainButtonText}> End Session </Text>
          </TouchableOpacity>
        </>
        )}

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
