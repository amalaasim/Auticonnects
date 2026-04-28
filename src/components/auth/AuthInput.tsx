import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  toggleIconSrc?: string;
}

const AuthInput: React.FC<AuthInputProps> = ({ label, className, type, toggleIconSrc, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="w-full">
      {label && (
        <label
          className="mb-[0.45cqh] block font-['Chewy'] text-[1.9cqh] leading-tight"
          style={{
            fontFamily: "'Chewy', cursive",
            fontStyle: 'normal',
            fontWeight: 400,
            color: '#B76D2D',
            mixBlendMode: 'multiply',
            textShadow: '0px -1.09611px 4.38444px #FFCB8F',
          }}
        >
          {label}
        </label>
      )}
      <div className="relative">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background: '#824D1F',
            mixBlendMode: 'multiply',
            boxShadow: '0px -1.09611px 4.38444px #FFCB8F, inset 0px 4.38444px 4.38444px rgba(0, 0, 0, 0.25)',
            borderRadius: '7.98462px',
          }}
        />
        <Input
          type={isPassword && showPassword ? 'text' : type}
          className={cn(
            "relative h-[4.8cqh] w-full rounded-md border-0 bg-transparent pr-[5.2cqh] font-['Chewy'] text-[2.3cqh] text-[rgba(255,158,89,0.74)]",
            "focus:border-0 focus:ring-0",
            "[&::placeholder]:text-[rgba(255,158,89,0.5)] [&::placeholder]:text-[1.9cqh]",
            className
          )}
          style={{
            fontFamily: "'Chewy', cursive",
            fontStyle: 'normal',
            fontWeight: 400,
            lineHeight: '90%',
            color: 'rgba(255, 158, 89, 0.74)',
          }}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-[1.2cqh] top-1/2 -translate-y-1/2 appearance-none border-0 bg-transparent p-0 text-[rgba(255,214,178,0.88)] transition-colors hover:text-white focus:outline-none"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {toggleIconSrc ? (
              <img
                src={toggleIconSrc}
                alt=""
                className={cn("block h-[2.3cqh] w-[2.3cqh] object-contain", showPassword && "opacity-70")}
                aria-hidden="true"
              />
            ) : showPassword ? (
              <EyeOff className="h-[2.3cqh] w-[2.3cqh]" />
            ) : (
              <Eye className="h-[2.3cqh] w-[2.3cqh]" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default AuthInput;
