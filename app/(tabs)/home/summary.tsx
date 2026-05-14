import PageTheme from "@/styles/PageTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Text,
  View,
  FlatList
} from 'react-native';
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import type { ExerciseSet, Session } from "@/components/types";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Paths, File } from 'expo-file-system';
import { nullSesh } from "@/components/TestSessions";
import { getPrevSesh } from "@/extensions/getPrevSesh"; 

export default function Summary() {
  const { sId, ex, sets, reps, volume, sessionDate } = useLocalSearchParams();
  const [ session, setSession ] = useState<Session>(nullSesh)
  const [ prevSesh, setPrevSesh ] = useState<Session>(nullSesh);

  const getSession = async () => {
    const file = new File(Paths.document, 'data', 'sessions.json');
    const existing: Session[] = JSON.parse(await file.text());
    setSession(existing.find(w => w.id == Number(sId))!);
  };
  const exercisesWithSets = session.workout.exercises.map(exercise => ({
    exercise,
    sets: session.sets.filter(set => set.exerciseId === exercise.id)
  })).filter(e => e.sets.length > 0);

  useEffect(() => {
    getSession();
  }, []);

  useEffect(() => {
    if (session.id === 0)  return;
    const fetchPrev = async () => {
      const pSesh = await getPrevSesh(sessionDate as string, session.workout.id);
      setPrevSesh(pSesh ?? nullSesh);
      console.log(pSesh);
    };
    fetchPrev();
  }, [session]);

  const getPrevSet = (exerciseId: number, index: number): ExerciseSet | undefined => {
    const prevExerciseSets = prevSesh.sets.filter(s => s.exerciseId === exerciseId);
    return prevExerciseSets[index];
  }

  return (
    <SafeAreaView style={PageTheme.pageContainer}>
        <FlatList
          data={exercisesWithSets}
          extraData={prevSesh}
          keyExtractor={(item) => item.exercise.id.toString()}
          renderItem={({ item, index }) => {
            return (
            <View style={PageTheme.container}>
            <Text style={PageTheme.bodyText}>{item.exercise.name}</Text>
            <View style={PageTheme.rowContainer}>
            <Text style={PageTheme.setLabel}>      </Text>
            <Text style={PageTheme.setLabel}>Weight</Text>
            <Text style={PageTheme.setLabel}>Reps</Text>
            <Text style={PageTheme.setLabel}>RIR</Text>
            </View>
            {item.sets.map((set, setIndex) => {
              const prevSet = getPrevSet(item.exercise.id, setIndex);
              return (
              <View key={index} style={PageTheme.rowContainer}>
              <Text style={PageTheme.setLabel}>
              {set.side ? `${set.side}${Math.floor(index / 2) + 1}` : `Set ${setIndex + 1}`}
              </Text>
              <Text style={PageTheme.setLabel2}>
                {set.weight}kg
                {prevSet && (
                  <Text style={{ color: set.weight > prevSet.weight ? 'green' : set.weight < prevSet.weight ? 'red' : 'grey' }}>
                    {` (${set.weight > prevSet.weight ? '+' : ''}${set.weight - prevSet.weight})`}
                  </Text>
                )}
              </Text>
              <Text style={PageTheme.setLabel2}>
                {set.reps}
                {prevSet && (
                  <Text style={{ color: set.reps > prevSet.reps ? 'green' : set.reps < prevSet.reps ? 'red' : 'grey' }}>
                    {` (${set.reps > prevSet.reps ? '+' : ''}${set.reps - prevSet.reps})`}
                  </Text>
                )}
                </Text>
              <Text style={PageTheme.setLabel2}>
                {set.rir}
                {prevSet && (
                  <Text style={{ color: set.rir > prevSet.rir ? 'green' : set.rir < prevSet.rir ? 'red' : 'grey' }}>
                    {` (${set.rir > prevSet.rir ? '+' : ''}${set.rir - prevSet.rir})`}
                  </Text>
                )}
                </Text>
              </View>
            )})}
            </View>
          )}}

          ListHeaderComponent={
            <View style={PageTheme.summaryContainer}>
            <View style={PageTheme.setInputRow}>
              <View style={PageTheme.summaryItem}>
                <Text style={PageTheme.summaryText}>Exercises</Text>
                <Text style={PageTheme.summaryText}>{ex}</Text>
              </View>

              <View style={PageTheme.summaryItem}>
                <Text style={PageTheme.summaryText}>Sets</Text>
                <Text style={PageTheme.summaryText}>{sets}</Text>
              </View>
            </View>

            <View style={PageTheme.setInputRow}>
              <View style={PageTheme.summaryItem}>
                <Text style={PageTheme.summaryText}>Reps</Text>
                <Text style={PageTheme.summaryText}>{reps}</Text>
              </View>

              <View style={PageTheme.summaryItem}>
                <Text style={PageTheme.summaryText}>Volume</Text>
                <Text style={PageTheme.summaryText}>{volume + " kg"}</Text>
              </View>
            </View>
          </View>
          }
        />
    </SafeAreaView>
  )
}

