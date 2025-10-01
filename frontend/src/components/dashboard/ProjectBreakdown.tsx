import React from 'react';
import { ProjectBreakdown as ProjectBreakdownType } from '../../types';
import { formatCurrency } from '../../utils/format';

interface ProjectBreakdownProps {
  readonly projects: ProjectBreakdownType[];
  readonly loading?: boolean;
  readonly onProjectClick?: (projectId: string) => void;
}

export const ProjectBreakdown: React.FC<ProjectBreakdownProps> = ({
  projects,
  loading = false,
  onProjectClick
}) => {
  const handleProjectClick = (projectId: string): void => {
    onProjectClick?.(projectId);
  };

  if (loading) {
    return (
      <div className="project-breakdown">
        <div className="project-breakdown__loading">
          <i className="fas fa-spinner fa-spin" />
          <span>Carregando projetos...</span>
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="project-breakdown">
        <div className="project-breakdown__empty">
          <i className="fas fa-building" />
          <span>Nenhum projeto encontrado</span>
        </div>
      </div>
    );
  }

  return (
    <div className="project-breakdown">
      <div className="project-breakdown__header">
        <h3>Gastos por Projeto</h3>
        <span className="project-breakdown__count">
          {projects.length} projetos
        </span>
      </div>
      
      <div className="project-breakdown__content">
        {projects.map(project => (
          <div
            key={project.projectId}
            className="project-breakdown__item"
            onClick={() => handleProjectClick(project.projectId)}
          >
            <div className="project-breakdown__item-header">
              <h4 className="project-breakdown__item-name">
                {project.projectName}
              </h4>
              <div className="project-breakdown__item-total">
                {formatCurrency(project.amount)}
              </div>
            </div>
            
            <div className="project-breakdown__item-details">
              <span className="project-breakdown__item-invoices">
                {project.invoices} notas fiscais
              </span>
              <span className="project-breakdown__item-average">
                Média: {formatCurrency(project.amount / project.invoices)}
              </span>
            </div>
            
            {project.monthlyBreakdown.length > 0 && (
              <div className="project-breakdown__monthly">
                <div className="project-breakdown__monthly-header">
                  <span>Gastos Mensais</span>
                </div>
                <div className="project-breakdown__monthly-list">
                  {project.monthlyBreakdown.slice(0, 3).map(month => (
                    <div key={month.month} className="project-breakdown__monthly-item">
                      <span className="project-breakdown__monthly-month">
                        {month.month}
                      </span>
                      <span className="project-breakdown__monthly-amount">
                        {formatCurrency(month.amount)}
                      </span>
                    </div>
                  ))}
                  {project.monthlyBreakdown.length > 3 && (
                    <div className="project-breakdown__monthly-more">
                      +{project.monthlyBreakdown.length - 3} meses
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
