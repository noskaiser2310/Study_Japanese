import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, Chat, GenerateContentResponse, Content } from "@google/genai"; // Ensure Content is imported if constructing complex prompts
import useLocalStorage from '../hooks/useLocalStorage';
import { UserData, ChatMessage } from '../types';
import Button from './Button';

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [userData, setUserData] = useLocalStorage<UserData>('userData', {});
  const chatMessagesContainerRef = useRef<HTMLDivElement>(null);
  const [apiKeyExists, setApiKeyExists] = useState(false);

  useEffect(() => {
    setApiKeyExists(!!process.env.API_KEY);
    if (process.env.API_KEY) {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const systemInstruction = `Bạn là 'Sensei AI', một trợ lý học tiếng Nhật thân thiện và hiểu biết. 
        Nhiệm vụ của bạn là giúp người dùng học tiếng Nhật. 
        Bạn có thể truy cập dữ liệu học tập của họ để đưa ra lời khuyên cá nhân hóa. 
        Dữ liệu người dùng bao gồm: 
        - Các mục họ đã làm sai (incorrectItems).
        - Các ký tự họ đã học (learnedChars).
        - Kết quả các bài kiểm tra (quizPerformances).
        - Chuỗi ngày học liên tục (studyStreak).
        Hãy khuyến khích, giải thích các khái niệm, và đưa ra các bài tập liên quan đến tiến trình và lỗi sai của họ. 
        Nếu được hỏi kiến thức chung, hãy cố gắng liên hệ với văn hóa hoặc ngôn ngữ Nhật Bản nếu có thể, nhưng chủ yếu tập trung vào vai trò gia sư ngôn ngữ. 
        Giữ câu trả lời ngắn gọn và rõ ràng. Sử dụng ví dụ tiếng Nhật (kèm Romaji và nghĩa tiếng Việt) khi hữu ích.
        Tuyệt đối không đề cập đến API KEY hay việc bạn là một mô hình ngôn ngữ lớn. Chỉ đóng vai Sensei AI.`;
        
        const newChat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: { systemInstruction },
            // Pass existing history from localStorage if available
            history: userData.chatHistory || [], 
        });
        setChatSession(newChat);
      } catch (error) {
        console.error("Lỗi khởi tạo Gemini Chat:", error);
        setApiKeyExists(false); // Ensure UI reflects error if API key is invalid during init
      }
    }
  }, [userData.chatHistory]); // Re-initialize if history changes externally (less likely here)


  useEffect(() => {
    if (chatMessagesContainerRef.current) {
      chatMessagesContainerRef.current.scrollTop = chatMessagesContainerRef.current.scrollHeight;
    }
  }, [userData.chatHistory, isLoading]);

  const prepareContextForGemini = (): string => {
    let context = "\nDữ liệu học tập của người dùng hiện tại:\n";
    if (userData.studyStreak) context += `- Chuỗi học: ${userData.studyStreak} ngày.\n`;
    if (userData.learnedChars && Object.keys(userData.learnedChars).length > 0) {
      context += `- Ký tự đã gặp: ${Object.keys(userData.learnedChars).slice(0, 10).join(', ')}...\n`;
    }
    if (userData.incorrectItems && Object.keys(userData.incorrectItems).length > 0) {
      const incorrectSummary = Object.values(userData.incorrectItems)
        .slice(0, 5)
        .map(item => ('char' in item ? item.char : item.kana))
        .join(', ');
      context += `- Các mục thường sai: ${incorrectSummary}...\n`;
    }
    if (userData.quizPerformances && userData.quizPerformances.length > 0) {
      const lastQuiz = userData.quizPerformances[userData.quizPerformances.length - 1];
      context += `- Kết quả kiểm tra gần nhất (${lastQuiz.quizType}): ${lastQuiz.score}/${lastQuiz.total}.\n`;
    }
    if (context === "\nDữ liệu học tập của người dùng hiện tại:\n") {
      return "\n(Chưa có nhiều dữ liệu học tập của người dùng.)\n";
    }
    return context;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !chatSession || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', parts: [{ text: inputValue }], timestamp: Date.now() };
    setUserData(prev => ({ ...prev, chatHistory: [...(prev.chatHistory || []), userMessage] }));
    setInputValue('');
    setIsLoading(true);

    try {
      // Construct the message content, potentially adding context implicitly through history
      // or explicitly if needed (though system prompt + history should handle much of it)
      const contextString = prepareContextForGemini();
      const fullPrompt = `${inputValue}\n${contextString}`; // Send current query + context summary
      
      // console.log("Sending to Gemini with context:", fullPrompt); // For debugging

      const stream = await chatSession.sendMessageStream({ message: fullPrompt }); // Send fullPrompt as the user's message

      let modelResponseText = '';
      // Add a placeholder for model's response immediately
      const modelMessagePlaceholder: ChatMessage = { role: 'model', parts: [{ text: '...' }], timestamp: Date.now() };
      setUserData(prev => ({ ...prev, chatHistory: [...(prev.chatHistory || []), modelMessagePlaceholder] }));

      for await (const chunk of stream) { // chunk is GenerateContentResponse
        modelResponseText += chunk.text;
        // Update the last message (model's response) in chatHistory
        setUserData(prev => {
          const updatedHistory = [...(prev.chatHistory || [])];
          if (updatedHistory.length > 0 && updatedHistory[updatedHistory.length - 1].role === 'model') {
            updatedHistory[updatedHistory.length - 1] = { role: 'model', parts: [{ text: modelResponseText }], timestamp: Date.now() };
          }
          return { ...prev, chatHistory: updatedHistory };
        });
      }
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn tới Gemini:", error);
      const errorMessage: ChatMessage = { role: 'model', parts: [{ text: "Xin lỗi, đã có lỗi xảy ra khi kết nối với Sensei AI." }], timestamp: Date.now() };
      setUserData(prev => ({ ...prev, chatHistory: [...(prev.chatHistory || []), errorMessage] }));
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleChat = () => setIsOpen(!isOpen);

  if (!apiKeyExists) {
    return (
      <div className="fixed bottom-5 right-5 z-[100]">
        <Button onClick={toggleChat} icon="fas fa-comments" variant="primary" className="rounded-full !p-4 shadow-lg">
          <span className="sr-only">Mở Chat</span>
        </Button>
        {isOpen && (
           <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[90]" onClick={() => setIsOpen(false)}>
            <div className="absolute bottom-20 right-5 w-full max-w-md bg-white rounded-xl shadow-2xl flex flex-col h-[70vh] sm:h-[600px]" onClick={e => e.stopPropagation()}>
                 <div className="p-4 border-b text-center">
                    <h3 className="text-lg font-semibold text-red-600">Lỗi API Key</h3>
                 </div>
                 <div className="p-6 text-center text-slate-700">
                    <p>API Key cho Gemini chưa được cấu hình hoặc không hợp lệ.</p>
                    <p>Vui lòng kiểm tra lại cài đặt biến môi trường <code>API_KEY</code>.</p>
                    <p className="mt-4 text-xs text-slate-500">Chatbot sẽ không hoạt động nếu không có API Key hợp lệ.</p>
                 </div>
            </div>
           </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="fixed bottom-5 right-5 z-[100]">
        <Button 
            onClick={toggleChat} 
            icon={isOpen ? "fas fa-times" : "fas fa-comments"} 
            variant="primary" 
            className="rounded-full !p-4 shadow-lg text-xl"
            aria-label={isOpen ? "Đóng Chat" : "Mở Chat với Sensei AI"}
        >
          <span className="sr-only">{isOpen ? "Đóng Chat" : "Mở Chat với Sensei AI"}</span>
        </Button>
      </div>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[90]" 
          onClick={() => setIsOpen(false)} // Close on overlay click
        >
          <div 
            className="absolute bottom-0 sm:bottom-20 right-0 sm:right-5 w-full sm:max-w-md bg-white rounded-t-xl sm:rounded-xl shadow-2xl flex flex-col h-[80vh] sm:h-[calc(100vh-10rem)] max-h-[700px]"
            onClick={e => e.stopPropagation()} // Prevent closing when clicking inside chat window
            role="dialog"
            aria-modal="true"
            aria-labelledby="chatbot-title"
          >
            <header className="p-4 border-b flex justify-between items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-xl sm:rounded-t-lg">
              <h3 id="chatbot-title" className="text-lg font-semibold">Chat với Sensei AI</h3>
              <Button onClick={() => setIsOpen(false)} icon="fas fa-times" className="!p-2 text-white hover:bg-white/20" aria-label="Đóng chat"/>
            </header>

            <div ref={chatMessagesContainerRef} className="flex-grow p-4 overflow-y-auto space-y-3 bg-slate-50">
              {(userData.chatHistory || []).map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-2.5 rounded-xl shadow ${msg.role === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-slate-200 text-slate-800 rounded-bl-none'}`}>
                    {msg.parts.map((part, i) => <p key={i} className="whitespace-pre-wrap break-words">{part.text}</p>)}
                    {msg.timestamp && <div className={`text-xs mt-1 ${msg.role === 'user' ? 'text-blue-200' : 'text-slate-500'} text-right`}>{new Date(msg.timestamp).toLocaleTimeString()}</div>}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] p-2.5 rounded-lg shadow bg-slate-200 text-slate-800">
                    <p className="italic">Sensei AI đang soạn tin...</p>
                  </div>
                </div>
              )}
            </div>

            <footer className="p-3 border-t bg-white">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                  placeholder="Nhập tin nhắn..."
                  className="flex-grow p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  disabled={isLoading}
                />
                <Button onClick={handleSendMessage} disabled={isLoading || !inputValue.trim()} icon="fas fa-paper-plane" variant="primary" className="!px-4 !py-2.5">
                  Gửi
                </Button>
              </div>
            </footer>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
