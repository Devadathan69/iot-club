import React from 'react';
import { twMerge } from 'tailwind-merge';

export function Button({ className, variant = 'primary', size = 'md', ...props }) {
    const variants = {
        primary: 'bg-cyan-400 text-navy-900 hover:bg-cyan-300 focus:ring-cyan-400',
        secondary: 'bg-navy-700 text-slate-200 hover:bg-navy-600 focus:ring-navy-500',
        danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
        ghost: 'bg-transparent text-slate-400 hover:text-cyan-400 hover:bg-navy-800',
        outline: 'border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400/10'
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2',
        lg: 'px-6 py-3 text-lg',
        icon: 'p-2'
    };

    return (
        <button
            className={twMerge(
                'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-navy-900 disabled:opacity-50 disabled:cursor-not-allowed',
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        />
    );
}
