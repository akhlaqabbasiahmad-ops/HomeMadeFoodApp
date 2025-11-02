import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    Alert,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { useAppDispatch, useAppSelector } from '../../store';
import { clearCart, removeFromCart, updateQuantity, updateSpecialInstructions } from '../../store/cartSlice';
import { CartItem } from '../../types';

interface CartScreenProps {
  navigation: any;
}

const CartScreen: React.FC<CartScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { items, totalItems, totalAmount, deliveryFee, tax, grandTotal } = useAppSelector(
    (state) => state.cart
  );
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      Alert.alert(
        'Remove Item',
        'Are you sure you want to remove this item from your cart?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Remove', style: 'destructive', onPress: () => dispatch(removeFromCart(itemId)) },
        ]
      );
    } else {
      dispatch(updateQuantity({ itemId, quantity: newQuantity }));
    }
  };

  const handleSpecialInstructions = (itemId: string, instructions: string) => {
    dispatch(updateSpecialInstructions({ itemId, instructions }));
  };

  const handleApplyPromo = () => {
    const validPromoCodes = {
      'SAVE10': 10, // 10% discount
      'FIRST20': 20, // 20% discount for first order
      'DELIVERY5': 5, // $5 off delivery
    };

    const discount = validPromoCodes[promoCode.toUpperCase() as keyof typeof validPromoCodes];
    
    if (discount) {
      if (promoCode.toUpperCase() === 'DELIVERY5') {
        setPromoDiscount(5);
      } else {
        setPromoDiscount((totalAmount * discount) / 100);
      }
      Alert.alert('Success!', `Promo code applied! You saved $${discount}`);
    } else {
      Alert.alert('Invalid Code', 'Please enter a valid promo code.');
      setPromoDiscount(0);
    }
  };

  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: () => dispatch(clearCart()) },
      ]
    );
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      Alert.alert('Empty Cart', 'Please add some items to your cart before checkout.');
      return;
    }
    navigation.navigate('Checkout', {
      orderSummary: {
        items,
        totalAmount,
        deliveryFee,
        tax,
        promoDiscount,
        grandTotal: grandTotal - promoDiscount,
        promoCode: promoDiscount > 0 ? promoCode : null,
      },
    });
  };

  const CartItemComponent = ({ item }: { item: CartItem }) => {
    const [instructionsExpanded, setInstructionsExpanded] = useState(false);
    const [localInstructions, setLocalInstructions] = useState(item.specialInstructions || '');

    const handleInstructionsSubmit = () => {
      handleSpecialInstructions(item.id, localInstructions);
      setInstructionsExpanded(false);
    };

    return (
      <View style={styles.cartItem}>
        <View style={styles.itemImageContainer}>
          <Image source={{ uri: item.image }} style={styles.itemImage} />
        </View>
        
        <View style={styles.itemContent}>
          <View style={styles.itemHeader}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.itemRestaurant} numberOfLines={1}>{item.restaurantName}</Text>
              <View style={styles.priceContainer}>
                <Text style={styles.itemPrice}>
                  ${(typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0).toFixed(2)}
                </Text>
                {(() => {
                  const price = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0;
                  const origPrice = typeof item.originalPrice === 'number' ? item.originalPrice : parseFloat(item.originalPrice) || 0;
                  return origPrice > 0 && origPrice > price && (
                    <Text style={styles.originalPrice}>${origPrice.toFixed(2)}</Text>
                  );
                })()}
              </View>
            </View>
            
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => dispatch(removeFromCart(item.id))}
            >
              <Ionicons name="trash-outline" size={20} color={COLORS.error} />
            </TouchableOpacity>
          </View>

          <View style={styles.itemControls}>
            <View style={styles.quantityControls}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => handleQuantityChange(item.id, item.quantity - 1)}
              >
                <Ionicons name="remove" size={16} color={COLORS.primary} />
              </TouchableOpacity>
              
              <Text style={styles.quantityText}>{item.quantity}</Text>
              
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => handleQuantityChange(item.id, item.quantity + 1)}
              >
                <Ionicons name="add" size={16} color={COLORS.primary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.itemTotal}>${item.totalPrice.toFixed(2)}</Text>
          </View>

          {/* Special Instructions */}
          <TouchableOpacity
            style={styles.instructionsToggle}
            onPress={() => setInstructionsExpanded(!instructionsExpanded)}
          >
            <Ionicons name="chatbubble-outline" size={16} color={COLORS.primary} />
            <Text style={styles.instructionsText}>
              {item.specialInstructions ? 'Edit Instructions' : 'Add Special Instructions'}
            </Text>
            <Ionicons
              name={instructionsExpanded ? 'chevron-up' : 'chevron-down'}
              size={16}
              color={COLORS.gray[500]}
            />
          </TouchableOpacity>

          {instructionsExpanded && (
            <View style={styles.instructionsInput}>
              <TextInput
                style={styles.instructionsTextInput}
                placeholder="Any special requests? (e.g., extra spicy, no onions...)"
                value={localInstructions}
                onChangeText={setLocalInstructions}
                multiline
                maxLength={200}
              />
              <View style={styles.instructionsActions}>
                <TouchableOpacity
                  style={styles.instructionsCancel}
                  onPress={() => {
                    setInstructionsExpanded(false);
                    setLocalInstructions(item.specialInstructions || '');
                  }}
                >
                  <Text style={styles.instructionsCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.instructionsSave}
                  onPress={handleInstructionsSubmit}
                >
                  <Text style={styles.instructionsSaveText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {item.specialInstructions && !instructionsExpanded && (
            <View style={styles.existingInstructions}>
              <Text style={styles.existingInstructionsText}>
                Note: {item.specialInstructions}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Your Cart</Text>
          <View style={styles.headerRight} />
        </View>

        <View style={styles.emptyCart}>
          <View style={styles.emptyCartIcon}>
            <Ionicons name="basket-outline" size={80} color={COLORS.gray[400]} />
          </View>
          <Text style={styles.emptyCartTitle}>Your cart is empty</Text>
          <Text style={styles.emptyCartSubtitle}>
            Looks like you haven't added anything to your cart yet
          </Text>
          <TouchableOpacity
            style={styles.continueShoppingButton}
            onPress={() => navigation.navigate('Home')}
          >
            <LinearGradient
              colors={[COLORS.primary, COLORS.primaryDark]}
              style={styles.continueShoppingGradient}
            >
              <Text style={styles.continueShoppingText}>Continue Shopping</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const finalTotal = grandTotal - promoDiscount;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Cart ({totalItems})</Text>
        <TouchableOpacity
          style={styles.clearButton}
          onPress={handleClearCart}
        >
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Cart Items */}
        <FlatList
          data={items}
          renderItem={({ item }) => <CartItemComponent item={item} />}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          style={styles.cartList}
        />

        {/* Promo Code Section */}
        <View style={styles.promoSection}>
          <Text style={styles.promoTitle}>Have a promo code?</Text>
          <View style={styles.promoInput}>
            <TextInput
              style={styles.promoTextInput}
              placeholder="Enter promo code"
              value={promoCode}
              onChangeText={setPromoCode}
              autoCapitalize="characters"
            />
            <TouchableOpacity
              style={styles.applyButton}
              onPress={handleApplyPromo}
            >
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.summarySection}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal ({totalItems} items)</Text>
            <Text style={styles.summaryValue}>${totalAmount.toFixed(2)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>${deliveryFee.toFixed(2)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax & Fees</Text>
            <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
          </View>

          {promoDiscount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, styles.discountLabel]}>
                Promo ({promoCode})
              </Text>
              <Text style={[styles.summaryValue, styles.discountValue]}>
                -${promoDiscount.toFixed(2)}
              </Text>
            </View>
          )}

          <View style={styles.summaryDivider} />

          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${finalTotal.toFixed(2)}</Text>
          </View>
        </View>
      </View>

      {/* Checkout Button */}
      <View style={styles.checkoutContainer}>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={handleCheckout}
        >
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryDark]}
            style={styles.checkoutGradient}
          >
            <Text style={styles.checkoutText}>
              Proceed to Checkout • ${finalTotal.toFixed(2)}
            </Text>
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
  clearButton: {
    padding: SPACING.xs,
  },
  clearButtonText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.error,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  cartList: {
    flex: 1,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.base,
    marginVertical: SPACING.xs,
    borderRadius: RADIUS.lg,
    padding: SPACING.sm,
    ...SHADOWS.sm,
  },
  itemImageContainer: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  itemContent: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: FONTS.sizes.base,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  itemRestaurant: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  itemPrice: {
    fontSize: FONTS.sizes.base,
    fontWeight: '600',
    color: COLORS.primary,
  },
  originalPrice: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text.secondary,
    textDecorationLine: 'line-through',
  },
  removeButton: {
    padding: SPACING.xs,
  },
  itemControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray[100],
    borderRadius: RADIUS.md,
    padding: 2,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.xs,
  },
  quantityText: {
    fontSize: FONTS.sizes.base,
    fontWeight: '600',
    color: COLORS.text.primary,
    paddingHorizontal: SPACING.sm,
    minWidth: 40,
    textAlign: 'center',
  },
  itemTotal: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  instructionsToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
    gap: SPACING.xs,
  },
  instructionsText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.primary,
    fontWeight: '500',
    flex: 1,
  },
  instructionsInput: {
    marginTop: SPACING.sm,
    padding: SPACING.sm,
    backgroundColor: COLORS.gray[50],
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  instructionsTextInput: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text.primary,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  instructionsActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  instructionsCancel: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
  },
  instructionsCancelText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text.secondary,
  },
  instructionsSave: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.sm,
  },
  instructionsSaveText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.white,
    fontWeight: '600',
  },
  existingInstructions: {
    marginTop: SPACING.sm,
    padding: SPACING.sm,
    backgroundColor: COLORS.blue?.[50] || '#e3f2fd',
    borderRadius: RADIUS.sm,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  existingInstructionsText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text.primary,
    fontStyle: 'italic',
  },
  promoSection: {
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.base,
    marginVertical: SPACING.sm,
    padding: SPACING.base,
    borderRadius: RADIUS.lg,
    ...SHADOWS.sm,
  },
  promoTitle: {
    fontSize: FONTS.sizes.base,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  promoInput: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  promoTextInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.gray[300],
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.sm,
    fontSize: FONTS.sizes.sm,
    color: COLORS.text.primary,
  },
  applyButton: {
    height: 48,
    paddingHorizontal: SPACING.base,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.white,
    fontWeight: '600',
  },
  summarySection: {
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.base,
    marginBottom: SPACING.sm,
    padding: SPACING.base,
    borderRadius: RADIUS.lg,
    ...SHADOWS.sm,
  },
  summaryTitle: {
    fontSize: FONTS.sizes.base,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING.base,
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
  checkoutContainer: {
    padding: SPACING.base,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
  },
  checkoutButton: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.md,
  },
  checkoutGradient: {
    paddingVertical: SPACING.base,
    alignItems: 'center',
  },
  checkoutText: {
    fontSize: FONTS.sizes.base,
    fontWeight: '600',
    color: COLORS.white,
  },
  emptyCart: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
  },
  emptyCartIcon: {
    marginBottom: SPACING.xl,
  },
  emptyCartTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  emptyCartSubtitle: {
    fontSize: FONTS.sizes.base,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  continueShoppingButton: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.md,
  },
  continueShoppingGradient: {
    paddingVertical: SPACING.base,
    paddingHorizontal: SPACING.xl,
    alignItems: 'center',
  },
  continueShoppingText: {
    fontSize: FONTS.sizes.base,
    fontWeight: '600',
    color: COLORS.white,
  },
});

export default CartScreen;