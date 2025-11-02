import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// Using TouchableOpacity instead of Picker for better compatibility
import { COLORS, FONTS } from '../../constants/theme';
import { apiService } from '../../services/apiService';

interface AddFoodScreenProps {
  navigation?: any; // Keep for backward compatibility
}

const AddFoodScreen: React.FC<AddFoodScreenProps> = ({ navigation }) => {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    image: '',
    categoryId: '',
    categoryName: '',
    restaurantId: '',
    restaurantName: '',
    ingredients: '',
    allergens: '',
    preparationTime: '',
    calories: '',
    isVegetarian: false,
    isVegan: false,
    isSpicy: false,
    isFeatured: false,
    isPopular: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  // Reload categories when screen comes into focus (e.g., after adding a new category)
  useFocusEffect(
    useCallback(() => {
      loadCategories();
    }, [])
  );

  const loadCategories = async () => {
    try {
      const response = await apiService.getCategories();
      
      if (response.success && response.data) {
        setCategories(response.data);
      } else {
        setCategories([]);
      }
    } catch (error) {
      if (__DEV__) {
        console.error('Error loading categories:', error);
      }
      setCategories([]);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Validation Error', 'Food name is required');
      return false;
    }
    if (!formData.description.trim()) {
      Alert.alert('Validation Error', 'Description is required');
      return false;
    }
    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid price');
      return false;
    }
    if (!formData.image.trim()) {
      Alert.alert('Validation Error', 'Image URL is required');
      return false;
    }
    if (!formData.categoryId) {
      Alert.alert('Validation Error', 'Please select a category');
      return false;
    }
    if (!formData.restaurantName.trim()) {
      Alert.alert('Validation Error', 'Restaurant name is required');
      return false;
    }
    if (!formData.preparationTime || isNaN(Number(formData.preparationTime)) || Number(formData.preparationTime) <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid preparation time');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const ingredientsArray = formData.ingredients
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0);

      const allergensArray = formData.allergens
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0);

      // Generate a valid UUID v4 format for restaurantId if not provided
      const generateUUID = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0;
          const v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      };

      const foodData: any = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        image: formData.image.trim(),
        category: formData.categoryName, // Send category name only (API doesn't accept categoryId)
        restaurantId: formData.restaurantId.trim() || generateUUID(),
        restaurantName: formData.restaurantName.trim(),
        ingredients: ingredientsArray,
        allergens: allergensArray.length > 0 ? allergensArray : undefined,
        preparationTime: Number(formData.preparationTime),
        calories: formData.calories ? Number(formData.calories) : undefined,
        isVegetarian: formData.isVegetarian,
        isVegan: formData.isVegan,
        isSpicy: formData.isSpicy,
        isFeatured: formData.isFeatured,
        isPopular: formData.isPopular,
      };
      
      // Remove undefined values to avoid sending them in the request
      Object.keys(foodData).forEach(key => {
        if (foodData[key] === undefined) {
          delete foodData[key];
        }
      });

      if (__DEV__) {
        console.log('Sending food data:', JSON.stringify(foodData, null, 2));
      }

      const response = await apiService.createFoodItem(foodData);

      if (response.success) {
        Alert.alert(
          'Success',
          'Food item created successfully!',
          [
            {
              text: 'OK',
              onPress: () => {
                // Reset form
                setFormData({
                  name: '',
                  description: '',
                  price: '',
                  originalPrice: '',
                  image: '',
                  categoryId: '',
                  categoryName: '',
                  restaurantId: '',
                  restaurantName: '',
                  ingredients: '',
                  allergens: '',
                  preparationTime: '',
                  calories: '',
                  isVegetarian: false,
                  isVegan: false,
                  isSpicy: false,
                  isFeatured: false,
                  isPopular: false,
                });
                router.back();
              },
            },
          ]
        );
      } else {
        const errorMessage = response.error || 'Failed to create food item';
        if (__DEV__) {
          console.error('API Error Response:', response);
        }
        Alert.alert('Error', errorMessage);
      }
    } catch (error) {
      if (__DEV__) {
        console.error('Error creating food item:', error);
      }
      Alert.alert(
        'Error', 
        error instanceof Error ? error.message : 'Failed to create food item. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Food Item</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.form}>
            {/* Food Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Food Name *</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
                placeholder="Enter food name"
                placeholderTextColor={COLORS.gray?.[400]}
              />
            </View>

            {/* Description */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.description}
                onChangeText={(value) => handleInputChange('description', value)}
                placeholder="Enter food description"
                placeholderTextColor={COLORS.gray?.[400]}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            {/* Price and Original Price */}
            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>Price *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.price}
                  onChangeText={(value) => handleInputChange('price', value)}
                  placeholder="0.00"
                  placeholderTextColor={COLORS.gray?.[400]}
                  keyboardType="decimal-pad"
                />
              </View>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>Original Price</Text>
                <TextInput
                  style={styles.input}
                  value={formData.originalPrice}
                  onChangeText={(value) => handleInputChange('originalPrice', value)}
                  placeholder="0.00"
                  placeholderTextColor={COLORS.gray?.[400]}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            {/* Image URL */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Image URL *</Text>
              <TextInput
                style={styles.input}
                value={formData.image}
                onChangeText={(value) => handleInputChange('image', value)}
                placeholder="https://example.com/image.jpg"
                placeholderTextColor={COLORS.gray?.[400]}
              />
            </View>

            {/* Category */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category *</Text>
              <TouchableOpacity
                style={styles.categorySelector}
                onPress={() => {
                  if (categories.length === 0) {
                    Alert.alert(
                      'No Categories',
                      'No categories available. Please add a category first.',
                      [
                        { text: 'OK' },
                        { 
                          text: 'Add Category', 
                          onPress: () => router.push('/add-category')
                        }
                      ]
                    );
                    return;
                  }
                  setShowCategoryModal(true);
                }}
              >
                <Text style={[styles.categorySelectorText, formData.categoryName ? styles.categorySelected : styles.categoryPlaceholder]}>
                  {formData.categoryName || 'Select a category'}
                </Text>
                <Ionicons name="chevron-down" size={20} color={COLORS.gray?.[500]} />
              </TouchableOpacity>
              {categories.length > 0 && (
                <Text style={styles.categoryHint}>
                  {categories.length} categories available
                </Text>
              )}
            </View>

            {/* Restaurant Info */}
            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>Restaurant ID</Text>
                <TextInput
                  style={styles.input}
                  value={formData.restaurantId}
                  onChangeText={(value) => handleInputChange('restaurantId', value)}
                  placeholder="Auto-generated"
                  placeholderTextColor={COLORS.gray?.[400]}
                />
              </View>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>Restaurant Name *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.restaurantName}
                  onChangeText={(value) => handleInputChange('restaurantName', value)}
                  placeholder="Restaurant name"
                  placeholderTextColor={COLORS.gray?.[400]}
                />
              </View>
            </View>

            {/* Ingredients */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Ingredients</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.ingredients}
                onChangeText={(value) => handleInputChange('ingredients', value)}
                placeholder="Enter ingredients separated by commas"
                placeholderTextColor={COLORS.gray?.[400]}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            {/* Allergens */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Allergens</Text>
              <TextInput
                style={styles.input}
                value={formData.allergens}
                onChangeText={(value) => handleInputChange('allergens', value)}
                placeholder="Enter allergens separated by commas"
                placeholderTextColor={COLORS.gray?.[400]}
              />
            </View>

            {/* Preparation Time and Calories */}
            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>Prep Time (min) *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.preparationTime}
                  onChangeText={(value) => handleInputChange('preparationTime', value)}
                  placeholder="15"
                  placeholderTextColor={COLORS.gray?.[400]}
                  keyboardType="numeric"
                />
              </View>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>Calories</Text>
                <TextInput
                  style={styles.input}
                  value={formData.calories}
                  onChangeText={(value) => handleInputChange('calories', value)}
                  placeholder="250"
                  placeholderTextColor={COLORS.gray?.[400]}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Switches */}
            <View style={styles.switchGroup}>
              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Vegetarian</Text>
                <Switch
                  value={formData.isVegetarian}
                  onValueChange={(value) => handleInputChange('isVegetarian', value)}
                  trackColor={{ false: COLORS.gray?.[300], true: COLORS.secondary }}
                  thumbColor={formData.isVegetarian ? COLORS.white : COLORS.gray?.[400]}
                />
              </View>
              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Vegan</Text>
                <Switch
                  value={formData.isVegan}
                  onValueChange={(value) => handleInputChange('isVegan', value)}
                  trackColor={{ false: COLORS.gray?.[300], true: COLORS.secondary }}
                  thumbColor={formData.isVegan ? COLORS.white : COLORS.gray?.[400]}
                />
              </View>
              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Spicy</Text>
                <Switch
                  value={formData.isSpicy}
                  onValueChange={(value) => handleInputChange('isSpicy', value)}
                  trackColor={{ false: COLORS.gray?.[300], true: COLORS.error }}
                  thumbColor={formData.isSpicy ? COLORS.white : COLORS.gray?.[400]}
                />
              </View>
              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Featured</Text>
                <Switch
                  value={formData.isFeatured}
                  onValueChange={(value) => handleInputChange('isFeatured', value)}
                  trackColor={{ false: COLORS.gray?.[300], true: COLORS.accent }}
                  thumbColor={formData.isFeatured ? COLORS.white : COLORS.gray?.[400]}
                />
              </View>
              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Popular</Text>
                <Switch
                  value={formData.isPopular}
                  onValueChange={(value) => handleInputChange('isPopular', value)}
                  trackColor={{ false: COLORS.gray?.[300], true: COLORS.primary }}
                  thumbColor={formData.isPopular ? COLORS.white : COLORS.gray?.[400]}
                />
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text style={styles.submitButtonText}>
                {isSubmitting ? 'Creating...' : 'Create Food Item'}
              </Text>
            </TouchableOpacity>

            {/* Required fields note */}
            <Text style={styles.requiredNote}>* Required fields</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Category Selection Modal */}
      <Modal
        visible={showCategoryModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Category</Text>
              <TouchableOpacity
                onPress={() => setShowCategoryModal(false)}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={24} color={COLORS.text.primary} />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={categories}
              keyExtractor={(item) => item.id || item._id || String(Math.random())}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.categoryItem}
                  onPress={() => {
                    handleInputChange('categoryId', item.id || item._id || '');
                    handleInputChange('categoryName', item.name);
                    setShowCategoryModal(false);
                  }}
                >
                  <Text style={styles.categoryItemIcon}>{item.icon || '📂'}</Text>
                  <View style={styles.categoryItemText}>
                    <Text style={styles.categoryItemName}>{item.name}</Text>
                    {item.description && (
                      <Text style={styles.categoryItemDescription}>{item.description}</Text>
                    )}
                  </View>
                  {formData.categoryId === (item.id || item._id) && (
                    <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              )}
              style={styles.categoryList}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray?.[200],
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: FONTS?.sizes?.lg || 18,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  placeholder: {
    width: 40,
  },
  scrollContainer: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    flex: 0.48,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: FONTS?.sizes?.base || 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.gray?.[300],
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: FONTS?.sizes?.base || 16,
    color: COLORS.text.primary,
    backgroundColor: COLORS.white,
  },
  textArea: {
    height: 80,
    paddingTop: 14,
  },
  categorySelector: {
    borderWidth: 1,
    borderColor: COLORS.gray?.[300],
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categorySelectorText: {
    fontSize: FONTS?.sizes?.base || 16,
  },
  categorySelected: {
    color: COLORS.text.primary,
  },
  categoryPlaceholder: {
    color: COLORS.gray?.[400],
  },
  categoryHint: {
    fontSize: FONTS?.sizes?.sm || 12,
    color: COLORS.gray?.[500],
    marginTop: 4,
    marginLeft: 4,
  },
  switchGroup: {
    marginBottom: 20,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray?.[100],
  },
  switchLabel: {
    fontSize: FONTS?.sizes?.base || 16,
    color: COLORS.text.primary,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.gray?.[400],
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: FONTS?.sizes?.base || 16,
    fontWeight: '600',
  },
  requiredNote: {
    fontSize: FONTS?.sizes?.sm || 14,
    color: COLORS.gray?.[500],
    textAlign: 'center',
    marginTop: 16,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray?.[200],
  },
  modalTitle: {
    fontSize: FONTS?.sizes?.lg || 18,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  modalCloseButton: {
    padding: 4,
  },
  categoryList: {
    maxHeight: 400,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray?.[100],
  },
  categoryItemIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  categoryItemText: {
    flex: 1,
  },
  categoryItemName: {
    fontSize: FONTS?.sizes?.base || 16,
    fontWeight: '500',
    color: COLORS.text.primary,
  },
  categoryItemDescription: {
    fontSize: FONTS?.sizes?.sm || 14,
    color: COLORS.gray?.[500],
    marginTop: 2,
  },
});

export default AddFoodScreen;