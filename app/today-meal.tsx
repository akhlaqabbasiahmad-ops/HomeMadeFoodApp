import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import FoodCard from '../src/components/Food/FoodCard';
import CustomButton from '../src/components/common/CustomButton';
import EmptyState from '../src/components/common/EmptyState';
import ScreenHeader from '../src/components/common/ScreenHeader';
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../src/constants/theme';
import { useTodayMealSuggestion } from '../src/hooks/useTodayMealSuggestion';
import { FoodItem, MealSuggestion } from '../src/types';

export default function TodayMealPage() {
  const router = useRouter();
  const { suggestion, loading, error, fetchSuggestion } = useTodayMealSuggestion();

  const [dietaryRestrictions, setDietaryRestrictions] = useState('');
  const [favoriteCategories, setFavoriteCategories] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showPreferences, setShowPreferences] = useState(false);

  useEffect(() => {
    // Auto-fetch on mount
    fetchSuggestion();
  }, []);

  const handleGetSuggestion = () => {
    const params: any = {};

    if (dietaryRestrictions.trim()) {
      params.dietaryRestrictions = dietaryRestrictions.split(',').map((s) => s.trim()).filter(Boolean);
    }

    if (favoriteCategories.trim()) {
      params.favoriteCategories = favoriteCategories.split(',').map((s) => s.trim()).filter(Boolean);
    }

    if (maxPrice.trim()) {
      const price = Number(maxPrice);
      if (!isNaN(price) && price > 0) {
        params.maxPrice = price;
      }
    }

    fetchSuggestion(params);
    setShowPreferences(false);
  };

  const convertToFoodItem = (
    meal: MealSuggestion['fromApp']['meal'], 
    nutritionalInfo: MealSuggestion['fromApp']['nutritionalInfo']
  ): FoodItem => {
    return {
      id: meal.id,
      name: meal.name,
      description: meal.description,
      price: meal.price,
      originalPrice: meal.price,
      image: meal.image,
      category: meal.category,
      restaurantId: '',
      restaurantName: meal.restaurantName,
      rating: meal.rating,
      reviews: 0,
      isVegetarian: nutritionalInfo.isVegetarian,
      isVegan: nutritionalInfo.isVegan,
      isSpicy: nutritionalInfo.isSpicy,
      isFeatured: false,
      isPopular: false,
      ingredients: [],
      allergens: [],
      preparationTime: 0,
      calories: nutritionalInfo.calories,
    };
  };

  const renderPreferences = () => {
    if (!showPreferences) return null;

    return (
      <View style={styles.preferencesContainer}>
        <Text style={styles.preferencesTitle}>Customize Your Suggestion</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Dietary Restrictions (comma-separated)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., vegetarian, vegan, gluten-free"
            placeholderTextColor={COLORS.text.tertiary}
            value={dietaryRestrictions}
            onChangeText={setDietaryRestrictions}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Favorite Categories (comma-separated)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Italian, Chinese, Desserts"
            placeholderTextColor={COLORS.text.tertiary}
            value={favoriteCategories}
            onChangeText={setFavoriteCategories}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Max Price ($)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 25.99"
            placeholderTextColor={COLORS.text.tertiary}
            value={maxPrice}
            onChangeText={setMaxPrice}
            keyboardType="decimal-pad"
          />
        </View>

        <CustomButton
          title="Get Suggestion"
          onPress={handleGetSuggestion}
          style={styles.getButton}
        />
      </View>
    );
  };

  const renderMealSuggestion = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Finding your perfect meal...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <EmptyState
          icon="alert-circle-outline"
          title="Oops! Something went wrong"
          subtitle={error}
          action={
            <CustomButton
              title="Try Again"
              onPress={() => fetchSuggestion()}
              variant="outline"
            />
          }
        />
      );
    }

    if (!suggestion) {
      return (
        <EmptyState
          icon="restaurant-outline"
          title="No Suggestion Available"
          subtitle="Get a personalized meal suggestion for today"
        />
      );
    }

    const appFoodItem = convertToFoodItem(suggestion.fromApp.meal, suggestion.fromApp.nutritionalInfo);

    return (
      <View style={styles.suggestionContainer}>
        {/* App Meal Suggestion */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="restaurant" size={20} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>From Our Menu</Text>
          </View>

          {/* Reason Card */}
          <View style={styles.reasonCard}>
            <View style={styles.reasonHeader}>
              <Ionicons name="sparkles" size={24} color={COLORS.primary} />
              <Text style={styles.reasonTitle}>Why this meal?</Text>
            </View>
            <Text style={styles.reasonText}>{suggestion.fromApp.reason}</Text>
          </View>

          {/* Meal Card */}
          <FoodCard
            foodItem={appFoodItem}
            onPress={() => {
              router.push({
                pathname: '/food-detail',
                params: { id: appFoodItem.id },
              });
            }}
          />

          {/* Nutritional Info */}
          <View style={styles.nutritionalCard}>
            <Text style={styles.nutritionalTitle}>Nutritional Information</Text>
            <View style={styles.nutritionalRow}>
              <View style={styles.nutritionalItem}>
                <Ionicons name="flame-outline" size={20} color={COLORS.error} />
                <Text style={styles.nutritionalText}>
                  {suggestion.fromApp.nutritionalInfo.calories} cal
                </Text>
              </View>
              {suggestion.fromApp.nutritionalInfo.isVegetarian && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>VEG</Text>
                </View>
              )}
              {suggestion.fromApp.nutritionalInfo.isVegan && (
                <View style={[styles.badge, styles.veganBadge]}>
                  <Text style={styles.badgeText}>VEGAN</Text>
                </View>
              )}
              {suggestion.fromApp.nutritionalInfo.isSpicy && (
                <View style={[styles.badge, styles.spicyBadge]}>
                  <Ionicons name="flame" size={14} color={COLORS.white} />
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Cultural Suggestion */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="globe" size={20} color={COLORS.secondary} />
            <Text style={styles.sectionTitle}>Cultural Suggestion</Text>
            <View style={styles.seasonBadge}>
              <Ionicons name="calendar-outline" size={14} color={COLORS.secondary} />
              <Text style={styles.seasonText}>{suggestion.culturalSuggestion.season}</Text>
            </View>
          </View>

          {/* Cultural Meal Card */}
          <View style={styles.culturalCard}>
            <Image
              source={{ uri: suggestion.culturalSuggestion.image }}
              style={styles.culturalImage}
              resizeMode="cover"
            />
            <View style={styles.culturalContent}>
              <Text style={styles.culturalName}>{suggestion.culturalSuggestion.name}</Text>
              <Text style={styles.culturalCategory}>{suggestion.culturalSuggestion.category}</Text>
              <Text style={styles.culturalDescription}>{suggestion.culturalSuggestion.description}</Text>
              
              {/* Reason */}
              <View style={styles.culturalReason}>
                <Ionicons name="information-circle-outline" size={18} color={COLORS.primary} />
                <Text style={styles.culturalReasonText}>{suggestion.culturalSuggestion.reason}</Text>
              </View>

              {/* Cultural Context */}
              <View style={styles.culturalContext}>
                <Ionicons name="people-outline" size={18} color={COLORS.secondary} />
                <Text style={styles.culturalContextText}>{suggestion.culturalSuggestion.culturalContext}</Text>
              </View>

              {/* Info Row */}
              <View style={styles.culturalInfoRow}>
                <View style={styles.culturalInfoItem}>
                  <Ionicons name="partly-sunny-outline" size={16} color={COLORS.text.secondary} />
                  <Text style={styles.culturalInfoText}>{suggestion.culturalSuggestion.weather}</Text>
                </View>
                <View style={styles.culturalInfoItem}>
                  <Ionicons name="cash-outline" size={16} color={COLORS.text.secondary} />
                  <Text style={styles.culturalInfoText}>PKR {suggestion.culturalSuggestion.estimatedPrice}</Text>
                </View>
                <View style={styles.culturalInfoItem}>
                  <Ionicons name="flame-outline" size={16} color={COLORS.error} />
                  <Text style={styles.culturalInfoText}>{suggestion.culturalSuggestion.nutritionalInfo.calories} cal</Text>
                </View>
              </View>

              {/* Nutritional Badges */}
              <View style={styles.nutritionalRow}>
                {suggestion.culturalSuggestion.nutritionalInfo.isVegetarian && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>VEG</Text>
                  </View>
                )}
                {suggestion.culturalSuggestion.nutritionalInfo.isVegan && (
                  <View style={[styles.badge, styles.veganBadge]}>
                    <Text style={styles.badgeText}>VEGAN</Text>
                  </View>
                )}
                {suggestion.culturalSuggestion.nutritionalInfo.isSpicy && (
                  <View style={[styles.badge, styles.spicyBadge]}>
                    <Ionicons name="flame" size={14} color={COLORS.white} />
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title="Today's Meal"
        subtitle={`${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}`}
        showBackButton
        onBackPress={() => router.back()}
        gradient={true}
        rightAction={
          <TouchableOpacity
            onPress={() => setShowPreferences(!showPreferences)}
            style={styles.filterButton}
          >
            <Ionicons name="options-outline" size={24} color={COLORS.white} />
          </TouchableOpacity>
        }
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Preferences Form */}
        {renderPreferences()}

        {/* Action Buttons */}
        {!showPreferences && (
          <View style={styles.actionBar}>
            <CustomButton
              title="Filter Preferences"
              onPress={() => setShowPreferences(true)}
              variant="outline"
              icon={<Ionicons name="options-outline" size={20} color={COLORS.primary} />}
              style={styles.filterPreferencesButton}
            />
            <CustomButton
              title="Refresh Suggestion"
              onPress={() => handleGetSuggestion()}
              variant="outline"
              icon={<Ionicons name="refresh-outline" size={20} color={COLORS.primary} />}
              style={styles.refreshButton}
            />
          </View>
        )}

        {/* Meal Suggestion */}
        {renderMealSuggestion()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING[6],
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING[8],
  },
  loadingText: {
    marginTop: SPACING[4],
    fontSize: FONTS.sizes.base,
    color: COLORS.text.secondary,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  preferencesContainer: {
    backgroundColor: COLORS.white,
    margin: SPACING[4],
    padding: SPACING[4],
    borderRadius: RADIUS.card,
    ...SHADOWS.sm,
  },
  preferencesTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: SPACING[4],
  },
  inputGroup: {
    marginBottom: SPACING[4],
  },
  label: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.text.secondary,
    marginBottom: SPACING[2],
  },
  input: {
    backgroundColor: COLORS.gray[50],
    borderRadius: RADIUS.input,
    paddingHorizontal: SPACING[4],
    paddingVertical: SPACING[3],
    fontSize: FONTS.sizes.base,
    color: COLORS.text.primary,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  getButton: {
    marginTop: SPACING[2],
  },
  actionBar: {
    paddingHorizontal: SPACING[4],
    paddingVertical: SPACING[3],
    flexDirection: 'row',
    gap: SPACING[3],
  },
  filterPreferencesButton: {
    flex: 1,
  },
  refreshButton: {
    flex: 1,
  },
  suggestionContainer: {
    paddingHorizontal: SPACING[4],
  },
  reasonCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.card,
    padding: SPACING[4],
    marginBottom: SPACING[4],
    ...SHADOWS.sm,
  },
  reasonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING[3],
    gap: SPACING[2],
  },
  reasonTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  reasonText: {
    fontSize: FONTS.sizes.base,
    color: COLORS.text.secondary,
    lineHeight: 22,
  },
  nutritionalCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.card,
    padding: SPACING[4],
    marginTop: SPACING[4],
    ...SHADOWS.sm,
  },
  nutritionalTitle: {
    fontSize: FONTS.sizes.base,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: SPACING[3],
  },
  nutritionalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING[3],
    flexWrap: 'wrap',
  },
  nutritionalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING[2],
  },
  nutritionalText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text.secondary,
    fontWeight: '600',
  },
  badge: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: SPACING[2],
    paddingVertical: SPACING[1],
    borderRadius: RADIUS.badge,
    alignItems: 'center',
    justifyContent: 'center',
  },
  veganBadge: {
    backgroundColor: COLORS.tertiary,
  },
  spicyBadge: {
    backgroundColor: COLORS.error,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: SPACING[6],
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING[3],
    gap: SPACING[2],
    paddingHorizontal: SPACING[4],
  },
  sectionTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
    color: COLORS.text.primary,
    flex: 1,
  },
  seasonBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondarySoft || COLORS.gray[100],
    paddingHorizontal: SPACING[2],
    paddingVertical: SPACING[1],
    borderRadius: RADIUS.badge,
    gap: SPACING[1],
  },
  seasonText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '600',
    color: COLORS.secondary,
  },
  culturalCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.card,
    marginHorizontal: SPACING[4],
    overflow: 'hidden',
    ...SHADOWS.sm,
  },
  culturalImage: {
    width: '100%',
    height: 200,
    backgroundColor: COLORS.gray[100],
  },
  culturalContent: {
    padding: SPACING[4],
  },
  culturalName: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: SPACING[1],
  },
  culturalCategory: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.secondary,
    fontWeight: '600',
    marginBottom: SPACING[2],
  },
  culturalDescription: {
    fontSize: FONTS.sizes.base,
    color: COLORS.text.secondary,
    lineHeight: 22,
    marginBottom: SPACING[3],
  },
  culturalReason: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.primarySoft || COLORS.gray[50],
    padding: SPACING[3],
    borderRadius: RADIUS.md,
    marginBottom: SPACING[3],
    gap: SPACING[2],
  },
  culturalReasonText: {
    flex: 1,
    fontSize: FONTS.sizes.sm,
    color: COLORS.text.secondary,
    lineHeight: 20,
  },
  culturalContext: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.secondarySoft || COLORS.gray[50],
    padding: SPACING[3],
    borderRadius: RADIUS.md,
    marginBottom: SPACING[3],
    gap: SPACING[2],
  },
  culturalContextText: {
    flex: 1,
    fontSize: FONTS.sizes.sm,
    color: COLORS.text.secondary,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  culturalInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING[3],
    paddingTop: SPACING[3],
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  culturalInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING[1],
  },
  culturalInfoText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text.secondary,
    fontWeight: '600',
  },
});

