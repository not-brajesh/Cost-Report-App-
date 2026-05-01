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

  // Calculate stats for dashboard cards
  const partsCount = parts.length;
  const assembliesCount = assemblies.length;
  const totalItems = parts.reduce((sum, p) => sum + p.items.length, 0) + 
                     assemblies.reduce((sum, a) => sum + a.items.length, 0);

  // Active tab state
  const [activeTab, setActiveTab] = useState('summary');

  // Navigation icons
  const Activity = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 6v6l4 2"/>
    </svg>
  );

  const Box = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
      <line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  );

  const Layers = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2"/>
      <polyline points="2 17 12 22 22 17"/>
      <polyline points="2 12 12 17 22 12"/>
    </svg>
  );

  const TrendingUp = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
      <polyline points="17 6 23 6 23 12"/>
    </svg>
  );

  const Users = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );

  return (
    <div className="app dark-mode">
      {/* Header */}
      <header className="app-header">
        <div className="header-left">
          <div className="user-avatar">{headerData.teamName.charAt(0) || 'T'}</div>
          <div>
            <div className="header-subtitle">{headerData.university}</div>
            <div className="header-title">Summary</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="icon-btn" onClick={exportData} title="Export Excel">
            <Download size={18} />
          </button>
          <button className="icon-btn" onClick={clearAll} title="Clear All">
            <Trash2 size={18} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Activity Ring Card - Total Cost */}
        <div className="card card-large card-move" style={{ marginBottom: '16px' }}>
          <div className="activity-ring">
            <div className="ring-container">
              <svg className="ring-svg" viewBox="0 0 100 100">
                <circle className="ring-bg" cx="50" cy="50" r="42"/>
                <circle 
                  className="ring-progress" 
                  cx="50" cy="50" r="42"
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  strokeDashoffset={`${2 * Math.PI * 42 * (1 - Math.min(totalCost / 500000, 1))}`}
                />
              </svg>
            </div>
            <div className="ring-info">
              <h3>Total Cost</h3>
              <div className="value">₹{totalCost.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="dashboard-grid">
          <div className="card card-move">
            <div className="card-header">
              <div className="card-icon"><Activity /></div>
              <span className="card-title">Parts</span>
            </div>
            <div className="card-value">{partsCount}</div>
            <div className="card-subtitle">Active Parts</div>
          </div>

          <div className="card card-exercise">
            <div className="card-header">
              <div className="card-icon"><Layers /></div>
              <span className="card-title">Assemblies</span>
            </div>
            <div className="card-value">{assembliesCount}</div>
            <div className="card-subtitle">Active Assemblies</div>
          </div>

          <div className="card card-stand">
            <div className="card-header">
              <div className="card-icon"><Box /></div>
              <span className="card-title">Items</span>
            </div>
            <div className="card-value">{totalItems}</div>
            <div className="card-subtitle">Total Items</div>
          </div>

          <div className="card card-purple">
            <div className="card-header">
              <div className="card-icon"><TrendingUp /></div>
              <span className="card-title">Avg Cost</span>
            </div>
            <div className="card-value">
              {totalItems > 0 ? `₹${Math.round(totalCost / totalItems).toLocaleString()}` : '₹0'}
            </div>
            <div className="card-subtitle">Per Item</div>
          </div>
        </div>

        {/* Team Info Card */}
        <div className="section-header">
          <span className="section-title">Team Info</span>
        </div>
        <div className="card" style={{ marginBottom: '20px' }}>
          <div className="card-form">
            <div className="form-group-compact">
              <label>University</label>
              <input 
                type="text" 
                value={headerData.university}
                onChange={(e) => setHeaderData({...headerData, university: e.target.value})}
                className="form-input-dark"
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group-compact">
                <label>Team Name</label>
                <input 
                  type="text" 
                  value={headerData.teamName}
                  onChange={(e) => setHeaderData({...headerData, teamName: e.target.value})}
                  className="form-input-dark"
                />
              </div>
              <div className="form-group-compact">
                <label>Car Number</label>
                <input 
                  type="text" 
                  value={headerData.carNumber}
                  onChange={(e) => setHeaderData({...headerData, carNumber: e.target.value})}
                  className="form-input-dark"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="section-header">
          <span className="section-title">Quick Actions</span>
        </div>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          <button onClick={addPart} className="btn-glow" style={{ flex: 1 }}>
            <Plus size={18} style={{ marginRight: '8px', display: 'inline' }} />
            Add Part
          </button>
          <button onClick={addAssembly} className="btn-secondary" style={{ flex: 1 }}>
            <Plus size={18} style={{ marginRight: '8px', display: 'inline' }} />
            Add Assembly
          </button>
        </div>

        {/* Parts Section */}
        {parts.length > 0 && (
          <>
            <div className="section-header">
              <span className="section-title">Parts</span>
              <span className="section-link">{parts.length} items</span>
            </div>
            <div className="list-container" style={{ marginBottom: '24px' }}>
              {parts.map(part => (
                <div key={part.id} className="list-item">
                  <div className="list-item-left">
                    <div className="list-item-icon"><Box /></div>
                    <div>
                      <div className="list-item-title">{part.name || 'Unnamed Part'}</div>
                      <div className="list-item-subtitle">{part.items.length} items · {part.assemblyName || 'No Assembly'}</div>
                    </div>
                  </div>
                  <div className="list-item-value">
                    ₹{part.items.reduce((sum, i) => sum + (i.totalItemCost || 0), 0).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Assemblies Section */}
        {assemblies.length > 0 && (
          <>
            <div className="section-header">
              <span className="section-title">Assemblies</span>
              <span className="section-link">{assemblies.length} items</span>
            </div>
            <div className="list-container" style={{ marginBottom: '24px' }}>
              {assemblies.map(assembly => (
                <div key={assembly.id} className="list-item">
                  <div className="list-item-left">
                    <div className="list-item-icon"><Layers /></div>
                    <div>
                      <div className="list-item-title">{assembly.name || 'Unnamed Assembly'}</div>
                      <div className="list-item-subtitle">{assembly.items.length} items · {assembly.partName || 'No Part'}</div>
                    </div>
                  </div>
                  <div className="list-item-value">
                    ₹{assembly.items.reduce((sum, i) => sum + (i.totalItemCost || 0), 0).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Empty State */}
        {parts.length === 0 && assemblies.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon"><Box /></div>
            <div style={{ fontSize: '17px', fontWeight: 600, marginBottom: '8px' }}>No Items Yet</div>
            <div style={{ fontSize: '15px' }}>Add a Part or Assembly to get started</div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <a className="nav-item active" onClick={() => setActiveTab('summary')}>
          <Activity className="nav-icon" />
          <span className="nav-label">Summary</span>
        </a>
        <a className="nav-item" onClick={() => setActiveTab('parts')}>
          <Box className="nav-icon" />
          <span className="nav-label">Parts</span>
        </a>
        <a className="nav-item" onClick={() => setActiveTab('assemblies')}>
          <Layers className="nav-icon" />
          <span className="nav-label">Assemblies</span>
        </a>
        <a className="nav-item" onClick={() => setActiveTab('sharing')}>
          <Users className="nav-icon" />
          <span className="nav-label">Team</span>
        </a>
      </nav>
    </div>
  );
}

export default App;
