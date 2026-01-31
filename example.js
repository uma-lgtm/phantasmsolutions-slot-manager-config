/**
 * Example usage of @phantasm/slot-manager-config
 * 
 * This file demonstrates how to integrate the slot-manager-config
 * package into your React Native/Expo app.
 */

import { createSlotManagerConfig } from '@phantasm/slot-manager-config';
import { AppState } from 'react-native';

// ============================================
// Step 1: Create Config Service Instance
// ============================================
// Create this file: service/configService.js

const configService = createSlotManagerConfig({
  domain: 'com.gohuntersalesrep', // Change this to your app domain
  // Optional: slotManagerUrl: 'https://slot-manager.phantasm.solutions/',
  // Optional: storageKey: 'slot_manager_config',
});

export default configService;

// ============================================
// Step 2: Initialize in App Root
// ============================================
// Add this to your app/_layout.jsx or App.js

import { useEffect, useState } from 'react';
import { AppState, View, Text, TouchableOpacity } from 'react-native';
import configService from './service/configService';

export default function RootLayout() {
  const [configInitialized, setConfigInitialized] = useState(false);
  const [configError, setConfigError] = useState(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await configService.initialize();
        
        if (!configService.getBaseUrl()) {
          throw new Error('Backend URL not available. Please check your internet connection.');
        }
        
        setConfigInitialized(true);
        console.log('Config initialized:', configService.getBaseUrl());
      } catch (error) {
        console.error('Config initialization failed:', error);
        setConfigError(error.message);
        setConfigInitialized(true);
      }
    };

    initializeApp();

    // Refresh config when app comes to foreground
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active' && configInitialized && !configError) {
        configService.refreshConfig().catch((error) => {
          console.log('Background config refresh failed:', error);
        });
      }
    });

    return () => {
      subscription?.remove();
    };
  }, [configInitialized, configError]);

  if (!configInitialized) {
    return <View><Text>Loading...</Text></View>; // Show splash screen
  }

  if (configError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
          Configuration Error
        </Text>
        <Text style={{ fontSize: 14, color: '#666', marginBottom: 20, textAlign: 'center' }}>
          {configError}
        </Text>
        <TouchableOpacity
          onPress={async () => {
            setConfigError(null);
            setConfigInitialized(false);
            try {
              await configService.initialize();
              if (configService.getBaseUrl()) {
                setConfigInitialized(true);
              } else {
                setConfigError('Backend URL not available.');
              }
            } catch (error) {
              setConfigError(error.message);
            }
          }}
          style={{ backgroundColor: '#007AFF', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 5 }}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return <YourApp />;
}

// ============================================
// Step 3: Use in API Service
// ============================================
// Example with RTK Query

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import configService from './configService';

const dynamicBaseQuery = async (args, api, extraOptions) => {
  const baseUrl = configService.getBaseUrl();
  
  if (!baseUrl) {
    return {
      error: {
        status: 'FETCH_ERROR',
        error: 'Backend URL not configured. Please wait for configuration to load.',
      },
    };
  }
  
  const baseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders: async (headers) => {
      // Add your auth token here if needed
      // const token = await getToken();
      // if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  });
  
  return baseQuery(args, api, extraOptions);
};

export const httpService = createApi({
  reducerPath: 'httpService',
  baseQuery: dynamicBaseQuery,
  endpoints: (builder) => ({
    // Your endpoints here
  }),
});

// ============================================
// Step 4: Use in Regular Fetch Calls
// ============================================

import configService from './service/configService';

export const makeApiCall = async (endpoint, options = {}) => {
  const baseUrl = configService.getBaseUrl();
  
  if (!baseUrl) {
    throw new Error('Backend URL not configured');
  }
  
  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  return response.json();
};
