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
        <label className="mb-0.5 block font-['Chewy'] text-[0.72rem] font-medium text-[#824D1F] sm:text-[0.82rem]">
          {label}
        </label>
      )}
      <div className="relative">
        <Input
          type={isPassword && showPassword ? 'text' : type}
          className={cn(
            "h-9 w-full rounded-md border-[#824D1F]/60 bg-[#824D1F] pr-10 font-['Chewy'] text-xs text-[rgba(255,214,178,0.92)] sm:h-10 sm:text-sm",
            "focus:border-[#824D1F] focus:ring-[#824D1F]",
            "[&::placeholder]:text-[rgba(255,214,178,0.88)] [&::placeholder]:text-xs sm:[&::placeholder]:text-sm",
            className
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 appearance-none border-0 bg-transparent p-0 text-[rgba(255,214,178,0.88)] transition-colors hover:text-white focus:outline-none"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {toggleIconSrc ? (
              <img
                src={toggleIconSrc}
                alt=""
                className={cn("block h-4 w-4 object-contain sm:h-5 sm:w-5", showPassword && "opacity-70")}
                aria-hidden="true"
              />
            ) : showPassword ? (
              <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
            ) : (
              <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default AuthInput;
