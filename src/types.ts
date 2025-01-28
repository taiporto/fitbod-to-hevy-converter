export type FitbodData = {
  date: string;
  distance_meters: string;
  duration_seconds: string;
  exercise_name: string;
  Incline: string;
  Reps: string;
  Resistance: string;
  weight_kg: string;
  isWarmup: string;
  multiplier: string;
};

export type GeneralExercise = {
  metadata: {
    date: string;
    setOrder: number;
    duration: string;
  };
  id: string;
  name: string;
  weight: number;
  reps: number;
  distance_meters: string;
};

export type HevyData = {
  Date: string;
  "Workout Name": string;
  "Exercise Name": string;
  "Set Order": number;
  Weight: number;
  "Weight Unit": string;
  Reps: number;
  RPE: string;
  Distance: string;
  "Distance Unit": string;
  Seconds: number;
  Notes: string;
  "Workout Notes": string;
  "Workout Duration": string;
};
