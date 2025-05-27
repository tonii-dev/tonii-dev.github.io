import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
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
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}

export default App;
