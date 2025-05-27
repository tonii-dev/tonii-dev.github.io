import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Calculator, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { DataEntry } from "@/lib/physics-types";
import { DATA_TYPE_INFO, FORCE_COLORS } from "@/lib/physics-types";

interface DataInputPanelProps {
  dataEntries: DataEntry[];
  onAddData: (data: DataEntry) => void;
  onRemoveData: (id: number) => void;
  onCalculateSolution: () => void;
}

export function DataInputPanel({
  dataEntries,
  onAddData,
  onRemoveData,
  onCalculateSolution
}: DataInputPanelProps) {
  const [selectedType, setSelectedType] = useState<string>("");
  const [value, setValue] = useState("");
  const [vectorX, setVectorX] = useState("");
  const [vectorY, setVectorY] = useState("");
  const [forceDirection, setForceDirection] = useState("");
  const [forceName, setForceName] = useState("");

  const handleAddData = () => {
    if (!selectedType || !value) {
      alert('Inserisci tutti i campi richiesti');
      return;
    }

    const data: DataEntry = {
      id: Date.now(),
      type: selectedType as any,
      value: parseFloat(value)
    };

    if (selectedType === 'force') {
      data.direction = parseFloat(forceDirection) || 0;
      data.name = forceName || 'Forza';
      data.color = FORCE_COLORS[dataEntries.filter(d => d.type === 'force').length % FORCE_COLORS.length];
    } else if (selectedType === 'velocity' || selectedType === 'acceleration') {
      if (vectorX) data.x = parseFloat(vectorX);
      if (vectorY) data.y = parseFloat(vectorY);
    }

    onAddData(data);
    resetForm();
  };

  const resetForm = () => {
    setSelectedType("");
    setValue("");
    setVectorX("");
    setVectorY("");
    setForceDirection("");
    setForceName("");
  };

  const renderDataForm = () => {
    if (!selectedType) return null;

    const info = DATA_TYPE_INFO[selectedType];
    
    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        className="space-y-4"
      >
        <Card className="bg-slate-800/50 border-slate-600">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-red-400">{info.name} ({info.symbol})</CardTitle>
            <p className="text-sm text-slate-300">{info.description}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-white">Valore ({info.unit})</Label>
              <Input
                type="number"
                step="0.01"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="bg-slate-900 border-slate-600 text-white focus:border-red-500"
                placeholder="Inserisci valore..."
              />
            </div>

            {selectedType === 'force' && (
              <>
                <div>
                  <Label className="text-white">Direzione (°)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="360"
                    value={forceDirection}
                    onChange={(e) => setForceDirection(e.target.value)}
                    className="bg-slate-900 border-slate-600 text-white focus:border-red-500"
                    placeholder="0-360°"
                  />
                </div>
                <div>
                  <Label className="text-white">Nome Forza</Label>
                  <Input
                    type="text"
                    value={forceName}
                    onChange={(e) => setForceName(e.target.value)}
                    className="bg-slate-900 border-slate-600 text-white focus:border-red-500"
                    placeholder="es. Peso, Normale..."
                  />
                </div>
              </>
            )}

            {(selectedType === 'velocity' || selectedType === 'acceleration') && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-white">Componente X</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={vectorX}
                    onChange={(e) => setVectorX(e.target.value)}
                    className="bg-slate-900 border-slate-600 text-white focus:border-red-500"
                  />
                </div>
                <div>
                  <Label className="text-white">Componente Y</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={vectorY}
                    onChange={(e) => setVectorY(e.target.value)}
                    className="bg-slate-900 border-slate-600 text-white focus:border-red-500"
                  />
                </div>
              </div>
            )}

            <Button
              onClick={handleAddData}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Aggiungi Dato
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="h-full bg-slate-900 border-l border-slate-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <h3 className="font-semibold mb-2 text-white">Dati del Problema</h3>
        <Button
          onClick={onCalculateSolution}
          className="w-full bg-red-500 hover:bg-red-600 text-white"
          disabled={dataEntries.length === 0}
        >
          <Calculator className="w-4 h-4 mr-2" />
          Risolvi Problema
        </Button>
      </div>

      {/* Data Input Form */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {/* Data Type Selection */}
        <Card className="bg-slate-800/30 border-slate-600">
          <CardContent className="p-4">
            <Label className="text-white">Tipo di Dato</Label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="bg-slate-900 border-slate-600 text-white focus:border-red-500">
                <SelectValue placeholder="Seleziona tipo..." />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="velocity">Velocità (v)</SelectItem>
                <SelectItem value="acceleration">Accelerazione (a)</SelectItem>
                <SelectItem value="mass">Massa (m)</SelectItem>
                <SelectItem value="force">Forza (F)</SelectItem>
                <SelectItem value="position">Posizione (s)</SelectItem>
                <SelectItem value="time">Tempo (t)</SelectItem>
                <SelectItem value="angle">Angolo (θ)</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Dynamic Form */}
        <AnimatePresence>
          {renderDataForm()}
        </AnimatePresence>

        {/* Current Data List */}
        <Card className="bg-slate-800/30 border-slate-600">
          <CardHeader className="pb-3">
            <CardTitle className="text-white">Dati Inseriti</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {dataEntries.length === 0 ? (
              <p className="text-slate-400 text-sm">Nessun dato inserito</p>
            ) : (
              <AnimatePresence>
                {dataEntries.map((data, index) => {
                  const info = DATA_TYPE_INFO[data.type];
                  let valueText = `${data.value} ${info.unit}`;
                  
                  if (data.type === 'force') {
                    valueText += ` (${data.direction}°)`;
                  } else if (data.x !== undefined || data.y !== undefined) {
                    valueText = `(${data.x || 0}, ${data.y || 0}) ${info.unit}`;
                  }

                  return (
                    <motion.div
                      key={data.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-2 bg-slate-900 rounded border border-slate-600"
                    >
                      <div className="flex items-center">
                        {data.type === 'force' && (
                          <div 
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: data.color }}
                          />
                        )}
                        <div>
                          <span className="text-sm font-medium text-white">
                            {data.name || info.name}
                          </span>
                          <div className="text-xs text-slate-400">{valueText}</div>
                        </div>
                      </div>
                      <Button
                        onClick={() => onRemoveData(data.id)}
                        size="sm"
                        variant="ghost"
                        className="w-6 h-6 p-0 hover:bg-red-500/20 text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
