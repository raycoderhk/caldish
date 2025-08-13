export interface UserProfile {
  weight?: number; // kg
  age?: number; // years
  gender?: 'male' | 'female' | 'other';
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
}

export interface DailyRecommendations {
  calories: number;
  protein: number; // grams
  carbohydrates: number; // grams
  fat: number; // grams
  fiber: number; // grams
  sodium: number; // mg
  // Add vitamins/minerals as needed
}

export interface NutrientPercentages {
  calories: number; // % of daily value
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  sodium: number;
}
