import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';

interface ActionCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  onPress: () => void;
  color?: string;
  disabled?: boolean;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  rightComponent?: React.ReactNode;
}

const ActionCard: React.FC<ActionCardProps> = ({
  icon,
  title,
  description,
  onPress,
  color = COLORS.primary,
  disabled = false,
  rightIcon = 'chevron-forward',
  rightComponent,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
          <Ionicons name={icon} size={24} color={color} />
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
        
        <View style={styles.rightContainer}>
          {rightComponent || (
            <Ionicons 
              name={rightIcon} 
              size={20} 
              color={COLORS.text.tertiary} 
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.card,
    marginVertical: SPACING[1],
    ...SHADOWS.card,
  },
  disabled: {
    opacity: 0.6,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING[4],
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING[3],
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: FONTS.sizes.base,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING[0.5],
  },
  description: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text.tertiary,
    lineHeight: 20,
  },
  rightContainer: {
    marginLeft: SPACING[2],
  },
});

export default ActionCard;