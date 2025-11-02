import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { useAuth } from '../../hooks/useAuth';
import { apiService } from '../../services/apiService';
import { useAppSelector } from '../../store';
import { Address } from '../../types';
import EmptyState from '../../components/common/EmptyState';

const AddressesScreen: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const user = useAppSelector((state) => state.auth.user);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAddresses = useCallback(async () => {
    if (!isAuthenticated || !user?.id) {
      setAddresses([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiService.getAddresses(user.id);
      if (response.success && response.data) {
        const normalizedAddresses: Address[] = response.data.map((addr: any) => ({
          id: addr.id || addr._id || '',
          title: addr.title || 'Address',
          address: addr.address || addr.fullAddress || '',
          latitude: typeof addr.latitude === 'number' ? addr.latitude : parseFloat(addr.latitude) || 0,
          longitude: typeof addr.longitude === 'number' ? addr.longitude : parseFloat(addr.longitude) || 0,
          isDefault: addr.isDefault || false,
        }));
        setAddresses(normalizedAddresses);
      } else {
        setAddresses([]);
      }
    } catch (error) {
      if (__DEV__) {
        console.error('Error fetching addresses:', error);
      }
      setAddresses([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user?.id]);

  useFocusEffect(
    useCallback(() => {
      if (isAuthenticated) {
        fetchAddresses();
      }
    }, [isAuthenticated, fetchAddresses])
  );

  const handleDeleteAddress = async (addressId: string) => {
    if (!user?.id) return;

    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await apiService.deleteAddress(user.id, addressId);
              if (response.success) {
                fetchAddresses(); // Refresh the list
                Alert.alert('Success', 'Address deleted successfully');
              } else {
                Alert.alert('Error', response.error || 'Failed to delete address');
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to delete address. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleSetDefault = async (addressId: string) => {
    if (!user?.id) return;

    try {
      const response = await apiService.updateAddress(user.id, addressId, { isDefault: true });
      if (response.success) {
        fetchAddresses(); // Refresh the list
      } else {
        Alert.alert('Error', response.error || 'Failed to set default address');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to set default address. Please try again.');
    }
  };

  const AddressCard = ({ address }: { address: Address }) => (
    <View style={styles.addressCard}>
      <View style={styles.addressHeader}>
        <View style={styles.addressIcon}>
          <Ionicons
            name={address.isDefault ? 'home' : 'location-outline'}
            size={24}
            color={COLORS.primary}
          />
        </View>
        <View style={styles.addressInfo}>
          <View style={styles.addressTitleRow}>
            <Text style={styles.addressTitle}>{address.title}</Text>
            {address.isDefault && (
              <View style={styles.defaultBadge}>
                <Text style={styles.defaultBadgeText}>Default</Text>
              </View>
            )}
          </View>
          <Text style={styles.addressText}>{address.address}</Text>
        </View>
      </View>

      <View style={styles.addressActions}>
        {!address.isDefault && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleSetDefault(address.id)}
          >
            <Ionicons name="star-outline" size={18} color={COLORS.primary} />
            <Text style={styles.actionButtonText}>Set Default</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteAddress(address.id)}
        >
          <Ionicons name="trash-outline" size={18} color={COLORS.error} />
          <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <EmptyState
          icon="lock-closed-outline"
          title="Login Required"
          subtitle="Please login to manage your addresses"
          action={
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => router.push('/login')}
            >
              <Text style={styles.loginButtonText}>Go to Login</Text>
            </TouchableOpacity>
          }
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Addresses</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/add-address')}
        >
          <Ionicons name="add" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading addresses...</Text>
        </View>
      ) : addresses.length === 0 ? (
        <EmptyState
          icon="location-outline"
          title="No Addresses"
          subtitle="You haven't added any delivery addresses yet"
          description="Add your first address to make checkout faster!"
          action={
            <TouchableOpacity
              style={styles.addFirstButton}
              onPress={() => router.push('/add-address')}
            >
              <Ionicons name="add-circle" size={20} color={COLORS.white} />
              <Text style={styles.addFirstButtonText}>Add Your First Address</Text>
            </TouchableOpacity>
          }
        />
      ) : (
        <FlatList
          data={addresses}
          renderItem={({ item }) => <AddressCard address={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Floating Add Button */}
      {addresses.length > 0 && (
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => router.push('/add-address')}
        >
          <Ionicons name="add" size={24} color={COLORS.white} />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
    ...SHADOWS.sm,
  },
  backButton: {
    padding: SPACING.xs,
  },
  headerTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  addButton: {
    padding: SPACING.xs,
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
  listContainer: {
    padding: SPACING.base,
  },
  addressCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.base,
    marginBottom: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
    ...SHADOWS.sm,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  addressIcon: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.base,
  },
  addressInfo: {
    flex: 1,
  },
  addressTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  addressTitle: {
    fontSize: FONTS.sizes.base,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginRight: SPACING.sm,
  },
  defaultBadge: {
    backgroundColor: COLORS.successSoft,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
  },
  defaultBadgeText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '600',
    color: COLORS.success,
  },
  addressText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text.secondary,
    lineHeight: 20,
  },
  addressActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[100],
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.gray[100],
    gap: SPACING.xs,
  },
  deleteButton: {
    backgroundColor: COLORS.errorSoft,
  },
  actionButtonText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.primary,
  },
  deleteButtonText: {
    color: COLORS.error,
  },
  floatingButton: {
    position: 'absolute',
    bottom: SPACING.xl,
    right: SPACING.base,
    width: 56,
    height: 56,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.lg,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    marginTop: SPACING.xl,
  },
  loginButtonText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.base,
    fontWeight: '600',
  },
  addFirstButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    marginTop: SPACING.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  addFirstButtonText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.base,
    fontWeight: '600',
  },
});

export default AddressesScreen;
