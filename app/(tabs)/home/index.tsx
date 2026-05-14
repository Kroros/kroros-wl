import React, { useCallback, useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  Button,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PageTheme from '@/styles/PageTheme';
import { Calendar, CalendarUtils } from 'react-native-calendars';
import Colours from '@/components/Colours';
import type { Session, Workout } from '@/components/types';
import { Paths, File, Directory } from 'expo-file-system';
import { router } from 'expo-router';
import { nullSesh, testSessions } from '@/components/TestSessions';

const time = new Date();
const dd = String(time.getDate()).padStart(2, '0');
const mm = String(time.getMonth() + 1).padStart(2, '0'); //January is 0!
const yyyy = time.getFullYear();
const today = yyyy + '-' + mm + '-' + dd;

export default function CalendarPage() {
  const [ selected, setSelected ] = useState(today);
  const [ session, setSession ] = useState<Session>(nullSesh);

  const getSession = async () => {
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
    const sessions: Session[] = text.length > 0 ? JSON.parse(text) : [];
    const currentSesh: Session = sessions.find(s => s.date.split('T')[0] == selected) ?? nullSesh;
    setSession(currentSesh);
  };

  useEffect(() => {
    getSession();
  }, [selected]);

  const onDayPress = useCallback((day: any) => {
    setSelected(day.dateString);
  }, []);

  const getDate = (count: number) => {
    const newDate = time.setDate(time.getDate() + count);
    return CalendarUtils.getCalendarDateString(newDate);
  };

  const marked = useMemo(() => {
    return {
      [selected]: {
        selected: true,
        disableTouchEvent: true,
        selectedColor: Colours.blue1,
        selectedTextColor: Colours.white1,
      }
    };
  }, [selected]);

  const stats = useMemo(() => {
    let exercises = 0, totalSets = 0, reps = 0, volume = 0;
    const s = session;
    if (!s) return { exercises, totalSets, reps, volume };

    for (const exercise of s.workout.exercises) {
      const exerciseSets = s.sets.filter(set => set.exerciseId === exercise.id);
      if (exerciseSets.length > 0) exercises++;
      totalSets += exerciseSets.length;
      for (const set of exerciseSets) {
        reps += set.reps;
        volume += set.reps * (set.weight ?? 0);
      }
    }
    return { exercises, totalSets, reps, volume };
  }, [session]);

  return (
    <SafeAreaView style={PageTheme.pageContainer}>
      <Calendar
        key={Colours.selection_background}
        enableSwipeMonths
        onDayPress={onDayPress}
        markedDates={marked}

        style={PageTheme.calendar}

        theme={{
		  backgroundColor: Colours.selection_background,
          calendarBackground: Colours.selection_background,
          dayTextColor: Colours.foreground,
          monthTextColor: Colours.active_border_color,
          selectedDayBackgroundColor: Colours.blue1,
          textDisabledColor: '#98a0b5',
        }}
      />
      
      <View
        style={PageTheme.container}
      >
        <View style={PageTheme.rowContainer}>
          <Text style={PageTheme.bodyText}>Training</Text>
        </View>
        {session.workout.name != "null" && 
          (<View style={PageTheme.miniSummaryContainer}>
            <Text style={PageTheme.miniSummaryLabel}>{session.workout.name == "null" ? "No Workout Today" : session.workout.name}</Text>

            <View style={PageTheme.rowContainer}>
              <Text style={PageTheme.miniSummaryText}>{stats.exercises} Exercises</Text>
              <Text style={PageTheme.miniSummaryText}>{stats.totalSets} Sets</Text>
              <Text style={PageTheme.miniSummaryText}>{stats.reps} Reps</Text>
            </View> 
          </View>)}


        <Button
          onPress={() => {
            if (session.workout.name == "null") {
              router.push('/home/selectWorkout');
            } else {
              router.push({
                pathname: '/home/summary',
                params: {
                  sId: session.id,
                  ex: stats.exercises,
                  sets: stats.totalSets,
                  reps: stats.reps,
                  volume: stats.volume,
                  sessionDate: session.date
                }
              })
            }
          }}
          title={session.workout.name == "null" ? "START WORKOUT" : "SEE SUMMARY"}
          color={Colours.active_border_color}
        />
        <Button
          onPress={async () => {
            const file = new File(Paths.document, 'data', 'sessions.json');
            const text = await file.text();
            const existing: Session[] = text.length > 0 ? JSON.parse(await file.text()) : []
            const filtered = existing.filter(s => s.date.split("T")[0] != today);
            file.write(JSON.stringify(filtered));
          }}
          title={"Delete Today's Session"}
          color={Colours.active_border_color}
        />

        <Button
          onPress={async () => {
            const file = new File(Paths.document, 'data', 'sessions.json');
            const text = await file.text();
            const existing: Session[] = text.length > 0 ? JSON.parse(await file.text()) : []
            const newSessions = existing.concat(testSessions);
            file.write(JSON.stringify(newSessions));
            console.log("Sessions Added");
            console.log(text);
          }}
          title={"Add test sessions"}
          color={Colours.active_border_color}
        />

        <Button
          onPress={async () => {
            const file = new File(Paths.document, 'data', 'sessions.json');
            const text = await file.text();
            console.log(text);
          }}
          title={"Log Sessions"}
          color={Colours.active_border_color}
        />

        <Button
          onPress={async () => {
            const w = {
              id: 1,
              name: "Push Day",
              exercises: [
                { id: 1, name: "Bench Press", unilateral: false },
                { id: 2, name: "Dumbbell Shoulder Press", unilateral: false },
                { id: 3, name: "Cable Lateral Raise", unilateral: true },
              ]
            };

            const file = new File(Paths.document, 'data', 'workouts.json');
            const text = await file.text();
            const existing = text.length > 0 ? JSON.parse(text) : [];
            existing.push(w);
            file.write(JSON.stringify(existing));
            console.log(await file.text());
            
          }}
          title={"Add Default Workout"}
          color={Colours.active_border_color}
        />
      </View>
    </SafeAreaView>
  );
}


