import React, { ReactNode } from 'react';

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  footer?: ReactNode;
  hover?: boolean;
  variant?: 'default' | 'bordered' | 'elevated';
  titleClassName?: string;
}

const Card: React.FC<CardProps> = ({
  title,
  children,
  className = '',
  footer,
  hover = false,
  variant = 'default',
  titleClassName = '',
}) => {
  const variantClasses = {
    default: 'bg-card border shadow-sm',
    bordered: 'bg-card border-2 border-primary/10 shadow-sm',
    elevated: 'bg-card border shadow-md',
  };

  return (
    <div
      className={`
        ${variantClasses[variant]} rounded-xl overflow-hidden
        ${hover ? 'hover:shadow-xl transition-all hover:shadow-md' : ''}
        ${className}
      `}
    >
      {title && (
        <div className={`border-b px-6 py-4 ${titleClassName}`}>
          <h3 className="text-lg font-semibold leading-6 text-card-foreground">{title}</h3>
        </div>
      )}
      <div className="px-6 py-5">{children}</div>
      {footer && (
        <div className="bg-accent/30 px-6 py-4 rounded-b-xl border-t flex justify-end">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
