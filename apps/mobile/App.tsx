import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import RideScene from './src/riders3d/RideScene';

/**
 * Milestone 1 entry.
 * Hosts the simulated 3D multiplayer riding prototype.
 * No real GPS / map integration yet.
 */
export default function App() {
  return (
    <View style={styles.container}>
      <RideScene />
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1220',
  },
});
