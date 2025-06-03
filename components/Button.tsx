

import React from 'react';

interface ButtonProps {
  onClick?: () => void;
  children?: React.ReactNode; // Made children optional
  variant?: 'primary' | 'outline' | 'secondary';
  active?: boolean;
  icon?: string; // Font Awesome class e.g. "fas fa-play"
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  id?: string; // Added optional id prop
}

const Button: React.FC<ButtonProps> = ({ 
  onClick, 
  children, 
  variant = 'primary', 
  active = false, 
  icon,
  className = '',
  disabled = false,
  type = 'button',
  id, // Destructure id
}) => {
  let baseStyle = "py-2.5 px-4 rounded-lg font-semibold cursor-pointer transition-all duration-200 ease-in-out inline-flex items-center justify-center gap-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2";
  let variantStyle = "";

  if (disabled) {
    baseStyle += " opacity-50 cursor-not-allowed";
  } else {
     baseStyle += " hover:-translate-y-px hover:shadow-md active:translate-y-0";
  }

  if (variant === 'primary') {
    variantStyle = active || variant === 'primary' && !variant.includes('outline') // Default active for primary if not outline
      ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white border-transparent focus:ring-blue-500"
      : "bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50 focus:ring-blue-500";
       if (active) {
         variantStyle = "bg-gradient-to-br from-blue-600 to-purple-600 text-white border-transparent focus:ring-blue-500";
       }
  } else if (variant === 'outline') {
     variantStyle = active 
      ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white border-transparent focus:ring-blue-500" 
      : "bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50 hover:text-blue-700 focus:ring-blue-500";
  } else if (variant === 'secondary') {
    variantStyle = "bg-gradient-to-br from-green-500 to-green-700 text-white hover:from-green-600 hover:to-green-800 focus:ring-green-500";
  }
  
  // Special handling for primary button if it's also marked active
  if (variant === 'primary' && active) {
    variantStyle = "bg-gradient-to-br from-blue-600 to-purple-600 text-white border-transparent focus:ring-blue-500"
  }


  return (
    <button 
      id={id} // Pass id to the button element
      type={type}
      onClick={onClick} 
      className={`${baseStyle} ${variantStyle} ${className}`}
      disabled={disabled}
    >
      {icon && <i className={`${icon} ${variant === 'primary' && active ? 'text-white' : ''}`}></i>}
      {children}
    </button>
  );
};

export default Button;