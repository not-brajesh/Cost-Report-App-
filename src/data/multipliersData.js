// Process Multipliers Database from CostTable_ProcessMultipliers_2025.csv
// Posted Version 1, 19-May-2025

export const multipliersDatabase = {
  1.0: { name: "Assemble - Length > 0.5m", multiplier: 1.25, use: "Assembly", comments: "" },
  2.0: { name: "Disassemble", multiplier: 0.8, use: "Assembly", comments: "To be used when removing parts or fasteners" },
  3.0: { name: "Fastener Engagement Length > 2D", multiplier: 1.25, use: "Fastener Installation", comments: "" },
  4.0: { name: "Fastener Engagement Length > 4D", multiplier: 1.5, use: "Fastener Installation", comments: "" },
  5.0: { name: "Machine - Hole Length >= 4D", multiplier: 1.5, use: "Drill, Tap", comments: "" },
  6.0: { name: "Machine - Hole Length >= 8D", multiplier: 3.0, use: "Drill, Tap", comments: "" },
  7.0: { name: "Material - Composite", multiplier: 2.0, use: "Machining", comments: "" },
  8.0: { name: "Material - Aluminum", multiplier: 1.0, use: "Machining", comments: "" },
  9.0: { name: "Material - Brass", multiplier: 0.8, use: "Machining", comments: "" },
  10.0: { name: "Material - Bronze", multiplier: 1.33, use: "Machining", comments: "" },
  11.0: { name: "Material - Cast Iron", multiplier: 2.5, use: "Machining", comments: "" },
  12.0: { name: "Material - Foam", multiplier: 0.33, use: "Machining", comments: "" },
  13.0: { name: "Material - Inconel", multiplier: 4.0, use: "Machining", comments: "" },
  14.0: { name: "Material - Magnesium", multiplier: 0.8, use: "Machining", comments: "" },
  15.0: { name: "Material - MMC", multiplier: 4.25, use: "Machining", comments: "" },
  16.0: { name: "Material - Nickel", multiplier: 1.33, use: "Machining", comments: "" },
  17.0: { name: "Material - Plastic", multiplier: 0.5, use: "Machining", comments: "" },
  18.0: { name: "Material - Stainless Steel", multiplier: 3.75, use: "Machining", comments: "" },
  19.0: { name: "Material - Steel", multiplier: 3.0, use: "Machining", comments: "" },
  20.0: { name: "Material - Titanium", multiplier: 3.65, use: "Machining", comments: "" },
  21.0: { name: "Material - Wood (Hard or soft)", multiplier: 0.5, use: "Machining", comments: "" },
  22.0: { name: "Repeat 2", multiplier: 2.0, use: "", comments: "Optional, to show repetition of processes." },
  23.0: { name: "Repeat 3", multiplier: 3.0, use: "", comments: "Optional, to show repetition of processes." },
  24.0: { name: "Repeat 4", multiplier: 4.0, use: "", comments: "Optional, to show repetition of processes." },
  25.0: { name: "Repeat 5", multiplier: 5.0, use: "", comments: "Optional, to show repetition of processes." },
  26.0: { name: "Repeat 6", multiplier: 6.0, use: "", comments: "Optional, to show repetition of processes." },
  27.0: { name: "Repeat 7", multiplier: 7.0, use: "", comments: "Optional, to show repetition of processes." },
  28.0: { name: "Repeat 8", multiplier: 8.0, use: "", comments: "Optional, to show repetition of processes." },
  29.0: { name: "Repeat 9", multiplier: 9.0, use: "", comments: "Optional, to show repetition of processes." },
  30.0: { name: "Repeat 10", multiplier: 10.0, use: "", comments: "Optional, to show repetition of processes." }
};

export const getMultipliersByUse = (use) => {
  return Object.entries(multipliersDatabase)
    .filter(([id, data]) => data.use === use || data.use === "")
    .map(([id, data]) => ({ id: parseFloat(id), ...data }));
};

export const getMultiplier = (id) => {
  return multipliersDatabase[id];
};
