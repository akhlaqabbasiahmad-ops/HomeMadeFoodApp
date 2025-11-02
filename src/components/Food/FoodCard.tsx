import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    Animated,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { useAppDispatch, useAppSelector } from '../../store';
import { addToCart } from '../../store/cartSlice';
import { FoodItem } from '../../types';

interface FoodCardProps {
  foodItem: FoodItem;
  onPress: () => void;
  onAddToCart?: () => void;
  onToggleFavorite?: () => void;
  isFavorite?: boolean;
  showAddButton?: boolean;
  showQuantitySelector?: boolean;
}

const FoodCard: React.FC<FoodCardProps> = ({
  foodItem,
  onPress,
  onAddToCart,
  onToggleFavorite,
  isFavorite = false,
  showAddButton = true,
  showQuantitySelector = false,
}) => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const [animatedScale] = useState(new Animated.Value(1));
  
  // Get current quantity in cart
  const cartItem = cartItems.find(item => item.id === foodItem.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;
  const renderRating = () => (
    <View style={styles.ratingContainer}>
      <Ionicons name="star" size={14} color={COLORS.rating} />
      <Text style={styles.ratingText}>{foodItem.rating}</Text>
      <Text style={styles.reviewsText}>({foodItem.reviews})</Text>
    </View>
  );

  const renderBadges = () => (
    <View style={styles.badgesContainer}>
      {foodItem.isVegetarian && (
        <View style={[styles.badge, styles.vegetarianBadge]}>
          <Text style={styles.badgeText}>VEG</Text>
        </View>
      )}
      {foodItem.isVegan && (
        <View style={[styles.badge, styles.veganBadge]}>
          <Text style={styles.badgeText}>VEGAN</Text>
        </View>
      )}
      {foodItem.isSpicy && (
        <View style={[styles.badge, styles.spicyBadge]}>
          <Ionicons name="flame" size={10} color={COLORS.white} />
        </View>
      )}
    </View>
  );

  const handleAddToCart = () => {
    // Animation effect
    Animated.sequence([
      Animated.timing(animatedScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(animatedScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Add to cart via Redux
    dispatch(addToCart({ 
      foodItem, 
      quantity: 1,
      specialInstructions: undefined 
    }));
    
    // Call parent callback if provided
    if (onAddToCart) {
      onAddToCart();
    }
  };

  const renderPrice = () => {
    const price = foodItem.price ?? 0;
    const originalPrice = foodItem.originalPrice ?? 0;
    
    // Ensure price is a number
    const numericPrice = typeof price === 'number' ? price : parseFloat(price) || 0;
    const numericOriginalPrice = typeof originalPrice === 'number' ? originalPrice : parseFloat(originalPrice) || 0;
    
    return (
      <View style={styles.priceContainer}>
        <Text style={styles.price}>${numericPrice.toFixed(2)}</Text>
        {numericOriginalPrice > 0 && numericOriginalPrice > numericPrice && (
          <Text style={styles.originalPrice}>${numericOriginalPrice.toFixed(2)}</Text>
        )}
      </View>
    );
  };

  const renderQuantitySelector = () => {
    if (!showQuantitySelector || quantityInCart === 0) {
      return null;
    }

    return (
      <View style={styles.quantitySelector}>
        <TouchableOpacity 
          style={styles.quantityButton}
          onPress={() => {
            if (quantityInCart > 1) {
              dispatch(addToCart({ 
                foodItem, 
                quantity: -1,
                specialInstructions: undefined 
              }));
            }
          }}
        >
          <Ionicons name="remove" size={16} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.quantityText}>{quantityInCart}</Text>
        <TouchableOpacity 
          style={styles.quantityButton}
          onPress={() => {
            dispatch(addToCart({ 
              foodItem, 
              quantity: 1,
              specialInstructions: undefined 
            }));
          }}
        >
          <Ionicons name="add" size={16} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {/* Image Container */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: foodItem.image }}
          style={styles.image}
          resizeMode="cover"
        />
        
        {/* Favorite Button */}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={onToggleFavorite}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={20}
            color={isFavorite ? COLORS.error : COLORS.white}
          />
        </TouchableOpacity>

        {/* Preparation Time */}
        <View style={styles.preparationTimeContainer}>
          <Ionicons name="time-outline" size={12} color={COLORS.white} />
          <Text style={styles.preparationTimeText}>{foodItem.preparationTime}min</Text>
        </View>

        {/* Badges */}
        {renderBadges()}
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Restaurant Name */}
        <Text style={styles.restaurantName} numberOfLines={1}>
          {foodItem.restaurantName}
        </Text>

        {/* Food Name */}
        <Text style={styles.foodName} numberOfLines={1}>
          {foodItem.name}
        </Text>

        {/* Description */}
        <Text style={styles.description} numberOfLines={2}>
          {foodItem.description}
        </Text>

        {/* Rating */}
        {renderRating()}

        {/* Price and Add Button */}
        <View style={styles.bottomRow}>
          {renderPrice()}
          
          {/* Show quantity selector if item is in cart and option is enabled */}
          {showQuantitySelector && quantityInCart > 0 ? (
            renderQuantitySelector()
          ) : (
            showAddButton && (
              <Animated.View style={{ transform: [{ scale: animatedScale }] }}>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={handleAddToCart}
                >
                  <LinearGradient
                    colors={[COLORS.primary, COLORS.primaryDark]}
                    style={styles.addButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Ionicons name="add" size={18} color={COLORS.white} />
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            )
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS['2xl'],
    ...SHADOWS.card,
    marginVertical: SPACING.xs,
    marginHorizontal: SPACING.xs,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  imageContainer: {
    position: 'relative',
    height: 180,
    backgroundColor: COLORS.gray[50],
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: SPACING[3],
    right: SPACING[3],
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.sm,
  },
  preparationTimeContainer: {
    position: 'absolute',
    bottom: SPACING[3],
    left: SPACING[3],
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.black,
    paddingHorizontal: SPACING[2],
    paddingVertical: SPACING[1],
    borderRadius: RADIUS.chip,
    opacity: 0.9,
  },
  preparationTimeText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.xs,
    fontWeight: '600',
    marginLeft: 2,
  },
  badgesContainer: {
    position: 'absolute',
    top: SPACING[3],
    left: SPACING[3],
    flexDirection: 'row',
    gap: SPACING[1],
  },
  badge: {
    paddingHorizontal: SPACING[1.5],
    paddingVertical: SPACING[1],
    borderRadius: RADIUS.badge,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vegetarianBadge: {
    backgroundColor: COLORS.secondary,
  },
  veganBadge: {
    backgroundColor: COLORS.tertiary,
  },
  spicyBadge: {
    backgroundColor: COLORS.error,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 8,
    fontWeight: 'bold',
  },
  content: {
    padding: SPACING[4],
  },
  restaurantName: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.text.secondary,
    marginBottom: 2,
  },
  foodName: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: SPACING[1],
    lineHeight: 24,
  },
  description: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text.tertiary,
    lineHeight: 20,
    marginBottom: SPACING[3],
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING[3],
  },
  ratingText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginLeft: SPACING[1],
  },
  reviewsText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.text.tertiary,
    marginLeft: SPACING[1],
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  originalPrice: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text.tertiary,
    textDecorationLine: 'line-through',
    marginLeft: SPACING[2],
  },
  addButton: {
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    ...SHADOWS.button,
  },
  addButtonGradient: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray[100],
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING[1],
    paddingVertical: SPACING[1],
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.xs,
  },
  quantityText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.text.primary,
    paddingHorizontal: SPACING[2],
    minWidth: 30,
    textAlign: 'center',
  },
});

export default FoodCard;