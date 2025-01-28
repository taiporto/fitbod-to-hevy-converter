import { HevyAPI } from "./../../lib/hevy/api";
export class WorkoutPublisher {
  workouts: HevyWorkout[];
  hevyAPI: HevyAPI;

  constructor(workouts: HevyWorkout[]) {
    this.workouts = workouts;
    this.hevyAPI = new HevyAPI(process.env.API_KEY ?? "");
  }

  async publishWorkouts() {
    for (let workout of this.workouts) {
      await this.hevyAPI.postWorkout(workout);
    }
  }

  async publishOneWorkout(workout: HevyWorkout) {
    await this.hevyAPI.postWorkout(workout);
  }
}
