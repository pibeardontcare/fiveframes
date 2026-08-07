import AsyncStorage from '@react-native-async-storage/async-storage';

const SETTINGS_KEY = 'fiveframes_settings';

const DEFAULT_SETTINGS = {
  saveToPhotos: false,
  promptTimes: [
    { id: '1', hour: 8, minute: 30, enabled: true },
    { id: '2', hour: 11, minute: 30, enabled: true },
    { id: '3', hour: 14, minute: 0, enabled: true },
    { id: '4', hour: 17, minute: 30, enabled: true },
    { id: '5', hour: 21, minute: 0, enabled: true },
  ],
};
export async function getSettings() {
  try {
    const json = await AsyncStorage.getItem(SETTINGS_KEY);
    return json ? { ...DEFAULT_SETTINGS, ...JSON.parse(json) } : DEFAULT_SETTINGS;
  } catch (e) {
    console.log('getSettings error:', e);
    return DEFAULT_SETTINGS;
  }
}

export async function updateSetting(key, value) {
  try {
    const settings = await getSettings();
    settings[key] = value;
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    return settings;
  } catch (e) {
    console.log('updateSetting error:', e);
  }
}