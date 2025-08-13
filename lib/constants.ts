export const APP_CONFIG = {
  name: 'Caldish',
  description: 'AI-powered food nutrition analysis',
  version: '1.0.0',
  author: 'Raymond',
} as const;

export const IMAGE_CONFIG = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp'],
  unsupportedTypes: ['image/heif', 'image/heic'],
  maxDimensions: {
    width: 2048,
    height: 2048,
  },
  compressionQuality: 0.9,
} as const;

export const API_CONFIG = {
  timeout: 30000, // 30 seconds
  retries: 3,
  rateLimit: {
    requests: 10,
    windowMs: 60000, // 1 minute
  },
} as const;

export const NUTRITION_CONFIG = {
  defaultConfidenceThreshold: 0.7,
  dailyValues: {
    calories: 2000,
    protein: 50, // grams
    carbohydrates: 300, // grams
    fat: 65, // grams
    saturatedFat: 20, // grams
    cholesterol: 300, // mg
    sodium: 2300, // mg
    fiber: 25, // grams
    sugar: 50, // grams
  },
} as const;

export const LLM_CONFIG = {
  deepseek: {
    model: 'deepseek-vl-7b-chat',
    maxTokens: 1000,
    temperature: 0.1,
    baseURL: 'https://api.deepseek.com',
  },
  openai: {
    model: 'gpt-4-vision-preview',
    maxTokens: 1000,
    temperature: 0.1,
  },
  gemini: {
    model: 'gemini-pro-vision',
    temperature: 0.1,
  },
} as const;

export const UI_CONFIG = {
  animations: {
    duration: 300,
    easing: 'ease-in-out',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
} as const;

export const ERROR_MESSAGES = {
  UPLOAD_FAILED: 'Failed to upload image. Please try again.',
  IMAGE_TOO_LARGE: `Image size must be less than ${IMAGE_CONFIG.maxSize / 1024 / 1024}MB.`,
  INVALID_IMAGE_TYPE: 'Please upload a valid image file (JPG, PNG, or WebP).',
  UNSUPPORTED_FORMAT: 'HEIF/HEIC format is not supported. Please convert to JPEG or PNG first.',
  ANALYSIS_FAILED: 'Failed to analyze the image. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  API_ERROR: 'Server error. Please try again later.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
} as const;
