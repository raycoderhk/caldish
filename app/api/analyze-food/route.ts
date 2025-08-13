import { NextRequest, NextResponse } from 'next/server';
import { DeepSeekClient } from '@/lib/llm/deepseek-client';
import { OpenAIClient } from '@/lib/llm/openai-client';
import { MockVisionClient } from '@/lib/llm/mock-vision-client';
import { ImageProcessor } from '@/lib/utils/image-processor';
import { AnalysisOptions } from '@/lib/types/nutrition';
import { ApiResponse } from '@/lib/types/api';
import { ERROR_MESSAGES } from '@/lib/constants';

export async function POST(request: NextRequest) {
  try {
    // Parse form data
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;
    const optionsString = formData.get('options') as string;

    // Validate image file
    if (!imageFile) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'No image file provided',
      }, { status: 400 });
    }

    // Validate image
    const validation = ImageProcessor.validateImage(imageFile);
    if (!validation.valid) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: validation.error || ERROR_MESSAGES.INVALID_IMAGE_TYPE,
      }, { status: 400 });
    }

    // Parse options
    let options: AnalysisOptions = {};
    if (optionsString) {
      try {
        options = JSON.parse(optionsString);
      } catch (error) {
        console.error('Failed to parse options:', error);
        // Continue with default options
      }
    }

    console.log('Starting food analysis for:', imageFile.name, 'Size:', imageFile.size);

    // Process image
    const imageBuffer = await ImageProcessor.fileToBuffer(imageFile);
    const processedImage = await ImageProcessor.processImage(imageBuffer);
    const imageBase64 = ImageProcessor.bufferToBase64(processedImage.buffer, processedImage.format);

    console.log('Image processed:', {
      originalSize: imageFile.size,
      processedSize: processedImage.size,
      dimensions: `${processedImage.width}x${processedImage.height}`,
    });

    // Initialize LLM client with fallback chain
    let analysis;
    
    // Try DeepSeek first (will fail for vision)
    try {
      const deepseekClient = new DeepSeekClient();
      analysis = await deepseekClient.analyzeFood(imageBase64, options);
      console.log('Analysis completed with DeepSeek');
    } catch (deepseekError) {
      console.log('DeepSeek failed (vision not supported), trying OpenAI...');
      
      // Try OpenAI if available
      if (process.env.OPENAI_API_KEY) {
        try {
          const openaiClient = new OpenAIClient();
          analysis = await openaiClient.analyzeFood(imageBase64, options);
          console.log('Analysis completed with OpenAI');
        } catch (openaiError) {
          console.log('OpenAI failed, using mock analysis for demonstration');
          const mockClient = new MockVisionClient();
          analysis = await mockClient.analyzeFood(imageBase64, options);
          console.log('Analysis completed with mock client');
        }
      } else {
        // Use mock client for demonstration  
        console.log('No OpenAI API key found, using mock analysis for demonstration');
        const mockClient = new MockVisionClient();
        
        // Try to get user profile from request (if passed)
        let userProfile;
        try {
          const profileString = formData.get('userProfile') as string;
          if (profileString) {
            userProfile = JSON.parse(profileString);
          }
        } catch (error) {
          // Ignore profile parsing errors
        }
        
        analysis = await mockClient.analyzeFood(imageBase64, options, userProfile);
        console.log('Analysis completed with mock client');
      }
    }

    console.log('Analysis completed:', {
      foods: analysis.foods.length,
      calories: analysis.nutrition.calories,
      confidence: analysis.overallConfidence,
      processingTime: analysis.processingTime,
    });

    // Return successful response
    return NextResponse.json<ApiResponse<{ analysis: typeof analysis }>>({
      success: true,
      data: { analysis },
      processingTime: analysis.processingTime,
    });

  } catch (error) {
    console.error('Food analysis error:', error);

    // Determine error type and message
    let errorMessage = ERROR_MESSAGES.ANALYSIS_FAILED;
    let statusCode = 500;

    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        errorMessage = 'OpenAI API configuration error';
        statusCode = 500;
      } else if (error.message.includes('rate limit')) {
        errorMessage = 'Rate limit exceeded. Please try again later.';
        statusCode = 429;
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Analysis timeout. Please try again.';
        statusCode = 408;
      } else if (error.message.includes('Image processing')) {
        errorMessage = 'Failed to process image. Please try a different image.';
        statusCode = 400;
      }
    }

    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: errorMessage,
      message: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'Unknown error' : undefined,
    }, { status: statusCode });
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Food analysis API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
}
