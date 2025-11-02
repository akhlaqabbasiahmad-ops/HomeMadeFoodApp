import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import ScreenHeader from '../../components/common/ScreenHeader';
import { useColors, useTheme } from '../../contexts/ThemeContext';

const SettingsScreen: React.FC = () => {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const colors = useColors();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);

  const settingsActions = [
    {
      icon: 'notifications-outline' as keyof typeof Ionicons.glyphMap,
      title: 'Push Notifications',
      description: 'Receive order updates and promotions',
      onPress: () => {},
      color: colors.primary,
      rightComponent: (
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor={colors.white}
        />
      ),
    },
    {
      icon: 'location-outline' as keyof typeof Ionicons.glyphMap,
      title: 'Location Services',
      description: 'Allow location access for delivery',
      onPress: () => {},
      color: colors.secondary,
      rightComponent: (
        <Switch
          value={locationEnabled}
          onValueChange={setLocationEnabled}
          trackColor={{ false: colors.border, true: colors.secondary }}
          thumbColor={colors.white}
        />
      ),
    },
    {
      icon: 'moon-outline' as keyof typeof Ionicons.glyphMap,
      title: 'Dark Mode',
      description: 'Switch between light and dark themes',
      onPress: toggleTheme,
      color: colors.text.secondary,
      rightComponent: (
        <Switch
          value={theme === 'dark'}
          onValueChange={toggleTheme}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor={colors.white}
        />
      ),
    },
    {
      icon: 'language-outline' as keyof typeof Ionicons.glyphMap,
      title: 'Language',
      description: 'English',
      onPress: () => Alert.alert('Language', 'Language selection coming soon!'),
      color: colors.accent,
    },
    {
      icon: 'shield-checkmark-outline' as keyof typeof Ionicons.glyphMap,
      title: 'Privacy Policy',
      description: 'Read our privacy policy',
      onPress: () => Alert.alert('Privacy Policy', 'Privacy policy coming soon!'),
      color: colors.info,
    },
    {
      icon: 'document-text-outline' as keyof typeof Ionicons.glyphMap,
      title: 'Terms of Service',
      description: 'Read our terms of service',
      onPress: () => Alert.alert('Terms of Service', 'Terms of service coming soon!'),
      color: colors.warning,
    },
  ];

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will clear all cached data. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Success', 'Cache cleared successfully!');
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. Are you sure you want to delete your account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Account Deleted', 'Your account has been deleted.');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader 
        title="Settings" 
        subtitle="Customize your experience"
        showBackButton
        onBackPress={() => router.back()}
      />
      
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Settings Actions */}
        <View style={styles.menuSection}>
          {settingsActions.map((action, index) => (
            <View key={index} style={[styles.actionCard, { backgroundColor: colors.card }]}>
              <TouchableOpacity
                style={styles.actionContent}
                onPress={action.onPress}
                activeOpacity={0.7}
              >
                <View style={[styles.iconContainer, { backgroundColor: `${action.color}15` }]}>
                  <Ionicons name={action.icon} size={24} color={action.color} />
                </View>
                
                <View style={styles.textContainer}>
                  <Text style={[styles.actionTitle, { color: colors.text.primary }]}>{action.title}</Text>
                  <Text style={[styles.actionDescription, { color: colors.text.secondary }]}>{action.description}</Text>
                </View>
                
                <View style={styles.rightContainer}>
                  {action.rightComponent || (
                    <Ionicons 
                      name="chevron-forward" 
                      size={20} 
                      color={colors.text.tertiary} 
                    />
                  )}
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Danger Zone */}
        <View style={[styles.dangerSection, { borderTopColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Danger Zone</Text>
          
          <TouchableOpacity 
            style={[styles.dangerButton, { backgroundColor: colors.card }]}
            onPress={handleClearCache}
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={24} color={colors.warning} />
            <Text style={[styles.dangerText, { color: colors.warning }]}>Clear Cache</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.dangerButton, { backgroundColor: colors.card }]}
            onPress={handleDeleteAccount}
            activeOpacity={0.7}
          >
            <Ionicons name="warning-outline" size={24} color={colors.error} />
            <Text style={[styles.dangerText, { color: colors.error }]}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  menuSection: {
    paddingHorizontal: 20,
    gap: 16,
    marginBottom: 32,
  },
  actionCard: {
    borderRadius: 16,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  rightContainer: {
    marginLeft: 16,
  },
  dangerSection: {
    paddingHorizontal: 20,
    paddingVertical: 32,
    borderTopWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  dangerText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SettingsScreen;
