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
  // Import các bảng kanji mới
  organizedKanjiBasicNumbers,
  organizedKanjiTime,
  organizedKanjiPeople,
  KANJI_CHARACTERS_DATA,
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

const HomePage: React.FC = () => {
  // Cập nhật sections để bao gồm các phần kanji riêng biệt
  const sections = {
    hiragana: "hiragana-main",
    katakana: "katakana-main",
    kanji: "kanji-main",
    kanjiNumbers: "kanji-numbers",
    kanjiTime: "kanji-time", 
    kanjiPeople: "kanji-people",
    katakanaExtended: "katakana-extended-main" 
  };

  const [visibleSection, setVisibleSection] = useState<CharacterScriptType | 'katakana-extended' | 'kanji-detail'>(CharacterScriptType.All);

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
    
    // Cập nhật logic hiển thị section
    if (sectionKey === 'katakanaExtended') {
        setVisibleSection('katakana-extended');
    } else if (sectionKey === 'kanjiNumbers' || sectionKey === 'kanjiTime' || sectionKey === 'kanjiPeople') {
        setVisibleSection('kanji-detail');
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
          Tổng hợp Hiragana, Katakana, Biến Âm, Âm Ghép, Âm Mở Rộng và Kanji cơ bản theo chủ đề.
        </p>
      </div>

      {/* Navigation với dropdown cho Kanji */}
      <div className="sticky top-16 bg-sky-50/95 backdrop-blur-sm z-40 py-3 mb-6 rounded-lg shadow-md flex justify-center items-center gap-2 sm:gap-3 flex-wrap px-2">
          <Button onClick={handleShowAll} variant={visibleSection === CharacterScriptType.All ? 'primary' : 'outline'} active={visibleSection === CharacterScriptType.All} className="text-xs sm:text-sm">Tất Cả</Button>
          <Button onClick={() => scrollToSection('hiragana')} variant={visibleSection === CharacterScriptType.Hiragana ? 'primary' : 'outline'} active={visibleSection === CharacterScriptType.Hiragana} icon="fas fa-j" className="text-xs sm:text-sm">Hiragana</Button>
          <Button onClick={() => scrollToSection('katakana')} variant={visibleSection === CharacterScriptType.Katakana ? 'primary' : 'outline'} active={visibleSection === CharacterScriptType.Katakana} icon="fas fa-k" className="text-xs sm:text-sm">Katakana</Button>
          <Button onClick={() => scrollToSection('katakanaExtended')} variant={visibleSection === 'katakana-extended' ? 'primary' : 'outline'} active={visibleSection === 'katakana-extended'} icon="fas fa-expand-arrows-alt" className="text-xs sm:text-sm">Katakana Mở Rộng</Button>
          
          {/* Dropdown cho Kanji */}
          <div className="relative group">
            <Button onClick={() => scrollToSection('kanji')} variant={visibleSection === CharacterScriptType.Kanji || visibleSection === 'kanji-detail' ? 'primary' : 'outline'} active={visibleSection === CharacterScriptType.Kanji || visibleSection === 'kanji-detail'} icon="fas fa-scroll" className="text-xs sm:text-sm">
              Kanji <i className="fas fa-chevron-down ml-1 text-xs"></i>
            </Button>
            <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-sky-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[180px] z-50">
              <button onClick={() => scrollToSection('kanjiNumbers')} className="w-full text-left px-3 py-2 text-xs hover:bg-sky-50 first:rounded-t-lg">
                <i className="fas fa-calculator mr-2 text-blue-500"></i>Số Đếm
              </button>
              <button onClick={() => scrollToSection('kanjiTime')} className="w-full text-left px-3 py-2 text-xs hover:bg-sky-50">
                <i className="fas fa-clock mr-2 text-green-500"></i>Thời Gian
              </button>
              <button onClick={() => scrollToSection('kanjiPeople')} className="w-full text-left px-3 py-2 text-xs hover:bg-sky-50 last:rounded-b-lg">
                <i className="fas fa-user-graduate mr-2 text-purple-500"></i>Con Người
              </button>
            </div>
          </div>
      </div>
      
      {/* Hiragana */}
      { (visibleSection === CharacterScriptType.All || visibleSection === CharacterScriptType.Hiragana) && (
        <>
          <CharacterTable data={organizedHiraganaBasic} sectionId={sections.hiragana} onCharClick={handleCharPronunciation} />
          <CharacterTable data={organizedHiraganaDakutenHandakuten} sectionId="hiragana-bien-am" onCharClick={handleCharPronunciation} />
          <CharacterTable data={organizedHiraganaYoon} sectionId="hiragana-am-ghep" onCharClick={handleCharPronunciation} />
        </>
      )}

      {/* Katakana */}
      { (visibleSection === CharacterScriptType.All || visibleSection === CharacterScriptType.Katakana) && (
        <>
          <CharacterTable data={organizedKatakanaBasic} sectionId={sections.katakana} onCharClick={handleCharPronunciation} />
          <CharacterTable data={organizedKatakanaDakutenHandakuten} sectionId="katakana-bien-am" onCharClick={handleCharPronunciation} />
          <CharacterTable data={organizedKatakanaYoon} sectionId="katakana-am-ghep" onCharClick={handleCharPronunciation} />
        </>
      )}
      
      {/* Katakana Extended */}
      { (visibleSection === CharacterScriptType.All || visibleSection === 'katakana-extended') && (
         <CharacterTable data={organizedKatakanaExtendedTable} sectionId={sections.katakanaExtended} onCharClick={handleCharPronunciation} />
      )}

      {/* Kanji Sections */}
      { (visibleSection === CharacterScriptType.All || visibleSection === CharacterScriptType.Kanji || visibleSection === 'kanji-detail') && (
          <>
            {/* Kanji Intro Section */}
            <section className="mb-8 sm:mb-12" id={sections.kanji}>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-700 mb-4 sm:mb-6 pb-2 border-b-2 border-blue-300 flex items-center">
                <i className="fas fa-scroll mr-2 sm:mr-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 text-2xl sm:text-3xl"></i>
                Kanji Cơ Bản (漢字)
              </h2>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 sm:p-6 rounded-xl border border-blue-200 mb-6">
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                  Kanji là chữ Hán được sử dụng trong tiếng Nhật. Mỗi kanji có thể có nhiều cách đọc: 
                  <strong className="text-blue-600"> âm Kun</strong> (cách đọc Nhật Bản) và 
                  <strong className="text-purple-600"> âm On</strong> (cách đọc Trung Hoa). 
                  Dưới đây là các kanji cơ bản được phân loại theo chủ đề.
                </p>
              </div>
            </section>

            {/* Kanji Numbers */}
            <CharacterTable data={organizedKanjiBasicNumbers} sectionId={sections.kanjiNumbers} onCharClick={handleCharPronunciation} />
            
            {/* Kanji Time */}
            <CharacterTable data={organizedKanjiTime} sectionId={sections.kanjiTime} onCharClick={handleCharPronunciation} />
            
            {/* Kanji People & Education */}
            <CharacterTable data={organizedKanjiPeople} sectionId={sections.kanjiPeople} onCharClick={handleCharPronunciation} />

            {/* Kanji Examples Section */}
            <section className="mb-8 sm:mb-12">
              <h3 className="text-lg sm:text-xl font-bold text-slate-700 mb-4 flex items-center">
                <i className="fas fa-lightbulb mr-2 text-yellow-500"></i>
                Ví Dụ Từ Ghép Với Kanji
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Examples từ KANJI_CHARACTERS_DATA */}
                {KANJI_CHARACTERS_DATA.slice(0, 6).map((kanji, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg shadow-md border border-slate-200">
                    <div className="font-['Noto_Sans_JP'] text-2xl font-bold text-slate-800 mb-2">{kanji.kanji}</div>
                    <div className="text-sm text-slate-600 mb-3">{kanji.meaning_vi}</div>
                    {kanji.examples && kanji.examples.slice(0, 2).map((example, i) => (
                      <div key={i} className="bg-sky-50 p-2 rounded mb-2 last:mb-0">
                        <div className="font-['Noto_Sans_JP'] font-semibold text-slate-800">{example.word}</div>
                        <div className="text-xs text-blue-600">{example.reading} ({example.romaji})</div>
                        <div className="text-xs text-slate-600">{example.meaning_vi}</div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </section>
          </>
      )}
    </div>
  );
};

export default HomePage;
