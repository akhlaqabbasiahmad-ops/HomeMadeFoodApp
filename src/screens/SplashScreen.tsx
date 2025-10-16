import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
    Animated,
    Dimensions,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { COLORS, FONTS, RADIUS, SPACING } from '../constants/theme';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onAnimationComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onAnimationComplete }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-complete after 3 seconds
    const timer = setTimeout(() => {
      onAnimationComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, slideAnim, onAnimationComplete]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      
      <LinearGradient
        colors={[COLORS.primary, COLORS.accent] as const}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Background Pattern */}
        <View style={styles.patternContainer}>
          {[...Array(20)].map((_, index) => (
            <Animated.View
              key={index}
              style={[
                styles.patternDot,
                {
                  opacity: fadeAnim,
                  transform: [
                    {
                      scale: scaleAnim,
                    },
                  ],
                },
              ]}
            />
          ))}
        </View>

        {/* Main Content */}
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [
                { scale: scaleAnim },
                { translateY: slideAnim },
              ],
            },
          ]}
        >
          {/* Logo/Icon */}
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={[COLORS.white, COLORS.primarySoft]}
              style={styles.logoGradient}
            >
              <Ionicons 
                name="restaurant" 
                size={60} 
                color={COLORS.primary} 
              />
            </LinearGradient>
          </View>

          {/* App Name */}
          <Text style={styles.appName}>HomeMade Food</Text>
          <Text style={styles.tagline}>Fresh • Delicious • Made with Love</Text>

          {/* Pre-order Notice */}
          <Animated.View
            style={[
              styles.noticeCard,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.noticeHeader}>
              <View style={styles.clockContainer}>
                <Ionicons name="time-outline" size={24} color={COLORS.accent} />
              </View>
              <Text style={styles.noticeTitle}>Pre-Order Required</Text>
            </View>
            
            <Text style={styles.noticeText}>
              We prepare fresh homemade food only on pre-orders.
              {'\n'}
              Please order 2 hours in advance for the best experience!
            </Text>

            <View style={styles.noticeFeatures}>
              <View style={styles.featureItem}>
                <Ionicons name="leaf-outline" size={16} color={COLORS.secondary} />
                <Text style={styles.featureText}>Fresh Ingredients</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="heart-outline" size={16} color={COLORS.error} />
                <Text style={styles.featureText}>Made with Love</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle-outline" size={16} color={COLORS.success} />
                <Text style={styles.featureText}>Quality Assured</Text>
              </View>
            </View>
          </Animated.View>

          {/* Loading indicator */}
          <Animated.View
            style={[
              styles.loadingContainer,
              {
                opacity: fadeAnim,
              },
            ]}
          >
            <View style={styles.loadingBar}>
              <Animated.View
                style={[
                  styles.loadingProgress,
                  {
                    transform: [{ scaleX: scaleAnim }],
                  },
                ]}
              />
            </View>
            <Text style={styles.loadingText}>Loading delicious recipes...</Text>
          </Animated.View>
        </Animated.View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING[8],
  },
  patternContainer: {
    position: 'absolute',
    width: width * 2,
    height: height * 2,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    opacity: 0.1,
  },
  patternDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.white,
    margin: 20,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  logoContainer: {
    marginBottom: SPACING[8],
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    elevation: 8,
  },
  logoGradient: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 60,
  },
  appName: {
    fontSize: FONTS.sizes['4xl'],
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: SPACING[2],
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: FONTS.sizes.base,
    color: COLORS.white,
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: SPACING[12],
    fontStyle: 'italic',
  },
  noticeCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS['3xl'],
    padding: SPACING[6],
    marginBottom: SPACING[12],
    width: '100%',
    shadowColor: COLORS.shadowDark,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  noticeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING[4],
  },
  clockContainer: {
    width: 48,
    height: 48,
    backgroundColor: COLORS.accentSoft,
    borderRadius: RADIUS.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING[3],
  },
  noticeTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  noticeText: {
    fontSize: FONTS.sizes.base,
    color: COLORS.text.secondary,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: SPACING[6],
  },
  noticeFeatures: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
  },
  featureText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.text.tertiary,
    marginTop: SPACING[1],
    textAlign: 'center',
    fontWeight: '500',
  },
  loadingContainer: {
    alignItems: 'center',
    width: '100%',
  },
  loadingBar: {
    width: '60%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: RADIUS.xs,
    overflow: 'hidden',
    marginBottom: SPACING[3],
  },
  loadingProgress: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xs,
    transformOrigin: 'left center',
  },
  loadingText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.white,
    opacity: 0.8,
    textAlign: 'center',
  },
});

export default SplashScreen;