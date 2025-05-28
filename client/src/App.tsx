import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TemplateSelection } from "@/pages/template-selection";
import { PhysicsSimulator } from "@/pages/physics-simulator";

function App() {
  const [selectedTemplate, setSelectedTemplate] = useState<'cartesian' | 'inclined' | null>(null);

  const handleSelectTemplate = (template: 'cartesian' | 'inclined') => {
    setSelectedTemplate(template);
  };

  const handleBackToTemplates = () => {
    setSelectedTemplate(null);
  };

  return (
    <TooltipProvider>
      <Toaster />
      {selectedTemplate ? (
        <PhysicsSimulator
          template={selectedTemplate}
          onBackToTemplates={handleBackToTemplates}
        />
      ) : (
        <TemplateSelection onSelectTemplate={handleSelectTemplate} />
      )}
    </TooltipProvider>
  );
}

export default App;
