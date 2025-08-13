'use client';

import React from 'react';
import { 
  ShareIcon, 
  DocumentArrowDownIcon,
  BookmarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { NutritionAnalysis } from '@/lib/types/nutrition';
import { UserProfile } from '@/lib/types/user';
import { NUTRITION_CONFIG } from '@/lib/constants';
import { DailyValuesCalculator } from '@/lib/utils/daily-values-calculator';
import Card from './ui/Card';
import Button from './ui/Button';
import NutritionChart from './NutritionChart';

interface NutritionResultsProps {
  analysis: NutritionAnalysis;
  userProfile?: UserProfile;
  onSave?: () => void;
  onExport?: () => void;
  onShare?: () => void;
  onAnalyzeAnother: () => void;
  onEditProfile?: () => void;
}

const NutritionResults: React.FC<NutritionResultsProps> = ({
  analysis,
  userProfile,
  onSave,
  onExport,
  onShare,
  onAnalyzeAnother,
  onEditProfile,
}) => {
  const { foods, nutrition, overallConfidence, processingTime, warnings } = analysis;
  
  // Calculate personalized daily recommendations and percentages
  const dailyRecommendations = DailyValuesCalculator.calculateDailyRecommendations(userProfile);
  const percentages = DailyValuesCalculator.calculatePercentages(nutrition, dailyRecommendations);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-500';
    if (confidence >= 0.6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.8) return 'High';
    if (confidence >= 0.6) return 'Medium';
    return 'Low';
  };

  const formatDailyValue = (value: number, dailyValue: number) => {
    const percentage = (value / dailyValue) * 100;
    return `${percentage.toFixed(0)}% DV`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Analysis Summary */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Analysis Results</h2>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <div className={`w-3 h-3 rounded-full ${getConfidenceColor(overallConfidence)}`} />
            <span>{getConfidenceText(overallConfidence)} confidence</span>
            <span>•</span>
            <span>{processingTime.toFixed(1)}s</span>
          </div>
        </div>

        {warnings && warnings.length > 0 && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-yellow-800">Caution</h4>
                <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                  {warnings.map((warning, index) => (
                    <li key={index}>• {warning}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Identified Foods */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Identified Foods</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {foods.map((food, index) => (
            <div 
              key={index}
              className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
            >
              <div className={`w-3 h-3 rounded-full ${getConfidenceColor(food.confidence)}`} />
              <div className="flex-1">
                <p className="font-medium text-gray-900">{food.name}</p>
                <p className="text-sm text-gray-600">
                  {food.quantity} • {Math.round(food.confidence * 100)}% confidence
                </p>
              </div>
              <div className="text-sm font-medium text-gray-700">
                {food.calories} cal
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Nutrition Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nutrition Summary */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Nutrition Overview</h3>
            {onEditProfile && (
              <button
                onClick={onEditProfile}
                className="flex items-center space-x-1 text-sm text-primary-600 hover:text-primary-700 transition-colors"
              >
                <UserIcon className="w-4 h-4" />
                <span>{userProfile?.weight ? 'Edit Profile' : 'Add Profile'}</span>
              </button>
            )}
          </div>
          
          {/* Profile Info */}
          {userProfile?.weight ? (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <div className="text-sm text-blue-800">
                <p>📊 Personalized for {userProfile.weight}kg 
                  {userProfile.gender && ` ${userProfile.gender}`}
                  {userProfile.age && `, ${userProfile.age}y`}
                </p>
              </div>
            </div>
          ) : (
            <div className="mb-4 p-3 bg-amber-50 rounded-lg">
              <div className="text-sm text-amber-800">
                <p>📏 Using general nutrition values. <button onClick={onEditProfile} className="underline font-medium">Add your weight</button> for personalized percentages.</p>
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            {/* Total Calories */}
            <div className="flex justify-between items-center p-4 bg-primary-50 rounded-lg">
              <div>
                <span className="font-medium text-primary-900">Total Calories</span>
                <div className="text-xs text-primary-700">
                  {percentages.calories}% of daily goal ({dailyRecommendations.calories} cal)
                  {!userProfile?.weight && <span className="text-amber-600"> *general</span>}
                </div>
              </div>
              <span className="text-2xl font-bold text-primary-900">
                {nutrition.calories.toFixed(0)}
              </span>
            </div>

            {/* Macros Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-gray-900">
                  {nutrition.protein.toFixed(1)}g
                </div>
                <div className="text-sm text-gray-600">Protein</div>
                <div className="text-xs text-gray-500">
                  {percentages.protein}% of {dailyRecommendations.protein}g
                </div>
                <div className={`w-full bg-gray-200 rounded-full h-1.5 mt-1`}>
                  <div 
                    className={`h-1.5 rounded-full ${percentages.protein > 100 ? 'bg-orange-500' : 'bg-green-500'}`}
                    style={{ width: `${Math.min(percentages.protein, 100)}%` }}
                  />
                </div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-gray-900">
                  {nutrition.carbohydrates.toFixed(1)}g
                </div>
                <div className="text-sm text-gray-600">Carbs</div>
                <div className="text-xs text-gray-500">
                  {percentages.carbohydrates}% of {dailyRecommendations.carbohydrates}g
                </div>
                <div className={`w-full bg-gray-200 rounded-full h-1.5 mt-1`}>
                  <div 
                    className={`h-1.5 rounded-full ${percentages.carbohydrates > 100 ? 'bg-orange-500' : 'bg-blue-500'}`}
                    style={{ width: `${Math.min(percentages.carbohydrates, 100)}%` }}
                  />
                </div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-gray-900">
                  {nutrition.fat.toFixed(1)}g
                </div>
                <div className="text-sm text-gray-600">Fat</div>
                <div className="text-xs text-gray-500">
                  {percentages.fat}% of {dailyRecommendations.fat}g
                </div>
                <div className={`w-full bg-gray-200 rounded-full h-1.5 mt-1`}>
                  <div 
                    className={`h-1.5 rounded-full ${percentages.fat > 100 ? 'bg-orange-500' : 'bg-yellow-500'}`}
                    style={{ width: `${Math.min(percentages.fat, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Macros Chart */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Macronutrient Distribution</h3>
          <div className="flex justify-center">
            <NutritionChart nutrition={nutrition} size="md" />
          </div>
        </Card>
      </div>

      {/* Detailed Nutrition */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Nutrition Facts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Macronutrients */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Macronutrients</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Protein</span>
                <span className="font-medium">{nutrition.protein.toFixed(1)}g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Carbohydrates</span>
                <span className="font-medium">{nutrition.carbohydrates.toFixed(1)}g</span>
              </div>
              {nutrition.fiber && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Dietary Fiber</span>
                  <span className="font-medium">{nutrition.fiber.toFixed(1)}g</span>
                </div>
              )}
              {nutrition.sugar && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Sugar</span>
                  <span className="font-medium">{nutrition.sugar.toFixed(1)}g</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Total Fat</span>
                <span className="font-medium">{nutrition.fat.toFixed(1)}g</span>
              </div>
              {nutrition.saturatedFat && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Saturated Fat</span>
                  <span className="font-medium">{nutrition.saturatedFat.toFixed(1)}g</span>
                </div>
              )}
              {nutrition.sodium && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Sodium</span>
                  <span className="font-medium">{nutrition.sodium.toFixed(0)}mg</span>
                </div>
              )}
            </div>
          </div>

          {/* Vitamins */}
          {nutrition.vitamins && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Vitamins</h4>
              <div className="space-y-2">
                {Object.entries(nutrition.vitamins).map(([vitamin, value]) => {
                  if (value === undefined) return null;
                  const displayName = vitamin.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                  return (
                    <div key={vitamin} className="flex justify-between">
                      <span className="text-gray-600">{displayName}</span>
                      <span className="font-medium">{value}% DV</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Minerals */}
          {nutrition.minerals && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Minerals</h4>
              <div className="space-y-2">
                {Object.entries(nutrition.minerals).map(([mineral, value]) => {
                  if (value === undefined) return null;
                  const displayName = mineral.charAt(0).toUpperCase() + mineral.slice(1);
                  return (
                    <div key={mineral} className="flex justify-between">
                      <span className="text-gray-600">{displayName}</span>
                      <span className="font-medium">{value}% DV</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Action Buttons */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          {onSave && (
            <Button variant="primary" icon={BookmarkIcon} onClick={onSave} className="flex-1">
              Save to History
            </Button>
          )}
          {onExport && (
            <Button variant="outline" icon={DocumentArrowDownIcon} onClick={onExport} className="flex-1">
              Export PDF
            </Button>
          )}
          {onShare && (
            <Button variant="outline" icon={ShareIcon} onClick={onShare} className="flex-1">
              Share Results
            </Button>
          )}
          <Button variant="ghost" onClick={onAnalyzeAnother} className="flex-1">
            Analyze Another
          </Button>
        </div>
      </Card>

      {/* Disclaimer */}
      <div className="text-center text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
        <p className="mb-2">⚠️ <strong>Disclaimer</strong></p>
        <p>
          Nutrition analysis is AI-generated and provided for informational purposes only. 
          Results are estimates and may not be completely accurate. Always consult with 
          healthcare professionals for dietary advice.
        </p>
      </div>
    </div>
  );
};

export default NutritionResults;
