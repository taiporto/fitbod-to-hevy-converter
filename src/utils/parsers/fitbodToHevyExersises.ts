import { get_custom_equivalences } from "../../cli/db";
import type { FitbodData, GeneralExercise } from "../../types";

export const originalDataToGeneralExercises = (
  originalData: FitbodData[]
): GeneralExercise[] => {
  const setOrdersMap = new Map<string, number>();

  return originalData.map((entry) => {
    const exerciseKey = `${entry.date.substring(0, 10)}_${entry.exercise_name}`;

    if (setOrdersMap.has(exerciseKey)) {
      const currentSetNumber = setOrdersMap.get(exerciseKey) ?? 0;
      setOrdersMap.set(exerciseKey, currentSetNumber + 1);
    } else {
      setOrdersMap.set(exerciseKey, 1);
    }

    const exerciseMap = get_custom_equivalences();

    const exerciseName =
      exerciseMap[entry.exercise_name] ?? entry.exercise_name;
    return {
      metadata: {
        date: entry.date,
        setOrder: setOrdersMap.get(exerciseKey) ?? -1,
        duration: entry.duration_seconds,
      },
      id: entry.date + exerciseName,
      name: exerciseName || "",
      weight: parseFloat(entry.weight_kg),
      reps: parseInt(entry.Reps),
      distance_meters: entry.distance_meters,
    };
  });
};
