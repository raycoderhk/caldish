'use client';

import React, { useState, useCallback } from 'react';
import { UploadedImage, AnalysisOptions } from '@/lib/types/nutrition';
import { useNutritionAnalysis } from '@/hooks/useNutritionAnalysis';
import { useUserProfile } from '@/hooks/useUserProfile';
import { PDFExporter } from '@/lib/utils/pdf-export';
import ImageUpload from '@/components/ImageUpload';
import ImagePreview from '@/components/ImagePreview';
import LoadingState from '@/components/LoadingState';
import NutritionResults from '@/components/NutritionResults';
import UserProfileModal from '@/components/UserProfileModal';

type AppState = 'upload' | 'preview' | 'analyzing' | 'results';

export default function HomePage() {
  const [appState, setAppState] = useState<AppState>('upload');
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const { 
    analysis, 
    isAnalyzing, 
    error: analysisError, 
    analyzeFood, 
    clearAnalysis,
    clearError 
  } = useNutritionAnalysis();

  const { 
    profile: userProfile, 
    isLoaded: profileLoaded,
    saveProfile 
  } = useUserProfile();

  // Handle image selection
  const handleImageSelect = useCallback((image: UploadedImage) => {
    setUploadedImage(image);
    setAppState('preview');
    setError(null);
    clearError();
  }, [clearError]);

  // Handle image removal
  const handleImageRemove = useCallback(() => {
    if (uploadedImage?.preview) {
      URL.revokeObjectURL(uploadedImage.preview);
    }
    setUploadedImage(null);
    setAppState('upload');
    setError(null);
    clearAnalysis();
  }, [uploadedImage, clearAnalysis]);

  // Handle analysis start
  const handleAnalyze = useCallback(async (options: AnalysisOptions) => {
    if (!uploadedImage) return;

    setAppState('analyzing');
    setError(null);
    
    try {
      await analyzeFood(uploadedImage, options);
      setAppState('results');
    } catch (err) {
      console.error('Analysis failed:', err);
      setAppState('preview');
    }
  }, [uploadedImage, analyzeFood]);

  // Handle analyze another
  const handleAnalyzeAnother = useCallback(() => {
    handleImageRemove();
  }, [handleImageRemove]);

  // Handle errors
  const handleError = useCallback((errorMessage: string) => {
    setError(errorMessage);
    clearError();
  }, [clearError]);

  // Handle save (placeholder)
  const handleSave = useCallback(() => {
    console.log('Save functionality not implemented yet');
    // TODO: Implement save to history
  }, []);

  // Handle export
  const handleExport = useCallback(async () => {
    if (!analysis) {
      console.error('No analysis data to export');
      alert('No analysis data available to export.');
      return;
    }

    try {
      // Use the full-featured PDF export
      console.log('Attempting PDF export...');
      const { PDFExporter } = await import('@/lib/utils/pdf-export');
      const exporter = new PDFExporter();
      await exporter.exportNutritionAnalysis(analysis, userProfile);
      console.log('Full PDF export completed successfully');
    } catch (error) {
      console.error('Export failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Export failed: ${errorMessage}\n\nPlease check the browser console for more details.`);
    }
  }, [analysis, userProfile]);

  // Handle share (placeholder)
  const handleShare = useCallback(() => {
    console.log('Share functionality not implemented yet');
    // TODO: Implement share functionality
  }, []);

  // Handle profile edit
  const handleEditProfile = useCallback(() => {
    setShowProfileModal(true);
  }, []);

  // Handle profile save
  const handleSaveProfile = useCallback((newProfile: any) => {
    saveProfile(newProfile);
    setShowProfileModal(false);
  }, [saveProfile]);

  // Display error message if any
  const displayError = error || analysisError;

  return (
    <div className="space-y-8">
      {/* Error Message */}
      {displayError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-fade-in">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">!</span>
            </div>
            <div>
              <h4 className="text-sm font-medium text-red-800">Error</h4>
              <p className="text-sm text-red-700">{displayError}</p>
            </div>
            <button
              onClick={() => {
                setError(null);
                clearError();
              }}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      {appState === 'upload' && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Analyze Your Food
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Upload a photo of your meal and get instant AI-powered nutrition analysis 
              including calories, macronutrients, vitamins, and minerals.
            </p>
          </div>
          
          <ImageUpload 
            onImageSelect={handleImageSelect}
            onError={handleError}
            isLoading={isAnalyzing}
          />

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">AI-Powered Analysis</h3>
              <p className="text-sm text-gray-600">
                Advanced computer vision identifies foods and estimates nutrition with high accuracy
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Instant Results</h3>
              <p className="text-sm text-gray-600">
                Get comprehensive nutrition facts in seconds, not minutes
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Detailed Breakdown</h3>
              <p className="text-sm text-gray-600">
                Calories, macros, vitamins, minerals, and portion size estimates
              </p>
            </div>
          </div>
        </div>
      )}

      {appState === 'preview' && uploadedImage && (
        <ImagePreview
          image={uploadedImage}
          onRemove={handleImageRemove}
          onAnalyze={handleAnalyze}
          isAnalyzing={isAnalyzing}
        />
      )}

      {appState === 'analyzing' && (
        <LoadingState onCancel={() => setAppState('preview')} />
      )}

      {appState === 'results' && analysis && (
        <NutritionResults
          analysis={analysis}
          userProfile={userProfile}
          onSave={handleSave}
          onExport={handleExport}
          onShare={handleShare}
          onAnalyzeAnother={handleAnalyzeAnother}
          onEditProfile={handleEditProfile}
        />
      )}

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onSave={handleSaveProfile}
        currentProfile={userProfile}
      />
    </div>
  );
}
