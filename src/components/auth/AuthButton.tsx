import React from 'react';
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
    <button
      type={props.type ?? 'button'}
      className={cn(
        "inline-flex h-[4.4cqh] w-full items-center justify-center whitespace-nowrap border-0 px-[2.4cqh] py-[0.45cqh] font-['Chewy'] text-[2.1cqh] text-white outline-none appearance-none",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      style={{
        fontFamily: "'Chewy', cursive",
        fontStyle: 'normal',
        fontWeight: 400,
        lineHeight: '90%',
        textAlign: 'center',
        color: '#FFFFFF',
        background: '#B35300',
        boxShadow: '0px 3px 4px #8E3B11, inset 0px -5px 9.7px rgba(0, 0, 0, 0.21)',
        borderRadius: '7.28451px',
      }}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-[0.8cqh]">
          <svg className="h-[2cqh] w-[2cqh] animate-spin" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
          Loading...
        </span>
      ) : children}
    </button>
  );
};

export default AuthButton;
