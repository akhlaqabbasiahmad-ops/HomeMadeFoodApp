import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import CustomButton from '../../components/common/CustomButton';
import { FONTS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { useColors, useTheme } from '../../contexts/ThemeContext';
import { apiService } from '../../services/apiService';
import { useAppDispatch } from '../../store';
import { addToCart } from '../../store/cartSlice';
import { FoodItem } from '../../types';

const { height } = Dimensions.get('window');

const FoodDetailScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { theme } = useTheme();
  const colors = useColors();
  
  const [foodItem, setFoodItem] = useState<FoodItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Fetch food item data from API
  useEffect(() => {
    const fetchFoodItem = async () => {
      if (!id) {
        setError('Food item ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await apiService.getFoodItemById(id);
        
        if (response.success && response.data) {
          setFoodItem(response.data);
        } else {
          setError(response.error || 'Failed to load food item');
        }
      } catch (err) {
        console.error('Error fetching food item:', err);
        setError('Failed to load food item. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchFoodItem();
  }, [id]);

  const handleAddToCart = () => {
    if (!foodItem) return;

    dispatch(addToCart({
      foodItem,
      quantity,
      specialInstructions,
    }));
    
    router.back();
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar backgroundColor="transparent" barStyle="light-content" translucent />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text.primary }]}>
            Loading food details...
          </Text>
        </View>
      </View>
    );
  }

  if (error || !foodItem) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar backgroundColor="transparent" barStyle="light-content" translucent />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={colors.error} />
          <Text style={[styles.errorTitle, { color: colors.text.primary }]}>
            Oops! Something went wrong
          </Text>
          <Text style={[styles.errorMessage, { color: colors.text.secondary }]}>
            {error || 'Food item not found'}
          </Text>
          <TouchableOpacity 
            style={[styles.retryButton, { backgroundColor: colors.primary }]}
            onPress={() => router.back()}
          >
            <Text style={[styles.retryButtonText, { color: colors.white }]}>
              Go Back
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const renderRating = () => (
    <View style={styles.ratingContainer}>
      <View style={styles.ratingStars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name="star"
            size={16}
            color={star <= Math.floor(foodItem.rating || 0) ? colors.rating : colors.border}
          />
        ))}
      </View>
      <Text style={[styles.ratingText, { color: colors.text.primary }]}>
        {foodItem.rating || 0}
      </Text>
      <Text style={[styles.reviewsText, { color: colors.text.secondary }]}>
        ({foodItem.reviews || 0} reviews)
      </Text>
    </View>
  );

  const renderBadges = () => (
    <View style={styles.badgesContainer}>
      {foodItem.isVegetarian && (
        <View style={[styles.badge, { backgroundColor: colors.success }]}>
          <Ionicons name="leaf" size={12} color={colors.white} />
          <Text style={styles.badgeText}>Vegetarian</Text>
        </View>
      )}
      {foodItem.isVegan && (
        <View style={[styles.badge, { backgroundColor: colors.secondary }]}>
          <Ionicons name="leaf" size={12} color={colors.white} />
          <Text style={styles.badgeText}>Vegan</Text>
        </View>
      )}
      {foodItem.isSpicy && (
        <View style={[styles.badge, { backgroundColor: colors.error }]}>
          <Ionicons name="flame" size={12} color={colors.white} />
          <Text style={styles.badgeText}>Spicy</Text>
        </View>
      )}
      {foodItem.calories && (
        <View style={[styles.badge, { backgroundColor: colors.info }]}>
          <Ionicons name="fitness" size={12} color={colors.white} />
          <Text style={styles.badgeText}>{foodItem.calories} cal</Text>
        </View>
      )}
      <View style={[styles.badge, { backgroundColor: colors.warning }]}>
        <Ionicons name="time" size={12} color={colors.white} />
        <Text style={styles.badgeText}>{foodItem.preparationTime} min</Text>
      </View>
    </View>
  );


  const QuantitySelector = () => (
    <View style={styles.quantitySelector}>
      <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Quantity</Text>
      <View style={styles.quantityControls}>
        <TouchableOpacity
          style={[styles.quantityButton, quantity <= 1 && styles.quantityButtonDisabled]}
          onPress={() => setQuantity(Math.max(1, quantity - 1))}
          disabled={quantity <= 1}
        >
          <Ionicons name="remove" size={20} color={quantity <= 1 ? colors.border : colors.primary} />
        </TouchableOpacity>
        
        <Text style={[styles.quantityText, { color: colors.text.primary }]}>{quantity}</Text>
        
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => setQuantity(quantity + 1)}
        >
          <Ionicons name="add" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );


  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar backgroundColor="transparent" barStyle="light-content" translucent />
      
      {/* Header Image */}
      <View style={styles.headerContainer}>
        <Image
          source={{ uri: foodItem.image }}
          style={styles.headerImage}
          resizeMode="cover"
        />
        
        {/* Header Overlay */}
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'transparent', 'rgba(0,0,0,0.5)']}
          style={styles.headerOverlay}
        />
        
        {/* Header Actions */}
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color={colors.white} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => setIsFavorite(!isFavorite)}
          >
            <Ionicons 
              name={isFavorite ? 'heart' : 'heart-outline'} 
              size={22} 
              color={isFavorite ? colors.error : colors.white} 
            />
          </TouchableOpacity>
        </View>

        {/* Badges */}
        {renderBadges()}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Food Info */}
        <View style={styles.foodInfo}>
          <View style={styles.foodHeader}>
            <View style={styles.foodTitleContainer}>
              <Text style={[styles.foodName, { color: colors.text.primary }]}>{foodItem.name}</Text>
              <Text style={[styles.restaurantName, { color: colors.text.secondary }]}>{foodItem.restaurantName}</Text>
            </View>
            
            <View style={styles.priceContainer}>
              <Text style={[styles.price, { color: colors.primary }]}>
                ${foodItem.price}
              </Text>
              {foodItem.originalPrice && (
                <Text style={[styles.originalPrice, { color: colors.text.secondary }]}>
                  ${foodItem.originalPrice}
                </Text>
              )}
            </View>
          </View>

          {renderRating()}
          
          <Text style={[styles.description, { color: colors.text.secondary }]}>{foodItem.description}</Text>
        </View>

        {/* Ingredients */}
        {foodItem.ingredients && foodItem.ingredients.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Ingredients</Text>
            <View style={styles.ingredientsList}>
              {foodItem.ingredients.map((ingredient, index) => (
                <View key={index} style={styles.ingredientItem}>
                  <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                  <Text style={[styles.ingredientText, { color: colors.text.primary }]}>{ingredient}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Allergens */}
        {foodItem.allergens && foodItem.allergens.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Allergen Information</Text>
            <View style={styles.allergensList}>
              {foodItem.allergens.map((allergen, index) => (
                <View key={index} style={[styles.allergenItem, { backgroundColor: colors.error + '20' }]}>
                  <Text style={[styles.allergenText, { color: colors.error }]}>{allergen}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Quantity Selection */}
        <QuantitySelector />

        {/* Special Instructions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Special Instructions</Text>
          <TextInput
            style={[styles.instructionsInput, { 
              borderColor: colors.border,
              backgroundColor: colors.card,
              color: colors.text.primary
            }]}
            placeholder="Any special requests? (e.g., extra cheese, no onions, etc.)"
            placeholderTextColor={colors.text.tertiary}
            value={specialInstructions}
            onChangeText={setSpecialInstructions}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>
      </ScrollView>

      {/* Add to Cart Button */}
      <View style={[styles.bottomContainer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <View style={styles.totalContainer}>
          <Text style={[styles.totalLabel, { color: colors.text.primary }]}>Total</Text>
          <Text style={[styles.totalPrice, { color: colors.primary }]}>
            ${(foodItem.price * quantity).toFixed(2)}
          </Text>
        </View>
        
        <CustomButton
          title={`Add ${quantity} to Cart`}
          onPress={handleAddToCart}
          style={styles.addToCartButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING[4],
  },
  loadingText: {
    marginTop: SPACING[2],
    fontSize: FONTS.sizes.base,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING[4],
  },
  errorTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
    marginTop: SPACING[2],
    marginBottom: SPACING[1],
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: FONTS.sizes.base,
    textAlign: 'center',
    marginBottom: SPACING[4],
    lineHeight: 24,
  },
  retryButton: {
    paddingHorizontal: SPACING[4],
    paddingVertical: SPACING[2],
    borderRadius: RADIUS.lg,
  },
  retryButtonText: {
    fontSize: FONTS.sizes.base,
    fontWeight: '600',
  },
  headerContainer: {
    position: 'relative',
    height: height * 0.4,
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  headerActions: {
    position: 'absolute',
    top: StatusBar.currentHeight || 44,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING[4],
    paddingTop: SPACING[2],
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgesContainer: {
    position: 'absolute',
    bottom: SPACING[4],
    left: SPACING[4],
    flexDirection: 'row',
    gap: SPACING[1],
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING[2],
    paddingVertical: 4,
    borderRadius: RADIUS.lg,
    gap: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: FONTS.sizes.xs,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  foodInfo: {
    padding: SPACING[4],
  },
  foodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING[2],
  },
  foodTitleContainer: {
    flex: 1,
    marginRight: SPACING[4],
  },
  foodName: {
    fontSize: FONTS.sizes['2xl'],
    fontWeight: 'bold',
    marginBottom: 4,
  },
  restaurantName: {
    fontSize: FONTS.sizes.base,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold',
  },
  originalPrice: {
    fontSize: FONTS.sizes.sm,
    textDecorationLine: 'line-through',
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING[4],
  },
  ratingStars: {
    flexDirection: 'row',
    marginRight: SPACING[1],
  },
  ratingText: {
    fontSize: FONTS.sizes.base,
    fontWeight: '600',
    marginRight: SPACING[1],
  },
  reviewsText: {
    fontSize: FONTS.sizes.sm,
  },
  description: {
    fontSize: FONTS.sizes.base,
    lineHeight: 24,
  },
  section: {
    padding: SPACING[4],
    borderTopWidth: 1,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
    marginBottom: SPACING[4],
  },
  ingredientsList: {
    gap: SPACING[2],
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING[2],
  },
  ingredientText: {
    fontSize: FONTS.sizes.base,
  },
  allergensList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING[1],
  },
  allergenItem: {
    paddingHorizontal: SPACING[2],
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  allergenText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '600',
  },
  quantitySelector: {
    padding: SPACING[4],
    borderTopWidth: 1,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING[4],
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  quantityButtonDisabled: {
    borderColor: '#D1D5DB',
    backgroundColor: '#F9FAFB',
  },
  quantityText: {
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold',
    minWidth: 40,
    textAlign: 'center',
  },
  instructionsInput: {
    borderWidth: 1,
    borderRadius: RADIUS.lg,
    padding: SPACING[4],
    fontSize: FONTS.sizes.base,
    minHeight: 80,
  },
  bottomContainer: {
    padding: SPACING[4],
    borderTopWidth: 1,
    ...SHADOWS.lg,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING[4],
  },
  totalLabel: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '600',
  },
  totalPrice: {
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold',
  },
  addToCartButton: {
    width: '100%',
  },
});

export default FoodDetailScreen;