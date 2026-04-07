import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'link';
  loading?: boolean;
}

const AuthButton: React.FC<AuthButtonProps> = ({ 
  children, 
  variant = 'primary', 
  loading = false,
  className,
  ...props 
}) => {
  if (variant === 'link') {
    return (
      <button
        className={cn(
          "text-amber-800 hover:text-amber-600 underline text-sm font-medium transition-colors",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }

  return (
    <Button
      className={cn(
        "h-9 w-full rounded-md bg-[#824D1F] px-6 py-2 font-['Chewy'] text-xs font-bold text-white shadow-lg sm:h-10 sm:text-sm",
        "transform hover:scale-105 transition-all duration-200",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
        className
      )}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
          Loading...
        </span>
      ) : children}
    </Button>
  );
};

export default AuthButton;
