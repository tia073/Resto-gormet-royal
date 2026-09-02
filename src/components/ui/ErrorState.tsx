import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = "Une erreur est survenue lors du chargement des données.",
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-rose-50/50 border border-rose-200 rounded-xl max-w-md mx-auto my-6 shadow-sm">
      <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 mb-3 border border-rose-200">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold font-serif-title text-[#1A1A1A] mb-1">Attention</h3>
      <p className="text-xs text-stone-600 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Réessayer
        </button>
      )}
    </div>
  );
};
