import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, FoodItem } from '../types';

interface CartState {
  items: CartItem[];
  itemCount: number;
  total: number;
  deliveryFee: number;
  tax: number;
  grandTotal: number;
}

const initialState: CartState = {
  items: [],
  itemCount: 0,
  total: 0,
  deliveryFee: 0,
  tax: 0,
  grandTotal: 0,
};

const calculateTotals = (items: CartItem[], deliveryFee: number = 0) => {
  const itemCount = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const total = items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  const tax = total * 0.1; // 10% tax
  const grandTotal = total + deliveryFee + tax;

  return { itemCount, total, tax, grandTotal };
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ foodItem: FoodItem; quantity: number; specialInstructions?: string }>) => {
      const { foodItem, quantity, specialInstructions } = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.id === foodItem.id);

      if (existingItemIndex >= 0) {
        // Update existing item
        state.items[existingItemIndex].quantity += quantity;
        state.items[existingItemIndex].totalPrice = state.items[existingItemIndex].quantity * (foodItem.price || 0);
        if (specialInstructions) {
          state.items[existingItemIndex].specialInstructions = specialInstructions;
        }
      } else {
        // Add new item
        const newItem: CartItem = {
          ...foodItem,
          quantity,
          totalPrice: quantity * (foodItem.price || 0),
          specialInstructions,
        };
        state.items.push(newItem);
      }

      // Recalculate totals
      const totals = calculateTotals(state.items, state.deliveryFee);
      Object.assign(state, totals);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      
      // Recalculate totals
      const totals = calculateTotals(state.items, state.deliveryFee);
      Object.assign(state, totals);
    },
    updateQuantity: (state, action: PayloadAction<{ itemId: string; quantity: number }>) => {
      const { itemId, quantity } = action.payload;
      const itemIndex = state.items.findIndex(item => item.id === itemId);

      if (itemIndex >= 0) {
        if (quantity <= 0) {
          // Remove item if quantity is 0 or less
          state.items.splice(itemIndex, 1);
        } else {
          // Update quantity and total price
          state.items[itemIndex].quantity = quantity;
          state.items[itemIndex].totalPrice = quantity * state.items[itemIndex].price;
        }

        // Recalculate totals
        const totals = calculateTotals(state.items, state.deliveryFee);
        Object.assign(state, totals);
      }
    },
    updateSpecialInstructions: (state, action: PayloadAction<{ itemId: string; instructions: string }>) => {
      const { itemId, instructions } = action.payload;
      const itemIndex = state.items.findIndex(item => item.id === itemId);

      if (itemIndex >= 0) {
        state.items[itemIndex].specialInstructions = instructions;
      }
    },
    setDeliveryFee: (state, action: PayloadAction<number>) => {
      state.deliveryFee = action.payload;
      
      // Recalculate grand total
      const totals = calculateTotals(state.items, action.payload);
      Object.assign(state, totals);
    },
    clearCart: (state) => {
      return initialState;
    },
  },
});

export const { 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  updateSpecialInstructions,
  setDeliveryFee,
  clearCart 
} = cartSlice.actions;

export default cartSlice.reducer;