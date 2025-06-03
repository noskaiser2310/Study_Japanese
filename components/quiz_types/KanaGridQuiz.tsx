
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { JapaneseCharacter, KanaGridQuizItem } from '../../types';
import Button from '../Button';

interface KanaGridQuizProps {
  characters: JapaneseCharacter[];
  onQuizFinish: (score: number, total: number, allItemsInThisSession: KanaGridQuizItem[]) => void;
  onMarkIncorrect?: (charData: JapaneseCharacter) => void;
  isReviewMode?: boolean; 
}

const KanaGridQuiz: React.FC<KanaGridQuizProps> = ({ characters, onQuizFinish, onMarkIncorrect, isReviewMode }) => {
  const [quizItems, setQuizItems] = useState<KanaGridQuizItem[]>([]);
  const [focusedInputId, setFocusedInputId] = useState<string | null>(null);
  const [itemsPerRow, setItemsPerRow] = useState(5); 
  const gridContainerRef = useRef<HTMLDivElement>(null);

  const normalizeRomaji = useCallback((romaji: string): string => {
    return romaji.split('(')[0].trim().split('/')[0].trim().toLowerCase();
  }, []);

  useEffect(() => {
    const newItems = characters.map((char, index) => ({
      ...char,
      id: `${char.char}-${char.type}-${index}-${Math.random().toString(36).substring(2, 9)}`, // Unique ID
      userAnswer: '',
      isCorrect: null,
      revealed: false,
    }));
    setQuizItems(newItems);
    if (newItems.length > 0) {
      setFocusedInputId(newItems[0].id);
    } else {
      setFocusedInputId(null);
    }
  }, [characters]);


  useEffect(() => {
    const calculateItemsPerRow = () => {
      if (gridContainerRef.current) {
        const gridWidth = gridContainerRef.current.offsetWidth;
        const firstCard = gridContainerRef.current.querySelector(':scope > div.kana-grid-card') as HTMLElement;
        
        if (firstCard) {
          const cardRenderedWidth = firstCard.offsetWidth;
          const gapStyle = getComputedStyle(gridContainerRef.current).gap;
          const gap = gapStyle && gapStyle !== "normal" ? parseFloat(gapStyle) : 16; // Default 16px (gap-4)

          if (cardRenderedWidth > 0) {
            setItemsPerRow(Math.max(1, Math.floor(gridWidth / (cardRenderedWidth + gap))));
          }
        } else if (characters.length > 0) { // Fallback if direct card query fails
            const approxCardWidth = 100; // Approximate width for small screens
            const gap = 12; // Tailwind gap-3
            setItemsPerRow(Math.max(1, Math.floor(gridWidth / (approxCardWidth + gap))));
        }
      }
    };

    const timerId = setTimeout(calculateItemsPerRow, 0); // Calculate after initial render
    
    window.addEventListener('resize', calculateItemsPerRow);
    return () => {
      clearTimeout(timerId);
      window.removeEventListener('resize', calculateItemsPerRow);
    };
  }, [characters.length]); // Re-calculate if number of characters (and thus quizItems) changes


  useEffect(() => {
    if (focusedInputId) {
      const inputElement = document.getElementById(`kana-input-${focusedInputId}`);
      inputElement?.focus();
    }
  }, [focusedInputId]);

  const checkSingleAnswer = useCallback((id: string, currentItemsState: KanaGridQuizItem[]) => {
    return currentItemsState.map(item => {
      if (item.id === id && !item.revealed) {
        const correctRomaji = normalizeRomaji(item.romaji);
        const isCorrect = item.userAnswer.trim().toLowerCase() === correctRomaji;
        if (!isCorrect && onMarkIncorrect && !isReviewMode) { // Only mark incorrect if not in review mode for new mistakes
          onMarkIncorrect(item);
        } else if (!isCorrect && onMarkIncorrect && isReviewMode && item.isCorrect === null) {
           // If in review mode and it's the first check for this item in this review session
           onMarkIncorrect(item); // Still counts as a mistake in this review round
        }
        return { ...item, isCorrect, revealed: true };
      }
      return item;
    });
  }, [onMarkIncorrect, normalizeRomaji, isReviewMode]);

  const handleInputChange = (id: string, value: string) => {
    setQuizItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, userAnswer: value } : item
      )
    );
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, id: string) => {
    const currentIndex = quizItems.findIndex(item => item.id === id);
    if (currentIndex === -1) return;

    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      // Check answer for the current item
      const itemsAfterCheck = checkSingleAnswer(id, quizItems);
      setQuizItems(itemsAfterCheck);

      // Find next focusable item (unrevealed or next in line)
      const nextFocusableItem = itemsAfterCheck.find((item, idx) => idx > currentIndex && !item.revealed) || itemsAfterCheck.find(item => !item.revealed && item.id !== id);
      
      if (nextFocusableItem) {
        setFocusedInputId(nextFocusableItem.id);
      } else {
        // If no unrevealed items left, focus finish button
        const allRevealed = itemsAfterCheck.every(item => item.revealed);
        if (allRevealed) {
             (document.getElementById('finish-kana-grid-quiz-btn') as HTMLElement)?.focus();
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const targetIndex = currentIndex + itemsPerRow;
      if (targetIndex < quizItems.length) setFocusedInputId(quizItems[targetIndex].id);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const targetIndex = currentIndex - itemsPerRow;
      if (targetIndex >= 0) setFocusedInputId(quizItems[targetIndex].id);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (currentIndex < quizItems.length - 1) setFocusedInputId(quizItems[currentIndex + 1].id);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (currentIndex > 0) setFocusedInputId(quizItems[currentIndex - 1].id);
    }
  };

  const handleBlurCheck = (id: string) => {
    // Only check on blur if input is not empty and not yet revealed
    setQuizItems(prevItems => {
      const itemToCheck = prevItems.find(item => item.id === id);
      if (itemToCheck && itemToCheck.userAnswer.trim() !== '' && !itemToCheck.revealed) {
        return checkSingleAnswer(id, prevItems);
      }
      return prevItems;
    });
  };

  const handleFinishQuiz = () => {
    let itemsAfterFinalCheck = [...quizItems];
    // Check any remaining unrevealed items
    itemsAfterFinalCheck = itemsAfterFinalCheck.map(item => {
      if (!item.revealed) { 
        const correctRomaji = normalizeRomaji(item.romaji);
        const isCorrect = item.userAnswer.trim().toLowerCase() === correctRomaji;
        if (!isCorrect && onMarkIncorrect && !isReviewMode) {
          onMarkIncorrect(item);
        } else if (!isCorrect && onMarkIncorrect && isReviewMode && item.isCorrect === null) {
           onMarkIncorrect(item);
        }
        return { ...item, isCorrect, revealed: true };
      }
      return item;
    });

    setQuizItems(itemsAfterFinalCheck);
    const score = itemsAfterFinalCheck.filter(item => item.isCorrect).length;
    onQuizFinish(score, itemsAfterFinalCheck.length, itemsAfterFinalCheck);
  };

  if (!quizItems.length && characters.length > 0) { 
    return <div className="text-center p-8 text-slate-600">Đang tải ký tự...</div>;
  }
  if (characters.length === 0) {
    return (
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md mx-auto">
            <p className="text-slate-600 text-lg mb-6">Không có ký tự nào được chọn để kiểm tra.</p>
            <Button onClick={() => onQuizFinish(0, 0, [])} variant="primary" icon="fas fa-arrow-left">
                Quay Lại
            </Button>
        </div>
    );
  }

  const answeredCount = quizItems.filter(item => item.revealed).length;
  const totalCount = quizItems.length;

  return (
    <div className="p-4 sm:p-6 bg-slate-50 rounded-2xl shadow-2xl">
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-800 mb-2">
        {isReviewMode ? "Ôn Tập Lỗi Sai (Kana)" : "Gõ Romaji"}
      </h2>
      <p className="text-center text-sm text-slate-500 mb-5">
        Điền Romaji, nhấn Enter hoặc Tab để kiểm tra. Dùng phím mũi tên để di chuyển.
      </p>
      
      <div className="text-center mb-5 text-base sm:text-lg font-bold text-blue-700">
        Đã trả lời: {answeredCount} / {totalCount}
      </div>

      <div
        ref={gridContainerRef}
        className="kana-grid-container grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 gap-3 sm:gap-4 mb-8"
        role="form"
        aria-labelledby="kana-grid-title"
      >
        {quizItems.map((item) => {
          let cardBaseClass = "kana-grid-card bg-white border-2 rounded-xl p-3 flex flex-col items-center justify-between shadow-md hover:shadow-lg transition-all duration-200 ease-in-out";
          let cardStateClass = "border-slate-300"; // Default border
          let inputBaseClass = "w-full text-center text-base sm:text-lg p-2 border-2 rounded-md focus:outline-none mt-2 transition-colors duration-200";
          let inputStateClass = "border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"; // Default input border + focus

          if (item.revealed) {
            if (item.isCorrect) {
              cardStateClass = "bg-green-50 border-green-400";
              inputStateClass = "border-green-400 bg-green-100 text-green-700 font-semibold cursor-default";
            } else {
              cardStateClass = "bg-red-50 border-red-400";
              inputStateClass = "border-red-400 bg-red-100 text-red-700 font-semibold cursor-default";
            }
          } else if (item.id === focusedInputId) {
             cardStateClass = "border-blue-500 shadow-lg"; // Focused card border
             // inputStateClass already handles its own focus style
          }

          return (
            <div key={item.id} className={`${cardBaseClass} ${cardStateClass}`}>
              <div className="font-['Noto_Sans_JP'] text-4xl sm:text-5xl whitespace-nowrap font-bold text-slate-800 flex-grow flex items-baseline justify-center select-none">
                {item.char}
              </div>
              <input
                id={`kana-input-${item.id}`}
                type="text"
                value={item.userAnswer}
                onChange={e => handleInputChange(item.id, e.target.value)}
                onBlur={() => handleBlurCheck(item.id)}
                onKeyDown={e => handleInputKeyDown(e, item.id)}
                onFocus={() => setFocusedInputId(item.id)}
                className={`${inputBaseClass} ${inputStateClass}`}
                disabled={item.revealed}
                autoComplete="off"
                autoCapitalize="none"
                spellCheck="false"
                aria-label={`Nhập Romaji cho ký tự ${item.char}`}
                aria-describedby={item.revealed ? `feedback-${item.id}` : undefined}
              />
              {item.revealed && !item.isCorrect && (
                <div id={`feedback-${item.id}`} className="text-xs sm:text-sm text-center mt-1.5" aria-live="polite">
                    <span className="block text-red-600 font-semibold">Đáp án: {normalizeRomaji(item.romaji)}</span>
                    <span className="block text-slate-500">Bạn nhập: {item.userAnswer || "(trống)"}</span>
                </div>
              )}
               {item.revealed && item.isCorrect && (
                 <div id={`feedback-${item.id}`} className="text-xs sm:text-sm text-center mt-1.5 text-green-600 font-semibold" aria-live="polite">
                    Chính xác!
                </div>
               )}
            </div>
          );
        })}
      </div>
      <div className="text-center">
        <Button 
            id="finish-kana-grid-quiz-btn"
            onClick={handleFinishQuiz} 
            variant="primary" 
            icon="fas fa-check-circle" 
            className="text-lg py-3 px-6"
            aria-label="Hoàn thành và xem kết quả"
        >
          Hoàn Thành
        </Button>
      </div>
    </div>
  );
};

export default KanaGridQuiz;
