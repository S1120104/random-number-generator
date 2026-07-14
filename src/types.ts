export type GeneratorMode = 'single' | 'multiple' | 'dice-coin';

export interface GeneratedRecord {
  id: string;
  timestamp: string;
  mode: GeneratorMode | 'coin' | 'dice';
  values: number[];
  min?: number;
  max?: number;
  allowDuplicates?: boolean;
  sorted?: boolean;
  label?: string; // e.g. "Heads", "D20 Roll"
}

export interface GeneratorStats {
  totalGenerated: number;
  min: number | null;
  max: number | null;
  average: number | null;
}
