import React, { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

export const Input = forwardRef(({ className, label, error, ...props }, ref) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                    {label}
                </label>
            )}
            <input
                ref={ref}
                className={twMerge(
                    'w-full rounded-lg bg-gray-50 dark:bg-navy-900 border border-gray-300 dark:border-navy-600 text-gray-900 dark:text-slate-100 placeholder-gray-500 focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan focus:shadow-[0_0_15px_rgba(0,243,255,0.3)] transition-all duration-300 sm:text-sm p-2.5',
                    error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
                    className
                )}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-500">{error.message}</p>
            )}
        </div>
    );
});

Input.displayName = 'Input';
