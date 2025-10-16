import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightAction?: React.ReactNode;
  gradient?: boolean;
  backgroundColor?: string;
}

const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  subtitle,
  showBackButton = false,
  onBackPress,
  rightAction,
  gradient = true,
  backgroundColor = COLORS.white,
}) => {
  const HeaderContent = () => (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.leftSection}>
          {showBackButton && (
            <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
              <Ionicons 
                name="arrow-back" 
                size={24} 
                color={gradient ? COLORS.white : COLORS.text.primary} 
              />
            </TouchableOpacity>
          )}
          <View style={styles.titleContainer}>
            <Text style={[
              styles.title,
              { color: gradient ? COLORS.white : COLORS.text.primary }
            ]}>
              {title}
            </Text>
            {subtitle && (
              <Text style={[
                styles.subtitle,
                { color: gradient ? COLORS.white : COLORS.text.secondary }
              ]}>
                {subtitle}
              </Text>
            )}
          </View>
        </View>
        
        {rightAction && (
          <View style={styles.rightSection}>
            {rightAction}
          </View>
        )}
      </View>
    </SafeAreaView>
  );

  if (gradient) {
    return (
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryLight]}
        style={styles.container}
      >
        <HeaderContent />
      </LinearGradient>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <HeaderContent />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...SHADOWS.sm,
  },
  safeArea: {
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING[4],
    paddingVertical: SPACING[4],
    minHeight: 60,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING[3],
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: FONTS.sizes['2xl'],
    fontWeight: 'bold',
    lineHeight: 28,
  },
  subtitle: {
    fontSize: FONTS.sizes.sm,
    opacity: 0.9,
    marginTop: SPACING[0.5],
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default ScreenHeader;