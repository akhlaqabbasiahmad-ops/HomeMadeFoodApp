import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Alert,
    Linking,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import ActionCard from '../../components/common/ActionCard';
import ScreenHeader from '../../components/common/ScreenHeader';
import { COLORS } from '../../constants/theme';

const HelpSupportScreen: React.FC = () => {
  const router = useRouter();

  const handleCallSupport = () => {
    Alert.alert(
      'Call Support',
      'Would you like to call our support team?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call',
          onPress: () => {
            Linking.openURL('tel:+1234567890');
          },
        },
      ]
    );
  };

  const handleEmailSupport = () => {
    Alert.alert(
      'Email Support',
      'Would you like to send an email to our support team?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send Email',
          onPress: () => {
            Linking.openURL('mailto:support@homemadefood.com');
          },
        },
      ]
    );
  };

  const handleLiveChat = () => {
    Alert.alert('Live Chat', 'Live chat feature coming soon!');
  };

  const handleFAQ = () => {
    Alert.alert('FAQ', 'Frequently Asked Questions coming soon!');
  };

  const handleReportBug = () => {
    Alert.alert('Report Bug', 'Bug reporting feature coming soon!');
  };

  const helpActions = [
    {
      icon: 'call-outline' as keyof typeof Ionicons.glyphMap,
      title: 'Call Support',
      description: 'Speak with our support team',
      onPress: handleCallSupport,
      color: COLORS.primary,
    },
    {
      icon: 'mail-outline' as keyof typeof Ionicons.glyphMap,
      title: 'Email Support',
      description: 'Send us an email',
      onPress: handleEmailSupport,
      color: COLORS.secondary,
    },
    {
      icon: 'chatbubbles-outline' as keyof typeof Ionicons.glyphMap,
      title: 'Live Chat',
      description: 'Chat with support instantly',
      onPress: handleLiveChat,
      color: COLORS.accent,
    },
    {
      icon: 'help-circle-outline' as keyof typeof Ionicons.glyphMap,
      title: 'FAQ',
      description: 'Frequently asked questions',
      onPress: handleFAQ,
      color: COLORS.info,
    },
    {
      icon: 'bug-outline' as keyof typeof Ionicons.glyphMap,
      title: 'Report Bug',
      description: 'Report an issue or bug',
      onPress: handleReportBug,
      color: COLORS.warning,
    },
  ];

  const contactInfo = [
    {
      icon: 'call' as keyof typeof Ionicons.glyphMap,
      title: 'Phone',
      value: '+1 (234) 567-8900',
      color: COLORS.primary,
    },
    {
      icon: 'mail' as keyof typeof Ionicons.glyphMap,
      title: 'Email',
      value: 'support@homemadefood.com',
      color: COLORS.secondary,
    },
    {
      icon: 'time' as keyof typeof Ionicons.glyphMap,
      title: 'Hours',
      value: 'Mon-Fri: 9AM-6PM EST',
      color: COLORS.accent,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader 
        title="Help & Support" 
        subtitle="We're here to help"
        showBackButton
        onBackPress={() => router.back()}
      />
      
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.contactContainer}>
            {contactInfo.map((contact, index) => (
              <View key={index} style={styles.contactItem}>
                <View style={[styles.contactIcon, { backgroundColor: `${contact.color}15` }]}>
                  <Ionicons name={contact.icon} size={20} color={contact.color} />
                </View>
                <View style={styles.contactText}>
                  <Text style={styles.contactTitle}>{contact.title}</Text>
                  <Text style={styles.contactValue}>{contact.value}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Help Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Get Help</Text>
          <View style={styles.menuSection}>
            {helpActions.map((action, index) => (
              <ActionCard
                key={index}
                icon={action.icon}
                title={action.title}
                description={action.description}
                onPress={action.onPress}
                color={action.color}
              />
            ))}
          </View>
        </View>

        {/* App Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Information</Text>
          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Version</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Build</Text>
              <Text style={styles.infoValue}>2024.10.24</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Platform</Text>
              <Text style={styles.infoValue}>React Native</Text>
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
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  contactContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  contactText: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 16,
    color: COLORS.text.secondary,
  },
  menuSection: {
    paddingHorizontal: 20,
    gap: 12,
  },
  infoContainer: {
    paddingHorizontal: 20,
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 16,
    color: COLORS.text.secondary,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
});

export default HelpSupportScreen;
