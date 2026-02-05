import React from 'react';

interface DroplinkWaterdropProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  opacity?: number;
  isWatermark?: boolean;
}

const DroplinkWaterdrop: React.FC<DroplinkWaterdropProps> = ({
  size = 'md',
  className = '',
  opacity = 1,
  isWatermark = false
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const watermarkClasses = isWatermark 
    ? 'absolute inset-0 flex items-center justify-center pointer-events-none z-0'
    : '';

  return (
    <div className={`${watermarkClasses} ${className}`} style={{ opacity }}>
      <svg
        className={`${sizeClasses[size]} text-blue-500`}
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Droplink Waterdrop Logo */}
        <path
          d="M12 2C8.5 2 6 4.5 6 8c0 3.5 6 10 6 10s6-6.5 6-10c0-3.5-2.5-6-6-6zm0 8c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"
          fill="currentColor"
        />
        {/* Inner droplet highlight */}
        <path
          d="M12 4c-2.2 0-4 1.8-4 4 0 2.5 4 7 4 7s4-4.5 4-7c0-2.2-1.8-4-4-4zm0 6c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z"
          fill="url(#gradient)"
          opacity="0.3"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default DroplinkWaterdrop;
