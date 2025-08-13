import { NutritionAnalysis, AnalysisOptions } from './nutrition';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  processingTime?: number;
}

export interface AnalyzeFoodRequest {
  image: File;
  options?: AnalysisOptions;
}

export interface AnalyzeFoodResponse {
  analysis: NutritionAnalysis;
}

export interface ApiError {
  code: string;
  message: string;
  details?: string;
  statusCode: number;
}

export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface ApiConfig {
  baseUrl?: string;
  timeout?: number;
  retries?: number;
}
