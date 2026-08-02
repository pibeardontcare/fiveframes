import AsyncStorage from '@react-native-async-storage/async-storage';

const ENTRIES_KEY = 'fiveframes_entries';

export async function getEntries() {
  try {
    const json = await AsyncStorage.getItem(ENTRIES_KEY);
    return json ? JSON.parse(json) : [];
  } catch (e) {
    console.log('getEntries error:', e);
    return [];
  }
}

export async function saveEntry(entry) {
  try {
    const entries = await getEntries();
    entries.push(entry);
    await AsyncStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
  } catch (e) {
    console.log('saveEntry error:', e);
  }
}