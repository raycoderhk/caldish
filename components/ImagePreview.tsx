'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { UploadedImage, AnalysisOptions } from '@/lib/types/nutrition';
import Card from './ui/Card';
import Button from './ui/Button';

interface ImagePreviewProps {
  image: UploadedImage;
  onRemove: () => void;
  onAnalyze: (options: AnalysisOptions) => void;
  isAnalyzing?: boolean;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  image,
  onRemove,
  onAnalyze,
  isAnalyzing = false,
}) => {
  const [options, setOptions] = useState<AnalysisOptions>({
    includeVitamins: true,
    includeMinerals: true,
    confidenceThreshold: 0.7,
    detailedBreakdown: false,
  });

  const handleAnalyze = () => {
    onAnalyze(options);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
        <button
          onClick={onRemove}
          className="text-red-600 hover:text-red-700 text-sm flex items-center space-x-1 transition-colors"
          disabled={isAnalyzing}
        >
          <XMarkIcon className="w-4 h-4" />
          <span>Remove</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Image Preview */}
        <div className="md:w-1/2">
          <div className="relative w-full h-64 rounded-lg overflow-hidden border border-gray-200">
            <Image
              src={image.preview}
              alt="Food preview"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          
          {/* Image Info */}
          <div className="mt-2 text-sm text-gray-600 space-y-1">
            <p>Size: {formatFileSize(image.size)}</p>
            <p>Type: {image.type}</p>
          </div>
        </div>

        {/* Analysis Options */}
        <div className="md:w-1/2 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Analysis Options
            </label>
            
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={options.includeVitamins}
                  onChange={(e) => setOptions(prev => ({
                    ...prev,
                    includeVitamins: e.target.checked
                  }))}
                  className="mr-3 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  disabled={isAnalyzing}
                />
                <span className="text-sm text-gray-700">Include vitamins & minerals</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={options.detailedBreakdown}
                  onChange={(e) => setOptions(prev => ({
                    ...prev,
                    detailedBreakdown: e.target.checked
                  }))}
                  className="mr-3 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  disabled={isAnalyzing}
                />
                <span className="text-sm text-gray-700">Detailed ingredient breakdown</span>
              </label>

              <div className="space-y-2">
                <label className="block text-sm text-gray-700">
                  Confidence Threshold: {Math.round(options.confidenceThreshold! * 100)}%
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="0.9"
                  step="0.1"
                  value={options.confidenceThreshold}
                  onChange={(e) => setOptions(prev => ({
                    ...prev,
                    confidenceThreshold: parseFloat(e.target.value)
                  }))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  disabled={isAnalyzing}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Less strict</span>
                  <span>More strict</span>
                </div>
              </div>
            </div>
          </div>

          {/* Analyze Button */}
          <Button
            variant="primary"
            size="lg"
            onClick={handleAnalyze}
            loading={isAnalyzing}
            disabled={isAnalyzing}
            className="w-full"
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Nutrition'}
          </Button>

          {/* Info */}
          <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
            <p className="font-medium mb-1">💡 Tips for better results:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Ensure good lighting and clear visibility</li>
              <li>Include the entire dish in the frame</li>
              <li>Avoid blurry or overly dark images</li>
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ImagePreview;
