// Fasteners Database from CostTable_Fastners_2025.csv
// Posted Version 1.0, 19-May-2025

export const fastenersDatabase = {
  // Clamps
  "Steel Loop Straps, Rubber-Cushioned": { formula: "[C1]*[Size1]+[C2]", c1: 0.65, c2: 0.65, unit: "mm", category: "Clamp" },
  "Galvanized Steel Loop Straps": { formula: "[C1]*[Size1]+[C2]", c1: 0.13, c2: 5.20, unit: "mm", category: "Clamp" },
  "Galvanized Steel Loop Straps, Rubber coated": { formula: "[C1]*[Size1]+[C2]", c1: 0.26, c2: 5.20, unit: "mm", category: "Clamp" },
  "Metal fixed loop swivel snap": { formula: "[C1]*[Size1]+[C2]", c1: 0.34, c2: 16.90, unit: "mm", category: "Clamp" },
  "Hose Clamp, Spring Steel": { formula: "[C1]*[Size1]", c1: 0.91, c2: 0, unit: "mm", category: "Clamp" },
  "Hose Clamp, Constant Tension": { formula: "[C1]*[Size1]+[C2]", c1: 8.00, c2: 169.00, unit: "mm", category: "Clamp" },
  "Hose Clamp, Miniature Bolt": { formula: "[C1]*[Size1]+[C2]", c1: 0.26, c2: 32.50, unit: "mm", category: "Clamp" },
  "Hose Clamp, Single Wire": { formula: "[C1]*[Size1]+[C2]", c1: 0.26, c2: 1.30, unit: "mm", category: "Clamp" },
  "Hose Clamp, V-Band Quick Release": { formula: "[C1]*[Size1]+[C2]", c1: 7.67, c2: 679.90, unit: "mm", category: "Clamp" },
  "Hose Clamp, Worm Drive": { formula: "[C1]*[Size1]+[C2]", c1: 0.26, c2: 32.50, unit: "mm", category: "Clamp" },

  // Retaining Rings
  "Retaining Ring, R-ring": { formula: "[C1]*([Size1]^2)+[C2]", c1: 0.01, c2: 0.85, unit: "mm", category: "Retaining Ring" },
  "Retaining Ring, Internal": { formula: "[C1]*([Size1]^2)+[C2]", c1: 0.01, c2: 0.85, unit: "mm", category: "Retaining Ring" },
  "Retaining Ring, External": { formula: "[C1]*([Size1]^2)+[C2]", c1: 0.01, c2: 0.85, unit: "mm", category: "Retaining Ring" },
  "Retaining Ring, Spiral": { formula: "[C1]*([Size1]^2)+[C2]", c1: 0.01, c2: 1.63, unit: "mm", category: "Retaining Ring" },

  // Bolts
  "Alcoa Camloc Fastener 1/4 turn": { price: 260, unit: "unit", category: "Bolt" },
  "Bolt, Aluminum": { formula: "[C1]/105154*[Size1]^2*[Size2]*SQRT([Size2])+([C2]*EXP(0.319*[Size1]))", c1: 65.00, c2: 0.33, unit: "mm", category: "Bolt" },
  "Bolt, Custom Design, Student Made": { price: 0, unit: "unit", category: "Bolt" },
  "Bolt, Grade 10.9 (SAE 8)": { formula: "[C1]/105154*[Size1]^2*[Size2]*SQRT([Size2])+([C2]*EXP(0.319*[Size1]))", c1: 65.00, c2: 0.26, unit: "mm", category: "Bolt" },
  "Bolt, Grade 12.9": { formula: "[C1]/105154*[Size1]^2*[Size2]*SQRT([Size2])+([C2]*EXP(0.319*[Size1]))", c1: 81.25, c2: 0.33, unit: "mm", category: "Bolt" },
  "Bolt, Grade 6.8 (SAE 3) and All Grades less than Metric 8.8": { formula: "[C1]/105154*[Size1]^2*[Size2]*SQRT([Size2])+([C2]*EXP(0.319*[Size1]))", c1: 39.00, c2: 0.16, unit: "mm", category: "Bolt" },
  "Bolt, Grade 8.8 (SAE 5)": { formula: "[C1]/105154*[Size1]^2*[Size2]*SQRT([Size2])+([C2]*EXP(0.319*[Size1]))", c1: 52.00, c2: 0.20, unit: "mm", category: "Bolt" },
  "Bolt, Grade AN": { formula: "[C1]/105154*[Size1]^2*[Size2]*SQRT([Size2])+([C2]*EXP(0.319*[Size1]))", c1: 130.00, c2: 1.30, unit: "mm", category: "Bolt" },
  "Bolt, Grade NAS 12-Point": { formula: "[C1]/105154*[Size1]^2*[Size2]*SQRT([Size2])+([C2]*EXP(0.319*[Size1]))", c1: 406.25, c2: 6.50, unit: "mm", category: "Bolt" },
  "Bolt, Grade NAS 6-Point": { formula: "[C1]/105154*[Size1]^2*[Size2]*SQRT([Size2])+([C2]*EXP(0.319*[Size1]))", c1: 162.50, c2: 2.60, unit: "mm", category: "Bolt" },

  // Buckles & Clevis
  "Buckle, side release, metal": { formula: "[C1]*[Size1]+[C2]", c1: 3.32, c2: 38.35, unit: "mm", category: "Bolt" },
  "Clevis": { formula: "[C1]*[Size1]^2+[C2]", c1: 0.65, c2: 39.65, unit: "mm", category: "Bolt" },

  // Dzus Fasteners
  "Dzus Fastener, 1/4 Turn, Slotted Head": { price: 78, unit: "unit", category: "Bolt" },
  "Dzus Fastener, 1/4 Turn, Wing Head": { price: 84.50, unit: "unit", category: "Bolt" },

  // Eyebolt
  "Eyebolt, Threaded, Steel": { formula: "[Quantity]*(([C1]*EXP([C2]*[Size1])))", c1: 56.55, c2: 3.25, unit: "mm", category: "Bolt" },

  // Hook and Loop
  "Hook and Loop, Hook Side (Velcro)": { price: 0.20, unit: "cm^2", category: "Fastener - Misc" },
  "Hook and Loop, Loop Side (Velcro)": { price: 0.13, unit: "cm^2", category: "Fastener - Misc" },

  // Nuts
  "Nut, Custom Design, Student Made": { price: 0, unit: "unit", category: "Nut" },
  "Nut, Grade 10.9 (SAE 8)": { formula: "([C1]*EXP([C2]*[Size1]))", c1: 0.78, c2: 13.00, unit: "mm", category: "Nut" },
  "Nut, Grade 12.9": { formula: "([C1]*EXP([C2]*[Size1]))", c1: 0.98, c2: 13.00, unit: "mm", category: "Nut" },
  "Nut, Grade 6.8 (SAE 3) and All Grades less than Metric 8.8": { formula: "([C1]*EXP([C2]*[Size1]))", c1: 0.46, c2: 13.00, unit: "mm", category: "Nut" },
  "Nut, Grade 8.8 (SAE 5)": { formula: "([C1]*EXP([C2]*[Size1]))", c1: 0.59, c2: 13.00, unit: "mm", category: "Nut" },
  "Nut, Grade AN": { formula: "([C1]*EXP([C2]*[Size1]))", c1: 3.90, c2: 13.00, unit: "mm", category: "Nut" },
  "Nut, Grade NAS 12-Point": { formula: "([C1]*EXP([C2]*[Size1]))", c1: 19.50, c2: 13.00, unit: "mm", category: "Nut" },
  "Nut, Grade NAS 6-Point": { formula: "([C1]*EXP([C2]*[Size1]))", c1: 7.80, c2: 13.00, unit: "mm", category: "Nut" },
  "Nut, Lug": { price: 26, unit: "unit", category: "Nut" },
  "Nut, Panel Retained": { formula: "[Quantity]*([C1]*EXP([C2]*[Size1]))", c1: 3.25, c2: 16.25, unit: "mm", category: "Nut" },
  "Nutsert (J-Nut)": { formula: "[C1]*EXP([C2]*[Size1])", c1: 3.25, c2: 16.25, unit: "mm", category: "Nut" },

  // Pins
  "Pin, Cotter, Straight": { price: 3.25, unit: "unit", category: "Pin" },
  "Pin, Cotter, Hairpin": { price: 5.20, unit: "unit", category: "Pin" },
  "Pin, Plastic Push": { price: 6.50, unit: "unit", category: "Pin" },
  "Pin, Safety, Coiled Wire": { formula: "[Quantity]*([C1]*[Size1]+[C2])", c1: 0.59, c2: 26.00, unit: "mm", category: "Pin" },
  "Pin, Safety, Square Retainer Snap": { formula: "[Quantity]*([C1]*[Size1]*[Size2]+[C2])", c1: 0.07, c2: 65.00, unit: "mm", category: "Pin" },
  "Pin, Quick Release": { formula: "[Quantity]*([C1]*[Size1]^2*[Size2]+[C2])", c1: 0.07, c2: 910.00, unit: "mm", category: "Pin" },

  // Rivets
  "Rivet, Pop": { price: 1.95, unit: "unit", category: "Rivet" },

  // Safety Wire
  "Safety Wire": { price: 0, unit: "unit", category: "Fastener - Misc" },

  // Studs
  "Stud, Grade 10.9 (SAE 8)": { formula: "[C1]/105154*[Size1]^2*[Size2]*SQRT([Size2])+([C2]*EXP(0.319*[Size1]))", c1: 65.00, c2: 0.26, unit: "mm", category: "Stud" },
  "Stud, Grade 12.9": { formula: "[C1]/105154*[Size1]^2*[Size2]*SQRT([Size2])+([C2]*EXP(0.319*[Size1]))", c1: 81.25, c2: 0.33, unit: "mm", category: "Stud" },
  "Stud, Grade 8.8 (SAE 5)": { formula: "[C1]/105154*[Size1]^2*[Size2]*SQRT([Size2])+([C2]*EXP(0.319*[Size1]))", c1: 52.00, c2: 0.20, unit: "mm", category: "Stud" },

  // Tapered Pin
  "Tapered Pin, Threaded (AN386)": { price: 162.50, unit: "unit", category: "Pin" },

  // Tie Wrap
  "Tie Wrap": { price: 2.60, unit: "unit", category: "Fastener - Misc" },

  // Thread Insert
  "Thread Insert": { formula: "[Quantity]*([C1]*[Size1])", c1: 6.50, c2: 0, unit: "mm", category: "Fastener - Misc" },

  // Washers
  "Washer, Grade 10.9 (SAE 8)": { price: 1.30, unit: "unit", category: "Washer" },
  "Washer, Grade 12.9": { price: 1.30, unit: "unit", category: "Washer" },
  "Washer, Grade 6.8 (SAE 3) and All Grades less than Metric 8.8": { price: 0.65, unit: "unit", category: "Washer" },
  "Washer, Grade 8.8 (SAE 5)": { price: 0.65, unit: "unit", category: "Washer" },
  "Washer, Grade AN": { formula: "([C1]*EXP([C2]*[Size1]))", c1: 0.33, c2: 11.70, unit: "mm", category: "Washer" },
  "Washer, Grade NAS 12-Point": { formula: "([C1]*EXP([C2]*[Size1]))", c1: 0.33, c2: 23.40, unit: "mm", category: "Washer" },
  "Washer, Grade NAS 6-Point": { formula: "([C1]*EXP([C2]*[Size1]))", c1: 0.33, c2: 23.40, unit: "mm", category: "Washer" }
};

export const getFastenersByCategory = () => {
  const byCategory = {};
  Object.entries(fastenersDatabase).forEach(([name, data]) => {
    const cat = data.category || 'Other';
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push({ name, ...data });
  });
  return byCategory;
};

export const getFastener = (name) => {
  return fastenersDatabase[name];
};
