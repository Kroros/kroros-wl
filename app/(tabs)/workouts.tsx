import React, { useCallback, useState, useMemo } from 'react';
import {
  View,
  Text,
  Button,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PageTheme from '@/styles/PageTheme';
import { Calendar, CalendarUtils } from 'react-native-calendars';
import Colours from '@/components/Colours';

export default function Workouts() {
  return (
    <SafeAreaView 
      style={PageTheme.pageContainer}
    >
      <Text style={PageTheme.bodyText}>Workouts</Text>
    </SafeAreaView>
  );
}
