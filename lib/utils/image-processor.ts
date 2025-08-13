import sharp from 'sharp';
import { IMAGE_CONFIG } from '@/lib/constants';

export interface ProcessedImage {
  buffer: Buffer;
  format: string;
  width: number;
  height: number;
  size: number;
}

export class ImageProcessor {
  /**
   * Process and optimize an image for LLM analysis
   */
  static async processImage(buffer: Buffer): Promise<ProcessedImage> {
    try {
      const image = sharp(buffer);
      const metadata = await image.metadata();

      // Check if the format is supported
      if (!metadata.format) {
        throw new Error('Unknown image format');
      }

      // Handle HEIF/HEIC files which might not be supported
      if (metadata.format === 'heif' || metadata.format === 'heic') {
        throw new Error('HEIF/HEIC format is not supported. Please convert to JPEG or PNG.');
      }

      // Calculate optimal dimensions while maintaining aspect ratio
      const { width: originalWidth, height: originalHeight } = metadata;
      const maxDimension = Math.max(IMAGE_CONFIG.maxDimensions.width, IMAGE_CONFIG.maxDimensions.height);
      
      let targetWidth = originalWidth!;
      let targetHeight = originalHeight!;

      if (targetWidth > maxDimension || targetHeight > maxDimension) {
        const aspectRatio = targetWidth / targetHeight;
        
        if (targetWidth > targetHeight) {
          targetWidth = maxDimension;
          targetHeight = Math.round(maxDimension / aspectRatio);
        } else {
          targetHeight = maxDimension;
          targetWidth = Math.round(maxDimension * aspectRatio);
        }
      }

      // Process the image
      const processedBuffer = await image
        .resize(targetWidth, targetHeight, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .jpeg({
          quality: Math.round(IMAGE_CONFIG.compressionQuality * 100),
          progressive: true,
        })
        .toBuffer();

      return {
        buffer: processedBuffer,
        format: 'jpeg',
        width: targetWidth,
        height: targetHeight,
        size: processedBuffer.length,
      };
    } catch (error) {
      throw new Error(`Image processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Validate image format and size
   */
  static validateImage(file: File): { valid: boolean; error?: string } {
    // Check file size
    if (file.size > IMAGE_CONFIG.maxSize) {
      return {
        valid: false,
        error: `Image size must be less than ${IMAGE_CONFIG.maxSize / 1024 / 1024}MB`,
      };
    }

    // Check file type
    if (!IMAGE_CONFIG.allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Please upload a valid image file (JPG, PNG, or WebP)',
      };
    }

    return { valid: true };
  }

  /**
   * Convert file to buffer
   */
  static async fileToBuffer(file: File): Promise<Buffer> {
    const arrayBuffer = await file.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  /**
   * Convert buffer to base64 data URL
   */
  static bufferToBase64(buffer: Buffer, format: string = 'jpeg'): string {
    const base64 = buffer.toString('base64');
    return `data:image/${format};base64,${base64}`;
  }

  /**
   * Get image dimensions from buffer
   */
  static async getImageDimensions(buffer: Buffer): Promise<{ width: number; height: number }> {
    try {
      const metadata = await sharp(buffer).metadata();
      return {
        width: metadata.width || 0,
        height: metadata.height || 0,
      };
    } catch (error) {
      throw new Error(`Failed to get image dimensions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
