
import React, { useState, useCallback } from 'react';
import {
  JAPANESE_CHARACTERS_DATA,
  organizedHiraganaBasic,
  organizedHiraganaDakutenHandakuten,
  organizedHiraganaYoon,
  organizedKatakanaBasic,
  organizedKatakanaDakutenHandakuten,
  organizedKatakanaYoon,
  organizedKatakanaExtendedTable,
} from '../constants';
import { JapaneseCharacter, CharacterScriptType } from '../types';
import Button from '../components/Button';
import CharacterTable from '../components/CharacterTable';

// Re-define or import speakCharacter utility
const speakCharacterUtil = (text: string, lang: string = 'ja-JP') => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.85; 
    utterance.pitch = 1.0;
    utterance.volume = 0.9;

    // Apply active class to button
    const pronounceButtons = document.querySelectorAll('.pronounce-btn-indicator');
    pronounceButtons.forEach(btn => btn.classList.add('pronounce-active'));
    
    utterance.onend = () => {
        pronounceButtons.forEach(btn => btn.classList.remove('pronounce-active'));
    };
    utterance.onerror = () => { // Also remove on error
        pronounceButtons.forEach(btn => btn.classList.remove('pronounce-active'));
    };

    window.speechSynthesis.speak(utterance);
  } else {
    console.warn('Web Speech API not supported by this browser.');
  }
};

const CharacterCard: React.FC<{ char: JapaneseCharacter, onCharClick?: (charItem: JapaneseCharacter) => void }> = ({ char, onCharClick }) => (
  <div 
    className={`bg-white p-3 sm:p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 ease-in-out border border-sky-100 flex flex-col items-center justify-center min-h-[100px] sm:min-h-[130px] ${onCharClick ? 'cursor-pointer hover:bg-sky-50 hover:-translate-y-1' : ''}`}
    onClick={onCharClick ? () => onCharClick(char) : undefined}
    role={onCharClick ? "button" : undefined}
    tabIndex={onCharClick ? 0 : undefined}
    onKeyPress={onCharClick ? (e) => (e.key === 'Enter' || e.key === ' ') && onCharClick(char) : undefined}
    aria-label={onCharClick ? `Phát âm ${char.char}` : undefined}
    >
    <div className="font-['Noto_Sans_JP'] text-3xl sm:text-4xl font-bold text-slate-800 mb-1">{char.char}</div>
    <div className="text-xs sm:text-sm text-blue-600 font-semibold">{char.romaji.split(' ')[0]}</div>
    {char.type === 'kanji' && (
      <>
        <div className="text-xs text-slate-500 mt-1 text-center">
            {char.meaning && <p><strong>Nghĩa:</strong> {char.meaning}</p>}
            {char.onyomi && <p><strong>On:</strong> {char.onyomi}</p>}
            {char.kunyomi && <p><strong>Kun:</strong> {char.kunyomi}</p>}
        </div>
      </>
    )}
  </div>
);

const KanjiSetDisplay: React.FC<{ title: string; characters: JapaneseCharacter[]; typeId: string; icon?: string; onCharClick?: (charItem: JapaneseCharacter) => void }> = ({ title, characters, typeId, icon, onCharClick }) => (
  <section className="mb-8 sm:mb-12" id={typeId}>
    <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-700 mb-4 sm:mb-6 pb-2 border-b-2 border-blue-300 flex items-center">
      {icon && <i className={`${icon} mr-2 sm:mr-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 text-2xl sm:text-3xl`}></i>}
      {title}
    </h2>
    {characters.length > 0 ? (
      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3">
        {characters.map(char => <CharacterCard key={`${typeId}-${char.char}-${char.romaji}`} char={char} onCharClick={onCharClick} />)}
      </div>
    ) : (
      <p className="text-slate-500">Không có ký tự nào trong mục này.</p>
    )}
  </section>
);


