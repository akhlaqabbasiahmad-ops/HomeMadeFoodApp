import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import FoodCard from '../../components/Food/FoodCard';
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { apiService } from '../../services/apiService';
import { useAppSelector } from '../../store';
import { Category, FoodItem, Restaurant } from '../../types';

const { width } = Dimensions.get('window');

// Mock data - in real app, this would come from API
const mockCategories: Category[] = [
  { id: '1', name: 'Pizza', image: 'https://images.unsplash.com/photo-1565298507278-760aac2d3d0a', icon: 'pizza' },
  { id: '2', name: 'Burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd', icon: 'fast-food' },
  { id: '3', name: 'Sushi', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c', icon: 'fish' },
  { id: '4', name: 'Desserts', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307', icon: 'ice-cream' },
  { id: '5', name: 'Salads', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd', icon: 'leaf' },
];

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
    name: 'Beef Burger Deluxe',
    description: 'Juicy beef patty with lettuce, tomato, cheese, and special sauce',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd',
    price: 14.50,
    rating: 4.6,
    reviews: 89,
    category: 'Burgers',
    restaurantId: '2',
    restaurantName: 'Burger House',
    ingredients: ['Beef Patty', 'Lettuce', 'Tomato', 'Cheese', 'Special Sauce'],
    allergens: ['Gluten', 'Dairy'],
    isVegetarian: false,
    isVegan: false,
    isSpicy: false,
    preparationTime: 12,
    calories: 520,
  },
];

const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: "Mario's Pizzeria",
    description: 'Authentic Italian cuisine',
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b',
    rating: 4.8,
    reviews: 256,
    deliveryTime: '25-35 min',
    deliveryFee: 2.99,
    minimumOrder: 15,
    categories: ['Pizza', 'Italian'],
    isOpen: true,
    distance: 1.2,
    coordinates: { latitude: 40.7128, longitude: -74.0060 },
  },
];

