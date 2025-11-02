import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
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
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { useAuth } from '../../hooks/useAuth';
import { apiService } from '../../services/apiService';
import { useAppSelector } from '../../store';

const AddAddressScreen: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const user = useAppSelector((state) => state.auth.user);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    address: '',
    latitude: '',
    longitude: '',
    isDefault: false,
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      Alert.alert('Validation Error', 'Please enter an address title (e.g., Home, Work)');
      return false;
    }
    if (!formData.address.trim()) {
      Alert.alert('Validation Error', 'Please enter the full address');
      return false;
    }
    if (!formData.latitude.trim() || isNaN(Number(formData.latitude))) {
      Alert.alert('Validation Error', 'Please enter a valid latitude');
      return false;
    }
    if (!formData.longitude.trim() || isNaN(Number(formData.longitude))) {
      Alert.alert('Validation Error', 'Please enter a valid longitude');
      return false;
    }
    
    const lat = Number(formData.latitude);
    const lng = Number(formData.longitude);
    
    if (lat < -90 || lat > 90) {
      Alert.alert('Validation Error', 'Latitude must be between -90 and 90');
      return false;
    }
    if (lng < -180 || lng > 180) {
      Alert.alert('Validation Error', 'Longitude must be between -180 and 180');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (!isAuthenticated || !user?.id) {
      Alert.alert('Error', 'Please login to add an address');
      router.push('/login');
      return;
    }

    setIsSubmitting(true);
    try {
      const addressData = {
        title: formData.title.trim(),
        address: formData.address.trim(),
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
        isDefault: formData.isDefault,
      };

      const response = await apiService.addAddress(user.id, addressData);

      if (response.success) {
        Alert.alert(
          'Success',
          'Address added successfully!',
          [
            {
              text: 'OK',
              onPress: () => {
                // Reset form
                setFormData({
                  title: '',
                  address: '',
                  latitude: '',
                  longitude: '',
                  isDefault: false,
                });
                router.back();
              },
            },
          ]
        );
      } else {
        Alert.alert('Error', response.error || 'Failed to add address');
      }
    } catch (error) {
      if (__DEV__) {
        console.error('Error adding address:', error);
      }
      Alert.alert('Error', 'Failed to add address. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGetCurrentLocation = () => {
    // This would typically use expo-location to get current location
    // For now, show an alert
    Alert.alert(
      'Location Permission',
      'Location services would be used here to automatically fill in your coordinates. For now, please enter coordinates manually or use a map picker.',
      [{ text: 'OK' }]
    );
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
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add New Address</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.form}>
            {/* Address Title */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Address Title *</Text>
              <TextInput
                style={styles.input}
                value={formData.title}
                onChangeText={(value) => handleInputChange('title', value)}
                placeholder="e.g., Home, Work, Office"
                placeholderTextColor={COLORS.gray[400]}
                maxLength={50}
              />
              <Text style={styles.helpText}>
                Give your address a name for easy identification
              </Text>
            </View>

            {/* Full Address */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Address *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.address}
                onChangeText={(value) => handleInputChange('address', value)}
                placeholder="123 Main St, City, State 12345"
                placeholderTextColor={COLORS.gray[400]}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            {/* Location Coordinates */}
            <View style={styles.inputGroup}>
              <View style={styles.sectionHeader}>
                <Text style={styles.label}>Location Coordinates *</Text>
                <TouchableOpacity
                  style={styles.locationButton}
                  onPress={handleGetCurrentLocation}
                >
                  <Ionicons name="location" size={18} color={COLORS.primary} />
                  <Text style={styles.locationButtonText}>Use Current</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.row}>
                <View style={[styles.inputGroup, styles.halfWidth]}>
                  <Text style={styles.subLabel}>Latitude</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.latitude}
                    onChangeText={(value) => handleInputChange('latitude', value)}
                    placeholder="40.7128"
                    placeholderTextColor={COLORS.gray[400]}
                    keyboardType="decimal-pad"
                  />
                </View>
                <View style={[styles.inputGroup, styles.halfWidth]}>
                  <Text style={styles.subLabel}>Longitude</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.longitude}
                    onChangeText={(value) => handleInputChange('longitude', value)}
                    placeholder="-74.0060"
                    placeholderTextColor={COLORS.gray[400]}
                    keyboardType="decimal-pad"
                  />
                </View>
              </View>
              
              <Text style={styles.helpText}>
                Enter GPS coordinates for accurate delivery location
              </Text>
            </View>

            {/* Set as Default */}
            <View style={styles.switchRow}>
              <View style={styles.switchLabelContainer}>
                <Text style={styles.switchLabel}>Set as Default Address</Text>
                <Text style={styles.switchSubLabel}>
                  This will be used as your default delivery address
                </Text>
              </View>
              <Switch
                value={formData.isDefault}
                onValueChange={(value) => handleInputChange('isDefault', value)}
                trackColor={{ false: COLORS.gray[300], true: COLORS.primary }}
                thumbColor={formData.isDefault ? COLORS.white : COLORS.gray[400]}
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text style={styles.submitButtonText}>
                {isSubmitting ? 'Adding Address...' : 'Add Address'}
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
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  backButton: {
    padding: SPACING.xs,
    marginLeft: -SPACING.xs,
  },
  headerTitle: {
    fontSize: FONTS.sizes.lg,
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
    padding: SPACING.base,
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  label: {
    fontSize: FONTS.sizes.base,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  subLabel: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '500',
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.gray[300],
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    fontSize: FONTS.sizes.base,
    color: COLORS.text.primary,
    backgroundColor: COLORS.white,
  },
  textArea: {
    height: 100,
    paddingTop: SPACING.sm,
  },
  helpText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.gray[500],
    marginTop: SPACING.xs,
    fontStyle: 'italic',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.base,
  },
  halfWidth: {
    flex: 1,
    marginBottom: 0,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primarySoft,
    gap: SPACING.xs,
  },
  locationButtonText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.primary,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.base,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
    marginVertical: SPACING.base,
  },
  switchLabelContainer: {
    flex: 1,
    marginRight: SPACING.base,
  },
  switchLabel: {
    fontSize: FONTS.sizes.base,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  switchSubLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text.secondary,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.base,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    marginTop: SPACING.lg,
    ...SHADOWS.md,
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.gray[400],
    opacity: 0.7,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.base,
    fontWeight: '600',
  },
  requiredNote: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.gray[500],
    textAlign: 'center',
    marginTop: SPACING.base,
    fontStyle: 'italic',
  },
});

export default AddAddressScreen;

