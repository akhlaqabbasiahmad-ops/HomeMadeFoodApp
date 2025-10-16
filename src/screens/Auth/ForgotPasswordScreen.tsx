import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';

interface ForgotPasswordForm {
  email: string;
}

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const { control, handleSubmit, formState: { errors } } = useForm<ForgotPasswordForm>();
  const [isEmailSent, setIsEmailSent] = useState(false);

  const onSubmit = (data: ForgotPasswordForm) => {
    // TODO: Implement forgot password logic
    console.log('Forgot password data:', data);
    setIsEmailSent(true);
    Alert.alert('Email Sent', `Password reset instructions have been sent to ${data.email}`);
  };

  const navigateToLogin = () => {
    navigation.goBack();
  };

  const resendEmail = () => {
    Alert.alert('Email Sent', 'Password reset instructions have been resent to your email');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={navigateToLogin}>
              <Ionicons name="chevron-back" size={24} color={COLORS.text.primary} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.content}>
            {!isEmailSent ? (
              <>
                {/* Icon */}
                <View style={styles.iconContainer}>
                  <LinearGradient
                    colors={[COLORS.primary, COLORS.primaryLight]}
                    style={styles.iconBackground}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Ionicons name="lock-closed" size={48} color={COLORS.white} />
                  </LinearGradient>
                </View>

                <Text style={styles.title}>Forgot Password?</Text>
                <Text style={styles.subtitle}>
                  Don&apos;t worry! It happens. Please enter the email address associated with your account.
                </Text>

                {/* Email Input */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Email Address</Text>
                  <Controller
                    control={control}
                    name="email"
                    rules={{
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <View style={styles.inputWrapper}>
                        <Ionicons name="mail-outline" size={20} color={COLORS.gray[500]} style={styles.inputIcon} />
                        <TextInput
                          style={[styles.input, errors.email && styles.inputError]}
                          placeholder="Enter your email"
                          placeholderTextColor={COLORS.gray[400]}
                          keyboardType="email-address"
                          autoCapitalize="none"
                          autoCorrect={false}
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                        />
                      </View>
                    )}
                  />
                  {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
                </View>

                {/* Submit Button */}
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit(onSubmit)}>
                  <LinearGradient
                    colors={[COLORS.primary, COLORS.primaryDark]}
                    style={styles.submitButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.submitButtonText}>Send Reset Instructions</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </>
            ) : (
              <>
                {/* Success Icon */}
                <View style={styles.iconContainer}>
                  <LinearGradient
                    colors={[COLORS.success, '#66BB6A']}
                    style={styles.iconBackground}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Ionicons name="mail" size={48} color={COLORS.white} />
                  </LinearGradient>
                </View>

                <Text style={styles.title}>Check Your Email</Text>
                <Text style={styles.subtitle}>
                  We&apos;ve sent password reset instructions to your email address. Please check your inbox and follow the instructions.
                </Text>

                {/* Resend Button */}
                <TouchableOpacity style={styles.resendButton} onPress={resendEmail}>
                  <Text style={styles.resendButtonText}>Resend Email</Text>
                </TouchableOpacity>

                {/* Back to Login */}
                <TouchableOpacity style={styles.backToLoginButton} onPress={navigateToLogin}>
                  <LinearGradient
                    colors={[COLORS.primary, COLORS.primaryDark]}
                    style={styles.submitButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.submitButtonText}>Back to Login</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </>
            )}

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Remember your password? </Text>
              <TouchableOpacity onPress={navigateToLogin}>
                <Text style={styles.loginLinkText}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    paddingTop: SPACING.lg,
    paddingHorizontal: SPACING.base,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING['2xl'],
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: SPACING.xl,
  },
  iconBackground: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.lg,
  },
  title: {
    fontSize: FONTS.sizes['2xl'],
    fontWeight: 'bold',
    color: COLORS.text.primary,
    textAlign: 'center',
    marginBottom: SPACING.base,
  },
  subtitle: {
    fontSize: FONTS.sizes.base,
    color: COLORS.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.base,
  },
  inputContainer: {
    width: '100%',
    marginBottom: SPACING.xl,
  },
  inputLabel: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray[50],
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  inputIcon: {
    paddingLeft: SPACING.base,
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: SPACING.sm,
    fontSize: FONTS.sizes.base,
    color: COLORS.text.primary,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.error,
    marginTop: SPACING.xs,
  },
  submitButton: {
    width: '100%',
    borderRadius: RADIUS.lg,
    ...SHADOWS.base,
    marginBottom: SPACING.xl,
  },
  submitButtonGradient: {
    paddingVertical: SPACING.base,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  resendButton: {
    marginBottom: SPACING.xl,
    paddingVertical: SPACING.sm,
  },
  resendButtonText: {
    fontSize: FONTS.sizes.base,
    color: COLORS.primary,
    fontWeight: '600',
  },
  backToLoginButton: {
    width: '100%',
    borderRadius: RADIUS.lg,
    ...SHADOWS.base,
    marginBottom: SPACING.xl,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: SPACING.xl,
  },
  loginText: {
    fontSize: FONTS.sizes.base,
    color: COLORS.text.secondary,
  },
  loginLinkText: {
    fontSize: FONTS.sizes.base,
    color: COLORS.primary,
    fontWeight: '600',
  },
});

export default ForgotPasswordScreen;