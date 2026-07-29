import { View, Text, Button } from 'react-native';

export default function TagEntryScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', gap: 12, padding: 20 }}>
      <Text>Tag Entry</Text>
      <Button title="Save →" onPress={() => navigation.navigate('Capture')} />
      <Button title="✕ Discard" onPress={() => navigation.goBack()} />
    </View>
  );
}