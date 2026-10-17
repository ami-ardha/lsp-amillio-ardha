'use client';

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  isDisabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, variant = 'primary', isDisabled = false }) => {
  const baseClasses = "font-bold py-2 px-4 rounded";
  const variantClasses = variant === 'primary'
    ? "bg-blue-500 hover:bg-blue-700 text-white"
    : variant === 'secondary'
    ? "bg-gray-300 hover:bg-gray-400 text-black"
    : variant === 'danger'
    ? "bg-red-500 hover:bg-red-700 text-white"
    : "bg-green-500 hover:bg-green-700 text-white";

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={isDisabled}
    >
      {children}
    </button>
  );
};

export default Button;