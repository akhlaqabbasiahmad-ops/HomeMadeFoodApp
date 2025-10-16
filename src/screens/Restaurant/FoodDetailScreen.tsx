import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
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
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { useAppDispatch } from '../../store';
import { addToCart } from '../../store/cartSlice';
import { FoodItem } from '../../types';

const { height } = Dimensions.get('window');

// Mock food item data
const mockFoodItem: FoodItem = {
  id: '1',
  name: 'Margherita Pizza',
  description: 'A classic Italian pizza featuring fresh mozzarella cheese, ripe tomatoes, fresh basil leaves, and a drizzle of olive oil on a thin, crispy crust. Our dough is made fresh daily using traditional Italian methods.',
  image: 'https://images.unsplash.com/photo-1565298507278-760aac2d3d0a',
  price: 12.99,
  originalPrice: 15.99,
  rating: 4.8,
  reviews: 124,
  category: 'Pizza',
  restaurantId: '1',
  restaurantName: "Mario's Pizzeria",
  ingredients: ['Fresh Mozzarella', 'San Marzano Tomatoes', 'Fresh Basil', 'Extra Virgin Olive Oil', 'Italian Flour', 'Sea Salt'],
  allergens: ['Gluten', 'Dairy'],
  isVegetarian: true,
  isVegan: false,
  isSpicy: false,
  preparationTime: 15,
  calories: 280,
};

const mockReviews = [
  {
    id: '1',
    userName: 'John Doe',
    rating: 5,
    comment: 'Amazing pizza! The crust was perfect and the ingredients were so fresh.',
    date: '2 days ago',
  },
  {
    id: '2',
    userName: 'Sarah Smith',
    rating: 4,
    comment: 'Great taste, but took a bit longer than expected. Still worth it!',
    date: '1 week ago',
  },
];

