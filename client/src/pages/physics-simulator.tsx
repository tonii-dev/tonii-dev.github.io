import { useState, useEffect } from "react";
import { ProjectsSidebar } from "@/components/projects-sidebar";
import { GraphCanvas } from "@/components/graph-canvas";
import { DataInputPanel } from "@/components/data-input-panel";
import { SolutionModal } from "@/components/solution-modal";
import { CalculationSelectionModal } from "@/components/calculation-selection-modal";
import { PhysicsCalculator } from "@/lib/physics-calculator";
import { localProjectStorage } from "@/lib/storage";
import type { PhysicsProject, DataEntry, Force, SolutionStep } from "@/lib/physics-types";

interface PhysicsSimulatorProps {
  template: 'cartesian' | 'inclined';
  onBackToTemplates: () => void;
}

export function PhysicsSimulator({ template, onBackToTemplates }: PhysicsSimulatorProps) {
  const [currentProject, setCurrentProject] = useState<PhysicsProject | null>(null);
  const [solutionSteps, setSolutionSteps] = useState<SolutionStep[]>([]);
  const [showSolutionModal, setShowSolutionModal] = useState(false);
  const [showCalculationModal, setShowCalculationModal] = useState(false);
  const [projects, setProjects] = useState<PhysicsProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load projects from localStorage
  useEffect(() => {
    const loadProjects = () => {
      const allProjects = localProjectStorage.getProjectsByTemplate(template);
      setProjects(allProjects);
      setIsLoading(false);
      
      // Auto-select first project or create initial one
      if (allProjects.length > 0 && !currentProject) {
        setCurrentProject(allProjects[0]);
      } else if (allProjects.length === 0) {
        handleNewProject();
      }
    };
    
    loadProjects();
  }, [template, currentProject]);

  const handleNewProject = () => {
    const projectName = `Progetto ${projects.length + 1}`;
    const newProject = localProjectStorage.createProject({
      name: projectName,
      template,
      dataEntries: [],
      forces: []
    });
    
    setProjects(localProjectStorage.getProjectsByTemplate(template));
    setCurrentProject(newProject);
  };

  const handleSelectProject = (project: PhysicsProject) => {
    setCurrentProject(project);
  };

  const handleDeleteProject = (id: number) => {
    if (confirm('Sei sicuro di voler eliminare questo progetto?')) {
      localProjectStorage.deleteProject(id);
      const updatedProjects = localProjectStorage.getProjectsByTemplate(template);
      setProjects(updatedProjects);
      
      if (currentProject && currentProject.id === id) {
        setCurrentProject(updatedProjects[0] || null);
      }
    }
  };

  const handleAddData = (data: DataEntry) => {
    if (!currentProject) return;

    const updatedDataEntries = [...(currentProject.dataEntries || []), data];
    const updatedForces = data.type === 'force' 
      ? [...(currentProject.forces || []), data as Force]
      : currentProject.forces || [];

    const updatedProject = localProjectStorage.updateProject(currentProject.id, {
      dataEntries: updatedDataEntries,
      forces: updatedForces
    });

    if (updatedProject) {
      setCurrentProject(updatedProject);
      setProjects(localProjectStorage.getProjectsByTemplate(template));
    }
  };

  const handleRemoveData = (dataId: number) => {
    if (!currentProject) return;

    const updatedDataEntries = (currentProject.dataEntries || []).filter(d => d.id !== dataId);
    const updatedForces = (currentProject.forces || []).filter(f => f.id !== dataId);

    const updatedProject = localProjectStorage.updateProject(currentProject.id, {
      dataEntries: updatedDataEntries,
      forces: updatedForces
    });

    if (updatedProject) {
      setCurrentProject(updatedProject);
      setProjects(localProjectStorage.getProjectsByTemplate(template));
    }
  };

  const handleCalculateSolution = () => {
    if (!currentProject || !currentProject.dataEntries || currentProject.dataEntries.length === 0) {
      alert('Inserisci almeno un dato per procedere con la risoluzione');
      return;
    }

    setShowCalculationModal(true);
  };

  const handleSelectCalculation = (calculationId: string) => {
    if (!currentProject || !currentProject.dataEntries) return;

    const calculator = new PhysicsCalculator(currentProject.dataEntries);
    const steps = calculator.generateSolutionSteps(calculationId);
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

      {/* Calculation Selection Modal */}
      <CalculationSelectionModal
        isOpen={showCalculationModal}
        onClose={() => setShowCalculationModal(false)}
        dataEntries={currentProject?.dataEntries || []}
        onSelectCalculation={handleSelectCalculation}
      />

      {/* Solution Modal */}
      <SolutionModal
        isOpen={showSolutionModal}
        onClose={() => setShowSolutionModal(false)}
        steps={solutionSteps}
      />
    </div>
  );
}
