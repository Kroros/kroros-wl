import PageTheme from "@/styles/PageTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList
} from 'react-native';
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState, useMemo } from "react";
import { ExerciseSet } from "@/components/types";
import type { Session, Workout } from "@/components/types";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Colours from "@/components/Colours";
import { useSharedValue, withTiming, withSequence } from "react-native-reanimated";
import { Paths, File, Directory } from 'expo-file-system';
import { getPrevSesh } from "@/extensions/getPrevSesh";
import { nullSesh } from "@/components/TestSessions";

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
  const [ prevSesh, setPrevSesh ] = useState<Session>(nullSesh);

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

  useEffect(() => {
    const fetchPrev = async () => {
      const pSesh = await getPrevSesh(new Date().toISOString().split('T')[0] as string, workout.id);
      setPrevSesh(pSesh ?? nullSesh);
      
      if (pSesh) {
        const preFilled: Record<number, ExerciseSet[]> = {};
        workout.exercises.forEach((exercise, i) => {
          const prevExerciseSets = pSesh.sets.filter(s => s.exerciseId === exercise.id);
          preFilled[i] = prevExerciseSets.map(set => ({
            exerciseId: exercise.id,
            reps: 0,
            weight: 0,
            rir: 0,
            side: set.side,
          }));
        });

        setSets(preFilled);
      }
    };
    fetchPrev();
  }, [workout]);

  const getPrevSet = (exerciseId: number, index: number): ExerciseSet | undefined => {
    const prevExerciseSets = prevSesh.sets.filter(s => s.exerciseId === exerciseId);
    return prevExerciseSets[index];
  }

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
    } 
    router.push({
      pathname: '/home/summary',
      params: {
        sId: s.id,
        ex: stats.exercises,
        sets: stats.totalSets,
        reps: stats.reps,
        volume: stats.volume,
        sessionDate: s.date
      }
    });
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

        <View style={PageTheme.setInputFieldContainer}>
        <FlatList
            style={{width: "100%"}}
            data={sets[currentIndex] ?? []}
            extraData={prevSesh}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => {
              const index = (sets[currentIndex] ?? []).indexOf(item);
              const setNumber = Math.floor(index / (workout.exercises[currentIndex].unilateral ? 2 : 1)) + 1;
              const label = item.side ? `Set ${item.side}${setNumber}` : `Set ${setNumber}`;
              const prevSet = getPrevSet(workout.exercises[currentIndex].id, index);
              return (
                <View style={PageTheme.setInputRow}>
                  <Text style={PageTheme.setLabel}>{label}</Text>
                  <View style={{ position: 'relative', width: "22%" }}>
                    <TextInput
                      style={PageTheme.setInputField1}
                      placeholder={prevSet ? prevSet.weight.toString() : "0"}
                      keyboardType="numeric"
                      onChangeText={(val) => updateSet(index, 'weight', Number(val))}
                    />
                    {prevSet && sets[currentIndex]?.[index]?.weight > 0 && (() => {
                      const diff = sets[currentIndex][index].weight - prevSet.weight;
                      return (
                        <Text style={{
                          position: 'absolute',
                          right: 4,
                          top: 0,
                          bottom: 0,
                          textAlignVertical: 'center',
                          color: diff > 0 ? Colours.green1 : diff < 0 ? Colours.alert : Colours.black1,
                          pointerEvents: 'none',
                        }}>
                        {diff > 0 ? `+${diff}` : diff}
                        </Text>
                      );
                    })()}
                  </View>

                  <View style={{ position: 'relative', width: "22%" }}>
                    <TextInput
                      style={PageTheme.setInputField1}
                      placeholder={prevSet ? prevSet.reps.toString() : "0"}
                      keyboardType="numeric"
                      onChangeText={(val) => updateSet(index, 'reps', Number(val))}
                    />
                    {prevSet && sets[currentIndex]?.[index]?.reps > 0 && (() => {
                      const diff = sets[currentIndex][index].reps - prevSet.reps;
                      return (
                        <Text style={{
                          position: 'absolute',
                          right: 4,
                          top: 0,
                          bottom: 0,
                          textAlignVertical: 'center',
                          color: diff > 0 ? Colours.green1 : diff < 0 ? Colours.alert : Colours.black1,
                          pointerEvents: 'none',
                        }}>
                        {diff > 0 ? `+${diff}` : diff}
                        </Text>
                      );
                    })()}
                  </View>
                  <View style={{ position: 'relative', width: "22%" }}>
                    <TextInput
                      style={PageTheme.setInputField1}
                      placeholder={prevSet ? prevSet.rir.toString() : "0"}
                      keyboardType="numeric"
                      onChangeText={(val) => updateSet(index, 'rir', Number(val))}
                    />
                    {prevSet && sets[currentIndex]?.[index]?.rir > 0 && (() => {
                      const diff = sets[currentIndex][index].rir - prevSet.rir;
                      return (
                        <Text style={{
                          position: 'absolute',
                          right: 4,
                          top: 0,
                          bottom: 0,
                          textAlignVertical: 'center',
                          color: diff > 0 ? Colours.green1 : diff < 0 ? Colours.alert : Colours.black1,
                          pointerEvents: 'none',
                        }}>
                        {diff > 0 ? `+${diff}` : diff}
                        </Text>
                      );
                    })()}
                  </View>
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
          
        </View>
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
