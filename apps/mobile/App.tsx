import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import AuthScreen from './src/screens/AuthScreen';
import HomeScreen from './src/screens/HomeScreen';
import LobbyScreen from './src/screens/LobbyScreen';
import LiveRideScreen from './src/screens/LiveRideScreen';
import { authStore } from './src/store/authStore';

type Screen = 'auth' | 'home' | 'lobby' | 'live';

export default function App() {
  const [screen, setScreen] = useState<Screen>(authStore.isLoggedIn() ? 'home' : 'auth');
  const [ride, setRide] = useState<any>(null);

  useEffect(() => {
    return authStore.subscribe(() => {
      if (!authStore.isLoggedIn() && screen !== 'auth') setScreen('auth');
    });
  }, [screen]);

  return (
    <View style={styles.container}>
      {screen === 'auth' && <AuthScreen onSuccess={() => setScreen('home')} />}
      {screen === 'home' && (
        <HomeScreen
          onOpenRide={(r) => {
            setRide(r);
            setScreen('lobby');
          }}
          onLogout={() => {
            authStore.logout();
            setScreen('auth');
          }}
        />
      )}
      {screen === 'lobby' && ride && (
        <LobbyScreen
          ride={ride}
          onStartLive={(r) => {
            setRide(r);
            setScreen('live');
          }}
          onBack={() => {
            setRide(null);
            setScreen('home');
          }}
        />
      )}
      {screen === 'live' && ride && (
        <LiveRideScreen
          ride={ride}
          onLeave={() => {
            setRide(null);
            setScreen('home');
          }}
        />
      )}
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b1220' },
});
