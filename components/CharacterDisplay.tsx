
import React, { useState, useEffect, useRef } from 'react';
import { JapaneseCharacter } from '../types';
import Button from './Button'; 

interface CharacterDisplayProps {
  charData: JapaneseCharacter | null;
  speedInSeconds: number; 
  onSpeedChange: (value: number) => void;
  currentRotationSpeedMs: number; 
  isRotating: boolean;
  onPronounce?: (text: string, lang: string) => void;
}

const CharacterDisplay: React.FC<CharacterDisplayProps> = ({
  charData,
  speedInSeconds, 
  onSpeedChange,
  currentRotationSpeedMs,
  isRotating,
  onPronounce,
}) => {
  const [isCharChanging, setIsCharChanging] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (charData) {
      setIsCharChanging(true);
      const timer = setTimeout(() => setIsCharChanging(false), 150);
      return () => clearTimeout(timer);
    }
  }, [charData]);

  useEffect(() => {
    if (progressRef.current) {
      const element = progressRef.current;
      element.style.transition = 'none';
      element.style.width = '0%';
      
      void element.offsetWidth; 

      if (isRotating && charData) {
        element.style.transition = `width ${currentRotationSpeedMs / 1000}s linear`;
        element.style.width = '100%';
      } else {
         // Persist current width when paused
         const computedWidth = getComputedStyle(element).width;
         element.style.transition = 'none';
         element.style.width = computedWidth;
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [charData, isRotating, currentRotationSpeedMs]);

  const handlePronounceClick = () => {
    if (charData && onPronounce) {
      // Add active class to the button clicked
      const pronounceButton = document.querySelector('.pronounce-btn-indicator.study-page-pronounce'); // Specific selector
      pronounceButton?.classList.add('pronounce-active');
      
      onPronounce(charData.char, 'ja-JP');

      // Remove active class after a delay, assuming pronunciation takes some time
      // This is a simple approach; a more robust way would be to use utterance.onend
      setTimeout(() => {
        pronounceButton?.classList.remove('pronounce-active');
      }, 1000); 
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-7 mb-6 sm:mb-8">
      <h2 className="text-xl sm:text-2xl font-bold text-blue-600 mb-4 sm:mb-5 flex items-center gap-2">
        <i className="fas fa-book bg-gradient-to-br from-blue-600 to-purple-600 text-transparent bg-clip-text"></i>
        Học Ký tự Tiếng Nhật
      </h2>

      <div className="mb-5">
        <div className="flex justify-between mb-1 text-sm font-semibold text-blue-600">
          <span>Tốc độ học:</span>
          <span>{speedInSeconds} giây</span> 
        </div>
        <input
          type="range"
          min="1" 
          max="10" 
          value={speedInSeconds} 
          onChange={(e) => onSpeedChange(parseInt(e.target.value))}
          className="w-full h-2.5 bg-sky-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          id="speedSlider"
          aria-label="Điều chỉnh tốc độ học (giây)"
        />
      </div>
      
      <div className="relative">
        <div 
          className={`font-['Noto_Sans_JP'] text-6xl sm:text-7xl md:text-8xl font-bold text-slate-800 my-4 p-4 sm:p-6 border-2 sm:border-3 border-sky-100 rounded-2xl bg-sky-50 min-h-[180px] sm:min-h-[230px] flex justify-center items-center transition-all duration-150 ease-in-out shadow-inner ${isCharChanging ? 'transform scale-95 opacity-70' : ''}`}
          aria-live="polite"
          aria-atomic="true"
        >
          {charData?.char || '...'}
        </div>
        {charData && onPronounce && (
           <Button 
             onClick={handlePronounceClick}
             variant="outline"
             className="absolute top-2 right-2 sm:top-4 sm:right-4 !p-2 sm:!p-2.5 text-lg sm:text-xl pronounce-btn-indicator study-page-pronounce" // Added specific class
             icon="fas fa-volume-up"
             aria-label={`Phát âm ký tự ${charData.char}`}
           />
        )}
      </div>

      <div className="font-['Inter'] text-2xl sm:text-3xl font-bold text-blue-600 mb-3 text-center">
        {charData?.romaji || '...'}
      </div>

      <div className="h-2.5 bg-slate-200 rounded-lg overflow-hidden mb-5" role="progressbar" aria-valuenow={isRotating ? 100 : 0} aria-valuemin={0} aria-valuemax={100}>
        <div 
            ref={progressRef}
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg"
            style={{ width: '0%' }} 
        ></div>
      </div>

      <div className="mt-4 p-4 sm:p-5 bg-slate-50 rounded-xl border border-slate-200 min-h-[120px] text-sm">
            {charData?.type === 'kanji' && (
                 <div className='text-left space-y-1'>
                    {charData.onyomi && <p className="text-purple-700"><strong>On'yomi:</strong> {charData.onyomi}</p>}
                    {charData.kunyomi && <p className="text-indigo-700"><strong>Kun'yomi:</strong> {charData.kunyomi}</p>}
                    {charData.meaning && <p className="text-teal-700 mt-1"><strong>Nghĩa:</strong> {charData.meaning}</p>}
                    {charData.example && (
                        <div className="text-center mt-3">
                            <p className="font-['Noto_Sans_JP'] font-semibold text-lg sm:text-xl text-slate-700">
                                {charData.example.word}
                            </p>
                            <p className="text-xs sm:text-sm italic text-slate-500">
                                ({charData.example.romaji_example})
                            </p>
                            <p className="text-base sm:text-lg text-green-600 font-semibold">
                                "{charData.example.meaning_vi}"
                            </p>
                        </div>
                    )}
                    {!charData.example && <p className="text-slate-500 text-center mt-3">N/A (ví dụ Kanji)</p>}
                </div>
            )}
            {charData && charData.type !== 'kanji' && charData.example && (
                 <div className="text-center">
                    <p className="font-['Noto_Sans_JP'] font-semibold text-xl sm:text-2xl text-slate-700">
                        {charData.example.word}
                    </p>
                    <p className="sm:text-base italic text-slate-500">
                        ({charData.example.romaji_example})
                    </p>
                    <p className="text-base sm:text-lg text-green-600 font-semibold">
                        "{charData.example.meaning_vi}"
                    </p>
                </div>
            )}
            {charData && charData.type !== 'kanji' && !charData.example && (
                <p className="text-slate-500 text-center">N/A (ví dụ)</p>
            )}
            
            {charData?.note && (
              <p className="text-xs sm:text-sm text-amber-600 font-medium p-2 bg-amber-50 rounded-md mt-3 text-center">
                <i className="fas fa-info-circle mr-1"></i> Lưu ý: {charData.note}
              </p>
            )}
        </div>
    </div>
  );
};

export default CharacterDisplay;
