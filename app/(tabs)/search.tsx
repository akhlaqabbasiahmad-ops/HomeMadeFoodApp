import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    FlatList,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import FoodCard from '../../src/components/Food/FoodCard';
import CustomButton from '../../src/components/common/CustomButton';
import EmptyState from '../../src/components/common/EmptyState';
import ScreenHeader from '../../src/components/common/ScreenHeader';
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../../src/constants/theme';
import { useSearch } from '../../src/hooks/useSearch';

export default function Search() {
  const {
    searchQuery,
    setSearchQuery,
    results,
    loading,
    categories,
    searchHistory,
    clearSearchHistory,
  } = useSearch();

  const [showHistory, setShowHistory] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setShowHistory(false);
  };

  const renderSearchHistory = () => {
    if (!showHistory || searchHistory.length === 0) return null;

    return (
      <View style={styles.historyContainer}>
        <View style={styles.historyHeader}>
          <Text style={styles.historyTitle}>Recent Searches</Text>
          <TouchableOpacity onPress={clearSearchHistory}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        </View>
        {searchHistory.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.historyItem}
            onPress={() => handleSearch(item)}
          >
            <Ionicons name="time-outline" size={16} color={COLORS.text.tertiary} />
            <Text style={styles.historyItemText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderCategories = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.categoriesContainer}
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={styles.categoryChip}
          onPress={() => handleSearch(category.name)}
        >
          <Text style={styles.categoryText}>{category.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderSearchResults = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      );
    }

    if (searchQuery && results.length === 0) {
      return (
        <EmptyState
          icon="search-outline"
          title="No Results Found"
          subtitle={`No food items found for "${searchQuery}"`}
          description="Try adjusting your search terms or browse our categories below."
          action={
            <CustomButton
              title="Browse Categories"
              onPress={() => setSearchQuery('')}
              variant="outline"
            />
          }
        />
      );
    }

    if (results.length > 0) {
      return (
        <FlatList
          data={results}
          renderItem={({ item }) => (
            <FoodCard
              foodItem={item}
              onPress={() => router.push({
                pathname: '/food-detail',
                params: { id: item.id }
              })}
              onAddToCart={() => console.log('Add to cart:', item.name)}
              onToggleFavorite={() => console.log('Toggle favorite:', item.name)}
            />
          )}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.resultsContainer}
        />
      );
    }

    return (
      <EmptyState
        icon="restaurant-outline"
        title="Find Your Favorite Food"
        subtitle="Search for delicious meals"
        description="Use the search bar above to find your favorite dishes, restaurants, or browse by categories."
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title="Search"
        subtitle="Find delicious food"
        gradient={true}
      />

      <View style={styles.content}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={20} color={COLORS.text.tertiary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search food, restaurants..."
              placeholderTextColor={COLORS.text.tertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={() => setShowHistory(true)}
              onBlur={() => setTimeout(() => setShowHistory(false), 200)}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color={COLORS.text.tertiary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Search History */}
        {renderSearchHistory()}

        {/* Categories */}
        {!searchQuery && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Browse Categories</Text>
            </View>
            {renderCategories()}
          </>
        )}

        {/* Results */}
        <View style={styles.resultsSection}>
          {searchQuery && (
            <Text style={styles.resultsCount}>
              {results.length} result{results.length !== 1 ? 's' : ''} found
            </Text>
          )}
          {renderSearchResults()}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: SPACING[4],
    paddingVertical: SPACING[3],
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.input,
    paddingHorizontal: SPACING[4],
    height: 48,
    ...SHADOWS.sm,
    gap: SPACING[3],
  },
  searchInput: {
    flex: 1,
    fontSize: FONTS.sizes.base,
    color: COLORS.text.primary,
  },
  historyContainer: {
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING[4],
    marginBottom: SPACING[3],
    borderRadius: RADIUS.card,
    ...SHADOWS.sm,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING[4],
    paddingVertical: SPACING[3],
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  historyTitle: {
    fontSize: FONTS.sizes.base,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  clearText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.primary,
    fontWeight: '600',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING[4],
    paddingVertical: SPACING[3],
    gap: SPACING[3],
  },
  historyItemText: {
    fontSize: FONTS.sizes.base,
    color: COLORS.text.secondary,
  },
  sectionHeader: {
    paddingHorizontal: SPACING[4],
    paddingVertical: SPACING[2],
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  categoriesContainer: {
    paddingHorizontal: SPACING[4],
    gap: SPACING[2],
  },
  categoryChip: {
    backgroundColor: COLORS.primarySoft,
    borderRadius: RADIUS.chip,
    paddingHorizontal: SPACING[4],
    paddingVertical: SPACING[2],
    marginRight: SPACING[2],
  },
  categoryText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.primary,
  },
  resultsSection: {
    flex: 1,
    paddingTop: SPACING[4],
  },
  resultsCount: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text.secondary,
    paddingHorizontal: SPACING[4],
    marginBottom: SPACING[3],
  },
  resultsContainer: {
    paddingHorizontal: SPACING[4],
    paddingBottom: SPACING[6],
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: FONTS.sizes.base,
    color: COLORS.text.secondary,
  },
});