import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [ loaded, error ] = useFonts({
    'NerdFont': require('../assets/fonts/HurmitNerdFont-Regular.otf'),
    'NerdFont-Bold': require('../assets/fonts/HurmitNerdFont-Bold.otf'),
  });

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);

  if (!loaded && !error) return null;
    
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  )
}
