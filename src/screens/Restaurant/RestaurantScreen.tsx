import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  StatusBar,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import FoodCard from '../../components/Food/FoodCard';
import { COLORS, FONTS, SPACING, RADIUS } from '../../constants/theme';
import { Restaurant, FoodItem } from '../../types';

const { height } = Dimensions.get('window');

// Mock restaurant data
const mockRestaurant: Restaurant = {
  id: '1',
  name: "Mario's Pizzeria",
  description: 'Authentic Italian cuisine with fresh ingredients and traditional recipes',
  image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b',
  rating: 4.8,
  reviews: 256,
  deliveryTime: '25-35 min',
  deliveryFee: 2.99,
  minimumOrder: 15,
  categories: ['Pizza', 'Italian', 'Pasta'],
  isOpen: true,
  distance: 1.2,
  coordinates: { latitude: 40.7128, longitude: -74.0060 },
};

const mockFoodItems: FoodItem[] = [
  {
    id: '1',
    name: 'Margherita Pizza',
    description: 'Classic Italian pizza with fresh mozzarella, tomato sauce, and basil',
    image: 'https://images.unsplash.com/photo-1565298507278-760aac2d3d0a',
    price: 12.99,
    originalPrice: 15.99,
    rating: 4.8,
    reviews: 124,
    category: 'Pizza',
    restaurantId: '1',
    restaurantName: "Mario's Pizzeria",
    ingredients: ['Mozzarella', 'Tomato Sauce', 'Basil', 'Olive Oil'],
    allergens: ['Gluten', 'Dairy'],
    isVegetarian: true,
    isVegan: false,
    isSpicy: false,
    preparationTime: 15,
    calories: 280,
  },
  {
    id: '2',
    name: 'Pepperoni Pizza',
    description: 'Traditional pizza with pepperoni, mozzarella cheese, and tomato sauce',
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e',
    price: 16.99,
    rating: 4.7,
    reviews: 98,
    category: 'Pizza',
    restaurantId: '1',
    restaurantName: "Mario's Pizzeria",
    ingredients: ['Pepperoni', 'Mozzarella', 'Tomato Sauce'],
    allergens: ['Gluten', 'Dairy'],
    isVegetarian: false,
    isVegan: false,
    isSpicy: false,
    preparationTime: 18,
    calories: 320,
  },
  {
    id: '3',
    name: 'Chicken Alfredo Pasta',
    description: 'Creamy pasta with grilled chicken and alfredo sauce',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5',
    price: 18.99,
    rating: 4.6,
    reviews: 76,
    category: 'Pasta',
    restaurantId: '1',
    restaurantName: "Mario's Pizzeria",
    ingredients: ['Pasta', 'Chicken', 'Alfredo Sauce', 'Parmesan'],
    allergens: ['Gluten', 'Dairy'],
    isVegetarian: false,
    isVegan: false,
    isSpicy: false,
    preparationTime: 20,
    calories: 450,
  },
];

const mockCategories = ['All', 'Pizza', 'Pasta', 'Salads', 'Drinks', 'Desserts'];

