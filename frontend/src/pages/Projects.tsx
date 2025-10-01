// src/pages/Projects.tsx
import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Project as ProjectType } from '../types';
import './Projects.css';

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [newProjectName, setNewProjectName] = useState<string>('');
  const [newProjectAddress, setNewProjectAddress] = useState<string>('');
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [projectToDelete, setProjectToDelete] = useState<ProjectType | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async (): Promise<void> => {
    try {
      setLoading(true);
      setError('');
      
      const { data } = await api.get('/api/projects');
      
      if (data.status && Array.isArray(data.data)) {
        setProjects(data.data);
      } else {
        setError('Erro ao carregar projetos');
      }
    } catch (err) {
      console.error('Erro ao buscar projetos:', err);
      setError('Falha ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!newProjectName.trim()) {
      setError('Nome do projeto é obrigatório');
      return;
    }

    try {
      setIsCreating(true);
      setError('');
      
      const projectData = {
        name: newProjectName.trim(),
        address: newProjectAddress.trim() || undefined
      };
      
      console.log('Enviando dados do projeto:', projectData);
      console.log('Token no localStorage:', localStorage.getItem('loginToken'));
      
      const { data } = await api.post('/api/projects', projectData);
      
      console.log('Resposta da API:', data);
      
      if (data.status) {
        setNewProjectName('');
        setNewProjectAddress('');
        await fetchProjects(); // Recarregar a lista
      } else {
        setError(data.message || 'Erro ao criar projeto');
      }
    } catch (err: any) {
      console.error('Erro ao criar projeto:', err);
      console.error('Response data:', err.response?.data);
      console.error('Response status:', err.response?.status);
      setError(err.response?.data?.message || 'Falha ao criar projeto');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteProject = (project: ProjectType): void => {
    setProjectToDelete(project);
    setShowDeleteModal(true);
  };

  const confirmDeleteProject = async (): Promise<void> => {
    if (!projectToDelete) return;

    setIsDeleting(true);
    setError('');

    try {
      const { data } = await api.delete(`/api/projects/${projectToDelete.id}`);
      
      if (data.status) {
        // Atualizar lista de projetos
        await fetchProjects();
      } else {
        setError(data.message || 'Erro ao deletar projeto');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Erro ao deletar projeto');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setProjectToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="projects-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Carregando projetos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="projects-container">
      <div className="projects-content">
        <div className="projects-header">
          <h1>Cadastro de Projetos</h1>
          <div className="projects-count">
            {projects.length} {projects.length === 1 ? 'projeto' : 'projetos'}
          </div>
        </div>
        
        {/* Formulário de criação */}
        <div className="create-project-section">
          <h3>
            <i className="fas fa-plus"></i>
            Criar Novo Projeto
          </h3>
          
          <form onSubmit={handleCreateProject}>
            <div className="create-project-form">
              <div className="form-group">
                <label htmlFor="obra-name">
                  <i className="fas fa-building-columns"></i>
                  Nome do Projeto *
                </label>
                <input
                  id="obra-name"
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="Digite o nome do projeto"
                  disabled={isCreating}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="obra-address">
                  <i className="fas fa-map-marker-alt"></i>
                  Endereço
                </label>
                <input
                  id="obra-address"
                  type="text"
                  value={newProjectAddress}
                  onChange={(e) => setNewProjectAddress(e.target.value)}
                  placeholder="Digite o endereço do projeto"
                  disabled={isCreating}
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={isCreating || !newProjectName.trim()}
              className="create-button"
            >
              <i className="fas fa-plus"></i>
              {isCreating ? 'Criando...' : 'Criar Projeto'}
            </button>
          </form>
        </div>

        {error && (
          <div className="error-message">
            <i className="fas fa-exclamation-triangle"></i>
            {error}
          </div>
        )}

        <div className="actions-bar">
          <button onClick={fetchProjects} className="refresh-button">
            <i className="fas fa-sync-alt"></i>
            Atualizar Lista
          </button>
        </div>

        {/* Lista de projetos */}
        {projects.length > 0 ? (
          <div className="projects-grid">
            {projects.map((project) => (
              <div key={project.id} className="project-card">
                <div className="project-header">
                  <div className="project-icon">
                    <i className="fas fa-building-columns"></i>
                  </div>
                  <h3 className="project-title">{project.name}</h3>
                  <button
                    type="button"
                    onClick={() => handleDeleteProject(project)}
                    className="delete-project-btn"
                    title="Excluir projeto"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                
                <div className="project-details">
                  <div className="project-detail">
                    <i className="fas fa-calendar-alt"></i>
                    <span>Criado em: {project.createdAt instanceof Date ? project.createdAt.toLocaleDateString('pt-BR') : new Date(project.createdAt).toLocaleDateString('pt-BR')}</span>
                  </div>
                  
                  {project.address && (
                    <div className="project-detail">
                      <i className="fas fa-map-marker-alt"></i>
                      <span>Endereço:</span>
                    </div>
                  )}
                  
                  {project.address && (
                    <div className="project-address">
                      {project.address}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">
              <i className="fas fa-building-columns"></i>
            </div>
            <h3>Nenhum projeto encontrado</h3>
            <p>Crie seu primeiro projeto para começar</p>
          </div>
        )}
      </div>

      {/* Modal de confirmação para deletar projeto */}
      {showDeleteModal && projectToDelete && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirmar Exclusão</h3>
              <button
                type="button"
                className="modal-close"
                onClick={() => setShowDeleteModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <p>Tem certeza que deseja excluir o projeto <strong>"{projectToDelete.name}"</strong>?</p>
              <p className="warning-text">Esta ação não pode ser desfeita.</p>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="cancel-button"
                onClick={() => setShowDeleteModal(false)}
              >
                <i className="fas fa-times"></i>
                Cancelar
              </button>
              <button
                type="button"
                className="delete-button"
                onClick={confirmDeleteProject}
                disabled={isDeleting}
              >
                <i className="fas fa-trash"></i>
                {isDeleting ? 'Excluindo...' : 'Excluir Projeto'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { Projects };