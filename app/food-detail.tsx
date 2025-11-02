import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import FoodDetailScreen from '../src/screens/Restaurant/FoodDetailScreen';

export default function FoodDetailPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Get the food item ID from params
  const foodItemId = params.id as string;
  
  if (!foodItemId) {
    router.back();
    return null;
  }
  
  return <FoodDetailScreen />;
}