'use client';

import React, { useState } from 'react';
import { XMarkIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { UserProfile } from '@/lib/types/user';
import { DailyValuesCalculator } from '@/lib/utils/daily-values-calculator';
import Card from './ui/Card';
import Button from './ui/Button';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (profile: UserProfile) => void;
  currentProfile?: UserProfile;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentProfile,
}) => {
  const [profile, setProfile] = useState<UserProfile>(currentProfile || {});
  const [showInfo, setShowInfo] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(profile);
    onClose();
  };

  const handleSkip = () => {
    onSave({}); // Empty profile uses default values
    onClose();
  };

  const recommendations = DailyValuesCalculator.getWeightRecommendations();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <Card padding="lg">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Personalize Your Nutrition
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Privacy Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-2">
              <InformationCircleIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-900 mb-1">Privacy First & Optional</p>
                <p className="text-blue-800">
                  Weight helps us calculate personalized nutrition recommendations. Age and gender are optional for fine-tuning. 
                  All data stays in your browser - nothing is stored on our servers.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Weight */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weight (recommended)
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="70"
                  value={profile.weight || ''}
                  onChange={(e) => setProfile(prev => ({
                    ...prev,
                    weight: e.target.value ? Number(e.target.value) : undefined
                  }))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  min="30"
                  max="300"
                />
                <span className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm text-gray-600">
                  kg
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                <span className="font-medium">Most important for personalization.</span> Used to calculate protein needs and calorie requirements.
              </p>
            </div>

            {/* Optional Fields - Collapsible */}
            <div className="border-t pt-4">
              <button
                type="button"
                onClick={() => setShowInfo(!showInfo)}
                className="flex items-center space-x-2 text-sm text-primary-600 hover:text-primary-700 transition-colors mb-4"
              >
                <span>{showInfo ? '▼' : '▶'}</span>
                <span>Optional: Add age, gender & activity level for better accuracy</span>
              </button>

              {showInfo && (
                <div className="space-y-4 pl-4 border-l-2 border-gray-200">
                  {/* Age */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age
                    </label>
                    <input
                      type="number"
                      placeholder="25"
                      value={profile.age || ''}
                      onChange={(e) => setProfile(prev => ({
                        ...prev,
                        age: e.target.value ? Number(e.target.value) : undefined
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      min="13"
                      max="120"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Affects metabolism calculation
                    </p>
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>
                    <select
                      value={profile.gender || ''}
                      onChange={(e) => setProfile(prev => ({
                        ...prev,
                        gender: e.target.value as UserProfile['gender'] || undefined
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Prefer not to say</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Small adjustment to metabolic rate
                    </p>
                  </div>

                  {/* Activity Level */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Activity Level
                    </label>
                    <select
                      value={profile.activityLevel || ''}
                      onChange={(e) => setProfile(prev => ({
                        ...prev,
                        activityLevel: e.target.value as UserProfile['activityLevel'] || undefined
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select activity level</option>
                      <option value="sedentary">Sedentary (little/no exercise)</option>
                      <option value="light">Lightly active (light exercise 1-3 days/week)</option>
                      <option value="moderate">Moderately active (moderate exercise 3-5 days/week)</option>
                      <option value="active">Very active (hard exercise 6-7 days/week)</option>
                      <option value="very_active">Extremely active (very hard exercise, physical job)</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Adjusts daily calorie needs
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Weight Guidelines */}
            <div className="pt-2">
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg space-y-2">
                <p><strong>Weight guidelines:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Adult female: {recommendations.ranges.adult_female}</li>
                  <li>Adult male: {recommendations.ranges.adult_male}</li>
                </ul>
                <p className="text-xs text-gray-500 mt-2">
                  💡 Even just weight alone helps us give you much better nutrition percentages!
                </p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 mt-8">
            <Button
              variant="outline"
              onClick={handleSkip}
              className="flex-1"
            >
              Skip (Use General Values)
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              className="flex-1"
              disabled={!profile.weight && Object.keys(profile).filter(k => profile[k as keyof UserProfile]).length === 0}
            >
              {profile.weight ? 'Save Profile' : 'Save Settings'}
            </Button>
          </div>

          {/* Footer note */}
          <p className="text-xs text-gray-500 text-center mt-4">
            {profile.weight 
              ? 'Weight-based personalization active. You can change this anytime.'
              : 'You can add your weight later for personalized nutrition percentages.'
            }
          </p>
        </Card>
      </div>
    </div>
  );
};

export default UserProfileModal;
