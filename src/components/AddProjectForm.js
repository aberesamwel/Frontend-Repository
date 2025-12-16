import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { contactsManager } from '../utils/contactsManager';
import { materialService } from '../services/materialService';
import { checkAndSeedMaterials } from '../utils/seedMaterials';

const AddProjectForm = ({ isOpen, onClose, onAddProject, existingProjects = [] }) => {
  const generateProjectId = () => {
    const now = new Date();
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const projectNumber = (existingProjects.length + 1).toString().padStart(4, '0');
    return `VB-${year}-${hours}${minutes}-${projectNumber}`;
  };

  const [formData, setFormData] = useState({
    projectId: '',
    clientName: '',
    phone: '',
    chassisBrand: '',
    chassisModel: '',
    bodyType: '',
    clientPayment: '',
    laborCost: '',
    status: 'Material Sourcing',
    progress: 0
  });

  const [materials, setMaterials] = useState([
    { id: 1, name: '', quantity: '', price: '', total: 0 }
  ]);

  const chassisOptions = {
    ISUZU: ['NMR', 'NQR', 'NKL', 'FRR', 'FVZ', 'FTR'],
    TATA: ['1208', '1216'],
    FAW: ['General'],
    FOTON: ['General']
  };

  const bodyTypes = [
    'Closed Body',
    'Open Body', 
    'Plain Body',
    'Pickup',
    'Counter Body'
  ];

  const [availableMaterials, setAvailableMaterials] = useState([]);
  const [materialsInventory, setMaterialsInventory] = useState([]);
  const [isAddingCustomMaterial, setIsAddingCustomMaterial] = useState(false);
  const [customMaterialForm, setCustomMaterialForm] = useState({
    name: '',
    unit: 'pcs',
    price: '',
    supplier: ''
  });

  useEffect(() => {
    if (isOpen) {
      // Auto-generate Project ID when form opens
      setFormData(prev => ({
        ...prev,
        projectId: generateProjectId()
      }));
      loadMaterials();
    }
  }, [isOpen]);

  const loadMaterials = async () => {
    try {
      // Check and seed materials if needed
      await checkAndSeedMaterials();
      
      const response = await materialService.getAll();
      const materials = response.data.results || response.data || [];
      setMaterialsInventory(materials);
      setAvailableMaterials(materials.map(m => m.name));
      // Update localStorage for offline access
      localStorage.setItem('bodycraft-materials', JSON.stringify(materials));
    } catch (error) {
      console.error('Failed to load materials:', error);
      // Fallback to localStorage
      const savedMaterials = localStorage.getItem('bodycraft-materials');
      if (savedMaterials) {
        const materials = JSON.parse(savedMaterials);
        setMaterialsInventory(materials);
        setAvailableMaterials(materials.map(m => m.name));
      }
    }
  };

  const handleAddCustomMaterial = (materialId) => {
    setIsAddingCustomMaterial(true);
    setCustomMaterialForm({ name: '', unit: 'pcs', price: '', supplier: '' });
  };

  const saveCustomMaterial = async () => {
    try {
      const materialData = {
        name: customMaterialForm.name.trim().toUpperCase(),
        quantity: 0, // Start with 0 quantity
        unit: customMaterialForm.unit,
        price: parseFloat(customMaterialForm.price) || 0,
        supplier: customMaterialForm.supplier || 'Custom'
      };

      const response = await materialService.create(materialData);
      
      // Reload materials to include the new one
      await loadMaterials();
      
      // Close the form
      setIsAddingCustomMaterial(false);
      
      alert(`Material "${materialData.name}" added successfully!`);
    } catch (error) {
      console.error('Failed to add custom material:', error);
      alert('Failed to add material: ' + (error.response?.data?.message || error.message));
    }
  };

  const deductMaterialsFromInventory = async (usedMaterials) => {
    try {
      for (const material of usedMaterials) {
        if (material.name && material.quantity) {
          const inventoryItem = materialsInventory.find(item => item.name === material.name);
          if (inventoryItem && inventoryItem.quantity >= parseFloat(material.quantity)) {
            // Deduct from inventory
            const newQuantity = inventoryItem.quantity - parseFloat(material.quantity);
            await materialService.update(inventoryItem.id, {
              ...inventoryItem,
              quantity: newQuantity
            });
          }
        }
      }
      console.log('✅ Materials deducted from inventory');
    } catch (error) {
      console.error('Failed to deduct materials:', error);
    }
  };

  const addMaterial = () => {
    setMaterials([...materials, { 
      id: Date.now(), 
      name: '', 
      quantity: '', 
      price: '', 
      total: 0 
    }]);
  };

  const removeMaterial = (id) => {
    setMaterials(materials.filter(m => m.id !== id));
  };

  const updateMaterial = (id, field, value) => {
    setMaterials(materials.map(m => {
      if (m.id === id) {
        const updated = { ...m, [field]: value };
        
        // Handle custom material input
        if (field === 'name' && value === 'CUSTOM_MATERIAL') {
          handleAddCustomMaterial(id);
          return m; // Return unchanged until custom material is created
        } else if (field === 'name' && value) {
          // Auto-populate when material name is selected
          const inventoryItem = materialsInventory.find(item => item.name === value);
          if (inventoryItem) {
            updated.quantity = 1;
            updated.price = inventoryItem.price;
            updated.unit = inventoryItem.unit;
            updated.availableQuantity = inventoryItem.quantity;
            updated.total = 1 * inventoryItem.price;
            updated.isCustom = false;
          } else {
            updated.isCustom = true;
          }
        } else if (field === 'quantity' || field === 'price') {
          updated.total = (parseFloat(updated.quantity) || 0) * (parseFloat(updated.price) || 0);
        }
        return updated;
      }
      return m;
    }));
  };

  const checkInventoryAvailability = (materialName, requestedQuantity) => {
    const inventoryItem = materialsInventory.find(item => item.name === materialName);
    if (!inventoryItem) return { available: false, message: 'Material not found in inventory' };
    
    const available = inventoryItem.quantity >= parseFloat(requestedQuantity || 0);
    const message = available ? 
      `Available: ${inventoryItem.quantity} ${inventoryItem.unit}` :
      `Insufficient stock! Available: ${inventoryItem.quantity} ${inventoryItem.unit}, Requested: ${requestedQuantity} ${inventoryItem.unit}`;
    
    return { available, message, inventoryQuantity: inventoryItem.quantity };
  };

  const getTotalMaterialCost = () => {
    return materials.reduce((sum, m) => sum + (m.total || 0), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check inventory availability before submitting
    const materialsWithIssues = materials.filter(m => {
      if (!m.name || !m.quantity) return false;
      return !checkInventoryAvailability(m.name, m.quantity).available;
    });
    
    if (materialsWithIssues.length > 0) {
      alert('Cannot create project: Insufficient inventory for some materials. Please check the highlighted items.');
      return;
    }
    
    // Save contact if phone provided
    if (formData.phone) {
      contactsManager.saveContact(formData.clientName, formData.phone, 'truck');
    }
    
    const materialCost = getTotalMaterialCost();
    const profit = parseFloat(formData.clientPayment) - materialCost - parseFloat(formData.laborCost);
    const profitMargin = (profit / parseFloat(formData.clientPayment)) * 100;
    const now = new Date();
    
    const newProject = {
      id: Date.now(),
      ...formData,
      // Create vehicleType for backward compatibility
      vehicleType: formData.chassisBrand && formData.chassisModel && formData.bodyType 
        ? `${formData.chassisBrand} ${formData.chassisModel} - ${formData.bodyType}`
        : 'Custom Vehicle',
      clientPayment: parseFloat(formData.clientPayment),
      materialCost: materialCost,
      laborCost: parseFloat(formData.laborCost),
      materials: materials.filter(m => m.name.trim()),
      profit: profit,
      profitMargin: profitMargin.toFixed(1),
      createdAt: now.toISOString(),
      createdDate: now.toLocaleDateString(),
      createdTime: now.toLocaleTimeString(),
      startDate: now.toISOString().split('T')[0],
      estimatedCompletion: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      completedAt: null,
      completedDate: null,
      completedTime: null,
      deliveredAt: null,
      deliveredDate: null,
      deliveredTime: null
    };
    
    // Deduct materials from inventory when project is created
    await deductMaterialsFromInventory(materials.filter(m => m.name.trim()));
    
    onAddProject(newProject);
    // Reset form to initial state
    setFormData({
      projectId: '',
      clientName: '',
      phone: '',
      chassisBrand: '',
      chassisModel: '',
      bodyType: '',
      clientPayment: '',
      laborCost: '',
      status: 'Material Sourcing',
      progress: 0
    });
    setMaterials([{ id: 1, name: '', quantity: '', price: '', total: 0 }]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg sm:rounded-xl shadow-xl w-full max-w-sm sm:max-w-md lg:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200 sticky top-0 bg-white rounded-t-lg sm:rounded-t-xl">
          <h2 className="text-base sm:text-lg font-semibold text-slate-900">Add New Project</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors touch-manipulation">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Project ID (Year-Time-Number)</label>
              <input
                type="text"
                required
                value={formData.projectId}
                onChange={(e) => setFormData({...formData, projectId: e.target.value})}
                className="w-full px-3 sm:px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base touch-manipulation bg-slate-50"
                placeholder="VB-2024-001"
                readOnly
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Client Name</label>
              <input
                type="text"
                required
                value={formData.clientName}
                onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                className="w-full px-3 sm:px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base touch-manipulation"
                placeholder="Client Company Name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-3 sm:px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base touch-manipulation"
                placeholder="+1-555-0123"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Chassis Brand</label>
              <select
                required
                value={formData.chassisBrand}
                onChange={(e) => setFormData({...formData, chassisBrand: e.target.value, chassisModel: ''})}
                className="w-full px-3 sm:px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base touch-manipulation"
              >
                <option value="">Select Brand</option>
                {Object.keys(chassisOptions).map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Chassis Model</label>
              <select
                required
                value={formData.chassisModel}
                onChange={(e) => setFormData({...formData, chassisModel: e.target.value})}
                className="w-full px-3 sm:px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base touch-manipulation"
                disabled={!formData.chassisBrand}
              >
                <option value="">Select Model</option>
                {formData.chassisBrand && chassisOptions[formData.chassisBrand].map(model => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Body Type</label>
              <select
                required
                value={formData.bodyType}
                onChange={(e) => setFormData({...formData, bodyType: e.target.value})}
                className="w-full px-3 sm:px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base touch-manipulation"
              >
                <option value="">Select Body Type</option>
                {bodyTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Client Payment ($)</label>
            <input
              type="number"
              required
              value={formData.clientPayment}
              onChange={(e) => setFormData({...formData, clientPayment: e.target.value})}
              className="w-full px-3 sm:px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base touch-manipulation"
              placeholder="45000"
            />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-slate-700">Materials</label>
              <button
                type="button"
                onClick={addMaterial}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Material
              </button>
            </div>
            
            <div className="space-y-3 sm:space-y-4 max-h-60 sm:max-h-80 overflow-y-auto">
              {materials.map((material, index) => (
                <div key={material.id} className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-12 sm:gap-2 sm:items-end p-3 sm:p-0 bg-slate-50 sm:bg-transparent rounded-lg sm:rounded-none">
                  {/* Material Name - Full width on mobile */}
                  <div className="sm:col-span-4">
                    <label className="block text-xs font-medium text-slate-600 mb-1 sm:hidden">Material</label>
                    <div className="relative">
                      <select
                        value={material.name}
                        onChange={(e) => updateMaterial(material.id, 'name', e.target.value)}
                        className="w-full px-3 py-2.5 sm:px-2 sm:py-1 text-base sm:text-sm border border-slate-300 rounded-lg sm:rounded focus:ring-2 sm:focus:ring-1 focus:ring-blue-500 focus:border-blue-500 touch-manipulation"
                      >
                        <option value="">Select Material</option>
                        <optgroup label="Available Materials">
                          {availableMaterials.map(mat => (
                            <option key={mat} value={mat}>{mat}</option>
                          ))}
                        </optgroup>

                        <optgroup label="Add New">
                          <option value="CUSTOM_MATERIAL">+ Add Custom Material</option>
                        </optgroup>
                      </select>
                    </div>
                  </div>
                  
                  {/* Quantity */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-slate-600 mb-1 sm:hidden">Quantity</label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="Qty"
                        value={material.quantity}
                        onChange={(e) => updateMaterial(material.id, 'quantity', e.target.value)}
                        className={`w-full px-3 py-2.5 sm:px-2 sm:py-1 text-base sm:text-sm border rounded-lg sm:rounded focus:ring-2 sm:focus:ring-1 focus:border-blue-500 touch-manipulation ${
                          material.name && material.quantity && 
                          checkInventoryAvailability(material.name, material.quantity).available
                            ? 'border-slate-300 focus:ring-blue-500'
                            : material.name && material.quantity
                            ? 'border-red-300 focus:ring-red-500 bg-red-50'
                            : 'border-slate-300 focus:ring-blue-500'
                        }`}
                      />
                      {material.unit && (
                        <span className="absolute right-3 sm:right-2 top-1/2 transform -translate-y-1/2 text-xs text-slate-400">
                          {material.unit}
                        </span>
                      )}
                    </div>
                    {/* Inventory Status */}
                    {material.name && (
                      <div className="mt-1">
                        {material.isCustom ? (
                          <div className="text-xs text-blue-600">
                            Custom Material - Set quantity manually
                          </div>
                        ) : material.quantity ? (
                          <div className={`text-xs ${
                            checkInventoryAvailability(material.name, material.quantity).available
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}>
                            {checkInventoryAvailability(material.name, material.quantity).message}
                          </div>
                        ) : (
                          <div className="text-xs text-slate-500">
                            Available: {material.availableQuantity || 0} {material.unit}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Price */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-slate-600 mb-1 sm:hidden">Price</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Price"
                      value={material.price}
                      onChange={(e) => updateMaterial(material.id, 'price', e.target.value)}
                      className="w-full px-3 py-2.5 sm:px-2 sm:py-1 text-base sm:text-sm border border-slate-300 rounded-lg sm:rounded focus:ring-2 sm:focus:ring-1 focus:ring-blue-500 focus:border-blue-500 touch-manipulation"
                    />
                  </div>
                  
                  {/* Total */}
                  <div className="sm:col-span-3">
                    <label className="block text-xs font-medium text-slate-600 mb-1 sm:hidden">Total</label>
                    <div className="px-3 py-2.5 sm:px-2 sm:py-1 text-base sm:text-sm bg-slate-100 rounded-lg sm:rounded text-slate-700 font-medium">
                      ${material.total.toFixed(2)}
                    </div>
                  </div>
                  
                  {/* Remove Button */}
                  <div className="sm:col-span-1 flex justify-end sm:justify-center">
                    {materials.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMaterial(material.id)}
                        className="p-2 sm:p-1 text-red-500 hover:text-red-700 transition-colors rounded-lg hover:bg-red-50 touch-manipulation"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-3 pt-3 border-t border-slate-200">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-700">Total Material Cost:</span>
                <span className="text-lg font-bold text-slate-900">${getTotalMaterialCost().toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Labor Cost ($)</label>
            <input
              type="number"
              required
              value={formData.laborCost}
              onChange={(e) => setFormData({...formData, laborCost: e.target.value})}
              className="w-full px-3 sm:px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base touch-manipulation"
              placeholder="8200"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4 sm:pt-6 sticky bottom-0 bg-white pb-4 sm:pb-0">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-base font-medium touch-manipulation"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-base font-medium touch-manipulation"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Project
            </button>
          </div>
        </form>
      </div>

      {/* Custom Material Modal */}
      {isAddingCustomMaterial && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Add New Material</h3>
              <button 
                onClick={() => setIsAddingCustomMaterial(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Material Name</label>
                <input
                  type="text"
                  required
                  value={customMaterialForm.name}
                  onChange={(e) => setCustomMaterialForm({...customMaterialForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., CUSTOM STEEL PLATE"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Unit</label>
                  <select
                    value={customMaterialForm.unit}
                    onChange={(e) => setCustomMaterialForm({...customMaterialForm, unit: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="pcs">Pieces</option>
                    <option value="kg">Kilograms</option>
                    <option value="m">Meters</option>
                    <option value="m2">Square Meters</option>
                    <option value="l">Liters</option>
                    <option value="box">Box</option>
                    <option value="roll">Roll</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Unit Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={customMaterialForm.price}
                    onChange={(e) => setCustomMaterialForm({...customMaterialForm, price: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Supplier (Optional)</label>
                <input
                  type="text"
                  value={customMaterialForm.supplier}
                  onChange={(e) => setCustomMaterialForm({...customMaterialForm, supplier: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Supplier name"
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddingCustomMaterial(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveCustomMaterial}
                  disabled={!customMaterialForm.name.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 transition-colors"
                >
                  Add Material
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProjectForm;