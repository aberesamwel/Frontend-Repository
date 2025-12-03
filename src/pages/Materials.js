import React, { useState, useEffect } from 'react';
import { Plus, Package, AlertTriangle, TrendingUp, Search, Edit2, Trash2, X } from 'lucide-react';

const Materials = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [materials, setMaterials] = useState(() => {
    const saved = localStorage.getItem('bodycraft-materials');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'ANGLE LINES', quantity: 150, unit: 'pcs', price: 25.50, supplier: 'Steel Works Ltd', lastUpdated: '2024-01-15', status: 'In Stock' },
      { id: 2, name: 'CHANNELS', quantity: 80, unit: 'pcs', price: 45.00, supplier: 'Metal Supply Co', lastUpdated: '2024-01-14', status: 'In Stock' },
      { id: 3, name: 'PAINT', quantity: 25, unit: 'liters', price: 35.75, supplier: 'Paint Pro', lastUpdated: '2024-01-13', status: 'Low Stock' },
      { id: 4, name: 'RED OXIDE', quantity: 12, unit: 'liters', price: 28.90, supplier: 'Paint Pro', lastUpdated: '2024-01-12', status: 'Low Stock' },
      { id: 5, name: 'THINNER', quantity: 30, unit: 'liters', price: 22.50, supplier: 'Chemical Supply', lastUpdated: '2024-01-11', status: 'In Stock' },
      { id: 6, name: 'TUBES', quantity: 200, unit: 'pcs', price: 18.25, supplier: 'Steel Works Ltd', lastUpdated: '2024-01-10', status: 'In Stock' },
      { id: 7, name: 'FLAT BAR', quantity: 95, unit: 'pcs', price: 32.00, supplier: 'Metal Supply Co', lastUpdated: '2024-01-09', status: 'In Stock' },
      { id: 8, name: 'ROUND BAR', quantity: 75, unit: 'pcs', price: 28.75, supplier: 'Steel Works Ltd', lastUpdated: '2024-01-08', status: 'In Stock' },
      { id: 9, name: 'PIPES', quantity: 120, unit: 'pcs', price: 55.00, supplier: 'Pipe Masters', lastUpdated: '2024-01-07', status: 'In Stock' },
      { id: 10, name: 'GAS', quantity: 8, unit: 'cylinders', price: 85.00, supplier: 'Gas Supply Inc', lastUpdated: '2024-01-06', status: 'Critical' },
      { id: 11, name: 'WHITE SILICON', quantity: 45, unit: 'tubes', price: 12.50, supplier: 'Sealant Co', lastUpdated: '2024-01-05', status: 'In Stock' },
      { id: 12, name: 'SAND PAPER', quantity: 180, unit: 'sheets', price: 3.25, supplier: 'Tools & More', lastUpdated: '2024-01-04', status: 'In Stock' },
      { id: 13, name: 'FILLER', quantity: 22, unit: 'kg', price: 15.75, supplier: 'Body Shop Supply', lastUpdated: '2024-01-03', status: 'In Stock' }
    ]
  });
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [newMaterial, setNewMaterial] = useState({
    name: '',
    quantity: '',
    unit: '',
    price: '',
    supplier: '',
    status: 'In Stock'
  });

  const statusOptions = ['In Stock', 'Low Stock', 'Critical', 'Out of Stock', 'On Order'];

  const addMaterial = (e) => {
    e.preventDefault();
    const quantity = parseFloat(newMaterial.quantity) || 0;
    const material = {
      id: Date.now(),
      ...newMaterial,
      quantity: quantity,
      price: parseFloat(newMaterial.price),
      status: calculateStatus(quantity),
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    setMaterials([...materials, material]);
    setNewMaterial({ name: '', quantity: '', unit: '', price: '', supplier: '' });
    setIsAddFormOpen(false);
  };

  const deleteMaterial = (id) => {
    setMaterials(materials.filter(m => m.id !== id));
  };

  useEffect(() => {
    localStorage.setItem('bodycraft-materials', JSON.stringify(materials));
  }, [materials]);

  const filteredMaterials = materials.filter(material =>
    material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Stock': return 'bg-green-100 text-green-800';
      case 'Low Stock': return 'bg-yellow-100 text-yellow-800';
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'Out of Stock': return 'bg-gray-100 text-gray-800';
      case 'On Order': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Refresh materials when component mounts to show updated quantities
  useEffect(() => {
    const interval = setInterval(() => {
      const savedMaterials = localStorage.getItem('bodycraft-materials');
      if (savedMaterials) {
        const materials = JSON.parse(savedMaterials);
        setMaterials(materials);
      }
    }, 1000); // Refresh every second
    
    return () => clearInterval(interval);
  }, []);

  const calculateStatus = (quantity) => {
    if (quantity === 0) return 'Out of Stock';
    if (quantity <= 10) return 'Critical';
    if (quantity <= 25) return 'Low Stock';
    return 'In Stock';
  };

  const getTotalValue = () => {
    return materials.reduce((sum, material) => sum + (material.quantity * material.price), 0);
  };

  const getLowStockCount = () => {
    return materials.filter(m => m.status === 'Low Stock' || m.status === 'Critical').length;
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
              <p className="text-2xl font-bold text-slate-900">{materials.filter(m => m.status === 'In Stock').length}</p>
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
                    <div className="text-sm text-slate-500">Updated: {material.lastUpdated}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900">{material.quantity} {material.unit}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900">${material.price.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900">${(material.quantity * material.price).toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900">{material.supplier}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(material.status)}`}>
                      {material.status}
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