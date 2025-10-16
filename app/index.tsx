import { Redirect } from 'expo-router';
import React from 'react';

export default function Index() {
  // Redirect to login by default - authentication will be handled in login screen
  return <Redirect href="/login" />;
}