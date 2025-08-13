import OpenAI from 'openai';
import { NutritionAnalysis, AnalysisOptions } from '@/lib/types/nutrition';
import { PromptTemplates } from './prompt-templates';

export class DeepSeekClient {
  private client: OpenAI;

  constructor() {
    if (!process.env.DEEPSEEK_API_KEY) {
      throw new Error('DeepSeek API key is required');
    }

    this.client = new OpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY,
      baseURL: 'https://api.deepseek.com',
    });
  }

  async analyzeFood(
    imageBase64: string,
    options: AnalysisOptions = {}
  ): Promise<NutritionAnalysis> {
    const startTime = Date.now();

    // DeepSeek doesn't support vision models yet
    throw new Error('DeepSeek does not currently support vision/image analysis. Available models: deepseek-chat, deepseek-reasoner. Please use OpenAI GPT-4V instead.');
  }

  private parseResponse(content: string): any {
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('JSON parsing error:', error);
      console.error('Raw content:', content);
      throw new Error('Failed to parse response as JSON');
    }
  }

  private async fallbackAnalysis(
    imageBase64: string,
    options: AnalysisOptions,
    startTime: number
  ): Promise<NutritionAnalysis> {
    try {
      const fallbackPrompt = PromptTemplates.createErrorRecoveryPrompt();

      const response = await this.client.chat.completions.create({
        model: 'deepseek-vl-7b-chat',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: fallbackPrompt,
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageBase64,
                },
              },
            ],
          },
        ],
        max_tokens: 500,
        temperature: 0.1,
      });

      // Create a basic analysis from the fallback response
      return this.createFallbackAnalysis(
        response.choices[0]?.message?.content || 'Could not analyze image',
        startTime
      );
    } catch (error) {
      console.error('Fallback analysis failed:', error);
      return this.createEmergencyAnalysis(startTime);
    }
  }

  private createFallbackAnalysis(content: string, startTime: number): NutritionAnalysis {
    return {
      id: this.generateId(),
      timestamp: new Date(),
      foods: [
        {
          name: 'Mixed Food Items',
          quantity: 'Estimated serving',
          calories: 300,
          confidence: 0.3,
        },
      ],
      nutrition: {
        calories: 300,
        protein: 15,
        carbohydrates: 30,
        fat: 12,
        fiber: 5,
        sugar: 8,
        sodium: 400,
      },
      overallConfidence: 0.3,
      processingTime: (Date.now() - startTime) / 1000,
      notes: 'Fallback analysis due to processing error',
      warnings: [
        'Unable to provide detailed analysis',
        'Results are rough estimates only',
        'Please try uploading a clearer image',
      ],
    };
  }

  private createEmergencyAnalysis(startTime: number): NutritionAnalysis {
    return {
      id: this.generateId(),
      timestamp: new Date(),
      foods: [],
      nutrition: {
        calories: 0,
        protein: 0,
        carbohydrates: 0,
        fat: 0,
      },
      overallConfidence: 0,
      processingTime: (Date.now() - startTime) / 1000,
      notes: 'Analysis failed',
      warnings: [
        'Could not analyze the image',
        'Please try again with a different image',
      ],
    };
  }

  private validateAnalysis(analysis: NutritionAnalysis): void {
    const { nutrition } = analysis;

    // Basic validation
    if (nutrition.calories < 0 || nutrition.calories > 10000) {
      throw new Error('Invalid calorie count');
    }

    if (nutrition.protein < 0 || nutrition.protein > 500) {
      throw new Error('Invalid protein amount');
    }

    if (nutrition.carbohydrates < 0 || nutrition.carbohydrates > 1000) {
      throw new Error('Invalid carbohydrate amount');
    }

    if (nutrition.fat < 0 || nutrition.fat > 500) {
      throw new Error('Invalid fat amount');
    }

    // Confidence validation
    if (analysis.overallConfidence < 0 || analysis.overallConfidence > 1) {
      analysis.overallConfidence = Math.max(0, Math.min(1, analysis.overallConfidence));
    }
  }

  private generateId(): string {
    return `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
