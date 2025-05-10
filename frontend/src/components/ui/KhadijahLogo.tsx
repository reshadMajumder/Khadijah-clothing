import React from 'react';

interface KhadijahLogoProps {
  className?: string;
}

const KhadijahLogo: React.FC<KhadijahLogoProps> = ({ className = "h-8 w-auto" }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src="/logo.png" 
        alt="Khadijah logo"
        className="h-full w-auto object-contain"
      />
      
      {/* Text "KHADIJAH" */}
      <span className="text-white font-bold text-xl tracking-wider ml-2">KHADIJAH</span>
    </div>
  );
};

export default KhadijahLogo;