import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import {
    ActivityIndicator,
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
import { useAuth } from '../../hooks/useAuth';
import { apiService } from '../../services/apiService';
import { useAppDispatch, useAppSelector } from '../../store';
import { clearCart } from '../../store/cartSlice';
import { placeOrder } from '../../store/orderSlice';
import { Address, CartItem } from '../../types';



const CheckoutScreen = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart);
  const { isAuthenticated } = useAuth();
  const user = useAppSelector((state) => state.auth.user);
  
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

  // Fetch addresses from API or user profile
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(false);

  const paymentMethods = [
    { id: 'card', title: 'Credit/Debit Card', icon: 'card-outline', subtitle: '**** **** **** 1234' },
    { id: 'cash', title: 'Cash on Delivery', icon: 'cash-outline', subtitle: 'Pay when food arrives' },
    { id: 'digital', title: 'Digital Wallet', icon: 'phone-portrait-outline', subtitle: 'Apple Pay, Google Pay' },
  ];

  // Function to fetch addresses from API
  // Uses /users/{userId}/addresses endpoint with Authorization header
  const fetchAddresses = useCallback(async () => {
    if (!isAuthenticated || !user?.id) {
      setAddresses([]);
      return;
    }

    setAddressesLoading(true);
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
        
        // Set default address if available, but don't override user selection
        setSelectedAddress(prev => {
          if (prev && normalizedAddresses.find(a => a.id === prev.id)) {
            return prev; // Keep current selection if it still exists
          }
          // Otherwise select default or first address
          return normalizedAddresses.find(addr => addr.isDefault) || normalizedAddresses[0] || null;
        });
      } else {
        setAddresses([]);
      }
    } catch (error) {
      if (__DEV__) {
        console.error('Error fetching addresses:', error);
      }
      setAddresses([]);
    } finally {
      setAddressesLoading(false);
    }
  }, [isAuthenticated, user?.id]);

  // Fetch addresses when authenticated
  React.useEffect(() => {
    fetchAddresses();
  }, [isAuthenticated, user?.id, fetchAddresses]);

  // Refresh addresses when screen comes into focus (e.g., returning from address management)
  useFocusEffect(
    useCallback(() => {
      if (isAuthenticated) {
        fetchAddresses();
      }
    }, [isAuthenticated, fetchAddresses])
  );

  React.useEffect(() => {
    // Check if user is authenticated, redirect to login if not
    if (!isAuthenticated) {
      Alert.alert(
        'Login Required',
        'Please login to proceed with checkout.',
        [
          {
            text: 'Login',
            onPress: () => {
              router.replace('/login');
            }
          }
        ]
      );
      return;
    }
  }, [isAuthenticated]);

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      Alert.alert(
        'Address Required',
        'Please select a delivery address or add a new one to continue.',
        [
          {
            text: 'Add Address',
            onPress: () => router.push('/addresses'),
            style: 'default',
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
      return;
    }

    if (!selectedPayment) {
      Alert.alert('Payment Required', 'Please select a payment method.');
      return;
    }

    if (!selectedAddress.address || selectedAddress.address.trim() === '') {
      Alert.alert('Invalid Address', 'Please select a valid delivery address.');
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

  const OrderItem = ({ item }: { item: CartItem }) => {
    const price = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0;
    const totalPrice = typeof item.totalPrice === 'number' ? item.totalPrice : parseFloat(item.totalPrice) || 0;
    
    return (
      <View style={styles.orderItem}>
        <Image source={{ uri: item.image }} style={styles.orderItemImage} />
        <View style={styles.orderItemInfo}>
          <Text style={styles.orderItemName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.orderItemDetails}>
            Qty: {item.quantity} × ${price.toFixed(2)}
          </Text>
          {item.specialInstructions && (
            <Text style={styles.orderItemInstructions}>
              Note: {item.specialInstructions}
            </Text>
          )}
        </View>
        <Text style={styles.orderItemPrice}>${totalPrice.toFixed(2)}</Text>
      </View>
    );
  };

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
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => router.push('/addresses')}
            >
              <Ionicons name="add" size={20} color={COLORS.primary} />
              <Text style={styles.addButtonText}>Add New</Text>
            </TouchableOpacity>
          </View>

          {addressesLoading ? (
            <View style={styles.emptyAddressContainer}>
              <ActivityIndicator size="small" color={COLORS.primary} />
              <Text style={[styles.emptyAddressText, { marginTop: SPACING.base }]}>Loading addresses...</Text>
            </View>
          ) : addresses.length === 0 ? (
            <View style={styles.emptyAddressContainer}>
              <Ionicons name="location-outline" size={48} color={COLORS.text.tertiary} />
              <Text style={styles.emptyAddressText}>No delivery address found</Text>
              <Text style={styles.emptyAddressSubtext}>Please add a delivery address to continue</Text>
              <TouchableOpacity 
                style={styles.addAddressButton}
                onPress={() => router.push('/addresses')}
              >
                <Text style={styles.addAddressButtonText}>Add Address</Text>
              </TouchableOpacity>
            </View>
          ) : (
            addresses.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                isSelected={selectedAddress?.id === address.id}
                onSelect={() => setSelectedAddress(address)}
              />
            ))
          )}
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
  emptyAddressContainer: {
    paddingVertical: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyAddressText: {
    fontSize: FONTS.sizes.base,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginTop: SPACING.base,
    marginBottom: SPACING.xs,
  },
  emptyAddressSubtext: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: SPACING.base,
  },
  addAddressButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.lg,
    marginTop: SPACING.sm,
  },
  addAddressButtonText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.base,
    fontWeight: '600',
  },
});

export default CheckoutScreen;