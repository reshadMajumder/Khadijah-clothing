import React from 'react';

interface KhadijahLogoProps {
  className?: string;
}

const KhadijahLogo: React.FC<KhadijahLogoProps> = ({ className = "h-8 w-auto" }) => {
  return (
    <div className={`flex items-center ${className}`}>
      {/* Stylized "K" with gradient leaf shapes */}
      <div className="relative mr-2">
        <div className="w-8 h-10 relative">
          {/* Left stem */}
          <div className="absolute left-0 top-0 h-full w-2 rounded-full bg-gradient-to-b from-orange-500 to-amber-400"></div>
          
          {/* Right top leaf */}
          <div className="absolute right-0 top-0 h-4 w-4 rounded-br-full bg-gradient-to-tr from-orange-500 to-amber-400 transform -rotate-45"></div>
          
          {/* Right bottom leaf */}
          <div className="absolute right-0 bottom-0 h-4 w-4 rounded-tr-full bg-gradient-to-br from-orange-500 to-amber-400 transform rotate-45"></div>
          
          {/* Center diagonal */}
          <div className="absolute left-2 top-1/2 h-1.5 w-6 bg-gradient-to-r from-orange-500 to-amber-400 transform -rotate-45 -translate-y-1/2"></div>
        </div>
      </div>
      
      {/* Text "KHADIJAH" */}
      <span className="text-white font-bold text-xl tracking-wider">KHADIJAH</span>
    </div>
  );
};

export default KhadijahLogo;