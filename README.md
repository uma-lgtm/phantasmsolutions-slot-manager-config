# @uma-lgtm/slot-manager-config

A React Native configuration service for dynamically fetching and managing backend URLs from the slot-manager API.

## Features

- 🔄 **Dynamic Backend URL**: Always fetches fresh backend URL from slot-manager API based on your app domain
- 🔁 **Auto-refresh**: Automatically refreshes config when app comes to foreground
- ⚡ **Lightweight**: Zero dependencies, uses native fetch API
- 🛡️ **Error Handling**: Clear error messages when config fetch fails

## Installation

### Prerequisites

1. **Create `.npmrc` in your project root**:

```
@uma-lgtm:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

2. **Set GitHub token**:

```bash
export GITHUB_TOKEN=your_github_token_here
```

3. **Install the package**:

```bash
npm install @uma-lgtm/slot-manager-config
# or
yarn add @uma-lgtm/slot-manager-config
```

### Alternative: Install from GitHub (No Auth Required)

If GitHub Packages authentication is causing issues:

```bash
npm install github:uma-lgtm/phantasmsolutions-slot-manager-config
```

### Peer Dependencies

This package requires React Native (uses native fetch API):
- `react-native` >= 0.60.0

## Usage

### Basic Setup

1. **Create a config service instance** in your app:

```javascript
// service/configService.js
import { createSlotManagerConfig } from '@uma-lgtm/slot-manager-config';

// Create instance with your app domain
const configService = createSlotManagerConfig({
  domain: 'com.gohuntersalesrep', // Your app domain
});

export default configService;
```

2. **Initialize in your app root** (e.g., `app/_layout.jsx`):

```javascript
import { useEffect, useState } from 'react';
import configService from './service/configService';

export default function RootLayout() {
  const [configInitialized, setConfigInitialized] = useState(false);
  const [configError, setConfigError] = useState(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await configService.initialize();
        if (!configService.getBaseUrl()) {
          throw new Error('Backend URL not available');
        }
        setConfigInitialized(true);
      } catch (error) {
        setConfigError(error.message);
        setConfigInitialized(true);
      }
    };

    initializeApp();
  }, []);

  if (!configInitialized) {
    return null; // Show splash screen
  }

  if (configError) {
    return <ErrorScreen error={configError} onRetry={initializeApp} />;
  }

  return <YourApp />;
}
```

3. **Use in your API service**:

```javascript
// service/httpService.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import configService from './configService';

const dynamicBaseQuery = async (args, api, extraOptions) => {
  const baseUrl = configService.getBaseUrl();
  
  if (!baseUrl) {
    return {
      error: {
        status: 'FETCH_ERROR',
        error: 'Backend URL not configured',
      },
    };
  }
  
  const baseQuery = fetchBaseQuery({ baseUrl });
  return baseQuery(args, api, extraOptions);
};

export const httpService = createApi({
  reducerPath: 'httpService',
  baseQuery: dynamicBaseQuery,
  // ... your endpoints
});
```

### Advanced Options

```javascript
import { createSlotManagerConfig } from '@uma-lgtm/slot-manager-config';

const configService = createSlotManagerConfig({
  domain: 'com.gohuntersalesrep',
  slotManagerUrl: 'https://slot-manager.phantasm.solutions/', // Optional
});
```

## API Reference

### `createSlotManagerConfig(options)`

Creates a new SlotManagerConfigService instance.

**Parameters:**
- `options.domain` (string, required): Your app domain (e.g., "com.gohuntersalesrep")
- `options.slotManagerUrl` (string, optional): Slot manager URL (default: "https://slot-manager.phantasm.solutions/")

**Returns:** `SlotManagerConfigService` instance

### Methods

#### `initialize()`

Initialize the configuration service. Always fetches fresh config from slot-manager API.

**Returns:** `Promise<void>`

**Throws:** Error if config fetch fails

#### `getBaseUrl()`

Get the current backend base URL.

**Returns:** `string | null` - The backend URL or null if not loaded

#### `isConfigLoaded()`

Check if configuration is loaded.

**Returns:** `boolean`

#### `refreshConfig()`

Force refresh configuration from slot-manager API. Always fetches fresh URL.

**Returns:** `Promise<void>`

**Throws:** Error if config fetch fails

#### `clearConfig()`

Clear current configuration (resets to uninitialized state).

**Returns:** `Promise<void>`

#### `getDomain()`

Get the configured domain.

**Returns:** `string`

## How It Works

1. **On App Start**: The service always fetches fresh configuration from slot-manager API
2. **Fetch Config**: Makes a request to `{slotManagerUrl}/api/check-website-active?domain={yourDomain}`
3. **Return URL**: Provides the backend URL via `getBaseUrl()`
4. **No Caching**: Every call to `initialize()` or `refreshConfig()` fetches a fresh URL from the server

## Error Handling

The service throws errors when config fetch fails:

- **Network Error**: Throws error - app should handle retry logic
- **Invalid Response**: Throws error if backend URL is not found in response
- **No Fallback**: Always requires successful API call - no cached fallback

## Example: Complete Integration

```javascript
// 1. Create config service
// service/configService.js
import { createSlotManagerConfig } from '@uma-lgtm/slot-manager-config';
export default createSlotManagerConfig({
  domain: 'com.gohuntersalesrep',
});

// 2. Initialize in app root
// app/_layout.jsx
import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import configService from './service/configService';

export default function RootLayout() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await configService.initialize();
        if (!configService.getBaseUrl()) {
          throw new Error('Config not available');
        }
        setReady(true);
      } catch (error) {
        console.error('Config init failed:', error);
        // Handle error (show error screen, retry, etc.)
      }
    };

    init();

    // Refresh config when app comes to foreground
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        configService.refreshConfig().catch(console.error);
      }
    });

    return () => subscription?.remove();
  }, []);

  if (!ready) return <SplashScreen />;
  return <App />;
}

// 3. Use in API calls
// service/api.js
import configService from './configService';

export const apiCall = async (endpoint) => {
  const baseUrl = configService.getBaseUrl();
  if (!baseUrl) {
    throw new Error('Backend URL not configured');
  }
  return fetch(`${baseUrl}${endpoint}`);
};
```

## License

MIT

## Support

For issues and questions, please open an issue on [GitHub](https://github.com/phantasmsolutions/slot-manager-config/issues).
