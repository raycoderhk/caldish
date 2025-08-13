'use client';

import { useState, useCallback } from 'react';
import { NutritionAnalysis, AnalysisOptions, UploadedImage } from '@/lib/types/nutrition';
import { ApiResponse } from '@/lib/types/api';
import { ERROR_MESSAGES } from '@/lib/constants';

interface UseNutritionAnalysisReturn {
  analysis: NutritionAnalysis | null;
  isAnalyzing: boolean;
  error: string | null;
  analyzeFood: (image: UploadedImage, options?: AnalysisOptions) => Promise<void>;
  clearAnalysis: () => void;
  clearError: () => void;
}

export const useNutritionAnalysis = (): UseNutritionAnalysisReturn => {
  const [analysis, setAnalysis] = useState<NutritionAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeFood = useCallback(async (image: UploadedImage, options: AnalysisOptions = {}) => {
    setIsAnalyzing(true);
    setError(null);
    setAnalysis(null);

    try {
      // Prepare form data
      const formData = new FormData();
      formData.append('image', image.file);
      formData.append('options', JSON.stringify(options));

      // Make API request
      const response = await fetch('/api/analyze-food', {
        method: 'POST',
        body: formData,
      });

      const result: ApiResponse<{ analysis: NutritionAnalysis }> = await response.json();

      if (!response.ok) {
        throw new Error(result.error || ERROR_MESSAGES.API_ERROR);
      }

      if (!result.success || !result.data) {
        throw new Error(result.error || ERROR_MESSAGES.ANALYSIS_FAILED);
      }

      setAnalysis(result.data.analysis);
    } catch (err) {
      console.error('Analysis error:', err);
      
      // Handle different error types
      let errorMessage = ERROR_MESSAGES.ANALYSIS_FAILED;
      
      if (err instanceof Error) {
        if (err.message.includes('fetch')) {
          errorMessage = ERROR_MESSAGES.NETWORK_ERROR;
        } else if (err.message.includes('rate limit')) {
          errorMessage = 'Rate limit exceeded. Please try again in a few minutes.';
        } else if (err.message.includes('timeout')) {
          errorMessage = 'Analysis timed out. Please try again.';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const clearAnalysis = useCallback(() => {
    setAnalysis(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    analysis,
    isAnalyzing,
    error,
    analyzeFood,
    clearAnalysis,
    clearError,
  };
};
