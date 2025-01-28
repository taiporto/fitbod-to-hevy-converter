import type { FitbodData } from "../../types";

export const CSVtoJSON = (csv: string): FitbodData[] => {
  const lines = csv.split("\n");
  const headers = lines.shift()!.split(";");

  const result = lines.map((line) => {
    const obj: any = {};
    const currentline = line.split(";");

    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentline[j];
    }
    return obj;
  });

  return JSON.parse(JSON.stringify(result));
};
