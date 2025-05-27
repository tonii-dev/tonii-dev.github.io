export interface DataEntry {
  id: number;
  type: 'velocity' | 'acceleration' | 'mass' | 'force' | 'position' | 'time' | 'angle';
  value: number;
  x?: number;
  y?: number;
  direction?: number;
  name?: string;
  color?: string;
}

export interface Force extends DataEntry {
  type: 'force';
  direction: number;
  name: string;
  color: string;
}

export interface PhysicsProject {
  id: number;
  name: string;
  template: 'cartesian' | 'inclined';
  dataEntries: DataEntry[];
  forces: Force[];
  createdAt: string;
}

export interface SolutionStep {
  title: string;
  content: string;
  formula?: string;
  calculation?: string;
  result?: string;
}

export interface DataTypeInfo {
  name: string;
  unit: string;
  symbol: string;
  description: string;
}

export const DATA_TYPE_INFO: Record<string, DataTypeInfo> = {
  velocity: { name: 'Velocità', unit: 'm/s', symbol: 'v', description: 'Velocità del corpo in movimento' },
  acceleration: { name: 'Accelerazione', unit: 'm/s²', symbol: 'a', description: 'Accelerazione del corpo' },
  mass: { name: 'Massa', unit: 'kg', symbol: 'm', description: 'Massa del corpo' },
  force: { name: 'Forza', unit: 'N', symbol: 'F', description: 'Forza applicata al corpo' },
  position: { name: 'Posizione', unit: 'm', symbol: 's', description: 'Posizione del corpo' },
  time: { name: 'Tempo', unit: 's', symbol: 't', description: 'Intervallo di tempo' },
  angle: { name: 'Angolo', unit: '°', symbol: 'θ', description: 'Angolo di inclinazione o direzione' }
};

export const FORCE_COLORS = [
  '#a855f7', '#00d4aa', '#f39c12', '#8b5cf6', 
  '#3498db', '#e67e22', '#1abc9c', '#c084fc'
];
