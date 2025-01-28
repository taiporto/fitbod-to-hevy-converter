export const JSONtoCSV = (json: any[]): string => {
  const items = json;
  const header = Object.keys(items[0]);
  const replacer = (key: any, value: any) => (value === null ? "" : value); // specify how you want to handle null values here
  const csv = [
    header.join(";"), // header row first
    ...items.map((row) =>
      header
        .map((fieldName) => {
          let output = row[fieldName] ? row[fieldName] : "";
          if (
            [
              "Exercise Name",
              "Workout Name",
              "Notes",
              "Workout Notes",
              "Set Order",
            ].includes(fieldName)
          ) {
            output = JSON.stringify(row[fieldName], replacer);
          }
          return output;
        })
        .join(";")
    ),
  ].join("\r\n");

  return csv;
};
