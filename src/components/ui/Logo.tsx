import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md', 
  showText = true
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* New Droplink Logo Image */}
      <div className="relative">
        <img 
          src="https://i.ibb.co/LDGGGXCk/Gemini-Generated-Image-ar8t52ar8t52ar8t-1.png" 
          alt="Droplink Logo" 
          className={`${sizeClasses[size]} object-contain`}
          onError={(e) => {
            // Fallback to SVG if image fails to load
            e.currentTarget.style.display = 'none';
            const fallback = e.currentTarget.nextElementSibling as HTMLElement;
            if (fallback) fallback.style.display = 'block';
          }}
        />
        {/* Fallback SVG Logo */}
        <svg 
          className={`${sizeClasses[size]} hidden`}
          viewBox="0 0 32 32" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="dropletGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
          </defs>
          <path 
            d="M16 28C20 28 24 24 24 20C24 16 20 12 16 8C12 12 8 16 8 20C8 24 12 28 16 28Z" 
            fill="url(#dropletGradient)"
          />
          <path 
            d="M20 24C22 24 24 22 24 20C24 18 22 16 20 18C18 16 16 18 16 20C16 22 18 24 20 24Z" 
            fill="rgba(255,255,255,0.3)"
          />
        </svg>
      </div>
      
      {showText && (
        <div className="flex items-center space-x-2">
          <span className={`font-bold text-[#0ea5e9] ${textSizes[size]}`}>
            Droplink
          </span>
          {/* Mainnet: No Beta badge */}
        </div>
      )}
    </div>
  );
};

export default Logo;
