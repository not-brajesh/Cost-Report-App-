// Cost calculation utilities

// Safe formula evaluation function
const safeEvaluateFormula = (formula) => {
  try {
    // Security validation: only allow numbers, operators, parentheses, and Math functions
    // This prevents malicious code injection
    const allowedPattern = /^[0-9+\-*/(). Mathsqrtlogexpabs]*$/;
    if (!allowedPattern.test(formula)) {
      console.error('Formula contains invalid characters:', formula);
      return 0;
    }
    
    // Use Function constructor instead of eval for safer evaluation
    const result = new Function('"use strict"; return (' + formula + ')')();
    
    // Fix float precision to 2 decimal places
    return Number(result.toFixed(2));
  } catch (error) {
    console.error('Formula evaluation error:', error);
    return 0;
  }
};

export const calculateMaterialCost = (material, size1 = 0, size2 = 0, quantity = 1, geometry = {}) => {
  if (!material) return 0;
  
  // Calculate geometry-based mass if geometry data is provided
  let geometryMultiplier = 1;
  let calculatedMass = 0;
  
  if (material.geometry && geometry && material.density) {
    const { length, width, height, thickness } = geometry;
    const density = material.density || 0; // kg per cm³
    
    // Convert mm inputs to cm for calculation (divide by 10)
    const lengthCm = (length || 0) / 10;
    const widthCm = (width || 0) / 10;
    const heightCm = (height || 0) / 10;
    const thicknessCm = (thickness || 0) / 10;
    const size1Cm = (size1 || 0) / 10;
    
    switch (material.geometry) {
      case 'length':
        // For rods/tubing: mass = length × cross-section area × density
        // size1 is used as diameter for tubing
        if (length && size1) {
          const radius = size1Cm / 2; // radius in cm
          const crossSectionArea = Math.PI * radius * radius; // cm²
          const volume = lengthCm * crossSectionArea; // cm³
          calculatedMass = volume * density; // kg
          geometryMultiplier = calculatedMass;
        }
        break;
        
      case 'area':
        // For sheets/plates/fibers: mass = area × thickness × density
        if (length && width) {
          const area = lengthCm * widthCm; // cm²
          const effectiveThickness = thicknessCm || size1Cm || 0.1; // default 1mm (0.1cm) if not specified
          const volume = area * effectiveThickness; // cm³
          calculatedMass = volume * density; // kg
          geometryMultiplier = calculatedMass;
        }
        break;
        
      case 'volume':
        // For blocks/billets: mass = volume × density
        if (length && width && height) {
          const volume = lengthCm * widthCm * heightCm; // cm³
          calculatedMass = volume * density; // kg
          geometryMultiplier = calculatedMass;
        } else if (length && width && thickness) {
          // Alternative: length × width × thickness
          const volume = lengthCm * widthCm * thicknessCm; // cm³
          calculatedMass = volume * density; // kg
          geometryMultiplier = calculatedMass;
        }
        break;
        
      default:
        geometryMultiplier = 1;
    }
  }
  
  // If material has a fixed price
  if (material.price !== undefined) {
    // For geometry-based materials, use calculated mass × price per kg
    if (material.geometry && calculatedMass > 0) {
      return material.price * calculatedMass * quantity;
    }
    return material.price * quantity;
  }
  
  // If material has a formula
  if (material.formula) {
    let formula = material.formula;
    
    try {
      // Safe variable replacement with fallback to 0
      formula = formula.replace(/\[C1\]/g, (material.c1 || 0).toString());
      formula = formula.replace(/\[C2\]/g, (material.c2 || 0).toString());
      formula = formula.replace(/\[Size1\]/g, (size1 || 0).toString());
      formula = formula.replace(/\[Size2\]/g, (size2 || 0).toString());
      formula = formula.replace(/\[Quantity\]/g, (quantity || 1).toString());
      
      // Strict function mapping - only allow specific Math functions
      formula = formula.replace(/SQRT\(/g, 'Math.sqrt(');
      formula = formula.replace(/EXP\(/g, 'Math.exp(');
      formula = formula.replace(/LN\(/g, 'Math.log(');
      formula = formula.replace(/LOG\(/g, 'Math.log10(');
      formula = formula.replace(/ABS\(/g, 'Math.abs(');
      
      // Handle power operator ^ (JavaScript uses **)
      formula = formula.replace(/\^/g, '**');
      
      // Sanitize: remove any remaining brackets that weren't replaced
      formula = formula.replace(/\[|\]/g, '');
      
      const cost = safeEvaluateFormula(formula);
      
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

export const calculateFastenerCost = (fastener, size1 = 0, size2 = 0, quantity = 1) => {
  if (!fastener) return 0;
  
  // If fastener has a fixed price
  if (fastener.price !== undefined) {
    return fastener.price * quantity;
  }
  
  // If fastener has a formula
  if (fastener.formula) {
    let formula = fastener.formula;
    
    try {
      // Safe variable replacement with fallback to 0
      formula = formula.replace(/\[C1\]/g, (fastener.c1 || 0).toString());
      formula = formula.replace(/\[C2\]/g, (fastener.c2 || 0).toString());
      formula = formula.replace(/\[Size1\]/g, (size1 || 0).toString());
      formula = formula.replace(/\[Size2\]/g, (size2 || 0).toString());
      formula = formula.replace(/\[Quantity\]/g, (quantity || 1).toString());
      
      // Strict function mapping - only allow specific Math functions
      formula = formula.replace(/SQRT\(/g, 'Math.sqrt(');
      formula = formula.replace(/EXP\(/g, 'Math.exp(');
      formula = formula.replace(/LN\(/g, 'Math.log(');
      formula = formula.replace(/LOG\(/g, 'Math.log10(');
      formula = formula.replace(/ABS\(/g, 'Math.abs(');
      
      // Handle power operator ^ (JavaScript uses **)
      formula = formula.replace(/\^/g, '**');
      
      // Sanitize: remove any remaining brackets that weren't replaced
      formula = formula.replace(/\[|\]/g, '');
      
      const cost = safeEvaluateFormula(formula);
      
      if (isNaN(cost) || !isFinite(cost)) {
        return 0;
      }
      
      return cost * quantity;
    } catch (error) {
      console.error('Error calculating fastener cost:', error);
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
