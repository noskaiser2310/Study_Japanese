

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { JAPANESE_CHARACTERS_DATA, VOCABULARY_DATA } from '../constants'; 
import { 
  JapaneseCharacter, 
  ComprehensiveQuestionType, 
  QuizResultType,
  AdvancedQuizSettings,
  KanaSetSelection,
  KanaGridQuizItem,
  VocabularyWord,
  VocabularyQuestionType,
  TestScreen,
  MatchGameDataSource, 
  MatchGameMode,      
  HiraganaKatakanaPair,
  UserData,             // Import UserData
  QuizPerformance       // Import QuizPerformance
} from '../types';
import Quiz from '../components/Quiz'; 
import Stats from '../components/Stats';
import Button from '../components/Button';
import KanaGridQuiz from '../components/quiz_types/KanaGridQuiz';
import VocabularyQuizComponent from '../components/quiz_types/VocabularyQuiz';
import KanaRomajiMatchGame from '../components/quiz_types/KanaRomajiMatchGame';
import useLocalStorage from '../hooks/useLocalStorage'; // Import useLocalStorage

const initialKanaSetSelection: KanaSetSelection = {
  main: true,
  dakuten: false, 
  yoon: false,
};

const PAIR_COUNT_OPTIONS = [5, 10, 15, 20, 25];

const ButtonSetToggle: React.FC<{sets: KanaSetSelection, onToggle: (setType: keyof KanaSetSelection | 'extended')=>void, script: 'hiragana' | 'katakana'}> = ({sets, onToggle, script}) => (
  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
      <Button onClick={() => onToggle('main')} variant={sets.main ? 'primary' : 'outline'} active={sets.main} className="w-full text-sm sm:text-base">Âm Chính</Button>
      <Button onClick={() => onToggle('dakuten')} variant={sets.dakuten ? 'primary' : 'outline'} active={sets.dakuten} className="w-full text-sm sm:text-base">Biến Âm</Button>
      <Button onClick={() => onToggle('yoon')} variant={sets.yoon ? 'primary' : 'outline'} active={sets.yoon} className="w-full text-sm sm:text-base">Âm Ghép</Button>
      {script === 'katakana' && (
          <Button 
            onClick={() => onToggle('extended')} 
            variant={(sets as KanaSetSelection & { extended: boolean }).extended ? 'primary' : 'outline'} 
            active={(sets as KanaSetSelection & { extended: boolean }).extended} 
            className="w-full text-sm sm:text-base"
          >
            Âm Mở Rộng
          </Button>
      )}
  </div>
);

const normalizeRomajiUtil = (romaji: string): string => {
  return romaji.split('(')[0].trim().split('/')[0].trim().toLowerCase();
};

