import { HevyAPI } from "./../../lib/hevy/api";
import dayjs from "dayjs";
import type { GeneralExercise } from "../../types";

export class WorkoutBuilder {
  generalExercises: GeneralExercise[];
  workouts: Map<Date, HevyWorkout> = new Map();
  exerciseTemplates: ExerciseTemplate[] = [];
  heviAPI: HevyAPI;

  constructor(allExercises: GeneralExercise[], hevyAPI: HevyAPI) {
    this.generalExercises = allExercises;
    this.heviAPI = hevyAPI;
  }

  private async initializeExerciseTemplates() {
    this.exerciseTemplates = await this.heviAPI.fetchAllExerciseTemplates();
  }

  async buildWorkoutsFromGeneralExercises(): Promise<HevyWorkout[]> {
    await this.initializeExerciseTemplates();
    const exerciseBundle = new Map<GeneralExercise["id"], GeneralExercise[]>();
    const exercisesGroupedByDate = new Map<string, Array<HevyExercise>>();
    this.generalExercises.forEach((exercise) => {
      if (exerciseBundle.has(exercise.id)) {
        exerciseBundle.get(exercise.id)!.push(exercise);
      } else {
        exerciseBundle.set(exercise.id, [exercise]);
      }
    });

    Array.from(exerciseBundle.entries()).forEach(([id, bundle]) => {
      const date = id.substring(0, 10);
      const hevyExercise = this.buildHevyExercise(bundle);

      if (exercisesGroupedByDate.has(date)) {
        exercisesGroupedByDate.get(date)!.push(hevyExercise);
      } else {
        exercisesGroupedByDate.set(date, [hevyExercise]);
      }
    });

    const workouts = Array.from(exercisesGroupedByDate.entries()).map(
      ([date, exercises]) => {
        return {
          title: "Workout on " + date,
          description: "Imported from Fitbod",
          start_time: dayjs(date).toDate(),
          end_time: dayjs(date).add(60, "minutes").toDate(),
          is_private: false,
          exercises,
        };
      }
    );

    return workouts;
  }

  private buildHevyExercise(exerciseBundle: GeneralExercise[]): HevyExercise {
    const exerciseName = exerciseBundle[0].name;

    const exerciseTemplateId =
      this.exerciseTemplates.find((exercise) => exercise.title === exerciseName)
        ?.id ?? "";

    const exercise = {
      exercise_template_id: exerciseTemplateId,
      superset_id: null,
      notes: "Imported from Fitbod",
      sets: this.buildSets(exerciseBundle),
    };

    return exercise;
  }

  private buildSets(exercises: GeneralExercise[]): HevySet[] {
    const sets = exercises.map((exercise) => ({
      type: "normal" as HevySet["type"],
      weight_kg: exercise.name.includes("Dumbbell")
        ? exercise.weight * 2
        : exercise.weight,
      reps: exercise.reps,
      distance_meters: +exercise.distance_meters,
      duration_seconds: +exercise.metadata.duration,
      rpe: undefined,
    }));

    return sets;
  }
}
