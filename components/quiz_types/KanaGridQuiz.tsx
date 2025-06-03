
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
      id: `${char.char}-${char.type}-${index}-${Math.random().toString(36).substring(2, 9)}`,
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
        // Query for a direct child that is a card, to avoid complex selectors
        const firstCard = gridContainerRef.current.querySelector(':scope > div.kana-grid-card') as HTMLElement;
        
        if (firstCard) {
           // Use offsetWidth for the element's rendered width
          const cardRenderedWidth = firstCard.offsetWidth;
          const gapStyle = getComputedStyle(gridContainerRef.current).gap;
          // Default gap, assuming Tailwind's gap-3 or gap-4 (12px or 16px)
          const gap = gapStyle && gapStyle !== "normal" ? parseFloat(gapStyle) : 16; 

          if (cardRenderedWidth > 0) {
            // Add gap to card width for total space per item
            setItemsPerRow(Math.max(1, Math.floor(gridWidth / (cardRenderedWidth + gap))));
          }
        } else if (quizItems.length > 0) { // Fallback if direct card query fails but items exist
            const approxCardWidth = 100; // Approximate width
            const gap = 16;
            setItemsPerRow(Math.max(1, Math.floor(gridWidth / (approxCardWidth + gap))));
        }
      }
    };

    // Call once after DOM is ready for gridContainerRef
    // Timeout ensures that the grid has rendered for width calculation
    const timerId = setTimeout(calculateItemsPerRow, 0);
    
    window.addEventListener('resize', calculateItemsPerRow);
    return () => {
      clearTimeout(timerId);
      window.removeEventListener('resize', calculateItemsPerRow);
    };
  }, [quizItems.length]); // Rerun if the number of items changes, as this might affect layout


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
        if (!isCorrect && onMarkIncorrect) {
          onMarkIncorrect(item);
        }
        return { ...item, isCorrect, revealed: true };
      }
      return item;
    });
  }, [onMarkIncorrect, normalizeRomaji]);

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

    if (e.key === 'Enter') {
      e.preventDefault();
      setQuizItems(prev => checkSingleAnswer(id, prev));
      const nextFocusableItem = quizItems.find((item, idx) => idx > currentIndex && !item.revealed) || quizItems.find(item => !item.revealed && item.id !== id);
      
      if (nextFocusableItem) {
        setFocusedInputId(nextFocusableItem.id);
      } else {
         // If no unrevealed items left, or current was the last one, focus finish button
        const allRevealed = quizItems.every(item => item.revealed);
        if (allRevealed || !quizItems.find(item => !item.revealed)) {
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
    itemsAfterFinalCheck = itemsAfterFinalCheck.map(item => {
      if (!item.revealed) { 
        const correctRomaji = normalizeRomaji(item.romaji);
        const isCorrect = item.userAnswer.trim().toLowerCase() === correctRomaji;
        if (!isCorrect && onMarkIncorrect) {
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
    <div className="p-4 sm:p-6 bg-white rounded-2xl shadow-2xl">
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-800 mb-2">
        {isReviewMode ? "Ôn Tập Lỗi Sai (Kana)" : "Gõ Romaji cho Kana Bạn Biết"}
      </h2>
      <p className="text-center text-sm text-slate-500 mb-6">
        Điền Romaji vào ô, nhấn Enter để kiểm tra. Sử dụng phím mũi tên để di chuyển.
      </p>
      
      <div className="text-center mb-4 text-base sm:text-lg font-semibold text-blue-600">
        Đã trả lời: {answeredCount} / {totalCount}
      </div>

      <div
        ref={gridContainerRef}
        className="kana-grid-container grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 gap-3 sm:gap-4 mb-6"
        role="form"
      >
        {quizItems.map((item) => {
          let cardBaseClass = "kana-grid-card border-2 rounded-xl p-2 sm:p-3 flex flex-col items-center justify-between min-h-[120px] sm:min-h-[140px] transition-all duration-200 ease-in-out shadow-lg hover:shadow-xl";
          let cardStateClass = "";
          let inputBaseClass = "w-full text-center text-base sm:text-lg p-2 border-2 rounded-md focus:outline-none mt-2 transition-colors duration-200";
          let inputStateClass = "";

          if (item.revealed) {
            if (item.isCorrect) {
              cardStateClass = "bg-green-50 border-green-500";
              inputStateClass = "border-green-500 bg-green-100 text-green-800 font-semibold";
            } else {
              cardStateClass = "bg-red-50 border-red-500";
              inputStateClass = "border-red-500 bg-red-100 text-red-800 font-semibold";
            }
          } else {
            cardStateClass = "bg-sky-50 border-sky-300 hover:border-blue-400";
            inputStateClass = "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300";
          }
           if(item.id === focusedInputId && !item.revealed) {
              cardStateClass += " ring-2 ring-blue-500 ring-offset-1";
           }

          return (
            <div key={item.id} className={`${cardBaseClass} ${cardStateClass}`}>
              <div className="font-noto-jp text-4xl sm:text-5xl font-bold text-slate-800 flex-grow flex items-center justify-center">
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
              />
              {item.revealed && !item.isCorrect && (
                <div className="text-xs sm:text-sm text-center mt-1">
                    <span className="text-red-700 font-semibold">Đáp án: {normalizeRomaji(item.romaji)}</span><br/>
                    <span className="text-slate-500">Bạn nhập: {item.userAnswer || "(trống)"}</span>
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
        >
          Hoàn Thành Kiểm Tra
        </Button>
      </div>
    </div>
  );
};

export default KanaGridQuiz;
