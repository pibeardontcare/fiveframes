import { View, Text, Button } from 'react-native';

export default function CaptureScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', gap: 12, padding: 20 }}>
      <Text>Capture (root)</Text>
      <Button title="Shutter →" onPress={() => navigation.navigate('TagEntry')} />
      <Button title="Journal" onPress={() => navigation.navigate('Journal')} />
      <Button title="Insights" onPress={() => navigation.navigate('Insights')} />
      <Button title="Settings" onPress={() => navigation.navigate('Settings')} />
    </View>
  );
}