import { UserProfile, DailyRecommendations } from '@/lib/types/user';

export class DailyValuesCalculator {
  /**
   * Calculate personalized daily recommendations based on user profile
   * If no profile provided, uses general recommendations
   */
  static calculateDailyRecommendations(profile?: UserProfile): DailyRecommendations {
    // Default values (general adult recommendations)
    let calories = 2000;
    let protein = 50; // grams
    let carbohydrates = 300; // grams  
    let fat = 65; // grams
    let fiber = 25; // grams
    let sodium = 2300; // mg

    if (profile?.weight) {
      // Basic BMR calculation using Mifflin-St Jeor equation
      const weight = profile.weight;
      const age = profile.age || 30; // default age
      const height = 170; // default height in cm (we don't ask for this)

      let bmr: number;
      if (profile.gender === 'male') {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
      } else {
        // Default to female calculation for 'female' or 'other'
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
      }

      // Apply activity multiplier
      const activityMultipliers = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        very_active: 1.9,
      };

      const activityLevel = profile.activityLevel || 'moderate';
      calories = Math.round(bmr * activityMultipliers[activityLevel]);

      // Adjust other nutrients based on calorie needs
      const calorieRatio = calories / 2000;
      protein = Math.round(weight * 0.8); // 0.8g per kg body weight
      carbohydrates = Math.round(calories * 0.5 / 4); // 50% of calories from carbs
      fat = Math.round(calories * 0.3 / 9); // 30% of calories from fat
      fiber = Math.round(14 * calories / 1000); // 14g per 1000 calories
      sodium = Math.round(2300 * calorieRatio); // Scale with calories
    }

    return {
      calories,
      protein,
      carbohydrates,
      fat,
      fiber,
      sodium,
    };
  }

  /**
   * Calculate percentage of daily values for given nutrition data
   */
  static calculatePercentages(
    nutrition: {
      calories: number;
      protein: number;
      carbohydrates: number;
      fat: number;
      fiber?: number;
      sodium?: number;
    },
    dailyRecommendations: DailyRecommendations
  ) {
    return {
      calories: Math.round((nutrition.calories / dailyRecommendations.calories) * 100),
      protein: Math.round((nutrition.protein / dailyRecommendations.protein) * 100),
      carbohydrates: Math.round((nutrition.carbohydrates / dailyRecommendations.carbohydrates) * 100),
      fat: Math.round((nutrition.fat / dailyRecommendations.fat) * 100),
      fiber: Math.round(((nutrition.fiber || 0) / dailyRecommendations.fiber) * 100),
      sodium: Math.round(((nutrition.sodium || 0) / dailyRecommendations.sodium) * 100),
    };
  }

  /**
   * Get recommended weight ranges for different goals
   */
  static getWeightRecommendations() {
    return {
      note: 'Weight is used only to calculate your personal daily nutrition needs',
      privacy: 'This information is not stored and stays in your browser',
      ranges: {
        adult_female: '45-90 kg (100-200 lbs)',
        adult_male: '55-120 kg (120-265 lbs)',
      },
    };
  }
}
