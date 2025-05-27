import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Calculator, AlertCircle, CheckCircle2 } from "lucide-react";
import type { DataEntry } from "@/lib/physics-types";

interface CalculationOption {
  id: string;
  title: string;
  description: string;
  formula: string;
  requiredData: string[];
  category: 'kinematics' | 'dynamics' | 'energy';
  available: boolean;
  missingData?: string[];
}

interface CalculationSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  dataEntries: DataEntry[];
  onSelectCalculation: (calculationId: string) => void;
}

export function CalculationSelectionModal({ 
  isOpen, 
  onClose, 
  dataEntries, 
  onSelectCalculation 
}: CalculationSelectionModalProps) {
  
  const availableDataTypes = dataEntries.map(d => d.type);
  
  const calculationOptions: CalculationOption[] = [
    // Cinematica - Moto Rettilineo Uniforme
    {
      id: 'uniform_motion_position',
      title: 'Posizione nel Moto Rettilineo Uniforme',
      description: 'Calcola la posizione finale di un corpo in moto uniforme',
      formula: 's = s₀ + v·t',
      requiredData: ['velocity', 'time'],
      category: 'kinematics',
      available: false,
      missingData: []
    },
    {
      id: 'uniform_motion_velocity',
      title: 'Velocità dal Moto Uniforme (Formula Inversa)',
      description: 'Calcola la velocità da posizione e tempo',
      formula: 'v = (s - s₀) / t',
      requiredData: ['position', 'time'],
      category: 'kinematics',
      available: false,
      missingData: []
    },
    {
      id: 'uniform_motion_time',
      title: 'Tempo dal Moto Uniforme (Formula Inversa)',
      description: 'Calcola il tempo da posizione e velocità',
      formula: 't = (s - s₀) / v',
      requiredData: ['position', 'velocity'],
      category: 'kinematics',
      available: false,
      missingData: []
    },
    // Cinematica - Moto Uniformemente Accelerato
    {
      id: 'accelerated_motion_velocity',
      title: 'Velocità Finale nel Moto Accelerato',
      description: 'Calcola la velocità finale con accelerazione costante',
      formula: 'vf = v₀ + a·t',
      requiredData: ['velocity', 'acceleration', 'time'],
      category: 'kinematics',
      available: false,
      missingData: []
    },
    {
      id: 'accelerated_motion_acceleration',
      title: 'Accelerazione dal Moto Accelerato (Formula Inversa)',
      description: 'Calcola l\'accelerazione da velocità e tempo',
      formula: 'a = (vf - v₀) / t',
      requiredData: ['velocity', 'time'],
      category: 'kinematics',
      available: false,
      missingData: []
    },
    {
      id: 'accelerated_motion_time_velocity',
      title: 'Tempo dal Moto Accelerato (Formula Inversa)',
      description: 'Calcola il tempo da velocità e accelerazione',
      formula: 't = (vf - v₀) / a',
      requiredData: ['velocity', 'acceleration'],
      category: 'kinematics',
      available: false,
      missingData: []
    },
    {
      id: 'accelerated_motion_position',
      title: 'Posizione nel Moto Accelerato',
      description: 'Calcola la posizione con accelerazione costante',
      formula: 's = s₀ + v₀·t + ½·a·t²',
      requiredData: ['velocity', 'acceleration', 'time'],
      category: 'kinematics',
      available: false,
      missingData: []
    },
    {
      id: 'kinematic_equation_no_time',
      title: 'Equazione Cinematica senza Tempo',
      description: 'Relazione velocità-accelerazione-spostamento',
      formula: 'vf² = v₀² + 2·a·s',
      requiredData: ['velocity', 'acceleration', 'position'],
      category: 'kinematics',
      available: false,
      missingData: []
    },
    // Dinamica
    {
      id: 'newton_second_law',
      title: 'Secondo Principio della Dinamica',
      description: 'Calcola accelerazione usando la seconda legge di Newton',
      formula: 'F = m·a → a = F/m',
      requiredData: ['force', 'mass'],
      category: 'dynamics',
      available: false,
      missingData: []
    },
    {
      id: 'newton_force_calculation',
      title: 'Forza dal Secondo Principio (Formula Inversa)',
      description: 'Calcola la forza da massa e accelerazione',
      formula: 'F = m·a',
      requiredData: ['mass', 'acceleration'],
      category: 'dynamics',
      available: false,
      missingData: []
    },
    {
      id: 'newton_mass_calculation',
      title: 'Massa dal Secondo Principio (Formula Inversa)',
      description: 'Calcola la massa da forza e accelerazione',
      formula: 'm = F/a',
      requiredData: ['force', 'acceleration'],
      category: 'dynamics',
      available: false,
      missingData: []
    },
    {
      id: 'force_decomposition',
      title: 'Decomposizione Vettoriale delle Forze',
      description: 'Scompone una forza nelle sue componenti cartesiane',
      formula: 'Fx = F·cos(θ); Fy = F·sin(θ)',
      requiredData: ['force', 'angle'],
      category: 'dynamics',
      available: false,
      missingData: []
    },
    // Energia
    {
      id: 'kinetic_energy',
      title: 'Energia Cinetica',
      description: 'Calcola l\'energia cinetica di un corpo in movimento',
      formula: 'Ek = ½·m·v²',
      requiredData: ['mass', 'velocity'],
      category: 'energy',
      available: false,
      missingData: []
    },
    {
      id: 'velocity_from_kinetic',
      title: 'Velocità dall\'Energia Cinetica (Formula Inversa)',
      description: 'Calcola la velocità dall\'energia cinetica e massa',
      formula: 'v = √(2·Ek/m)',
      requiredData: ['mass'],
      category: 'energy',
      available: false,
      missingData: []
    },
    {
      id: 'mass_from_kinetic',
      title: 'Massa dall\'Energia Cinetica (Formula Inversa)',
      description: 'Calcola la massa dall\'energia cinetica e velocità',
      formula: 'm = 2·Ek/v²',
      requiredData: ['velocity'],
      category: 'energy',
      available: false,
      missingData: []
    },
    {
      id: 'potential_energy',
      title: 'Energia Potenziale Gravitazionale',
      description: 'Calcola l\'energia potenziale gravitazionale',
      formula: 'Ep = m·g·h',
      requiredData: ['mass', 'position'],
      category: 'energy',
      available: false,
      missingData: []
    },
    {
      id: 'height_from_potential',
      title: 'Altezza dall\'Energia Potenziale (Formula Inversa)',
      description: 'Calcola l\'altezza dall\'energia potenziale e massa',
      formula: 'h = Ep/(m·g)',
      requiredData: ['mass'],
      category: 'energy',
      available: false,
      missingData: []
    },
    {
      id: 'mass_from_potential',
      title: 'Massa dall\'Energia Potenziale (Formula Inversa)',
      description: 'Calcola la massa dall\'energia potenziale e altezza',
      formula: 'm = Ep/(g·h)',
      requiredData: ['position'],
      category: 'energy',
      available: false,
      missingData: []
    }
  ];

  // Verifica quali calcoli sono disponibili
  calculationOptions.forEach(option => {
    const missingData = option.requiredData.filter(required => !availableDataTypes.includes(required as any));
    option.available = missingData.length === 0;
    option.missingData = missingData;
  });

  const categoryNames = {
    kinematics: 'Cinematica',
    dynamics: 'Dinamica', 
    energy: 'Energia'
  };

  const categoryColors = {
    kinematics: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    dynamics: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    energy: 'bg-green-500/20 text-green-300 border-green-500/30'
  };

  const handleCalculationSelect = (calculationId: string) => {
    onSelectCalculation(calculationId);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-purple-400 flex items-center">
            <Calculator className="w-6 h-6 mr-2" />
            Seleziona il Calcolo da Eseguire
          </DialogTitle>
          <p className="text-slate-300">
            Scegli quale grandezza fisica vuoi calcolare in base ai dati inseriti
          </p>
        </DialogHeader>
        
        <div className="space-y-6">
          {Object.entries(categoryNames).map(([category, categoryName]) => {
            const categoryOptions = calculationOptions.filter(opt => opt.category === category);
            const availableCount = categoryOptions.filter(opt => opt.available).length;
            
            return (
              <div key={category}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">{categoryName}</h3>
                  <Badge className={categoryColors[category as keyof typeof categoryColors]}>
                    {availableCount}/{categoryOptions.length} disponibili
                  </Badge>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {categoryOptions.map((option, index) => (
                    <motion.div
                      key={option.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card 
                        className={`transition-all duration-300 ${
                          option.available 
                            ? 'bg-slate-800/50 border-slate-600 hover:border-purple-500 cursor-pointer' 
                            : 'bg-slate-800/20 border-slate-700 opacity-60'
                        }`}
                        onClick={() => option.available && handleCalculationSelect(option.id)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-base text-white flex items-center">
                              {option.available ? (
                                <CheckCircle2 className="w-5 h-5 text-green-400 mr-2" />
                              ) : (
                                <AlertCircle className="w-5 h-5 text-yellow-400 mr-2" />
                              )}
                              {option.title}
                            </CardTitle>
                          </div>
                          <p className="text-sm text-slate-300">{option.description}</p>
                        </CardHeader>
                        
                        <CardContent>
                          <div className="space-y-3">
                            <div className="bg-slate-900 p-3 rounded border border-slate-600">
                              <p className="text-xs text-slate-400 mb-1">Formula:</p>
                              <code className="font-mono text-green-400 text-sm">
                                {option.formula}
                              </code>
                            </div>
                            
                            {!option.available && option.missingData && option.missingData.length > 0 && (
                              <div className="bg-yellow-900/20 border border-yellow-600/30 p-3 rounded">
                                <p className="text-xs text-yellow-300 mb-1">Dati mancanti:</p>
                                <div className="flex flex-wrap gap-1">
                                  {option.missingData.map(missing => (
                                    <Badge key={missing} variant="outline" className="text-xs border-yellow-600/50 text-yellow-300">
                                      {missing === 'velocity' && 'Velocità'}
                                      {missing === 'acceleration' && 'Accelerazione'}
                                      {missing === 'mass' && 'Massa'}
                                      {missing === 'force' && 'Forza'}
                                      {missing === 'position' && 'Posizione'}
                                      {missing === 'time' && 'Tempo'}
                                      {missing === 'angle' && 'Angolo'}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {option.available && (
                              <Button 
                                className="w-full bg-purple-500 hover:bg-purple-600 text-white"
                                onClick={() => handleCalculationSelect(option.id)}
                              >
                                Calcola
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
          
          {calculationOptions.every(opt => !opt.available) && (
            <Card className="bg-slate-800/20 border-slate-700">
              <CardContent className="p-6 text-center">
                <AlertCircle className="w-12 h-12 mx-auto mb-3 text-yellow-400" />
                <p className="text-yellow-300 mb-2">Nessun calcolo disponibile</p>
                <p className="text-slate-400 text-sm">
                  Inserisci più dati per abilitare i calcoli fisici
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}