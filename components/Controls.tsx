
import React from 'react';
import { CharacterScriptType } from '../types';
import Button from './Button';

interface ControlsProps {
  selectedScriptType: CharacterScriptType;
  onSelectScriptType: (type: CharacterScriptType) => void;
  onStart: () => void;
  onPause: () => void;
  onPrev: () => void;
  onNext: () => void;
  isRotating: boolean;
}

const ScriptTypeButton: React.FC<{
    type: CharacterScriptType;
    currentType: CharacterScriptType;
    onClick: (type: CharacterScriptType) => void;
    label: string;
    icon: string;
}> = ({ type, currentType, onClick, label, icon }) => {
    const isActive = type === currentType;
    return (
        <Button
            onClick={() => onClick(type)}
            variant={isActive ? 'primary' : 'outline'}
            active={isActive}
            icon={icon}
            className="flex-grow sm:flex-grow-0"
        >
            {label}
        </Button>
    );
};


const Controls: React.FC<ControlsProps> = ({
  selectedScriptType,
  onSelectScriptType,
  onStart,
  onPause,
  onPrev,
  onNext,
  isRotating,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6 sm:mb-8">
      <div className="bg-white rounded-2xl shadow-lg p-5">
        <h3 className="text-lg font-bold text-blue-600 mb-3 flex items-center gap-2">
          <i className="fas fa-font bg-gradient-to-br from-blue-600 to-purple-600 text-transparent bg-clip-text"></i>
          Chọn Bảng Chữ Cái
        </h3>
        <div className="flex flex-wrap gap-2.5">
          <ScriptTypeButton type={CharacterScriptType.All} currentType={selectedScriptType} onClick={onSelectScriptType} label="Tất cả" icon="fas fa-globe" />
          <ScriptTypeButton type={CharacterScriptType.Hiragana} currentType={selectedScriptType} onClick={onSelectScriptType} label="Hiragana" icon="fas fa-j" />
          <ScriptTypeButton type={CharacterScriptType.Katakana} currentType={selectedScriptType} onClick={onSelectScriptType} label="Katakana" icon="fas fa-k" />
          <ScriptTypeButton type={CharacterScriptType.Kanji} currentType={selectedScriptType} onClick={onSelectScriptType} label="Kanji" icon="fas fa-scroll" />
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-5">
        <h3 className="text-lg font-bold text-blue-600 mb-3 flex items-center gap-2">
          <i className="fas fa-cogs bg-gradient-to-br from-blue-600 to-purple-600 text-transparent bg-clip-text"></i>
          Điều Khiển Học Tập
        </h3>
        <div className="flex flex-wrap gap-2.5">
          <Button onClick={onStart} disabled={isRotating} icon="fas fa-play" variant="primary" className="flex-grow sm:flex-grow-0">Bắt đầu</Button>
          <Button onClick={onPause} disabled={!isRotating} icon="fas fa-pause" variant="outline" className="flex-grow sm:flex-grow-0">Tạm dừng</Button>
          <Button onClick={onPrev} icon="fas fa-arrow-left" variant="outline" className="flex-grow sm:flex-grow-0">Trước</Button>
          <Button onClick={onNext} icon="fas fa-arrow-right" variant="outline" className="flex-grow sm:flex-grow-0">Tiếp</Button>
        </div>
      </div>
    </div>
  );
};

export default Controls;
