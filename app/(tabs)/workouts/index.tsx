import React, { useCallback, useState, useMemo } from 'react';
import {
  View,
  Text,
  Button,
  Pressable,
} from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import PageTheme from '@/styles/PageTheme';
import Colours from '@/components/Colours';

export default function Workouts() {
  return (
    <SafeAreaView 
      style={PageTheme.pageContainer}
    >
      <View style={PageTheme.container}>
        <Link href="/workouts/createWorkout" asChild>
          <Pressable style={PageTheme.mainButton}>
          <Text style={PageTheme.mainButtonText}> Create Workout </Text>
          </Pressable>
          </Link>
      </View> 
    </SafeAreaView>
  );
}
