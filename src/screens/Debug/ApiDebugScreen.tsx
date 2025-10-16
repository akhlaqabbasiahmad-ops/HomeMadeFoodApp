import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS } from '../../constants/theme';
import { apiService } from '../../services/apiService';

interface ApiDebugScreenProps {
  navigation: any;
}

const ApiDebugScreen: React.FC<ApiDebugScreenProps> = ({ navigation }) => {
  const [debugInfo, setDebugInfo] = useState<any>({
    apiBaseUrl: '',
    foodItemsCount: 0,
    categoriesCount: 0,
    foodResponse: null,
    categoriesResponse: null,
    lastError: null,
    isLoading: false,
  });

  useEffect(() => {
    // Get the API base URL from the service
    setDebugInfo(prev => ({
      ...prev,
      apiBaseUrl: (apiService as any).baseURL,
    }));
  }, []);

  const testApis = async () => {
    setDebugInfo(prev => ({ ...prev, isLoading: true, lastError: null }));
    
    try {
      console.log('🧪 Testing API connections...');
      
      // Test food API
      const foodResponse = await apiService.getFoodItems();
      console.log('🍔 Food API Test Result:', foodResponse);
      
      // Test categories API
      const categoriesResponse = await apiService.getCategories();
      console.log('📂 Categories API Test Result:', categoriesResponse);
      
      setDebugInfo(prev => ({
        ...prev,
        foodResponse,
        categoriesResponse,
        foodItemsCount: foodResponse.data?.items?.length || 0,
        categoriesCount: categoriesResponse.data?.length || 0,
        isLoading: false,
      }));
      
    } catch (error) {
      console.error('❌ API Test Error:', error);
      setDebugInfo(prev => ({
        ...prev,
        lastError: error,
        isLoading: false,
      }));
    }
  };

  const renderStatus = (label: string, value: any, isSuccess?: boolean) => (
    <View style={styles.statusRow}>
      <Text style={styles.statusLabel}>{label}:</Text>
      <View style={styles.statusValue}>
        <Ionicons 
          name={isSuccess ? 'checkmark-circle' : 'alert-circle'} 
          size={16} 
          color={isSuccess ? COLORS.success : COLORS.error} 
        />
        <Text style={[styles.statusText, { color: isSuccess ? COLORS.success : COLORS.text.primary }]}>
          {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
        </Text>
      </View>
    </View>
  );

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
        <Text style={styles.headerTitle}>API Debug</Text>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={testApis}
          disabled={debugInfo.isLoading}
        >
          <Ionicons 
            name={debugInfo.isLoading ? 'hourglass' : 'refresh'} 
            size={24} 
            color={COLORS.primary} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          
          {/* API Configuration */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔧 API Configuration</Text>
            {renderStatus('Base URL', debugInfo.apiBaseUrl, !!debugInfo.apiBaseUrl)}
            {renderStatus('Environment', __DEV__ ? 'Development' : 'Production', true)}
          </View>

          {/* Connection Status */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🌐 Connection Status</Text>
            {renderStatus('Food Items Loaded', debugInfo.foodItemsCount, debugInfo.foodItemsCount > 0)}
            {renderStatus('Categories Loaded', debugInfo.categoriesCount, debugInfo.categoriesCount > 0)}
          </View>

          {/* Detailed Responses */}
          {debugInfo.foodResponse && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🍔 Food API Response</Text>
              <View style={styles.codeBlock}>
                <Text style={styles.codeText}>
                  {JSON.stringify(debugInfo.foodResponse, null, 2)}
                </Text>
              </View>
            </View>
          )}

          {debugInfo.categoriesResponse && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📂 Categories API Response</Text>
              <View style={styles.codeBlock}>
                <Text style={styles.codeText}>
                  {JSON.stringify(debugInfo.categoriesResponse, null, 2)}
                </Text>
              </View>
            </View>
          )}

          {debugInfo.lastError && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>❌ Last Error</Text>
              <View style={[styles.codeBlock, { backgroundColor: COLORS.errorSoft }]}>
                <Text style={[styles.codeText, { color: COLORS.error }]}>
                  {String(debugInfo.lastError)}
                </Text>
              </View>
            </View>
          )}

          {/* Test Button */}
          <TouchableOpacity
            style={[styles.testButton, debugInfo.isLoading && styles.testButtonDisabled]}
            onPress={testApis}
            disabled={debugInfo.isLoading}
          >
            <Text style={styles.testButtonText}>
              {debugInfo.isLoading ? 'Testing APIs...' : 'Test API Connection'}
            </Text>
          </TouchableOpacity>

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
  refreshButton: {
    padding: 8,
    marginRight: -8,
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  section: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.gray?.[200],
  },
  sectionTitle: {
    fontSize: FONTS?.sizes?.lg || 18,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 12,
  },
  statusRow: {
    marginBottom: 8,
  },
  statusLabel: {
    fontSize: FONTS?.sizes?.sm || 14,
    fontWeight: '600',
    color: COLORS.text.secondary,
    marginBottom: 4,
  },
  statusValue: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  statusText: {
    fontSize: FONTS?.sizes?.sm || 14,
    marginLeft: 8,
    flex: 1,
  },
  codeBlock: {
    backgroundColor: COLORS.gray?.[50],
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gray?.[200],
  },
  codeText: {
    fontSize: FONTS?.sizes?.xs || 12,
    fontFamily: 'monospace',
    color: COLORS.text.primary,
  },
  testButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  testButtonDisabled: {
    backgroundColor: COLORS.gray?.[400],
  },
  testButtonText: {
    color: COLORS.white,
    fontSize: FONTS?.sizes?.base || 16,
    fontWeight: '600',
  },
});

export default ApiDebugScreen;