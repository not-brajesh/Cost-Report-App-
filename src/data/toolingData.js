// Tooling Database from CostTable_Tooling_2025.csv
// Posted Version 1, 19-May-2025

export const toolingDatabase = {
  1: { process: "All", tool: "None", cost: 0, unit: "", comments: "" },
  2: { process: "Die Casting", tool: "Die Casting - Die", cost: 650000, unit: "die", comments: "Per die not die set. Minimum number of dies is 2 per die set." },
  3: { process: "Lamination", tool: "Lamination - Flat Panel Tool", cost: 19500, unit: "m^2", comments: "Use surface area of tool that is used to form part geometry." },
  4: { process: "Plastic injection molding", tool: "Plastic injection molding - Die", cost: 130000, unit: "die", comments: "Per die not die set." },
  5: { process: "Powder Metal Forming", tool: "Powder Metal Forming - Die", cost: 130000, unit: "die", comments: "Per die not die set." },
  6: { process: "Sand Casting", tool: "Sand Casting - Die", cost: 130000, unit: "die", comments: "Per die not die set." },
  7: { process: "Sand Casting", tool: "Sand Casting - Sand Core Package", cost: 65000, unit: "core", comments: "Per core not core package." },
  8: { process: "Welds", tool: "Welds - Welding Fixture", cost: 6500, unit: "point", comments: "Each point is a pickup or support point." },
  9: { process: "Braze", tool: "Brazing Fixture", cost: 6500, unit: "point", comments: "Each point is a pickup or support point." },
  10: { process: "Liquid Apply - Pour Expanding Foam", tool: "Pouring Fixture", cost: 130000, unit: "m^2", comments: "Use surface area of tool that is used to form part geometry." }
};

export const getToolingByProcess = (processName) => {
  return Object.entries(toolingDatabase)
    .filter(([id, data]) => data.process === processName || data.process === "All")
    .map(([id, data]) => ({ id: parseInt(id), ...data }));
};

export const getTooling = (id) => {
  return toolingDatabase[id];
};
