// Assembly Cost Database
// Assembly costs for common assembly operations

export const assemblyDatabase = {
  "Manual Assembly": { unitCost: 50, unit: "hour", category: "Manual" },
  "Automated Assembly": { unitCost: 120, unit: "hour", category: "Automated" },
  "Sub-Assembly Integration": { unitCost: 80, unit: "hour", category: "Integration" },
  "Component Integration": { unitCost: 65, unit: "hour", category: "Integration" },
  "Structural Assembly": { unitCost: 75, unit: "hour", category: "Structural" },
  "Welding Assembly": { unitCost: 90, unit: "hour", category: "Welding" },
  "Bolted Assembly": { unitCost: 45, unit: "hour", category: "Fastening" },
  "Riveted Assembly": { unitCost: 55, unit: "hour", category: "Fastening" },
  "Adhesive Bonding Assembly": { unitCost: 40, unit: "hour", category: "Bonding" },
  "Press Fit Assembly": { unitCost: 35, unit: "hour", category: "Mechanical" },
  "Heat Shrink Assembly": { unitCost: 60, unit: "hour", category: "Thermal" },
  "Electrical Assembly": { unitCost: 70, unit: "hour", category: "Electrical" },
  "Hydraulic Assembly": { unitCost: 85, unit: "hour", category: "Hydraulic" },
  "Pneumatic Assembly": { unitCost: 85, unit: "hour", category: "Pneumatic" },
  "Final Assembly": { unitCost: 100, unit: "hour", category: "Final" },
  "Quality Check Assembly": { unitCost: 95, unit: "hour", category: "Quality" },
  "Test Assembly": { unitCost: 80, unit: "hour", category: "Testing" }
};

export const getAssemblyByCategory = () => {
  const byCategory = {};
  Object.entries(assemblyDatabase).forEach(([name, data]) => {
    const cat = data.category || 'Other';
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push({ name, ...data });
  });
  return byCategory;
};

export const getAssembly = (name) => {
  return assemblyDatabase[name];
};
