import { Ionicons } from '@expo/vector-icons';
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

// Mock hook for now since useAuth might not be implemented yet
const useAuthMock = () => ({
  user: { name: 'John Doe', email: 'john.doe@example.com' },
  isAuthenticated: true,
  logout: () => console.log('Logout'),
});

const ProfileScreen: React.FC = () => {
  const { user, isAuthenticated } = useAuthMock();

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => console.log('User logged out'),
        },
      ]
    );
  };

  const profileActions = [
    {
      icon: 'person-outline' as keyof typeof Ionicons.glyphMap,
      title: 'Edit Profile',
      description: 'Update your personal information',
      onPress: () => console.log('Edit Profile'),
      color: COLORS.primary,
    },
    {
      icon: 'location-outline' as keyof typeof Ionicons.glyphMap,
      title: 'Delivery Addresses',
      description: 'Manage your delivery locations',
      onPress: () => console.log('Delivery Addresses'),
      color: COLORS.secondary,
    },
    {
      icon: 'card-outline' as keyof typeof Ionicons.glyphMap,
      title: 'Payment Methods',
      description: 'Manage cards and payment options',
      onPress: () => console.log('Payment Methods'),
      color: COLORS.accent,
    },
    {
      icon: 'heart-outline' as keyof typeof Ionicons.glyphMap,
      title: 'Favorite Foods',
      description: 'View your liked items',
      onPress: () => console.log('Favorites'),
      color: COLORS.error,
    },
    {
      icon: 'notifications-outline' as keyof typeof Ionicons.glyphMap,
      title: 'Notifications',
      description: 'Manage notification preferences',
      onPress: () => console.log('Notifications'),
      color: COLORS.tertiary,
    },
    {
      icon: 'help-circle-outline' as keyof typeof Ionicons.glyphMap,
      title: 'Help & Support',
      description: 'Get help and contact support',
      onPress: () => console.log('Help & Support'),
      color: COLORS.info,
    },
  ];

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
              onPress={() => console.log('Navigate to login')}
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
            <Ionicons name="person-circle" size={80} color={COLORS.primary} />
          </View>
          <Text style={styles.name}>{user?.name || 'John Doe'}</Text>
          <Text style={styles.email}>{user?.email || 'john.doe@example.com'}</Text>
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
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  profileInfo: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: COLORS.text.secondary,
  },
  menuSection: {
    paddingHorizontal: 20,
    gap: 12,
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
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.error,
  },
});

export default ProfileScreen;