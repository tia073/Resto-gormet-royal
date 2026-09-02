import React from 'react';
import { LucideIcon, PackageOpen } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon = PackageOpen,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-[#E5E1D8] max-w-lg mx-auto my-6 shadow-sm">
      <div className="w-16 h-16 rounded-full bg-[#F5F2ED] flex items-center justify-center text-[#C5A059] mb-4 border border-[#E5E1D8]">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold font-serif-title text-[#1A1A1A] mb-2">{title}</h3>
      {description && <p className="text-sm text-stone-500 mb-6 max-w-sm">{description}</p>}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center px-6 py-3 rounded-md bg-[#C5A059] hover:bg-[#B38E47] text-white font-bold text-xs uppercase tracking-widest transition-all shadow-sm active:scale-95"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
