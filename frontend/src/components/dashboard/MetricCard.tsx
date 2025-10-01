import React from 'react';

interface MetricCardProps {
  readonly title: string;
  readonly value: string | number;
  readonly icon: React.ReactNode;
  readonly color: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  readonly trend?: {
    readonly value: number;
    readonly isPositive: boolean;
  };
  readonly subtitle?: string;
}

const colorClasses = {
  primary: 'metric-card--primary',
  secondary: 'metric-card--secondary',
  success: 'metric-card--success',
  warning: 'metric-card--warning',
  danger: 'metric-card--danger',
};

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  color,
  trend,
  subtitle
}) => {
  return (
    <div className={`metric-card ${colorClasses[color]}`}>
      <div className="metric-card__header">
        <div className="metric-card__icon">
          {icon}
        </div>
        <div className="metric-card__content">
          <h3 className="metric-card__title">{title}</h3>
          <div className="metric-card__value">{value}</div>
          {subtitle && (
            <div className="metric-card__subtitle">{subtitle}</div>
          )}
        </div>
      </div>
      {trend && (
        <div className={`metric-card__trend ${trend.isPositive ? 'trend--positive' : 'trend--negative'}`}>
          <i className={`fas fa-arrow-${trend.isPositive ? 'up' : 'down'}`} />
          <span>{Math.abs(trend.value)}%</span>
        </div>
      )}
    </div>
  );
};
