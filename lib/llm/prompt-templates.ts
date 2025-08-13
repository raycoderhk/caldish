import { AnalysisOptions } from '@/lib/types/nutrition';

export class PromptTemplates {
  static createNutritionAnalysisPrompt(options: AnalysisOptions = {}): string {
    const includeVitamins = options.includeVitamins ?? true;
    const includeMinerals = options.includeMinerals ?? true;
    const detailedBreakdown = options.detailedBreakdown ?? false;
    const confidenceThreshold = options.confidenceThreshold ?? 0.7;

    return `Analyze this food image and provide detailed nutritional information.

REQUIREMENTS:
1. Identify all visible food items with confidence levels
2. Estimate portion sizes based on visual cues
3. Calculate comprehensive nutritional values per serving
4. Only include foods with confidence >= ${confidenceThreshold}
5. Provide realistic estimates based on typical serving sizes

${detailedBreakdown ? `
DETAILED BREAKDOWN:
- Break down each food item separately
- Explain portion size estimation method
- Note any assumptions made
` : ''}

RETURN STRICT JSON FORMAT:
{
  "foods": [
    {
      "name": "string (food name)",
      "quantity": "string (estimated portion with units)",
      "calories": number,
      "confidence": number (0-1)
    }
  ],
  "nutrition": {
    "calories": number,
    "protein": number,
    "carbohydrates": number,
    "fat": number,
    "saturatedFat": number,
    "transFat": number,
    "cholesterol": number,
    "fiber": number,
    "sugar": number,
    "sodium": number${includeVitamins ? `,
    "vitamins": {
      "vitaminA": number,
      "vitaminC": number,
      "vitaminD": number,
      "vitaminE": number,
      "vitaminK": number,
      "thiamine": number,
      "riboflavin": number,
      "niacin": number,
      "vitaminB6": number,
      "folate": number,
      "vitaminB12": number
    }` : ''}${includeMinerals ? `,
    "minerals": {
      "calcium": number,
      "iron": number,
      "magnesium": number,
      "phosphorus": number,
      "potassium": number,
      "zinc": number,
      "copper": number,
      "manganese": number,
      "selenium": number
    }` : ''}
  },
  "overallConfidence": number (0-1),
  "notes": "string (brief analysis notes)",
  "warnings": ["string"] (any concerns about accuracy)
}

NOTES:
- All nutrients in grams except sodium (mg) and vitamins/minerals (% Daily Value)
- Be conservative with estimates - it's better to underestimate than overestimate
- If you can't identify a food clearly, don't include it
- Consider cooking methods that might affect nutrition (fried, baked, etc.)
- Account for visible oils, sauces, and seasonings
- Provide realistic portion sizes based on what's visible`;
  }

  static createFallbackPrompt(): string {
    return `I can see a food image, but I'm having difficulty providing accurate nutritional analysis. 

Please describe what you can see in the image, and I'll provide general nutritional guidance.

Alternatively, you can:
1. Try uploading a clearer image with better lighting
2. Ensure the entire dish is visible in the frame
3. Avoid blurry or heavily filtered images

For the most accurate results, please provide:
- Well-lit, clear images
- Full view of the dish/food items
- Minimal background distractions`;
  }

  static createErrorRecoveryPrompt(): string {
    return `The previous analysis attempt failed. Let me try a simpler approach.

Please identify the main food items visible in this image and provide basic calorie estimates.

Focus on:
1. Main protein sources
2. Carbohydrate sources  
3. Visible fats/oils
4. Approximate portion sizes

Return a simplified response with just the essential nutritional information.`;
  }
}
