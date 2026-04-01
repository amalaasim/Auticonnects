import React from 'react';

interface EmotionDisplayProps {
  emotion: string;
  confidence: number;
}

const emotionEmojis: Record<string, string> = {
  happy: '😊',
  sad: '😢',
  angry: '😠',
  neutral: '😐',
  surprised: '😲',
  fearful: '😨',
  disgusted: '🤢',
};

const emotionColors: Record<string, string> = {
  happy: 'bg-green-500/20 border-green-500/50 text-green-200',
  sad: 'bg-blue-500/20 border-blue-500/50 text-blue-200',
  angry: 'bg-red-500/20 border-red-500/50 text-red-200',
  neutral: 'bg-gray-500/20 border-gray-500/50 text-gray-200',
  surprised: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-200',
  fearful: 'bg-purple-500/20 border-purple-500/50 text-purple-200',
  disgusted: 'bg-orange-500/20 border-orange-500/50 text-orange-200',
};

export const EmotionDisplay: React.FC<EmotionDisplayProps> = ({ emotion, confidence }) => {
  const emoji = emotionEmojis[emotion] || '😐';
  const colorClass = emotionColors[emotion] || emotionColors.neutral;

  return (
    <div className={`fixed top-6 right-6 px-4 py-3 rounded-xl border backdrop-blur-sm ${colorClass} z-50 transition-all duration-300`}>
      <div className="flex items-center gap-2">
        <span className="text-2xl">{emoji}</span>
        <div className="flex flex-col">
          <span className="text-sm font-semibold capitalize">{emotion}</span>
          <span className="text-xs opacity-75">{(confidence * 100).toFixed(0)}%</span>
        </div>
      </div>
    </div>
  );
};
