import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Slot Manager Config Service
 * Fetches and manages backend URL configuration from slot-manager API
 */
class SlotManagerConfigService {
  constructor(options = {}) {
    const {
      domain,
      slotManagerUrl = 'https://slot-manager.phantasm.solutions/',
      storageKey = 'slot_manager_config',
    } = options;

    if (!domain) {
      throw new Error('Domain is required. Please provide your app domain (e.g., "com.yourdomain")');
    }

    this.domain = domain;
    this.slotManagerUrl = slotManagerUrl.replace(/\/$/, ''); // Remove trailing slash
    this.storageKey = storageKey;
    this.baseUrl = null;
    this.configLoaded = false;
  }

  /**
   * Initialize configuration - call this early in your app
   * @returns {Promise<void>}
   */
  async initialize() {
    try {
      // First try to get stored config
      const storedConfig = await AsyncStorage.getItem(this.storageKey);
      if (storedConfig) {
        const config = JSON.parse(storedConfig);
        this.baseUrl = config.baseUrl;
        this.configLoaded = true;
        // console.log('[SlotManagerConfig] Loaded config from storage:', this.baseUrl);
      }

      // Always try to fetch fresh config from server
      await this.fetchConfigFromServer();
      
      // If fetch failed and we don't have a stored config, throw error
      if (!this.baseUrl) {
        throw new Error(`Failed to fetch backend URL from slot-manager for domain: ${this.domain}`);
      }
    } catch (error) {
      console.error('[SlotManagerConfig] Failed to initialize config:', error);
      // Don't set fallback - app should handle this error
      // Only mark as loaded if we have a baseUrl from storage
      if (this.baseUrl) {
        this.configLoaded = true;
      } else {
        // Re-throw error so app can handle it
        throw error;
      }
    }
  }

  /**
   * Fetch configuration from slot-manager API
   * @returns {Promise<void>}
   */
  async fetchConfigFromServer() {
    try {
      const configServerUrl = `${this.slotManagerUrl}/api/check-website-active?domain=${this.domain}`;
      // console.log('[SlotManagerConfig] Fetching config from:', configServerUrl);
      
      const response = await fetch(configServerUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Config fetch failed: ${response.status}`);
      }

      const config = await response.json();
      // console.log('[SlotManagerConfig] Config response:', config);
     
      // Update base URL
      if (config.status && config.data?.backend_url_1) {
        this.baseUrl = config.data.backend_url_1;
        this.configLoaded = true;
        // console.log('[SlotManagerConfig] Main Base URL:', this.baseUrl);
        
        // Store the config locally
        await AsyncStorage.setItem(this.storageKey, JSON.stringify({ 
          baseUrl: this.baseUrl,
          domain: this.domain,
          fetchedAt: new Date().toISOString(),
        }));
      } else {
        // If config doesn't have expected structure, keep existing baseUrl from storage if available
        if (this.baseUrl) {
          this.configLoaded = true;
        }
        // Otherwise, baseUrl remains null and will be handled by initialize()
      }
    } catch (error) {
      console.error('[SlotManagerConfig] Failed to fetch config from server:', error.message);
      // Don't set fallback - if we have stored config, use it
      // Otherwise, let initialize() handle the error
      if (this.baseUrl) {
        this.configLoaded = true;
      }
    }
  }

  /**
   * Get the current base URL
   * @returns {string|null} Returns null if config is not loaded or baseUrl is not set
   */
  getBaseUrl() {
    if (!this.configLoaded || !this.baseUrl) {
      return null;
    }
    return this.baseUrl;
  }

  /**
   * Check if config is loaded
   * @returns {boolean}
   */
  isConfigLoaded() {
    return this.configLoaded;
  }

  /**
   * Force refresh config from server
   * @returns {Promise<void>}
   */
  async refreshConfig() {
    await this.fetchConfigFromServer();
  }

  /**
   * Clear stored config (useful for testing or reset)
   * @returns {Promise<void>}
   */
  async clearConfig() {
    await AsyncStorage.removeItem(this.storageKey);
    this.baseUrl = null;
    this.configLoaded = false;
  }

  /**
   * Get current domain
   * @returns {string}
   */
  getDomain() {
    return this.domain;
  }
}

/**
 * Create a new SlotManagerConfigService instance
 * @param {Object} options - Configuration options
 * @param {string} options.domain - Your app domain (e.g., "com.gohuntersalesrep")
 * @param {string} [options.slotManagerUrl] - Slot manager URL (default: "https://slot-manager.phantasm.solutions/")
 * @param {string} [options.storageKey] - AsyncStorage key for caching (default: "slot_manager_config")
 * @returns {SlotManagerConfigService}
 */
export function createSlotManagerConfig(options) {
  return new SlotManagerConfigService(options);
}

/**
 * Create and export a singleton instance (for backward compatibility)
 * Note: You should use createSlotManagerConfig() instead for better control
 */
export default SlotManagerConfigService;
