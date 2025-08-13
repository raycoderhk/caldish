import jsPDF from 'jspdf';
import { NutritionAnalysis } from '@/lib/types/nutrition';
import { UserProfile } from '@/lib/types/user';
import { DailyValuesCalculator } from './daily-values-calculator';

export class PDFExporter {
  private doc: jsPDF;

  constructor() {
    // Ensure we're in browser environment
    if (typeof window === 'undefined') {
      throw new Error('PDF export only available in browser environment');
    }
    this.doc = new jsPDF();
  }

  async exportNutritionAnalysis(
    analysis: NutritionAnalysis,
    userProfile?: UserProfile
  ): Promise<void> {
    const { nutrition, identifiedFoods } = analysis;
    const timestamp = new Date(); // Create a fresh timestamp
    const foods = identifiedFoods || [];
    const overallConfidence = foods.length > 0 
      ? foods.reduce((sum, food) => sum + food.confidence, 0) / foods.length 
      : 0;
    
    // Calculate daily values and percentages
    const dailyRecommendations = DailyValuesCalculator.calculateDailyRecommendations(userProfile);
    const percentages = DailyValuesCalculator.calculatePercentages(nutrition, dailyRecommendations);

    // Set up document with modern styling
    this.doc.setFont('helvetica');
    let yPosition = 25;

    // Header with background
    this.doc.setFillColor(34, 197, 94); // Primary green color
    this.doc.rect(0, 0, 210, 30, 'F');
    
    // App icon/emoji area
    this.doc.setFillColor(22, 163, 74); // Darker green
    this.doc.rect(15, 8, 12, 12, 'F');
    this.doc.setFontSize(12);
    this.doc.setTextColor(255, 255, 255);
    this.doc.text('🍽️', 18, 16);

    // Title
    this.doc.setFontSize(24);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(255, 255, 255);
    this.doc.text('Caldish', 35, 16);
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('AI-powered food nutrition analysis', 35, 21);

    // Reset colors and position
    this.doc.setTextColor(0, 0, 0);
    yPosition = 45;

    // Analysis Summary Box (like the web interface)
    this.doc.setFillColor(249, 250, 251); // Light gray background
    this.doc.rect(15, yPosition - 5, 180, 20, 'F');
    this.doc.setDrawColor(229, 231, 235);
    this.doc.rect(15, yPosition - 5, 180, 20, 'S');

    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Analysis Results', 20, yPosition + 3);
    
    // Confidence and timing info (right side)
    this.doc.setFontSize(9);
    this.doc.setFont('helvetica', 'normal');
    const confidenceColor = overallConfidence >= 0.8 ? 'High' : overallConfidence >= 0.6 ? 'Medium' : 'Low';
    this.doc.text(`${confidenceColor} confidence • ${analysis.processingTime.toFixed(1)}s`, 140, yPosition + 3);
    
    this.doc.setFontSize(8);
    this.doc.text(`Generated: ${timestamp.toLocaleDateString()} at ${timestamp.toLocaleTimeString()}`, 20, yPosition + 10);
    
    yPosition += 30;

    // User Profile Info (styled like web interface)
    if (userProfile?.weight) {
      this.doc.setFillColor(239, 246, 255); // Blue background like web
      this.doc.rect(15, yPosition - 3, 180, 12, 'F');
      
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(30, 64, 175); // Blue text
      let profileText = `📊 Personalized for ${userProfile.weight}kg`;
      if (userProfile.gender) profileText += ` ${userProfile.gender}`;
      if (userProfile.age) profileText += `, ${userProfile.age}y`;
      if (userProfile.activityLevel) profileText += `, ${userProfile.activityLevel} activity`;
      
      this.doc.text(profileText, 20, yPosition + 3);
      this.doc.setTextColor(0, 0, 0); // Reset to black
      yPosition += 20;
    } else {
      this.doc.setFillColor(254, 243, 199); // Amber background
      this.doc.rect(15, yPosition - 3, 180, 12, 'F');
      
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(146, 64, 14); // Amber text
      this.doc.text('📏 Using general nutrition values. Add weight for personalized percentages.', 20, yPosition + 3);
      this.doc.setTextColor(0, 0, 0); // Reset to black
      yPosition += 20;
    }

    // Identified Foods
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Identified Foods', 20, yPosition);
    yPosition += 10;

    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    
    foods.forEach((food, index) => {
      // Create card-like appearance for each food item
      this.doc.setFillColor(249, 250, 251); // Gray background
      this.doc.rect(20, yPosition - 2, 170, 10, 'F');
      this.doc.setDrawColor(229, 231, 235);
      this.doc.rect(20, yPosition - 2, 170, 10, 'S');
      
      // Confidence indicator dot
      const confidenceColor = food.confidence >= 0.8 ? [34, 197, 94] : // Green
                             food.confidence >= 0.6 ? [234, 179, 8] : // Yellow
                             [239, 68, 68]; // Red
      this.doc.setFillColor(confidenceColor[0], confidenceColor[1], confidenceColor[2]);
      this.doc.circle(25, yPosition + 2, 1, 'F');
      
      // Food information
      this.doc.setTextColor(0, 0, 0);
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(food.name, 30, yPosition + 1);
      
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(8);
      this.doc.text(`${food.quantity} • ${Math.round(food.confidence * 100)}% confidence`, 30, yPosition + 5);
      
      // Calories on the right
      this.doc.setFontSize(9);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(`${food.calories} cal`, 160, yPosition + 3);
      
      yPosition += 12;
    });
    
    yPosition += 10;

    // Nutrition Overview
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Nutrition Overview', 20, yPosition);
    yPosition += 10;

    // Total Calories - prominently highlighted like web interface
    this.doc.setFillColor(239, 246, 255); // Primary blue background
    this.doc.rect(15, yPosition - 5, 180, 18, 'F');
    this.doc.setDrawColor(147, 197, 253);
    this.doc.rect(15, yPosition - 5, 180, 18, 'S');
    
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(30, 58, 138); // Primary blue text
    this.doc.text('Total Calories', 20, yPosition + 3);
    
    // Large calorie number on the right
    this.doc.setFontSize(20);
    this.doc.text(nutrition.calories.toFixed(0), 160, yPosition + 5);
    
    // Percentage information
    this.doc.setFontSize(8);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(`${percentages.calories}% of daily goal (${dailyRecommendations.calories} cal)`, 20, yPosition + 10);
    if (!userProfile?.weight) {
      this.doc.setTextColor(217, 119, 6); // Amber for general values
      this.doc.text('*general', 155, yPosition + 10);
    }
    
    this.doc.setTextColor(0, 0, 0); // Reset to black
    yPosition += 30;

    // Macronutrients Table
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Macronutrients', 20, yPosition);
    yPosition += 8;

    // Table headers
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Nutrient', 25, yPosition);
    this.doc.text('Amount', 80, yPosition);
    this.doc.text('Daily Value', 120, yPosition);
    this.doc.text('% of Goal', 160, yPosition);
    yPosition += 8;

    // Table content
    this.doc.setFont('helvetica', 'normal');
    const macroNutrients = [
      { name: 'Protein', value: nutrition.protein, unit: 'g', percentage: percentages.protein },
      { name: 'Carbohydrates', value: nutrition.carbohydrates, unit: 'g', percentage: percentages.carbohydrates },
      { name: 'Fat', value: nutrition.fat, unit: 'g', percentage: percentages.fat },
    ];

    if (nutrition.fiber) {
      macroNutrients.push({ name: 'Fiber', value: nutrition.fiber, unit: 'g', percentage: percentages.fiber });
    }
    if (nutrition.sodium) {
      macroNutrients.push({ name: 'Sodium', value: nutrition.sodium, unit: 'mg', percentage: percentages.sodium });
    }

    macroNutrients.forEach((nutrient, index) => {
      // Alternating row colors like a table
      if (index % 2 === 0) {
        this.doc.setFillColor(249, 250, 251);
        this.doc.rect(20, yPosition - 2, 170, 8, 'F');
      }
      
      this.doc.text(nutrient.name, 25, yPosition + 2);
      this.doc.text(`${nutrient.value.toFixed(1)}${nutrient.unit}`, 80, yPosition + 2);
      this.doc.text(`${this.getDailyValue(nutrient.name, dailyRecommendations)}`, 120, yPosition + 2);
      
      // Progress bar representation
      const barWidth = 30;
      const progressWidth = Math.min((nutrient.percentage / 100) * barWidth, barWidth);
      
      // Background bar
      this.doc.setFillColor(229, 231, 235);
      this.doc.rect(160, yPosition - 1, barWidth, 4, 'F');
      
      // Progress bar
      const color = nutrient.percentage > 100 ? [249, 115, 22] : // Orange for over 100%
                   nutrient.name === 'Protein' ? [16, 185, 129] : // Green for protein
                   nutrient.name === 'Carbohydrates' ? [59, 130, 246] : // Blue for carbs
                   [245, 158, 11]; // Yellow for fat
      this.doc.setFillColor(color[0], color[1], color[2]);
      this.doc.rect(160, yPosition - 1, progressWidth, 4, 'F');
      
      // Percentage text
      this.doc.setFontSize(8);
      this.doc.text(`${nutrient.percentage}%`, 195, yPosition + 2);
      this.doc.setFontSize(10);
      
      yPosition += 8;
    });

    yPosition += 10;

    // Vitamins and Minerals (if available)
    const vitamins = analysis.vitamins || {};
    const minerals = analysis.minerals || {};
    if (Object.keys(vitamins).length > 0 || Object.keys(minerals).length > 0) {
      this.doc.setFontSize(12);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('Vitamins & Minerals (% Daily Value)', 20, yPosition);
      yPosition += 8;

      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'normal');

      if (Object.keys(vitamins).length > 0) {
        Object.entries(vitamins).forEach(([vitamin, value]) => {
          if (value !== undefined) {
            const displayName = this.formatNutrientName(vitamin);
            this.doc.text(`${displayName}: ${value}%`, 25, yPosition);
            yPosition += 6;
          }
        });
      }

      if (Object.keys(minerals).length > 0) {
        Object.entries(minerals).forEach(([mineral, value]) => {
          if (value !== undefined) {
            const displayName = this.formatNutrientName(mineral);
            this.doc.text(`${displayName}: ${value}%`, 25, yPosition);
            yPosition += 6;
          }
        });
      }

      yPosition += 10;
    }

