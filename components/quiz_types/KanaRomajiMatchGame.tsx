
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { JapaneseCharacter, MatchGameCard, MatchGameDataSource, MatchGameMode, HiraganaKatakanaPair } from '../../types';
import Button from '../Button';

interface KanaRomajiMatchGameProps {
  dataSource: MatchGameDataSource;
  gameMode: MatchGameMode;
  onGameFinish: (turns: number, matchedPairCount: number, totalPairs: number) => void;
  speakFn?: (text: string, lang?: string) => void;
}

const speakCharacterDefault = (text: string, lang: string = 'ja-JP') => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 0.9;
    window.speechSynthesis.speak(utterance);
  }
};

const normalizeRomaji = (romaji: string): string => {
  return romaji.split('(')[0].trim().split('/')[0].trim().toLowerCase();
};

const KanaRomajiMatchGame: React.FC<KanaRomajiMatchGameProps> = ({
  dataSource,
  gameMode,
  onGameFinish,
  speakFn = speakCharacterDefault,
}) => {
  const [gameCards, setGameCards] = useState<MatchGameCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<MatchGameCard[]>([]);
  const [matchedPairIds, setMatchedPairIds] = useState<Set<string>>(new Set());
  const [turns, setTurns] = useState(0);
  const [isInteractionDisabled, setIsInteractionDisabled] = useState(false);
  const [gridCols, setGridCols] = useState('grid-cols-4');
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const [totalPossiblePairs, setTotalPossiblePairs] = useState(0);


  useEffect(() => {
    const generatedCards: MatchGameCard[] = [];
    let currentTotalPairs = 0;

    if (gameMode === 'kanaRomaji') {
      const characters = dataSource as JapaneseCharacter[];
      currentTotalPairs = characters.length;
      characters.forEach((char, index) => {
        const pairIdSuffix = `${char.char}-${normalizeRomaji(char.romaji)}-${char.type}-${index}`;
        const originalPairId = `kr-${pairIdSuffix}`;
        
        generatedCards.push({
          id: `kana-${originalPairId}`,
          type: 'kana',
          value: char.char,
          originalCharacterPairId: originalPairId,
          isFlipped: false,
          isMatched: false,
          sourceCardType: char.type.startsWith('hiragana') ? 'hiragana' : 'katakana',
        });
        generatedCards.push({
          id: `romaji-${originalPairId}`,
          type: 'romaji',
          value: normalizeRomaji(char.romaji),
          originalCharacterPairId: originalPairId,
          isFlipped: false,
          isMatched: false,
        });
      });
    } else if (gameMode === 'hiraganaKatakana') {
      const pairs = dataSource as HiraganaKatakanaPair[];
      currentTotalPairs = pairs.length;
      pairs.forEach((pair) => {
        // originalCharacterPairId is crucial for matching
        const originalPairId = `hk-${pair.id}`; // pair.id is commonRomaji or a unique pair key
        generatedCards.push({
          id: `hira-${pair.hiragana.char}-${originalPairId}`,
          type: 'kana', 
          value: pair.hiragana.char,
          originalCharacterPairId: originalPairId,
          isFlipped: false,
          isMatched: false,
          sourceCardType: 'hiragana',
        });
        generatedCards.push({
          id: `kata-${pair.katakana.char}-${originalPairId}`,
          type: 'kana',
          value: pair.katakana.char,
          originalCharacterPairId: originalPairId,
          isFlipped: false,
          isMatched: false,
          sourceCardType: 'katakana',
        });
      });
    }
    setTotalPossiblePairs(currentTotalPairs);

    // Shuffle cards
    for (let i = generatedCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [generatedCards[i], generatedCards[j]] = [generatedCards[j], generatedCards[i]];
    }
    
    setGameCards(generatedCards);
    setFlippedCards([]);
    setMatchedPairIds(new Set());
    setTurns(0);
    setIsInteractionDisabled(false);
  }, [dataSource, gameMode]);


  useEffect(() => {
    const calculateGridCols = () => {
      if (gameContainerRef.current) {
        const containerWidth = gameContainerRef.current.offsetWidth;
        const cardCount = gameCards.length;
        let numCols = 4; // Default

        if (cardCount <= 8) numCols = Math.min(containerWidth > 300 ? 4 : 2, 4);
        else if (cardCount <= 12) numCols = Math.min(containerWidth > 400 ? 4 : 3, 4);
        else if (cardCount <= 16) numCols = Math.min(containerWidth > 480 ? 4 : 4, 4);
        else if (cardCount <= 20) numCols = Math.min(containerWidth > 600 ? 5 : 4, 5);
        else if (cardCount <= 24) numCols = Math.min(containerWidth > 700 ? 6 : 4, 6);
        else if (cardCount <= 30) numCols = Math.min(containerWidth > 700 ? 6 : 5, 6);
        else if (cardCount <= 40) numCols = Math.min(containerWidth > 800 ? 7 : 5, 7);
        else numCols = Math.min(containerWidth > 900 ? 8 : 6, 8);
        
        numCols = Math.max(2, Math.min(numCols, 8)); 
        setGridCols(`grid-cols-${numCols}`);
      }
    };

    if (gameCards.length > 0) {
        // Debounce or use ResizeObserver for better performance if needed
        const timerId = setTimeout(calculateGridCols, 50); // Slight delay for layout to settle
        window.addEventListener('resize', calculateGridCols);
        return () => {
            clearTimeout(timerId);
            window.removeEventListener('resize', calculateGridCols);
        };
    }
  }, [gameCards.length]);


  const handleCardClick = (clickedCard: MatchGameCard) => {
    if (isInteractionDisabled || clickedCard.isFlipped || clickedCard.isMatched || flippedCards.length >= 2) {
      return;
    }

    const newFlippedCards = [...flippedCards, clickedCard];
    setGameCards(prev =>
      prev.map(card =>
        card.id === clickedCard.id ? { ...card, isFlipped: true } : card
      )
    );
    
    if (clickedCard.type === 'kana' && speakFn) { // Only speak Japanese characters
        speakFn(clickedCard.value, 'ja-JP');
    }

    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setIsInteractionDisabled(true);
      setTurns(prev => prev + 1);
      const [firstCard, secondCard] = newFlippedCards;

      let isMatch = false;
      if (firstCard.originalCharacterPairId === secondCard.originalCharacterPairId) {
        if (gameMode === 'kanaRomaji') {
          isMatch = firstCard.type !== secondCard.type; // 'kana' vs 'romaji'
        } else if (gameMode === 'hiraganaKatakana') {
          // Both are 'kana' type, but their sourceCardType must be different ('hiragana' vs 'katakana')
          isMatch = firstCard.sourceCardType !== secondCard.sourceCardType;
        }
      }
      
      if (isMatch) {
        setMatchedPairIds(prev => new Set(prev).add(firstCard.originalCharacterPairId));
        setGameCards(prev =>
          prev.map(card =>
            card.originalCharacterPairId === firstCard.originalCharacterPairId
              ? { ...card, isMatched: true, isFlipped: true } 
              : card
          )
        );
        setFlippedCards([]);
        setIsInteractionDisabled(false);
        // Check for game completion inside a timeout to allow state to update for the check
        setTimeout(() => {
            setMatchedPairIds(currentMatchedIds => {
                if (currentMatchedIds.size === totalPossiblePairs) {
                    onGameFinish(turns + 1, currentMatchedIds.size, totalPossiblePairs);
                }
                return currentMatchedIds;
            });
        }, 100);

      } else {
        // No match
        setTimeout(() => {
          setGameCards(prev =>
            prev.map(card =>
              card.id === firstCard.id || card.id === secondCard.id
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
          setIsInteractionDisabled(false);
        }, 1200);
      }
    }
  };
  
  if (!dataSource || dataSource.length === 0) {
    return (
      <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md mx-auto">
        <p className="text-slate-600 text-lg mb-6">Không có dữ liệu để bắt đầu trò chơi. Vui lòng kiểm tra lại lựa chọn.</p>
        <Button onClick={() => onGameFinish(0,0,0)} variant="primary" icon="fas fa-arrow-left">
            Quay Lại
        </Button>
      </div>
    );
  }
  
  const allMatched = matchedPairIds.size === totalPossiblePairs && totalPossiblePairs > 0;

  return (
    <div className="p-4 sm:p-6 bg-slate-50 rounded-2xl shadow-2xl">
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-800 mb-3">
        Ghép Thẻ {gameMode === 'kanaRomaji' ? 'Kana - Romaji' : 'Hiragana - Katakana'}
      </h2>
      <div className="flex justify-around items-center mb-5 text-base sm:text-lg">
        <p className="text-blue-700 font-semibold">Số lượt: <span className="text-blue-500">{turns}</span></p>
        <p className="text-green-700 font-semibold">Đã ghép: <span className="text-green-500">{matchedPairIds.size} / {totalPossiblePairs}</span></p>
      </div>

      <div ref={gameContainerRef} className={`grid ${gridCols} gap-2 sm:gap-3 mb-6`}>
        {gameCards.map(card => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card)}
            disabled={card.isMatched || (isInteractionDisabled && !card.isFlipped)}
            className={`aspect-square rounded-lg shadow-md transition-all duration-300 ease-in-out transform transform-preserve-3d
                        ${card.isFlipped || card.isMatched ? 'rotate-y-0 bg-white' : '[transform:rotateY(180deg)] bg-sky-500 hover:bg-sky-600'}
                        ${card.isMatched ? 'border-4 border-green-400 opacity-80 cursor-default' : 'border-2 border-sky-300'}
                        focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1`}
            aria-label={`Card ${card.isFlipped ? (card.type === 'kana' ? (card.sourceCardType || 'Kana') : 'Romaji') + ' ' + card.value : 'face down'}`}
          >
            <div className={`w-full h-full flex items-center justify-center p-1 backface-hidden 
                           ${card.isFlipped || card.isMatched ? 'opacity-100' : 'opacity-0'}`}>
              {card.type === 'kana' ? (
                <span className="font-noto-jp text-2xl xs:text-3xl sm:text-4xl font-bold text-slate-800 select-none">{card.value}</span>
              ) : ( // Romaji card
                <span className="text-lg xs:text-xl sm:text-2xl font-semibold text-blue-700 select-none break-all">{card.value}</span>
              )}
            </div>
            {/* Back of the card - shown when not flipped and not matched */}
            {!(card.isFlipped || card.isMatched) && (
                <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-sky-500 rounded-lg [transform:rotateY(180deg)] backface-hidden">
                    <i className="fas fa-question text-3xl sm:text-4xl text-white opacity-80"></i>
                </div>
            )}
          </button>
        ))}
      </div>
      
      {allMatched && totalPossiblePairs > 0 && (
        <div className="text-center mt-6 animate-bounce">
          <p className="text-2xl font-bold text-green-600 mb-4">Hoàn Thành Xuất Sắc!</p>
        </div>
      )}
      <div className="text-center mt-4">
         <Button 
            onClick={() => onGameFinish(turns, matchedPairIds.size, totalPossiblePairs)} 
            variant={allMatched ? "secondary" : "outline"} 
            icon="fas fa-flag-checkered"
            className="text-lg py-3 px-6"
            >
            {allMatched ? "Chơi Lại / Thoát" : "Kết Thúc Sớm"}
        </Button>
      </div>
    </div>
  );
};

export default KanaRomajiMatchGame;
