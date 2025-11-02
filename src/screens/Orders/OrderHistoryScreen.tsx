import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    Alert,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FONTS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { useColors, useTheme } from '../../contexts/ThemeContext';
import { useAppDispatch, useAppSelector } from '../../store';
import { cancelOrder, fetchOrderHistory, reorderItems } from '../../store/orderSlice';
import { Order, OrderStatus } from '../../types';

const OrderHistoryScreen = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { theme } = useTheme();
  const colors = useColors();
  const { orderHistory, isLoading, error } = useAppSelector((state) => state.order);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch order history when screen is focused
  useFocusEffect(
    useCallback(() => {
      dispatch(fetchOrderHistory());
    }, [dispatch])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await dispatch(fetchOrderHistory());
    setRefreshing(false);
  }, [dispatch]);

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

  const handleViewDetails = (orderId: string) => {
    router.push({
      pathname: '/order-detail',
      params: { id: orderId }
    });
  };

  const handleReorder = async (orderId: string) => {
    try {
      await dispatch(reorderItems(orderId));
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

  const handleCancelOrder = async (orderId: string) => {
    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this order?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(cancelOrder(orderId));
              Alert.alert('Success', 'Order has been cancelled');
            } catch (error) {
              Alert.alert('Error', 'Failed to cancel order');
            }
          },
        },
      ]
    );
  };

  const canCancelOrder = (status: OrderStatus): boolean => {
    return ['pending', 'confirmed'].includes(status);
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

  const renderOrderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity
      style={[styles.orderCard, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={() => handleViewDetails(item.id)}
    >
      <View style={styles.orderHeader}>
        <View style={styles.orderInfo}>
          <Text style={[styles.orderId, { color: colors.text.primary }]}>
            Order #{item.id.substring(0, 8)}
          </Text>
          <Text style={[styles.restaurantName, { color: colors.text.secondary }]}>
            {item.restaurantName}
          </Text>
          <Text style={[styles.orderDate, { color: colors.text.tertiary }]}>
            {formatDate(item.orderDate)}
          </Text>
        </View>
        
        <View style={styles.orderStatus}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {getStatusText(item.status)}
            </Text>
          </View>
          <Text style={[styles.orderTotal, { color: colors.text.primary }]}>
            ${item.grandTotal.toFixed(2)}
          </Text>
        </View>
      </View>

      <View style={styles.orderDetails}>
        <Text style={[styles.itemCount, { color: colors.text.secondary }]}>
          {item.items?.length || 0} {(item.items?.length || 0) === 1 ? 'item' : 'items'}
        </Text>
        
        <View style={styles.orderActions}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.background }]}
            onPress={() => handleViewDetails(item.id)}
          >
            <Ionicons name="receipt-outline" size={16} color={colors.primary} />
            <Text style={[styles.actionText, { color: colors.text.secondary }]}>Details</Text>
          </TouchableOpacity>
          
          {item.status === 'delivered' && (
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: colors.background }]}
              onPress={() => handleReorder(item.id)}
            >
              <Ionicons name="refresh-outline" size={16} color={colors.secondary} />
              <Text style={[styles.actionText, { color: colors.text.secondary }]}>Reorder</Text>
            </TouchableOpacity>
          )}

          {canCancelOrder(item.status) && (
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: colors.error + '20' }]}
              onPress={() => handleCancelOrder(item.id)}
            >
              <Ionicons name="close-circle-outline" size={16} color={colors.error} />
              <Text style={[styles.actionText, { color: colors.error }]}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="receipt-outline" size={64} color={colors.border} />
      <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>No Orders Yet</Text>
      <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
        Start browsing and place your first order to see your order history here.
      </Text>
      <TouchableOpacity
        style={styles.browseButton}
        onPress={() => router.push('/')}
      >
        <LinearGradient
          colors={[colors.primary, colors.primaryDark || colors.primary]}
          style={styles.browseGradient}
        >
          <Text style={styles.browseText}>Browse Menu</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

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
        <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Order History</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Order List */}
      <FlatList
        data={orderHistory}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={!isLoading ? renderEmptyState : null}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  listContainer: {
    padding: SPACING[4],
    flexGrow: 1,
  },
  orderCard: {
    borderRadius: RADIUS.lg,
    padding: SPACING[4],
    marginBottom: SPACING[4],
    borderWidth: 1,
    ...SHADOWS.md,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING[2],
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  restaurantName: {
    fontSize: FONTS.sizes.base,
    marginBottom: 2,
  },
  orderDate: {
    fontSize: FONTS.sizes.sm,
  },
  orderStatus: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: SPACING[2],
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING[1],
  },
  statusText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '600',
  },
  orderTotal: {
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemCount: {
    fontSize: FONTS.sizes.sm,
  },
  orderActions: {
    flexDirection: 'row',
    gap: SPACING[2],
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: SPACING[2],
    paddingVertical: SPACING[1],
    borderRadius: RADIUS.sm,
  },
  actionText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING[6],
  },
  emptyTitle: {
    fontSize: FONTS.sizes['2xl'],
    fontWeight: 'bold',
    marginTop: SPACING[4],
    marginBottom: SPACING[2],
  },
  emptyText: {
    fontSize: FONTS.sizes.base,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING[6],
  },
  browseButton: {
    width: 200,
  },
  browseGradient: {
    paddingHorizontal: SPACING[6],
    paddingVertical: SPACING[4],
    borderRadius: RADIUS.lg,
    alignItems: 'center',
  },
  browseText: {
    fontSize: FONTS.sizes.base,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default OrderHistoryScreen;