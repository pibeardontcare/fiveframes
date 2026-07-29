// components/ScreenHeader.js

import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function ScreenHeader({
  title,
  navigation,
  showBack = true,
  showSettings = true,
}) {
  return (
    <View style={styles.header}>
      <View style={styles.side}>
        {showBack && (
          <Pressable onPress={() => navigation.goBack()}>
            <Text style={styles.icon}>‹</Text>
          </Pressable>
        )}
      </View>

      <Text style={styles.title}>{title}</Text>

      <View style={[styles.side, styles.right]}>
        {showSettings && (
          <Pressable onPress={() => navigation.navigate('Settings')}>
            <Text style={styles.icon}>⚙</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
  },
  side: {
    width: 48,
  },
  right: {
    alignItems: 'flex-end',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  icon: {
    fontSize: 24,
  },
});