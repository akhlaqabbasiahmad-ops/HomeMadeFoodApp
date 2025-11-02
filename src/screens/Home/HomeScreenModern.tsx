import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    FlatList,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import FoodCard from '../../components/Food/FoodCard';
import { FONTS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { useColors, useTheme } from '../../contexts/ThemeContext';
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
  const { theme, toggleTheme } = useTheme();
  const colors = useColors();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const user = useAppSelector((state) => state.auth.user);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  
  // API data state
  const [foodItems, setFoodItems] = useState<FoodItem[]>(mockFoodItems);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Animate on mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch food items
        const foodResponse = await apiService.getFoodItems();
        if (foodResponse.success && foodResponse.data.items && foodResponse.data.items.length > 0) {
          setFoodItems(foodResponse.data.items);
        }
        
        // Fetch categories
        const categoriesResponse = await apiService.getCategories();
        if (categoriesResponse.success && categoriesResponse.data && categoriesResponse.data.length > 0) {
          const mappedCategories: Category[] = categoriesResponse.data.map((cat: any) => ({
            id: cat.id,
            name: cat.name,
            image: `https://images.unsplash.com/photo-1565298507278-760aac2d3d0a?w=300&h=200&fit=crop`,
            icon: cat.icon || 'restaurant',
          }));
          setCategories(mappedCategories);
        }
      } catch (err) {
        if (__DEV__) {
          console.error('Error fetching data from API:', err);
        }
        setError('Failed to load data. Using cached data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle search input changes
  const handleSearchChange = (text: string) => {
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

  const CategoryCard = ({ category, index }: { category: Category; index: number }) => {
    const cardAnim = useRef(new Animated.Value(0)).current;
    
    useEffect(() => {
      Animated.timing(cardAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }).start();
    }, []);

    return (
      <Animated.View
        style={[
          styles.categoryCard,
          {
            opacity: cardAnim,
            transform: [
              {
                translateY: cardAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.categoryCardInner,
            selectedCategory === category.id && styles.categoryCardActive,
          ]}
          onPress={() => setSelectedCategory(
            selectedCategory === category.id ? null : category.id
          )}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={
              selectedCategory === category.id
                ? [colors.primary, colors.primaryLight]
                : [colors.surface, colors.surfaceSecondary]
            }
            style={styles.categoryCardGradient}
          >
            <View style={styles.categoryIconContainer}>
              <Ionicons
                name={category.icon as any}
                size={28}
                color={selectedCategory === category.id ? colors.white : colors.primary}
              />
            </View>
            <Text
              style={[
                styles.categoryText,
                { color: selectedCategory === category.id ? colors.white : colors.text.primary },
                selectedCategory === category.id && styles.categoryTextActive,
              ]}
            >
              {category.name}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const RestaurantCard = ({ restaurant }: { restaurant: Restaurant }) => (
    <Animated.View
      style={[
        styles.restaurantCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <TouchableOpacity style={styles.restaurantCardInner} activeOpacity={0.9}>
        <View style={styles.restaurantImageContainer}>
          <View style={[styles.restaurantImagePlaceholder, { backgroundColor: colors.surfaceSecondary }]}>
            <Ionicons name="restaurant" size={32} color={colors.text.tertiary} />
          </View>
          <View style={[styles.restaurantStatus, { backgroundColor: colors.white }]}>
            <View style={[
              styles.statusIndicator,
              { backgroundColor: restaurant.isOpen ? colors.success : colors.error }
            ]} />
            <Text style={[styles.statusText, { color: colors.text.primary }]}>
              {restaurant.isOpen ? 'Open' : 'Closed'}
            </Text>
          </View>
        </View>
        
        <View style={styles.restaurantContent}>
          <Text style={[styles.restaurantName, { color: colors.text.primary }]} numberOfLines={1}>
            {restaurant.name}
          </Text>
          <Text style={[styles.restaurantDescription, { color: colors.text.secondary }]} numberOfLines={1}>
            {restaurant.description}
          </Text>
          
          <View style={styles.restaurantInfo}>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={14} color={colors.rating} />
              <Text style={[styles.ratingText, { color: colors.text.primary }]}>{restaurant.rating}</Text>
            </View>
            
            <View style={styles.deliveryInfo}>
              <Ionicons name="time-outline" size={14} color={colors.text.tertiary} />
              <Text style={[styles.deliveryText, { color: colors.text.secondary }]}>{restaurant.deliveryTime}</Text>
            </View>
            
            <View style={styles.deliveryInfo}>
              <Ionicons name="bicycle-outline" size={14} color={colors.text.tertiary} />
              <Text style={[styles.deliveryText, { color: colors.text.secondary }]}>${restaurant.deliveryFee}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning!';
    if (hour < 17) return 'Good Afternoon!';
    return 'Good Evening!';
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar 
        backgroundColor={colors.primary} 
        barStyle={theme.isDark ? 'light-content' : 'light-content'} 
      />
      
      {/* Loading Overlay */}
      {isLoading && (
        <View style={[styles.loadingOverlay, { backgroundColor: colors.overlayLight }]}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text.primary }]}>Loading fresh food data...</Text>
        </View>
      )}
      
      {/* Error Message */}
      {error && (
        <Animated.View 
          style={[
            styles.errorContainer, 
            { 
              backgroundColor: colors.errorSoft,
              borderLeftColor: colors.error,
            },
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
        </Animated.View>
      )}

      <Animated.ScrollView 
        showsVerticalScrollIndicator={false}
        style={[
          styles.scrollView,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim },
            ],
          },
        ]}
      >
        {/* Header */}
        <LinearGradient
          colors={[colors.primary, colors.primaryLight]}
          style={styles.header}
        >
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.welcomeText}>{getGreeting()}</Text>
              <Text style={styles.userNameText}>
                {user?.name || 'Food Lover'}
              </Text>
            </View>
            
            <View style={styles.headerActions}>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={toggleTheme}
                activeOpacity={0.8}
              >
                <Ionicons 
                  name={theme.isDark ? 'sunny-outline' : 'moon-outline'} 
                  size={24} 
                  color={colors.white} 
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton} activeOpacity={0.8}>
                <Ionicons name="notifications-outline" size={24} color={colors.white} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={() => router.push('/(tabs)/profile')}
                activeOpacity={0.8}
              >
                <Ionicons name="person-circle-outline" size={28} color={colors.white} />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.headerSubtitle}>What would you like to eat today?</Text>
        </LinearGradient>

        {/* Search Bar */}
        <Animated.View 
          style={[
            styles.searchContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="search-outline" size={20} color={colors.text.tertiary} />
            <TextInput
              style={[styles.searchInput, { color: colors.text.primary }]}
              placeholder="Search for food, restaurants..."
              placeholderTextColor={colors.text.tertiary}
              value={searchQuery}
              onChangeText={handleSearchChange}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => handleSearchChange('')} activeOpacity={0.7}>
                <Ionicons name="close-circle" size={20} color={colors.text.tertiary} />
              </TouchableOpacity>
            )}
          </View>
          
          <TouchableOpacity style={styles.filterButton} activeOpacity={0.8}>
            <LinearGradient
              colors={[colors.primary, colors.primaryDark]}
              style={styles.filterButtonGradient}
            >
              <Ionicons name="options-outline" size={20} color={colors.white} />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Pre-Order Notice */}
        <Animated.View 
          style={[
            styles.noticeContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={[colors.accent, colors.accentDark]}
            style={styles.noticeGradient}
          >
            <View style={styles.noticeIconContainer}>
              <Ionicons name="time-outline" size={24} color={colors.white} />
            </View>
            <View style={styles.noticeContent}>
              <Text style={styles.noticeTitle}>Pre-Order Required</Text>
              <Text style={styles.noticeText}>
                We provide fresh homemade food only on pre-orders. 
                Please place your order at least 2 hours in advance for us to prepare your delicious meal!
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Categories</Text>
          <FlatList
            data={categories}
            renderItem={({ item, index }) => <CategoryCard category={item} index={index} />}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        {/* Featured Food */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Featured Food</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={filteredFoodItems}
            renderItem={({ item }) => (
              <Animated.View 
                style={styles.foodCardContainer}
                entering={Animated.spring}
              >
                <FoodCard
                  foodItem={item}
                  onPress={() => router.push({
                    pathname: '/food-detail',
                    params: { id: item.id }
                  })}
                  onAddToCart={() => console.log('Add to cart:', item.name)}
                  onToggleFavorite={() => console.log('Toggle favorite:', item.name)}
                  showQuantitySelector={true}
                  isFavorite={false}
                />
              </Animated.View>
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
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Nearby Restaurants</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {mockRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
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
    color: '#FFFFFF',
    opacity: 0.9,
  },
  userNameText: {
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold',
    color: '#FFFFFF',
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
    color: '#FFFFFF',
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
    borderRadius: RADIUS.xl,
    paddingHorizontal: SPACING.base,
    height: 50,
    borderWidth: 1,
    ...SHADOWS.base,
    gap: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FONTS.sizes.base,
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
  },
  seeAllText: {
    fontSize: FONTS.sizes.base,
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
  categoryCardInner: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
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
  categoryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  categoryText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  foodList: {
    paddingHorizontal: SPACING.base,
    gap: SPACING.sm,
  },
  foodCardContainer: {
    width: width * 0.75,
  },
  restaurantCard: {
    borderRadius: RADIUS.lg,
    marginHorizontal: SPACING.base,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    ...SHADOWS.sm,
    overflow: 'hidden',
  },
  restaurantCardInner: {
    flexDirection: 'row',
  },
  restaurantImageContainer: {
    position: 'relative',
    width: 100,
    height: 100,
  },
  restaurantImagePlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  restaurantStatus: {
    position: 'absolute',
    top: SPACING.xs,
    left: SPACING.xs,
    flexDirection: 'row',
    alignItems: 'center',
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
  },
  restaurantContent: {
    flex: 1,
    padding: SPACING.sm,
    justifyContent: 'space-between',
  },
  restaurantName: {
    fontSize: FONTS.sizes.base,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  restaurantDescription: {
    fontSize: FONTS.sizes.sm,
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
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  deliveryText: {
    fontSize: FONTS.sizes.xs,
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
    color: '#FFFFFF',
    marginBottom: 4,
  },
  noticeText: {
    fontSize: FONTS.sizes.sm,
    color: '#FFFFFF',
    opacity: 0.9,
    lineHeight: 20,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 12,
    fontSize: FONTS.sizes.base,
    fontWeight: '500',
  },
  errorContainer: {
    margin: 16,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
  },
  errorText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '500',
  },
});

export default HomeScreen;
