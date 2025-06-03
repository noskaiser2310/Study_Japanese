
import React from 'react';
import StreakDots from './StreakDots';

interface StatsProps {
  learnedCount: number;
  accuracy?: number; // Optional
  streak?: number;   // Optional
}

const StatCard: React.FC<{label: string; value?: string | number; children?: React.ReactNode}> = ({ label, value, children }) => (
    <div className="bg-white rounded-2xl p-4 sm:p-5 text-center shadow-lg">
        <div className="text-sm font-semibold text-slate-500 mb-1">{label}</div>
        {children ? children : <div className="text-3xl sm:text-4xl font-bold text-blue-600">{value}</div>}
    </div>
);


const Stats: React.FC<StatsProps> = ({ learnedCount, accuracy, streak }) => {
  return (
    <div className={`grid grid-cols-1 ${accuracy !== undefined && streak !== undefined ? 'sm:grid-cols-3' : 'sm:grid-cols-1 justify-items-center'} gap-4 sm:gap-5 mb-6 sm:mb-8`}>
      <div className={`${accuracy !== undefined && streak !== undefined ? '' : 'sm:w-1/3'}`}>
        <StatCard label="Ký tự đã học" value={learnedCount} />
      </div>
      {accuracy !== undefined && (
        <StatCard label="Độ chính xác" value={`${accuracy}%`} />
      )}
      {streak !== undefined && (
        <StatCard label="Chuỗi chính xác">
          <StreakDots streak={streak} />
          <div className="text-3xl sm:text-4xl font-bold text-blue-600">{streak}</div>
        </StatCard>
      )}
    </div>
  );
};

export default Stats;