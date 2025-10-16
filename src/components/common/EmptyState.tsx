import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { ReactNode } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  description: string;
  action?: ReactNode;
  backgroundColor?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  subtitle,
  description,
  action,
  backgroundColor = COLORS.background,
}) => {
  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryLight]}
            style={styles.iconGradient}
          >
            <Ionicons name={icon} size={48} color={COLORS.white} />
          </LinearGradient>
        </View>
        
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        <Text style={styles.description}>{description}</Text>
        
        {action && <View style={styles.actionContainer}>{action}</View>}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING[6],
  },
  iconContainer: {
    marginBottom: SPACING[6],
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    ...SHADOWS.lg,
  },
  iconGradient: {
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.full,
  },
  title: {
    fontSize: FONTS.sizes['3xl'],
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: SPACING[2],
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '600',
    color: COLORS.text.secondary,
    marginBottom: SPACING[4],
    textAlign: 'center',
  },
  description: {
    fontSize: FONTS.sizes.base,
    color: COLORS.text.tertiary,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
  actionContainer: {
    marginTop: SPACING[8],
    width: '100%',
    alignItems: 'center',
  },
});

export default EmptyState;