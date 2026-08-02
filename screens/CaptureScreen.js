import { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions, capturePhoto } from '../services/camera';

export default function CaptureScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);





async function testGeocode() {
  const url = new URL('https://api.bigdatacloud.net/data/reverse-geocode-client');
  url.searchParams.set('latitude', '37.42159');
  url.searchParams.set('longitude', '-122.0837');
  url.searchParams.set('localityLanguage', 'en');

  try {
    const response = await fetch(url.toString());
    console.log('status:', response.status);
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (e) {
    console.log('fetch error:', e);
  }
}


  async function handleShutter() {
    const uri = await capturePhoto(cameraRef);
    navigation.navigate('TagEntry', { photoUri: uri });
  }

  if (!permission) return <View style={styles.container} />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>FiveFrames needs camera access to capture your moments.</Text>
        <TouchableOpacity onPress={requestPermission}>
          <Text style={{ color: 'blue' }}>Grant permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <CameraView ref={cameraRef} style={{ flex: 1 }} />
      <View style={styles.topBar}>
        <Text style={styles.pill}>Ready</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.icon}>⚙</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={() => navigation.navigate('Journal')}>
          <Text style={styles.icon}>🖼</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shutter} onPress={handleShutter} />
        <TouchableOpacity onPress={() => navigation.navigate('Insights')}>
          <Text style={styles.icon}>📊</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={testGeocode}>
        <Text style={styles.icon}>🌍</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    padding: 20,
  },
  topBar: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pill: {
    color: '#fff',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  shutter: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#1E4A26',
  },
  icon: {
    fontSize: 22,
    color: '#fff',
  },

});