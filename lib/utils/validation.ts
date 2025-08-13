import { z } from 'zod';
import { IMAGE_CONFIG } from '@/lib/constants';

// Image validation schema
export const imageValidationSchema = z.object({
  file: z.custom<File>((file) => file instanceof File, {
    message: 'Invalid file type',
  }),
  size: z.number().max(IMAGE_CONFIG.maxSize, {
    message: `File size must be less than ${IMAGE_CONFIG.maxSize / 1024 / 1024}MB`,
  }),
  type: z.enum(IMAGE_CONFIG.allowedTypes as [string, ...string[]], {
    errorMap: () => ({ message: 'File must be JPG, PNG, or WebP' }),
  }),
});

// Analysis options validation schema
export const analysisOptionsSchema = z.object({
  includeVitamins: z.boolean().optional().default(true),
  includeMinerals: z.boolean().optional().default(true),
  confidenceThreshold: z.number().min(0.1).max(1.0).optional().default(0.7),
  detailedBreakdown: z.boolean().optional().default(false),
});

// Nutrition data validation schema
export const nutritionDataSchema = z.object({
  calories: z.number().min(0).max(10000),
  protein: z.number().min(0).max(500),
  carbohydrates: z.number().min(0).max(1000),
  fat: z.number().min(0).max(500),
  saturatedFat: z.number().min(0).max(200).optional(),
  transFat: z.number().min(0).max(50).optional(),
  polyunsaturatedFat: z.number().min(0).max(200).optional(),
  monounsaturatedFat: z.number().min(0).max(200).optional(),
  cholesterol: z.number().min(0).max(2000).optional(),
  fiber: z.number().min(0).max(100).optional(),
  sugar: z.number().min(0).max(500).optional(),
  addedSugar: z.number().min(0).max(500).optional(),
  sodium: z.number().min(0).max(10000).optional(),
  vitamins: z.object({
    vitaminA: z.number().min(0).max(1000).optional(),
    vitaminC: z.number().min(0).max(2000).optional(),
    vitaminD: z.number().min(0).max(1000).optional(),
    vitaminE: z.number().min(0).max(1000).optional(),
    vitaminK: z.number().min(0).max(1000).optional(),
    thiamine: z.number().min(0).max(1000).optional(),
    riboflavin: z.number().min(0).max(1000).optional(),
    niacin: z.number().min(0).max(1000).optional(),
    vitaminB6: z.number().min(0).max(1000).optional(),
    folate: z.number().min(0).max(1000).optional(),
    vitaminB12: z.number().min(0).max(1000).optional(),
    biotin: z.number().min(0).max(1000).optional(),
    pantothenicAcid: z.number().min(0).max(1000).optional(),
  }).optional(),
  minerals: z.object({
    calcium: z.number().min(0).max(1000).optional(),
    iron: z.number().min(0).max(1000).optional(),
    magnesium: z.number().min(0).max(1000).optional(),
    phosphorus: z.number().min(0).max(1000).optional(),
    potassium: z.number().min(0).max(1000).optional(),
    sodium: z.number().min(0).max(1000).optional(),
    zinc: z.number().min(0).max(1000).optional(),
    copper: z.number().min(0).max(1000).optional(),
    manganese: z.number().min(0).max(1000).optional(),
    selenium: z.number().min(0).max(1000).optional(),
    chromium: z.number().min(0).max(1000).optional(),
    molybdenum: z.number().min(0).max(1000).optional(),
  }).optional(),
});

// Food item validation schema
export const foodItemSchema = z.object({
  name: z.string().min(1).max(100),
  quantity: z.string().min(1).max(50),
  calories: z.number().min(0).max(5000),
  confidence: z.number().min(0).max(1),
});

// Full nutrition analysis validation schema
export const nutritionAnalysisSchema = z.object({
  id: z.string().min(1),
  timestamp: z.date(),
  imageUrl: z.string().url().optional(),
  foods: z.array(foodItemSchema).min(0).max(20),
  nutrition: nutritionDataSchema,
  overallConfidence: z.number().min(0).max(1),
  processingTime: z.number().min(0).max(300),
  notes: z.string().max(500).optional(),
  warnings: z.array(z.string().max(200)).max(10).optional(),
});

// Validation utility functions
export class ValidationUtils {
  static validateImageFile(file: File): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    try {
      imageValidationSchema.parse({
        file,
        size: file.size,
        type: file.type,
      });
      return { valid: true, errors: [] };
    } catch (error) {
      if (error instanceof z.ZodError) {
        errors.push(...error.errors.map(err => err.message));
      } else {
        errors.push('Invalid file');
      }
      return { valid: false, errors };
    }
  }

  static validateAnalysisOptions(options: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    try {
      analysisOptionsSchema.parse(options);
      return { valid: true, errors: [] };
    } catch (error) {
      if (error instanceof z.ZodError) {
        errors.push(...error.errors.map(err => err.message));
      } else {
        errors.push('Invalid analysis options');
      }
      return { valid: false, errors };
    }
  }

  static validateNutritionAnalysis(analysis: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    try {
      nutritionAnalysisSchema.parse(analysis);
      return { valid: true, errors: [] };
    } catch (error) {
      if (error instanceof z.ZodError) {
        errors.push(...error.errors.map(err => `${err.path.join('.')}: ${err.message}`));
      } else {
        errors.push('Invalid nutrition analysis');
      }
      return { valid: false, errors };
    }
  }

  static sanitizeString(input: string, maxLength: number = 500): string {
    return input
      .trim()
      .slice(0, maxLength)
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/\s+/g, ' '); // Normalize whitespace
  }

  static sanitizeNumber(input: number, min: number = 0, max: number = 10000): number {
    return Math.max(min, Math.min(max, Math.round(input * 100) / 100));
  }
}
