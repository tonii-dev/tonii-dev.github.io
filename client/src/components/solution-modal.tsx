import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import type { SolutionStep } from "@/lib/physics-types";

interface SolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  steps: SolutionStep[];
}

export function SolutionModal({ isOpen, onClose, steps }: SolutionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-purple-400">
            Risoluzione del Problema
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <Card className="bg-slate-800/50 border-slate-600">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-lg mb-3 text-purple-400">
                    Passo {index + 1}: {step.title}
                  </h4>
                  <p className="text-slate-300 mb-3 leading-relaxed">
                    {step.content}
                  </p>
                  
                  {step.formula && (
                    <div className="bg-slate-900 p-4 rounded border border-slate-600 mb-3">
                      <p className="text-sm text-slate-400 mb-2">Formula:</p>
                      <code className="font-mono text-green-400 text-lg">
                        {step.formula}
                      </code>
                    </div>
                  )}
                  
                  {step.calculation && (
                    <div className="bg-slate-900 p-4 rounded border border-slate-600 mb-3">
                      <p className="text-sm text-slate-400 mb-2">Calcolo:</p>
                      <pre className="font-mono text-blue-400 text-sm whitespace-pre-wrap">
                        {step.calculation}
                      </pre>
                    </div>
                  )}
                  
                  {step.result && (
                    <div className="bg-green-900/20 border border-green-600/30 p-4 rounded">
                      <p className="text-sm text-green-400 mb-2">Risultato:</p>
                      <p className="font-mono text-green-300 font-semibold">
                        {step.result}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
          
          {steps.length === 0 && (
            <Card className="bg-yellow-900/20 border-yellow-600/30">
              <CardContent className="p-6 text-center">
                <p className="text-yellow-300">
                  Inserisci più dati per ottenere una risoluzione completa del problema.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
