import { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions, capturePhoto } from '../services/camera';
import { getCurrentCoords } from '../services/location';
import { getPlaceName } from '../services/geocode';
import { getSettings } from '../services/settings';
import { colors, spacing, radius, typography } from '../constants/theme';

export default function CaptureScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);

  async function handleShutter() {
    const settings = await getSettings();
    const uri = await capturePhoto(cameraRef, { saveToPhotos: settings.saveToPhotos });

    const coords = await getCurrentCoords();
    const place = coords ? await getPlaceName(coords.latitude, coords.longitude) : null;

    navigation.navigate('TagEntry', {
      photoUri: uri,
      latitude: coords?.latitude ?? null,
      longitude: coords?.longitude ?? null,
      place,
    });
  }

  if (!permission) return <View style={styles.container} />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>FiveFrames needs camera access to capture your moments.</Text>
        <TouchableOpacity onPress={requestPermission}>
          <Text style={styles.link}>Grant permission</Text>
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

        <View style={styles.shutterRing}>
          <TouchableOpacity style={styles.shutter} onPress={handleShutter} />
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('Insights')}>
          <Text style={styles.icon}>📊</Text>
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
    gap: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  permissionText: {
    fontSize: typography.body,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  link: {
    color: colors.spruce,
    fontSize: typography.body,
  },
  topBar: {
    position: 'absolute',
    top: 50,
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pill: {
    color: colors.surface,
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
    fontSize: typography.small,
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
  shutterRing: {
    width: 84,
    height: 84,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutter: {
    width: 64,
    height: 64,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 3,
    borderColor: colors.spruce,
  },
  icon: {
    fontSize: typography.heading,
    color: colors.surface,
  },
});