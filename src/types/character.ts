
export interface Character {
  id: string;
  name: string;
  origin: string;
  age: number;
  symbol: string;
  generation: number;
  karma: number;
  contributions: string[];
  weaknesses: string[];
  allies: string[];
  enemies: string[];
  characteristics: CharacterCharacteristics;
  bloodlinks: CharacterBloodlinks;
  powers: CharacterPower[];
  skills: CharacterSkill[];
  pointsBase: number;
  pointsTotal: number;
  pointsUsed: number;
  locked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CharacterCharacteristics {
  // Physique
  dexterity: number;
  strength: number;
  reflex: number;
  physical: number; // Calculé: (dexterity + strength + reflex) / 3
  
  // Endurance
  adaptation: number;
  regeneration: number;
  endurance: number;
  enduranceTotal: number; // Calculé: (adaptation + regeneration + endurance) / 3
  
  // Psyché
  intelligence: number;
  concentration: number;
  will: number;
  psyche: number; // Calculé: (intelligence + concentration + will) / 3
  
  // Perception
  senses: number;
  sixthSense: number;
  empathy: number;
  perception: number; // Calculé: (senses + sixthSense + empathy) / 3
  
  // Charisme
  eloquence: number;
  intimidation: number;
  appearance: number;
  charisma: number; // Calculé: (eloquence + intimidation + appearance) / 3
}

export interface CharacterBloodlinks {
  parents: string[];
  children: string[];
  siblings: string[];
}

export interface CharacterPower {
  id: string;
  name: string;
  level: number; // 1-5
  description: string;
  cost: number;
  progress: number; // 0-100%
}

export interface CharacterSkill {
  id: string;
  name: string;
  level: number;
  description: string;
}
