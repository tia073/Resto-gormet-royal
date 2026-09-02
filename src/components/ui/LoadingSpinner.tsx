import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  label = 'Chargement en cours...',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3 text-[#C5A059]">
      <Loader2 className={`animate-spin ${sizeClasses[size]}`} />
      {label && <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">{label}</p>}
    </div>
  );
};
