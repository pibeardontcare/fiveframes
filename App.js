import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import * as Notifications from 'expo-notifications';

// Show notifications even if the app is foregrounded (useful while testing)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

  // 3. The real test: daily repeat (9:50 PM = hour 21 in 24h time)
const PROMPT_TIMES = [
  { hour: 8,  minute: 30 },
  { hour: 11, minute: 30 },
  { hour: 14, minute: 0 },
  { hour: 17, minute: 30 },
  { hour: 21, minute: 0 },
];

async function runSpike() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    alert('Permission denied');
    return;
  }

  // Clean slate so repeat presses don't stack duplicates
  await Notifications.cancelAllScheduledNotificationsAsync();

  for (const t of PROMPT_TIMES) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'FiveFrames',
        body: 'What is in front of you right now?',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: t.hour,
        minute: t.minute,
      },
    });
  }

  const queued = await Notifications.getAllScheduledNotificationsAsync();
  alert(`Scheduled ${queued.length} daily prompts`);
}



export default function App() {
  return (
    <View style={styles.container}>
      <Text>Notification spike</Text>
      <Button title="Schedule test notifications" onPress={runSpike} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', gap: 16 },
});