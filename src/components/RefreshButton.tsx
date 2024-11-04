import React from 'react';
import { RotateCw } from 'lucide-react';

interface RefreshButtonProps {
  onClick: () => void;
  loading?: boolean;
  className?: string;
}

export function RefreshButton({ onClick, loading = false, className = '' }: RefreshButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`p-2 rounded-full hover:bg-white/5 transition-all duration-300 transform ${
        loading ? 'cursor-not-allowed' : 'hover:scale-110'
      } ${className}`}
      title="Refresh Data"
    >
      <RotateCw
        className={`w-5 h-5 transition-all duration-300 ${
          loading
            ? 'text-purple-400 animate-[spin_1s_linear_infinite]'
            : 'text-gray-400'
        }`}
      />
    </button>
  );
}