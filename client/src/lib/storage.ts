import type { PhysicsProject, DataEntry, Force } from './physics-types';

export interface LocalStorageProject {
  id: number;
  name: string;
  template: 'cartesian' | 'inclined';
  dataEntries: DataEntry[];
  forces: Force[];
  createdAt: string;
}

export class LocalProjectStorage {
  private storageKey = 'physics-simulator-projects';
  private currentIdKey = 'physics-simulator-current-id';

  private getCurrentId(): number {
    const id = window.localStorage.getItem(this.currentIdKey);
    return id ? parseInt(id) : 1;
  }

  private setCurrentId(id: number): void {
    window.localStorage.setItem(this.currentIdKey, id.toString());
  }

  getAllProjects(): LocalStorageProject[] {
    try {
      const projects = window.localStorage.getItem(this.storageKey);
      return projects ? JSON.parse(projects) : [];
    } catch {
      return [];
    }
  }

  getProject(id: number): LocalStorageProject | undefined {
    const projects = this.getAllProjects();
    return projects.find(p => p.id === id);
  }

  createProject(project: Omit<LocalStorageProject, 'id' | 'createdAt'>): LocalStorageProject {
    const projects = this.getAllProjects();
    const id = this.getCurrentId();
    
    const newProject: LocalStorageProject = {
      ...project,
      id,
      createdAt: new Date().toISOString()
    };

    projects.push(newProject);
    window.localStorage.setItem(this.storageKey, JSON.stringify(projects));
    this.setCurrentId(id + 1);
    
    return newProject;
  }

  updateProject(id: number, updates: Partial<Omit<LocalStorageProject, 'id' | 'createdAt'>>): LocalStorageProject | undefined {
    const projects = this.getAllProjects();
    const index = projects.findIndex(p => p.id === id);
    
    if (index === -1) return undefined;
    
    projects[index] = { ...projects[index], ...updates };
    window.localStorage.setItem(this.storageKey, JSON.stringify(projects));
    
    return projects[index];
  }

  deleteProject(id: number): boolean {
    const projects = this.getAllProjects();
    const filteredProjects = projects.filter(p => p.id !== id);
    
    if (filteredProjects.length === projects.length) return false;
    
    window.localStorage.setItem(this.storageKey, JSON.stringify(filteredProjects));
    return true;
  }

  getProjectsByTemplate(template: 'cartesian' | 'inclined'): LocalStorageProject[] {
    return this.getAllProjects()
      .filter(p => p.template === template)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}

export const localProjectStorage = new LocalProjectStorage();