import { HevyAPI } from "./../../lib/hevy/api";
export class WorkoutPublisher {
  hevyAPI: HevyAPI;

  constructor(hevyAPI: HevyAPI) {
    this.hevyAPI = hevyAPI;
  }

  async bulkPublishWorkouts(workouts: HevyWorkout[]) {
    for (let workout of workouts) {
      await this.hevyAPI.postWorkout(workout);
    }
  }

  async publishOneWorkout(workout: HevyWorkout) {
    await this.hevyAPI.postWorkout(workout);
  }
}
