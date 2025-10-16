import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    ViewStyle,
} from 'react-native';
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
}) => {
  const getButtonHeight = () => {
    switch (size) {
      case 'small':
        return 36;
      case 'large':
        return 56;
      default:
        return 48;
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'small':
        return FONTS.sizes.sm;
      case 'large':
        return FONTS.sizes.lg;
      default:
        return FONTS.sizes.base;
    }
  };

  const getPadding = () => {
    switch (size) {
      case 'small':
        return SPACING.sm;
      case 'large':
        return SPACING.lg;
      default:
        return SPACING.base;
    }
  };

  const renderContent = () => (
    <>
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' ? COLORS.primary : COLORS.white}
          size="small"
        />
      ) : (
        <>
          {icon}
          <Text
            style={[
              styles.text,
              {
                fontSize: getFontSize(),
                color: variant === 'outline' ? COLORS.primary : COLORS.white,
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </>
  );

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        style={[
          styles.button,
          {
            height: getButtonHeight(),
            paddingHorizontal: getPadding(),
            opacity: disabled ? 0.6 : 1,
          },
          style,
        ]}
        onPress={onPress}
        disabled={disabled || loading}
      >
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryDark]}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  if (variant === 'secondary') {
    return (
      <TouchableOpacity
        style={[
          styles.button,
          styles.secondaryButton,
          {
            height: getButtonHeight(),
            paddingHorizontal: getPadding(),
            opacity: disabled ? 0.6 : 1,
          },
          style,
        ]}
        onPress={onPress}
        disabled={disabled || loading}
      >
        {renderContent()}
      </TouchableOpacity>
    );
  }

  // Outline variant
  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles.outlineButton,
        {
          height: getButtonHeight(),
          paddingHorizontal: getPadding(),
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: RADIUS.button,
    ...SHADOWS.button,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING[2],
  },
  secondaryButton: {
    backgroundColor: COLORS.gray[100],
    shadowOpacity: 0,
    elevation: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING[2],
  },
  outlineButton: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.primary,
    shadowOpacity: 0,
    elevation: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING[2],
  },
  text: {
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});

export default CustomButton;