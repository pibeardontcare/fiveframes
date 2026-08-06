import { useCallback, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getEntries } from '../services/storage';

function groupByDay(entries) {
  const groups = {};
  for (const entry of entries) {
    const day = entry.timestamp.slice(0, 10); 
    if (!groups[day]) groups[day] = [];
    groups[day].push(entry);
  }
  return Object.entries(groups)
    .sort((a, b) => (a[0] < b[0] ? 1 : -1)) 
    .map(([day, dayEntries]) => ({
      day,
      entries: dayEntries.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1)),
    }));
}

function formatDayLabel(dayString) {
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (dayString === today) return 'Today';
  if (dayString === yesterday) return 'Yesterday';
  return dayString;
}

export default function JournalScreen({ navigation }) {
  const [groupedEntries, setGroupedEntries] = useState([]);

  useFocusEffect(
    useCallback(() => {
      getEntries().then((entries) => setGroupedEntries(groupByDay(entries)));
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Journal</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={groupedEntries}
        keyExtractor={(group) => group.day}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListEmptyComponent={
          <Text style={styles.empty}>No entries yet — take your first photo.</Text>
        }
        renderItem={({ item }) => (
          <View>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('DayInReview', { day: item.day, entries: item.entries })
              }
            >
              <Text style={styles.dayHeader}>
                {formatDayLabel(item.day)} · {item.entries.length}
              </Text>
            </TouchableOpacity>

            {item.entries.map((entry) => (
              <View key={entry.id} style={styles.entryRow}>
                <Image source={{ uri: entry.photoUri }} style={styles.thumb} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.caption}>
                    {entry.emoji} {entry.place ? `${entry.place} · ` : ''}{entry.caption}
                    </Text>
                  <Text style={styles.time}>
                    {new Date(entry.timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  back: {
    color: '#1E4A26',
    fontSize: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
  },
  empty: {
    textAlign: 'center',
    color: '#888',
    marginTop: 60,
  },
  dayHeader: {
    fontSize: 15,
    fontWeight: '600',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 6,
    color: '#333',
  },
  entryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  thumb: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  caption: {
    fontSize: 15,
  },
  time: {
    fontSize: 12,
    color: '#888',
  },
});