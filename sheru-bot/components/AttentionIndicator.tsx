import React from 'react';

interface AttentionIndicatorProps {
  status: 'LOOKING' | 'NOT_LOOKING' | 'WARNING';
  elapsedTime: number;
  lookingAtScreen: boolean;
}

export const AttentionIndicator: React.FC<AttentionIndicatorProps> = ({
  status,
  elapsedTime,
  lookingAtScreen,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'LOOKING':
        return 'bg-green-500/20 border-green-500/50 text-green-200';
      case 'NOT_LOOKING':
        return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-200';
      case 'WARNING':
        return 'bg-red-500/20 border-red-500/50 text-red-200';
      default:
        return 'bg-gray-500/20 border-gray-500/50 text-gray-200';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'LOOKING':
        return '👀';
      case 'NOT_LOOKING':
        return '⚠️';
      case 'WARNING':
        return '🚨';
      default:
        return '👁️';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'LOOKING':
        return 'Attention Focused';
      case 'NOT_LOOKING':
        return `Not Looking (${elapsedTime}s)`;
      case 'WARNING':
        return 'Please Look at Screen!';
      default:
        return 'Monitoring...';
    }
  };

  return (
    <div className={`absolute top-20 right-6 px-4 py-3 rounded-lg border-2 ${getStatusColor()} backdrop-blur-sm transition-all duration-300 z-20`}>
      <div className="flex items-center gap-3">
        <span className="text-2xl animate-pulse">{getStatusIcon()}</span>
        <div className="flex flex-col">
          <span className="font-semibold text-sm">{getStatusText()}</span>
          <div className="flex items-center gap-2 mt-1">
            <div className={`w-2 h-2 rounded-full ${lookingAtScreen ? 'bg-green-400' : 'bg-red-400'} animate-pulse`} />
            <span className="text-xs opacity-75">
              {lookingAtScreen ? 'Engaged' : 'Distracted'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
