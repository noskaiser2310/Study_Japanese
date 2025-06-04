import React, { useState, useRef, useCallback } from 'react';
import Button from './Button';

interface AudioRecorderProps {
  onRecordingComplete?: (audioBlob: Blob) => void;
  label?: string; // Label for the record button
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onRecordingComplete, label = "Ghi Âm" }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('API MediaDevices không được hỗ trợ trên trình duyệt này.');
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const completeBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(completeBlob);
        const url = URL.createObjectURL(completeBlob);
        setAudioUrl(url);
        if (onRecordingComplete) {
          onRecordingComplete(completeBlob);
        }
        // Release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setAudioBlob(null);
      setAudioUrl(null);
    } catch (err) {
      console.error("Lỗi khi bắt đầu ghi âm:", err);
      if (err instanceof Error && err.name === "NotAllowedError") {
        alert("Bạn đã từ chối quyền truy cập microphone. Vui lòng cho phép để sử dụng tính năng ghi âm.");
      } else {
        alert("Không thể truy cập microphone. Vui lòng kiểm tra quyền và thiết bị của bạn.");
      }
    }
  }, [onRecordingComplete]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  const handleToggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-2 my-2">
      <Button
        onClick={handleToggleRecording}
        icon={isRecording ? "fas fa-stop-circle" : "fas fa-microphone-alt"}
        variant={isRecording ? "primary" : "outline"}
        active={isRecording}
        className={`transition-all duration-300 ${isRecording ? 'animate-pulse ring-2 ring-red-400' : ''}`}
      >
        {isRecording ? "Dừng Ghi" : label}
      </Button>
      {audioUrl && (
        <audio controls src={audioUrl} className="max-w-full sm:max-w-xs h-10 rounded-md shadow-sm" />
      )}
    </div>
  );
};

export default AudioRecorder;
