import { EXERCISE_NAME_MAPPING } from "../../constants";
import type { FitbodData, GeneralExercise } from "../../types";

export const fitbodDataToGeneralExercises = (
  fitbodData: FitbodData[]
): GeneralExercise[] => {
  const setOrdersMap = new Map<string, number>();

  return fitbodData.map((entry) => {
    const exerciseKey = `${entry.date.substring(0, 10)}_${entry.exercise_name}`;

    if (setOrdersMap.has(exerciseKey)) {
      const currentSetNumber = setOrdersMap.get(exerciseKey) ?? 0;
      setOrdersMap.set(exerciseKey, currentSetNumber + 1);
    } else {
      setOrdersMap.set(exerciseKey, 1);
    }

    const exerciseName =
      EXERCISE_NAME_MAPPING[
        entry.exercise_name as keyof typeof EXERCISE_NAME_MAPPING
      ] || entry.exercise_name;

    return {
      metadata: {
        date: entry.date,
        setOrder: setOrdersMap.get(exerciseKey) ?? -1,
        duration: entry.duration_seconds,
      },
      id: entry.date + exerciseName,
      name: exerciseName,
      weight: parseFloat(entry.weight_kg),
      reps: parseInt(entry.Reps),
      distance_meters: entry.distance_meters,
    };
  });
};
