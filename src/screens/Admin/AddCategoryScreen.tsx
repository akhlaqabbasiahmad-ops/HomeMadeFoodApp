import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS } from '../../constants/theme';
import { apiService } from '../../services/apiService';

interface AddCategoryScreenProps {
  navigation: any;
}

const AddCategoryScreen: React.FC<AddCategoryScreenProps> = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Validation Error', 'Category name is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      console.log('🚀 Submitting category:', formData);
      const response = await apiService.createCategory({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        icon: formData.icon.trim() || undefined,
      });

      if (response.success) {
        Alert.alert(
          'Success',
          'Category created successfully!',
          [
            {
              text: 'OK',
              onPress: () => {
                setFormData({ name: '', description: '', icon: '' });
                navigation.goBack();
              },
            },
          ]
        );
      } else {
        Alert.alert('Error', response.error || 'Failed to create category');
      }
    } catch (error) {
      console.error('Error creating category:', error);
      Alert.alert('Error', 'Failed to create category. Please try again.');
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
          <Text style={styles.headerTitle}>Add Category</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.form}>
            {/* Category Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category Name *</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
                placeholder="Enter category name"
                placeholderTextColor={COLORS.gray?.[400]}
              />
            </View>

            {/* Description */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.description}
                onChangeText={(value) => handleInputChange('description', value)}
                placeholder="Enter category description"
                placeholderTextColor={COLORS.gray?.[400]}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Icon */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Icon (Emoji)</Text>
              <TextInput
                style={styles.input}
                value={formData.icon}
                onChangeText={(value) => handleInputChange('icon', value)}
                placeholder="🍕 Enter an emoji"
                placeholderTextColor={COLORS.gray?.[400]}
                maxLength={2}
              />
              <Text style={styles.helpText}>
                Add an emoji to represent this category (e.g., 🍕, 🍔, 🍝)
              </Text>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text style={styles.submitButtonText}>
                {isSubmitting ? 'Creating...' : 'Create Category'}
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
  inputGroup: {
    marginBottom: 24,
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
    height: 100,
    paddingTop: 14,
  },
  helpText: {
    fontSize: FONTS?.sizes?.sm || 14,
    color: COLORS.gray?.[500],
    marginTop: 6,
    fontStyle: 'italic',
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

export default AddCategoryScreen;