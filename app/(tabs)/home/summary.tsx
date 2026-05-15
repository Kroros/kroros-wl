import PageTheme from "@/styles/PageTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Text,
  View,
  FlatList
} from 'react-native';
import { useLocalSearchParams, Stack } from "expo-router";
import { useEffect, useState, useMemo } from "react";
import type { ExerciseSet, Session } from "@/components/types";
import { Paths, File } from 'expo-file-system';
import { nullSesh } from "@/components/TestSessions";
import { getPrevSesh } from "@/extensions/getPrevSesh"; 
import Colours from "@/components/Colours";

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
    };
    fetchPrev();
  }, [session]);

  const getPrevSet = (exerciseId: number, index: number): ExerciseSet | undefined => {
    const prevExerciseSets = prevSesh.sets.filter(s => s.exerciseId === exerciseId);
    return prevExerciseSets[index];
  }

  const getPrevSeshStats = useMemo(() => {
    let exercises = 0, totalSets = 0, reps = 0, volume = 0;
    if (!prevSesh || prevSesh.id === 0) return null;
    for (const exercise of prevSesh.workout.exercises) {
      const exerciseSets = prevSesh.sets.filter(set => set.exerciseId === exercise.id);
      if (exerciseSets.length > 0) exercises++;
      totalSets += exerciseSets.length;
      for (const set of exerciseSets) {
        reps += set.reps;
        volume += set.reps * (set.weight ?? 0);
      }
    }
    return { exercises, totalSets, reps, volume };
  }, [prevSesh]);

  const renderDiff = (current: number, prev: number) => {
    const diff = current - prev;
    if (diff === 0) return null;
    return (
      <Text style={{ color: diff > 0 ? Colours.green1 : diff < 0 ? Colours.alert : Colours.black1 }}>
      {` (${diff > 0 ? '+' : ''}${diff})`}
      </Text>
    );
  };

  return (<>
          <Stack.Screen options={{ title: "Summary" }} />
    <SafeAreaView style={PageTheme.pageContainer}>
        <FlatList
          data={exercisesWithSets}
          extraData={prevSesh}
          keyExtractor={(item, index) => item.exercise.id.toString() + index.toString()}
          renderItem={({ item, index }) => {
            return (<>
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
              return (<View key={setIndex}>
              <View style={PageTheme.rowContainer}>
              <Text style={PageTheme.setLabel}>
              {set.side ? `${set.side}${Math.floor(index / 2) + 1}` : `Set ${setIndex + 1}`}
              </Text>
              <Text style={PageTheme.setLabel2}>
                {set.weight}kg
                {prevSet && (
                  <Text style={{ color: set.weight > prevSet.weight ? Colours.green1 : set.weight < prevSet.weight ? Colours.alert : Colours.black1 }}>
                    {` (${set.weight > prevSet.weight ? '+' : ''}${set.weight - prevSet.weight})`}
                  </Text>
                )}
              </Text>
              <Text style={PageTheme.setLabel2}>
                {set.reps}
                {prevSet && (
                  <Text style={{ color: set.reps > prevSet.reps ? Colours.green1 : set.reps < prevSet.reps ? Colours.alert : Colours.black1 }}>
                    {` (${set.reps > prevSet.reps ? '+' : ''}${set.reps - prevSet.reps})`}
                  </Text>
                )}
                </Text>
              <Text style={PageTheme.setLabel2}>
                {set.rir}
                {prevSet && (
                  <Text style={{ color: set.rir > prevSet.rir ? Colours.green1 : set.rir < prevSet.rir ? Colours.alert : Colours.black1 }}>
                    {` (${set.rir > prevSet.rir ? '+' : ''}${set.rir - prevSet.rir})`}
                  </Text>
                )}
                </Text>
              </View>
              <Text style={PageTheme.bodyText}>
                {set.setNote}
              </Text>
              </View>
            )})}
            {session.exerciseNotes &&
              <Text style={PageTheme.bodyText}>
                {session.exerciseNotes[item.exercise.id]}
              </Text>
            }
            </View>
          </>)}}

          ListHeaderComponent={
            <View style={PageTheme.summaryContainer}>
            <View style={PageTheme.setInputRow}>
              <View style={PageTheme.summaryItem}>
                <Text style={PageTheme.summaryText}>Exercises</Text>
                <Text style={PageTheme.summaryText}>{ex}
                {getPrevSeshStats && renderDiff(Number(ex), getPrevSeshStats.exercises)}</Text>
              </View>

              <View style={PageTheme.summaryItem}>
                <Text style={PageTheme.summaryText}>Sets</Text>
                <Text style={PageTheme.summaryText}>{sets}
                {getPrevSeshStats && renderDiff(Number(sets), getPrevSeshStats.totalSets)}</Text>
              </View>
            </View>

            <View style={PageTheme.setInputRow}>
              <View style={PageTheme.summaryItem}>
                <Text style={PageTheme.summaryText}>Reps</Text>
                <Text style={PageTheme.summaryText}>{reps}
                {getPrevSeshStats && renderDiff(Number(reps), getPrevSeshStats.reps)}</Text>
              </View>

              <View style={PageTheme.summaryItem}>
                <Text style={PageTheme.summaryText}>Volume</Text>
                <Text style={PageTheme.summaryText}>{volume + " kg"}
                {getPrevSeshStats && renderDiff(Number(volume), getPrevSeshStats.volume)}</Text>
              </View>
            </View>
          </View>
          }
        />
    </SafeAreaView>
  </>)
}

