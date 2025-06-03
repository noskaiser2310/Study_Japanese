
import React from 'react';
import { VocabularyWord, VocabularyQuestionType, QuizResultType } from '../../types';
import Button from '../Button';

interface VocabularyQuizProps {
  currentWord: VocabularyWord | null;
  questionType: VocabularyQuestionType | '';
  options: (VocabularyWord | { translation_vi: string, id: string })[]; // Options can be full words or just translations for MCQ
  onAnswer: (selectedOption: VocabularyWord | { translation_vi: string, id: string }) => void;
  onNextQuestion: () => void;
  resultText: string;
  resultType: QuizResultType;
  isDisabled: boolean;
}

const VocabularyQuizComponent: React.FC<VocabularyQuizProps> = ({
  currentWord,
  questionType,
  options,
  onAnswer,
  onNextQuestion,
  resultText,
  resultType,
  isDisabled,
}) => {
  if (!currentWord) {
    return <div className="text-center p-8 text-slate-600">Đang tải câu hỏi từ vựng...</div>;
  }

  const getQuestionPrompt = () => {
    if (questionType === VocabularyQuestionType.KanaToMeaning) {
      return (
        <>
          Nghĩa của từ{' '}
          <span className="font-noto-jp text-3xl sm:text-4xl font-bold text-purple-600 mx-1">
            「{currentWord.kana}」
          </span>{' '}
          ({currentWord.romaji}) là gì?
        </>
      );
    }
    if (questionType === VocabularyQuestionType.MeaningToKana) {
      return (
        <>
          Từ tiếng Nhật nào có nghĩa là{' '}
          <span className="text-2xl sm:text-3xl font-bold text-green-600 mx-1">
            "{currentWord.translation_vi}"
          </span>
          ?
        </>
      );
    }
    return "Đang tải câu hỏi...";
  };

  const renderOptionButton = (option: VocabularyWord | { translation_vi: string, id: string }, index: number) => {
    const isSelectedOption = isDisabled && 
      ( ('kana' in option && currentWord && option.kana === currentWord.kana && questionType === VocabularyQuestionType.MeaningToKana) || // This check logic might need refinement if IDs are not stable for "selected" comparison
        (!('kana' in option) && currentWord && option.translation_vi === currentWord.translation_vi && questionType === VocabularyQuestionType.KanaToMeaning) );
        // A better way for `isSelectedOption` would be to store the user's actual clicked option's content/ID.
        // For now, this highlights the correct answer after submission.

    let isCorrectAnswer = false;
    if (questionType === VocabularyQuestionType.KanaToMeaning) {
        isCorrectAnswer = !('kana' in option) && option.translation_vi === currentWord.translation_vi;
    } else { // MeaningToKana
        isCorrectAnswer = 'kana' in option && option.id === currentWord.id;
    }
    
    let buttonClass = "quiz-option-btn w-full h-auto min-h-[60px] sm:min-h-[70px] text-base sm:text-lg font-noto-jp flex items-center justify-center gap-2 py-3 px-2 transition-all duration-200";
    let iconClass = "";

    if (isDisabled) { // After an answer is submitted
      if (isCorrectAnswer) { // This is the correct option
        buttonClass += " bg-green-500 text-white border-green-700 ring-4 ring-green-300 shadow-lg";
        iconClass = "fas fa-check-circle text-xl";
      } else if (resultType === 'incorrect' && 
                 ( ('kana' in option && option.kana === (options.find(o => o.id === currentWord.id) as VocabularyWord)?.kana ) || // If this option was chosen and it's wrong
                   (!('kana' in option) && option.translation_vi === (options.find(o => o.id === currentWord.id || o.id.startsWith(currentWord.id)) as {translation_vi:string})?.translation_vi )
                 )
                ) { 
          // This condition to highlight the *user's incorrect choice* is tricky without knowing what they picked.
          // Simplified: if this is NOT the correct answer, and the overall result was incorrect, style as plain/disabled.
          // For now, only highlighting the correct answer green, and if selected + incorrect red.
          // Let's assume `onAnswer` passes the *actual selected option* for comparison later.
          // The current `resultType` applies to the *question*, not the *option*.
          // This part of styling (marking the user's *wrong* choice red) requires storing the selected choice.
          // For now, we only mark the *correct* answer clearly. Other incorrect options will be plain.
        buttonClass += " border-slate-300 bg-slate-100 text-slate-500 opacity-60 cursor-not-allowed";
      } else { // Other non-correct options
        buttonClass += " border-slate-300 bg-slate-100 text-slate-500 opacity-60 cursor-not-allowed";
      }
    } else { // Before answer
      buttonClass += " bg-white text-blue-600 border-2 border-blue-500 hover:bg-blue-50 hover:border-blue-600 hover:shadow-md active:scale-95";
    }

    return (
      <Button
        key={option.id + '-' + index} // ensure key is unique for re-renders
        onClick={() => onAnswer(option)}
        className={buttonClass}
        disabled={isDisabled}
        variant='outline'
      >
        {iconClass && <i className={`${iconClass} mr-1`}></i>}
        {'kana' in option ? option.kana : option.translation_vi}
        {'kana' in option && <span className="text-xs text-slate-400 ml-1">({option.romaji})</span>}
      </Button>
    );
  };


  let resultIconClass = "";
  if (resultType === 'correct') resultIconClass = "fas fa-check-circle text-green-500 mr-2 text-2xl";
  if (resultType === 'incorrect') resultIconClass = "fas fa-times-circle text-red-500 mr-2 text-2xl";

  return (
    <div className="text-center">
      <h3 className="text-lg sm:text-xl text-slate-700 mb-6 min-h-[60px] flex items-center justify-center">
        {getQuestionPrompt()}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 my-6">
        {options.map((opt, index) => renderOptionButton(opt, index))}
      </div>

      <div className="flex justify-center mt-6">
        <Button
          onClick={onNextQuestion}
          icon="fas fa-arrow-right"
          variant="secondary"
          aria-label="Câu hỏi tiếp theo"
          className="text-lg py-3 px-6"
          disabled={!isDisabled && options.length > 0} // Enable next only after an answer or if no options
        >
          Câu Tiếp Theo
        </Button>
      </div>
      
      {resultText && (
        <div className={`text-center text-xl sm:text-2xl font-semibold min-h-[40px] my-6 flex items-center justify-center
          ${resultType === 'correct' ? 'text-green-600' : ''}
          ${resultType === 'incorrect' ? 'text-red-600' : ''}
        `}
        aria-live="polite"
        >
          {resultIconClass && <i className={resultIconClass}></i>}
          <span className="ml-1">{resultText}</span>
        </div>
      )}
    </div>
  );
};

export default VocabularyQuizComponent;