const HomePage: React.FC = () => {
  const kanji = JAPANESE_CHARACTERS_DATA.filter(c => c.type === 'kanji');
  
  const sections = {
    hiragana: "hiragana-main",
    katakana: "katakana-main",
    kanji: "kanji-main",
    katakanaExtended: "katakana-extended-main" 
  };

  const [visibleSection, setVisibleSection] = useState<CharacterScriptType | 'katakana-extended'>(CharacterScriptType.All);

  const scrollToSection = (sectionKey: keyof typeof sections) => {
    const element = document.getElementById(sections[sectionKey]);
    if (element) {
        const navHeight = document.querySelector('nav')?.offsetHeight || 64; 
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - navHeight - 20; 

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
    if (sectionKey === 'katakanaExtended') {
        setVisibleSection('katakana-extended');
    } else if (sectionKey === 'hiragana' || sectionKey === 'katakana' || sectionKey === 'kanji') {
        setVisibleSection(sectionKey as CharacterScriptType.Hiragana | CharacterScriptType.Katakana | CharacterScriptType.Kanji);
    }
  };
  
  const handleShowAll = () => {
    setVisibleSection(CharacterScriptType.All);
     window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const handleCharPronunciation = useCallback((charItem: JapaneseCharacter | { char: string; romaji: string; note?: string }) => {
    speakCharacterUtil(charItem.char);
  }, []);


  return (
    <div className="p-1 sm:p-0">
      <div className="text-center mb-8 sm:mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 mb-2">Bảng Chữ Cái Tiếng Nhật</h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
          Tổng hợp Hiragana, Katakana, Biến Âm, Âm Ghép, Âm Mở Rộng và Kanji cơ bản.
        </p>
      </div>

      <div className="sticky top-16 bg-sky-50/95 backdrop-blur-sm z-40 py-3 mb-6 rounded-lg shadow-md flex justify-center items-center gap-2 sm:gap-3 flex-wrap px-2">
          <Button onClick={handleShowAll} variant={visibleSection === CharacterScriptType.All ? 'primary' : 'outline'} active={visibleSection === CharacterScriptType.All} className="text-xs sm:text-sm">Tất Cả</Button>
          <Button onClick={() => scrollToSection('hiragana')} variant={visibleSection === CharacterScriptType.Hiragana ? 'primary' : 'outline'} active={visibleSection === CharacterScriptType.Hiragana} icon="fas fa-j" className="text-xs sm:text-sm">Hiragana</Button>
          <Button onClick={() => scrollToSection('katakana')} variant={visibleSection === CharacterScriptType.Katakana ? 'primary' : 'outline'} active={visibleSection === CharacterScriptType.Katakana} icon="fas fa-k" className="text-xs sm:text-sm">Katakana</Button>
          <Button onClick={() => scrollToSection('katakanaExtended')} variant={visibleSection === 'katakana-extended' ? 'primary' : 'outline'} active={visibleSection === 'katakana-extended'} icon="fas fa-expand-arrows-alt" className="text-xs sm:text-sm">Katakana Mở Rộng</Button>
          <Button onClick={() => scrollToSection('kanji')} variant={visibleSection === CharacterScriptType.Kanji ? 'primary' : 'outline'} active={visibleSection === CharacterScriptType.Kanji} icon="fas fa-scroll" className="text-xs sm:text-sm">Kanji</Button>
      </div>
      
      { (visibleSection === CharacterScriptType.All || visibleSection === CharacterScriptType.Hiragana) && (
        <>
          <CharacterTable data={organizedHiraganaBasic} sectionId={sections.hiragana} onCharClick={handleCharPronunciation} />
          <CharacterTable data={organizedHiraganaDakutenHandakuten} sectionId="hiragana-bien-am" onCharClick={handleCharPronunciation} />
          <CharacterTable data={organizedHiraganaYoon} sectionId="hiragana-am-ghep" onCharClick={handleCharPronunciation} />
        </>
      )}

      { (visibleSection === CharacterScriptType.All || visibleSection === CharacterScriptType.Katakana) && (
        <>
          <CharacterTable data={organizedKatakanaBasic} sectionId={sections.katakana} onCharClick={handleCharPronunciation} />
          <CharacterTable data={organizedKatakanaDakutenHandakuten} sectionId="katakana-bien-am" onCharClick={handleCharPronunciation} />
          <CharacterTable data={organizedKatakanaYoon} sectionId="katakana-am-ghep" onCharClick={handleCharPronunciation} />
        </>
      )}
      
      { (visibleSection === CharacterScriptType.All || visibleSection === 'katakana-extended') && (
         <CharacterTable data={organizedKatakanaExtendedTable} sectionId={sections.katakanaExtended} onCharClick={handleCharPronunciation} />
      )}

      { (visibleSection === CharacterScriptType.All || visibleSection === CharacterScriptType.Kanji) && (
          <KanjiSetDisplay title="Một Số Kanji Cơ Bản (漢字)" characters={kanji} typeId={sections.kanji} icon="fas fa-scroll" onCharClick={handleCharPronunciation} />
      )}
    </div>
  );
};

export default HomePage;
