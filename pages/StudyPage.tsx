import React, { useState, useEffect, useCallback, useRef } from 'react';
import { JAPANESE_CHARACTERS_DATA } from '../constants';
import { JapaneseCharacter, CharacterScriptType, UserData } from '../types';
import Controls from '../components/Controls';
import CharacterDisplay from '../components/CharacterDisplay';
import Stats from '../components/Stats';
import useLocalStorage from '../hooks/useLocalStorage'; // Import useLocalStorage

const speakCharacter = (text: string, lang: string = 'ja-JP') => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.85; 
    utterance.pitch = 1.0;
    utterance.volume = 0.9;
    window.speechSynthesis.speak(utterance);
  } else {
    console.warn('Web Speech API not supported by this browser.');
    alert('Trình duyệt của bạn không hỗ trợ phát âm.');
  }
};


const StudyPage: React.FC = () => {
  const [currentDisplayCharData, setCurrentDisplayCharData] = useState<JapaneseCharacter | null>(null);
  const [speedInSeconds, setSpeedInSeconds] = useState<number>(5);
  const [actualSpeedMs, setActualSpeedMs] = useState<number>(5000);
  const [selectedScriptType, setSelectedScriptType] = useState<CharacterScriptType>(CharacterScriptType.All);
  const [isRotating, setIsRotating] = useState<boolean>(false);
  const rotationIntervalRef = useRef<number | null>(null);

  const [userData, setUserData] = useLocalStorage<UserData>('userData', {
    learnedChars: {},
    studyStreak: 0,
    lastStudiedTimestamp: 0,
    incorrectItems: {},
    quizPerformances: [],
    chatHistory: [],
  });

  const getFilteredCharacters = useCallback((): JapaneseCharacter[] => {
    if (selectedScriptType === CharacterScriptType.All) {
      return JAPANESE_CHARACTERS_DATA;
    }
    if (selectedScriptType === CharacterScriptType.Hiragana) {
      return JAPANESE_CHARACTERS_DATA.filter(char => 
        char.type === 'hiragana' || 
        char.type === 'hiragana-dakuten' || 
        char.type === 'hiragana-handakuten' || 
        char.type === 'hiragana-yoon'
      );
    }
    if (selectedScriptType === CharacterScriptType.Katakana) {
      return JAPANESE_CHARACTERS_DATA.filter(char => 
        char.type === 'katakana' ||
        char.type === 'katakana-dakuten' ||
        char.type === 'katakana-handakuten' ||
        char.type === 'katakana-yoon' ||
        char.type === 'katakana-extended'
      );
    }
    if (selectedScriptType === CharacterScriptType.Kanji) {
       return JAPANESE_CHARACTERS_DATA.filter(char => char.type === 'kanji');
    }
    return JAPANESE_CHARACTERS_DATA.filter(char => char.type === selectedScriptType);
  }, [selectedScriptType]);
  
  const updateDisplayCharacter = useCallback((charData: JapaneseCharacter | null) => {
    setCurrentDisplayCharData(charData);
    if (charData) {
      setUserData(prev => ({
        ...prev,
        learnedChars: {
          ...prev.learnedChars,
          [charData.char]: { char: charData.char, lastSeen: Date.now(), type: charData.type },
        },
        lastStudiedTimestamp: Date.now(),
      }));
    }
  }, [setUserData]);

  const showRandomCharacter = useCallback(() => {
    const filtered = getFilteredCharacters();
    if (filtered.length === 0) {
        const firstOverallOrNull = JAPANESE_CHARACTERS_DATA.length > 0 ? JAPANESE_CHARACTERS_DATA[0] : null;
        updateDisplayCharacter(firstOverallOrNull);
        if (!firstOverallOrNull) {
             console.warn("No characters available to display for the selected filter or in general.");
        }
        return;
    }
    const randomIndex = Math.floor(Math.random() * filtered.length);
    const newChar = filtered[randomIndex];
    updateDisplayCharacter(newChar);
  }, [getFilteredCharacters, updateDisplayCharacter]);

  const showNextCharacter = useCallback(() => {
    const filtered = getFilteredCharacters();
    if (filtered.length === 0) return;

    let currentFilteredIndex = -1;
    if(currentDisplayCharData){
        currentFilteredIndex = filtered.findIndex(c => c.char === currentDisplayCharData.char && c.romaji === currentDisplayCharData.romaji && c.type === currentDisplayCharData.type);
    }
    
    const nextFilteredIndex = (currentFilteredIndex + 1) % filtered.length;
    const newChar = filtered[nextFilteredIndex];
    updateDisplayCharacter(newChar);
  }, [getFilteredCharacters, currentDisplayCharData, updateDisplayCharacter]);

  const showPrevCharacter = useCallback(() => {
    const filtered = getFilteredCharacters();
    if (filtered.length === 0) return;

    let currentFilteredIndex = -1;
    if(currentDisplayCharData){
         currentFilteredIndex = filtered.findIndex(c => c.char === currentDisplayCharData.char && c.romaji === currentDisplayCharData.romaji && c.type === currentDisplayCharData.type);
    }
    const prevFilteredIndex = (currentFilteredIndex - 1 + filtered.length) % filtered.length;
    const newChar = filtered[prevFilteredIndex];
    updateDisplayCharacter(newChar);
  }, [getFilteredCharacters, currentDisplayCharData, updateDisplayCharacter]);

  const handleStartRotation = () => {
    if (isRotating) return;
    setIsRotating(true);
    showRandomCharacter(); 
     if (rotationIntervalRef.current) {
        clearInterval(rotationIntervalRef.current);
    }
    rotationIntervalRef.current = window.setInterval(() => {
      showRandomCharacter();
    }, actualSpeedMs);
  };

  const handlePauseRotation = () => {
    setIsRotating(false);
    if (rotationIntervalRef.current) {
      clearInterval(rotationIntervalRef.current);
      rotationIntervalRef.current = null;
    }
  };

  const handleSpeedChange = (newSpeedInSeconds: number) => {
    setSpeedInSeconds(newSpeedInSeconds);
    const newSpeedMs = newSpeedInSeconds * 1000;
    setActualSpeedMs(newSpeedMs);

    if (isRotating) {
      if (rotationIntervalRef.current) {
        clearInterval(rotationIntervalRef.current);
      }
      rotationIntervalRef.current = window.setInterval(() => {
        showRandomCharacter();
      }, newSpeedMs);
    }
  };
  
  const handleSelectScriptType = (type: CharacterScriptType) => {
    setSelectedScriptType(type);
    handlePauseRotation(); 
  };

   useEffect(() => {
    showRandomCharacter();
  }, [selectedScriptType, showRandomCharacter]); 

  useEffect(() => {
    showRandomCharacter();
    setActualSpeedMs(speedInSeconds * 1000); 
    
    const logVoices = () => {
      if (!('speechSynthesis' in window)) return;
      const voices = window.speechSynthesis.getVoices();
      const japaneseVoices = voices.filter(voice => voice.lang.startsWith('ja'));
      if (japaneseVoices.length > 0) {
        // console.log('Available Japanese voices:', japaneseVoices);
      } else {
        console.warn('No Japanese voices found for speech synthesis.');
      }
    };

    if ('speechSynthesis' in window) {
      if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.onvoiceschanged = () => {
          logVoices();
          window.speechSynthesis.onvoiceschanged = null; 
        };
      } else {
        logVoices();
      }
    }
  }, []);  // Removed showRandomCharacter from dependencies to avoid re-triggering on every char change

  useEffect(() => {
    return () => {
      if (rotationIntervalRef.current) {
        clearInterval(rotationIntervalRef.current);
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);
  
  const learnedCount = userData.learnedChars ? Object.keys(userData.learnedChars).length : 0;

  return (
    <>
      <Controls
        selectedScriptType={selectedScriptType}
        onSelectScriptType={handleSelectScriptType}
        onStart={handleStartRotation}
        onPause={handlePauseRotation}
        onPrev={() => { handlePauseRotation(); showPrevCharacter(); }}
        onNext={() => { handlePauseRotation(); showNextCharacter(); }}
        isRotating={isRotating}
      />
      <CharacterDisplay
        charData={currentDisplayCharData}
        speedInSeconds={speedInSeconds}
        onSpeedChange={handleSpeedChange}
        currentRotationSpeedMs={actualSpeedMs}
        isRotating={isRotating}
        onPronounce={speakCharacter}
      />
      <Stats
        learnedCount={learnedCount}
      />
    </>
  );
};

export default StudyPage;
