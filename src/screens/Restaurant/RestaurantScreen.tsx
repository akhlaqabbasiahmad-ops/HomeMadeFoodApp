import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import FoodCard from '../../components/Food/FoodCard';
import { COLORS, FONTS, RADIUS, SPACING } from '../../constants/theme';
import { apiService } from '../../services/apiService';
import { FoodItem, Restaurant } from '../../types';

const { height } = Dimensions.get('window');

const RestaurantScreen = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const params = useLocalSearchParams();
  const restaurantId = params.id as string;

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isFavorite, setIsFavorite] = useState(false);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!restaurantId) {
        setError('Restaurant ID is required');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Fetch restaurant details
        const restaurantResponse = await apiService.getRestaurantById(restaurantId);
        if (restaurantResponse.success && restaurantResponse.data) {
          setRestaurant(restaurantResponse.data);
        } else {
          setError('Restaurant not found');
          setRestaurant(null);
        }

        // Fetch food items for this restaurant
        const foodResponse = await apiService.getFoodItems({
          restaurantId,
        });
        if (foodResponse.success && foodResponse.data?.items) {
          setFoodItems(foodResponse.data.items);
          
          // Extract unique categories from food items
          const uniqueCategories = ['All', ...Array.from(new Set(foodResponse.data.items.map((item: FoodItem) => item.category)))];
          setCategories(uniqueCategories);
        } else {
          setFoodItems([]);
          setCategories(['All']);
        }
      } catch (err) {
        if (__DEV__) {
          console.error('Error fetching restaurant data:', err);
        }
        setError('Failed to load restaurant data');
        setRestaurant(null);
        setFoodItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [restaurantId]);

  // Filter food items based on selected category
  const filteredFoodItems = selectedCategory === 'All' 
    ? foodItems 
    : foodItems.filter(item => item.category === selectedCategory);

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

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading restaurant...</Text>
        </View>
      </View>
    );
  }

  if (error || !restaurant) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={COLORS.error} />
          <Text style={styles.errorTitle}>Restaurant Not Found</Text>
          <Text style={styles.errorText}>{error || 'The restaurant you are looking for does not exist.'}</Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="transparent" barStyle="light-content" translucent />
      
      {/* Header Image */}
      <View style={styles.headerContainer}>
        <Image
          source={{ uri: restaurant.image }}
          style={styles.headerImage}
          resizeMode="cover"
          defaultSource={require('../../../assets/images/icon.png')}
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
            { backgroundColor: restaurant.isOpen ? COLORS.success : COLORS.error }
          ]} />
          <Text style={styles.statusText}>
            {restaurant.isOpen ? 'Open Now' : 'Closed'}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Restaurant Info */}
        <View style={styles.restaurantInfo}>
          <Text style={styles.restaurantName}>{restaurant.name}</Text>
          <Text style={styles.restaurantDescription}>{restaurant.description}</Text>
          
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color={COLORS.rating} />
            <Text style={styles.ratingText}>{restaurant.rating}</Text>
            <Text style={styles.reviewsText}>({restaurant.reviews} reviews)</Text>
          </View>

          {restaurant.categories && restaurant.categories.length > 0 && (
            <View style={styles.categoriesContainer}>
              {restaurant.categories.map((category, index) => (
                <View key={index} style={styles.categoryBadge}>
                  <Text style={styles.categoryBadgeText}>{category}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Delivery Info */}
        <View style={styles.deliveryInfoContainer}>
          <InfoItem
            icon="time-outline"
            title="Delivery Time"
            subtitle={restaurant.deliveryTime || 'N/A'}
          />
          <InfoItem
            icon="bicycle-outline"
            title="Delivery Fee"
            subtitle={`$${restaurant.deliveryFee || 0}`}
          />
          <InfoItem
            icon="card-outline"
            title="Minimum Order"
            subtitle={`$${restaurant.minimumOrder || 0}`}
          />
        </View>

        {/* Menu Categories */}
        {categories.length > 1 && (
          <View style={styles.menuSection}>
            <Text style={styles.menuTitle}>Menu</Text>
            
            <FlatList
              data={categories}
              renderItem={({ item }) => <CategoryTab category={item} />}
              keyExtractor={(item) => item}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryTabs}
            />
          </View>
        )}

        {/* Food Items */}
        <View style={styles.foodItemsContainer}>
          {filteredFoodItems.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="fast-food-outline" size={64} color={COLORS.text.tertiary} />
              <Text style={styles.emptyTitle}>No Products Found</Text>
              <Text style={styles.emptyText}>
                {selectedCategory === 'All' 
                  ? 'This restaurant has no products available yet.' 
                  : `No products found in ${selectedCategory} category.`}
              </Text>
            </View>
          ) : (
            filteredFoodItems.map((item) => (
              <View key={item.id} style={styles.foodItemWrapper}>
                <FoodCard
                  foodItem={item}
                  onPress={() => router.push({
                    pathname: '/food-detail',
                    params: { id: item.id }
                  })}
                  onAddToCart={() => console.log('Add to cart:', item.name)}
                  onToggleFavorite={() => console.log('Toggle favorite:', item.name)}
                />
              </View>
            ))
          )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.base,
    fontSize: FONTS.sizes.base,
    color: COLORS.text.secondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.base,
  },
  errorTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginTop: SPACING.base,
    marginBottom: SPACING.sm,
  },
  errorText: {
    fontSize: FONTS.sizes.base,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  backButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.lg,
  },
  backButtonText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.base,
    fontWeight: '600',
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
  emptyContainer: {
    paddingVertical: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginTop: SPACING.base,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    fontSize: FONTS.sizes.base,
    color: COLORS.text.secondary,
    textAlign: 'center',
    paddingHorizontal: SPACING.base,
  },
});

export default RestaurantScreen;
