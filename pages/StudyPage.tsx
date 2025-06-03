
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { JAPANESE_CHARACTERS_DATA } from '../constants';
import { JapaneseCharacter, CharacterScriptType } from '../types';
import Controls from '../components/Controls';
import CharacterDisplay from '../components/CharacterDisplay';
import Stats from '../components/Stats';

// Utility to speak text using Web Speech API
const speakCharacter = (text: string, lang: string = 'ja-JP') => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel(); // Cancel any previous utterances
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.85; // Slightly slower for clarity
    utterance.pitch = 1.0;
    utterance.volume = 0.9; // Ensure volume is not too low
    window.speechSynthesis.speak(utterance);
  } else {
    console.warn('Web Speech API not supported by this browser.');
    alert('Trình duyệt của bạn không hỗ trợ phát âm.');
  }
};


const StudyPage: React.FC = () => {
  const [currentDisplayCharData, setCurrentDisplayCharData] = useState<JapaneseCharacter | null>(null);
  const [speedInSeconds, setSpeedInSeconds] = useState<number>(5); // User-facing, now direct seconds
  const [actualSpeedMs, setActualSpeedMs] = useState<number>(5000); // speedInSeconds * 1000
  const [selectedScriptType, setSelectedScriptType] = useState<CharacterScriptType>(CharacterScriptType.All);
  const [isRotating, setIsRotating] = useState<boolean>(false);
  const rotationIntervalRef = useRef<number | null>(null);

  const [learnedChars, setLearnedChars] = useState<Set<string>>(new Set());

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
        char.type === 'katakana-extended' // Include extended Katakana
      );
    }
    if (selectedScriptType === CharacterScriptType.Kanji) {
       return JAPANESE_CHARACTERS_DATA.filter(char => char.type === 'kanji');
    }
    // This case should ideally not be reached if selectedScriptType is one of the enum values.
    // However, to satisfy TypeScript's exhaustiveness checks or as a fallback:
    return JAPANESE_CHARACTERS_DATA.filter(char => {
        // This condition might need adjustment based on how specific types are handled
        // For instance, if CharacterScriptType.Hiragana means ONLY 'hiragana' and not its derivatives.
        // The current logic for Hiragana/Katakana above is more inclusive.
        // If CharacterScriptType maps directly to char.type:
        return char.type === selectedScriptType;
    });
  }, [selectedScriptType]);
  
  const updateDisplayCharacter = useCallback((charData: JapaneseCharacter | null) => {
    setCurrentDisplayCharData(charData);
    if (charData) {
      setLearnedChars(prev => new Set(prev).add(charData.char));
    }
  }, []);

  const showRandomCharacter = useCallback(() => {
    const filtered = getFilteredCharacters();
    if (filtered.length === 0) {
        // If filter results in empty (e.g. no Kanji data), try to show something or indicate emptiness
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
    }, actualSpeedMs); // Uses current actualSpeedMs
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
      }, newSpeedMs); // Use the newSpeedMs directly for the new interval
    }
  };
  
  const handleSelectScriptType = (type: CharacterScriptType) => {
    setSelectedScriptType(type);
    handlePauseRotation(); 
    // showRandomCharacter will be called by useEffect below
  };

   useEffect(() => {
    showRandomCharacter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedScriptType]); 


  useEffect(() => {
    // Set initial character and speed on mount
    showRandomCharacter();
    setActualSpeedMs(speedInSeconds * 1000); // Initialize actualSpeedMs based on initial speedInSeconds
    
    const logVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const japaneseVoices = voices.filter(voice => voice.lang.startsWith('ja'));
      if (japaneseVoices.length > 0) {
        console.log('Available Japanese voices:', japaneseVoices);
      } else {
        console.warn('No Japanese voices found for speech synthesis. Pronunciation may not work correctly for Japanese characters.');
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

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
        speedInSeconds={speedInSeconds} // Pass speedInSeconds
        onSpeedChange={handleSpeedChange}
        currentRotationSpeedMs={actualSpeedMs}
        isRotating={isRotating}
        onPronounce={speakCharacter}
      />
      <Stats
        learnedCount={learnedChars.size}
        // Do not pass accuracy or streak
      />
    </>
  );
};

export default StudyPage;
