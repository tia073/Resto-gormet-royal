import React, { useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { persistOAuthError } from '../../lib/oauth';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface AuthCallbackViewProps {
  onSuccess: () => void;
  onError: () => void;
}

export const AuthCallbackView: React.FC<AuthCallbackViewProps> = ({ onSuccess, onError }) => {
  const { completeOAuthCallback } = useAuth();
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    let cancelled = false;

    const finish = async () => {
      const result = await completeOAuthCallback();
      if (cancelled) return;

      if (result.error) {
        persistOAuthError(result.error);
        onError();
        return;
      }

      onSuccess();
    };

    void finish();

    return () => {
      cancelled = true;
    };
  }, [completeOAuthCallback, onError, onSuccess]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <LoadingSpinner label="Connexion Google en cours..." />
    </div>
  );
};
