// Choose Name, Category, Unilateral?
import Colours from '@/components/Colours';
import PageTheme from '@/styles/PageTheme';
import { Link, useRouter } from 'expo-router';
import {
  View,
  Text,
  Button,
  TextInput,
  Switch,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getCallback } from '@/extensions/exerciseCallback';
import { useState } from 'react';

export default function CreateExercise() {
  const router = useRouter();

  const [ name, setName ] = useState<string>("");
  const [ unilateral, setUnilateral ] = useState<boolean>(false);

  const toggleSwitch = () => setUnilateral(prev => !prev);
  
  const addExercise = () => {
    getCallback()?.({
      name: name,
      unilateral: unilateral
    });
    router.back();
  }


  return (
    <SafeAreaView style={PageTheme.pageContainer}>
      <View style={PageTheme.container}>
        <Text style={PageTheme.bodyText}>Exercise Name</Text>
        <TextInput
          onChangeText={setName}
        />
      </View>

      <View style={PageTheme.container}>
        <Text style={PageTheme.bodyText}>Unilateral</Text>
        <Switch 
          onValueChange={toggleSwitch}
          value={unilateral}
        />
      </View>

      <Pressable
        onPress={addExercise}
        disabled={name.length == 0}
        style={PageTheme.mainButton}
      >
        <Text style={PageTheme.mainButtonText}> Add Exercise </Text>
      </Pressable>
    </SafeAreaView>
  )
}
