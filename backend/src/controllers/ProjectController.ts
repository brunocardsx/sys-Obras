import { Request, Response } from 'express';
import { Project } from '../models/Project';
import { sendSuccess, sendValidationError, sendNotFoundError, sendConflictError, sendInternalError } from '../utils/response';
import { validateRequest } from '../utils/validation';
import { createProjectSchema, updateProjectSchema } from '../utils/validation';
import { CreateProjectRequest } from '../types';
import { logger } from '../utils/logger';

export const createProject = async (req: Request, res: Response): Promise<void> => {
  const validation = validateRequest(createProjectSchema, req.body);
  
  if (!validation.isValid) {
    sendValidationError(res, validation.error);
    return;
  }
  
  const projectData = validation.data as CreateProjectRequest;
  
  try {
    const existingProject = await Project.findOne({
      where: { name: projectData.name }
    });
    
    if (existingProject) {
      sendConflictError(res, 'Project with this name already exists');
      return;
    }
    
    // Generate a unique code based on the project name
    const generateProjectCode = (name: string): string => {
      const cleanName = name
        .toUpperCase()
        .replace(/[^A-Z0-9\s]/g, '')
        .replace(/\s+/g, '_')
        .substring(0, 10);
      
      const timestamp = Date.now().toString().slice(-4);
      return `${cleanName}_${timestamp}`;
    };
    
    const projectCode = generateProjectCode(projectData.name);
    
    const project = await Project.create({
      ...projectData,
      code: projectCode
    });
    sendSuccess(res, project, 'Project created successfully');
  } catch (error) {
    logger.error('Error creating project:', error);
    sendInternalError(res);
  }
};

export const getProjects = async (_req: Request, res: Response): Promise<void> => {
  try {
    const projects = await Project.findAll({
      order: [['name', 'ASC']]
    });
    
    sendSuccess(res, projects);
  } catch (error) {
    logger.error('Error fetching projects:', error);
    sendInternalError(res);
  }
};

export const getProjectById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  
  if (!id) {
    sendValidationError(res, 'Invalid project ID');
    return;
  }
  
  try {
    const project = await Project.findByPk(id);
    
    if (!project) {
      sendNotFoundError(res, 'Project not found');
      return;
    }
    
    sendSuccess(res, project);
  } catch (error) {
    logger.error('Error fetching project:', error);
    sendInternalError(res);
  }
};

export const updateProject = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  
  if (!id) {
    sendValidationError(res, 'Invalid project ID');
    return;
  }
  
  const validation = validateRequest(updateProjectSchema, req.body);
  
  if (!validation.isValid) {
    sendValidationError(res, validation.error);
    return;
  }
  
  const updateData = validation.data as Partial<CreateProjectRequest>;
  
  try {
    const project = await Project.findByPk(id);
    
    if (!project) {
      sendNotFoundError(res, 'Project not found');
      return;
    }
    
    if (updateData.name && updateData.name !== project.name) {
      const existingProject = await Project.findOne({
        where: { name: updateData.name }
      });
      
      if (existingProject) {
        sendConflictError(res, 'Project with this name already exists');
        return;
      }
    }
    
    await project.update(updateData);
    await project.reload();
    
    sendSuccess(res, project, 'Project updated successfully');
  } catch (error) {
    logger.error('Error updating project:', error);
    sendInternalError(res);
  }
};

export const deleteProject = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  
  if (!id) {
    sendValidationError(res, 'Invalid project ID');
    return;
  }
  
  try {
    const project = await Project.findByPk(id);
    
    if (!project) {
      sendNotFoundError(res, 'Project not found');
      return;
    }
    
    await project.destroy();
    sendSuccess(res, null, `Project "${project.name}" deleted successfully`);
  } catch (error) {
    logger.error('Error deleting project:', error);
    
    if (error instanceof Error && error.message.includes('foreign key constraint')) {
      sendConflictError(res, 'This project cannot be deleted as it is associated with one or more invoices');
      return;
    }
    
    sendInternalError(res);
  }
};
