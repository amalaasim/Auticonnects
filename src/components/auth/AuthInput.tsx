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
        <label className="mb-[0.45cqh] block font-['Chewy'] text-[2.1cqh] font-medium text-[#824D1F] leading-tight">
          {label}
        </label>
      )}
      <div className="relative">
        <Input
          type={isPassword && showPassword ? 'text' : type}
          className={cn(
            "h-[4.8cqh] w-full rounded-md border-[#824D1F]/60 bg-[#824D1F] pr-[5.2cqh] font-['Chewy'] text-[2.3cqh] text-[rgba(255,214,178,0.92)]",
            "focus:border-[#824D1F] focus:ring-[#824D1F]",
            "[&::placeholder]:text-[rgba(255,214,178,0.88)] [&::placeholder]:text-[1.9cqh]",
            className
          )}
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
