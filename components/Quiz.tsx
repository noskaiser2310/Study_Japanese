
import React from 'react';
import { JapaneseCharacter, ComprehensiveQuestionType, QuizResultType } from '../types';
import Button from './Button';

interface QuizProps {
  comprehensiveQuizCharData: JapaneseCharacter | null;
  comprehensiveQuestionType: ComprehensiveQuestionType | '';
  comprehensiveOptions: JapaneseCharacter[];
  onComprehensiveMCQAnswer: (selectedChar: string) => void;
  onNextComprehensiveQuestion: () => void;
  quizInputValue: string; 
  onQuizInputChange: (value: string) => void;
  onCheckAnswer: () => void;
  quizResultText: string;
  quizResultType: QuizResultType;
  isQuizInputDisabled: boolean;
  inputRef?: React.RefObject<HTMLInputElement>;
  showNextButtonHighlight?: boolean;
  onMarkIncorrect?: (charData: JapaneseCharacter) => void;
}

const Quiz: React.FC<QuizProps> = ({
  comprehensiveQuizCharData,
  comprehensiveQuestionType,
  comprehensiveOptions,
  onComprehensiveMCQAnswer,
  onNextComprehensiveQuestion,
  quizInputValue,
  onQuizInputChange,
  onCheckAnswer,
  quizResultText,
  quizResultType,
  isQuizInputDisabled,
  inputRef,
  showNextButtonHighlight,
  // onMarkIncorrect is called by parent (TestPage)
}) => {

  const handleInputKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !isQuizInputDisabled) {
      if (comprehensiveQuestionType === ComprehensiveQuestionType.CharToRomaji) {
        onCheckAnswer();
      }
    }
  };
  
  const getQuizPrompt = () => {
    if (comprehensiveQuizCharData) {
      if (comprehensiveQuestionType === ComprehensiveQuestionType.CharToRomaji) {
        return (
            <>
                Nhập Romaji cho: 
                <span className="font-noto-jp text-5xl sm:text-7xl font-bold text-purple-600 ml-2">
                    {comprehensiveQuizCharData.char}
                </span>
            </>
        );
      }
      if (comprehensiveQuestionType === ComprehensiveQuestionType.RomajiToChar) {
        const romajiPart = comprehensiveQuizCharData.romaji.split('(')[0].trim().split('/')[0].trim();
        return `Chọn ký tự cho Romaji: "${romajiPart}"`;
      }
    }
    return "Đang tải câu hỏi...";
  };

  const renderQuizContent = () => {
    if (comprehensiveQuestionType === ComprehensiveQuestionType.RomajiToChar && comprehensiveQuizCharData) {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 my-5 sm:my-6">
          {comprehensiveOptions.map((opt) => {
            const isSelected = isQuizInputDisabled && opt.char === quizInputValue;
            const isCorrectAnswer = opt.char === comprehensiveQuizCharData!.char;
            
            let buttonClass = "quiz-option-btn w-full h-24 sm:h-28 text-2xl sm:text-3xl font-noto-jp flex items-center justify-center gap-2 py-4 px-2 transition-all duration-200";
            let iconClass = "";

            if (isQuizInputDisabled) {
              if (isSelected) {
                if (isCorrectAnswer) {
                  buttonClass += " bg-green-500 text-white border-green-700 ring-4 ring-green-300 shadow-lg hover:bg-green-600";
                  iconClass = "fas fa-check-circle text-xl";
                } else {
                  buttonClass += " bg-red-500 text-white border-red-700 ring-4 ring-red-300 shadow-lg hover:bg-red-600";
                  iconClass = "fas fa-times-circle text-xl";
                }
              } else if (isCorrectAnswer) {
                buttonClass += " bg-green-100 text-green-700 border-2 border-green-500 ring-2 ring-green-200 opacity-80"; 
                iconClass = "fas fa-check-circle text-xl text-green-600";
              } else {
                buttonClass += " border-slate-300 bg-slate-100 text-slate-500 opacity-60 cursor-not-allowed";
              }
            } else {
              buttonClass += " bg-white text-blue-600 border-2 border-blue-500 hover:bg-blue-50 hover:border-blue-600 hover:shadow-md active:scale-95";
            }

            return (
              <Button
                key={`${opt.char}-${opt.type}-${opt.romaji}`}
                onClick={() => onComprehensiveMCQAnswer(opt.char)}
                className={buttonClass}
                disabled={isQuizInputDisabled}
                variant='outline' 
              >
                {iconClass && <i className={`${iconClass} mr-1`}></i>}
                {opt.char}
              </Button>
            );
          })}
        </div>
      );
    }
    
    let inputBorderClass = "border-sky-400 focus:border-blue-600 focus:ring-blue-400";
    if (isQuizInputDisabled) {
        if (quizResultType === 'correct') {
            inputBorderClass = "border-green-500 ring-2 ring-green-300 bg-green-50 text-green-700 font-semibold";
        } else if (quizResultType === 'incorrect') {
            inputBorderClass = "border-red-500 ring-2 ring-red-300 bg-red-50 text-red-700 font-semibold";
        }
    }

    return (
      <input
        ref={inputRef}
        type="text"
        id="quizInput"
        className={`w-full p-4 text-xl sm:text-2xl border-2 rounded-xl text-center my-5 sm:my-6 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 ${inputBorderClass}`}
        placeholder="Nhập Romaji tại đây..."
        value={quizInputValue}
        onChange={(e) => onQuizInputChange(e.target.value)}
        onKeyPress={handleInputKeyPress}
        disabled={isQuizInputDisabled} 
        aria-label="Quiz input for Romaji"
        autoComplete="off"
        autoCapitalize="none"
        spellCheck="false"
      />
    );
  };
  
  let resultIconClass = "";
  if (quizResultType === 'correct') resultIconClass = "fas fa-check-circle text-green-500 mr-2 text-2xl";
  if (quizResultType === 'incorrect') resultIconClass = "fas fa-times-circle text-red-500 mr-2 text-2xl";

  let nextButtonClassName = "text-lg py-3 px-6";
  if (showNextButtonHighlight) {
    nextButtonClassName += " animate-pulse ring-2 ring-offset-2 ring-green-400";
  }

  return (
    <div> {/* Container for Quiz, styling will be in TestPage.tsx */}
      <h2 className="text-xl sm:text-2xl font-bold text-blue-600 mb-5 sm:mb-6 flex items-center gap-2">
        <i className="fas fa-question-circle bg-gradient-to-br from-blue-600 to-purple-600 text-transparent bg-clip-text text-2xl"></i>
        Kiểm tra Kiến thức
      </h2>

      <div className="text-center text-slate-700 text-lg sm:text-xl mb-4 min-h-[60px] sm:min-h-[80px] flex flex-col items-center justify-center leading-tight">
        {getQuizPrompt()}
      </div>

      {renderQuizContent()}

      <div className="flex flex-wrap justify-center gap-3 mt-5 sm:mt-6">
        {comprehensiveQuestionType === ComprehensiveQuestionType.CharToRomaji && (
          <Button 
            onClick={onCheckAnswer}
            disabled={isQuizInputDisabled || !quizInputValue.trim()} 
            icon="fas fa-check" 
            variant="primary"
            aria-label="Kiểm tra câu trả lời"
            className="text-lg py-3 px-6"
          >
            Kiểm tra
          </Button>
        )}
        <Button 
            onClick={onNextComprehensiveQuestion} 
            icon="fas fa-arrow-right" 
            variant="secondary"
            aria-label="Câu hỏi tiếp theo"
            className={nextButtonClassName}
        >
          Câu Tiếp Theo
        </Button>
      </div>

      <div className={`text-center text-xl sm:text-2xl font-semibold min-h-[40px] my-5 sm:my-6 flex items-center justify-center
        ${quizResultType === 'correct' ? 'text-green-600' : ''}
        ${quizResultType === 'incorrect' ? 'text-red-600' : ''}
      `}
      aria-live="polite"
      >
        {quizResultText && resultIconClass && <i className={resultIconClass}></i>}
        <span className="ml-1">{quizResultText}</span>
      </div>
    </div>
  );
};

export default Quiz;
