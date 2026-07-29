import { View, Text, Button } from 'react-native';

export default function InsightsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', gap: 12, padding: 20 }}>
      <Text>Insights</Text>
      <Button title="← Back" onPress={() => navigation.goBack()} />
    </View>
  );
}