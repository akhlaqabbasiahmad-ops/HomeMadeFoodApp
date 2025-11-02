import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import ActionCard from '../../components/common/ActionCard';
import CustomButton from '../../components/common/CustomButton';
import EmptyState from '../../components/common/EmptyState';
import ScreenHeader from '../../components/common/ScreenHeader';
import { COLORS } from '../../constants/theme';
import { useAuth } from '../../hooks/useAuth';

const ProfileScreen: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => logout(),
        },
      ]
    );
  };

  // Base profile actions available to all users
  const baseProfileActions = [
    {
      icon: 'person-outline' as keyof typeof Ionicons.glyphMap,
      title: 'Edit Profile',
      description: 'Update your personal information',
      onPress: () => router.push('/edit-profile'),
      color: COLORS.primary,
    },
    {
      icon: 'location-outline' as keyof typeof Ionicons.glyphMap,
      title: 'Delivery Addresses',
      description: 'Manage your delivery locations',
      onPress: () => router.push('/addresses'),
      color: COLORS.secondary,
    },
    {
      icon: 'card-outline' as keyof typeof Ionicons.glyphMap,
      title: 'Payment Methods',
      description: 'Manage cards and payment options',
      onPress: () => router.push('/payment-methods'),
      color: COLORS.accent,
    },
    {
      icon: 'heart-outline' as keyof typeof Ionicons.glyphMap,
      title: 'Favorite Foods',
      description: 'View your liked items',
      onPress: () => router.push('/favorites'),
      color: COLORS.error,
    },
    {
      icon: 'receipt-outline' as keyof typeof Ionicons.glyphMap,
      title: 'Order History',
      description: 'View your past orders',
      onPress: () => router.push('/(tabs)/orders'),
      color: COLORS.tertiary,
    },
    {
      icon: 'restaurant-outline' as keyof typeof Ionicons.glyphMap,
      title: "Today's Meal",
      description: 'Get a personalized meal suggestion for today',
      onPress: () => router.push('/today-meal'),
      color: COLORS.primary,
    },
    {
      icon: 'notifications-outline' as keyof typeof Ionicons.glyphMap,
      title: 'Notifications',
      description: 'Manage notification preferences',
      onPress: () => router.push('/notifications'),
      color: COLORS.info,
    },
    {
      icon: 'help-circle-outline' as keyof typeof Ionicons.glyphMap,
      title: 'Help & Support',
      description: 'Get help and contact support',
      onPress: () => router.push('/help'),
      color: COLORS.warning,
    },
    {
      icon: 'settings-outline' as keyof typeof Ionicons.glyphMap,
      title: 'Settings',
      description: 'App preferences and configuration',
      onPress: () => router.push('/settings'),
      color: COLORS.gray?.[600],
    },
  ];

  // Admin-only actions
  const adminActions = [
    {
      icon: 'restaurant-outline' as keyof typeof Ionicons.glyphMap,
      title: 'Manage Food Items',
      description: 'Add, edit, and delete food items',
      onPress: () => router.push('/admin-home'),
      color: '#FF6B35', // Orange color for admin
    },
    {
      icon: 'add-circle-outline' as keyof typeof Ionicons.glyphMap,
      title: 'Add Food Item',
      description: 'Create new food items for the menu',
      onPress: () => router.push('/add-food'),
      color: '#4CAF50', // Green color for add
    },
    {
      icon: 'list-outline' as keyof typeof Ionicons.glyphMap,
      title: 'Add Category',
      description: 'Create new food categories',
      onPress: () => router.push('/add-category'),
      color: '#2196F3', // Blue color for category
    },
  ];

  // Combine actions based on user role
  const profileActions = user?.role === 'admin' 
    ? [...baseProfileActions, ...adminActions]
    : baseProfileActions;

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <ScreenHeader title="Profile" subtitle="Your account" />
        <EmptyState
          icon="log-in-outline"
          title="Please Sign In"
          subtitle="Access your profile"
          description="Sign in to view and manage your profile, orders, and preferences."
          action={
            <CustomButton
              title="Sign In"
              onPress={() => router.push('/login')}
            />
          }
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader 
        title="Profile" 
        subtitle="Manage your account"
      />
      
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Profile Info */}
        <View style={styles.profileInfo}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarBackground}>
              <Ionicons name="person" size={40} color={COLORS.white} />
            </View>
          </View>
          <Text style={styles.name}>{user?.name || 'Guest User'}</Text>
          <Text style={styles.email}>{user?.email || 'guest@example.com'}</Text>
          {user?.phone && (
            <Text style={styles.phone}>{user.phone}</Text>
          )}
          {user?.role === 'admin' && (
            <View style={styles.adminBadge}>
              <Ionicons name="shield-checkmark" size={16} color={COLORS.white} />
              <Text style={styles.adminText}>Admin</Text>
            </View>
          )}
        </View>

        {/* Profile Actions */}
        <View style={styles.menuSection}>
          {profileActions.map((action, index) => (
            <ActionCard
              key={index}
              icon={action.icon}
              title={action.title}
              description={action.description}
              onPress={action.onPress}
              color={action.color}
            />
          ))}
        </View>

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Ionicons name="log-out-outline" size={24} color={COLORS.error} />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  profileInfo: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: COLORS.white,
    marginBottom: 20,
    borderRadius: 20,
    marginHorizontal: 20,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarContainer: {
    marginBottom: 20,
  },
  avatarBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  email: {
    fontSize: 16,
    color: COLORS.text.secondary,
    marginBottom: 4,
    textAlign: 'center',
  },
  phone: {
    fontSize: 14,
    color: COLORS.text.tertiary,
    textAlign: 'center',
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B35',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 12,
    shadowColor: '#FF6B35',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  adminText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.white,
  },
  menuSection: {
    paddingHorizontal: 20,
    gap: 16,
    marginBottom: 20,
  },
  logoutSection: {
    paddingHorizontal: 20,
    paddingVertical: 32,
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: '#FECACA',
    shadowColor: COLORS.error,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.error,
  },
});

export default ProfileScreen;