    // Analysis Notes (if available)
    const notes = analysis.notes;
    if (notes) {
      this.doc.setFontSize(12);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('Analysis Notes', 20, yPosition);
      yPosition += 8;

      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'normal');
      const splitNotes = this.doc.splitTextToSize(notes, 170);
      this.doc.text(splitNotes, 25, yPosition);
      yPosition += splitNotes.length * 6 + 10;
    }

    // Warnings (if any)
    const warnings = analysis.warnings || [];
    if (warnings.length > 0) {
      this.doc.setFontSize(12);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('Important Notes', 20, yPosition);
      yPosition += 8;

      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'normal');
      warnings.forEach((warning) => {
        const splitWarning = this.doc.splitTextToSize(`• ${warning}`, 165);
        this.doc.text(splitWarning, 25, yPosition);
        yPosition += splitWarning.length * 6 + 2;
      });
      yPosition += 5;
    }

    // Disclaimer (styled like web footer)
    yPosition += 15;
    this.doc.setFillColor(249, 250, 251);
    this.doc.rect(15, yPosition - 5, 180, 25, 'F');
    this.doc.setDrawColor(229, 231, 235);
    this.doc.rect(15, yPosition - 5, 180, 25, 'S');
    
    this.doc.setFontSize(8);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('⚠️ Disclaimer', 20, yPosition + 2);
    
    this.doc.setFont('helvetica', 'normal');
    const disclaimer = 'Nutrition analysis is AI-generated and provided for informational purposes only. Results are estimates and may not be completely accurate. Always consult with healthcare professionals for dietary advice.';
    const splitDisclaimer = this.doc.splitTextToSize(disclaimer, 170);
    this.doc.text(splitDisclaimer, 20, yPosition + 8);

    // Footer
    const pageHeight = this.doc.internal.pageSize.height;
    this.doc.setFontSize(8);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('Generated by Caldish - AI-powered food nutrition analysis', 20, pageHeight - 10);
    this.doc.text(`Page 1`, 180, pageHeight - 10);

    // Generate filename and save (user-friendly filename)
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-');
    const filename = `Caldish_Nutrition_Report_${dateStr}_${timeStr}.pdf`;
    this.doc.save(filename);
  }

  private getDailyValue(nutrientName: string, dailyRecommendations: any): string {
    const mapping: { [key: string]: string } = {
      'Protein': `${dailyRecommendations.protein}g`,
      'Carbohydrates': `${dailyRecommendations.carbohydrates}g`,
      'Fat': `${dailyRecommendations.fat}g`,
      'Fiber': `${dailyRecommendations.fiber}g`,
      'Sodium': `${dailyRecommendations.sodium}mg`,
    };
    return mapping[nutrientName] || 'N/A';
  }

  private formatNutrientName(name: string): string {
    return name
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }
}
