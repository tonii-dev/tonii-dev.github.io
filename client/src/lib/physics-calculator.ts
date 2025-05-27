import { DataEntry, SolutionStep } from './physics-types';

export class PhysicsCalculator {
  private dataEntries: DataEntry[];

  constructor(dataEntries: DataEntry[]) {
    this.dataEntries = dataEntries;
  }

  generateSolutionSteps(): SolutionStep[] {
    const steps: SolutionStep[] = [];
    
    // Analysis step
    steps.push(this.createAnalysisStep());
    
    // Check for different types of motion problems
    if (this.hasData(['velocity', 'time']) && !this.hasData(['position'])) {
      steps.push(this.createUniformMotionStep());
    }
    
    if (this.hasData(['acceleration', 'time', 'velocity'])) {
      steps.push(this.createAcceleratedMotionStep());
    }
    
    if (this.hasData(['force', 'mass'])) {
      steps.push(this.createDynamicsStep());
    }
    
    if (this.hasData(['force']) && this.hasForceWithAngle()) {
      steps.push(this.createForceDecompositionStep());
    }
    
    return steps;
  }

  private createAnalysisStep(): SolutionStep {
    const dataList = this.dataEntries.map(d => {
      const typeNames = {
        velocity: 'Velocità',
        acceleration: 'Accelerazione', 
        mass: 'Massa',
        force: 'Forza',
        position: 'Posizione',
        time: 'Tempo',
        angle: 'Angolo'
      };
      return `${typeNames[d.type]} = ${d.value}${this.getUnit(d.type)}`;
    }).join(', ');

    return {
      title: 'Analisi dei Dati Disponibili',
      content: `Dati inseriti nel problema: ${dataList}. Procediamo con l'identificazione delle leggi fisiche applicabili.`
    };
  }

  private createUniformMotionStep(): SolutionStep {
    const velocity = this.getData('velocity');
    const time = this.getData('time');
    
    if (!velocity || !time) {
      return {
        title: 'Moto Rettilineo Uniforme',
        content: 'Dati insufficienti per calcolare la posizione nel moto uniforme.'
      };
    }

    const position = velocity.value * time.value;
    
    return {
      title: 'Calcolo della Posizione - Moto Rettilineo Uniforme',
      content: 'Nel moto rettilineo uniforme, la posizione si calcola moltiplicando velocità per tempo.',
      formula: 's = s₀ + v·t',
      calculation: `s = 0 + ${velocity.value} × ${time.value}`,
      result: `s = ${position.toFixed(2)} m`
    };
  }

  private createAcceleratedMotionStep(): SolutionStep {
    const acceleration = this.getData('acceleration');
    const time = this.getData('time');
    const initialVelocity = this.getData('velocity');
    
    if (!acceleration || !time || !initialVelocity) {
      return {
        title: 'Moto Uniformemente Accelerato',
        content: 'Dati insufficienti per il calcolo del moto accelerato.'
      };
    }

    const finalVelocity = initialVelocity.value + acceleration.value * time.value;
    const position = initialVelocity.value * time.value + 0.5 * acceleration.value * Math.pow(time.value, 2);
    
    return {
      title: 'Calcolo del Moto Uniformemente Accelerato',
      content: 'Applicando le leggi del moto uniformemente accelerato per velocità finale e posizione.',
      formula: 'vf = v₀ + a·t; s = s₀ + v₀·t + ½·a·t²',
      calculation: `vf = ${initialVelocity.value} + ${acceleration.value} × ${time.value} = ${finalVelocity.toFixed(2)} m/s\ns = 0 + ${initialVelocity.value} × ${time.value} + ½ × ${acceleration.value} × ${time.value}²`,
      result: `vf = ${finalVelocity.toFixed(2)} m/s; s = ${position.toFixed(2)} m`
    };
  }

  private createDynamicsStep(): SolutionStep {
    const force = this.getData('force');
    const mass = this.getData('mass');
    
    if (!force || !mass) {
      return {
        title: 'Secondo Principio della Dinamica',
        content: 'Dati insufficienti per applicare il secondo principio della dinamica.'
      };
    }

    const acceleration = force.value / mass.value;
    
    return {
      title: 'Calcolo dell\'Accelerazione - Secondo Principio della Dinamica',
      content: 'Applicando la seconda legge di Newton per calcolare l\'accelerazione del corpo.',
      formula: 'F = m·a → a = F/m',
      calculation: `a = ${force.value}/${mass.value}`,
      result: `a = ${acceleration.toFixed(2)} m/s²`
    };
  }

  private createForceDecompositionStep(): SolutionStep {
    const forces = this.dataEntries.filter(d => d.type === 'force' && d.direction !== undefined);
    
    if (forces.length === 0) {
      return {
        title: 'Decomposizione delle Forze',
        content: 'Nessuna forza con direzione specificata trovata.'
      };
    }

    const force = forces[0];
    const angle = force.direction!;
    const radians = (angle * Math.PI) / 180;
    const fx = force.value * Math.cos(radians);
    const fy = force.value * Math.sin(radians);
    
    return {
      title: 'Decomposizione Vettoriale delle Forze',
      content: `Decomponendo la forza ${force.name || 'F'} nelle sue componenti cartesiane.`,
      formula: 'Fx = F·cos(θ); Fy = F·sin(θ)',
      calculation: `Fx = ${force.value} × cos(${angle}°) = ${fx.toFixed(2)} N\nFy = ${force.value} × sin(${angle}°) = ${fy.toFixed(2)} N`,
      result: `Fx = ${fx.toFixed(2)} N; Fy = ${fy.toFixed(2)} N`
    };
  }

  private hasData(types: string[]): boolean {
    return types.every(type => this.dataEntries.some(d => d.type === type));
  }

  private getData(type: string): DataEntry | undefined {
    return this.dataEntries.find(d => d.type === type);
  }

  private hasForceWithAngle(): boolean {
    return this.dataEntries.some(d => d.type === 'force' && d.direction !== undefined);
  }

  private getUnit(type: string): string {
    const units = {
      velocity: ' m/s',
      acceleration: ' m/s²',
      mass: ' kg',
      force: ' N',
      position: ' m',
      time: ' s',
      angle: '°'
    };
    return units[type as keyof typeof units] || '';
  }
}
