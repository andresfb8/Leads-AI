import * as React from 'react';
import { cn } from '@/src/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'destructive';
  className?: string;
  children?: React.ReactNode;
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded px-2 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        {
          'bg-slate-100 text-slate-700': variant === 'default',
          'bg-slate-100 text-slate-900': variant === 'secondary',
          'border border-slate-200 text-slate-950': variant === 'outline',
          'bg-emerald-50 text-emerald-700': variant === 'success',
          'bg-orange-50 text-orange-700': variant === 'warning',
          'bg-red-50 text-red-700': variant === 'destructive',
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
