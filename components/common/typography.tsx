import React from 'react';

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
}

export const Typography = ({ children, className }: TypographyProps) => {
  return <div className={className + ' mt-0.5'}>{children}</div>;
};
