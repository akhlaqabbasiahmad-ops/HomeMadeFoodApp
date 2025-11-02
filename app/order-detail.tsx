import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import OrderDetailScreen from '../src/screens/Orders/OrderDetailScreen';

export default function OrderDetailPage() {
  const params = useLocalSearchParams();
  
  return <OrderDetailScreen />;
}
