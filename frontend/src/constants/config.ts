// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 15,
  PAGE_SIZE_OPTIONS: [10, 15, 25, 50, 100],
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'crm_token',
  USER: 'crm_user',
  THEME: 'crm_theme',
  PREFERENCES: 'crm_preferences',
} as const;

// API Configuration
export const API_CONFIG = {
  BASE_URL: '/api',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

// Toast Configuration
export const TOAST_CONFIG = {
  DURATION: 3000,
  MAX_TOASTS: 5,
  POSITION: 'bottom-right',
} as const;

// Validation
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^\+?[\d\s\-()]+$/,
} as const;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_WITH_TIME: 'MMM dd, yyyy HH:mm',
  API: 'yyyy-MM-dd',
  API_WITH_TIME: "yyyy-MM-dd'T'HH:mm:ss",
} as const;

// Feature Flags
export const FEATURES = {
  ENABLE_WEBSOCKETS: false,
  ENABLE_DARK_MODE: true,
  ENABLE_ANALYTICS: false,
  ENABLE_EXPORT: true,
} as const;
