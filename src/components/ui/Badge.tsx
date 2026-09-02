import React from 'react';
import { OrderStatus, ReservationStatus } from '../../types/restaurant';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'gold' | 'success' | 'warning' | 'danger' | 'info' | 'purple';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  className = '',
}) => {
  const variantStyles = {
    default: 'bg-[#F5F2ED] text-stone-700 border-[#E5E1D8]',
    gold: 'bg-[#C5A059]/10 text-[#C5A059] border-[#C5A059]/30 font-semibold',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    info: 'bg-sky-50 text-sky-700 border-sky-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
  };

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-0.5',
    md: 'text-sm px-3 py-1',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border whitespace-nowrap ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};

export const OrderStatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
  const config: Record<OrderStatus, { label: string; variant: BadgeProps['variant'] }> = {
    pending: { label: 'En attente', variant: 'warning' },
    confirmed: { label: 'Confirmée', variant: 'info' },
    preparing: { label: 'En préparation', variant: 'purple' },
    ready: { label: 'Prête', variant: 'gold' },
    completed: { label: 'Terminée', variant: 'success' },
    cancelled: { label: 'Annulée', variant: 'danger' },
  };

  const item = config[status] || { label: status, variant: 'default' };
  return <Badge variant={item.variant}>{item.label}</Badge>;
};

export const ReservationStatusBadge: React.FC<{ status: ReservationStatus }> = ({ status }) => {
  const config: Record<ReservationStatus, { label: string; variant: BadgeProps['variant'] }> = {
    pending: { label: 'En attente', variant: 'warning' },
    confirmed: { label: 'Confirmée', variant: 'success' },
    cancelled: { label: 'Annulée', variant: 'danger' },
    completed: { label: 'Honorée', variant: 'default' },
  };

  const item = config[status] || { label: status, variant: 'default' };
  return <Badge variant={item.variant}>{item.label}</Badge>;
};
