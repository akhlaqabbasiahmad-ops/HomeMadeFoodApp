import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { Order } from '../../hooks/useOrders';

interface OrderCardProps {
  order: Order;
  onPress: () => void;
  onReorder?: () => void;
  onCancel?: () => void;
}

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onPress,
  onReorder,
  onCancel,
}) => {
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return COLORS.warning;
      case 'confirmed':
        return COLORS.info;
      case 'preparing':
        return COLORS.accent;
      case 'ready':
        return COLORS.secondary;
      case 'delivered':
        return COLORS.success;
      case 'cancelled':
        return COLORS.error;
      default:
        return COLORS.gray[500];
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'Order Placed';
      case 'confirmed':
        return 'Confirmed';
      case 'preparing':
        return 'Preparing';
      case 'ready':
        return 'Ready';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const canCancel = ['pending', 'confirmed'].includes(order.status);
  const canReorder = ['delivered', 'cancelled'].includes(order.status);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.orderNumber}>#{order.orderNumber}</Text>
          <Text style={styles.restaurantName}>{order.restaurantName}</Text>
          <Text style={styles.orderDate}>{formatDate(order.orderDate)}</Text>
        </View>
        
        <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(order.status)}20` }]}>
          <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
            {getStatusText(order.status)}
          </Text>
        </View>
      </View>

      <View style={styles.itemsContainer}>
        <View style={styles.itemsPreview}>
          {order.items.slice(0, 2).map((item, index) => (
            <View key={item.id} style={styles.itemRow}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
              </View>
              <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
            </View>
          ))}
          
          {order.items.length > 2 && (
            <Text style={styles.moreItems}>
              +{order.items.length - 2} more item{order.items.length - 2 > 1 ? 's' : ''}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>
            ${(order.totalAmount + order.deliveryFee).toFixed(2)}
          </Text>
        </View>

        <View style={styles.actions}>
          {canReorder && onReorder && (
            <TouchableOpacity style={styles.actionButton} onPress={onReorder}>
              <Ionicons name="refresh-outline" size={16} color={COLORS.primary} />
              <Text style={styles.actionButtonText}>Reorder</Text>
            </TouchableOpacity>
          )}
          
          {canCancel && onCancel && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.cancelButton]} 
              onPress={onCancel}
            >
              <Ionicons name="close-outline" size={16} color={COLORS.error} />
              <Text style={[styles.actionButtonText, { color: COLORS.error }]}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {['preparing', 'ready'].includes(order.status) && (
        <View style={styles.progressContainer}>
          <LinearGradient
            colors={[getStatusColor(order.status), `${getStatusColor(order.status)}80`]}
            style={styles.progressBar}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
          <Text style={styles.estimatedTime}>
            Estimated: {order.estimatedTime} min
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.card,
    marginVertical: SPACING[2],
    ...SHADOWS.card,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: SPACING[4],
    paddingBottom: SPACING[3],
  },
  headerLeft: {
    flex: 1,
  },
  orderNumber: {
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: SPACING[0.5],
  },
  restaurantName: {
    fontSize: FONTS.sizes.base,
    color: COLORS.text.secondary,
    marginBottom: SPACING[0.5],
  },
  orderDate: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text.tertiary,
  },
  statusBadge: {
    paddingHorizontal: SPACING[3],
    paddingVertical: SPACING[1],
    borderRadius: RADIUS.badge,
  },
  statusText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
  },
  itemsContainer: {
    paddingHorizontal: SPACING[4],
  },
  itemsPreview: {
    gap: SPACING[2],
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING[3],
  },
  itemImage: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.sm,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '500',
    color: COLORS.text.primary,
  },
  itemQuantity: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.text.tertiary,
  },
  itemPrice: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  moreItems: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text.secondary,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: SPACING[1],
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING[4],
    paddingTop: SPACING[3],
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  totalContainer: {
    alignItems: 'flex-start',
  },
  totalLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text.secondary,
  },
  totalAmount: {
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING[2],
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING[3],
    paddingVertical: SPACING[2],
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.primarySoft,
    gap: SPACING[1],
  },
  cancelButton: {
    backgroundColor: COLORS.errorSoft,
  },
  actionButtonText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.primary,
  },
  progressContainer: {
    paddingHorizontal: SPACING[4],
    paddingBottom: SPACING[4],
  },
  progressBar: {
    height: 4,
    borderRadius: RADIUS.xs,
    marginBottom: SPACING[2],
  },
  estimatedTime: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
});

export default OrderCard;