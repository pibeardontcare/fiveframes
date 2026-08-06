import { useState, useEffect } from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet } from 'react-native';
import { getSettings, updateSetting } from '../services/settings';

export default function SettingsScreen({ navigation }) {
  const [saveToPhotos, setSaveToPhotos] = useState(false);

  useEffect(() => {
    getSettings().then((s) => setSaveToPhotos(s.saveToPhotos));
  }, []);

  async function toggleSaveToPhotos(value) {
    setSaveToPhotos(value);
    await updateSetting('saveToPhotos', value);
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.back}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.sectionLabel}>Entry Data</Text>

      <View style={styles.row}>
        <Text style={styles.rowLabel}>Also save to Photos</Text>
        <Switch value={saveToPhotos} onValueChange={toggleSaveToPhotos} />
      </View>

      <Text style={styles.privacyNote}>
        Off by default. Your photos stay inside FiveFrames only.
        Turning this on also saves a copy to your device's Photos app, which protects against losing photos if you
        uninstall, but means other apps with photo access could then see
        them too.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    gap: 20,
  },
  back: {
    color: '#1E4A26',
    fontSize: 16,
  },
  sectionLabel: {
    fontSize: 13,
    color: '#888',
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowLabel: {
    fontSize: 16,
  },
  privacyNote: {
    fontSize: 13,
    color: '#888',
    lineHeight: 18,
  },
});