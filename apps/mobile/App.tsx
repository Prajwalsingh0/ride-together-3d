import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

/**
 * Milestone 0 skeleton.
 * Real UI and 3D arrive in later milestones.
 */
export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ride Together 3D</Text>
      <Text style={styles.subtitle}>Milestone 0 — Architecture validated</Text>
      <Text style={styles.note}>
        Next: Milestone 1 — 3D rider prototype (simulated)
      </Text>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
    marginBottom: 24,
  },
  note: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
});
