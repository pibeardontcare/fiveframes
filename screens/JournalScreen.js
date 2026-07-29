import { View, Text, Button } from 'react-native';

export default function JournalScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', gap: 12, padding: 20 }}>
      <Text>Journal</Text>
      <Button title="Open a day →" onPress={() => navigation.navigate('DayInReview')} />
      <Button title="← Back" onPress={() => navigation.goBack()} />
    </View>
  );
}