const RestaurantScreen = () => {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isFavorite, setIsFavorite] = useState(false);

  // Filter food items based on selected category
  const filteredFoodItems = selectedCategory === 'All' 
    ? mockFoodItems 
    : mockFoodItems.filter(item => item.category === selectedCategory);

  const CategoryTab = ({ category }: { category: string }) => (
    <TouchableOpacity
      style={[
        styles.categoryTab,
        selectedCategory === category && styles.categoryTabActive,
      ]}
      onPress={() => setSelectedCategory(category)}
    >
      <Text
        style={[
          styles.categoryTabText,
          selectedCategory === category && styles.categoryTabTextActive,
        ]}
      >
        {category}
      </Text>
    </TouchableOpacity>
  );

  const InfoItem = ({ icon, title, subtitle }: { 
    icon: keyof typeof Ionicons.glyphMap; 
    title: string; 
    subtitle: string; 
  }) => (
    <View style={styles.infoItem}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon} size={20} color={COLORS.primary} />
      </View>
      <View>
        <Text style={styles.infoTitle}>{title}</Text>
        <Text style={styles.infoSubtitle}>{subtitle}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="transparent" barStyle="light-content" translucent />
      
      {/* Header Image */}
      <View style={styles.headerContainer}>
        <Image
          source={{ uri: mockRestaurant.image }}
          style={styles.headerImage}
          resizeMode="cover"
        />
        
        {/* Header Overlay */}
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'transparent', 'rgba(0,0,0,0.7)']}
          style={styles.headerOverlay}
        />
        
        {/* Header Actions */}
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
          
          <View style={styles.headerRightActions}>
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="share-outline" size={22} color={COLORS.white} />
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
        </View>

        {/* Restaurant Status */}
        <View style={styles.restaurantStatus}>
          <View style={[
            styles.statusIndicator,
            { backgroundColor: mockRestaurant.isOpen ? COLORS.success : COLORS.error }
          ]} />
          <Text style={styles.statusText}>
            {mockRestaurant.isOpen ? 'Open Now' : 'Closed'}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Restaurant Info */}
        <View style={styles.restaurantInfo}>
          <Text style={styles.restaurantName}>{mockRestaurant.name}</Text>
          <Text style={styles.restaurantDescription}>{mockRestaurant.description}</Text>
          
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color={COLORS.rating} />
            <Text style={styles.ratingText}>{mockRestaurant.rating}</Text>
            <Text style={styles.reviewsText}>({mockRestaurant.reviews} reviews)</Text>
          </View>

          <View style={styles.categoriesContainer}>
            {mockRestaurant.categories.map((category, index) => (
              <View key={index} style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>{category}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Delivery Info */}
        <View style={styles.deliveryInfoContainer}>
          <InfoItem
            icon="time-outline"
            title="Delivery Time"
            subtitle={mockRestaurant.deliveryTime}
          />
          <InfoItem
            icon="bicycle-outline"
            title="Delivery Fee"
            subtitle={`$${mockRestaurant.deliveryFee}`}
          />
          <InfoItem
            icon="card-outline"
            title="Minimum Order"
            subtitle={`$${mockRestaurant.minimumOrder}`}
          />
        </View>

        {/* Menu Categories */}
        <View style={styles.menuSection}>
          <Text style={styles.menuTitle}>Menu</Text>
          
          <FlatList
            data={mockCategories}
            renderItem={({ item }) => <CategoryTab category={item} />}
            keyExtractor={(item) => item}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryTabs}
          />
        </View>

        {/* Food Items */}
        <View style={styles.foodItemsContainer}>
          {filteredFoodItems.map((item) => (
            <View key={item.id} style={styles.foodItemWrapper}>
              <FoodCard
                foodItem={item}
                onPress={() => console.log('Food pressed:', item.name)}
                onAddToCart={() => console.log('Add to cart:', item.name)}
                onToggleFavorite={() => console.log('Toggle favorite:', item.name)}
              />
            </View>
          ))}
        </View>
      </ScrollView>
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
    height: height * 0.3,
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
  headerRightActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  restaurantStatus: {
    position: 'absolute',
    bottom: SPACING.base,
    left: SPACING.base,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.lg,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SPACING.xs,
  },
  statusText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  content: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  restaurantInfo: {
    padding: SPACING.base,
    backgroundColor: COLORS.white,
  },
  restaurantName: {
    fontSize: FONTS.sizes['2xl'],
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  restaurantDescription: {
    fontSize: FONTS.sizes.base,
    color: COLORS.text.secondary,
    lineHeight: 22,
    marginBottom: SPACING.sm,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.base,
  },
  ratingText: {
    fontSize: FONTS.sizes.base,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginLeft: SPACING.xs,
  },
  reviewsText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text.secondary,
    marginLeft: SPACING.xs,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  categoryBadge: {
    backgroundColor: COLORS.primary + '20',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  categoryBadgeText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.primary,
    fontWeight: '600',
  },
  deliveryInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: SPACING.base,
    marginHorizontal: SPACING.base,
    backgroundColor: COLORS.gray[50],
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.base,
  },
  infoItem: {
    alignItems: 'center',
    flex: 1,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
  },
  infoTitle: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.text.primary,
    textAlign: 'center',
  },
  infoSubtitle: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginTop: 2,
  },
  menuSection: {
    paddingTop: SPACING.base,
  },
  menuTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    paddingHorizontal: SPACING.base,
    marginBottom: SPACING.base,
  },
  categoryTabs: {
    paddingHorizontal: SPACING.base,
    gap: SPACING.sm,
  },
  categoryTab: {
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.gray[100],
  },
  categoryTabActive: {
    backgroundColor: COLORS.primary,
  },
  categoryTabText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  categoryTabTextActive: {
    color: COLORS.white,
  },
  foodItemsContainer: {
    padding: SPACING.base,
  },
  foodItemWrapper: {
    marginBottom: SPACING.base,
  },
});

export default RestaurantScreen;