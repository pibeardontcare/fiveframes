import { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { saveEntry } from '../services/storage';

const MOODS = [
  { emoji: '😞', label: 'Low', value: 1 },
  { emoji: '😐', label: 'Neutral', value: 2 },
  { emoji: '😊', label: 'Content', value: 3 },
  { emoji: '😃', label: 'Happy', value: 4 },
  { emoji: '😠', label: 'Stressed', value: 0 },
];



export default function TagEntryScreen({ navigation, route }) {
    const { photoUri, latitude, longitude, place } = route.params;
    const [selectedMood, setSelectedMood] = useState(null);
    const [caption, setCaption] = useState('');

  async function handleSave() {
    if (!selectedMood) return; // must have mood to save


    await saveEntry({
      id: `entry-${Date.now()}`,
      photoUri,
      mood: selectedMood.value,
      emoji: selectedMood.emoji,
      caption: caption.trim(),
      timestamp: new Date().toISOString(),
      latitude,
      longitude,
      place,
    });


    navigation.navigate('Capture');
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.discard}>
        <Text style={styles.discardText}>✕</Text>
      </TouchableOpacity>

      <Image source={{ uri: photoUri }} style={styles.photo} resizeMode="cover" />

       {place && <Text style={styles.place}>📍 {place}</Text>}

      <Text style={styles.prompt}>How does this moment feel?</Text>

      <View style={styles.moodRow}>
            {MOODS.map((mood) => (
            <TouchableOpacity key={mood.label} onPress={() => setSelectedMood(mood)} style={[styles.moodButton, selectedMood?.label === mood.label && styles.moodSelected]}>
                <Text style={styles.moodEmoji}>{mood.emoji}</Text>
            </TouchableOpacity>
            ))}
      </View>


 

      <TextInput
        placeholder="Add a caption (optional)"
        value={caption}
        onChangeText={setCaption}
        style={styles.caption}
      />

      <TouchableOpacity
        onPress={handleSave}
        disabled={!selectedMood}
        style={[styles.saveButton, !selectedMood && styles.saveDisabled]}
      >
        <Text style={styles.saveText}>Save Entry</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    gap: 16,
  },
  discard: {
    alignSelf: 'flex-start',
  },
  discardText: {
    fontSize: 22,
  },
  photo: {
    width: '100%',
    height: 260,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  prompt: {
    fontSize: 15,
    color: '#555',
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  moodButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moodSelected: {
    backgroundColor: '#e6f0e8',
    borderColor: '#1E4A26',
  },
  moodEmoji: {
    fontSize: 22,
  },
  caption: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
  },
  saveButton: {
    backgroundColor: '#1E4A26',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  saveDisabled: {
    opacity: 0.4,
  },
  saveText: {
    color: '#fff',
    fontWeight: '500',
  },
  place: {
  fontSize: 13,
  color: '#888',
},
});