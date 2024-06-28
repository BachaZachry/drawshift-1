import clsx, { type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cx(...args: ClassValue[]) {
  return twMerge(clsx(...args));
}

// Tremor Raw focusInput [v0.0.1]

export const focusInput = [
  // base
  'focus:ring-[0.5px]',
  // ring color
  'focus:ring-emerald-600/20',
  // border color
  'focus:border-emerald-600',
];

// Tremor Raw hasErrorInput [v0.0.1]

export const hasErrorInput = [
  // base
  'ring-[0.5px]',
  // border color
  'border-red-500 dark:border-red-900/30',
  // ring color
  'ring-red-200 dark:ring-red-900/30',
];

// Tremor Raw focusRing [v0.0.1]

export const focusRing = [
  // base
  'outline outline-offset-2 outline-0 focus-visible:outline-2',
  // outline color
  'outline-emerald-600/20',
];

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
