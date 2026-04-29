import { Tabs } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Colours from '@/components/Colours';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colours.active_border_color,
        headerShown: false,
      }}  
    >
      <Tabs.Screen
        name="home/index"
        options={{
          headerTitle: "Calendar",
          title: "Calendar",
          tabBarIcon: ({ color }) => <Feather name="home" size={24} color={color} />
        }}
      />
      <Tabs.Screen
        name="workouts"
        options={{
          headerTitle: "Workouts",
          title: "Workouts",
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="arm-flex-outline" size={24} color={color} />
        }}
      />
    </Tabs>
  );
}
