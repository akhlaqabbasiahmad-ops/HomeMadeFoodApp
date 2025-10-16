import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { useAppDispatch, useAppSelector } from '../../store';
import { clearCart } from '../../store/cartSlice';
import { placeOrder } from '../../store/orderSlice';
import { Address, CartItem } from '../../types';



const CheckoutScreen = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart);
  
  // Create order summary from cart
  const orderSummary = {
    items: cart.items || [],
    totalAmount: cart.total || 0,
    deliveryFee: cart.deliveryFee || 0,
    tax: cart.tax || 0,
    promoDiscount: 0, // TODO: Get from promo code logic
    grandTotal: cart.grandTotal || 0,
    promoCode: null
  };

  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string>('card');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock addresses for demonstration
  const mockAddresses: Address[] = [
    {
      id: '1',
      title: 'Home',
      address: '123 Main Street, Downtown, City 12345',
      latitude: 40.7128,
      longitude: -74.0060,
      isDefault: true,
    },
    {
      id: '2',
      title: 'Work',
      address: '456 Business Avenue, Corporate District, City 12345',
      latitude: 40.7589,
      longitude: -73.9851,
      isDefault: false,
    },
  ];

  const paymentMethods = [
    { id: 'card', title: 'Credit/Debit Card', icon: 'card-outline', subtitle: '**** **** **** 1234' },
    { id: 'cash', title: 'Cash on Delivery', icon: 'cash-outline', subtitle: 'Pay when food arrives' },
    { id: 'digital', title: 'Digital Wallet', icon: 'phone-portrait-outline', subtitle: 'Apple Pay, Google Pay' },
  ];

  React.useEffect(() => {
    // Set default address if available
    const defaultAddress = mockAddresses.find(addr => addr.isDefault);
    if (defaultAddress) {
      setSelectedAddress(defaultAddress);
    }
  }, []);

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      Alert.alert('Address Required', 'Please select a delivery address.');
      return;
    }

    if (!selectedPayment) {
      Alert.alert('Payment Required', 'Please select a payment method.');
      return;
    }

    setIsProcessing(true);

    try {
      const orderData = {
        items: orderSummary.items,
        deliveryAddress: selectedAddress,
        paymentMethod: selectedPayment,
        totalAmount: orderSummary.totalAmount,
        deliveryFee: orderSummary.deliveryFee,
        tax: orderSummary.tax,
        grandTotal: orderSummary.grandTotal,
        promoDiscount: orderSummary.promoDiscount,
        promoCode: orderSummary.promoCode,
        deliveryInstructions: deliveryInstructions,
      };

      console.log('🛒 Placing order:', orderData);
      
      const result = await dispatch(placeOrder(orderData));
      
      if (placeOrder.fulfilled.match(result)) {
        // Order placed successfully
        dispatch(clearCart());
        
        const orderId = result.payload?.id || 'ORD' + Date.now();
        
        Alert.alert(
          'Order Placed Successfully!',
          `Your order #${orderId} has been confirmed. You will receive a confirmation email shortly.`,
          [
            {
              text: 'Track Order',
              onPress: () => router.push('/orders'),
            },
            {
              text: 'Continue Shopping',
              onPress: () => router.push('/'),
            },
          ]
        );
      } else {
        // Order failed
        const errorMessage = result.payload as string || 'Something went wrong. Please try again.';
        Alert.alert('Order Failed', errorMessage);
      }
    } catch (error: any) {
      console.error('Order placement error:', error);
      Alert.alert('Order Failed', 'Something went wrong. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const AddressCard = ({ address, isSelected, onSelect }: { 
    address: Address; 
    isSelected: boolean; 
    onSelect: () => void; 
  }) => (
    <TouchableOpacity
      style={[styles.addressCard, isSelected && styles.selectedAddressCard]}
      onPress={onSelect}
    >
      <View style={styles.addressHeader}>
        <View style={styles.addressIcon}>
          <Ionicons
            name={address.isDefault ? 'home' : 'business'}
            size={20}
            color={isSelected ? COLORS.primary : COLORS.gray[500]}
          />
        </View>
        <View style={styles.addressInfo}>
          <Text style={[styles.addressTitle, isSelected && styles.selectedText]}>
            {address.title}
          </Text>
          <Text style={[styles.addressText, isSelected && styles.selectedSubText]}>
            {address.address}
          </Text>
        </View>
        <View style={styles.radioButton}>
          <View style={[styles.radioOuter, isSelected && styles.radioSelected]}>
            {isSelected && <View style={styles.radioInner} />}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const PaymentCard = ({ payment, isSelected, onSelect }: { 
    payment: typeof paymentMethods[0]; 
    isSelected: boolean; 
    onSelect: () => void; 
  }) => (
    <TouchableOpacity
      style={[styles.paymentCard, isSelected && styles.selectedPaymentCard]}
      onPress={onSelect}
    >
      <View style={styles.paymentHeader}>
        <View style={styles.paymentIcon}>
          <Ionicons
            name={payment.icon as any}
            size={24}
            color={isSelected ? COLORS.primary : COLORS.gray[500]}
          />
        </View>
        <View style={styles.paymentInfo}>
          <Text style={[styles.paymentTitle, isSelected && styles.selectedText]}>
            {payment.title}
          </Text>
          <Text style={[styles.paymentSubtitle, isSelected && styles.selectedSubText]}>
            {payment.subtitle}
          </Text>
        </View>
        <View style={styles.radioButton}>
          <View style={[styles.radioOuter, isSelected && styles.radioSelected]}>
            {isSelected && <View style={styles.radioInner} />}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const OrderItem = ({ item }: { item: CartItem }) => (
    <View style={styles.orderItem}>
      <Image source={{ uri: item.image }} style={styles.orderItemImage} />
      <View style={styles.orderItemInfo}>
        <Text style={styles.orderItemName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.orderItemDetails}>
          Qty: {item.quantity} × ${item.price.toFixed(2)}
        </Text>
        {item.specialInstructions && (
          <Text style={styles.orderItemInstructions}>
            Note: {item.specialInstructions}
          </Text>
        )}
      </View>
      <Text style={styles.orderItemPrice}>${item.totalPrice.toFixed(2)}</Text>
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
          <Ionicons name="arrow-back" size={24} color={COLORS.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Delivery Address Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
            <TouchableOpacity style={styles.addButton}>
              <Ionicons name="add" size={20} color={COLORS.primary} />
              <Text style={styles.addButtonText}>Add New</Text>
            </TouchableOpacity>
          </View>

          {mockAddresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              isSelected={selectedAddress?.id === address.id}
              onSelect={() => setSelectedAddress(address)}
            />
          ))}
        </View>

        {/* Order Items Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items ({orderSummary.items.length})</Text>
          
          {orderSummary.items.map((item) => (
            <OrderItem key={item.id} item={item} />
          ))}
        </View>

        {/* Payment Method Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          
          {paymentMethods.map((payment) => (
            <PaymentCard
              key={payment.id}
              payment={payment}
              isSelected={selectedPayment === payment.id}
              onSelect={() => setSelectedPayment(payment.id)}
            />
          ))}
        </View>

        {/* Delivery Instructions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Instructions (Optional)</Text>
          <TextInput
            style={styles.instructionsInput}
            placeholder="e.g., Ring the bell, Leave at door, Call when arriving..."
            value={deliveryInstructions}
            onChangeText={setDeliveryInstructions}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Subtotal ({orderSummary.items.length} items)
            </Text>
            <Text style={styles.summaryValue}>${orderSummary.totalAmount.toFixed(2)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>${orderSummary.deliveryFee.toFixed(2)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax & Fees</Text>
            <Text style={styles.summaryValue}>${orderSummary.tax.toFixed(2)}</Text>
          </View>

          {orderSummary.promoDiscount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, styles.discountLabel]}>
                Promo ({orderSummary.promoCode})
              </Text>
              <Text style={[styles.summaryValue, styles.discountValue]}>
                -${orderSummary.promoDiscount.toFixed(2)}
              </Text>
            </View>
          )}

          <View style={styles.summaryDivider} />

          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>${orderSummary.grandTotal.toFixed(2)}</Text>
          </View>

          <View style={styles.estimatedTime}>
            <Ionicons name="time-outline" size={16} color={COLORS.primary} />
            <Text style={styles.estimatedTimeText}>
              Estimated delivery: 25-35 minutes
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Place Order Button */}
      <View style={styles.orderButtonContainer}>
        <TouchableOpacity
          style={[styles.orderButton, isProcessing && styles.orderButtonDisabled]}
          onPress={handlePlaceOrder}
          disabled={isProcessing}
        >
          <LinearGradient
            colors={isProcessing 
              ? [COLORS.gray[400], COLORS.gray[500]] 
              : [COLORS.primary, COLORS.primaryDark]
            }
            style={styles.orderGradient}
          >
            {isProcessing ? (
              <Text style={styles.orderButtonText}>Processing Order...</Text>
            ) : (
              <Text style={styles.orderButtonText}>
                Place Order • ${orderSummary.grandTotal.toFixed(2)}
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
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
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  backButton: {
    padding: SPACING.xs,
  },
  headerTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.base,
    marginVertical: SPACING.sm,
    padding: SPACING.base,
    borderRadius: RADIUS.lg,
    ...SHADOWS.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.base,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.base,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  addButtonText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.primary,
    fontWeight: '500',
  },
  addressCard: {
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.gray[200],
    marginBottom: SPACING.sm,
    overflow: 'hidden',
  },
  selectedAddressCard: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '08',
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
  },
  addressIcon: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  addressInfo: {
    flex: 1,
  },
  addressTitle: {
    fontSize: FONTS.sizes.base,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  addressText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text.secondary,
    lineHeight: 18,
  },
  selectedText: {
    color: COLORS.primary,
  },
  selectedSubText: {
    color: COLORS.primary + 'CC',
  },
  radioButton: {
    marginLeft: SPACING.sm,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.gray[300],
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: COLORS.primary,
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  paymentCard: {
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.gray[200],
    marginBottom: SPACING.sm,
    overflow: 'hidden',
  },
  selectedPaymentCard: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '08',
  },
  paymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
  },
  paymentIcon: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentTitle: {
    fontSize: FONTS.sizes.base,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  paymentSubtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text.secondary,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  orderItemImage: {
    width: 50,
    height: 50,
    borderRadius: RADIUS.md,
    marginRight: SPACING.sm,
  },
  orderItemInfo: {
    flex: 1,
  },
  orderItemName: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  orderItemDetails: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.text.secondary,
    marginBottom: 2,
  },
  orderItemInstructions: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.primary,
    fontStyle: 'italic',
  },
  orderItemPrice: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  instructionsInput: {
    borderWidth: 1,
    borderColor: COLORS.gray[300],
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    fontSize: FONTS.sizes.sm,
    color: COLORS.text.primary,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  summaryLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text.secondary,
  },
  summaryValue: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text.primary,
    fontWeight: '500',
  },
  discountLabel: {
    color: COLORS.success,
  },
  discountValue: {
    color: COLORS.success,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: COLORS.gray[200],
    marginVertical: SPACING.sm,
  },
  totalLabel: {
    fontSize: FONTS.sizes.base,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  totalValue: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  estimatedTime: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
    padding: SPACING.sm,
    backgroundColor: COLORS.blue?.[50] || '#e3f2fd',
    borderRadius: RADIUS.md,
    gap: SPACING.xs,
  },
  estimatedTimeText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.primary,
    fontWeight: '500',
  },
  orderButtonContainer: {
    padding: SPACING.base,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
  },
  orderButton: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.md,
  },
  orderButtonDisabled: {
    opacity: 0.7,
  },
  orderGradient: {
    paddingVertical: SPACING.base,
    alignItems: 'center',
  },
  orderButtonText: {
    fontSize: FONTS.sizes.base,
    fontWeight: '600',
    color: COLORS.white,
  },
});

export default CheckoutScreen;