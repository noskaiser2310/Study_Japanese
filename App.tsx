import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Navigation from './components/Navigation'; 
import HomePage from './pages/HomePage';
import StudyPage from './pages/StudyPage';
import TestPage from './pages/TestPage';

const App: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Navigation />
      <main className="container max-w-5xl mx-auto py-5 sm:py-8 flex-grow">
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/study" element={<StudyPage />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="*" element={<Navigate to="/home" replace />} /> {/* Fallback to home */}
        </Routes>
      </main>
      <footer className="text-center mt-auto py-4 sm:py-6 text-slate-500 text-xs sm:text-sm">
        <p>Hệ thống học tiếng Nhật nâng cao • Sử dụng kỹ thuật lặp lại ngắt quãng để tối ưu hóa trí nhớ</p>
        <p>&copy; {new Date().getFullYear()} - Phát triển bởi AI</p>
      </footer>
    </div>
  );
};

export default App;