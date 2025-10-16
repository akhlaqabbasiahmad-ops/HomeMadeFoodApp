import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    Alert,
    FlatList,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { COLORS } from '../../constants/theme';
import { useCart } from '../../hooks/useCart';
import { RootStackParamList } from '../../types';

type OrderScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Order'>;

const OrderScreen: React.FC = () => {
  const navigation = useNavigation<OrderScreenNavigationProp>();
  const { items, total, clearCart } = useCart();
  const [selectedAddress, setSelectedAddress] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState(0);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock address data
  const addresses = [
    {
      id: '1',
      title: 'Home',
      address: '123 Main Street, Downtown, City 12345',
      isDefault: true,
    },
    {
      id: '2',
      title: 'Work',
      address: '456 Business Ave, Corporate District, City 67890',
      isDefault: false,
    },
  ];

  // Mock payment methods
  const paymentMethods = [
    {
      id: '1',
      type: 'card',
      title: 'Credit Card',
      subtitle: '**** **** **** 1234',
      icon: 'card-outline',
    },
    {
      id: '2',
      type: 'cash',
      title: 'Cash on Delivery',
      subtitle: 'Pay when your order arrives',
      icon: 'cash-outline',
    },
  ];

  const deliveryFee = 2.99;
  const tax = total * 0.1; // 10% tax
  const grandTotal = total + deliveryFee + tax;

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      Alert.alert('Error', 'Your cart is empty');
      return;
    }

    setIsProcessing(true);

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay
      
      // Create order object (this would normally be sent to your API)
      const orderData = {
        items,
        totalAmount: grandTotal,
        deliveryAddress: addresses[selectedAddress].address,
        paymentMethod: paymentMethods[selectedPayment],
        specialInstructions,
        estimatedDeliveryTime: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
      };

      console.log('Order placed:', orderData);

      // Clear cart and show success
      clearCart();
      
      Alert.alert(
        'Order Placed Successfully!',
        `Your order will be delivered to ${addresses[selectedAddress].title} in approximately 30-45 minutes.`,
        [
          {
            text: 'Track Order',
            onPress: () => {
              // Navigate to order tracking screen (not implemented)
              navigation.navigate('Main' as any);
            },
          },
          {
            text: 'Continue Shopping',
            onPress: () => navigation.navigate('Main' as any),
            style: 'cancel',
          },
        ]
      );
    } catch {
      Alert.alert('Error', 'Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const OrderItem = ({ item }: { item: any }) => (
    <View style={styles.orderItem}>
      <View style={styles.orderItemImage}>
        <Ionicons name="image" size={40} color="#ccc" />
      </View>
      
      <View style={styles.orderItemDetails}>
        <Text style={styles.orderItemName}>{item.name}</Text>
        <Text style={styles.orderItemRestaurant}>{item.restaurantName}</Text>
        <Text style={styles.orderItemPrice}>${item.price}</Text>
      </View>
      
      <View style={styles.orderItemQuantity}>
        <Text style={styles.quantityText}>Qty: {item.quantity}</Text>
        <Text style={styles.itemTotal}>${(item.price * item.quantity).toFixed(2)}</Text>
      </View>
    </View>
  );

  const AddressCard = ({ address, index, isSelected }: { address: any, index: number, isSelected: boolean }) => (
    <TouchableOpacity
      style={[styles.addressCard, isSelected && styles.selectedCard]}
      onPress={() => setSelectedAddress(index)}
    >
      <View style={styles.addressHeader}>
        <View style={styles.addressTitleRow}>
          <Ionicons name="location-outline" size={20} color={COLORS.primary} />
          <Text style={styles.addressTitle}>{address.title}</Text>
          {address.isDefault && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultText}>Default</Text>
            </View>
          )}
        </View>
        <Ionicons 
          name={isSelected ? 'radio-button-on' : 'radio-button-off'} 
          size={20} 
          color={isSelected ? COLORS.primary : '#ccc'} 
        />
      </View>
      <Text style={styles.addressText}>{address.address}</Text>
    </TouchableOpacity>
  );

  const PaymentCard = ({ payment, index, isSelected }: { payment: any, index: number, isSelected: boolean }) => (
    <TouchableOpacity
      style={[styles.paymentCard, isSelected && styles.selectedCard]}
      onPress={() => setSelectedPayment(index)}
    >
      <View style={styles.paymentHeader}>
        <View style={styles.paymentInfo}>
          <Ionicons name={payment.icon as any} size={24} color={COLORS.primary} />
          <View style={styles.paymentDetails}>
            <Text style={styles.paymentTitle}>{payment.title}</Text>
            <Text style={styles.paymentSubtitle}>{payment.subtitle}</Text>
          </View>
        </View>
        <Ionicons 
          name={isSelected ? 'radio-button-on' : 'radio-button-off'} 
          size={20} 
          color={isSelected ? COLORS.primary : '#ccc'} 
        />
      </View>
    </TouchableOpacity>
  );

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Checkout</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.emptyContainer}>
          <Ionicons name="bag-outline" size={80} color="#ccc" />
          <Text style={styles.emptyText}>No items to checkout</Text>
          <TouchableOpacity
            style={styles.continueShoppingButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.continueShoppingText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Checkout</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Order Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary ({items.length} items)</Text>
          <FlatList
            data={items}
            renderItem={({ item }) => <OrderItem item={item} />}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>

        {/* Delivery Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          {addresses.map((address, index) => (
            <AddressCard
              key={address.id}
              address={address}
              index={index}
              isSelected={selectedAddress === index}
            />
          ))}
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          {paymentMethods.map((payment, index) => (
            <PaymentCard
              key={payment.id}
              payment={payment}
              index={index}
              isSelected={selectedPayment === index}
            />
          ))}
        </View>

        {/* Special Instructions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Special Instructions (Optional)</Text>
          <TextInput
            style={styles.instructionsInput}
            placeholder="Any special requests for your order..."
            value={specialInstructions}
            onChangeText={setSpecialInstructions}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* Price Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Details</Text>
          <View style={styles.priceBreakdown}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Subtotal</Text>
              <Text style={styles.priceValue}>${total.toFixed(2)}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Delivery Fee</Text>
              <Text style={styles.priceValue}>${deliveryFee.toFixed(2)}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Tax</Text>
              <Text style={styles.priceValue}>${tax.toFixed(2)}</Text>
            </View>
            <View style={[styles.priceRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${grandTotal.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Add some bottom padding */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Place Order Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.placeOrderButton, isProcessing && styles.processingButton]}
          onPress={handlePlaceOrder}
          disabled={isProcessing}
        >
          <LinearGradient colors={['#FF6B35', '#E64A19']} style={styles.orderGradient}>
            {isProcessing ? (
              <View style={styles.processingContainer}>
                <Text style={styles.processingText}>Processing Order...</Text>
              </View>
            ) : (
              <Text style={styles.orderButtonText}>
                Place Order • ${grandTotal.toFixed(2)}
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
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  orderItemImage: {
    width: 50,
    height: 50,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  orderItemDetails: {
    flex: 1,
  },
  orderItemName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  orderItemRestaurant: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  orderItemPrice: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
  orderItemQuantity: {
    alignItems: 'flex-end',
  },
  quantityText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  itemTotal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  addressCard: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  selectedCard: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  addressTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  defaultBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  defaultText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
  },
  addressText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  paymentCard: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentDetails: {
    marginLeft: 12,
  },
  paymentTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  paymentSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  instructionsInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#333',
    height: 80,
  },
  priceBreakdown: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
  },
  priceValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 8,
    marginTop: 8,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  bottomContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: 'white',
  },
  placeOrderButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  processingButton: {
    opacity: 0.7,
  },
  orderGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  orderButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  processingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  processingText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 20,
    marginBottom: 30,
  },
  continueShoppingButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  continueShoppingText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default OrderScreen;