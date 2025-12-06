import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const AddServiceModal = ({ 
  isOpen, 
  onClose, 
  newService, 
  setNewService, 
  onSubmit, 
  serviceTypes 
}) => {
  const { getThemeClass } = useTheme();
  const [items, setItems] = useState([{
    id: 1,
    serviceType: 'cutting',
    material: '',
    gauge: '',
    dimensions: '',
    specifications: '',
    quantity: 1,
    unitPrice: 0,
    total: 0
  }]);

  const addItem = () => {
    setItems([...items, {
      id: Date.now(),
      serviceType: 'cutting',
      material: '',
      gauge: '',
      dimensions: '',
      specifications: '',
      quantity: 1,
      unitPrice: 0,
      total: 0
    }]);
  };

  const removeItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id, field, value) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updated.total = (parseFloat(updated.quantity) || 0) * (parseFloat(updated.unitPrice) || 0);
        }
        return updated;
      }
      return item;
    }));
  };

  const getTotalAmount = () => {
    return items.reduce((sum, item) => sum + (item.total || 0), 0);
  };

  const handleSubmit = () => {
    const totalAmount = getTotalAmount();
    const serviceData = {
      ...newService,
      items: items,
      totalAmount: totalAmount,
      quantity: items.reduce((sum, item) => sum + (item.quantity || 0), 0)
    };
    onSubmit(serviceData);
    setItems([{
      id: 1,
      serviceType: 'cutting',
      material: '',
      gauge: '',
      dimensions: '',
      specifications: '',
      quantity: 1,
      unitPrice: 0,
      total: 0
    }]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`${getThemeClass('bg', 'secondary')} rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto`}>
        <div className={`p-6 ${getThemeClass('border', 'primary')} border-b`}>
          <h3 className={`text-lg font-semibold ${getThemeClass('text', 'primary')}`}>New Metal Works Service</h3>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium ${getThemeClass('text', 'primary')} mb-2`}>Customer Name *</label>
              <input
                type="text"
                value={newService.customerName}
                onChange={(e) => setNewService({...newService, customerName: e.target.value})}
                className={`w-full px-3 py-2 border ${getThemeClass('border', 'primary')} rounded-lg ${getThemeClass('bg', 'primary')} ${getThemeClass('text', 'primary')} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                placeholder="Enter customer name"
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium ${getThemeClass('text', 'primary')} mb-2`}>Phone Number *</label>
              <input
                type="tel"
                value={newService.phone}
                onChange={(e) => setNewService({...newService, phone: e.target.value})}
                className={`w-full px-3 py-2 border ${getThemeClass('border', 'primary')} rounded-lg ${getThemeClass('bg', 'primary')} ${getThemeClass('text', 'primary')} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                placeholder="+1-555-0123"
              />
            </div>
          </div>
          
          <div>
            <label className={`block text-sm font-medium ${getThemeClass('text', 'primary')} mb-2`}>Priority</label>
            <select
              value={newService.priority}
              onChange={(e) => setNewService({...newService, priority: e.target.value})}
              className={`w-full px-3 py-2 border ${getThemeClass('border', 'primary')} rounded-lg ${getThemeClass('bg', 'primary')} ${getThemeClass('text', 'primary')} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            >
              <option value="standard">Standard</option>
              <option value="urgent">Urgent</option>
              <option value="rush">Rush</option>
            </select>
          </div>
          
          {/* Items Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className={`block text-sm font-medium ${getThemeClass('text', 'primary')}`}>Service Items *</label>
              <button
                type="button"
                onClick={addItem}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Item
              </button>
            </div>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {items.map((item, index) => (
                <div key={item.id} className={`p-4 border ${getThemeClass('border', 'primary')} rounded-lg ${getThemeClass('bg', 'tertiary')} space-y-3`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-medium ${getThemeClass('text', 'primary')}`}>Item {index + 1}</span>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className={`block text-xs font-medium ${getThemeClass('text', 'secondary')} mb-1`}>Service Type</label>
                      <select
                        value={item.serviceType}
                        onChange={(e) => updateItem(item.id, 'serviceType', e.target.value)}
                        className={`w-full px-2 py-1.5 text-sm border ${getThemeClass('border', 'primary')} rounded ${getThemeClass('bg', 'primary')} ${getThemeClass('text', 'primary')} focus:ring-2 focus:ring-blue-500`}
                      >
                        {serviceTypes.map(type => (
                          <option key={type.id} value={type.id}>{type.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className={`block text-xs font-medium ${getThemeClass('text', 'secondary')} mb-1`}>Material</label>
                      <input
                        type="text"
                        value={item.material}
                        onChange={(e) => updateItem(item.id, 'material', e.target.value)}
                        className={`w-full px-2 py-1.5 text-sm border ${getThemeClass('border', 'primary')} rounded ${getThemeClass('bg', 'primary')} ${getThemeClass('text', 'primary')} focus:ring-2 focus:ring-blue-500`}
                        placeholder="Steel, Aluminum..."
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className={`block text-xs font-medium ${getThemeClass('text', 'secondary')} mb-1`}>Gauge/Thickness</label>
                      <input
                        type="text"
                        value={item.gauge}
                        onChange={(e) => updateItem(item.id, 'gauge', e.target.value)}
                        className={`w-full px-2 py-1.5 text-sm border ${getThemeClass('border', 'primary')} rounded ${getThemeClass('bg', 'primary')} ${getThemeClass('text', 'primary')} focus:ring-2 focus:ring-blue-500`}
                        placeholder="10mm"
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-xs font-medium ${getThemeClass('text', 'secondary')} mb-1`}>Dimensions</label>
                      <input
                        type="text"
                        value={item.dimensions}
                        onChange={(e) => updateItem(item.id, 'dimensions', e.target.value)}
                        className={`w-full px-2 py-1.5 text-sm border ${getThemeClass('border', 'primary')} rounded ${getThemeClass('bg', 'primary')} ${getThemeClass('text', 'primary')} focus:ring-2 focus:ring-blue-500`}
                        placeholder="2m x 1m"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className={`block text-xs font-medium ${getThemeClass('text', 'secondary')} mb-1`}>Specifications</label>
                    <textarea
                      value={item.specifications}
                      onChange={(e) => updateItem(item.id, 'specifications', e.target.value)}
                      className={`w-full px-2 py-1.5 text-sm border ${getThemeClass('border', 'primary')} rounded ${getThemeClass('bg', 'primary')} ${getThemeClass('text', 'primary')} focus:ring-2 focus:ring-blue-500`}
                      rows="2"
                      placeholder="Details..."
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className={`block text-xs font-medium ${getThemeClass('text', 'secondary')} mb-1`}>Qty</label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                        className={`w-full px-2 py-1.5 text-sm border ${getThemeClass('border', 'primary')} rounded ${getThemeClass('bg', 'primary')} ${getThemeClass('text', 'primary')} focus:ring-2 focus:ring-blue-500`}
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-xs font-medium ${getThemeClass('text', 'secondary')} mb-1`}>Price ($)</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className={`w-full px-2 py-1.5 text-sm border ${getThemeClass('border', 'primary')} rounded ${getThemeClass('bg', 'primary')} ${getThemeClass('text', 'primary')} focus:ring-2 focus:ring-blue-500`}
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-xs font-medium ${getThemeClass('text', 'secondary')} mb-1`}>Total</label>
                      <div className={`px-2 py-1.5 text-sm ${getThemeClass('bg', 'primary')} rounded font-medium ${getThemeClass('text', 'primary')}`}>
                        ${item.total.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className={`p-4 ${getThemeClass('bg', 'tertiary')} rounded-lg space-y-3`}>
            <div className="flex justify-between items-center">
              <span className={`font-medium ${getThemeClass('text', 'primary')}`}>Total Amount:</span>
              <span className="text-xl font-bold text-blue-600">
                ${getTotalAmount().toFixed(2)}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium ${getThemeClass('text', 'primary')} mb-2`}>Amount Paid ($)</label>
                <input
                  type="number"
                  min="0"
                  max={getTotalAmount()}
                  step="0.01"
                  value={newService.amountPaid}
                  onChange={(e) => setNewService({...newService, amountPaid: parseFloat(e.target.value) || 0})}
                  className={`w-full px-3 py-2 border ${getThemeClass('border', 'primary')} rounded-lg ${getThemeClass('bg', 'primary')} ${getThemeClass('text', 'primary')} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium ${getThemeClass('text', 'primary')} mb-2`}>Payment Method</label>
                <select
                  value={newService.paymentMethod}
                  onChange={(e) => setNewService({...newService, paymentMethod: e.target.value})}
                  className={`w-full px-3 py-2 border ${getThemeClass('border', 'primary')} rounded-lg ${getThemeClass('bg', 'primary')} ${getThemeClass('text', 'primary')} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                >
                  <option value="">Select method</option>
                  <option value="cash">💵 Cash</option>
                  <option value="mpesa">📱 M-Pesa</option>
                  <option value="card">💳 Card</option>
                  <option value="bank">🏛️ Bank Transfer</option>
                  <option value="crypto">🪙 Crypto</option>
                </select>
              </div>
            </div>
            
            {newService.amountPaid > 0 && (
              <div className="flex justify-between items-center pt-2 border-t ${getThemeClass('border', 'primary')}">
                <span className={`font-medium ${getThemeClass('text', 'primary')}`}>Remaining Balance:</span>
                <span className="text-lg font-bold text-red-600">
                  ${Math.max(0, getTotalAmount() - newService.amountPaid).toFixed(2)}
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div className={`p-6 ${getThemeClass('border', 'primary')} border-t flex space-x-3`}>
          <button
            onClick={onClose}
            className={`flex-1 px-4 py-2 border ${getThemeClass('border', 'primary')} ${getThemeClass('text', 'primary')} rounded-lg hover:${getThemeClass('bg', 'hover')} transition-colors`}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Service Ticket
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddServiceModal;