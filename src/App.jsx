import React, { useState, useEffect } from 'react';
import { Calculator, FileText, Settings, Download, Upload, Trash2, Plus, FileSpreadsheet, Moon, Sun } from 'lucide-react';
import { materialsDatabase, getMaterialsByCategory } from './data/materialsData';
import { processesDatabase, getProcessesByCategory } from './data/processesData';
import { toolingDatabase, getToolingByProcess } from './data/toolingData';
import { multipliersDatabase, getMultipliersByUse } from './data/multipliersData';
import { fastenersDatabase, getFastenersByCategory } from './data/fastenersData';
import { assemblyDatabase, getAssemblyByCategory } from './data/assemblyData';
import { calculateMaterialCost, calculateFastenerCost, calculateProcessCost, calculateToolingCost, calculateTotalCost, formatCurrency } from './utils/costCalculator';
import SearchableSelect from './components/SearchableSelect';
import * as XLSX from 'xlsx';
import './App.css';

function App() {
  const [parts, setParts] = useState([]);
  const [assemblies, setAssemblies] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [customMaterials, setCustomMaterials] = useState([]);
  const [customFasteners, setCustomFasteners] = useState([]);
  const [customProcesses, setCustomProcesses] = useState([]);
  const [customTooling, setCustomTooling] = useState([]);
  const [customAssemblies, setCustomAssemblies] = useState([]);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  
  // Header fields (global)
  const [headerData, setHeaderData] = useState({
    university: 'Ajeenkya DY Patil University',
    teamName: 'Team Javitron',
    carNumber: '',
    system: 'Engine & Drivetrain'
  });

  // Update Part header fields
  const updatePartHeader = (partId, field, value) => {
    setParts(parts.map(part => {
      if (part.id === partId) {
        return { ...part, [field]: value };
      }
      return part;
    }));
  };

  // Update Assembly header fields
  const updateAssemblyHeader = (assemblyId, field, value) => {
    setAssemblies(assemblies.map(assembly => {
      if (assembly.id === assemblyId) {
        return { ...assembly, [field]: value };
      }
      return assembly;
    }));
  };

  // Load custom items from localStorage on mount
  useEffect(() => {
    const loadCustom = (key, setter) => {
      const saved = localStorage.getItem(key);
      if (saved) {
        try {
          setter(JSON.parse(saved));
        } catch (e) {
          console.error(`Error loading ${key}:`, e);
        }
      }
    };
    loadCustom('custom_materials', setCustomMaterials);
    loadCustom('custom_fasteners', setCustomFasteners);
    loadCustom('custom_processes', setCustomProcesses);
    loadCustom('custom_tooling', setCustomTooling);
    loadCustom('custom_assemblies', setCustomAssemblies);
    
    // Load header data
    const savedHeader = localStorage.getItem('headerData');
    if (savedHeader) {
      try {
        setHeaderData(JSON.parse(savedHeader));
      } catch (e) {
        console.error('Error loading header data:', e);
      }
    }
  }, []);

  // Merge custom items with database
  const getAllMaterials = () => {
    const baseMaterials = Object.entries(materialsDatabase).map(([name, data]) => ({ name, ...data }));
    return [...baseMaterials, ...customMaterials];
  };

  const getAllFasteners = () => {
    const baseFasteners = Object.entries(fastenersDatabase).map(([name, data]) => ({ name, ...data }));
    return [...baseFasteners, ...customFasteners];
  };

  const getAllProcesses = () => {
    const baseProcesses = Object.entries(processesDatabase).map(([name, data]) => ({ name, ...data }));
    return [...baseProcesses, ...customProcesses];
  };

  const getAllTooling = () => {
    const baseTooling = Object.entries(toolingDatabase).map(([id, data]) => ({ 
      name: data.tool, 
      id: parseInt(id), 
      ...data 
    }));
    return [...baseTooling, ...customTooling];
  };

  const getAllAssemblies = () => {
    const baseAssemblies = Object.entries(assemblyDatabase).map(([name, data]) => ({ name, ...data }));
    return [...baseAssemblies, ...customAssemblies];
  };

  // Add new Part
  const addPart = () => {
    const newPart = {
      id: Date.now(),
      name: '',
      assemblyName: '',
      externalCost: 0,
      items: []
    };
    setParts([...parts, newPart]);
  };

  // Add new Assembly
  const addAssembly = () => {
    const newAssembly = {
      id: Date.now(),
      name: '',
      partName: '',
      externalCost: 0,
      items: []
    };
    setAssemblies([...assemblies, newAssembly]);
  };

  // Remove Part
  const removePart = (id) => {
    setParts(parts.filter(part => part.id !== id));
  };

  // Remove Assembly
  const removeAssembly = (id) => {
    setAssemblies(assemblies.filter(assembly => assembly.id !== id));
  };

  // Add item to Part
  const addItemToPart = (partId) => {
    const newItem = {
      id: Date.now(),
      material: '',
      size1: 0,
      size2: 0,
      materialQuantity: 1,
      // Geometry fields for material calculation
      materialLength: 0,
      materialWidth: 0,
      materialHeight: 0,
      materialThickness: 0,
      fastener: '',
      fastenerSize1: 0,
      fastenerSize2: 0,
      fastenerQuantity: 1,
      assembly: '',
      assemblyQuantity: 1,
      process: '',
      processQuantity: 1,
      multiplier: 1,
      tooling: '',
      toolingQuantity: 1,
      materialCost: 0,
      fastenerCost: 0,
      assemblyCost: 0,
      processCost: 0,
      toolingCost: 0,
      totalItemCost: 0
    };
    
    setParts(parts.map(part => {
      if (part.id === partId) {
        return { ...part, items: [...part.items, newItem] };
      }
      return part;
    }));
  };

  // Add item to Assembly
  const addItemToAssembly = (assemblyId) => {
    const newItem = {
      id: Date.now(),
      material: '',
      size1: 0,
      size2: 0,
      materialQuantity: 1,
      // Geometry fields for material calculation
      materialLength: 0,
      materialWidth: 0,
      materialHeight: 0,
      materialThickness: 0,
      fastener: '',
      fastenerSize1: 0,
      fastenerSize2: 0,
      fastenerQuantity: 1,
      assembly: '',
      assemblyQuantity: 1,
      process: '',
      processQuantity: 1,
      multiplier: 1,
      tooling: '',
      toolingQuantity: 1,
      materialCost: 0,
      fastenerCost: 0,
      assemblyCost: 0,
      processCost: 0,
      toolingCost: 0,
      totalItemCost: 0
    };
    
    setAssemblies(assemblies.map(assembly => {
      if (assembly.id === assemblyId) {
        return { ...assembly, items: [...assembly.items, newItem] };
      }
      return assembly;
    }));
  };

  // Update item field in Part
  const updatePartItem = (partId, itemId, field, value) => {
    setParts(parts.map(part => {
      if (part.id === partId) {
        const updatedItems = part.items.map(item => {
          if (item.id === itemId) {
            const updatedItem = { ...item, [field]: value };
            
            // Recalculate costs when relevant fields change
            if (['material', 'size1', 'size2', 'materialQuantity', 'materialLength', 'materialWidth', 'materialHeight', 'materialThickness'].includes(field)) {
              const material = materialsDatabase[updatedItem.material] || customMaterials.find(m => m.name === updatedItem.material);
              const geometry = {
                length: parseFloat(updatedItem.materialLength) || 0,
                width: parseFloat(updatedItem.materialWidth) || 0,
                height: parseFloat(updatedItem.materialHeight) || 0,
                thickness: parseFloat(updatedItem.materialThickness) || 0
              };
              updatedItem.materialCost = calculateMaterialCost(
                material,
                parseFloat(updatedItem.size1) || 0,
                parseFloat(updatedItem.size2) || 0,
                parseFloat(updatedItem.materialQuantity) || 1,
                geometry
              );
            }
            
            if (['fastener', 'fastenerSize1', 'fastenerSize2', 'fastenerQuantity'].includes(field)) {
              const fastener = fastenersDatabase[updatedItem.fastener] || customFasteners.find(f => f.name === updatedItem.fastener);
              updatedItem.fastenerCost = calculateFastenerCost(
                fastener,
                parseFloat(updatedItem.fastenerSize1) || 0,
                parseFloat(updatedItem.fastenerSize2) || 0,
                parseFloat(updatedItem.fastenerQuantity) || 1
              );
            }
            
            if (['assembly', 'assemblyQuantity'].includes(field)) {
              const assembly = assemblyDatabase[updatedItem.assembly] || customAssemblies.find(a => a.name === updatedItem.assembly);
              updatedItem.assemblyCost = (assembly?.cost || 0) * (parseFloat(updatedItem.assemblyQuantity) || 1);
            }
            
            if (['process', 'processQuantity', 'multiplier'].includes(field)) {
              const process = processesDatabase[updatedItem.process] || customProcesses.find(p => p.name === updatedItem.process);
              updatedItem.processCost = calculateProcessCost(
                process,
                parseFloat(updatedItem.processQuantity) || 1,
                parseFloat(updatedItem.multiplier) || 1
              );
            }
            
            if (['tooling', 'toolingQuantity'].includes(field)) {
              const tooling = toolingDatabase[updatedItem.tooling] || customTooling.find(t => t.id === parseInt(updatedItem.tooling));
              updatedItem.toolingCost = calculateToolingCost(
                tooling,
                parseFloat(updatedItem.toolingQuantity) || 1
              );
            }
            
            updatedItem.totalItemCost = calculateTotalCost(
              updatedItem.materialCost,
              updatedItem.fastenerCost,
              updatedItem.assemblyCost,
              updatedItem.processCost,
              updatedItem.toolingCost
            );
            
            return updatedItem;
          }
          return item;
        });
        return { ...part, items: updatedItems };
      }
      return part;
    }));
  };

  // Update item field in Assembly
  const updateAssemblyItem = (assemblyId, itemId, field, value) => {
    setAssemblies(assemblies.map(assembly => {
      if (assembly.id === assemblyId) {
        const updatedItems = assembly.items.map(item => {
          if (item.id === itemId) {
            const updatedItem = { ...item, [field]: value };
            
            // Recalculate costs when relevant fields change
            if (['material', 'size1', 'size2', 'materialQuantity', 'materialLength', 'materialWidth', 'materialHeight', 'materialThickness'].includes(field)) {
              const material = materialsDatabase[updatedItem.material] || customMaterials.find(m => m.name === updatedItem.material);
              const geometry = {
                length: parseFloat(updatedItem.materialLength) || 0,
                width: parseFloat(updatedItem.materialWidth) || 0,
                height: parseFloat(updatedItem.materialHeight) || 0,
                thickness: parseFloat(updatedItem.materialThickness) || 0
              };
              updatedItem.materialCost = calculateMaterialCost(
                material,
                parseFloat(updatedItem.size1) || 0,
                parseFloat(updatedItem.size2) || 0,
                parseFloat(updatedItem.materialQuantity) || 1,
                geometry
              );
            }
            
            if (['fastener', 'fastenerSize1', 'fastenerSize2', 'fastenerQuantity'].includes(field)) {
              const fastener = fastenersDatabase[updatedItem.fastener] || customFasteners.find(f => f.name === updatedItem.fastener);
              updatedItem.fastenerCost = calculateFastenerCost(
                fastener,
                parseFloat(updatedItem.fastenerSize1) || 0,
                parseFloat(updatedItem.fastenerSize2) || 0,
                parseFloat(updatedItem.fastenerQuantity) || 1
              );
            }
            
            if (['assembly', 'assemblyQuantity'].includes(field)) {
              const assembly = assemblyDatabase[updatedItem.assembly] || customAssemblies.find(a => a.name === updatedItem.assembly);
              updatedItem.assemblyCost = calculateProcessCost(
                assembly,
                parseFloat(updatedItem.assemblyQuantity) || 1,
                1
              );
            }
            
            if (['process', 'processQuantity', 'multiplier'].includes(field)) {
              const process = processesDatabase[updatedItem.process] || customProcesses.find(p => p.name === updatedItem.process);
              updatedItem.processCost = calculateProcessCost(
                process,
                parseFloat(updatedItem.processQuantity) || 1,
                parseFloat(updatedItem.multiplier) || 1
              );
            }
            
            if (['tooling', 'toolingQuantity'].includes(field)) {
              const tooling = toolingDatabase[updatedItem.tooling] || customTooling.find(t => t.name === updatedItem.tooling);
              updatedItem.toolingCost = calculateToolingCost(
                tooling,
                parseFloat(updatedItem.toolingQuantity) || 1
              );
            }
            
            updatedItem.totalItemCost = calculateTotalCost(
              updatedItem.materialCost,
              updatedItem.fastenerCost,
              updatedItem.assemblyCost,
              updatedItem.processCost,
              updatedItem.toolingCost
            );
            
            return updatedItem;
          }
          return item;
        });
        return { ...assembly, items: updatedItems };
      }
      return assembly;
    }));
  };

  // Remove item from Part
  const removePartItem = (partId, itemId) => {
    setParts(parts.map(part => {
      if (part.id === partId) {
        return { ...part, items: part.items.filter(item => item.id !== itemId) };
      }
      return part;
    }));
  };

  // Remove item from Assembly
  const removeAssemblyItem = (assemblyId, itemId) => {
    setAssemblies(assemblies.map(assembly => {
      if (assembly.id === assemblyId) {
        return { ...assembly, items: assembly.items.filter(item => item.id !== itemId) };
      }
      return assembly;
    }));
  };

  // Calculate total cost
  useEffect(() => {
    const partsTotal = parts.reduce((sum, part) => {
      return sum + part.items.reduce((itemSum, item) => itemSum + item.totalItemCost, 0) + (part.externalCost || 0);
    }, 0);
    const assembliesTotal = assemblies.reduce((sum, assembly) => {
      return sum + assembly.items.reduce((itemSum, item) => itemSum + item.totalItemCost, 0) + (assembly.externalCost || 0);
    }, 0);
    setTotalCost(partsTotal + assembliesTotal);
  }, [parts, assemblies]);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('costReportParts', JSON.stringify(parts));
    localStorage.setItem('costReportAssemblies', JSON.stringify(assemblies));
    localStorage.setItem('headerData', JSON.stringify(headerData));
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [parts, assemblies, headerData, darkMode]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedParts = localStorage.getItem('costReportParts');
    const savedAssemblies = localStorage.getItem('costReportAssemblies');
    if (savedParts) {
      try {
        setParts(JSON.parse(savedParts));
      } catch (e) {
        console.error('Error loading saved parts:', e);
      }
    }
    if (savedAssemblies) {
      try {
        setAssemblies(JSON.parse(savedAssemblies));
      } catch (e) {
        console.error('Error loading saved assemblies:', e);
      }
    }
  }, []);

  // Export data to Excel (matching example format)
  const exportData = () => {
    const wb = XLSX.utils.book_new();
    
    // Create Parts sheet
    const partsWsData = [];
    parts.forEach((part, partIndex) => {
      // Header section for Part
      partsWsData.push(['University', headerData.university, null, 'Team Name', headerData.teamName, null, null, null, null, 'Car #', headerData.carNumber, null, 'Part Cost']);
      partsWsData.push(['System', headerData.system, null, 'File Link1', null, null, null, null, null, null, null, null, 'Qty']);
      partsWsData.push(['Assembly', part.assemblyName || '', null, 'File link2', null, null, null, null, null, 'File Link1']);
      partsWsData.push(['Part', part.name || '', null, 'File link 3', null, null, null, null, null, 'File Link2', null, null, 'External Cost', part.externalCost || 0]);
      partsWsData.push(['P/N Base', null, null, null, null, null, null, null, null, 'File Link3']);
      partsWsData.push(['Suffix']);
      partsWsData.push(['Details']);
      partsWsData.push([]);
      
      // Materials table
      partsWsData.push(['Item order', 'Material', 'Use', 'Unit Cost', 'Size 1', 'Unit 1', 'Size 2', 'Unit 2', 'Area Name', 'Area', 'Length', 'density', 'Quantity', 'Sub Total']);
      part.items.forEach((item, index) => {
        if (item.material) {
          const material = materialsDatabase[item.material] || customMaterials.find(m => m.name === item.material);
          partsWsData.push([
            index + 1,
            item.material,
            '',
            material?.price || material?.tablePrice || 0,
            item.size1 || 0,
            material?.unit || '',
            item.size2 || 0,
            '',
            '',
            '',
            '',
            '',
            item.materialQuantity || 1,
            item.materialCost || 0
          ]);
        }
      });
      partsWsData.push([null, null, null, null, null, null, null, null, null, null, null, null, 'Sub Total', part.items.reduce((sum, i) => sum + (i.materialCost || 0), 0)]);
      partsWsData.push([]);
      
      // Process table
      partsWsData.push(['Item Order', 'Process', 'Use', 'Unit Cost', 'Unit', 'Quantity', 'Multiplier', 'Mult. Val.', 'Sub Total']);
      part.items.forEach((item, index) => {
        if (item.process) {
          const process = processesDatabase[item.process] || customProcesses.find(p => p.name === item.process);
          partsWsData.push([
            index + 1,
            item.process,
            '',
            process?.unitCost || 0,
            process?.unit || '',
            item.processQuantity || 1,
            item.multiplier || 1,
            item.multiplier || 1,
            item.processCost || 0
          ]);
        }
      });
      partsWsData.push([null, null, null, null, null, null, null, null, '₹']);
      partsWsData.push([null, null, null, null, null, null, null, 'Sub Total', '₹', part.items.reduce((sum, i) => sum + (i.processCost || 0), 0)]);
      partsWsData.push([]);
      
      // Fastener table
      partsWsData.push(['Item Order', 'Fastener', 'Use', 'Unit cost', 'Size1', 'Unit1', 'Size2', 'Unit2', 'Quantity', 'Sub Total']);
      part.items.forEach((item, index) => {
        if (item.fastener) {
          const fastener = fastenersDatabase[item.fastener] || customFasteners.find(f => f.name === item.fastener);
          partsWsData.push([
            index + 1,
            item.fastener,
            '',
            fastener?.price || 0,
            item.fastenerSize1 || 0,
            fastener?.unit || '',
            item.fastenerSize2 || 0,
            '',
            item.fastenerQuantity || 1,
            item.fastenerCost || 0
          ]);
        }
      });
      partsWsData.push([null, null, null, null, null, null, null, null, 'Sub Total', part.items.reduce((sum, i) => sum + (i.fastenerCost || 0), 0)]);
      partsWsData.push([]);
      
      // Assembly table
      partsWsData.push(['Item Order', 'Assembly', 'Use', 'Unit Cost', 'Unit', 'Quantity', 'Sub Total']);
      part.items.forEach((item, index) => {
        if (item.assembly) {
          const assembly = assemblyDatabase[item.assembly] || customAssemblies.find(a => a.name === item.assembly);
          partsWsData.push([
            index + 1,
            item.assembly,
            '',
            assembly?.unitCost || 0,
            assembly?.unit || '',
            item.assemblyQuantity || 1,
            item.assemblyCost || 0
          ]);
        }
      });
      partsWsData.push([null, null, null, null, null, 'Sub Total', part.items.reduce((sum, i) => sum + (i.assemblyCost || 0), 0)]);
      partsWsData.push([]);
      
      // Tooling table
      partsWsData.push(['Item Order', 'Tooling', 'Use', 'Unit Cost', 'Unit', 'Quantity', 'PVF', 'Fractioning', 'Sub Total']);
      part.items.forEach((item, index) => {
        if (item.tooling) {
          const tooling = toolingDatabase[item.tooling] || customTooling.find(t => t.name === item.tooling);
          partsWsData.push([
            index + 1,
            tooling?.tool || item.tooling,
            '',
            tooling?.cost || 0,
            tooling?.unit || '',
            item.toolingQuantity || 1,
            '',
            '',
            item.toolingCost || 0
          ]);
        }
      });
      partsWsData.push([null, null, null, null, null, null, null, 'Sub Total', '₹', part.items.reduce((sum, i) => sum + (i.toolingCost || 0), 0)]);
      partsWsData.push([]);
    });
    
    if (parts.length > 0) {
      const partsWs = XLSX.utils.aoa_to_sheet(partsWsData);
      partsWs['!cols'] = [
        { wch: 12 }, { wch: 25 }, { wch: 12 }, { wch: 12 }, { wch: 10 }, { wch: 10 }, 
        { wch: 10 }, { wch: 10 }, { wch: 12 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 12 }, { wch: 12 }
      ];
      XLSX.utils.book_append_sheet(wb, partsWs, 'Parts');
    }
    
    // Create Assemblies sheet
    const assembliesWsData = [];
    assemblies.forEach((assembly, assemblyIndex) => {
      assembliesWsData.push(['University', headerData.university, null, 'Team Name', headerData.teamName, null, null, null, null, 'Car #', headerData.carNumber, null, 'Part Cost']);
      assembliesWsData.push(['System', headerData.system, null, 'File Link1', null, null, null, null, null, null, null, null, 'Qty']);
      assembliesWsData.push(['Assembly', assembly.name || '', null, 'File link2', null, null, null, null, null, 'File Link1']);
      assembliesWsData.push(['Part', assembly.partName || '', null, 'File link 3', null, null, null, null, null, 'File Link2', null, null, 'External Cost', assembly.externalCost || 0]);
      assembliesWsData.push(['P/N Base', null, null, null, null, null, null, null, null, 'File Link3']);
      assembliesWsData.push(['Suffix']);
      assembliesWsData.push(['Details']);
      assembliesWsData.push([]);
      
      // Same tables as Parts
      assembliesWsData.push(['Item order', 'Material', 'Use', 'Unit Cost', 'Size 1', 'Unit 1', 'Size 2', 'Unit 2', 'Area Name', 'Area', 'Length', 'density', 'Quantity', 'Sub Total']);
      assembly.items.forEach((item, index) => {
        if (item.material) {
          const material = materialsDatabase[item.material] || customMaterials.find(m => m.name === item.material);
          assembliesWsData.push([
            index + 1,
            item.material,
            '',
            material?.price || material?.tablePrice || 0,
            item.size1 || 0,
            material?.unit || '',
            item.size2 || 0,
            '',
            '',
            '',
            '',
            '',
            item.materialQuantity || 1,
            item.materialCost || 0
          ]);
        }
      });
      assembliesWsData.push([null, null, null, null, null, null, null, null, null, null, null, null, 'Sub Total', assembly.items.reduce((sum, i) => sum + (i.materialCost || 0), 0)]);
      assembliesWsData.push([]);
      
      assembliesWsData.push(['Item Order', 'Process', 'Use', 'Unit Cost', 'Unit', 'Quantity', 'Multiplier', 'Mult. Val.', 'Sub Total']);
      assembly.items.forEach((item, index) => {
        if (item.process) {
          const process = processesDatabase[item.process] || customProcesses.find(p => p.name === item.process);
          assembliesWsData.push([
            index + 1,
            item.process,
            '',
            process?.unitCost || 0,
            process?.unit || '',
            item.processQuantity || 1,
            item.multiplier || 1,
            item.multiplier || 1,
            item.processCost || 0
          ]);
        }
      });
      assembliesWsData.push([null, null, null, null, null, null, null, null, '₹']);
      assembliesWsData.push([null, null, null, null, null, null, null, 'Sub Total', '₹', assembly.items.reduce((sum, i) => sum + (i.processCost || 0), 0)]);
      assembliesWsData.push([]);
      
      assembliesWsData.push(['Item Order', 'Fastener', 'Use', 'Unit cost', 'Size1', 'Unit1', 'Size2', 'Unit2', 'Quantity', 'Sub Total']);
      assembly.items.forEach((item, index) => {
        if (item.fastener) {
          const fastener = fastenersDatabase[item.fastener] || customFasteners.find(f => f.name === item.fastener);
          assembliesWsData.push([
            index + 1,
            item.fastener,
            '',
            fastener?.price || 0,
            item.fastenerSize1 || 0,
            fastener?.unit || '',
            item.fastenerSize2 || 0,
            '',
            item.fastenerQuantity || 1,
            item.fastenerCost || 0
          ]);
        }
      });
      assembliesWsData.push([null, null, null, null, null, null, null, null, 'Sub Total', assembly.items.reduce((sum, i) => sum + (i.fastenerCost || 0), 0)]);
      assembliesWsData.push([]);
      
      assembliesWsData.push(['Item Order', 'Assembly', 'Use', 'Unit Cost', 'Unit', 'Quantity', 'Sub Total']);
      assembly.items.forEach((item, index) => {
        if (item.assembly) {
          const assemblyItem = assemblyDatabase[item.assembly] || customAssemblies.find(a => a.name === item.assembly);
          assembliesWsData.push([
            index + 1,
            item.assembly,
            '',
            assemblyItem?.unitCost || 0,
            assemblyItem?.unit || '',
            item.assemblyQuantity || 1,
            item.assemblyCost || 0
          ]);
        }
      });
      assembliesWsData.push([null, null, null, null, null, 'Sub Total', assembly.items.reduce((sum, i) => sum + (i.assemblyCost || 0), 0)]);
      assembliesWsData.push([]);
      
      assembliesWsData.push(['Item Order', 'Tooling', 'Use', 'Unit Cost', 'Unit', 'Quantity', 'PVF', 'Fractioning', 'Sub Total']);
      assembly.items.forEach((item, index) => {
        if (item.tooling) {
          const tooling = toolingDatabase[item.tooling] || customTooling.find(t => t.name === item.tooling);
          assembliesWsData.push([
            index + 1,
            tooling?.tool || item.tooling,
            '',
            tooling?.cost || 0,
            tooling?.unit || '',
            item.toolingQuantity || 1,
            '',
            '',
            item.toolingCost || 0
          ]);
        }
      });
      assembliesWsData.push([null, null, null, null, null, null, null, 'Sub Total', '₹', assembly.items.reduce((sum, i) => sum + (i.toolingCost || 0), 0)]);
      assembliesWsData.push([]);
    });
    
    if (assemblies.length > 0) {
      const assembliesWs = XLSX.utils.aoa_to_sheet(assembliesWsData);
      assembliesWs['!cols'] = [
        { wch: 12 }, { wch: 25 }, { wch: 12 }, { wch: 12 }, { wch: 10 }, { wch: 10 }, 
        { wch: 10 }, { wch: 10 }, { wch: 12 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 12 }, { wch: 12 }
      ];
      XLSX.utils.book_append_sheet(wb, assembliesWs, 'Assemblies');
    }
    
    // Generate filename with date
    const date = new Date().toISOString().split('T')[0];
    XLSX.writeFile(wb, `cost-report-${date}.xlsx`);
  };

  // Clear all
  const clearAll = () => {
    if (confirm('Are you sure you want to clear all Parts and Assemblies?')) {
      setParts([]);
      setAssemblies([]);
      localStorage.removeItem('costReportParts');
      localStorage.removeItem('costReportAssemblies');
    }
  };

  const materialsByCategory = getMaterialsByCategory();
  const processesByCategory = getProcessesByCategory();
  const fastenersByCategory = getFastenersByCategory();
  const categories = ['All', ...Object.keys(materialsByCategory).sort()];

  // Handle custom item additions
  const handleCustomMaterialAdd = (customItem) => {
    setCustomMaterials([...customMaterials, customItem]);
    // Also add to materialsDatabase for cost calculation
    materialsDatabase[customItem.name] = {
      price: customItem.price,
      unit: customItem.unit,
      category: 'Custom'
    };
  };

  const handleCustomFastenerAdd = (customItem) => {
    setCustomFasteners([...customFasteners, customItem]);
    fastenersDatabase[customItem.name] = {
      price: customItem.price,
      unit: customItem.unit,
      category: 'Custom'
    };
  };

  const handleCustomProcessAdd = (customItem) => {
    setCustomProcesses([...customProcesses, customItem]);
    processesDatabase[customItem.name] = {
      unitCost: customItem.price,
      unit: customItem.unit,
      category: 'Custom'
    };
  };

  const handleCustomToolingAdd = (customItem) => {
    const newId = Date.now();
    setCustomTooling([...customTooling, { ...customItem, id: newId }]);
    toolingDatabase[newId] = {
      process: 'Custom',
      tool: customItem.name,
      cost: customItem.price,
      unit: customItem.unit
    };
  };

  const handleCustomAssemblyAdd = (customItem) => {
    setCustomAssemblies([...customAssemblies, customItem]);
    assemblyDatabase[customItem.name] = {
      unitCost: customItem.price,
      unit: customItem.unit,
      category: 'Custom'
    };
  };

  return (
    <div className="app">
      {/* Main Neumorphism Card */}
      <div className="main-card">
        {/* Header */}
        <div className="app-header-neu">
          <span className="header-title">SUPRA SAEINDIA</span>
          <button className="add-btn" onClick={addPart}>+</button>
        </div>

        {/* Dark SOS Box - Total Cost Display */}
        <div className="sos-box">
          <div className="cost-display-box">
            <div className="cost-label">Total Cost</div>
            <div className="cost-value">₹{totalCost.toLocaleString()}</div>
          </div>
          <div className="action-btn" onClick={() => { addPart(); addAssembly(); }}>
            ADD ITEMS
          </div>
        </div>

        {/* Dots Indicator */}
        <div className="dots">
          <div className="dot active"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{parts.length}</div>
            <div className="stat-label">Parts</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{assemblies.length}</div>
            <div className="stat-label">Assemblies</div>
          </div>
        </div>

        {/* Small Cards Row */}
        <div className="row">
          <div className="small-card" onClick={exportData}>
            <FileSpreadsheet className="small-card-icon" />
            <div className="small-card-text">Export</div>
          </div>
          <div className="small-card" onClick={clearAll}>
            <Trash2 className="small-card-icon" />
            <div className="small-card-text">Clear</div>
          </div>
        </div>

        {/* Parts List Preview */}
        {parts.length > 0 && (
          <>
            <div className="section-title-neu" style={{marginTop: '25px'}}>Recent Parts</div>
            <div className="list-container-neu">
              {parts.slice(0, 3).map(part => (
                <div key={part.id} className="list-item-neu">
                  <span>{part.name || 'Unnamed'}</span>
                  <span>₹{part.items.reduce((sum, i) => sum + (i.totalItemCost || 0), 0).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Team Info */}
        <div className="section-title-neu" style={{marginTop: '20px'}}>Team Info</div>
        <input 
          className="input-neu" 
          placeholder="University"
          value={headerData.university}
          onChange={(e) => setHeaderData({...headerData, university: e.target.value})}
        />
        <div className="btn-row" style={{marginTop: '15px'}}>
          <input 
            className="input-neu" 
            placeholder="Team Name"
            value={headerData.teamName}
            onChange={(e) => setHeaderData({...headerData, teamName: e.target.value})}
          />
          <input 
            className="input-neu" 
            placeholder="Car #"
            value={headerData.carNumber}
            onChange={(e) => setHeaderData({...headerData, carNumber: e.target.value})}
          />
        </div>

        {/* Action Buttons */}
        <div className="btn-row">
          <button className="btn-neu" onClick={addPart}>
            <Plus size={18} />
            Add Part
          </button>
          <button className="btn-neu" onClick={addAssembly}>
            <Plus size={18} />
            Add Assembly
          </button>
        </div>
        <div className="btn-row">
          <button className="btn-neu" onClick={exportData}>
            <Download size={18} />
            Export
          </button>
          <button className="btn-neu danger" onClick={clearAll}>
            <Trash2 size={18} />
            Clear
          </button>
        </div>
      </div>

      {/* Full App Content (Hidden Behind Card for Logic) */}
      <main className="app-main" style={{display: 'none'}}>
        <div className="header-section">
          <h3>Report Header</h3>
          <div className="header-form">
            <div className="form-group">
              <label>University:</label>
              <input
                type="text"
                value={headerData.university}
                onChange={(e) => setHeaderData({...headerData, university: e.target.value})}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Team Name:</label>
              <input
                type="text"
                value={headerData.teamName}
                onChange={(e) => setHeaderData({...headerData, teamName: e.target.value})}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Car #:</label>
              <input
                type="text"
                value={headerData.carNumber}
                onChange={(e) => setHeaderData({...headerData, carNumber: e.target.value})}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>System:</label>
              <input
                type="text"
                value={headerData.system}
                onChange={(e) => setHeaderData({...headerData, system: e.target.value})}
                className="form-input"
              />
            </div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-item">
            <span className="summary-label">Total Parts:</span>
            <span className="summary-value">{parts.length}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Total Assemblies:</span>
            <span className="summary-value">{assemblies.length}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Total Cost:</span>
            <span className="summary-value summary-cost">{formatCurrency(totalCost)}</span>
          </div>
        </div>

        <div className="sections-container">
          <div className="section-block">
            <h2>Parts</h2>
            {parts.length === 0 ? (
              <div className="empty-state">
                <FileText size={64} strokeWidth={1.5} className="icon-empty" />
                <p>No Parts added yet. Click "Add Part" to start.</p>
              </div>
            ) : (
              parts.map(part => (
                <div key={part.id} className="part-card">
                  <div className="part-header">
                    <div className="part-header-content">
                      <h3>Part #{parts.findIndex(p => p.id === part.id) + 1}</h3>
                      <button 
                        onClick={() => removePart(part.id)}
                        className="btn-icon btn-remove"
                        title="Remove Part"
                      >
                        <Trash2 size={18} strokeWidth={2} className="icon-danger" />
                      </button>
                    </div>
                    <div className="part-header-form">
                      <div className="form-group">
                        <label>Assembly Name:</label>
                        <input
                          type="text"
                          value={part.assemblyName}
                          onChange={(e) => updatePartHeader(part.id, 'assemblyName', e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label>Part Name:</label>
                        <input
                          type="text"
                          value={part.name}
                          onChange={(e) => updatePartHeader(part.id, 'name', e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label>External Cost (₹):</label>
                        <input
                          type="number"
                          value={part.externalCost}
                          onChange={(e) => updatePartHeader(part.id, 'externalCost', parseFloat(e.target.value) || 0)}
                          className="form-input"
                          step="0.01"
                        />
                      </div>
                    </div>
                    <button onClick={() => addItemToPart(part.id)} className="btn btn-sm btn-primary">
                      <Plus size={18} strokeWidth={2.5} className="icon-white" />
                      Add Item
                    </button>
                  </div>

                  {part.items.map(item => (
                    <div key={item.id} className="item-card">
                      <div className="item-header">
                        <h4>Item #{part.items.findIndex(i => i.id === item.id) + 1}</h4>
                        <button 
                          onClick={() => removePartItem(part.id, item.id)}
                          className="btn-icon btn-remove"
                          title="Remove item"
                        >
                          <Trash2 size={18} strokeWidth={2} className="icon-danger" />
                        </button>
                      </div>
                      <div className="item-section">
                        <h4>Material</h4>
                        <div className="form-row">
                          <SearchableSelect
                            value={item.material}
                            onChange={(value) => updatePartItem(part.id, item.id, 'material', value)}
                            options={getAllMaterials()}
                            placeholder="Select Material"
                            customType="material"
                            onCustomAdd={handleCustomMaterialAdd}
                          />
                        </div>
                        {materialsDatabase[item.material]?.formula && (
                          <div className="form-row">
                            <div className="form-group">
                              <label>Size 1:</label>
                              <input
                                type="number"
                                value={item.size1}
                                onChange={(e) => updatePartItem(part.id, item.id, 'size1', e.target.value)}
                                className="form-input"
                                step="0.01"
                              />
                            </div>
                            <div className="form-group">
                              <label>Size 2:</label>
                              <input
                                type="number"
                                value={item.size2}
                                onChange={(e) => updatePartItem(part.id, item.id, 'size2', e.target.value)}
                                className="form-input"
                                step="0.01"
                              />
                            </div>
                            <div className="form-group">
                              <label>Quantity:</label>
                              <input
                                type="number"
                                value={item.materialQuantity}
                                onChange={(e) => updatePartItem(part.id, item.id, 'materialQuantity', e.target.value)}
                                className="form-input"
                                min="1"
                              />
                            </div>
                          </div>
                        )}
                        {/* Geometry inputs for raw materials */}
                        {materialsDatabase[item.material]?.geometry && (
                          <div className="form-row geometry-inputs">
                            {(materialsDatabase[item.material]?.geometry === 'length' || 
                              materialsDatabase[item.material]?.geometry === 'area' || 
                              materialsDatabase[item.material]?.geometry === 'volume') && (
                              <div className="form-group">
                                <label>Length (mm):</label>
                                <input
                                  type="number"
                                  value={item.materialLength}
                                  onChange={(e) => updatePartItem(part.id, item.id, 'materialLength', e.target.value)}
                                  className="form-input"
                                  step="0.1"
                                  placeholder="mm"
                                />
                              </div>
                            )}
                            {(materialsDatabase[item.material]?.geometry === 'area' || 
                              materialsDatabase[item.material]?.geometry === 'volume') && (
                              <div className="form-group">
                                <label>Width (mm):</label>
                                <input
                                  type="number"
                                  value={item.materialWidth}
                                  onChange={(e) => updatePartItem(part.id, item.id, 'materialWidth', e.target.value)}
                                  className="form-input"
                                  step="0.1"
                                  placeholder="mm"
                                />
                              </div>
                            )}
                            {(materialsDatabase[item.material]?.geometry === 'volume') && (
                              <>
                                <div className="form-group">
                                  <label>Height (mm):</label>
                                  <input
                                    type="number"
                                    value={item.materialHeight}
                                    onChange={(e) => updatePartItem(part.id, item.id, 'materialHeight', e.target.value)}
                                    className="form-input"
                                    step="0.1"
                                    placeholder="mm"
                                  />
                                </div>
                                <div className="form-group">
                                  <label>Thickness (mm):</label>
                                  <input
                                    type="number"
                                    value={item.materialThickness}
                                    onChange={(e) => updatePartItem(part.id, item.id, 'materialThickness', e.target.value)}
                                    className="form-input"
                                    step="0.01"
                                    placeholder="mm"
                                  />
                                </div>
                              </>
                            )}
                            {materialsDatabase[item.material]?.geometry === 'area' && (
                              <div className="form-group">
                                <label>Thickness (mm):</label>
                                <input
                                  type="number"
                                  value={item.materialThickness}
                                  onChange={(e) => updatePartItem(part.id, item.id, 'materialThickness', e.target.value)}
                                  className="form-input"
                                  step="0.01"
                                  placeholder="mm"
                                />
                              </div>
                            )}
                            <div className="form-group">
                              <label>Quantity:</label>
                              <input
                                type="number"
                                value={item.materialQuantity}
                                onChange={(e) => updatePartItem(part.id, item.id, 'materialQuantity', e.target.value)}
                                className="form-input"
                                min="1"
                              />
                            </div>
                          </div>
                        )}
                        {materialsDatabase[item.material]?.price !== undefined && !materialsDatabase[item.material]?.geometry && (
                          <div className="form-row">
                            <div className="form-group">
                              <label>Quantity:</label>
                              <input
                                type="number"
                                value={item.materialQuantity}
                                onChange={(e) => updatePartItem(part.id, item.id, 'materialQuantity', e.target.value)}
                                className="form-input"
                                min="1"
                              />
                            </div>
                          </div>
                        )}
                        <div className="cost-display">
                          <span>Material Cost:</span>
                          <span className="cost-value">{formatCurrency(item.materialCost)}</span>
                        </div>
                      </div>

                      <div className="item-section">
                        <h4>Fastener</h4>
                        <div className="form-row">
                          <SearchableSelect
                            value={item.fastener}
                            onChange={(value) => updatePartItem(part.id, item.id, 'fastener', value)}
                            options={getAllFasteners()}
                            placeholder="Select Fastener"
                            customType="fastener"
                            onCustomAdd={handleCustomFastenerAdd}
                          />
                        </div>
                        {fastenersDatabase[item.fastener]?.formula && (
                          <div className="form-row">
                            <div className="form-group">
                              <label>Size 1:</label>
                              <input
                                type="number"
                                value={item.fastenerSize1}
                                onChange={(e) => updatePartItem(part.id, item.id, 'fastenerSize1', e.target.value)}
                                className="form-input"
                                step="0.01"
                              />
                            </div>
                            <div className="form-group">
                              <label>Size 2:</label>
                              <input
                                type="number"
                                value={item.fastenerSize2}
                                onChange={(e) => updatePartItem(part.id, item.id, 'fastenerSize2', e.target.value)}
                                className="form-input"
                                step="0.01"
                              />
                            </div>
                            <div className="form-group">
                              <label>Quantity:</label>
                              <input
                                type="number"
                                value={item.fastenerQuantity}
                                onChange={(e) => updatePartItem(part.id, item.id, 'fastenerQuantity', e.target.value)}
                                className="form-input"
                                min="1"
                              />
                            </div>
                          </div>
                        )}
                        {fastenersDatabase[item.fastener]?.price !== undefined && (
                          <div className="form-row">
                            <div className="form-group">
                              <label>Quantity:</label>
                              <input
                                type="number"
                                value={item.fastenerQuantity}
                                onChange={(e) => updatePartItem(part.id, item.id, 'fastenerQuantity', e.target.value)}
                                className="form-input"
                                min="1"
                              />
                            </div>
                          </div>
                        )}
                        <div className="cost-display">
                          <span>Fastener Cost:</span>
                          <span className="cost-value">{formatCurrency(item.fastenerCost)}</span>
                        </div>
                      </div>

                      <div className="item-section">
                        <h4>Assembly</h4>
                        <div className="form-row">
                          <SearchableSelect
                            value={item.assembly}
                            onChange={(value) => updatePartItem(part.id, item.id, 'assembly', value)}
                            options={getAllAssemblies()}
                            placeholder="Select Assembly"
                            customType="assembly"
                            onCustomAdd={handleCustomAssemblyAdd}
                          />
                        </div>
                        <div className="form-row">
                          <div className="form-group">
                            <label>Quantity:</label>
                            <input
                              type="number"
                              value={item.assemblyQuantity}
                              onChange={(e) => updatePartItem(part.id, item.id, 'assemblyQuantity', e.target.value)}
                              className="form-input"
                              min="1"
                            />
                          </div>
                        </div>
                        <div className="cost-display">
                          <span>Assembly Cost:</span>
                          <span className="cost-value">{formatCurrency(item.assemblyCost)}</span>
                        </div>
                      </div>

                      <div className="item-section">
                        <h4>Process</h4>
                        <div className="form-row">
                          <SearchableSelect
                            value={item.process}
                            onChange={(value) => updatePartItem(part.id, item.id, 'process', value)}
                            options={getAllProcesses()}
                            placeholder="Select Process"
                            customType="process"
                            onCustomAdd={handleCustomProcessAdd}
                          />
                        </div>
                        <div className="form-row">
                          <div className="form-group">
                            <label>Quantity:</label>
                            <input
                              type="number"
                              value={item.processQuantity}
                              onChange={(e) => updatePartItem(part.id, item.id, 'processQuantity', e.target.value)}
                              className="form-input"
                              min="1"
                            />
                          </div>
                          <div className="form-group">
                            <label>Multiplier:</label>
                            <select
                              value={item.multiplier}
                              onChange={(e) => updatePartItem(part.id, item.id, 'multiplier', parseFloat(e.target.value))}
                              className="form-select"
                            >
                              <option value={1}>1.0 (None)</option>
                              {Object.entries(multipliersDatabase).map(([id, mult]) => (
                                <option key={id} value={mult.multiplier}>
                                  {mult.multiplier} - {mult.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="cost-display">
                          <span>Process Cost:</span>
                          <span className="cost-value">{formatCurrency(item.processCost)}</span>
                        </div>
                      </div>

                      <div className="item-section">
                        <h4>Tooling</h4>
                        <div className="form-row">
                          <SearchableSelect
                            value={item.tooling}
                            onChange={(value) => updatePartItem(part.id, item.id, 'tooling', value)}
                            options={getAllTooling()}
                            placeholder="Select Tooling"
                            customType="tooling"
                            onCustomAdd={handleCustomToolingAdd}
                          />
                        </div>
                        <div className="form-row">
                          <div className="form-group">
                            <label>Quantity:</label>
                            <input
                              type="number"
                              value={item.toolingQuantity}
                              onChange={(e) => updatePartItem(part.id, item.id, 'toolingQuantity', e.target.value)}
                              className="form-input"
                              min="1"
                            />
                          </div>
                        </div>
                        <div className="cost-display">
                          <span>Tooling Cost:</span>
                          <span className="cost-value">{formatCurrency(item.toolingCost)}</span>
                        </div>
                      </div>

                      <div className="item-total">
                        <span>Total Item Cost:</span>
                        <span className="total-value">{formatCurrency(item.totalItemCost)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>

          <div className="section-block">
            <h2>Assemblies</h2>
            {assemblies.length === 0 ? (
              <div className="empty-state">
                <FileText size={64} strokeWidth={1.5} className="icon-empty" />
                <p>No Assemblies added yet. Click "Add Assembly" to start.</p>
              </div>
            ) : (
              assemblies.map(assembly => (
                <div key={assembly.id} className="assembly-card">
                  <div className="assembly-header">
                    <div className="assembly-header-content">
                      <h3>Assembly #{assemblies.findIndex(a => a.id === assembly.id) + 1}</h3>
                      <button 
                        onClick={() => removeAssembly(assembly.id)}
                        className="btn-icon btn-remove"
                        title="Remove Assembly"
                      >
                        <Trash2 size={18} strokeWidth={2} className="icon-danger" />
                      </button>
                    </div>
                    <div className="assembly-header-form">
                      <div className="form-group">
                        <label>Assembly Name:</label>
                        <input
                          type="text"
                          value={assembly.name}
                          onChange={(e) => updateAssemblyHeader(assembly.id, 'name', e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label>Part Name:</label>
                        <input
                          type="text"
                          value={assembly.partName}
                          onChange={(e) => updateAssemblyHeader(assembly.id, 'partName', e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label>External Cost (₹):</label>
                        <input
                          type="number"
                          value={assembly.externalCost}
                          onChange={(e) => updateAssemblyHeader(assembly.id, 'externalCost', parseFloat(e.target.value) || 0)}
                          className="form-input"
                          step="0.01"
                        />
                      </div>
                    </div>
                    <button onClick={() => addItemToAssembly(assembly.id)} className="btn btn-sm btn-primary">
                      <Plus size={18} strokeWidth={2.5} className="icon-white" />
                      Add Item
                    </button>
                  </div>

                  {assembly.items.map(item => (
                    <div key={item.id} className="item-card">
                      <div className="item-header">
                        <h4>Item #{assembly.items.findIndex(i => i.id === item.id) + 1}</h4>
                        <button 
                          onClick={() => removeAssemblyItem(assembly.id, item.id)}
                          className="btn-icon btn-remove"
                          title="Remove item"
                        >
                          <Trash2 size={18} strokeWidth={2} className="icon-danger" />
                        </button>
                      </div>
                      <div className="item-section">
                        <h4>Material</h4>
                        <div className="form-row">
                          <SearchableSelect
                            value={item.material}
                            onChange={(value) => updateAssemblyItem(assembly.id, item.id, 'material', value)}
                            options={getAllMaterials()}
                            placeholder="Select Material"
                            customType="material"
                            onCustomAdd={handleCustomMaterialAdd}
                          />
                        </div>
                        {materialsDatabase[item.material]?.formula && (
                          <div className="form-row">
                            <div className="form-group">
                              <label>Size 1:</label>
                              <input
                                type="number"
                                value={item.size1}
                                onChange={(e) => updateAssemblyItem(assembly.id, item.id, 'size1', e.target.value)}
                                className="form-input"
                                step="0.01"
                              />
                            </div>
                            <div className="form-group">
                              <label>Size 2:</label>
                              <input
                                type="number"
                                value={item.size2}
                                onChange={(e) => updateAssemblyItem(assembly.id, item.id, 'size2', e.target.value)}
                                className="form-input"
                                step="0.01"
                              />
                            </div>
                            <div className="form-group">
                              <label>Quantity:</label>
                              <input
                                type="number"
                                value={item.materialQuantity}
                                onChange={(e) => updateAssemblyItem(assembly.id, item.id, 'materialQuantity', e.target.value)}
                                className="form-input"
                                min="1"
                              />
                            </div>
                          </div>
                        )}
                        {/* Geometry inputs for raw materials */}
                        {materialsDatabase[item.material]?.geometry && (
                          <div className="form-row geometry-inputs">
                            {(materialsDatabase[item.material]?.geometry === 'length' || 
                              materialsDatabase[item.material]?.geometry === 'area' || 
                              materialsDatabase[item.material]?.geometry === 'volume') && (
                              <div className="form-group">
                                <label>Length (mm):</label>
                                <input
                                  type="number"
                                  value={item.materialLength}
                                  onChange={(e) => updateAssemblyItem(assembly.id, item.id, 'materialLength', e.target.value)}
                                  className="form-input"
                                  step="0.1"
                                  placeholder="mm"
                                />
                              </div>
                            )}
                            {(materialsDatabase[item.material]?.geometry === 'area' || 
                              materialsDatabase[item.material]?.geometry === 'volume') && (
                              <div className="form-group">
                                <label>Width (mm):</label>
                                <input
                                  type="number"
                                  value={item.materialWidth}
                                  onChange={(e) => updateAssemblyItem(assembly.id, item.id, 'materialWidth', e.target.value)}
                                  className="form-input"
                                  step="0.1"
                                  placeholder="mm"
                                />
                              </div>
                            )}
                            {(materialsDatabase[item.material]?.geometry === 'volume') && (
                              <>
                                <div className="form-group">
                                  <label>Height (mm):</label>
                                  <input
                                    type="number"
                                    value={item.materialHeight}
                                    onChange={(e) => updateAssemblyItem(assembly.id, item.id, 'materialHeight', e.target.value)}
                                    className="form-input"
                                    step="0.1"
                                    placeholder="mm"
                                  />
                                </div>
                                <div className="form-group">
                                  <label>Thickness (mm):</label>
                                  <input
                                    type="number"
                                    value={item.materialThickness}
                                    onChange={(e) => updateAssemblyItem(assembly.id, item.id, 'materialThickness', e.target.value)}
                                    className="form-input"
                                    step="0.01"
                                    placeholder="mm"
                                  />
                                </div>
                              </>
                            )}
                            {materialsDatabase[item.material]?.geometry === 'area' && (
                              <div className="form-group">
                                <label>Thickness (mm):</label>
                                <input
                                  type="number"
                                  value={item.materialThickness}
                                  onChange={(e) => updateAssemblyItem(assembly.id, item.id, 'materialThickness', e.target.value)}
                                  className="form-input"
                                  step="0.01"
                                  placeholder="mm"
                                />
                              </div>
                            )}
                            <div className="form-group">
                              <label>Quantity:</label>
                              <input
                                type="number"
                                value={item.materialQuantity}
                                onChange={(e) => updateAssemblyItem(assembly.id, item.id, 'materialQuantity', e.target.value)}
                                className="form-input"
                                min="1"
                              />
                            </div>
                          </div>
                        )}
                        {materialsDatabase[item.material]?.price !== undefined && !materialsDatabase[item.material]?.geometry && (
                          <div className="form-row">
                            <div className="form-group">
                              <label>Quantity:</label>
                              <input
                                type="number"
                                value={item.materialQuantity}
                                onChange={(e) => updateAssemblyItem(assembly.id, item.id, 'materialQuantity', e.target.value)}
                                className="form-input"
                                min="1"
                              />
                            </div>
                          </div>
                        )}
                        <div className="cost-display">
                          <span>Material Cost:</span>
                          <span className="cost-value">{formatCurrency(item.materialCost)}</span>
                        </div>
                      </div>

                      <div className="item-section">
                        <h4>Fastener</h4>
                        <div className="form-row">
                          <SearchableSelect
                            value={item.fastener}
                            onChange={(value) => updateAssemblyItem(assembly.id, item.id, 'fastener', value)}
                            options={getAllFasteners()}
                            placeholder="Select Fastener"
                            customType="fastener"
                            onCustomAdd={handleCustomFastenerAdd}
                          />
                        </div>
                        {fastenersDatabase[item.fastener]?.formula && (
                          <div className="form-row">
                            <div className="form-group">
                              <label>Size 1:</label>
                              <input
                                type="number"
                                value={item.fastenerSize1}
                                onChange={(e) => updateAssemblyItem(assembly.id, item.id, 'fastenerSize1', e.target.value)}
                                className="form-input"
                                step="0.01"
                              />
                            </div>
                            <div className="form-group">
                              <label>Size 2:</label>
                              <input
                                type="number"
                                value={item.fastenerSize2}
                                onChange={(e) => updateAssemblyItem(assembly.id, item.id, 'fastenerSize2', e.target.value)}
                                className="form-input"
                                step="0.01"
                              />
                            </div>
                            <div className="form-group">
                              <label>Quantity:</label>
                              <input
                                type="number"
                                value={item.fastenerQuantity}
                                onChange={(e) => updateAssemblyItem(assembly.id, item.id, 'fastenerQuantity', e.target.value)}
                                className="form-input"
                                min="1"
                              />
                            </div>
                          </div>
                        )}
                        {fastenersDatabase[item.fastener]?.price !== undefined && (
                          <div className="form-row">
                            <div className="form-group">
                              <label>Quantity:</label>
                              <input
                                type="number"
                                value={item.fastenerQuantity}
                                onChange={(e) => updateAssemblyItem(assembly.id, item.id, 'fastenerQuantity', e.target.value)}
                                className="form-input"
                                min="1"
                              />
                            </div>
                          </div>
                        )}
                        <div className="cost-display">
                          <span>Fastener Cost:</span>
                          <span className="cost-value">{formatCurrency(item.fastenerCost)}</span>
                        </div>
                      </div>

                      <div className="item-section">
                        <h4>Assembly</h4>
                        <div className="form-row">
                          <SearchableSelect
                            value={item.assembly}
                            onChange={(value) => updateAssemblyItem(assembly.id, item.id, 'assembly', value)}
                            options={getAllAssemblies()}
                            placeholder="Select Assembly"
                            customType="assembly"
                            onCustomAdd={handleCustomAssemblyAdd}
                          />
                        </div>
                        <div className="form-row">
                          <div className="form-group">
                            <label>Quantity:</label>
                            <input
                              type="number"
                              value={item.assemblyQuantity}
                              onChange={(e) => updateAssemblyItem(assembly.id, item.id, 'assemblyQuantity', e.target.value)}
                              className="form-input"
                              min="1"
                            />
                          </div>
                        </div>
                        <div className="cost-display">
                          <span>Assembly Cost:</span>
                          <span className="cost-value">{formatCurrency(item.assemblyCost)}</span>
                        </div>
                      </div>

                      <div className="item-section">
                        <h4>Process</h4>
                        <div className="form-row">
                          <SearchableSelect
                            value={item.process}
                            onChange={(value) => updateAssemblyItem(assembly.id, item.id, 'process', value)}
                            options={getAllProcesses()}
                            placeholder="Select Process"
                            customType="process"
                            onCustomAdd={handleCustomProcessAdd}
                          />
                        </div>
                        <div className="form-row">
                          <div className="form-group">
                            <label>Quantity:</label>
                            <input
                              type="number"
                              value={item.processQuantity}
                              onChange={(e) => updateAssemblyItem(assembly.id, item.id, 'processQuantity', e.target.value)}
                              className="form-input"
                              min="1"
                            />
                          </div>
                          <div className="form-group">
                            <label>Multiplier:</label>
                            <select
                              value={item.multiplier}
                              onChange={(e) => updateAssemblyItem(assembly.id, item.id, 'multiplier', parseFloat(e.target.value))}
                              className="form-select"
                            >
                              <option value={1}>1.0 (None)</option>
                              {Object.entries(multipliersDatabase).map(([id, mult]) => (
                                <option key={id} value={mult.multiplier}>
                                  {mult.multiplier} - {mult.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="cost-display">
                          <span>Process Cost:</span>
                          <span className="cost-value">{formatCurrency(item.processCost)}</span>
                        </div>
                      </div>

                      <div className="item-section">
                        <h4>Tooling</h4>
                        <div className="form-row">
                          <SearchableSelect
                            value={item.tooling}
                            onChange={(value) => updateAssemblyItem(assembly.id, item.id, 'tooling', value)}
                            options={getAllTooling()}
                            placeholder="Select Tooling"
                            customType="tooling"
                            onCustomAdd={handleCustomToolingAdd}
                          />
                        </div>
                        <div className="form-row">
                          <div className="form-group">
                            <label>Quantity:</label>
                            <input
                              type="number"
                              value={item.toolingQuantity}
                              onChange={(e) => updateAssemblyItem(assembly.id, item.id, 'toolingQuantity', e.target.value)}
                              className="form-input"
                              min="1"
                            />
                          </div>
                        </div>
                        <div className="cost-display">
                          <span>Tooling Cost:</span>
                          <span className="cost-value">{formatCurrency(item.toolingCost)}</span>
                        </div>
                      </div>

                      <div className="item-total">
                        <span>Total Item Cost:</span>
                        <span className="total-value">{formatCurrency(item.totalItemCost)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer" style={{display: 'none'}}>
        <p>SUPRA SAEINDIA Cost Report Application - Javitron</p>
      </footer>
    </div>
  );
}

export default App;
