import { Agent } from "node:https";
import axios from "axios";

export class HevyAPI {
  APIKey: string;

  constructor(APIKey: string) {
    this.APIKey = APIKey;
  }

  async fetchAllExerciseTemplates(): Promise<ExerciseTemplate[]> {
    let pageCounter = 1;
    let totalPagesCount = 1;
    const allExerciseTemplates: ExerciseTemplate[] = [];

    do {
      try {
        const { exercise_templates: exerciseTemplates, page_count: pageCount } =
          await this.fetchExerciseTemplatePage(pageCounter);
        if (!exerciseTemplates || exerciseTemplates.length === 0) break;
        if (pageCounter === 1) totalPagesCount = pageCount;

        allExerciseTemplates.push(...exerciseTemplates);
        pageCounter++;
      } catch (err) {
        console.error("Error fetching exercise templates");
        break;
      }
    } while (pageCounter <= totalPagesCount);

    return allExerciseTemplates;
  }

  private fetchExerciseTemplatePage(page = 1): Promise<{
    page: number;
    page_count: number;
    exercise_templates: ExerciseTemplate[];
  }> {
    return axios
      .get(`https://api.hevyapp.com/v1/exercise_templates?page=${page}`, {
        headers: {
          "api-key": this.APIKey,
        },
        httpAgent: new Agent({ family: 4 }),
      })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching template");
        return { page: 0, page_count: 0, exercise_templates: [] };
      });
  }

  postWorkout(workout: HevyWorkout): Promise<any> {
    return fetch(`https://api.hevyapp.com/v1/workouts`, {
      method: "POST",
      headers: {
        "api-key": this.APIKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ workout: workout }),
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
      })
      .catch((error) => {
        console.error("Error publishing workout: ", error.response.data);
        return [];
      });
  }
}
