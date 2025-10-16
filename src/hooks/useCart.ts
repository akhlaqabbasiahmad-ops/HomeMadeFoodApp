import { useAppDispatch, useAppSelector } from '../store';
import {
    addToCart as addToCartAction,
    clearCart as clearCartAction,
    removeFromCart as removeFromCartAction,
    setDeliveryFee as setDeliveryFeeAction,
    updateQuantity as updateQuantityAction,
    updateSpecialInstructions as updateSpecialInstructionsAction,
} from '../store/cartSlice';
import { FoodItem, UseCartReturn } from '../types';

export const useCart = (): UseCartReturn => {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart);

  const addToCart = (item: FoodItem, quantity: number = 1, specialInstructions?: string) => {
    dispatch(addToCartAction({
      foodItem: item,
      quantity,
      specialInstructions,
    }));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    dispatch(updateQuantityAction({ itemId, quantity }));
  };

  const removeFromCart = (itemId: string) => {
    dispatch(removeFromCartAction(itemId));
  };

  const clearCart = () => {
    dispatch(clearCartAction());
  };

  const updateSpecialInstructions = (itemId: string, instructions: string) => {
    dispatch(updateSpecialInstructionsAction({ itemId, instructions }));
  };

  const setDeliveryFee = (fee: number) => {
    dispatch(setDeliveryFeeAction(fee));
  };

  return {
    items: cart.items,
    total: cart.totalAmount,
    itemCount: cart.totalItems,
    deliveryFee: cart.deliveryFee,
    tax: cart.tax,
    grandTotal: cart.grandTotal,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    updateSpecialInstructions,
    setDeliveryFee,
  };
};