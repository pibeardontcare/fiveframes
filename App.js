import { useEffect } from 'react';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Notifications from 'expo-notifications';


import CaptureScreen from './screens/CaptureScreen';
import TagEntryScreen from './screens/TagEntryScreen';
import JournalScreen from './screens/JournalScreen';
import ReviewScreen from './screens/ReviewScreen';
import InsightsScreen from './screens/InsightsScreen';
import SettingsScreen from './screens/SettingsScreen';



const Stack = createNativeStackNavigator();

export const navigationRef = createNavigationContainerRef();

export default function App() {
  useEffect(() => {
    const subscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        if (navigationRef.isReady()) {
          navigationRef.resetRoot({
            index: 0,
            routes: [{ name: 'Capture' }],
          });
        }
      });


  // if closed and launched by notification tap 
  Notifications.getLastNotificationResponseAsync().then((response) => {
    if (response) {
      handleNotificationResponse();
    }
  });

    return () => subscription.remove();
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName="Capture"
        screenOptions={{
          headerShown: false,
          animation: 'none',
        }}
      >
        <Stack.Screen name="Capture" component={CaptureScreen} />
        <Stack.Screen name="TagEntry" component={TagEntryScreen} />
        <Stack.Screen name="Journal" component={JournalScreen} />
        <Stack.Screen name="DayInReview" component={ReviewScreen} />
        <Stack.Screen name="Insights" component={InsightsScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}