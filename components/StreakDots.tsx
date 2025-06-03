
import React from 'react';

interface StreakDotsProps {
  streak: number;
  maxDots?: number;
}

const StreakDots: React.FC<StreakDotsProps> = ({ streak, maxDots = 5 }) => {
  return (
    <div className="flex justify-center gap-1.5 my-1">
      {Array.from({ length: maxDots }).map((_, index) => (
        <div
          key={index}
          className={`w-3 h-3 rounded-full ${index < streak ? 'bg-green-500' : 'bg-slate-300'}`}
        ></div>
      ))}
    </div>
  );
};

export default StreakDots;
