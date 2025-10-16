import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import FoodDetailScreen from '../src/screens/Restaurant/FoodDetailScreen';

export default function FoodDetailPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Parse the food item from params
  const foodItem = params.foodItem ? JSON.parse(params.foodItem as string) : null;
  
  if (!foodItem) {
    router.back();
    return null;
  }
  
  return <FoodDetailScreen />;
}