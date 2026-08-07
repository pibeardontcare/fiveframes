import { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getEntries } from '../services/storage';
import { getMoodByDay, getBestTimeOfDay, getBestAndWorstPlace } from '../services/insights';

const MIN_ENTRIES_FOR_INSIGHTS = 5;

export default function InsightsScreen({ navigation }) {
  const [entries, setEntries] = useState([]);

  useFocusEffect(
    useCallback(() => {
      getEntries().then(setEntries);
    }, [])
  );

  const hasEnoughData = entries.length >= MIN_ENTRIES_FOR_INSIGHTS;
  const moodByDay = getMoodByDay(entries);
  const bestTime = getBestTimeOfDay(entries);
  const { best, worst } = getBestAndWorstPlace(entries);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Insights</Text>
        <View style={{ width: 40 }} />
      </View>

      {!hasEnoughData ? (
        <Text style={styles.empty}>
          Keep noticing — insights appear once you have a few more entries.
        </Text>
      ) : (
        <View style={styles.stats}>
          <View style={styles.grid}>
            {moodByDay.map(({ day, averageMood }) => (
              <View
                key={day}
                style={[styles.pixel, { opacity: 0.3 + (averageMood / 4) * 0.7 }]}
              />
            ))}
          </View>

          {bestTime && (
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>You feel best</Text>
              <Text style={styles.statValue}>{bestTime}</Text>
            </View>
          )}

          {best && (
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Happiest place</Text>
              <Text style={styles.statValue}>{best}</Text>
            </View>
          )}

          {worst && worst !== best && (
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Most stressed place</Text>
              <Text style={styles.statValue}>{worst}</Text>
            </View>
          )}
        </View>
      )}
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
    paddingHorizontal: 30,
  },
  stats: {
    paddingHorizontal: 20,
    gap: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  pixel: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: '#1E4A26',
  },
  statCard: {
    backgroundColor: '#f0f4f1',
    borderRadius: 8,
    padding: 12,
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 2,
  },
});