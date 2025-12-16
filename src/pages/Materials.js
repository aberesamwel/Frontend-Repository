import React, { useState, useEffect } from 'react';
import { Plus, Package, AlertTriangle, TrendingUp, Search, Edit2, Trash2, X, Download } from 'lucide-react';
import { ActivityLogger } from '../utils/activityLogger';
import { materialService } from '../services/materialService';
import { seedDefaultMaterials } from '../utils/seedMaterials';

const Materials = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [materials, setMaterials] = useState([]);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newMaterial, setNewMaterial] = useState({
    name: '',
    quantity: '',
    unit: '',
    price: '',
    supplier: '',
    status: 'In Stock'
  });

  const statusOptions = ['In Stock', 'Low Stock', 'Critical', 'Out of Stock', 'On Order'];

  // Load materials from API
  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = async () => {
    try {
      setLoading(true);
      console.log('🔄 Loading materials from API...');
      const response = await materialService.getAll();
      const materialsData = response.data.results || response.data || [];
      console.log('✅ Materials loaded:', materialsData.length, 'items');
      console.log('📋 Materials data:', materialsData);
      setMaterials(materialsData);
      // Also save to localStorage for backward compatibility
      localStorage.setItem('bodycraft-materials', JSON.stringify(materialsData));
    } catch (error) {
      console.error('❌ Error loading materials:', error);
      console.log('🔄 Trying localStorage fallback...');
      // Fallback to localStorage if API fails
      const saved = localStorage.getItem('bodycraft-materials');
      if (saved) {
        const localMaterials = JSON.parse(saved);
        console.log('✅ Loaded from localStorage:', localMaterials.length, 'items');
        setMaterials(localMaterials);
      } else {
        console.log('❌ No materials in localStorage either');
      }
    } finally {
      setLoading(false);
    }
  };

  const addMaterial = async (e) => {
    e.preventDefault();
    
    const quantity = parseFloat(newMaterial.quantity) || 0;
    const newMat = {
      id: Date.now(),
      name: newMaterial.name.trim().toUpperCase(),
      quantity: quantity,
      unit: newMaterial.unit,
      price: parseFloat(newMaterial.price) || 0,
      supplier: newMaterial.supplier?.trim() || 'Unknown',
      status: quantity > 25 ? 'in_stock' : quantity > 10 ? 'low_stock' : 'critical',
      min_stock: 10,
      critical_stock: 5,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Optimistic update - add to UI immediately
    const updatedMaterials = [...materials, newMat];
    setMaterials(updatedMaterials);
    localStorage.setItem('bodycraft-materials', JSON.stringify(updatedMaterials));
    
    // Close form and reset
    setNewMaterial({ name: '', quantity: '', unit: '', price: '', supplier: '' });
    setIsAddFormOpen(false);
    
    // Try to sync with API in background
    try {
      console.log('📤 Syncing with API...');
      const response = await materialService.create(newMat);
      // Update with server response if successful
      const serverMaterials = materials.map(m => m.id === newMat.id ? response.data : m).concat(response.data.id !== newMat.id ? [response.data] : []);
      setMaterials(serverMaterials);
      localStorage.setItem('bodycraft-materials', JSON.stringify(serverMaterials));
      console.log('✅ API sync successful');
    } catch (error) {
      console.log('📦 API sync failed, keeping local version');
    }
    
    ActivityLogger.addActivity(
      'material',
      `New material added: ${newMat.name} (${quantity} ${newMat.unit})`,
      'info'
    );
  };

  const deleteMaterial = async (id) => {
    try {
      const material = materials.find(m => m.id === id);
      await materialService.update(id, { ...material, is_deleted: true });
      
      const updatedMaterials = materials.filter(m => m.id !== id);
      setMaterials(updatedMaterials);
      
      // Update localStorage
      localStorage.setItem('bodycraft-materials', JSON.stringify(updatedMaterials));
      
      if (material) {
        // Log material deletion activity
        ActivityLogger.addActivity(
          'material',
          `Material removed: ${material.name} deleted from inventory`,
          'warning'
        );
      }
    } catch (error) {
      console.error('Error deleting material:', error);
      alert('Failed to delete material');
    }
  };

  const filteredMaterials = materials.filter(material =>
    material.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.supplier?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  console.log('🔍 Current materials state:', materials);
  console.log('🔍 Filtered materials:', filteredMaterials);
  console.log('🔍 Loading state:', loading);

  const getStatusColor = (status) => {
    const statusLower = (status || '').toLowerCase().replace(' ', '_');
    switch (statusLower) {
      case 'in_stock': return 'bg-green-100 text-green-800';
      case 'low_stock': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      case 'out_of_stock': return 'bg-gray-100 text-gray-800';
      case 'on_order': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status) => {
    if (!status) return 'Unknown';
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Refresh materials periodically from API
  useEffect(() => {
    const interval = setInterval(() => {
      loadMaterials();
    }, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const calculateStatus = (quantity) => {
    if (quantity === 0) return 'Out of Stock';
    if (quantity <= 10) return 'Critical';
    if (quantity <= 25) return 'Low Stock';
    return 'In Stock';
  };

  const getTotalValue = () => {
    return materials.reduce((sum, material) => sum + (material.quantity * (material.price || 0)), 0);
  };

  const getLowStockCount = () => {
    return materials.filter(m => m.status === 'low_stock' || m.status === 'critical').length;
  };

  const handleSeedMaterials = async () => {
    try {
      setLoading(true);
      console.log('🌱 Seeding materials...');
      const result = await seedDefaultMaterials();
      if (result.success) {
        console.log('✅ Seeding successful:', result.message);
        alert(result.message);
        await loadMaterials();
      } else {
        console.log('❌ Seeding failed:', result.message);
        // If API fails, create materials in localStorage as fallback
        const defaultMaterials = [
          { id: 1, name: 'ANGLE LINES', unit: 'pcs', price: 15.50, supplier: 'Steel Supply Co', quantity: 100, status: 'in_stock', min_stock: 10, critical_stock: 5 },
          { id: 2, name: 'CHANNELS', unit: 'pcs', price: 25.00, supplier: 'Steel Supply Co', quantity: 50, status: 'in_stock', min_stock: 10, critical_stock: 5 },
          { id: 3, name: 'PAINT', unit: 'l', price: 45.00, supplier: 'Paint World', quantity: 20, status: 'in_stock', min_stock: 5, critical_stock: 2 },
          { id: 4, name: 'RED OXIDE', unit: 'l', price: 35.00, supplier: 'Paint World', quantity: 15, status: 'in_stock', min_stock: 5, critical_stock: 2 },
          { id: 5, name: 'THINNER', unit: 'l', price: 12.00, supplier: 'Paint World', quantity: 25, status: 'in_stock', min_stock: 5, critical_stock: 2 },
          { id: 6, name: 'TUBES', unit: 'pcs', price: 18.75, supplier: 'Steel Supply Co', quantity: 80, status: 'in_stock', min_stock: 15, critical_stock: 5 },
          { id: 7, name: 'FLAT BAR', unit: 'pcs', price: 22.50, supplier: 'Steel Supply Co', quantity: 60, status: 'in_stock', min_stock: 10, critical_stock: 5 },
          { id: 8, name: 'ROUND BAR', unit: 'pcs', price: 20.00, supplier: 'Steel Supply Co', quantity: 40, status: 'in_stock', min_stock: 10, critical_stock: 5 },
          { id: 9, name: 'PIPES', unit: 'pcs', price: 30.00, supplier: 'Steel Supply Co', quantity: 35, status: 'in_stock', min_stock: 10, critical_stock: 5 },
          { id: 10, name: 'GAS', unit: 'kg', price: 8.50, supplier: 'Gas Depot', quantity: 200, status: 'in_stock', min_stock: 50, critical_stock: 20 }
        ];
        localStorage.setItem('bodycraft-materials', JSON.stringify(defaultMaterials));
        setMaterials(defaultMaterials);
        alert('Materials loaded locally (API unavailable)');
      }
    } catch (error) {
      console.error('❌ Error seeding materials:', error);
      alert('Failed to load default materials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Materials & Inventory</h1>
          <p className="text-slate-600">Manage workshop materials and inventory levels</p>
        </div>
        <button
          onClick={() => setIsAddFormOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Material
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center">
            <Package className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Total Materials</p>
              <p className="text-2xl font-bold text-slate-900">{materials.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Total Value</p>
              <p className="text-2xl font-bold text-slate-900">${getTotalValue().toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center">
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Low Stock Items</p>
              <p className="text-2xl font-bold text-slate-900">{getLowStockCount()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center">
            <Package className="w-8 h-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">In Stock</p>
              <p className="text-2xl font-bold text-slate-900">{materials.filter(m => m.status === 'in_stock').length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search materials or suppliers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Materials Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-slate-500">Loading materials...</div>
          </div>
        ) : materials.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Package className="w-12 h-12 text-slate-400 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No Materials Found</h3>
            <p className="text-slate-500 mb-4">Get started by loading default materials or adding your own.</p>
            <div className="flex space-x-3">
              <button
                onClick={handleSeedMaterials}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Load Default Materials
              </button>
              <button
                onClick={() => setIsAddFormOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Material
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Material</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Unit Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Total Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Supplier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredMaterials.map((material) => (
                <tr key={material.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-slate-900">{material.name}</div>
                    <div className="text-sm text-slate-500">Updated: {material.updated_at ? new Date(material.updated_at).toLocaleDateString() : 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900">{material.quantity} {material.unit}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900">${parseFloat(material.price || 0).toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900">${(parseFloat(material.quantity || 0) * parseFloat(material.price || 0)).toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900">{material.supplier}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(material.status)}`}>
                      {formatStatus(material.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingMaterial(material)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => deleteMaterial(material.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Material Modal */}
      {isAddFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Add New Material</h2>
              <button onClick={() => setIsAddFormOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={addMaterial} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Material Name</label>
                <input
                  type="text"
                  required
                  value={newMaterial.name}
                  onChange={(e) => setNewMaterial({...newMaterial, name: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., STEEL SHEETS"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    required
                    value={newMaterial.quantity}
                    onChange={(e) => setNewMaterial({...newMaterial, quantity: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="100"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Unit</label>
                  <select
                    required
                    value={newMaterial.unit}
                    onChange={(e) => setNewMaterial({...newMaterial, unit: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Unit</option>
                    <option value="pcs">Pieces</option>
                    <option value="liters">Liters</option>
                    <option value="kg">Kilograms</option>
                    <option value="meters">Meters</option>
                    <option value="sheets">Sheets</option>
                    <option value="tubes">Tubes</option>
                    <option value="cylinders">Cylinders</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Unit Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={newMaterial.price}
                  onChange={(e) => setNewMaterial({...newMaterial, price: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="25.50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Supplier</label>
                <input
                  type="text"
                  required
                  value={newMaterial.supplier}
                  onChange={(e) => setNewMaterial({...newMaterial, supplier: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Supplier Company Name"
                />
              </div>
              

              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddFormOpen(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Materials;