import React, { useState } from 'react';
import { Search, Plus, Minus, Check } from 'lucide-react';

const availableMaterials = [
  { id: 'ready_mix_25mpa', name: '25MPa Ready Mix Concrete', category: 'Concrete' },
  { id: 'ready_mix_32mpa', name: '32MPa Ready Mix Concrete', category: 'Concrete' },
  { id: 'ready_mix_40mpa', name: '40MPa Ready Mix Concrete', category: 'Concrete' },
  { id: 'concrete-gpc-32mpa', name: '32MPa Geopolymer Concrete', category: 'Concrete' },
  { id: 'concrete-recycled-aggregate', name: 'Recycled Aggregate Concrete', category: 'Concrete' },
  { id: 'steel_rebar_12mm', name: '12mm Steel Rebar', category: 'Steel' },
  { id: 'steel_structural_sections', name: 'Structural Steel Sections', category: 'Steel' },
  { id: 'steel_recycled', name: 'Recycled Steel', category: 'Steel' },
  { id: 'clay_brick_standard', name: 'Standard Clay Brick', category: 'Masonry' },
  { id: 'block_aac', name: 'AAC Block', category: 'Masonry' },
  { id: 'glasswool_batts_r25', name: 'R2.5 Glasswool Batts', category: 'Insulation' },
  { id: 'pine_framing_90x45', name: '90x45 Pine Framing', category: 'Timber' },
  { id: 'timber_clt', name: 'Cross Laminated Timber', category: 'Timber' },
  { id: 'glass_double_glazed', name: 'Double Glazed Glass', category: 'Glazing' },
  { id: 'window_aluminium', name: 'Aluminium Window Frames', category: 'Glazing' },
  { id: 'plasterboard', name: 'Plasterboard', category: 'Finishes' },
  { id: 'carpet_nylon', name: 'Nylon Carpet', category: 'Finishes' }
];

const MaterialSelector = ({ selectedMaterials = [], onMaterialsChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [quantities, setQuantities] = useState({});
  const [expandedCategory, setExpandedCategory] = useState('Concrete');

  const filteredMaterials = searchTerm.trim() === ''
    ? availableMaterials
    : availableMaterials.filter(
        mat => mat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              mat.category.toLowerCase().includes(searchTerm.toLowerCase())
      );

  // Group materials by category
  const materialsByCategory = filteredMaterials.reduce((acc, material) => {
    if (!acc[material.category]) {
      acc[material.category] = [];
    }
    acc[material.category].push(material);
    return acc;
  }, {});

  const handleMaterialToggle = (materialId) => {
    const isSelected = selectedMaterials.some(m => m.id === materialId);
    let newSelectedMaterials;

    if (isSelected) {
      newSelectedMaterials = selectedMaterials.filter(m => m.id !== materialId);
    } else {
      const material = availableMaterials.find(m => m.id === materialId);
      newSelectedMaterials = [...selectedMaterials, {
        id: materialId,
        name: material.name,
        category: material.category,
        quantity: quantities[materialId] || 1
      }];
    }

    onMaterialsChange(newSelectedMaterials);
  };

  const handleQuantityChange = (materialId, newQuantity) => {
    const updatedQuantities = {
      ...quantities,
      [materialId]: Math.max(0.1, newQuantity)
    };

    setQuantities(updatedQuantities);

    // Update selected materials if this one is already selected
    if (selectedMaterials.some(m => m.id === materialId)) {
      const newSelectedMaterials = selectedMaterials.map(m =>
        m.id === materialId ? { ...m, quantity: updatedQuantities[materialId] } : m
      );
      onMaterialsChange(newSelectedMaterials);
    }
  };

  const toggleCategory = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Search className="w-5 h-5 text-gray-600" />
        <span className="font-semibold text-gray-800">Select Materials</span>
      </div>

      {/* Search box */}
      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search materials..."
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
      </div>

      {/* Materials by category */}
      <div className="space-y-4">
        {Object.entries(materialsByCategory).map(([category, materials]) => (
          <div key={category} className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Category header */}
            <button
              onClick={() => toggleCategory(category)}
              className="w-full flex justify-between items-center p-3 bg-gray-100 hover:bg-gray-200"
            >
              <span className="font-semibold">{category}</span>
              {expandedCategory === category ?
                <Minus className="w-4 h-4" /> :
                <Plus className="w-4 h-4" />
              }
            </button>

            {/* Materials */}
            {expandedCategory === category && (
              <div className="divide-y divide-gray-200">
                {materials.map((material) => {
                  const isSelected = selectedMaterials.some(m => m.id === material.id);

                  return (
                    <div key={material.id} className="p-3 flex flex-col sm:flex-row sm:items-center gap-3">
                      {/* Material name and selection */}
                      <div className="flex-grow flex items-center gap-3">
                        <button
                          onClick={() => handleMaterialToggle(material.id)}
                          className={`w-6 h-6 flex items-center justify-center rounded ${
                            isSelected ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                          }`}
                        >
                          {isSelected && <Check className="w-4 h-4" />}
                        </button>
                        <span>{material.name}</span>
                      </div>

                      {/* Quantity input */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleQuantityChange(
                            material.id,
                            (quantities[material.id] || 1) - 1
                          )}
                          className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-lg"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={quantities[material.id] || 1}
                          onChange={(e) => handleQuantityChange(
                            material.id,
                            parseFloat(e.target.value) || 0
                          )}
                          className="w-16 p-1 text-center border border-gray-300 rounded"
                        />
                        <button
                          onClick={() => handleQuantityChange(
                            material.id,
                            (quantities[material.id] || 1) + 1
                          )}
                          className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-lg"
                        >
                          +
                        </button>
                        <span className="text-sm text-gray-500">
                          {material.category === 'Concrete' && 'm³'}
                          {material.category === 'Steel' && 'tonnes'}
                          {material.category === 'Timber' && 'm³'}
                          {material.category === 'Masonry' && 'm²'}
                          {material.category === 'Insulation' && 'm²'}
                          {material.category === 'Glazing' && 'm²'}
                          {material.category === 'Finishes' && 'm²'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Selected materials summary */}
      {selectedMaterials.length > 0 && (
        <div className="mt-4 border-t border-gray-200 pt-4">
          <h3 className="font-semibold mb-2">Selected Materials:</h3>
          <ul className="space-y-1">
            {selectedMaterials.map(material => (
              <li key={material.id} className="text-sm">
                • {material.name} - {material.quantity} {
                  material.category === 'Concrete' ? 'm³' :
                  material.category === 'Steel' ? 'tonnes' :
                  material.category === 'Timber' ? 'm³' : 'm²'
                }
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MaterialSelector;
