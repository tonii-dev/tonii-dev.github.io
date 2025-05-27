import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, PenTool, Mountain, ChartLine, Calculator, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

interface TemplateSelectionProps {
  onSelectTemplate: (template: 'cartesian' | 'inclined') => void;
}

export function TemplateSelection({ onSelectTemplate }: TemplateSelectionProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Header */}
      <motion.header 
        className="p-6 border-b border-slate-700"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
            Simulatore Fisica Interattivo
          </h1>
          <p className="text-slate-300 text-lg">
            Strumento per la risoluzione di problemi di meccanica con visualizzazione grafica
          </p>
        </div>
      </motion.header>

      {/* Welcome Section */}
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700 mb-8">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold mb-4 text-red-400">
                  Benvenuto nel Simulatore
                </h2>
                <p className="text-slate-300 mb-6 leading-relaxed">
                  Questo strumento ti permette di visualizzare e risolvere problemi di fisica meccanica attraverso 
                  rappresentazioni grafiche interattive. Inserisci i dati del problema, visualizza le forze e 
                  ottieni soluzioni passo-passo con spiegazioni dettagliate.
                </p>
                <div className="grid md:grid-cols-3 gap-6">
                  <motion.div 
                    className="flex items-center text-green-400"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    <ChartLine className="w-6 h-6 mr-3" />
                    <span>Visualizzazione in tempo reale</span>
                  </motion.div>
                  <motion.div 
                    className="flex items-center text-green-400"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  >
                    <Calculator className="w-6 h-6 mr-3" />
                    <span>Calcoli automatici</span>
                  </motion.div>
                  <motion.div 
                    className="flex items-center text-green-400"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                  >
                    <GraduationCap className="w-6 h-6 mr-3" />
                    <span>Spiegazioni passo-passo</span>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Template Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="text-xl font-semibold mb-6 text-white">Seleziona un Template</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Piano Cartesiano Libero */}
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Card 
                  className="bg-slate-900/70 backdrop-blur-sm border-slate-700 hover:border-red-500 transition-all duration-300 cursor-pointer group"
                  onClick={() => onSelectTemplate('cartesian')}
                >
                  <CardHeader>
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mr-4 group-hover:bg-red-500/30 transition-colors">
                        <PenTool className="w-6 h-6 text-red-500" />
                      </div>
                      <CardTitle className="text-lg text-white">Piano Cartesiano Libero</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-300 mb-4">
                      Sistema di coordinate completo con assi x e y positivi e negativi. 
                      Ideale per problemi di moto in due dimensioni.
                    </p>
                    <div className="space-y-2 text-sm text-slate-400">
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                        <span>Moto rettilineo uniforme</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                        <span>Moto uniformemente accelerato</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                        <span>Moto parabolico</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Piano Inclinato */}
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Card 
                  className="bg-slate-900/70 backdrop-blur-sm border-slate-700 hover:border-red-500 transition-all duration-300 cursor-pointer group"
                  onClick={() => onSelectTemplate('inclined')}
                >
                  <CardHeader>
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mr-4 group-hover:bg-red-500/30 transition-colors">
                        <Mountain className="w-6 h-6 text-red-500" />
                      </div>
                      <CardTitle className="text-lg text-white">Piano Inclinato</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-300 mb-4">
                      Sistema specializzato per problemi su piano inclinato con corpo 
                      posizionato sull'ipotenusa e forze decomposte.
                    </p>
                    <div className="space-y-2 text-sm text-slate-400">
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                        <span>Forze peso e normali</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                        <span>Attrito statico e dinamico</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                        <span>Decomposizione vettoriale</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <motion.footer 
        className="p-4 border-t border-slate-700 bg-slate-900/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <p className="text-center text-slate-400 text-sm">
          Creato da Antonio Rizzo, II B Liceo Classico Parmenide
        </p>
      </motion.footer>
    </div>
  );
}
