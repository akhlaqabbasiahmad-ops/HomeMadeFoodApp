import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
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
  navigation: any;
}

const AddFoodScreen: React.FC<AddFoodScreenProps> = ({ navigation }) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    image: '',
    category: '',
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

  const loadCategories = async () => {
    try {
      const response = await apiService.getCategories();
      if (response.success && response.data) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
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
    if (!formData.category) {
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

      const foodData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        image: formData.image.trim(),
        category: formData.category,
        restaurantId: formData.restaurantId.trim() || `restaurant-${Date.now()}`,
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

      console.log('🚀 Submitting food item:', foodData);
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
                  category: '',
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
                navigation.goBack();
              },
            },
          ]
        );
      } else {
        Alert.alert('Error', response.error || 'Failed to create food item');
      }
    } catch (error) {
      console.error('Error creating food item:', error);
      Alert.alert('Error', 'Failed to create food item. Please try again.');
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
                  Alert.alert(
                    'Select Category',
                    'Choose a category for this food item',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      ...categories.map(category => ({
                        text: `${category.icon || ''} ${category.name}`,
                        onPress: () => handleInputChange('category', category.name)
                      }))
                    ]
                  );
                }}
              >
                <Text style={[styles.categorySelectorText, formData.category ? styles.categorySelected : styles.categoryPlaceholder]}>
                  {formData.category || 'Select a category'}
                </Text>
                <Ionicons name="chevron-down" size={20} color={COLORS.gray?.[500]} />
              </TouchableOpacity>
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
});

export default AddFoodScreen;