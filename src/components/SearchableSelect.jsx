import React, { useState, useRef, useEffect } from 'react';
import { Search, Plus, X } from 'lucide-react';
import './SearchableSelect.css';

function SearchableSelect({ 
  value, 
  onChange, 
  options, 
  placeholder = "Select...", 
  label = "",
  showCustomOption = true,
  customType = "item",
  onCustomAdd
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customPrice, setCustomPrice] = useState('');
  const [customUnit, setCustomUnit] = useState('unit');
  const dropdownRef = useRef(null);

  // Group options by category
  const groupedOptions = options.reduce((acc, opt) => {
    const category = opt.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(opt);
    return acc;
  }, {});

  // Filter options based on search
  const filteredOptions = Object.entries(groupedOptions).reduce((acc, [category, opts]) => {
    const filtered = opts.filter(opt => 
      opt.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filtered.length > 0) {
      acc[category] = filtered;
    }
    return acc;
  }, {});

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    onChange(option.name);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleCustomAdd = () => {
    if (customName.trim()) {
      const customItem = {
        name: customName.trim(),
        price: customPrice ? parseFloat(customPrice) : 0,
        unit: customUnit,
        category: 'Custom',
        isCustom: true
      };
      
      // Save to localStorage
      const storageKey = `custom_${customType}s`;
      const existingCustom = JSON.parse(localStorage.getItem(storageKey) || '[]');
      existingCustom.push(customItem);
      localStorage.setItem(storageKey, JSON.stringify(existingCustom));
      
      if (onCustomAdd) {
        onCustomAdd(customItem);
      }
      
      onChange(customItem.name);
      setShowCustomModal(false);
      setCustomName('');
      setCustomPrice('');
      setCustomUnit('unit');
      setIsOpen(false);
    }
  };

  const selectedOption = options.find(opt => opt.name === value);

  return (
    <div className="searchable-select" ref={dropdownRef}>
      <div 
        className={`select-trigger ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedOption ? (
          <span className="selected-value">
            {selectedOption.name}
            {selectedOption.isCustom && <span className="custom-badge">Custom</span>}
          </span>
        ) : (
          <span className="placeholder">{placeholder}</span>
        )}
        <Search size={16} className="search-icon" />
      </div>

      {isOpen && (
        <div className="dropdown-menu">
          <div className="search-input-wrapper">
            <Search size={16} className="search-input-icon" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <div className="options-list">
            {Object.entries(filteredOptions).map(([category, opts]) => (
              <div key={category} className="option-group">
                <div className="option-category">{category}</div>
                {opts.map((opt) => (
                  <div
                    key={opt.name}
                    className={`option-item ${value === opt.name ? 'selected' : ''}`}
                    onClick={() => handleSelect(opt)}
                  >
                    <span className="option-name">{opt.name}</span>
                    {opt.isCustom && <span className="custom-badge">Custom</span>}
                    {opt.price !== undefined && (
                      <span className="option-price">₹{opt.price.toLocaleString()}</span>
                    )}
                  </div>
                ))}
              </div>
            ))}
            
            {Object.keys(filteredOptions).length === 0 && (
              <div className="no-results">No results found</div>
            )}
          </div>

          {showCustomOption && (
            <div className="custom-option" onClick={() => setShowCustomModal(true)}>
              <Plus size={16} />
              <span>Add Custom {customType}</span>
            </div>
          )}
        </div>
      )}

      {showCustomModal && (
        <div className="custom-modal-overlay" onClick={() => setShowCustomModal(false)}>
          <div className="custom-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Custom {customType}</h3>
              <button 
                className="modal-close" 
                onClick={() => setShowCustomModal(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Enter name..."
                  className="modal-input"
                />
              </div>
              <div className="form-group">
                <label>Price (₹)</label>
                <input
                  type="number"
                  value={customPrice}
                  onChange={(e) => setCustomPrice(e.target.value)}
                  placeholder="Enter price..."
                  className="modal-input"
                  step="0.01"
                />
              </div>
              <div className="form-group">
                <label>Unit</label>
                <select
                  value={customUnit}
                  onChange={(e) => setCustomUnit(e.target.value)}
                  className="modal-select"
                >
                  <option value="unit">unit</option>
                  <option value="kg">kg</option>
                  <option value="m">m</option>
                  <option value="mm">mm</option>
                  <option value="cm">cm</option>
                  <option value="m^2">m^2</option>
                  <option value="cm^2">cm^2</option>
                  <option value="m^3">m^3</option>
                  <option value="cm^3">cm^3</option>
                  <option value="liter">liter</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowCustomModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleCustomAdd}
                disabled={!customName.trim()}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchableSelect;
