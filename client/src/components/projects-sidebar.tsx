import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, ArrowLeft, FileText } from "lucide-react";
import { motion } from "framer-motion";
import type { PhysicsProject } from "@/lib/physics-types";

interface ProjectsSidebarProps {
  projects: PhysicsProject[];
  currentProject: PhysicsProject | null;
  onSelectProject: (project: PhysicsProject) => void;
  onDeleteProject: (id: number) => void;
  onNewProject: () => void;
  onBackToTemplates: () => void;
}

export function ProjectsSidebar({
  projects,
  currentProject,
  onSelectProject,
  onDeleteProject,
  onNewProject,
  onBackToTemplates
}: ProjectsSidebarProps) {
  return (
    <div className="h-full bg-slate-900 border-r border-slate-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white">I Miei Progetti</h3>
          <Button
            onClick={onNewProject}
            size="sm"
            className="w-8 h-8 p-0 bg-red-500 hover:bg-red-600 text-white"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <Button
          onClick={onBackToTemplates}
          variant="outline"
          className="w-full bg-slate-800 border-slate-600 text-white hover:bg-slate-700 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Cambia Template
        </Button>
      </div>

      {/* Projects List */}
      <div className="flex-1 p-4 overflow-y-auto">
        {projects.length === 0 ? (
          <div className="text-center text-slate-400 py-8">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Nessun progetto creato</p>
          </div>
        ) : (
          <div className="space-y-3">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    currentProject?.id === project.id
                      ? 'border-red-500 bg-slate-800'
                      : 'border-slate-600 bg-slate-800/50 hover:bg-slate-800/80'
                  }`}
                  onClick={() => onSelectProject(project)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-white truncate">
                          {project.name}
                        </h4>
                        <p className="text-xs text-slate-400">
                          {project.template === 'cartesian' ? 'Piano Cartesiano' : 'Piano Inclinato'}
                        </p>
                        <p className="text-xs text-slate-500">
                          {project.dataEntries?.length || 0} dati inseriti
                        </p>
                      </div>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteProject(project.id);
                        }}
                        size="sm"
                        variant="ghost"
                        className="w-6 h-6 p-0 hover:bg-red-500/20 text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
