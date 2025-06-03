import React from 'react';
import { NavLink } from 'react-router-dom';

const Navigation: React.FC = () => {
  const getLinkClass = ({ isActive }: { isActive: boolean }): string => {
    return `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out
            ${isActive 
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md' 
              : 'text-slate-700 hover:bg-sky-100 hover:text-blue-600'
            }`;
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 mb-6 sm:mb-8">
      <div className="container max-w-5xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex items-center justify-center h-16">
          <div className="flex items-center">
            <div className="flex space-x-2 sm:space-x-4">
              <NavLink to="/home" className={getLinkClass}>
                <i className="fas fa-home mr-1 sm:mr-2"></i>Trang Chủ
              </NavLink>
              <NavLink to="/study" className={getLinkClass}>
                <i className="fas fa-book-open mr-1 sm:mr-2"></i>Học Tập
              </NavLink>
              <NavLink to="/test" className={getLinkClass}>
                <i className="fas fa-vial mr-1 sm:mr-2"></i>Kiểm Tra
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;