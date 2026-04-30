// Cost calculation utilities

export const calculateMaterialCost = (material, size1 = 0, size2 = 0, quantity = 1) => {
  if (!material) return 0;
  
  // If material has a fixed price
  if (material.price !== undefined) {
    return material.price * quantity;
  }
  
  // If material has a formula
  if (material.formula) {
    let formula = material.formula;
    let cost = 0;
    
    try {
      // Replace formula variables with values
      formula = formula.replace(/\[C1\]/g, material.c1 || 0);
      formula = formula.replace(/\[C2\]/g, material.c2 || 0);
      formula = formula.replace(/\[Size1\]/g, size1 || 0);
      formula = formula.replace(/\[Size2\]/g, size2 || 0);
      
      // Evaluate the formula safely
      // Handle power operator ^ (JavaScript uses **)
      formula = formula.replace(/\^/g, '**');
      
      cost = eval(formula);
      
      if (isNaN(cost) || !isFinite(cost)) {
        return 0;
      }
      
      return cost * quantity;
    } catch (error) {
      console.error('Error calculating material cost:', error);
      return 0;
    }
  }
  
  return 0;
};

export const calculateProcessCost = (process, quantity = 1, multiplier = 1) => {
  if (!process) return 0;
  
  const baseCost = process.unitCost || 0;
  return baseCost * quantity * multiplier;
};

export const calculateToolingCost = (tooling, quantity = 1) => {
  if (!tooling) return 0;
  
  const baseCost = tooling.cost || 0;
  return baseCost * quantity;
};

export const calculateTotalCost = (materialCost, fastenerCost = 0, assemblyCost = 0, processCost, toolingCost) => {
  return materialCost + fastenerCost + assemblyCost + processCost + toolingCost;
};

export const formatCurrency = (amount) => {
  if (amount === 'AIR') return 'AIR';
  if (isNaN(amount)) return '₹0';
  return '₹' + amount.toLocaleString('en-IN', { maximumFractionDigits: 2 });
};
