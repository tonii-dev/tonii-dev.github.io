import { DataEntry, SolutionStep } from './physics-types';

export class PhysicsCalculator {
  private dataEntries: DataEntry[];

  constructor(dataEntries: DataEntry[]) {
    this.dataEntries = dataEntries;
  }

  generateSolutionSteps(calculationId?: string): SolutionStep[] {
    const steps: SolutionStep[] = [];
    
    // Analysis step
    steps.push(this.createAnalysisStep());
    
    // If a specific calculation is requested
    if (calculationId) {
      const calculationStep = this.createSpecificCalculationStep(calculationId);
      if (calculationStep) {
        steps.push(calculationStep);
      }
      return steps;
    }
    
    // Default behavior - check for different types of motion problems
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

  private createSpecificCalculationStep(calculationId: string): SolutionStep | null {
    switch (calculationId) {
      case 'uniform_motion_position':
        return this.createUniformMotionStep();
      case 'accelerated_motion_velocity':
        return this.createAcceleratedMotionVelocityStep();
      case 'accelerated_motion_position':
        return this.createAcceleratedMotionStep();
      case 'kinematic_equation_no_time':
        return this.createKinematicNoTimeStep();
      case 'newton_second_law':
        return this.createDynamicsStep();
      case 'force_decomposition':
        return this.createForceDecompositionStep();
      case 'kinetic_energy':
        return this.createKineticEnergyStep();
      case 'potential_energy':
        return this.createPotentialEnergyStep();
      default:
        return null;
    }
  }

  private createAcceleratedMotionVelocityStep(): SolutionStep {
    const acceleration = this.getData('acceleration');
    const time = this.getData('time');
    const initialVelocity = this.getData('velocity');
    
    if (!acceleration || !time || !initialVelocity) {
      return {
        title: 'Velocità Finale - Moto Accelerato',
        content: 'Dati insufficienti per calcolare la velocità finale. Sono necessari: velocità iniziale, accelerazione e tempo.'
      };
    }

    const finalVelocity = initialVelocity.value + acceleration.value * time.value;
    
    return {
      title: 'Calcolo della Velocità Finale - Moto Uniformemente Accelerato',
      content: 'Applicando la prima equazione della cinematica per trovare la velocità finale.',
      formula: 'vf = v₀ + a·t',
      calculation: `vf = ${initialVelocity.value} + ${acceleration.value} × ${time.value}`,
      result: `vf = ${finalVelocity.toFixed(2)} m/s`
    };
  }

  private createKinematicNoTimeStep(): SolutionStep {
    const velocity = this.getData('velocity');
    const acceleration = this.getData('acceleration');
    const position = this.getData('position');
    
    if (!velocity || !acceleration || !position) {
      return {
        title: 'Equazione Cinematica senza Tempo',
        content: 'Dati insufficienti. Sono necessari: velocità iniziale, accelerazione e spostamento.'
      };
    }

    const finalVelocitySquared = Math.pow(velocity.value, 2) + 2 * acceleration.value * position.value;
    const finalVelocity = Math.sqrt(Math.abs(finalVelocitySquared));
    
    return {
      title: 'Calcolo usando l\'Equazione Cinematica senza Tempo',
      content: 'Utilizziamo la relazione che collega velocità, accelerazione e spostamento senza coinvolgere il tempo.',
      formula: 'vf² = v₀² + 2·a·s',
      calculation: `vf² = ${velocity.value}² + 2 × ${acceleration.value} × ${position.value} = ${finalVelocitySquared.toFixed(2)}`,
      result: `vf = ${finalVelocity.toFixed(2)} m/s`
    };
  }

  private createKineticEnergyStep(): SolutionStep {
    const mass = this.getData('mass');
    const velocity = this.getData('velocity');
    
    if (!mass || !velocity) {
      return {
        title: 'Energia Cinetica',
        content: 'Dati insufficienti per calcolare l\'energia cinetica. Sono necessari: massa e velocità.'
      };
    }

    const kineticEnergy = 0.5 * mass.value * Math.pow(velocity.value, 2);
    
    return {
      title: 'Calcolo dell\'Energia Cinetica',
      content: 'L\'energia cinetica è l\'energia posseduta da un corpo a causa del suo movimento.',
      formula: 'Ek = ½·m·v²',
      calculation: `Ek = ½ × ${mass.value} × ${velocity.value}² = ½ × ${mass.value} × ${Math.pow(velocity.value, 2)}`,
      result: `Ek = ${kineticEnergy.toFixed(2)} J`
    };
  }

  private createPotentialEnergyStep(): SolutionStep {
    const mass = this.getData('mass');
    const position = this.getData('position');
    
    if (!mass || !position) {
      return {
        title: 'Energia Potenziale Gravitazionale',
        content: 'Dati insufficienti per calcolare l\'energia potenziale. Sono necessari: massa e altezza.'
      };
    }

    const g = 9.81; // accelerazione di gravità
    const potentialEnergy = mass.value * g * position.value;
    
    return {
      title: 'Calcolo dell\'Energia Potenziale Gravitazionale',
      content: 'L\'energia potenziale gravitazionale dipende dalla posizione del corpo nel campo gravitazionale.',
      formula: 'Ep = m·g·h',
      calculation: `Ep = ${mass.value} × 9.81 × ${position.value}`,
      result: `Ep = ${potentialEnergy.toFixed(2)} J`
    };
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
