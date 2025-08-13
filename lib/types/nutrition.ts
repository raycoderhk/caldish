export interface FoodItem {
  name: string;
  quantity: string;
  calories: number;
  confidence: number;
}

export interface VitaminData {
  vitaminA?: number; // % Daily Value
  vitaminC?: number;
  vitaminD?: number;
  vitaminE?: number;
  vitaminK?: number;
  thiamine?: number;
  riboflavin?: number;
  niacin?: number;
  vitaminB6?: number;
  folate?: number;
  vitaminB12?: number;
  biotin?: number;
  pantothenicAcid?: number;
}

export interface MineralData {
  calcium?: number; // % Daily Value
  iron?: number;
  magnesium?: number;
  phosphorus?: number;
  potassium?: number;
  sodium?: number;
  zinc?: number;
  copper?: number;
  manganese?: number;
  selenium?: number;
  chromium?: number;
  molybdenum?: number;
}

export interface NutritionData {
  calories: number;
  protein: number; // grams
  carbohydrates: number; // grams
  fat: number; // grams
  saturatedFat?: number; // grams
  transFat?: number; // grams
  polyunsaturatedFat?: number; // grams
  monounsaturatedFat?: number; // grams
  cholesterol?: number; // mg
  fiber?: number; // grams
  sugar?: number; // grams
  addedSugar?: number; // grams
  sodium?: number; // mg
  vitamins?: VitaminData;
  minerals?: MineralData;
}

export interface NutritionAnalysis {
  id: string;
  timestamp: Date;
  imageUrl?: string;
  foods: FoodItem[];
  nutrition: NutritionData;
  overallConfidence: number;
  processingTime: number;
  notes?: string;
  warnings?: string[];
}

export interface AnalysisOptions {
  includeVitamins?: boolean;
  includeMinerals?: boolean;
  confidenceThreshold?: number;
  detailedBreakdown?: boolean;
}

export interface UploadedImage {
  file: File;
  preview: string;
  size: number;
  type: string;
}
