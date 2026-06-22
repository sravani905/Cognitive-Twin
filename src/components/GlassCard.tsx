import React from 'react';
import { cn } from '../lib/utils';

export const TechnicalCard = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div 
      className={cn(
        "bg-white/75 border border-white/80 rounded-[2.5rem] p-8 w-full relative overflow-hidden backdrop-blur-2xl shadow-xl shadow-[#8A2BE2]/8 transition-all duration-200", 
        className
      )}
      {...props}
    >
      <div className="h-full w-full">
        {children}
      </div>
    </div>
  );
};


