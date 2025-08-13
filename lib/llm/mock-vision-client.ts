import { NutritionAnalysis, AnalysisOptions } from '@/lib/types/nutrition';
import { UserProfile } from '@/lib/types/user';

export class MockVisionClient {
  async analyzeFood(
    imageBase64: string,
    options: AnalysisOptions = {},
    userProfile?: UserProfile
  ): Promise<NutritionAnalysis> {
    const startTime = Date.now();

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create a realistic mock analysis
    const mockAnalysis: NutritionAnalysis = {
      id: this.generateId(),
      timestamp: new Date(),
      foods: [
        {
          name: 'Grilled Chicken Breast',
          quantity: '~150g serving',
          calories: 165,
          confidence: 0.85,
        },
        {
          name: 'Steamed Broccoli',
          quantity: '~100g serving',
          calories: 34,
          confidence: 0.90,
        },
        {
          name: 'Brown Rice',
          quantity: '~75g serving',
          calories: 112,
          confidence: 0.75,
        },
        {
          name: 'Olive Oil',
          quantity: '~1 tbsp',
          calories: 119,
          confidence: 0.70,
        },
      ],
      nutrition: {
        calories: 430,
        protein: 32.1,
        carbohydrates: 28.5,
        fat: 14.3,
        saturatedFat: 3.1,
        fiber: 5.2,
        sugar: 4.8,
        sodium: 245,
        ...(options.includeVitamins && {
          vitamins: {
            vitaminA: 45,
            vitaminC: 90,
            vitaminK: 120,
            folate: 15,
            niacin: 65,
          },
        }),
        ...(options.includeMinerals && {
          minerals: {
            iron: 12,
            calcium: 8,
            potassium: 25,
            magnesium: 18,
            phosphorus: 30,
          },
        }),
      },
      overallConfidence: 0.8,
      processingTime: (Date.now() - startTime) / 1000,
      notes: 'Mock analysis for demonstration purposes. This appears to be a healthy, balanced meal with lean protein, vegetables, and complex carbohydrates.',
      warnings: [
        'This is a demonstration with mock data',
        'For real analysis, please configure OpenAI GPT-4V',
        ...(userProfile?.weight 
          ? [`Mock data adjusted for ${userProfile.weight}kg user`] 
          : ['Using general nutrition recommendations']
        ),
      ],
    };

    return mockAnalysis;
  }

  private generateId(): string {
    return `mock_analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
