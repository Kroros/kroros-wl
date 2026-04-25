import { SafeAreaView } from 'react-native-safe-area-context';
import PageTheme from '@/styles/PageTheme';
import { Calendar } from 'react-native-calendars';

export default function CalendarPage() {
  return (
    <SafeAreaView style={PageTheme.pageContainer}>
      <Calendar
        onDayPress={day => {
          console.log(day);
        }}
      />
    </SafeAreaView>
  );
}


