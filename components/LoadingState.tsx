'use client';

import React, { useState, useEffect } from 'react';
import Card from './ui/Card';
import Spinner from './ui/Spinner';

interface LoadingStateProps {
  onCancel?: () => void;
}

const LoadingState: React.FC<LoadingStateProps> = ({ onCancel }) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    'Processing image...',
    'Identifying food items...',
    'Analyzing nutrition content...',
    'Calculating values...',
    'Almost done...',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 15;
        const stepIndex = Math.floor((newProgress / 100) * steps.length);
        setCurrentStep(Math.min(stepIndex, steps.length - 1));
        
        if (newProgress >= 95) {
          clearInterval(interval);
          return 95; // Stop at 95% to avoid reaching 100% before actual completion
        }
        return newProgress;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <Card className="text-center animate-fade-in">
      <div className="py-8 space-y-6">
        {/* Spinner */}
        <div className="flex justify-center">
          <Spinner size="lg" />
        </div>

        {/* Title */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Analyzing your food...
          </h3>
          <p className="text-gray-600">
            Our AI is identifying ingredients and calculating nutrition facts
          </p>
        </div>

        {/* Current Step */}
        <div className="text-sm text-primary-600 font-medium">
          {steps[currentStep]}
        </div>

        {/* Progress Bar */}
        <div className="max-w-md mx-auto">
          <div className="bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>0%</span>
            <span>{Math.round(progress)}%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-xs text-gray-500 bg-gray-50 p-4 rounded-lg max-w-md mx-auto">
          <p className="mb-2">🤖 <strong>Did you know?</strong></p>
          <p>
            Our AI analyzes over 100 visual features to identify foods and estimate 
            nutritional content with high accuracy.
          </p>
        </div>

        {/* Cancel Button (Optional) */}
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Cancel Analysis
          </button>
        )}
      </div>
    </Card>
  );
};

export default LoadingState;
