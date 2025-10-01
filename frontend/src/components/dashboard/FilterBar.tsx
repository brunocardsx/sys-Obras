import React from 'react';

interface FilterBarProps {
  readonly projects: Array<{ readonly id: string; readonly name: string }>;
  readonly selectedProject: string;
  readonly onProjectChange: (projectId: string) => void;
  readonly startDate: string;
  readonly onStartDateChange: (date: string) => void;
  readonly endDate: string;
  readonly onEndDateChange: (date: string) => void;
  readonly onClearFilters: () => void;
  readonly loading?: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  projects,
  selectedProject,
  onProjectChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  onClearFilters,
  loading = false
}) => {
  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    onProjectChange(e.target.value);
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    onStartDateChange(e.target.value);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    onEndDateChange(e.target.value);
  };

  const handleClearFilters = (): void => {
    onClearFilters();
  };

  return (
    <div className="filter-bar">
      <div className="filter-bar__group">
        <label htmlFor="project-filter" className="filter-bar__label">
          Projeto
        </label>
        <select
          id="project-filter"
          className="filter-bar__select"
          value={selectedProject}
          onChange={handleProjectChange}
          disabled={loading}
        >
          <option value="">Todos os projetos</option>
          {projects.map(project => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-bar__group">
        <label htmlFor="start-date-filter" className="filter-bar__label">
          Data Inicial
        </label>
        <input
          id="start-date-filter"
          type="date"
          className="filter-bar__input"
          value={startDate}
          onChange={handleStartDateChange}
          disabled={loading}
        />
      </div>

      <div className="filter-bar__group">
        <label htmlFor="end-date-filter" className="filter-bar__label">
          Data Final
        </label>
        <input
          id="end-date-filter"
          type="date"
          className="filter-bar__input"
          value={endDate}
          onChange={handleEndDateChange}
          disabled={loading}
        />
      </div>

      <div className="filter-bar__actions">
        <button
          type="button"
          className="filter-bar__button filter-bar__button--clear"
          onClick={handleClearFilters}
          disabled={loading}
        >
          <i className="fas fa-times" />
          Limpar
        </button>
      </div>
    </div>
  );
};