const TestPage: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<TestScreen>('setup');
  const [quizSettings, setQuizSettings] = useState<AdvancedQuizSettings>({
    script: 'hiragana',
    hiraganaSets: { ...initialKanaSetSelection },
    katakanaSets: { ...initialKanaSetSelection, extended: false },
  });
  
  const [userData, setUserData] = useLocalStorage<UserData>('userData', {
    learnedChars: {},
    studyStreak: 0,
    lastStudiedTimestamp: 0,
    incorrectItems: {},
    quizPerformances: [],
    chatHistory: [],
  });
  
  const [matchGameMode, setMatchGameMode] = useState<MatchGameMode>('kanaRomaji');
  const [matchGamePairCount, setMatchGamePairCount] = useState<number>(10);
  const [matchGameDataSource, setMatchGameDataSource] = useState<MatchGameDataSource>([]);

  const [isReviewingItems, setIsReviewingItems] = useState<boolean>(false);

  const [quizInputValue, setQuizInputValue] = useState<string>(''); 
  const [quizResultText, setQuizResultText] = useState<string>('');
  const [quizResultType, setQuizResultType] = useState<QuizResultType>('');
  const [currentComprehensiveQuizChar, setCurrentComprehensiveQuizChar] = useState<JapaneseCharacter | null>(null);
  const [currentComprehensiveQuestionType, setCurrentComprehensiveQuestionType] = useState<ComprehensiveQuestionType | ''>('');
  const [comprehensiveQuizOptions, setComprehensiveQuizOptions] = useState<JapaneseCharacter[]>([]);
  const [isQuizInputDisabled, setIsQuizInputDisabled] = useState<boolean>(false);
  
  const [currentVocabWord, setCurrentVocabWord] = useState<VocabularyWord | null>(null);
  const [currentVocabQuestionType, setCurrentVocabQuestionType] = useState<VocabularyQuestionType | ''>('');
  const [vocabQuizOptions, setVocabQuizOptions] = useState<(VocabularyWord | { translation_vi: string, id: string })[]>([]); 
  const [isVocabQuizDisabled, setIsVocabQuizDisabled] = useState<boolean>(false);
  const [vocabResultText, setVocabResultText] = useState<string>('');
  const [vocabResultType, setVocabResultType] = useState<QuizResultType>('');

  const [selectedKanaForGridQuiz, setSelectedKanaForGridQuiz] = useState<JapaneseCharacter[]>([]);

  const [learnedItemsInSession, setLearnedItemsInSession] = useState<Set<string>>(new Set());
  const [totalAttempts, setTotalAttempts] = useState<number>(0);
  const [correctAttempts, setCorrectAttempts] = useState<number>(0);
  const [currentStreak, setCurrentStreak] = useState<number>(0);

  const quizInputRef = useRef<HTMLInputElement>(null);

  const handleMarkIncorrect = useCallback((item: JapaneseCharacter | VocabularyWord) => {
    setUserData(prev => {
      const itemKey = 'char' in item ? `char-${item.char}-${item.type}` : `vocab-${item.kana}`;
      const updatedIncorrectItems = { ...(prev.incorrectItems || {}), [itemKey]: item };
      return { ...prev, incorrectItems: updatedIncorrectItems };
    });
  }, [setUserData]);

  const clearIncorrectAnswers = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tất cả lỗi sai đã ghi nhận không?")) {
      setUserData(prev => ({ ...prev, incorrectItems: {} }));
    }
  };

  const startReviewIncorrectKanaQuiz = () => {
    const incorrectItemsMap = userData.incorrectItems || {};
    const kanaToReview = Object.values(incorrectItemsMap).filter(item => 'char' in item && !('translation_vi' in item)) as JapaneseCharacter[];
    if (kanaToReview.length > 0) {
      const shuffledIncorrect = [...kanaToReview].sort(() => Math.random() - 0.5);
      setSelectedKanaForGridQuiz(shuffledIncorrect);
      setIsReviewingItems(true); 
      setCurrentScreen('kanaGridQuiz');
    } else {
      alert("Không có lỗi sai Kana nào để ôn tập (Kiểu Nhập).");
    }
  };
  
  const startReviewIncorrectVocabQuiz = () => {
    const incorrectItemsMap = userData.incorrectItems || {};
    const vocabToReview = Object.values(incorrectItemsMap).filter(item => 'translation_vi' in item) as VocabularyWord[];
    if (vocabToReview.length > 0) {
      setQuizContext('vocabularyQuiz'); 
      setIsReviewingItems(true); 
      setCurrentScreen('vocabularyQuiz'); 
      loadVocabularyQuestion(vocabToReview); 
    } else {
      alert("Không có lỗi sai Từ vựng nào để ôn tập.");
    }
  };

  const saveQuizPerformance = (quizType: QuizPerformance['quizType'], score: number, total: number, incorrectSnapshotData?: (JapaneseCharacter | VocabularyWord)[]) => {
    const performance: QuizPerformance = {
      quizType,
      timestamp: Date.now(),
      score,
      total,
      incorrectItemsSnapshot: incorrectSnapshotData,
    };
    setUserData(prev => ({
      ...prev,
      quizPerformances: [...(prev.quizPerformances || []), performance]
    }));
  };

  const handleScriptSelection = (script: 'hiragana' | 'katakana') => {
    setQuizSettings(prev => ({ ...prev, script }));
  };

  const toggleKanaSet = (script: 'hiragana' | 'katakana', setType: keyof KanaSetSelection | 'extended') => {
    setQuizSettings(prev => {
      if (script === 'hiragana') {
        const validHiraganaSetType = setType as keyof KanaSetSelection;
        if (setType === 'extended') return prev; 
        return { ...prev, hiraganaSets: { ...prev.hiraganaSets, [validHiraganaSetType]: !prev.hiraganaSets[validHiraganaSetType] } };
      } else { 
        const katakanaSetTypeKey = setType as keyof (KanaSetSelection & { extended: boolean });
        return { ...prev, katakanaSets: { ...prev.katakanaSets, [katakanaSetTypeKey]: !prev.katakanaSets[katakanaSetTypeKey] } };
      }
    });
  };
  
  const prepareKanaForGridOrRomajiMatch = (): JapaneseCharacter[] => {
    let charactersToTest: JapaneseCharacter[] = [];
    const { script, hiraganaSets, katakanaSets } = quizSettings;

    const addCharsByType = (charType: JapaneseCharacter['type'] | JapaneseCharacter['type'][]) => {
      const typesArray = Array.isArray(charType) ? charType : [charType];
      charactersToTest.push(...JAPANESE_CHARACTERS_DATA.filter(c => typesArray.includes(c.type) && c.type !== 'kanji'));
    };

    if (script === 'hiragana') {
      if (hiraganaSets.main) addCharsByType('hiragana');
      if (hiraganaSets.dakuten) addCharsByType(['hiragana-dakuten', 'hiragana-handakuten']);
      if (hiraganaSets.yoon) addCharsByType('hiragana-yoon');
    }
    if (script === 'katakana') {
      if (katakanaSets.main) addCharsByType('katakana');
      if (katakanaSets.dakuten) addCharsByType(['katakana-dakuten', 'katakana-handakuten']);
      if (katakanaSets.yoon) addCharsByType('katakana-yoon');
      if (katakanaSets.extended) addCharsByType('katakana-extended');
    }
    
    const uniqueCharsMap = new Map<string, JapaneseCharacter>();
    charactersToTest.forEach(c => {
        const key = `${c.char}-${c.type}`; 
        if (!uniqueCharsMap.has(key)) { uniqueCharsMap.set(key, c); }
    });
    let uniqueChars = Array.from(uniqueCharsMap.values());
    for (let i = uniqueChars.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [uniqueChars[i], uniqueChars[j]] = [uniqueChars[j], uniqueChars[i]];
    }
    return uniqueChars;
  }

  const prepareHiraganaKatakanaPairs = (numPairs: number): HiraganaKatakanaPair[] => {
    const { hiraganaSets, katakanaSets } = quizSettings;
    const potentialHiragana: JapaneseCharacter[] = [];
    if (hiraganaSets.main) potentialHiragana.push(...JAPANESE_CHARACTERS_DATA.filter(c => c.type === 'hiragana'));
    if (hiraganaSets.dakuten) potentialHiragana.push(...JAPANESE_CHARACTERS_DATA.filter(c => c.type === 'hiragana-dakuten' || c.type === 'hiragana-handakuten'));
    if (hiraganaSets.yoon) potentialHiragana.push(...JAPANESE_CHARACTERS_DATA.filter(c => c.type === 'hiragana-yoon'));

    const potentialKatakana: JapaneseCharacter[] = [];
    if (katakanaSets.main) potentialKatakana.push(...JAPANESE_CHARACTERS_DATA.filter(c => c.type === 'katakana'));
    if (katakanaSets.dakuten) potentialKatakana.push(...JAPANESE_CHARACTERS_DATA.filter(c => c.type === 'katakana-dakuten' || c.type === 'katakana-handakuten'));
    if (katakanaSets.yoon) potentialKatakana.push(...JAPANESE_CHARACTERS_DATA.filter(c => c.type === 'katakana-yoon'));
    
    const hiraganaByRomaji = new Map<string, JapaneseCharacter>();
    potentialHiragana.forEach(h => {
        const romaji = normalizeRomajiUtil(h.romaji);
        if (!hiraganaByRomaji.has(romaji)) {
            hiraganaByRomaji.set(romaji, h);
        }
    });
    
    const foundPairs: HiraganaKatakanaPair[] = [];
    potentialKatakana.forEach(k => {
        const commonRomaji = normalizeRomajiUtil(k.romaji);
        if (hiraganaByRomaji.has(commonRomaji)) {
            const hiraganaMatch = hiraganaByRomaji.get(commonRomaji)!;
            if (!foundPairs.some(p => p.commonRomaji === commonRomaji)) {
                 foundPairs.push({
                    id: commonRomaji, 
                    hiragana: hiraganaMatch,
                    katakana: k,
                    commonRomaji: commonRomaji,
                });
            }
        }
    });

    for (let i = foundPairs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [foundPairs[i], foundPairs[j]] = [foundPairs[j], foundPairs[i]];
    }
    return foundPairs.slice(0, numPairs);
  };


  const startKanaGridQuiz = () => {
    const chars = prepareKanaForGridOrRomajiMatch();
    setSelectedKanaForGridQuiz(chars);
    setIsReviewingItems(false);
    setQuizContext('kanaGridQuiz');
    setCurrentScreen('kanaGridQuiz');
  };

  const startMatchingGame = () => {
    let dataSource: MatchGameDataSource;
    if (matchGameMode === 'kanaRomaji') {
      const chars = prepareKanaForGridOrRomajiMatch();
      dataSource = chars.slice(0, matchGamePairCount);
    } else { 
      dataSource = prepareHiraganaKatakanaPairs(matchGamePairCount);
    }

    if (dataSource.length === 0 || (matchGameMode === 'hiraganaKatakana' && dataSource.length < 1) || (matchGameMode === 'kanaRomaji' && dataSource.length < 1) ) {
        alert("Không đủ ký tự/cặp ký tự phù hợp với lựa chọn của bạn. Vui lòng chọn nhiều bộ hơn hoặc kiểm tra lại cài đặt.");
        return;
    }
    
    setMatchGameDataSource(dataSource);
    setIsReviewingItems(false); 
    setQuizContext('matchingGame');
    setCurrentScreen('matchingGame');
  };


  const handleKanaGridQuizFinish = (score: number, total: number, allItemsFromSession: KanaGridQuizItem[]) => {
     if (!isReviewingItems) {
        saveQuizPerformance('kanaGrid', score, total, allItemsFromSession.filter(item => !item.isCorrect).map(item => ({...item} as JapaneseCharacter)));
     } else {
        const correctlyReviewedKeys = new Set<string>();
        allItemsFromSession.forEach(sessionItem => {
            if (sessionItem.isCorrect) {
                correctlyReviewedKeys.add(`char-${sessionItem.char}-${sessionItem.type}`);
            }
        });
        setUserData(prev => {
            const updatedIncorrect = {...(prev.incorrectItems || {})};
            correctlyReviewedKeys.forEach(key => delete updatedIncorrect[key]);
            return {...prev, incorrectItems: updatedIncorrect};
        });
    }
    setIsReviewingItems(false);
    setCurrentScreen('setup');
  };

  const handleMatchingGameFinish = (finalTurns: number, matchedCount: number, totalPairs: number) => {
    alert(`Trò chơi kết thúc! Bạn mất ${finalTurns} lượt để ghép ${matchedCount}/${totalPairs} cặp.`);
    if (totalPairs > 0) { // Only save if it was a valid game
        saveQuizPerformance('matchingGame', matchedCount, totalPairs);
    }
    setCurrentScreen('setup');
  };

  const getBaseType = (type: JapaneseCharacter['type']): 'hiragana' | 'katakana' | 'kanji' | 'katakana-extended' => {
    if (type.startsWith('hiragana')) return 'hiragana';
    if (type === 'katakana-extended') return 'katakana-extended';
    if (type.startsWith('katakana')) return 'katakana';
    return 'kanji'; 
  };

  const getFilteredCharactersForComprehensiveQuiz = useCallback((): JapaneseCharacter[] => {
    return JAPANESE_CHARACTERS_DATA.filter(c => c.type !== 'kanji');
  }, []);

  const normalizeRomaji = (romaji: string): string => {
    return romaji.split('(')[0].trim().split('/')[0].trim().toLowerCase();
  };

  const loadComprehensiveQuestion = useCallback(() => {
    const filteredChars = getFilteredCharactersForComprehensiveQuiz();
    if (filteredChars.length === 0) {
      setCurrentComprehensiveQuizChar(null); setComprehensiveQuizOptions([]);
      setQuizResultText("Không có ký tự nào để kiểm tra."); setCurrentComprehensiveQuestionType('');
      return;
    }
    const randomChar = filteredChars[Math.floor(Math.random() * filteredChars.length)];
    setCurrentComprehensiveQuizChar(randomChar);
    const questionType = Math.random() < 0.5 ? ComprehensiveQuestionType.CharToRomaji : ComprehensiveQuestionType.RomajiToChar;
    setCurrentComprehensiveQuestionType(questionType);
    setQuizInputValue(''); setQuizResultText(''); setQuizResultType(''); setIsQuizInputDisabled(false);

    if (questionType === ComprehensiveQuestionType.RomajiToChar && randomChar) {
      let optionsSet = new Set<JapaneseCharacter>([randomChar]);
      const baseTypeOfRandomChar = getBaseType(randomChar.type);
      let distractors = filteredChars.filter(c => c.char !== randomChar.char && getBaseType(c.type) === baseTypeOfRandomChar);
      for (let i = distractors.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [distractors[i], distractors[j]] = [distractors[j], distractors[i]];}
      while (optionsSet.size < Math.min(4, filteredChars.filter(c=> getBaseType(c.type) === baseTypeOfRandomChar).length) && distractors.length > 0) { const d = distractors.pop(); if (d) optionsSet.add(d);}
      let optionsArray = Array.from(optionsSet);
      if (optionsArray.length < Math.min(4, filteredChars.length)) {
          distractors = filteredChars.filter(c => !optionsSet.has(c)); 
           for (let i = distractors.length - 1; i > 0; i--) {const j = Math.floor(Math.random() * (i + 1));[distractors[i], distractors[j]] = [distractors[j], distractors[i]];}
          while(optionsArray.length < Math.min(4, filteredChars.length) && distractors.length > 0){const d = distractors.pop(); if(d) optionsArray.push(d);}
      }
       for (let i = optionsArray.length - 1; i > 0; i--) {const j = Math.floor(Math.random() * (i + 1));[optionsArray[i], optionsArray[j]] = [optionsArray[j], optionsArray[i]];}
      setComprehensiveQuizOptions(optionsArray);
    } else {
      setComprehensiveQuizOptions([]); 
      setTimeout(() => quizInputRef.current?.focus(), 0);
    }
  }, [getFilteredCharactersForComprehensiveQuiz]);
  
  const handleCheckAnswer = () => {
    if (!currentComprehensiveQuizChar || currentComprehensiveQuestionType !== ComprehensiveQuestionType.CharToRomaji || isQuizInputDisabled) return;
    const userAnswer = quizInputValue.trim().toLowerCase();
    const correctAnswer = normalizeRomaji(currentComprehensiveQuizChar.romaji);
    setTotalAttempts(prev => prev + 1);
    if (userAnswer === correctAnswer) {
        setQuizResultText('Chính xác!'); setQuizResultType('correct'); setCorrectAttempts(prev => prev + 1); setCurrentStreak(prev => prev + 1);
        setLearnedItemsInSession(prev => new Set(prev).add(currentComprehensiveQuizChar.char + currentComprehensiveQuizChar.type));
    } else {
        setQuizResultText(`Sai rồi! Đáp án đúng là: ${correctAnswer}`); setQuizResultType('incorrect'); setCurrentStreak(0);
        if (!isReviewingItems) handleMarkIncorrect(currentComprehensiveQuizChar);
    }
    setIsQuizInputDisabled(true);
  };

  const handleComprehensiveMCQAnswer = (selectedCharValue: string) => {
    if (!currentComprehensiveQuizChar || currentComprehensiveQuestionType !== ComprehensiveQuestionType.RomajiToChar || isQuizInputDisabled) return;
    setQuizInputValue(selectedCharValue); 
    const correctAnswerChar = currentComprehensiveQuizChar.char;
    setTotalAttempts(prev => prev + 1);
    if (selectedCharValue === correctAnswerChar) {
        setQuizResultText('Chính xác!'); setQuizResultType('correct'); setCorrectAttempts(prev => prev + 1); setCurrentStreak(prev => prev + 1);
        setLearnedItemsInSession(prev => new Set(prev).add(currentComprehensiveQuizChar.char + currentComprehensiveQuizChar.type));
    } else {
        setQuizResultText(`Sai rồi! Đáp án đúng là: ${correctAnswerChar}`); setQuizResultType('incorrect'); setCurrentStreak(0);
        if (!isReviewingItems) handleMarkIncorrect(currentComprehensiveQuizChar);
    }
    setIsQuizInputDisabled(true);
  };

  const loadVocabularyQuestion = useCallback((sourceVocabList?: VocabularyWord[]) => {
    const vocabList = sourceVocabList && sourceVocabList.length > 0 ? sourceVocabList : VOCABULARY_DATA;
    if (vocabList.length === 0) {
      setCurrentVocabWord(null); setVocabQuizOptions([]);
      setVocabResultText("Không có từ vựng nào để kiểm tra."); setCurrentVocabQuestionType('');
      return;
    }

    const randomWord = vocabList[Math.floor(Math.random() * vocabList.length)];
    setCurrentVocabWord(randomWord);
    const questionType = Math.random() < 0.5 ? VocabularyQuestionType.KanaToMeaning : VocabularyQuestionType.MeaningToKana;
    setCurrentVocabQuestionType(questionType);
    setVocabResultText(''); setVocabResultType(''); setIsVocabQuizDisabled(false);

    let options: (VocabularyWord | { translation_vi: string, id: string })[] = [];
    let distractors = VOCABULARY_DATA.filter(v => v.id !== randomWord.id && v.type === randomWord.type); 
    if (distractors.length < 3) { 
        distractors = VOCABULARY_DATA.filter(v => v.id !== randomWord.id);
    }
    for (let i = distractors.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [distractors[i], distractors[j]] = [distractors[j], distractors[i]]; }

    if (questionType === VocabularyQuestionType.KanaToMeaning) { 
        options.push({ translation_vi: randomWord.translation_vi, id: randomWord.id });
        distractors.slice(0, 3).forEach(d => options.push({ translation_vi: d.translation_vi, id: d.id + "_distractor" }));
    } else { 
        options.push(randomWord);
        distractors.slice(0, 3).forEach(d => options.push(d));
    }
    const uniqueOptionValues = new Set();
    options = options.filter(opt => {
        const value = 'kana' in opt ? opt.kana : opt.translation_vi;
        if (uniqueOptionValues.has(value)) return false;
        uniqueOptionValues.add(value);
        return true;
    });
    while(options.length < Math.min(4, VOCABULARY_DATA.length) && distractors.length > options.length -1) {
        const nextDistractor = distractors[options.length-1]; 
        if (questionType === VocabularyQuestionType.KanaToMeaning) {
            if(nextDistractor && !uniqueOptionValues.has(nextDistractor.translation_vi)) {
                 options.push({translation_vi: nextDistractor.translation_vi, id: nextDistractor.id + "_distractor"});
                 uniqueOptionValues.add(nextDistractor.translation_vi);
            }
        } else {
            if(nextDistractor && !uniqueOptionValues.has(nextDistractor.kana)){
                options.push(nextDistractor);
                uniqueOptionValues.add(nextDistractor.kana);
            }
        }
         if (options.length >= 4) break;
    }
    for (let i = options.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [options[i], options[j]] = [options[j], options[i]];}
    setVocabQuizOptions(options.slice(0,4)); 
  }, []);

  const handleVocabularyAnswer = (selectedOption: VocabularyWord | { translation_vi: string, id: string }) => {
    if (!currentVocabWord || isVocabQuizDisabled) return;
    setTotalAttempts(prev => prev + 1);
    let isCorrect = false;
    if (currentVocabQuestionType === VocabularyQuestionType.KanaToMeaning) {
      isCorrect = (selectedOption as { translation_vi: string }).translation_vi === currentVocabWord.translation_vi;
    } else { 
      isCorrect = (selectedOption as VocabularyWord).id === currentVocabWord.id;
    }

    if (isCorrect) {
      setVocabResultText('Chính xác!'); setVocabResultType('correct');
      setCorrectAttempts(prev => prev + 1); setCurrentStreak(prev => prev + 1);
      setLearnedItemsInSession(prev => new Set(prev).add(currentVocabWord.id));
      if(isReviewingItems){ 
        setUserData(prev => {
            const itemKey = `vocab-${currentVocabWord.kana}`;
            const updatedIncorrect = {...(prev.incorrectItems || {})};
            delete updatedIncorrect[itemKey];
            return {...prev, incorrectItems: updatedIncorrect};
        });
      }
    } else {
      setVocabResultText(`Sai rồi! Đáp án đúng: ${currentVocabQuestionType === VocabularyQuestionType.KanaToMeaning ? currentVocabWord.translation_vi : currentVocabWord.kana}`);
      setVocabResultType('incorrect'); setCurrentStreak(0);
      if(!isReviewingItems) handleMarkIncorrect(currentVocabWord); 
    }
    setIsVocabQuizDisabled(true);
  };

  const handleNextVocabularyQuestion = () => {
     if (isReviewingItems) {
        const incorrectItemsMap = userData.incorrectItems || {};
        const vocabToReview = Object.values(incorrectItemsMap).filter(item => 'translation_vi' in item) as VocabularyWord[];
        const remainingToReview = vocabToReview.filter(v => v.id !== currentVocabWord?.id);

        if (remainingToReview.length > 0) {
             loadVocabularyQuestion(remainingToReview); 
        } else {
            alert("Đã ôn tập hết từ vựng sai!");
            setIsReviewingItems(false);
            setCurrentScreen('setup');
        }
     } else {
        if (currentScreen === 'vocabularyQuiz') { // Save performance on normal quiz progression
          saveQuizPerformance('vocabulary', correctAttempts, totalAttempts, 
            Object.values(userData.incorrectItems || {}).filter(item => {
              if ('kana' in item) { // item is VocabularyWord
                return item.id === currentVocabWord?.id;
              }
              return false;
            })
          );
        }
        loadVocabularyQuestion();
     }
  };

  const setQuizContext = (quizType: TestScreen) => {
    setLearnedItemsInSession(new Set());
    setTotalAttempts(0);
    setCorrectAttempts(0);
    setCurrentStreak(0);
    
    if (quizType !== 'comprehensiveQuiz') { setQuizResultText(''); }
    if (quizType !== 'vocabularyQuiz') { setVocabResultText(''); }
  };

  useEffect(() => {
    if (currentScreen === 'comprehensiveQuiz' && !isReviewingItems) {
      setQuizContext('comprehensiveQuiz');
      loadComprehensiveQuestion();
    } else if (currentScreen === 'vocabularyQuiz' && !isReviewingItems) { 
      setQuizContext('vocabularyQuiz');
      loadVocabularyQuestion();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentScreen, isReviewingItems]); 
  // Removed loadComprehensiveQuestion, loadVocabularyQuestion from deps to avoid loop

  const accuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;

  const isKanaQuizStartDisabled = () => {
    const { script, hiraganaSets, katakanaSets } = quizSettings;
    if (script === 'hiragana') {
      return !hiraganaSets.main && !hiraganaSets.dakuten && !hiraganaSets.yoon;
    }
    if (script === 'katakana') {
      return !katakanaSets.main && !katakanaSets.dakuten && !katakanaSets.yoon && !katakanaSets.extended;
    }
    return true;
  };
  
  const incorrectItemsMap = userData.incorrectItems || {};
  const incorrectKanaCount = Object.values(incorrectItemsMap).filter(item => 'char' in item && !('translation_vi' in item)).length;
  const incorrectVocabCount = Object.values(incorrectItemsMap).filter(item => 'translation_vi' in item).length;

  const speakUtil = useCallback((text: string, lang: string = 'ja-JP') => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const renderSetupScreen = () => (
    <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-8 screen-slide-fade-in">
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-slate-800 mb-6 sm:mb-8">
        <i className="fas fa-tasks mr-2 text-blue-600"></i>Chọn Bài Kiểm Tra
      </h1>

      <div className="mb-8 p-4 sm:p-6 border border-sky-200 rounded-xl bg-sky-50 shadow-lg">
        <h2 className="text-xl font-semibold text-slate-700 mb-4 border-b-2 pb-2 border-sky-300">
          <i className="fas fa-highlighter mr-2 text-sky-500"></i>Luyện Tập Kana
        </h2>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4">
          <Button onClick={() => handleScriptSelection('hiragana')} variant={quizSettings.script === 'hiragana' ? 'primary' : 'outline'} active={quizSettings.script === 'hiragana'} className="w-full text-base sm:text-lg py-3">Bộ Hiragana</Button>
          <Button onClick={() => handleScriptSelection('katakana')} variant={quizSettings.script === 'katakana' ? 'primary' : 'outline'} active={quizSettings.script === 'katakana'} className="w-full text-base sm:text-lg py-3">Bộ Katakana</Button>
        </div>
        {quizSettings.script === 'hiragana' && (<div className="space-y-3 my-4 p-4 bg-white rounded-lg shadow-sm"><h3 className="font-semibold text-slate-600 mb-2">Chọn bộ Hiragana:</h3><ButtonSetToggle sets={quizSettings.hiraganaSets} onToggle={(setType) => toggleKanaSet('hiragana', setType)} script="hiragana" /></div>)}
        {quizSettings.script === 'katakana' && (<div className="space-y-3 my-4 p-4 bg-white rounded-lg shadow-sm"><h3 className="font-semibold text-slate-600 mb-2">Chọn bộ Katakana:</h3><ButtonSetToggle sets={quizSettings.katakanaSets} onToggle={(setType) => toggleKanaSet('katakana', setType)} script="katakana" /></div>)}
        
        <div className="mt-6">
          <h3 className="font-semibold text-slate-600 mb-3">Cài đặt Trò Chơi Ghép Thẻ:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="matchGameModeSelect" className="block text-sm font-medium text-slate-700 mb-1">Kiểu ghép:</label>
              <select 
                id="matchGameModeSelect"
                value={matchGameMode}
                onChange={(e) => setMatchGameMode(e.target.value as MatchGameMode)}
                className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="kanaRomaji">Kana - Romaji</option>
                <option value="hiraganaKatakana">Hiragana - Katakana</option>
              </select>
            </div>
            <div>
              <label htmlFor="matchGamePairCountSelect" className="block text-sm font-medium text-slate-700 mb-1">Số lượng cặp thẻ:</label>
              <select 
                id="matchGamePairCountSelect"
                value={matchGamePairCount}
                onChange={(e) => setMatchGamePairCount(Number(e.target.value))}
                className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                {PAIR_COUNT_OPTIONS.map(count => <option key={count} value={count}>{count} cặp</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            <Button onClick={startKanaGridQuiz} variant="secondary" className="w-full text-base sm:text-lg py-3" icon="fas fa-keyboard" disabled={isKanaQuizStartDisabled()}>Luyện Nhập Romaji</Button>
            <Button onClick={startMatchingGame} variant="secondary" className="w-full text-base sm:text-lg py-3" icon="fas fa-clone" disabled={isKanaQuizStartDisabled()}>Bắt Đầu Ghép Thẻ</Button>
        </div>
      </div>
      
      <hr className="my-8 border-slate-300"/>

      <div className="mb-8 p-4 sm:p-6 border border-green-200 rounded-xl bg-green-50 shadow-lg">
        <h2 className="text-xl font-semibold text-slate-700 mb-4 border-b-2 pb-2 border-green-300">
          <i className="fas fa-spell-check mr-2 text-green-500"></i>Kiểm Tra Từ Vựng
        </h2>
        <p className="text-sm text-slate-500 mb-4">Ghép từ tiếng Nhật (Kana) với nghĩa tiếng Việt và ngược lại.</p>
        <Button onClick={() => { setIsReviewingItems(false); setCurrentScreen('vocabularyQuiz');}} variant="primary" className="w-full text-base sm:text-lg py-3" icon="fas fa-book-reader">Bắt Đầu Kiểm Tra Từ Vựng</Button>
      </div>

      <hr className="my-8 border-slate-300"/>
      
      <div className="mb-8 p-4 sm:p-6 border border-orange-200 rounded-xl bg-orange-50 shadow-lg">
        <h2 className="text-xl font-semibold text-slate-700 mb-4 border-b-2 pb-2 border-orange-300">
          <i className="fas fa-history mr-2 text-orange-500"></i>Luyện Tập Lỗi Sai
        </h2>
        {Object.keys(incorrectItemsMap).length > 0 ? (
          <>
            <p className="text-sm text-slate-600 mb-1">Bạn có {incorrectKanaCount > 0 ? `${incorrectKanaCount} lỗi Kana (nhập)` : ''}{incorrectKanaCount > 0 && incorrectVocabCount > 0 ? ' và ' : ''}{incorrectVocabCount > 0 ? `${incorrectVocabCount} lỗi Từ vựng` : ''} cần ôn tập.</p>
            {(incorrectKanaCount > 0 || incorrectVocabCount > 0) && <p className="text-xs text-slate-500 mb-3">Tổng cộng: {Object.keys(incorrectItemsMap).length} mục.</p>}

            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              {incorrectKanaCount > 0 && (
                <Button onClick={startReviewIncorrectKanaQuiz} variant="primary" icon="fas fa-redo" className="flex-1 text-base sm:text-lg py-3">Ôn Lỗi Kana ({incorrectKanaCount})</Button>
              )}
              {incorrectVocabCount > 0 && (
                 <Button onClick={startReviewIncorrectVocabQuiz} variant="primary" icon="fas fa-redo" className="flex-1 text-base sm:text-lg py-3">Ôn Lỗi Từ Vựng ({incorrectVocabCount})</Button>
              )}
            </div>
            <Button onClick={clearIncorrectAnswers} variant="outline" icon="fas fa-trash-alt" className="w-full sm:w-auto mt-3 text-base sm:text-lg py-3">Xóa Tất Cả Lỗi Sai</Button>
          </>
        ) : (
          <p className="text-slate-500">Tuyệt vời! Chưa có lỗi sai nào được ghi nhận.</p>
        )}
      </div>

      <hr className="my-8 border-slate-300"/>

      <div className="p-4 sm:p-6 border border-teal-200 rounded-xl bg-teal-50 shadow-lg">
        <h2 className="text-xl font-semibold text-slate-700 mb-4 border-b-2 pb-2 border-teal-300">
            <i className="fas fa-random mr-2 text-teal-500"></i>Kiểm Tra Toàn Diện (MCQ Kana)
        </h2>
        <p className="text-sm text-slate-500 mb-4">Trắc nghiệm ngẫu nhiên hoặc nhập Romaji cho các ký tự Hiragana & Katakana (không bao gồm Kanji).</p>
        <Button onClick={() => {setIsReviewingItems(false); setCurrentScreen('comprehensiveQuiz'); saveQuizPerformance('comprehensive', 0, 0); /* Placeholder, will be updated on next */ }} variant="primary" className="w-full text-base sm:text-lg py-3" icon="fas fa-chalkboard-teacher">Bắt Đầu Kiểm Tra Toàn Diện Kana</Button>
      </div>
    </div>
  );

  if (currentScreen === 'setup') {
    return renderSetupScreen();
  }

  if (currentScreen === 'kanaGridQuiz') {
    return (
      <div className="quiz-screen-transition">
        <KanaGridQuiz characters={selectedKanaForGridQuiz} onQuizFinish={handleKanaGridQuizFinish} onMarkIncorrect={handleMarkIncorrect} isReviewMode={isReviewingItems} />
         <div className="mt-6 text-center">
            <Button onClick={() => setCurrentScreen('setup')} variant="outline" icon="fas fa-arrow-left">Quay Lại Chọn Bài</Button>
        </div>
      </div>
    );
  }

  if (currentScreen === 'matchingGame') {
    if (!matchGameDataSource || matchGameDataSource.length === 0) {
      return (
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md mx-auto screen-slide-fade-in">
          <p className="text-slate-600 text-lg mb-6">
            Không tìm thấy dữ liệu phù hợp cho trò chơi ghép thẻ. Vui lòng thử lại với lựa chọn khác.
          </p>
          <Button onClick={() => setCurrentScreen('setup')} variant="primary" icon="fas fa-arrow-left">
              Quay Lại Thiết Lập
          </Button>
        </div>
      );
    }
    return (
      <div className="quiz-screen-transition">
        <KanaRomajiMatchGame 
            dataSource={matchGameDataSource} 
            gameMode={matchGameMode}
            onGameFinish={handleMatchingGameFinish}
            speakFn={speakUtil}
        />
      </div>
    );
  }
  
  if (currentScreen === 'comprehensiveQuiz') {
    const handleNextComprehensiveQuestion = () => {
        saveQuizPerformance('comprehensive', correctAttempts, totalAttempts, 
          Object.values(userData.incorrectItems || {}).filter(item => {
            if ('char' in item) { // item is JapaneseCharacter
              return item.char === currentComprehensiveQuizChar?.char && item.type === currentComprehensiveQuizChar?.type;
            }
            return false;
          })
        );
        loadComprehensiveQuestion();
    };
    return (
      <div className="quiz-screen-transition">
        <div className="text-center mb-6 sm:mb-8"><h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800">Bài Kiểm Tra Toàn Diện (Kana)</h1><p className="text-slate-600">Kiểm tra kiến thức của bạn về Hiragana & Katakana.</p></div>
        <Stats learnedCount={learnedItemsInSession.size} accuracy={accuracy} streak={currentStreak} />
        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-xl mt-6 sm:mt-8">
          <Quiz comprehensiveQuizCharData={currentComprehensiveQuizChar} comprehensiveQuestionType={currentComprehensiveQuestionType} comprehensiveOptions={comprehensiveQuizOptions} onComprehensiveMCQAnswer={handleComprehensiveMCQAnswer} onNextComprehensiveQuestion={handleNextComprehensiveQuestion} quizInputValue={quizInputValue} onQuizInputChange={setQuizInputValue} onCheckAnswer={handleCheckAnswer} quizResultText={quizResultText} quizResultType={quizResultType} isQuizInputDisabled={isQuizInputDisabled} inputRef={quizInputRef} showNextButtonHighlight={isQuizInputDisabled && !!quizResultText} onMarkIncorrect={handleMarkIncorrect} />
        </div>
        <div className="mt-6 text-center"><Button onClick={() => setCurrentScreen('setup')} variant="outline" icon="fas fa-arrow-left">Quay Lại Chọn Bài</Button></div>
      </div>
    );
  }

  if (currentScreen === 'vocabularyQuiz') {
    const handleNextVocabWithSave = () => {
        if (!isReviewingItems) {
             saveQuizPerformance('vocabulary', correctAttempts, totalAttempts, 
                Object.values(userData.incorrectItems || {}).filter(item => {
                  if ('kana' in item && 'id' in item) { // item is VocabularyWord
                    return item.id === currentVocabWord?.id;
                  }
                  return false;
                })
             );
        }
        handleNextVocabularyQuestion();
    };
    return (
      <div className="quiz-screen-transition">
        <div className="text-center mb-6 sm:mb-8"><h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800">{isReviewingItems ? "Ôn Tập Từ Vựng" : "Kiểm Tra Từ Vựng"}</h1><p className="text-slate-600">Ghép từ và nghĩa tương ứng.</p></div>
        <Stats learnedCount={learnedItemsInSession.size} accuracy={accuracy} streak={currentStreak} />
        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-xl mt-6 sm:mt-8">
            <VocabularyQuizComponent 
                currentWord={currentVocabWord}
                questionType={currentVocabQuestionType}
                options={vocabQuizOptions}
                onAnswer={handleVocabularyAnswer}
                onNextQuestion={handleNextVocabWithSave}
                resultText={vocabResultText}
                resultType={vocabResultType}
                isDisabled={isVocabQuizDisabled}
            />
        </div>
        <div className="mt-6 text-center"><Button onClick={() => setCurrentScreen('setup')} variant="outline" icon="fas fa-arrow-left">Quay Lại Chọn Bài</Button></div>
      </div>
    );
  }
  
  return <div className="text-center p-10">Đang tải trang kiểm tra hoặc không tìm thấy màn hình...</div>; 
};

export default TestPage;