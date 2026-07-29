import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CaptureScreen from './screens/CaptureScreen';
import TagEntryScreen from './screens/TagEntryScreen';
import JournalScreen from './screens/JournalScreen';
import ReviewScreen from './screens/ReviewScreen';
import InsightsScreen from './screens/InsightsScreen';
import SettingsScreen from './screens/SettingsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
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
        <Stack.Screen
          name="DayInReview"
          component={ReviewScreen}
        />
        <Stack.Screen name="Insights" component={InsightsScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}