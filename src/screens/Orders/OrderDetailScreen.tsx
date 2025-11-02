import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FONTS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { useColors, useTheme } from '../../contexts/ThemeContext';
import { apiService } from '../../services/apiService';
import { useAppDispatch } from '../../store';
import { cancelOrder, reorderItems } from '../../store/orderSlice';
import { Order, OrderStatus } from '../../types';

const OrderDetailScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { theme } = useTheme();
  const colors = useColors();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  // Fetch order details from API
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!id) {
        setError('Order ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await apiService.get(`/orders/${id}`);
        
        if (response.success && response.data) {
          setOrder(response.data);
        } else {
          setError(response.error || 'Failed to load order details');
        }
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError('Failed to load order details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  const getStatusColor = (status: OrderStatus): string => {
    switch (status) {
      case 'pending':
        return colors.warning;
      case 'confirmed':
        return colors.info;
      case 'preparing':
        return colors.primary;
      case 'ready':
        return colors.success;
      case 'on_the_way':
        return colors.secondary;
      case 'delivered':
        return colors.success;
      case 'cancelled':
        return colors.error;
      default:
        return colors.border;
    }
  };

  const getStatusText = (status: OrderStatus): string => {
    switch (status) {
      case 'pending':
        return 'Order Placed';
      case 'confirmed':
        return 'Confirmed';
      case 'preparing':
        return 'Preparing';
      case 'ready':
        return 'Ready for Pickup';
      case 'on_the_way':
        return 'On the Way';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const handleCancelOrder = async () => {
    if (!order) return;

    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this order?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            setCancelling(true);
            try {
              await dispatch(cancelOrder(order.id));
              setOrder({ ...order, status: 'cancelled' });
              Alert.alert('Success', 'Order has been cancelled');
            } catch (error) {
              Alert.alert('Error', 'Failed to cancel order');
            } finally {
              setCancelling(false);
            }
          },
        },
      ]
    );
  };

  const handleReorder = async () => {
    if (!order) return;

    try {
      await dispatch(reorderItems(order.id));
      Alert.alert(
        'Items Added to Cart',
        'The items from this order have been added to your cart.',
        [
          { text: 'Continue Shopping', style: 'cancel' },
          { text: 'View Cart', onPress: () => router.push('/(tabs)/cart') },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to reorder items');
    }
  };

  const canCancelOrder = (status: OrderStatus): boolean => {
    return ['pending', 'confirmed'].includes(status);
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text.primary }]}>
            Loading order details...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !order) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={colors.error} />
          <Text style={[styles.errorTitle, { color: colors.text.primary }]}>
            Order Not Found
          </Text>
          <Text style={[styles.errorMessage, { color: colors.text.secondary }]}>
            {error || 'This order could not be found'}
          </Text>
          <TouchableOpacity 
            style={[styles.retryButton, { backgroundColor: colors.primary }]}
            onPress={() => router.back()}
          >
            <Text style={[styles.retryButtonText, { color: colors.white }]}>
              Go Back
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Order Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Order Status */}
        <View style={[styles.statusCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.statusHeader}>
            <Text style={[styles.orderId, { color: colors.text.primary }]}>
              Order #{order.id.substring(0, 8)}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + '20' }]}>
              <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                {getStatusText(order.status)}
              </Text>
            </View>
          </View>
          <Text style={[styles.orderDate, { color: colors.text.secondary }]}>
            {formatDate(order.orderDate)}
          </Text>
          {order.estimatedDeliveryTime && (
            <Text style={[styles.deliveryTime, { color: colors.text.tertiary }]}>
              Estimated delivery: {formatDate(order.estimatedDeliveryTime)}
            </Text>
          )}
        </View>

        {/* Restaurant Info */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Restaurant</Text>
          <View style={styles.restaurantInfo}>
            <Ionicons name="restaurant" size={24} color={colors.primary} />
            <Text style={[styles.restaurantName, { color: colors.text.primary }]}>
              {order.restaurantName}
            </Text>
          </View>
        </View>

        {/* Order Items */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Order Items ({order.items?.length || 0})
          </Text>
          {order.items?.map((item, index) => (
            <View key={index} style={styles.orderItem}>
              <View style={styles.itemInfo}>
                <Text style={[styles.itemName, { color: colors.text.primary }]}>
                  {item.name}
                </Text>
                <Text style={[styles.itemPrice, { color: colors.text.secondary }]}>
                  ${item.price.toFixed(2)} × {item.quantity}
                </Text>
                {item.specialInstructions && (
                  <Text style={[styles.specialInstructions, { color: colors.text.tertiary }]}>
                    Note: {item.specialInstructions}
                  </Text>
                )}
              </View>
              <Text style={[styles.itemTotal, { color: colors.text.primary }]}>
                ${(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* Delivery Address */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Delivery Address</Text>
          <View style={styles.addressInfo}>
            <Ionicons name="location" size={20} color={colors.primary} />
            <View style={styles.addressDetails}>
              <Text style={[styles.addressTitle, { color: colors.text.primary }]}>
                {order.deliveryAddress?.title || 'Delivery Address'}
              </Text>
              <Text style={[styles.addressText, { color: colors.text.secondary }]}>
                {order.deliveryAddress?.address}
              </Text>
            </View>
          </View>
        </View>

        {/* Payment Method */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Payment Method</Text>
          <View style={styles.paymentInfo}>
            <Ionicons name="card" size={20} color={colors.primary} />
            <Text style={[styles.paymentMethod, { color: colors.text.primary }]}>
              {order.paymentMethod}
            </Text>
          </View>
        </View>

        {/* Price Breakdown */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Price Breakdown</Text>
          <View style={styles.priceBreakdown}>
            <View style={styles.priceRow}>
              <Text style={[styles.priceLabel, { color: colors.text.secondary }]}>Subtotal</Text>
              <Text style={[styles.priceValue, { color: colors.text.primary }]}>
                ${order.totalAmount.toFixed(2)}
              </Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={[styles.priceLabel, { color: colors.text.secondary }]}>Delivery Fee</Text>
              <Text style={[styles.priceValue, { color: colors.text.primary }]}>
                ${order.deliveryFee.toFixed(2)}
              </Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={[styles.priceLabel, { color: colors.text.secondary }]}>Tax</Text>
              <Text style={[styles.priceValue, { color: colors.text.primary }]}>
                ${order.tax.toFixed(2)}
              </Text>
            </View>
            <View style={[styles.priceRow, styles.totalRow, { borderTopColor: colors.border }]}>
              <Text style={[styles.totalLabel, { color: colors.text.primary }]}>Total</Text>
              <Text style={[styles.totalValue, { color: colors.primary }]}>
                ${order.grandTotal.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {canCancelOrder(order.status) && (
            <TouchableOpacity
              style={[styles.cancelButton, { borderColor: colors.error }]}
              onPress={handleCancelOrder}
              disabled={cancelling}
            >
              <Ionicons name="close-circle" size={20} color={colors.error} />
              <Text style={[styles.cancelButtonText, { color: colors.error }]}>
                {cancelling ? 'Cancelling...' : 'Cancel Order'}
              </Text>
            </TouchableOpacity>
          )}
          
          {order.status === 'delivered' && (
            <TouchableOpacity
              style={[styles.reorderButton, { backgroundColor: colors.primary }]}
              onPress={handleReorder}
            >
              <Ionicons name="refresh" size={20} color={colors.white} />
              <Text style={[styles.reorderButtonText, { color: colors.white }]}>
                Reorder Items
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING[4],
  },
  loadingText: {
    marginTop: SPACING[2],
    fontSize: FONTS.sizes.base,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING[4],
  },
  errorTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
    marginTop: SPACING[2],
    marginBottom: SPACING[1],
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: FONTS.sizes.base,
    textAlign: 'center',
    marginBottom: SPACING[4],
    lineHeight: 24,
  },
  retryButton: {
    paddingHorizontal: SPACING[4],
    paddingVertical: SPACING[2],
    borderRadius: RADIUS.lg,
  },
  retryButtonText: {
    fontSize: FONTS.sizes.base,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING[4],
    paddingVertical: SPACING[2],
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
  },
  headerTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  statusCard: {
    margin: SPACING[4],
    padding: SPACING[4],
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    ...SHADOWS.md,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING[2],
  },
  orderId: {
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: SPACING[2],
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  statusText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '600',
  },
  orderDate: {
    fontSize: FONTS.sizes.sm,
    marginBottom: SPACING[1],
  },
  deliveryTime: {
    fontSize: FONTS.sizes.xs,
  },
  section: {
    marginHorizontal: SPACING[4],
    marginBottom: SPACING[4],
    padding: SPACING[4],
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    ...SHADOWS.md,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
    marginBottom: SPACING[3],
  },
  restaurantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  restaurantName: {
    fontSize: FONTS.sizes.base,
    fontWeight: '600',
    marginLeft: SPACING[2],
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: SPACING[2],
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: FONTS.sizes.base,
    fontWeight: '600',
    marginBottom: SPACING[1],
  },
  itemPrice: {
    fontSize: FONTS.sizes.sm,
    marginBottom: SPACING[1],
  },
  specialInstructions: {
    fontSize: FONTS.sizes.xs,
    fontStyle: 'italic',
  },
  itemTotal: {
    fontSize: FONTS.sizes.base,
    fontWeight: '600',
  },
  addressInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  addressDetails: {
    marginLeft: SPACING[2],
    flex: 1,
  },
  addressTitle: {
    fontSize: FONTS.sizes.base,
    fontWeight: '600',
    marginBottom: SPACING[1],
  },
  addressText: {
    fontSize: FONTS.sizes.sm,
    lineHeight: 20,
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentMethod: {
    fontSize: FONTS.sizes.base,
    fontWeight: '600',
    marginLeft: SPACING[2],
  },
  priceBreakdown: {
    backgroundColor: '#F9FAFB',
    borderRadius: RADIUS.md,
    padding: SPACING[3],
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING[2],
  },
  priceLabel: {
    fontSize: FONTS.sizes.sm,
  },
  priceValue: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    paddingTop: SPACING[2],
    marginTop: SPACING[2],
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: FONTS.sizes.base,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: FONTS.sizes.base,
    fontWeight: 'bold',
  },
  actionButtons: {
    paddingHorizontal: SPACING[4],
    paddingBottom: SPACING[4],
    gap: SPACING[3],
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING[3],
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    gap: SPACING[2],
  },
  cancelButtonText: {
    fontSize: FONTS.sizes.base,
    fontWeight: '600',
  },
  reorderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING[3],
    borderRadius: RADIUS.lg,
    gap: SPACING[2],
  },
  reorderButtonText: {
    fontSize: FONTS.sizes.base,
    fontWeight: '600',
  },
});

export default OrderDetailScreen;
