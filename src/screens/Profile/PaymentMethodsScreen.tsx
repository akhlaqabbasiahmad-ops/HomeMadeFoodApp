import React from 'react';
import PlaceholderScreen from './PlaceholderScreen';

const PaymentMethodsScreen: React.FC = () => {
  return (
    <PlaceholderScreen
      title="Payment Methods"
      subtitle="Manage your payment options"
      icon="card-outline"
      description="Add, edit, and manage your payment methods for seamless checkout."
    />
  );
};

export default PaymentMethodsScreen;
