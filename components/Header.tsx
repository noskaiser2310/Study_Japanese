
import React from 'react';

const Header: React.FC = () => {
  return (
    <div className="text-center py-6 bg-white rounded-2xl shadow-xl mb-6 sm:mb-8">
      <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text mb-2">
        <i className="fas fa-graduation-cap mr-2 text-blue-600"></i>
        Hệ thống Học Tiếng Nhật Nâng cao
      </h1>
      <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto px-4">
        Phương pháp học bảng chữ cái tiếng Nhật hiệu quả với hệ thống thông minh giúp ghi nhớ lâu dài
      </p>
    </div>
  );
};

export default Header;
