import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS } from '../../constants/theme';

interface AdminHomeScreenProps {
  navigation: any;
}

const AdminHomeScreen: React.FC<AdminHomeScreenProps> = ({ navigation }) => {
  const adminActions = [
    {
      title: 'Add Category',
      description: 'Create a new food category',
      icon: 'list-circle',
      color: COLORS.secondary,
      screen: 'AddCategory',
    },
    {
      title: 'Add Food Item',
      description: 'Create a new food item',
      icon: 'restaurant',
      color: COLORS.primary,
      screen: 'AddFood',
    },
    {
      title: 'View Categories',
      description: 'Browse all categories',
      icon: 'grid',
      color: COLORS.accent,
      onPress: async () => {
        // You can add navigation to a categories list screen here
        navigation.navigate('Home');
      },
    },
    {
      title: 'View Food Items',
      description: 'Browse all food items',
      icon: 'fast-food',
      color: COLORS.tertiary,
      onPress: async () => {
        // You can add navigation to a food items list screen here
        navigation.navigate('Home');
      },
    },
  ];

  const handleActionPress = (action: typeof adminActions[0]) => {
    if (action.onPress) {
      action.onPress();
    } else if (action.screen) {
      navigation.navigate(action.screen);
    }
  };

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
        <Text style={styles.headerTitle}>Admin Panel</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.welcomeCard}>
            <Text style={styles.welcomeTitle}>Welcome, Admin!</Text>
            <Text style={styles.welcomeSubtitle}>
              Manage your food categories and items from here
            </Text>
          </View>

          <View style={styles.actionsGrid}>
            {adminActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.actionCard, { borderLeftColor: action.color }]}
                onPress={() => handleActionPress(action)}
              >
                <View style={styles.actionHeader}>
                  <View style={[styles.actionIcon, { backgroundColor: `${action.color}15` }]}>
                    <Ionicons name={action.icon as any} size={24} color={action.color} />
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={COLORS.gray?.[400]} />
                </View>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionDescription}>{action.description}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Ionicons name="information-circle" size={24} color={COLORS.info} />
              <Text style={styles.infoTitle}>Quick Tips</Text>
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoItem}>• Use clear, descriptive names for categories</Text>
              <Text style={styles.infoItem}>• Add high-quality image URLs for food items</Text>
              <Text style={styles.infoItem}>• Include accurate preparation times</Text>
              <Text style={styles.infoItem}>• Mark allergens and dietary preferences correctly</Text>
            </View>
          </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray?.[200],
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: FONTS?.sizes?.lg || 18,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  placeholder: {
    width: 40,
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  welcomeCard: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.gray?.[100],
  },
  welcomeTitle: {
    fontSize: FONTS?.sizes?.xl || 20,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: FONTS?.sizes?.base || 16,
    color: COLORS.text.secondary,
    lineHeight: 24,
  },
  actionsGrid: {
    marginBottom: 24,
  },
  actionCard: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.gray?.[100],
    borderLeftWidth: 4,
  },
  actionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionTitle: {
    fontSize: FONTS?.sizes?.lg || 18,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: FONTS?.sizes?.sm || 14,
    color: COLORS.text.secondary,
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: COLORS.info + '08',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.info + '20',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: FONTS?.sizes?.lg || 18,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginLeft: 12,
  },
  infoContent: {
    paddingLeft: 36,
  },
  infoItem: {
    fontSize: FONTS?.sizes?.sm || 14,
    color: COLORS.text.secondary,
    lineHeight: 22,
    marginBottom: 8,
  },
});

export default AdminHomeScreen;