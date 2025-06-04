

export interface JapaneseCharacter {
  char: string;
  romaji: string;
  type: 
    | 'hiragana' 
    | 'katakana' 
    | 'kanji'
    | 'hiragana-dakuten'
    | 'hiragana-handakuten'
    | 'hiragana-yoon'
    | 'katakana-dakuten'
    | 'katakana-handakuten'
    | 'katakana-yoon'
    | 'katakana-extended';
  example?: {
    word: string;
    romaji_example: string;
    meaning_vi: string;
  };
  note?: string;
  onyomi?: string; // For Kanji
  kunyomi?: string; // For Kanji
  meaning?: string; // For Kanji
}

export enum CharacterScriptType {
  All = 'all',
  Hiragana = 'hiragana', 
  Katakana = 'katakana', 
  Kanji = 'kanji',
  HiraganaDakuten = 'hiragana-dakuten',
  HiraganaHandakuten = 'hiragana-handakuten',
  HiraganaYoon = 'hiragana-yoon',
  KatakanaDakuten = 'katakana-dakuten',
  KatakanaHandakuten = 'katakana-handakuten',
  KatakanaYoon = 'katakana-yoon',
  KatakanaExtended = 'katakana-extended',
}

export enum QuizMode {
  Comprehensive = 'comprehensive', 
}

export enum ComprehensiveQuestionType {
  CharToRomaji = 'charToRomaji',
  RomajiToChar = 'romajiToChar',
}

export type QuizResultType = 'correct' | 'incorrect' | '';

export interface KanaSetSelection {
  main: boolean;
  dakuten: boolean; 
  yoon: boolean;
  extended?: boolean; // Optional, as it's Katakana specific
}

export interface AdvancedQuizSettings {
  script: 'hiragana' | 'katakana'; // Simplified, 'all' can be handled by combining
  hiraganaSets: KanaSetSelection;
  katakanaSets: KanaSetSelection & { extended: boolean }; // Ensure extended is part of katakana sets type
}

export type KanaGridQuizItem = JapaneseCharacter & {
  id: string; 
  userAnswer: string;
  isCorrect: boolean | null; 
  revealed: boolean; 
};

export interface VocabularyWord {
  id: string; // Ensure ID for keying and tracking
  kana: string;
  romaji: string;
  translation_vi: string;
  type: 'hiragana' | 'katakana' | 'mixed'; // Base script type for the word
  sourceCharType?: JapaneseCharacter['type']; // Original character type source if applicable
}

export enum VocabularyQuestionType {
  KanaToMeaning = 'kanaToMeaning',
  MeaningToKana = 'meaningToKana',
}

export type IconVariant = 'primary' | 'default';

export type TestScreen = 'setup' | 'kanaGridQuiz' | 'comprehensiveQuiz' | 'vocabularyQuiz' | 'results' | 'matchingGame';

// Used to be QuizResultSummary, now more generic for different quiz types
export interface QuizPerformance {
  quizType: 'kanaGrid' | 'vocabulary' | 'comprehensive' | 'matchingGame';
  timestamp: number;
  score: number;
  total: number;
  incorrectItemsSnapshot?: (JapaneseCharacter | VocabularyWord)[]; // Snapshot of incorrect items for this specific quiz
}

// Added for CharacterTable component
export interface OrganizedTableDataRow {
  rowHeader: string;
  rowSubHeader?: string;
  cells: (JapaneseCharacter | { char: string; romaji: string; note?: string } | null)[];
}

export interface OrganizedTableData {
  title: string;
  icon?: string;
  columnHeaders?: string[]; // e.g., A, I, U, E, O
  rows: OrganizedTableDataRow[];
  footerChar?: JapaneseCharacter | { char: string; romaji: string; note?: string } | null; // For ん, ン
}

// For Matching Game (Kana-Romaji or Hira-Kata)
export type MatchGameMode = 'kanaRomaji' | 'hiraganaKatakana';

export interface HiraganaKatakanaPair {
  id: string; // Unique ID for the pair, e.g., based on commonRomaji
  hiragana: JapaneseCharacter;
  katakana: JapaneseCharacter;
  commonRomaji: string;
}

export type MatchGameDataSource = JapaneseCharacter[] | HiraganaKatakanaPair[];

export interface MatchGameCard {
  id: string; // Unique ID for the card instance (e.g., 'kana-あ-1' or 'romaji-a-1')
  type: 'kana' | 'romaji'; // Type of content on the card: 'kana' for Japanese chars, 'romaji' for Romaji text
  value: string; // The actual character (e.g., 'あ', 'ア') or romaji (e.g., 'a')
  originalCharacterPairId: string; // Identifier linking this card to its pair (e.g., based on commonRomaji or a unique ID from HiraganaKatakanaPair)
  isFlipped: boolean;
  isMatched: boolean;
  sourceCardType?: 'hiragana' | 'katakana'; // To distinguish between hiragana and katakana cards when type is 'kana'
}

// Types for Chatbot and UserData
export interface ChatMessagePart {
  text: string;
}
export interface ChatMessage {
  role: 'user' | 'model';
  parts: ChatMessagePart[];
  timestamp?: number;
}

export interface UserData {
  lastStudiedTimestamp?: number;
  studyStreak?: number;
  // Store incorrect items as a map for easier add/remove by a unique key
  incorrectItems?: Record<string, JapaneseCharacter | VocabularyWord>; // Key: e.g., "char-あ" or "vocab-犬"
  learnedChars?: Record<string, { char: string, lastSeen: number, type: JapaneseCharacter['type'] }>; // Key: char string
  quizPerformances?: QuizPerformance[];
  chatHistory?: ChatMessage[];
  userPreferences?: {
    displayName?: string;
    // Add other preferences here
  };
}