// src/pages/Projects.tsx
import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Project as ProjectType } from '../types';

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [newProjectName, setNewProjectName] = useState<string>('');
  const [newProjectAddress, setNewProjectAddress] = useState<string>('');
  const [isCreating, setIsCreating] = useState<boolean>(false);

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
      
      const { data } = await api.post('/api/projects', projectData);
      
      if (data.status) {
        setNewProjectName('');
        setNewProjectAddress('');
        await fetchProjects(); // Recarregar a lista
      } else {
        setError(data.message || 'Erro ao criar projeto');
      }
    } catch (err: any) {
      console.error('Erro ao criar projeto:', err);
      setError(err.response?.data?.message || 'Falha ao criar projeto');
    } finally {
      setIsCreating(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Cadastro de Projetos</h1>
        <p>Carregando projetos...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Cadastro de Projetos ({projects.length})</h1>
      
      {/* Formulário de criação */}
      <form onSubmit={handleCreateProject} style={{ 
        marginBottom: '30px', 
        padding: '20px', 
        border: '1px solid #ddd', 
        borderRadius: '5px',
        backgroundColor: '#f9f9f9'
      }}>
        <h3>Criar Novo Projeto</h3>
        
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="obra-name" style={{ display: 'block', marginBottom: '5px' }}>
            Nome do Projeto *
          </label>
          <input
            id="obra-name"
            type="text"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            placeholder="Digite o nome do projeto"
            style={{ 
              width: '100%', 
              padding: '8px', 
              border: '1px solid #ccc', 
              borderRadius: '3px' 
            }}
            disabled={isCreating}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="obra-address" style={{ display: 'block', marginBottom: '5px' }}>
            Endereço
          </label>
          <input
            id="obra-address"
            type="text"
            value={newProjectAddress}
            onChange={(e) => setNewProjectAddress(e.target.value)}
            placeholder="Digite o endereço do projeto"
            style={{ 
              width: '100%', 
              padding: '8px', 
              border: '1px solid #ccc', 
              borderRadius: '3px' 
            }}
            disabled={isCreating}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={isCreating || !newProjectName.trim()}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '3px',
            cursor: isCreating ? 'not-allowed' : 'pointer',
            opacity: isCreating ? 0.6 : 1
          }}
        >
          {isCreating ? 'Criando...' : 'Criar Projeto'}
        </button>
      </form>

      {error && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#f8d7da', 
          color: '#721c24', 
          border: '1px solid #f5c6cb', 
          borderRadius: '3px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <button onClick={fetchProjects}>Atualizar Lista</button>
      </div>

      {/* Lista de obras */}
      <div style={{ display: 'grid', gap: '10px' }}>
        {projects.map((project) => (
          <div 
            key={project.id} 
            style={{ 
              border: '1px solid #ddd', 
              padding: '15px', 
              borderRadius: '5px',
              backgroundColor: '#f9f9f9'
            }}
          >
            <h3>{project.name}</h3>
            {project.address && (
              <p><strong>Endereço:</strong> {project.address}</p>
            )}
            <p><strong>Criado em:</strong> {project.createdAt instanceof Date ? project.createdAt.toLocaleDateString('pt-BR') : new Date(project.createdAt).toLocaleDateString('pt-BR')}</p>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <p style={{ textAlign: 'center', color: '#666' }}>
          Nenhum projeto encontrado
        </p>
      )}
    </div>
  );
};

export { Projects };