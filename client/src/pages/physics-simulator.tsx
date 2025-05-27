import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProjectsSidebar } from "@/components/projects-sidebar";
import { GraphCanvas } from "@/components/graph-canvas";
import { DataInputPanel } from "@/components/data-input-panel";
import { SolutionModal } from "@/components/solution-modal";
import { PhysicsCalculator } from "@/lib/physics-calculator";
import { apiRequest } from "@/lib/queryClient";
import type { PhysicsProject, DataEntry, Force, SolutionStep } from "@/lib/physics-types";

interface PhysicsSimulatorProps {
  template: 'cartesian' | 'inclined';
  onBackToTemplates: () => void;
}

export function PhysicsSimulator({ template, onBackToTemplates }: PhysicsSimulatorProps) {
  const [currentProject, setCurrentProject] = useState<PhysicsProject | null>(null);
  const [solutionSteps, setSolutionSteps] = useState<SolutionStep[]>([]);
  const [showSolutionModal, setShowSolutionModal] = useState(false);
  const queryClient = useQueryClient();

  // Fetch projects
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['/api/projects'],
    select: (data: any[]) => data.filter(p => p.template === template) as PhysicsProject[]
  });

  // Create project mutation
  const createProjectMutation = useMutation({
    mutationFn: async (projectData: Partial<PhysicsProject>) => {
      const response = await apiRequest('POST', '/api/projects', projectData);
      return response.json();
    },
    onSuccess: (newProject) => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      setCurrentProject(newProject);
    }
  });

  // Update project mutation
  const updateProjectMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<PhysicsProject> }) => {
      const response = await apiRequest('PATCH', `/api/projects/${id}`, updates);
      return response.json();
    },
    onSuccess: (updatedProject) => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      setCurrentProject(updatedProject);
    }
  });

  // Delete project mutation
  const deleteProjectMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      if (currentProject && projects.length > 1) {
        const remainingProjects = projects.filter(p => p.id !== currentProject.id);
        setCurrentProject(remainingProjects[0] || null);
      } else {
        setCurrentProject(null);
      }
    }
  });

  // Auto-select first project or create initial one
  useEffect(() => {
    if (!isLoading && projects.length > 0 && !currentProject) {
      setCurrentProject(projects[0]);
    } else if (!isLoading && projects.length === 0) {
      handleNewProject();
    }
  }, [projects, isLoading, currentProject]);

  const handleNewProject = () => {
    const projectName = `Progetto ${projects.length + 1}`;
    createProjectMutation.mutate({
      name: projectName,
      template,
      dataEntries: [],
      forces: []
    });
  };

  const handleSelectProject = (project: PhysicsProject) => {
    setCurrentProject(project);
  };

  const handleDeleteProject = (id: number) => {
    if (confirm('Sei sicuro di voler eliminare questo progetto?')) {
      deleteProjectMutation.mutate(id);
    }
  };

  const handleAddData = (data: DataEntry) => {
    if (!currentProject) return;

    const updatedDataEntries = [...(currentProject.dataEntries || []), data];
    const updatedForces = data.type === 'force' 
      ? [...(currentProject.forces || []), data as Force]
      : currentProject.forces || [];

    updateProjectMutation.mutate({
      id: currentProject.id,
      updates: {
        dataEntries: updatedDataEntries,
        forces: updatedForces
      }
    });
  };

  const handleRemoveData = (dataId: number) => {
    if (!currentProject) return;

    const updatedDataEntries = (currentProject.dataEntries || []).filter(d => d.id !== dataId);
    const updatedForces = (currentProject.forces || []).filter(f => f.id !== dataId);

    updateProjectMutation.mutate({
      id: currentProject.id,
      updates: {
        dataEntries: updatedDataEntries,
        forces: updatedForces
      }
    });
  };

  const handleCalculateSolution = () => {
    if (!currentProject || !currentProject.dataEntries || currentProject.dataEntries.length === 0) {
      alert('Inserisci almeno un dato per procedere con la risoluzione');
      return;
    }

    const calculator = new PhysicsCalculator(currentProject.dataEntries);
    const steps = calculator.generateSolutionSteps();
    setSolutionSteps(steps);
    setShowSolutionModal(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white">Caricamento...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 grid grid-cols-12 gap-0">
      {/* Left Sidebar - Projects */}
      <div className="col-span-3">
        <ProjectsSidebar
          projects={projects}
          currentProject={currentProject}
          onSelectProject={handleSelectProject}
          onDeleteProject={handleDeleteProject}
          onNewProject={handleNewProject}
          onBackToTemplates={onBackToTemplates}
        />
      </div>

      {/* Center Area - Graph */}
      <div className="col-span-6">
        <GraphCanvas
          template={template}
          dataEntries={currentProject?.dataEntries || []}
          forces={currentProject?.forces || []}
        />
      </div>

      {/* Right Sidebar - Data Input */}
      <div className="col-span-3">
        <DataInputPanel
          dataEntries={currentProject?.dataEntries || []}
          onAddData={handleAddData}
          onRemoveData={handleRemoveData}
          onCalculateSolution={handleCalculateSolution}
        />
      </div>

      {/* Solution Modal */}
      <SolutionModal
        isOpen={showSolutionModal}
        onClose={() => setShowSolutionModal(false)}
        steps={solutionSteps}
      />
    </div>
  );
}
