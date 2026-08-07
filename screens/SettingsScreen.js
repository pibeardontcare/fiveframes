import { useState, useEffect } from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet } from 'react-native';
import { getSettings, updateSetting } from '../services/settings';
import { requestNotificationPermission, rescheduleAllPrompts } from '../services/notifications';

function formatTime(hour, minute) {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
}



export default function SettingsScreen({ navigation }) {
  const [saveToPhotos, setSaveToPhotos] = useState(false);
  const [promptTimes, setPromptTimes] = useState([]);




  useEffect(() => {
    getSettings().then((settings) => {
      setSaveToPhotos(settings.saveToPhotos);
      setPromptTimes(settings.promptTimes);
    });
  }, []);

  async function toggleSaveToPhotos(value) {
    setSaveToPhotos(value);
    await updateSetting('saveToPhotos', value);
  }

  async function togglePrompt(id, enabled) {
    const activeCount = promptTimes.filter((p) => p.enabled).length;
    if (!enabled && activeCount <= 1) return; 

    const updated = promptTimes.map((p) => (p.id === id ? { ...p, enabled } : p));
    setPromptTimes(updated);
    await updateSetting('promptTimes', updated);

    const granted = await requestNotificationPermission();
    if (granted) await rescheduleAllPrompts(updated);
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.back}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.sectionLabel}>Daily Prompt Times</Text>
      {promptTimes.map((prompt) => (
        <View key={prompt.id} style={styles.row}>
          <Text style={[styles.rowLabel, !prompt.enabled && styles.rowLabelDisabled]}>
            {formatTime(prompt.hour, prompt.minute)}
          </Text>
          <Switch value={prompt.enabled} onValueChange={(v) => togglePrompt(prompt.id, v)} />
        </View>
      ))}

      <Text style={styles.sectionLabel}>Entry Data</Text>
      <View style={styles.row}>
        <Text style={styles.rowLabel}>Also save to Photos</Text>
        <Switch value={saveToPhotos} onValueChange={toggleSaveToPhotos} />
      </View>

      <Text style={styles.privacyNote}>
        Off by default — your photos stay private inside FiveFrames only.
        Turning this on also saves a copy to your device's Photos app (in a
        "FiveFrames" album), which protects against losing photos if you
        uninstall — but means other apps with photo access could then see
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
    gap: 12,
  },
  back: {
    color: '#1E4A26',
    fontSize: 16,
  },
  sectionLabel: {
    fontSize: 13,
    color: '#888',
    textTransform: 'uppercase',
    marginTop: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  rowLabel: {
    fontSize: 16,
  },
  rowLabelDisabled: {
    color: '#bbb',
  },
  privacyNote: {
    fontSize: 13,
    color: '#888',
    lineHeight: 18,
    marginTop: 8,
  },
});