const FoodDetailScreen = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedSize, setSelectedSize] = useState('Medium');
  const [specialInstructions, setSpecialInstructions] = useState('');

  const sizes = [
    { name: 'Small', price: 9.99 },
    { name: 'Medium', price: 12.99 },
    { name: 'Large', price: 15.99 },
  ];

  const handleAddToCart = () => {
    dispatch(addToCart({
      foodItem: {
        ...mockFoodItem,
        price: sizes.find(size => size.name === selectedSize)?.price || mockFoodItem.price,
      },
      quantity,
      specialInstructions,
    }));
    
    // Show success feedback and go back - user can use cart tab to view items
    // TODO: Add toast/alert for success feedback
    router.back();
  };

  const renderRating = () => (
    <View style={styles.ratingContainer}>
      <View style={styles.ratingStars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name="star"
            size={16}
            color={star <= Math.floor(mockFoodItem.rating) ? COLORS.rating : COLORS.gray[300]}
          />
        ))}
      </View>
      <Text style={styles.ratingText}>{mockFoodItem.rating}</Text>
      <Text style={styles.reviewsText}>({mockFoodItem.reviews} reviews)</Text>
    </View>
  );

  const renderBadges = () => (
    <View style={styles.badgesContainer}>
      {mockFoodItem.isVegetarian && (
        <View style={[styles.badge, styles.vegetarianBadge]}>
          <Ionicons name="leaf" size={12} color={COLORS.white} />
          <Text style={styles.badgeText}>Vegetarian</Text>
        </View>
      )}
      {mockFoodItem.calories && (
        <View style={[styles.badge, styles.calorieBadge]}>
          <Ionicons name="fitness" size={12} color={COLORS.white} />
          <Text style={styles.badgeText}>{mockFoodItem.calories} cal</Text>
        </View>
      )}
      <View style={[styles.badge, styles.timeBadge]}>
        <Ionicons name="time" size={12} color={COLORS.white} />
        <Text style={styles.badgeText}>{mockFoodItem.preparationTime} min</Text>
      </View>
    </View>
  );

  const SizeSelector = () => (
    <View style={styles.sizeSelector}>
      <Text style={styles.sectionTitle}>Size</Text>
      <View style={styles.sizeOptions}>
        {sizes.map((size) => (
          <TouchableOpacity
            key={size.name}
            style={[
              styles.sizeOption,
              selectedSize === size.name && styles.sizeOptionActive,
            ]}
            onPress={() => setSelectedSize(size.name)}
          >
            <Text
              style={[
                styles.sizeOptionText,
                selectedSize === size.name && styles.sizeOptionTextActive,
              ]}
            >
              {size.name}
            </Text>
            <Text
              style={[
                styles.sizeOptionPrice,
                selectedSize === size.name && styles.sizeOptionPriceActive,
              ]}
            >
              ${size.price}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const QuantitySelector = () => (
    <View style={styles.quantitySelector}>
      <Text style={styles.sectionTitle}>Quantity</Text>
      <View style={styles.quantityControls}>
        <TouchableOpacity
          style={[styles.quantityButton, quantity <= 1 && styles.quantityButtonDisabled]}
          onPress={() => setQuantity(Math.max(1, quantity - 1))}
          disabled={quantity <= 1}
        >
          <Ionicons name="remove" size={20} color={quantity <= 1 ? COLORS.gray[400] : COLORS.primary} />
        </TouchableOpacity>
        
        <Text style={styles.quantityText}>{quantity}</Text>
        
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => setQuantity(quantity + 1)}
        >
          <Ionicons name="add" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const ReviewItem = ({ review }: { review: any }) => (
    <View style={styles.reviewItem}>
      <View style={styles.reviewHeader}>
        <View style={styles.reviewUserInfo}>
          <View style={styles.reviewAvatar}>
            <Ionicons name="person" size={20} color={COLORS.gray[500]} />
          </View>
          <View>
            <Text style={styles.reviewUserName}>{review.userName}</Text>
            <Text style={styles.reviewDate}>{review.date}</Text>
          </View>
        </View>
        <View style={styles.reviewRating}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Ionicons
              key={star}
              name="star"
              size={12}
              color={star <= review.rating ? COLORS.rating : COLORS.gray[300]}
            />
          ))}
        </View>
      </View>
      <Text style={styles.reviewComment}>{review.comment}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="transparent" barStyle="light-content" translucent />
      
      {/* Header Image */}
      <View style={styles.headerContainer}>
        <Image
          source={{ uri: mockFoodItem.image }}
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
            <Ionicons name="chevron-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => setIsFavorite(!isFavorite)}
          >
            <Ionicons 
              name={isFavorite ? 'heart' : 'heart-outline'} 
              size={22} 
              color={isFavorite ? COLORS.error : COLORS.white} 
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
              <Text style={styles.foodName}>{mockFoodItem.name}</Text>
              <Text style={styles.restaurantName}>{mockFoodItem.restaurantName}</Text>
            </View>
            
            <View style={styles.priceContainer}>
              <Text style={styles.price}>
                ${sizes.find(size => size.name === selectedSize)?.price || mockFoodItem.price}
              </Text>
              {mockFoodItem.originalPrice && (
                <Text style={styles.originalPrice}>${mockFoodItem.originalPrice}</Text>
              )}
            </View>
          </View>

          {renderRating()}
          
          <Text style={styles.description}>{mockFoodItem.description}</Text>
        </View>

        {/* Size Selection */}
        <SizeSelector />

        {/* Ingredients */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          <View style={styles.ingredientsList}>
            {mockFoodItem.ingredients.map((ingredient, index) => (
              <View key={index} style={styles.ingredientItem}>
                <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
                <Text style={styles.ingredientText}>{ingredient}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Allergens */}
        {mockFoodItem.allergens.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Allergen Information</Text>
            <View style={styles.allergensList}>
              {mockFoodItem.allergens.map((allergen, index) => (
                <View key={index} style={styles.allergenItem}>
                  <Text style={styles.allergenText}>{allergen}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Quantity Selection */}
        <QuantitySelector />

        {/* Special Instructions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Special Instructions</Text>
          <TextInput
            style={styles.instructionsInput}
            placeholder="Any special requests? (e.g., extra cheese, no onions, etc.)"
            placeholderTextColor={COLORS.gray[400]}
            value={specialInstructions}
            onChangeText={setSpecialInstructions}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* Reviews */}
        <View style={styles.section}>
          <View style={styles.reviewsHeader}>
            <Text style={styles.sectionTitle}>Reviews</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {mockReviews.slice(0, 2).map((review) => (
            <ReviewItem key={review.id} review={review} />
          ))}
        </View>
      </ScrollView>

      {/* Add to Cart Button */}
      <View style={styles.bottomContainer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalPrice}>
            ${((sizes.find(size => size.name === selectedSize)?.price || mockFoodItem.price) * quantity).toFixed(2)}
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
    backgroundColor: COLORS.white,
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
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.sm,
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
    bottom: SPACING.base,
    left: SPACING.base,
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.lg,
    gap: 4,
  },
  vegetarianBadge: {
    backgroundColor: COLORS.success,
  },
  calorieBadge: {
    backgroundColor: COLORS.info,
  },
  timeBadge: {
    backgroundColor: COLORS.warning,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.xs,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  foodInfo: {
    padding: SPACING.base,
  },
  foodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  foodTitleContainer: {
    flex: 1,
    marginRight: SPACING.base,
  },
  foodName: {
    fontSize: FONTS.sizes['2xl'],
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  restaurantName: {
    fontSize: FONTS.sizes.base,
    color: COLORS.text.secondary,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  originalPrice: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text.secondary,
    textDecorationLine: 'line-through',
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.base,
  },
  ratingStars: {
    flexDirection: 'row',
    marginRight: SPACING.xs,
  },
  ratingText: {
    fontSize: FONTS.sizes.base,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginRight: SPACING.xs,
  },
  reviewsText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text.secondary,
  },
  description: {
    fontSize: FONTS.sizes.base,
    color: COLORS.text.secondary,
    lineHeight: 24,
  },
  section: {
    padding: SPACING.base,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: SPACING.base,
  },
  sizeSelector: {
    padding: SPACING.base,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
  },
  sizeOptions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  sizeOption: {
    flex: 1,
    padding: SPACING.base,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.gray[300],
    alignItems: 'center',
  },
  sizeOptionActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  sizeOptionText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  sizeOptionTextActive: {
    color: COLORS.primary,
  },
  sizeOptionPrice: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text.secondary,
  },
  sizeOptionPriceActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  ingredientsList: {
    gap: SPACING.sm,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  ingredientText: {
    fontSize: FONTS.sizes.base,
    color: COLORS.text.primary,
  },
  allergensList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  allergenItem: {
    backgroundColor: COLORS.error + '20',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  allergenText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.error,
    fontWeight: '600',
  },
  quantitySelector: {
    padding: SPACING.base,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.base,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  quantityButtonDisabled: {
    borderColor: COLORS.gray[300],
    backgroundColor: COLORS.gray[50],
  },
  quantityText: {
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    minWidth: 40,
    textAlign: 'center',
  },
  instructionsInput: {
    borderWidth: 1,
    borderColor: COLORS.gray[300],
    borderRadius: RADIUS.lg,
    padding: SPACING.base,
    fontSize: FONTS.sizes.base,
    color: COLORS.text.primary,
    minHeight: 80,
    backgroundColor: COLORS.gray[50],
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.base,
  },
  seeAllText: {
    fontSize: FONTS.sizes.base,
    color: COLORS.primary,
    fontWeight: '600',
  },
  reviewItem: {
    marginBottom: SPACING.base,
    padding: SPACING.base,
    backgroundColor: COLORS.gray[50],
    borderRadius: RADIUS.lg,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  reviewUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  reviewAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.gray[200],
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewUserName: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  reviewDate: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.text.secondary,
  },
  reviewRating: {
    flexDirection: 'row',
  },
  reviewComment: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text.secondary,
    lineHeight: 18,
  },
  bottomContainer: {
    padding: SPACING.base,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
    ...SHADOWS.lg,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.base,
  },
  totalLabel: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  totalPrice: {
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  addToCartButton: {
    width: '100%',
  },
});

export default FoodDetailScreen;