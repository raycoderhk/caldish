'use client';

import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { NutritionData } from '@/lib/types/nutrition';

ChartJS.register(ArcElement, Tooltip, Legend);

interface NutritionChartProps {
  nutrition: NutritionData;
  size?: 'sm' | 'md' | 'lg';
}

const NutritionChart: React.FC<NutritionChartProps> = ({ 
  nutrition, 
  size = 'md' 
}) => {
  const { protein, carbohydrates, fat } = nutrition;

  const data = {
    labels: [
      `Protein (${protein.toFixed(1)}g)`,
      `Carbs (${carbohydrates.toFixed(1)}g)`,
      `Fat (${fat.toFixed(1)}g)`,
    ],
    datasets: [
      {
        data: [protein, carbohydrates, fat],
        backgroundColor: [
          '#10B981', // Emerald - Protein
          '#3B82F6', // Blue - Carbs
          '#F59E0B', // Amber - Fat
        ],
        borderColor: [
          '#059669',
          '#2563EB',
          '#D97706',
        ],
        borderWidth: 2,
        hoverBackgroundColor: [
          '#34D399',
          '#60A5FA',
          '#FBBF24',
        ],
      },
    ],
  };

  const sizeConfig = {
    sm: { width: 200, height: 200 },
    md: { width: 300, height: 300 },
    lg: { width: 400, height: 400 },
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed;
            const total = protein + carbohydrates + fat;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${percentage}%`;
          },
        },
      },
    },
    cutout: '60%',
  };

  return (
    <div className="relative">
      <div 
        style={{ 
          width: sizeConfig[size].width, 
          height: sizeConfig[size].height 
        }}
        className="mx-auto"
      >
        <Doughnut data={data} options={options} />
      </div>
      
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="text-2xl font-bold text-gray-900">
          {nutrition.calories}
        </div>
        <div className="text-sm text-gray-600">calories</div>
      </div>
    </div>
  );
};

export default NutritionChart;
