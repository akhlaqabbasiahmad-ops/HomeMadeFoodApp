import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { useAppDispatch, useAppSelector } from '../../store';
import { loginUser } from '../../store/authSlice';

interface LoginForm {
  email: string;
  password: string;
}

const LoginScreen = () => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const { control, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  const onLogin = async (data: LoginForm) => {
    try {
      await dispatch(loginUser(data)).unwrap();
      // Login successful, navigation will be handled by auth state change
      Alert.alert('Success', 'Login successful!');
      // Navigate to home after successful login
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Login Failed', error || 'Invalid email or password');
    }
  };

  const navigateToSignup = () => {
    router.push('/signup');
  };

  const navigateToForgotPassword = () => {
    router.push('/forgot-password');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Header with Gradient */}
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryLight]}
            style={styles.header}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.logoContainer}>
              <Ionicons name="restaurant" size={48} color={COLORS.white} />
              <Text style={styles.logoText}>HomeMade</Text>
              <Text style={styles.taglineText}>Delicious food delivered</Text>
            </View>
          </LinearGradient>

          {/* Login Form */}
          <View style={styles.formContainer}>
            <Text style={styles.welcomeText}>Welcome Back!</Text>
            <Text style={styles.subtitleText}>Sign in to continue ordering</Text>

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

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <Controller
                control={control}
                name="password"
                rules={{
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputWrapper}>
                    <Ionicons name="lock-closed-outline" size={20} color={COLORS.gray[500]} style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, errors.password && styles.inputError]}
                      placeholder="Enter your password"
                      placeholderTextColor={COLORS.gray[400]}
                      secureTextEntry
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  </View>
                )}
              />
              {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
            </View>

            {/* Forgot Password */}
            <TouchableOpacity style={styles.forgotPasswordButton} onPress={navigateToForgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity style={styles.loginButton} onPress={handleSubmit(onLogin)}>
              <LinearGradient
                colors={[COLORS.primary, COLORS.primaryDark]}
                style={styles.loginButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.loginButtonText}>Sign In</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Social Login */}
            <View style={styles.socialContainer}>
              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>or continue with</Text>
                <View style={styles.divider} />
              </View>

              <View style={styles.socialButtonsContainer}>
                <TouchableOpacity style={styles.socialButton}>
                  <Ionicons name="logo-google" size={24} color="#DB4437" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                  <Ionicons name="logo-facebook" size={24} color="#4267B2" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                  <Ionicons name="logo-apple" size={24} color={COLORS.black} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Sign Up Link */}
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don&apos;t have an account? </Text>
              <TouchableOpacity onPress={navigateToSignup}>
                <Text style={styles.signupLinkText}>Sign Up</Text>
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
    paddingTop: SPACING.xl,
    paddingBottom: SPACING['2xl'],
    paddingHorizontal: SPACING.base,
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoText: {
    fontSize: FONTS.sizes['3xl'],
    fontWeight: 'bold',
    color: COLORS.white,
    marginTop: SPACING.sm,
  },
  taglineText: {
    fontSize: FONTS.sizes.base,
    color: COLORS.white,
    opacity: 0.9,
    marginTop: SPACING.xs,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.lg,
  },
  welcomeText: {
    fontSize: FONTS.sizes['2xl'],
    fontWeight: 'bold',
    color: COLORS.text.primary,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  subtitleText: {
    fontSize: FONTS.sizes.base,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  inputContainer: {
    marginBottom: SPACING.lg,
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
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.input,
    borderWidth: 2,
    borderColor: COLORS.borderLight,
    ...SHADOWS.sm,
  },
  inputIcon: {
    paddingLeft: SPACING.base,
  },
  input: {
    flex: 1,
    height: 56,
    paddingHorizontal: SPACING[3],
    fontSize: FONTS.sizes.base,
    color: COLORS.text.primary,
    fontWeight: '500',
  },
  inputError: {
    borderColor: COLORS.error,
    backgroundColor: COLORS.errorSoft,
  },
  errorText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.error,
    marginTop: SPACING.xs,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.xl,
  },
  forgotPasswordText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.primary,
    fontWeight: '600',
  },
  loginButton: {
    borderRadius: RADIUS.button,
    ...SHADOWS.button,
    marginBottom: SPACING.xl,
  },
  loginButtonGradient: {
    height: 56,
    borderRadius: RADIUS.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  socialContainer: {
    marginBottom: SPACING.xl,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.gray[200],
  },
  dividerText: {
    paddingHorizontal: SPACING.base,
    fontSize: FONTS.sizes.sm,
    color: COLORS.text.secondary,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.base,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.card,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    fontSize: FONTS.sizes.base,
    color: COLORS.text.secondary,
  },
  signupLinkText: {
    fontSize: FONTS.sizes.base,
    color: COLORS.primary,
    fontWeight: '600',
  },
});

export default LoginScreen;