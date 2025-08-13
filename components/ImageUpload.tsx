'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { CloudArrowUpIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { IMAGE_CONFIG, ERROR_MESSAGES } from '@/lib/constants';
import { UploadedImage } from '@/lib/types/nutrition';
import Card from './ui/Card';
import Button from './ui/Button';

interface ImageUploadProps {
  onImageSelect: (image: UploadedImage) => void;
  onError: (error: string) => void;
  isLoading?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onImageSelect, 
  onError, 
  isLoading = false 
}) => {
  const [dragActive, setDragActive] = useState(false);

  const validateImage = useCallback((file: File): string | null => {
    // Check file size
    if (file.size > IMAGE_CONFIG.maxSize) {
      return ERROR_MESSAGES.IMAGE_TOO_LARGE;
    }

    // Check file type
    if (!IMAGE_CONFIG.allowedTypes.includes(file.type)) {
      return ERROR_MESSAGES.INVALID_IMAGE_TYPE;
    }

    return null;
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setDragActive(false);
    
    if (acceptedFiles.length === 0) {
      onError(ERROR_MESSAGES.INVALID_IMAGE_TYPE);
      return;
    }

    const file = acceptedFiles[0];
    const validationError = validateImage(file);
    
    if (validationError) {
      onError(validationError);
      return;
    }

    // Create preview URL
    const preview = URL.createObjectURL(file);
    
    const uploadedImage: UploadedImage = {
      file,
      preview,
      size: file.size,
      type: file.type,
    };

    onImageSelect(uploadedImage);
  }, [onImageSelect, onError, validateImage]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    maxFiles: 1,
    disabled: isLoading,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
  });

  return (
    <Card className={`transition-all duration-200 cursor-pointer ${
      isDragActive || dragActive 
        ? 'border-primary-500 bg-primary-50 border-2' 
        : 'border-dashed border-2 border-gray-300 hover:border-gray-400'
    } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <div {...getRootProps()} className="text-center py-8">
        <input {...getInputProps()} />
        
        <div className="space-y-4">
          {/* Icon */}
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
            {isDragActive || dragActive ? (
              <CloudArrowUpIcon className="w-8 h-8 text-primary-600" />
            ) : (
              <PhotoIcon className="w-8 h-8 text-gray-400" />
            )}
          </div>

          {/* Content */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {isDragActive ? 'Drop your image here' : 'Upload a food photo'}
            </h3>
            <p className="text-gray-600 mb-4">
              {isDragActive 
                ? 'Release to upload your image'
                : 'Drag and drop your image here, or click to browse'
              }
            </p>
            
            {!isDragActive && (
              <Button 
                variant="primary"
                disabled={isLoading}
                loading={isLoading}
                type="button"
              >
                Choose File
              </Button>
            )}
          </div>

          {/* File requirements */}
          <div className="text-xs text-gray-500 space-y-1">
            <p>Supports: JPG, PNG, WebP</p>
            <p>Maximum size: {IMAGE_CONFIG.maxSize / 1024 / 1024}MB</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ImageUpload;