const HomeScreen = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const user = useAppSelector((state) => state.auth.user);
  
  // API data state
  const [foodItems, setFoodItems] = useState<FoodItem[]>(mockFoodItems); // Start with mock as fallback
  const [categories, setCategories] = useState<Category[]>(mockCategories); // Start with mock as fallback
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log('🔄 Starting API data fetch...');
        
        // Fetch food items
        console.log('📡 Fetching food items from API...');
        const foodResponse = await apiService.getFoodItems();
        console.log('🍔 Food API Response:', {
          success: foodResponse.success,
          itemCount: foodResponse.data?.items?.length || 0,
          error: foodResponse.error
        });
        
        if (foodResponse.success && foodResponse.data.items && foodResponse.data.items.length > 0) {
          console.log('✅ Successfully loaded food items from API:', foodResponse.data.items.length);
          setFoodItems(foodResponse.data.items);
        } else {
          console.log('⚠️ API returned no food items, using mock data');
          console.log('API failed, using mock data:', foodResponse.error || 'No data received');
        }
        
        // Fetch categories
        console.log('📡 Fetching categories from API...');
        const categoriesResponse = await apiService.getCategories();
        console.log('📂 Categories API Response:', {
          success: categoriesResponse.success,
          categoryCount: categoriesResponse.data?.length || 0,
          error: categoriesResponse.error
        });
        
        if (categoriesResponse.success && categoriesResponse.data && categoriesResponse.data.length > 0) {
          console.log('✅ Successfully loaded categories from API:', categoriesResponse.data.length);
          // Map the API category format to our expected format
          const mappedCategories: Category[] = categoriesResponse.data.map((cat: any) => ({
            id: cat.id,
            name: cat.name,
            image: `https://images.unsplash.com/photo-1565298507278-760aac2d3d0a?w=300&h=200&fit=crop`, // Fallback image
            icon: cat.icon || 'restaurant',
          }));
          setCategories(mappedCategories);
        } else {
          console.log('⚠️ API returned no categories, using mock data');
        }
      } catch (err) {
        console.error('❌ Error fetching data from API:', err);
        setError('Failed to load data. Using cached data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle search input changes
  const handleSearchChange = (text: string) => {
    console.log('Search query changed:', text);
    setSearchQuery(text);
  };

  // Filter food items based on search query and selected category
  const filteredFoodItems = foodItems.filter(item => {
    const matchesSearch = searchQuery === '' || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.restaurantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === null || 
      item.category === categories.find(cat => cat.id === selectedCategory)?.name;
    
    return matchesSearch && matchesCategory;
  });

  // Log filtered results for debugging
  console.log(`Search: "${searchQuery}", Category: ${selectedCategory}, Results: ${filteredFoodItems.length}/${foodItems.length}`);

  const CategoryCard = ({ category }: { category: Category }) => (
    <TouchableOpacity
      style={[
        styles.categoryCard,
        selectedCategory === category.id && styles.categoryCardActive,
      ]}
      onPress={() => setSelectedCategory(
        selectedCategory === category.id ? null : category.id
      )}
    >
      <LinearGradient
        colors={
          selectedCategory === category.id
            ? [COLORS.primary, COLORS.primaryLight]
            : [COLORS.gray[100], COLORS.gray[50]]
        }
        style={styles.categoryCardGradient}
      >
        <Ionicons
          name={category.icon as any}
          size={24}
          color={selectedCategory === category.id ? COLORS.white : COLORS.primary}
        />
        <Text
          style={[
            styles.categoryText,
            selectedCategory === category.id && styles.categoryTextActive,
          ]}
        >
          {category.name}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const RestaurantCard = ({ restaurant }: { restaurant: Restaurant }) => (
    <TouchableOpacity style={styles.restaurantCard}>
      <View style={styles.restaurantImageContainer}>
        <View style={styles.restaurantImagePlaceholder}>
          <Ionicons name="restaurant" size={32} color={COLORS.gray[400]} />
        </View>
        <View style={styles.restaurantStatus}>
          <View style={[
            styles.statusIndicator,
            { backgroundColor: restaurant.isOpen ? COLORS.success : COLORS.error }
          ]} />
          <Text style={styles.statusText}>
            {restaurant.isOpen ? 'Open' : 'Closed'}
          </Text>
        </View>
      </View>
      
      <View style={styles.restaurantContent}>
        <Text style={styles.restaurantName} numberOfLines={1}>
          {restaurant.name}
        </Text>
        <Text style={styles.restaurantDescription} numberOfLines={1}>
          {restaurant.description}
        </Text>
        
        <View style={styles.restaurantInfo}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color={COLORS.rating} />
            <Text style={styles.ratingText}>{restaurant.rating}</Text>
          </View>
          
          <View style={styles.deliveryInfo}>
            <Ionicons name="time-outline" size={14} color={COLORS.gray[500]} />
            <Text style={styles.deliveryText}>{restaurant.deliveryTime}</Text>
          </View>
          
          <View style={styles.deliveryInfo}>
            <Ionicons name="bicycle-outline" size={14} color={COLORS.gray[500]} />
            <Text style={styles.deliveryText}>${restaurant.deliveryFee}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      
      {/* Loading Overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading fresh food data...</Text>
        </View>
      )}
      
      {/* Error Message */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Debug Info - Temporary */}
      <View style={styles.debugContainer}>
        <Text style={styles.debugText}>
          📊 Data: {foodItems.length} foods, {categories.length} categories | 
          🔗 API: {(apiService as any).baseURL?.includes('192.168') ? 'Network IP' : 'localhost'} | 
          🌐 Mode: {__DEV__ ? 'DEV' : 'PROD'}
        </Text>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryLight]}
          style={styles.header}
        >
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.welcomeText}>Good Morning!</Text>
              <Text style={styles.userNameText}>
                {user?.name || 'Food Lover'}
              </Text>
            </View>
            
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerButton}>
                <Ionicons name="notifications-outline" size={24} color={COLORS.white} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton}>
                <Ionicons name="person-circle-outline" size={28} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.headerSubtitle}>What would you like to eat today?</Text>
        </LinearGradient>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={20} color={COLORS.gray[500]} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for food, restaurants..."
              placeholderTextColor={COLORS.gray[400]}
              value={searchQuery}
              onChangeText={handleSearchChange}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => handleSearchChange('')}>
                <Ionicons name="close-circle" size={20} color={COLORS.gray[500]} />
              </TouchableOpacity>
            )}
          </View>
          
          <TouchableOpacity style={styles.filterButton}>
            <LinearGradient
              colors={[COLORS.primary, COLORS.primaryDark]}
              style={styles.filterButtonGradient}
            >
              <Ionicons name="options-outline" size={20} color={COLORS.white} />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Pre-Order Notice */}
        <View style={styles.noticeContainer}>
          <LinearGradient
            colors={[COLORS.accent, COLORS.accentDark]}
            style={styles.noticeGradient}
          >
            <View style={styles.noticeIconContainer}>
              <Ionicons name="time-outline" size={24} color={COLORS.white} />
            </View>
            <View style={styles.noticeContent}>
              <Text style={styles.noticeTitle}>Pre-Order Required</Text>
              <Text style={styles.noticeText}>
                We provide fresh homemade food only on pre-orders. 
                Please place your order at least 2 hours in advance for us to prepare your delicious meal!
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <FlatList
            data={categories}
            renderItem={({ item }) => <CategoryCard category={item} />}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        {/* Featured Food */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Food</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={filteredFoodItems}
            renderItem={({ item }) => (
              <View style={styles.foodCardContainer}>
                <FoodCard
                  foodItem={item}
                  onPress={() => router.push({
                    pathname: '/food-detail',
                    params: { foodItem: JSON.stringify(item) }
                  })}
                  onAddToCart={() => console.log('Add to cart:', item.name)}
                  onToggleFavorite={() => console.log('Toggle favorite:', item.name)}
                  showQuantitySelector={true}
                  isFavorite={false} // In real app, get from favorites state
                />
              </View>
            )}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.foodList}
          />
        </View>

        {/* Nearby Restaurants */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nearby Restaurants</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {mockRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.base,
    paddingBottom: SPACING.xl,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.base,
  },
  welcomeText: {
    fontSize: FONTS.sizes.base,
    color: COLORS.white,
    opacity: 0.9,
  },
  userNameText: {
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold',
    color: COLORS.white,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSubtitle: {
    fontSize: FONTS.sizes.base,
    color: COLORS.white,
    opacity: 0.9,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.base,
    marginTop: -SPACING.lg,
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    paddingHorizontal: SPACING.base,
    height: 50,
    ...SHADOWS.base,
    gap: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FONTS.sizes.base,
    color: COLORS.text.primary,
  },
  filterButton: {
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    ...SHADOWS.base,
  },
  filterButtonGradient: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.base,
    marginBottom: SPACING.base,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  seeAllText: {
    fontSize: FONTS.sizes.base,
    color: COLORS.primary,
    fontWeight: '600',
  },
  categoriesList: {
    paddingHorizontal: SPACING.base,
    gap: SPACING.sm,
  },
  categoryCard: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.sm,
  },
  categoryCardActive: {
    ...SHADOWS.base,
  },
  categoryCardGradient: {
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    minWidth: 80,
    gap: 4,
  },
  categoryText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  categoryTextActive: {
    color: COLORS.white,
  },
  foodList: {
    paddingHorizontal: SPACING.base,
    gap: SPACING.sm,
  },
  foodCardContainer: {
    width: width * 0.75,
  },
  restaurantCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    marginHorizontal: SPACING.base,
    marginBottom: SPACING.sm,
    ...SHADOWS.sm,
    overflow: 'hidden',
  },
  restaurantImageContainer: {
    position: 'relative',
    width: 100,
    height: 100,
  },
  restaurantImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  restaurantStatus: {
    position: 'absolute',
    top: SPACING.xs,
    left: SPACING.xs,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
  },
  statusIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  restaurantContent: {
    flex: 1,
    padding: SPACING.sm,
    justifyContent: 'space-between',
  },
  restaurantName: {
    fontSize: FONTS.sizes.base,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  restaurantDescription: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  restaurantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  deliveryText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.text.secondary,
  },
  noticeContainer: {
    marginHorizontal: SPACING.base,
    marginBottom: SPACING.lg,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.md,
  },
  noticeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.base,
    gap: SPACING.sm,
  },
  noticeIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: RADIUS.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noticeContent: {
    flex: 1,
  },
  noticeTitle: {
    fontSize: FONTS.sizes.base,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
  },
  noticeText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.white,
    opacity: 0.9,
    lineHeight: 20,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 12,
    fontSize: FONTS.sizes.base,
    color: COLORS.primary,
    fontWeight: '500',
  },
  errorContainer: {
    backgroundColor: COLORS.error + '20',
    margin: 16,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.error,
  },
  errorText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.error,
    fontWeight: '500',
  },
  debugContainer: {
    marginHorizontal: 16,
    marginTop: 8,
    padding: 12,
    backgroundColor: '#e3f2fd',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#42a5f5',
  },
  debugText: {
    color: '#1565c0',
    fontSize: 11,
    textAlign: 'center',
    fontFamily: 'monospace',
  },
});

export default HomeScreen;