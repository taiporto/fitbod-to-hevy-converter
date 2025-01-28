interface ExerciseTemplate {
  id: string;
  title: string;
  type: string;
  primary_muscle_group: string;
  secondary_muscle_groups: string[];
  is_custom: boolean;
}

interface HevySet {
  type: "warmup" | "normal" | "failure" | "dropset";
  weight_kg: number;
  reps: number;
  distance_meters: number;
  duration_seconds: number;
  rpe?: 6 | 7 | 7.5 | 8 | 8.5 | 9 | 9.5 | 10;
}

interface HevyExercise {
  exercise_template_id: string;
  superset_id: number | null;
  notes: string;
  sets: Set[];
}

interface HevyWorkout {
  title: string;
  description: string;
  start_time: Date;
  end_time: Date;
  is_private: boolean;
  exercises: HevyExercise[];
}
