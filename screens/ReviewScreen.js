import { View, Text, Button } from 'react-native';

export default function DayInReviewScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', gap: 12, padding: 20 }}>
      <Text>Day in Review</Text>
      <Button title="← Back to Journal" onPress={() => navigation.goBack()} />
    </View>
  );
}