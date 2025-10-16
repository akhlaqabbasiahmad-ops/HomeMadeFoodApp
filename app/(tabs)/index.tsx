import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import HomeScreen from '../../src/screens/Home/HomeScreen';
import SplashScreen from '../../src/screens/SplashScreen';

export default function Index() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return (
      <>
        <StatusBar style="auto" />
        <SplashScreen onAnimationComplete={handleSplashComplete} />
      </>
    );
  }

  return (
    <>
      <StatusBar style="auto" />
      <HomeScreen />
    </>
  );
}