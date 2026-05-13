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
import type { Exercise, Workout, Session } from '@/components/types';
import { Paths, File, Directory } from 'expo-file-system';
import { router } from 'expo-router';

const time = new Date();
const dd = String(time.getDate()).padStart(2, '0');
const mm = String(time.getMonth() + 1).padStart(2, '0'); //January is 0!
const yyyy = time.getFullYear();
const today = yyyy + '-' + mm + '-' + dd;

export default function CalendarPage() {
  const [ selected, setSelected ] = useState(today);
  const [ session, setSession ] = useState<Session | undefined>();
  const [ sessionName, setSessionName ] = useState<string>("No Training Session");

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
    const sessions: Session[] = text ? JSON.parse(text) : [];
    const currentSesh: Session | undefined = sessions.find(s => s.date.split('T')[0] == selected);
    setSession(currentSesh);
    if (currentSesh) {
      setSessionName(currentSesh.workout.name);
    } else {
      setSessionName("No Training Session");
    }
  };

  useEffect(() => {
    getSession();
  }, [session]);

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
          <Text style={PageTheme.listSubtext}>{sessionName}</Text>
        </View>

        <Button
          onPress={() => router.push('/home/selectWorkout')}
          title="Start Workout"
          color={Colours.active_border_color}
        />
      </View>
    </SafeAreaView>
  );
}


