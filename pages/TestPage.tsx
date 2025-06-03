
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
  TestScreen, // Updated import
} from '../types';
import Quiz from '../components/Quiz'; 
import Stats from '../components/Stats';
import Button from '../components/Button';
import KanaGridQuiz from '../components/quiz_types/KanaGridQuiz';
import VocabularyQuizComponent from '../components/quiz_types/VocabularyQuiz'; // New component

const initialKanaSetSelection: KanaSetSelection = {
  main: true,
  dakuten: false, 
  yoon: false,
};

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


const TestPage: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<TestScreen>('setup');
  const [quizSettings, setQuizSettings] = useState<AdvancedQuizSettings>({
    script: 'hiragana',
    hiraganaSets: { ...initialKanaSetSelection },
    katakanaSets: { ...initialKanaSetSelection, extended: false },
  });
  const [selectedKanaForGrid, setSelectedKanaForGrid] = useState<JapaneseCharacter[]>([]);
  
  // For incorrect items
  const [incorrectQuizItems, setIncorrectQuizItems] = useState<(JapaneseCharacter | VocabularyWord)[]>([]);
  const [isReviewingItems, setIsReviewingItems] = useState<boolean>(false);

  // Comprehensive Quiz State
  const [quizInputValue, setQuizInputValue] = useState<string>(''); 
  const [quizResultText, setQuizResultText] = useState<string>('');
  const [quizResultType, setQuizResultType] = useState<QuizResultType>('');
  const [currentComprehensiveQuizChar, setCurrentComprehensiveQuizChar] = useState<JapaneseCharacter | null>(null);
  const [currentComprehensiveQuestionType, setCurrentComprehensiveQuestionType] = useState<ComprehensiveQuestionType | ''>('');
  const [comprehensiveQuizOptions, setComprehensiveQuizOptions] = useState<JapaneseCharacter[]>([]);
  const [isQuizInputDisabled, setIsQuizInputDisabled] = useState<boolean>(false);
  
  // Vocabulary Quiz State
  const [currentVocabWord, setCurrentVocabWord] = useState<VocabularyWord | null>(null);
  const [currentVocabQuestionType, setCurrentVocabQuestionType] = useState<VocabularyQuestionType | ''>('');
  const [vocabQuizOptions, setVocabQuizOptions] = useState<(VocabularyWord | { translation_vi: string, id: string })[]>([]); // Options can be words or just translations
  const [isVocabQuizDisabled, setIsVocabQuizDisabled] = useState<boolean>(false);
  const [vocabResultText, setVocabResultText] = useState<string>('');
  const [vocabResultType, setVocabResultType] = useState<QuizResultType>('');


  // General Stats State
  const [learnedItemsInSession, setLearnedItemsInSession] = useState<Set<string>>(new Set()); // Store item IDs
  const [totalAttempts, setTotalAttempts] = useState<number>(0);
  const [correctAttempts, setCorrectAttempts] = useState<number>(0);
  const [currentStreak, setCurrentStreak] = useState<number>(0);

  const quizInputRef = useRef<HTMLInputElement>(null);

  const handleMarkIncorrect = useCallback((item: JapaneseCharacter | VocabularyWord) => {
    setIncorrectQuizItems(prevItems => {
      const itemKey = 'char' in item ? `${item.char}-${item.type}` : item.id;
      const isAlreadyAdded = prevItems.some(i => ('char'in i ? `${i.char}-${i.type}` : i.id) === itemKey);
      if (!isAlreadyAdded) {
        return [...prevItems, item];
      }
      return prevItems;
    });
  }, []);

  const clearIncorrectAnswers = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tất cả lỗi sai đã ghi nhận không?")) {
      setIncorrectQuizItems([]);
    }
  };

  const startReviewIncorrectKanaQuiz = () => {
    const kanaToReview = incorrectQuizItems.filter(item => 'char' in item && !('translation_vi' in item)) as JapaneseCharacter[];
    if (kanaToReview.length > 0) {
      const shuffledIncorrect = [...kanaToReview].sort(() => Math.random() - 0.5);
      setSelectedKanaForGrid(shuffledIncorrect);
      setIsReviewingItems(true); 
      setCurrentScreen('kanaGridQuiz');
    } else {
      alert("Không có lỗi sai Kana nào để ôn tập.");
    }
  };
  
  // Placeholder for vocabulary review, can be expanded
  const startReviewIncorrectVocabQuiz = () => {
    const vocabToReview = incorrectQuizItems.filter(item => 'translation_vi' in item) as VocabularyWord[];
    if (vocabToReview.length > 0) {
      // For now, just alert. TODO: Implement vocab review quiz screen.
      // alert(`Sẵn sàng ôn tập ${vocabToReview.length} từ vựng. (Chức năng đang phát triển)`);
      // To actually start a vocab quiz for review:
      setQuizContext('vocabulary');
      setCurrentVocabWord(vocabToReview[0]); // Start with the first incorrect vocab
      // Need to set up options, question type etc. for the review session
      // This part needs more logic similar to loadVocabularyQuestion but for a specific list.
      // For simplicity in this update, let's re-use the normal vocab quiz flow but with incorrect items.
      // This would ideally shuffle vocabToReview and go through them.
      setCurrentScreen('vocabularyQuiz'); 
      setIsReviewingItems(true); // Indicate review mode
      // Simplified: just load the first incorrect word
      loadVocabularyQuestion(vocabToReview); // Pass the list to draw from
    } else {
      alert("Không có lỗi sai Từ vựng nào để ôn tập.");
    }
  };


  const handleScriptSelection = (script: 'hiragana' | 'katakana') => {
    setQuizSettings(prev => ({ ...prev, script }));
  };

  const toggleKanaSet = (script: 'hiragana' | 'katakana', setType: keyof KanaSetSelection | 'extended') => {
    setQuizSettings(prev => {
      const newSettings = { ...prev };
      if (script === 'hiragana') {
        if (setType !== 'extended') { 
            newSettings.hiraganaSets[setType as keyof KanaSetSelection] = !newSettings.hiraganaSets[setType as keyof KanaSetSelection];
        }
      } else { 
        const katakanaSetType = setType as keyof (KanaSetSelection & { extended: boolean });
        newSettings.katakanaSets[katakanaSetType] = !newSettings.katakanaSets[katakanaSetType];
      }
      return newSettings;
    });
  };
  
  const startKanaGridQuiz = () => {
    let charactersToTest: JapaneseCharacter[] = [];
    const { script, hiraganaSets, katakanaSets } = quizSettings;

    const addCharsByType = (charType: JapaneseCharacter['type'] | JapaneseCharacter['type'][]) => {
      const typesArray = Array.isArray(charType) ? charType : [charType];
      charactersToTest.push(...JAPANESE_CHARACTERS_DATA.filter(c => typesArray.includes(c.type)));
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
    
    setSelectedKanaForGrid(uniqueChars);
    setIsReviewingItems(false);
    setCurrentScreen('kanaGridQuiz');
  };

  const handleKanaGridQuizFinish = (score: number, total: number, allItemsFromSession: KanaGridQuizItem[]) => {
    if (isReviewingItems) {
        const correctlyReviewedKeys = new Set<string>();
        allItemsFromSession.forEach(sessionItem => {
            if (sessionItem.isCorrect) {
                correctlyReviewedKeys.add(`${sessionItem.char}-${sessionItem.type}`);
            }
        });
        setIncorrectQuizItems(prevIncorrect => 
            prevIncorrect.filter(item => {
              if (!('char' in item)) return true; // Keep vocab items
              return !correctlyReviewedKeys.has(`${item.char}-${item.type}`);
            })
        );
    }
    setIsReviewingItems(false);
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
        setLearnedItemsInSession(prev => new Set(prev).add(currentComprehensiveQuizChar.char + currentComprehensiveQuizChar.type)); // Use char+type as ID
    } else {
        setQuizResultText(`Sai rồi! Đáp án đúng là: ${correctAnswer}`); setQuizResultType('incorrect'); setCurrentStreak(0);
        handleMarkIncorrect(currentComprehensiveQuizChar);
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
        handleMarkIncorrect(currentComprehensiveQuizChar);
    }
    setIsQuizInputDisabled(true);
  };

  // ======== Vocabulary Quiz Logic ========
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
    let distractors = VOCABULARY_DATA.filter(v => v.id !== randomWord.id && v.type === randomWord.type); // Same type distractors
    if (distractors.length < 3) { // Fallback to any type if not enough same-type
        distractors = VOCABULARY_DATA.filter(v => v.id !== randomWord.id);
    }
    
    // Shuffle distractors
    for (let i = distractors.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [distractors[i], distractors[j]] = [distractors[j], distractors[i]];
    }

    if (questionType === VocabularyQuestionType.KanaToMeaning) { // Options are translations
        options.push({ translation_vi: randomWord.translation_vi, id: randomWord.id });
        distractors.slice(0, 3).forEach(d => options.push({ translation_vi: d.translation_vi, id: d.id + "_distractor" }));
    } else { // Options are Kana words
        options.push(randomWord);
        distractors.slice(0, 3).forEach(d => options.push(d));
    }
     // Ensure options are unique by content (kana or translation)
    const uniqueOptionValues = new Set();
    options = options.filter(opt => {
        const value = 'kana' in opt ? opt.kana : opt.translation_vi;
        if (uniqueOptionValues.has(value)) return false;
        uniqueOptionValues.add(value);
        return true;
    });
    // Fill up to 4 options if filtering made it less
    while(options.length < Math.min(4, VOCABULARY_DATA.length) && distractors.length > options.length -1) {
        const nextDistractor = distractors[options.length-1]; // get a new distractor
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
         if (options.length >= 4) break; // safety break if distractors run out or logic error
    }


    for (let i = options.length - 1; i > 0; i--) { // Shuffle final options
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    setVocabQuizOptions(options.slice(0,4)); // Ensure max 4 options

  }, []);

  const handleVocabularyAnswer = (selectedOption: VocabularyWord | { translation_vi: string, id: string }) => {
    if (!currentVocabWord || isVocabQuizDisabled) return;
    
    setTotalAttempts(prev => prev + 1);
    let isCorrect = false;

    if (currentVocabQuestionType === VocabularyQuestionType.KanaToMeaning) {
      // selectedOption is { translation_vi: string, id: string }
      isCorrect = (selectedOption as { translation_vi: string }).translation_vi === currentVocabWord.translation_vi;
    } else { // MeaningToKana
      // selectedOption is VocabularyWord
      isCorrect = (selectedOption as VocabularyWord).id === currentVocabWord.id;
    }

    if (isCorrect) {
      setVocabResultText('Chính xác!'); setVocabResultType('correct');
      setCorrectAttempts(prev => prev + 1); setCurrentStreak(prev => prev + 1);
      setLearnedItemsInSession(prev => new Set(prev).add(currentVocabWord.id));
      if(isReviewingItems){ // If correct in review mode, remove from incorrect list
        setIncorrectQuizItems(prevIncorrectItems => 
          prevIncorrectItems.filter(item => {
            // If item is a VocabularyWord, check its id against the currentVocabWord's id.
            // If it's not the currentVocabWord (which was answered correctly), keep it.
            // If it IS the currentVocabWord, filter it out (return false).
            if ('translation_vi' in item) { // item is VocabularyWord
              return item.id !== currentVocabWord.id;
            }
            // If item is a JapaneseCharacter, always keep it in this context,
            // as this logic is for removing a correctly answered *vocabulary* item.
            return true; 
          })
        );
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
        const vocabToReview = incorrectQuizItems.filter(item => 'translation_vi' in item) as VocabularyWord[];
        const currentIndex = currentVocabWord ? vocabToReview.findIndex(v => v.id === currentVocabWord.id) : -1;
        if (currentIndex !== -1 && currentIndex < vocabToReview.length -1) {
            loadVocabularyQuestion(vocabToReview.slice(currentIndex + 1)); // Pass remaining incorrect items
        } else {
             alert("Đã ôn tập hết từ vựng sai!");
             setIsReviewingItems(false);
             setCurrentScreen('setup');
        }
     } else {
        loadVocabularyQuestion();
     }
  };


  const setQuizContext = (quizType: 'comprehensive' | 'vocabulary' | 'kanaGrid') => {
    setLearnedItemsInSession(new Set());
    setTotalAttempts(0);
    setCorrectAttempts(0);
    setCurrentStreak(0);
    setIsReviewingItems(false);
    // Reset specific quiz states if necessary
    if (quizType !== 'comprehensive') {
        setQuizResultText('');
    }
    if (quizType !== 'vocabulary') {
        setVocabResultText('');
    }
  };


  useEffect(() => {
    if (currentScreen === 'comprehensiveQuiz') {
      setQuizContext('comprehensive');
      loadComprehensiveQuestion();
    } else if (currentScreen === 'vocabularyQuiz' && !isReviewingItems) { // Don't auto-load if starting review
      setQuizContext('vocabulary');
      loadVocabularyQuestion();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentScreen]); // loadComprehensiveQuestion, loadVocabularyQuestion are stable due to useCallback

  const accuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;

  const isKanaGridStartDisabled = () => {
    const { script, hiraganaSets, katakanaSets } = quizSettings;
    if (script === 'hiragana') {
      return !hiraganaSets.main && !hiraganaSets.dakuten && !hiraganaSets.yoon;
    }
    if (script === 'katakana') {
      return !katakanaSets.main && !katakanaSets.dakuten && !katakanaSets.yoon && !katakanaSets.extended;
    }
    return true;
  };
  
  const incorrectKanaCount = incorrectQuizItems.filter(item => 'char' in item && !('translation_vi' in item)).length;
  const incorrectVocabCount = incorrectQuizItems.filter(item => 'translation_vi' in item).length;

  const renderSetupScreen = () => (
    <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-slate-800 mb-6 sm:mb-8">
        <i className="fas fa-tasks mr-2 text-blue-600"></i>Chọn Bài Kiểm Tra
      </h1>

      <div className="mb-8 p-4 sm:p-6 border border-sky-200 rounded-xl bg-sky-50 shadow-lg">
        <h2 className="text-xl font-semibold text-slate-700 mb-4 border-b-2 pb-2 border-sky-300">
          <i className="fas fa-keyboard mr-2 text-purple-500"></i>Kiểu Nhập Romaji (Kana)
        </h2>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4">
          <Button onClick={() => handleScriptSelection('hiragana')} variant={quizSettings.script === 'hiragana' ? 'primary' : 'outline'} active={quizSettings.script === 'hiragana'} className="w-full text-base sm:text-lg py-3">Luyện Hiragana</Button>
          <Button onClick={() => handleScriptSelection('katakana')} variant={quizSettings.script === 'katakana' ? 'primary' : 'outline'} active={quizSettings.script === 'katakana'} className="w-full text-base sm:text-lg py-3">Luyện Katakana</Button>
        </div>
        {quizSettings.script === 'hiragana' && (<div className="space-y-3 my-4 p-4 bg-white rounded-lg shadow-sm"><h3 className="font-semibold text-slate-600 mb-2">Chọn bộ Hiragana:</h3><ButtonSetToggle sets={quizSettings.hiraganaSets} onToggle={(setType) => toggleKanaSet('hiragana', setType)} script="hiragana" /></div>)}
        {quizSettings.script === 'katakana' && (<div className="space-y-3 my-4 p-4 bg-white rounded-lg shadow-sm"><h3 className="font-semibold text-slate-600 mb-2">Chọn bộ Katakana:</h3><ButtonSetToggle sets={quizSettings.katakanaSets} onToggle={(setType) => toggleKanaSet('katakana', setType)} script="katakana" /></div>)}
        <Button onClick={startKanaGridQuiz} variant="secondary" className="w-full text-base sm:text-lg py-3 mt-4" icon="fas fa-play-circle" disabled={isKanaGridStartDisabled()}>Bắt Đầu Luyện Nhập Romaji</Button>
      </div>
      
      <hr className="my-8 border-slate-300"/>

      <div className="mb-8 p-4 sm:p-6 border border-green-200 rounded-xl bg-green-50 shadow-lg">
        <h2 className="text-xl font-semibold text-slate-700 mb-4 border-b-2 pb-2 border-green-300">
          <i className="fas fa-spell-check mr-2 text-green-500"></i>Kiểm Tra Từ Vựng
        </h2>
        <p className="text-sm text-slate-500 mb-4">Ghép từ tiếng Nhật (Kana) với nghĩa tiếng Việt và ngược lại.</p>
        <Button onClick={() => setCurrentScreen('vocabularyQuiz')} variant="primary" className="w-full text-base sm:text-lg py-3" icon="fas fa-book-reader">Bắt Đầu Kiểm Tra Từ Vựng</Button>
      </div>

      <hr className="my-8 border-slate-300"/>
      
      <div className="mb-8 p-4 sm:p-6 border border-orange-200 rounded-xl bg-orange-50 shadow-lg">
        <h2 className="text-xl font-semibold text-slate-700 mb-4 border-b-2 pb-2 border-orange-300">
          <i className="fas fa-history mr-2 text-orange-500"></i>Luyện Tập Lỗi Sai
        </h2>
        {incorrectQuizItems.length > 0 ? (
          <>
            <p className="text-sm text-slate-600 mb-1">Bạn có {incorrectKanaCount > 0 ? `${incorrectKanaCount} lỗi Kana` : ''}{incorrectKanaCount > 0 && incorrectVocabCount > 0 ? ' và ' : ''}{incorrectVocabCount > 0 ? `${incorrectVocabCount} lỗi Từ vựng` : ''} cần ôn tập.</p>
            {(incorrectKanaCount > 0 || incorrectVocabCount > 0) && <p className="text-xs text-slate-500 mb-3">Tổng cộng: {incorrectQuizItems.length} mục.</p>}

            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              {incorrectKanaCount > 0 && (
                <Button onClick={startReviewIncorrectKanaQuiz} variant="primary" icon="fas fa-redo" className="flex-1 text-base sm:text-lg py-3">Ôn Tập Kana ({incorrectKanaCount})</Button>
              )}
              {incorrectVocabCount > 0 && (
                 <Button onClick={startReviewIncorrectVocabQuiz} variant="primary" icon="fas fa-redo" className="flex-1 text-base sm:text-lg py-3">Ôn Tập Từ Vựng ({incorrectVocabCount})</Button>
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
            <i className="fas fa-random mr-2 text-teal-500"></i>Kiểm Tra Toàn Diện (Kana)
        </h2>
        <p className="text-sm text-slate-500 mb-4">Trắc nghiệm ngẫu nhiên hoặc nhập Romaji cho các ký tự Hiragana & Katakana.</p>
        <Button onClick={() => setCurrentScreen('comprehensiveQuiz')} variant="primary" className="w-full text-base sm:text-lg py-3" icon="fas fa-chalkboard-teacher">Bắt Đầu Kiểm Tra Toàn Diện Kana</Button>
      </div>
    </div>
  );

  if (currentScreen === 'setup') {
    return renderSetupScreen();
  }

  if (currentScreen === 'kanaGridQuiz') {
    return (
      <div className="quiz-screen-transition">
        <KanaGridQuiz characters={selectedKanaForGrid} onQuizFinish={handleKanaGridQuizFinish} onMarkIncorrect={handleMarkIncorrect} isReviewMode={isReviewingItems} />
         <div className="mt-6 text-center">
            <Button onClick={() => setCurrentScreen('setup')} variant="outline" icon="fas fa-arrow-left">Quay Lại Chọn Bài</Button>
        </div>
      </div>
    );
  }
  
  if (currentScreen === 'comprehensiveQuiz') {
    return (
      <div className="quiz-screen-transition">
        <div className="text-center mb-6 sm:mb-8"><h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800">Bài Kiểm Tra Toàn Diện (Kana)</h1><p className="text-slate-600">Kiểm tra kiến thức của bạn về Hiragana & Katakana.</p></div>
        <Stats learnedCount={learnedItemsInSession.size} accuracy={accuracy} streak={currentStreak} />
        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-xl mt-6 sm:mt-8">
          <Quiz comprehensiveQuizCharData={currentComprehensiveQuizChar} comprehensiveQuestionType={currentComprehensiveQuestionType} comprehensiveOptions={comprehensiveQuizOptions} onComprehensiveMCQAnswer={handleComprehensiveMCQAnswer} onNextComprehensiveQuestion={loadComprehensiveQuestion} quizInputValue={quizInputValue} onQuizInputChange={setQuizInputValue} onCheckAnswer={handleCheckAnswer} quizResultText={quizResultText} quizResultType={quizResultType} isQuizInputDisabled={isQuizInputDisabled} inputRef={quizInputRef} showNextButtonHighlight={isQuizInputDisabled && !!quizResultText} onMarkIncorrect={handleMarkIncorrect} />
        </div>
        <div className="mt-6 text-center"><Button onClick={() => setCurrentScreen('setup')} variant="outline" icon="fas fa-arrow-left">Quay Lại Chọn Bài</Button></div>
      </div>
    );
  }

  if (currentScreen === 'vocabularyQuiz') {
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
                onNextQuestion={handleNextVocabularyQuestion}
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
