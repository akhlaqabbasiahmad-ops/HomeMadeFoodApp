import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FONTS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { useColors, useTheme } from '../../contexts/ThemeContext';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightAction?: React.ReactNode;
  gradient?: boolean;
  backgroundColor?: string;
  statusBarStyle?: 'light' | 'dark';
}

const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  subtitle,
  showBackButton = false,
  onBackPress,
  rightAction,
  gradient = false,
  backgroundColor,
  statusBarStyle = 'dark',
}) => {
  const { theme } = useTheme();
  const colors = useColors();
  // Determine colors based on gradient and theme
  const headerBackgroundColor = backgroundColor || colors.card;
  const textColor = gradient ? colors.white : colors.text.primary;
  const subtitleColor = gradient ? colors.white : colors.text.secondary;
  const backButtonBgColor = gradient ? 'rgba(255, 255, 255, 0.2)' : colors.border;

  const HeaderContent = () => (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar 
        barStyle={gradient ? 'light-content' : (statusBarStyle === 'light' ? 'light-content' : 'dark-content')}
        backgroundColor={gradient ? colors.primary : headerBackgroundColor}
        translucent={false}
      />
      <View style={[styles.header, { backgroundColor: headerBackgroundColor }]}>
        <View style={styles.leftSection}>
          {showBackButton && (
            <TouchableOpacity style={[styles.backButton, { backgroundColor: backButtonBgColor }]} onPress={onBackPress}>
              <Ionicons 
                name="arrow-back" 
                size={24} 
                color={textColor} 
              />
            </TouchableOpacity>
          )}
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: textColor }]}>
              {title}
            </Text>
            {subtitle && (
              <Text style={[styles.subtitle, { color: subtitleColor }]}>
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
        colors={[colors.primary, colors.secondary]}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <HeaderContent />
      </LinearGradient>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: headerBackgroundColor }]}>
      <HeaderContent />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...SHADOWS.sm,
    elevation: 4,
  },
  safeArea: {
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING[4],
    paddingVertical: SPACING[3],
    minHeight: 56,
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
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING[3],
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
    lineHeight: 24,
  },
  subtitle: {
    fontSize: FONTS.sizes.sm,
    opacity: 0.8,
    marginTop: SPACING[0.5],
    fontWeight: '400',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default ScreenHeader;