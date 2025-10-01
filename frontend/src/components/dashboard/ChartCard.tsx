import React from 'react';

interface ChartCardProps {
  readonly title: string;
  readonly children: React.ReactNode;
  readonly actions?: React.ReactNode;
  readonly className?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  children,
  actions,
  className = ''
}) => {
  return (
    <div className={`chart-card ${className}`}>
      <div className="chart-card__header">
        <h3 className="chart-card__title">{title}</h3>
        {actions && (
          <div className="chart-card__actions">
            {actions}
          </div>
        )}
      </div>
      <div className="chart-card__content">
        {children}
      </div>
    </div>
  );
};
