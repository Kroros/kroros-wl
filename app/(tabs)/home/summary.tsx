import PageTheme from "@/styles/PageTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import {
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
import AppText from "@/components/AppText";

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
      <AppText style={{ color: diff > 0 ? Colours.green1 : diff < 0 ? Colours.alert : Colours.black1 }}>
      {` (${diff > 0 ? '+' : ''}${diff})`}
      </AppText>
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
            <AppText style={PageTheme.bodyText}>{item.exercise.name}</AppText>
            <View style={PageTheme.rowContainer}>
            <AppText style={PageTheme.setLabel}>      </AppText>
            <AppText style={PageTheme.setLabel}>Weight</AppText>
            <AppText style={PageTheme.setLabel}>Reps</AppText>
            <AppText style={PageTheme.setLabel}>RIR</AppText>
            </View>
            {item.sets.map((set, setIndex) => {
              const prevSet = getPrevSet(item.exercise.id, setIndex);
              return (<View key={setIndex}>
              <View style={PageTheme.rowContainer}>
              <AppText style={PageTheme.setLabel}>
              {set.side ? `${set.side}${Math.floor(index / 2) + 1}` : `Set ${setIndex + 1}`}
              </AppText>
              <AppText style={PageTheme.setLabel2}>
                {set.weight}kg
                {prevSet && (
                  <AppText style={{ color: set.weight > prevSet.weight ? Colours.green1 : set.weight < prevSet.weight ? Colours.alert : Colours.black1 }}>
                    {` (${set.weight > prevSet.weight ? '+' : ''}${set.weight - prevSet.weight})`}
                  </AppText>
                )}
              </AppText>
              <AppText style={PageTheme.setLabel2}>
                {set.reps}
                {prevSet && (
                  <AppText style={{ color: set.reps > prevSet.reps ? Colours.green1 : set.reps < prevSet.reps ? Colours.alert : Colours.black1 }}>
                    {` (${set.reps > prevSet.reps ? '+' : ''}${set.reps - prevSet.reps})`}
                  </AppText>
                )}
                </AppText>
              <AppText style={PageTheme.setLabel2}>
                {set.rir}
                {prevSet && (
                  <AppText style={{ color: set.rir > prevSet.rir ? Colours.green1 : set.rir < prevSet.rir ? Colours.alert : Colours.black1 }}>
                    {` (${set.rir > prevSet.rir ? '+' : ''}${set.rir - prevSet.rir})`}
                  </AppText>
                )}
                </AppText>
              </View>
              <AppText style={PageTheme.bodyText}>
                {set.setNote}
              </AppText>
              </View>
            )})}
            {session.exerciseNotes &&
              <AppText style={PageTheme.bodyText}>
                {session.exerciseNotes[item.exercise.id]}
              </AppText>
            }
            </View>
          </>)}}

          ListHeaderComponent={
            <View style={PageTheme.summaryContainer}>
            <View style={PageTheme.setInputRow}>
              <View style={PageTheme.summaryItem}>
                <AppText style={PageTheme.summaryText}>Exercises</AppText>
                <AppText style={PageTheme.summaryText}>{ex}
                {getPrevSeshStats && renderDiff(Number(ex), getPrevSeshStats.exercises)}</AppText>
              </View>

              <View style={PageTheme.summaryItem}>
                <AppText style={PageTheme.summaryText}>Sets</AppText>
                <AppText style={PageTheme.summaryText}>{sets}
                {getPrevSeshStats && renderDiff(Number(sets), getPrevSeshStats.totalSets)}</AppText>
              </View>
            </View>

            <View style={PageTheme.setInputRow}>
              <View style={PageTheme.summaryItem}>
                <AppText style={PageTheme.summaryText}>Reps</AppText>
                <AppText style={PageTheme.summaryText}>{reps}
                {getPrevSeshStats && renderDiff(Number(reps), getPrevSeshStats.reps)}</AppText>
              </View>

              <View style={PageTheme.summaryItem}>
                <AppText style={PageTheme.summaryText}>Volume</AppText>
                <AppText style={PageTheme.summaryText}>{volume + " kg"}
                {getPrevSeshStats && renderDiff(Number(volume), getPrevSeshStats.volume)}</AppText>
              </View>
            </View>
          </View>
          }
        />
    </SafeAreaView>
  </>)
}

