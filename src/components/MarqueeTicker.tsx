import React from 'react';

export const MarqueeTicker: React.FC = () => {
  const content = (
    <div className="flex items-center gap-6 whitespace-nowrap text-xs sm:text-sm font-black tracking-wider uppercase">
      <span className="text-[#34D399]">★</span>
      <span>LESS SPENDING / MORE FINDING / KEEP IT ON CAMPUS</span>
      <span className="text-[#34D399]">★</span>
      <span>GOOD STUFF. SMALL PRICES. LOCAL PICKUPS</span>
      <span className="text-[#34D399]">★</span>
      <span>LESS SPENDING / MORE FINDING / KEEP IT ON CAMPUS</span>
      <span className="text-[#34D399]">★</span>
      <span>GOOD STUFF. SMALL PRICES. LOCAL PICKUPS</span>
    </div>
  );

  return (
    <div className="w-full bg-[#072B20] text-white py-3 border-y-2 border-black overflow-hidden select-none">
      <div className="flex w-max animate-marquee">
        {content}
        <span className="mx-6 text-[#34D399]">★</span>
        {content}
      </div>
    </div>
  );
};
