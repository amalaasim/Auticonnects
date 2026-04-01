import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const AuthInput: React.FC<AuthInputProps> = ({ label, className, type, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium mb-1 text-yellow-700">
          {label}
        </label>
      )}
      <div className="relative">
        <Input
          type={isPassword && showPassword ? 'text' : type}
          className={cn(
            "w-full bg-yellow-800 border-amber-700/50 text-[rgba(255,158,89,0.74)] pr-10",
            "focus:border-amber-600 focus:ring-amber-500",
            "rounded-md h-10",
            "[&::placeholder]:text-[rgba(255,158,89,0.74)] [&::placeholder]:text-xl",
            className
          )}
          style={{ fontSize: '1.5rem' }}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[rgba(255,158,89,0.74)] text-2xl hover:text-white transition-colors focus:outline-none"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default AuthInput;
