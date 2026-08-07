import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermission() {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function rescheduleAllPrompts(promptTimes) {
  await Notifications.cancelAllScheduledNotificationsAsync();

  const enabled = promptTimes.filter((p) => p.enabled);
  for (const prompt of enabled) {
    await Notifications.scheduleNotificationAsync({
      content: { title: 'FiveFrames', body: 'What is in front of you right now?' },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: prompt.hour,
        minute: prompt.minute,
      },
    });
  }
}