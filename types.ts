
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

export type TestScreen = 'setup' | 'kanaGridQuiz' | 'comprehensiveQuiz' | 'vocabularyQuiz' | 'results';

export interface QuizResultSummary {
  score: number;
  total: number;
  quizType: 'kanaGrid' | 'vocabulary' | 'comprehensive'; // To know what to retry
  incorrectItems?: (JapaneseCharacter | VocabularyWord)[]; // Optional: list of items for review on results screen
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