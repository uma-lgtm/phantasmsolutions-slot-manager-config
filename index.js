/**
 * Slot Manager Config Service
 * Fetches backend URL configuration from slot-manager API (always fresh, no caching)
 */
class SlotManagerConfigService {
  constructor(options = {}) {
    const {
      domain,
      slotManagerUrl = 'https://slot-manager.phantasm.solutions/',
    } = options;

    if (!domain) {
      throw new Error('Domain is required. Please provide your app domain (e.g., "com.yourdomain")');
    }

    this.domain = domain;
    this.slotManagerUrl = slotManagerUrl.replace(/\/$/, ''); // Remove trailing slash
    this.baseUrl = null;
    this.configLoaded = false;
  }

  /**
   * Initialize configuration - call this early in your app
   * Always fetches fresh URL from slot-manager API
   * @returns {Promise<void>}
   * @throws {Error} If config fetch fails
   */
  async initialize() {
    await this.fetchConfigFromServer();
    
    if (!this.baseUrl) {
      throw new Error(`Failed to fetch backend URL from slot-manager for domain: ${this.domain}`);
    }
  }

  /**
   * Fetch configuration from slot-manager API
   * Always fetches fresh URL (no caching)
   * @returns {Promise<void>}
   * @throws {Error} If fetch fails
   */
  async fetchConfigFromServer() {
    const configServerUrl = `${this.slotManagerUrl}/api/check-website-active?domain=${this.domain}`;
    
    const response = await fetch(configServerUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Config fetch failed: ${response.status} ${response.statusText}`);
    }

    const config = await response.json();
    
    if (config.status && config.data?.backend_url_1) {
      this.baseUrl = config.data.backend_url_1;
      this.configLoaded = true;
    } else {
      throw new Error(`Invalid config response: backend_url_1 not found for domain ${this.domain}`);
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
   * Always fetches fresh URL from slot-manager API
   * @returns {Promise<void>}
   * @throws {Error} If fetch fails
   */
  async refreshConfig() {
    await this.fetchConfigFromServer();
  }

  /**
   * Clear current config (resets to uninitialized state)
   * @returns {Promise<void>}
   */
  async clearConfig() {
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
