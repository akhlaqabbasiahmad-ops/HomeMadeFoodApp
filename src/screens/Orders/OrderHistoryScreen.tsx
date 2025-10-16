import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { useAppDispatch, useAppSelector } from '../../store';
import { addTestOrders, fetchOrderHistory } from '../../store/orderSlice';
import { Order, OrderStatus } from '../../types';

const OrderHistoryScreen = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { orderHistory, isLoading, error } = useAppSelector((state) => state.order);
  const [refreshing, setRefreshing] = useState(false);

  // Debug logging
  console.log('🏠 OrderHistory Screen - orderHistory length:', orderHistory?.length);
  console.log('🏠 OrderHistory Screen - isLoading:', isLoading);
  console.log('🏠 OrderHistory Screen - error:', error);

  // Fetch order history when screen is focused
  useFocusEffect(
    useCallback(() => {
      console.log('🏠 Screen focused, fetching order history...');
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
        return COLORS.warning;
      case 'confirmed':
        return COLORS.info;
      case 'preparing':
        return COLORS.primary;
      case 'ready':
        return COLORS.success;
      case 'on_the_way':
        return COLORS.secondary;
      case 'delivered':
        return COLORS.success;
      case 'cancelled':
        return COLORS.error;
      default:
        return COLORS.gray[500];
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

  const renderOrderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => {
        // Navigate to order details
        console.log('View order details:', item.id);
      }}
    >
      <View style={styles.orderHeader}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderId}>Order #{item.id.substring(0, 8)}</Text>
          <Text style={styles.restaurantName}>{item.restaurantName}</Text>
          <Text style={styles.orderDate}>{formatDate(item.orderDate)}</Text>
        </View>
        
        <View style={styles.orderStatus}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {getStatusText(item.status)}
            </Text>
          </View>
          <Text style={styles.orderTotal}>${item.grandTotal.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.orderDetails}>
        <Text style={styles.itemCount}>
          {item.items?.length || 0} {(item.items?.length || 0) === 1 ? 'item' : 'items'}
        </Text>
        
        <View style={styles.orderActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="receipt-outline" size={16} color={COLORS.primary} />
            <Text style={styles.actionText}>Details</Text>
          </TouchableOpacity>
          
          {item.status === 'delivered' && (
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="refresh-outline" size={16} color={COLORS.secondary} />
              <Text style={styles.actionText}>Reorder</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="receipt-outline" size={64} color={COLORS.gray[400]} />
      <Text style={styles.emptyTitle}>No Orders Yet</Text>
      <Text style={styles.emptyText}>
        Start browsing and place your first order to see your order history here.
      </Text>
      {/* Debug information */}
      <Text style={{ fontSize: 12, color: COLORS.gray[600], marginTop: 10, textAlign: 'center' }}>
        Debug: orderHistory length: {orderHistory?.length || 0}, isLoading: {isLoading.toString()}, error: {error || 'none'}
      </Text>
      <TouchableOpacity
        style={{
          backgroundColor: COLORS.primary,
          padding: 10,
          borderRadius: 5,
          marginTop: 10,
        }}
        onPress={() => dispatch(addTestOrders())}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>Add Test Orders (Debug)</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.browseButton}
        onPress={() => router.push('/')}
      >
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryDark]}
          style={styles.browseGradient}
        >
          <Text style={styles.browseText}>Browse Menu</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color={COLORS.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order History</Text>
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
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
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
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    backgroundColor: COLORS.white,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.gray[100],
  },
  headerTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  placeholder: {
    width: 40,
  },
  listContainer: {
    padding: SPACING.base,
    flexGrow: 1,
  },
  orderCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.base,
    marginBottom: SPACING.base,
    ...SHADOWS.md,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  restaurantName: {
    fontSize: FONTS.sizes.base,
    color: COLORS.text.secondary,
    marginBottom: 2,
  },
  orderDate: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text.tertiary,
  },
  orderStatus: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.xs,
  },
  statusText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '600',
  },
  orderTotal: {
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemCount: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text.secondary,
  },
  orderActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.gray[100],
  },
  actionText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.text.secondary,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
  },
  emptyTitle: {
    fontSize: FONTS.sizes['2xl'],
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginTop: SPACING.base,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    fontSize: FONTS.sizes.base,
    color: COLORS.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.xl,
  },
  browseButton: {
    width: 200,
  },
  browseGradient: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.base,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
  },
  browseText: {
    fontSize: FONTS.sizes.base,
    fontWeight: 'bold',
    color: COLORS.white,
  },
});

export default OrderHistoryScreen;