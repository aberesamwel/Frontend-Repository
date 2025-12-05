import React from 'react';
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium ${getThemeClass('text', 'primary')} mb-2`}>Service Type *</label>
              <select
                value={newService.serviceType}
                onChange={(e) => setNewService({...newService, serviceType: e.target.value})}
                className={`w-full px-3 py-2 border ${getThemeClass('border', 'primary')} rounded-lg ${getThemeClass('bg', 'primary')} ${getThemeClass('text', 'primary')} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              >
                {serviceTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
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
          </div>
          
          <div>
            <label className={`block text-sm font-medium ${getThemeClass('text', 'primary')} mb-2`}>Material *</label>
            <input
              type="text"
              value={newService.material}
              onChange={(e) => setNewService({...newService, material: e.target.value})}
              className={`w-full px-3 py-2 border ${getThemeClass('border', 'primary')} rounded-lg ${getThemeClass('bg', 'primary')} ${getThemeClass('text', 'primary')} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              placeholder="e.g., Steel Plate, Aluminum Sheet"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium ${getThemeClass('text', 'primary')} mb-2`}>Gauge/Thickness</label>
              <input
                type="text"
                value={newService.gauge || ''}
                onChange={(e) => setNewService({...newService, gauge: e.target.value})}
                className={`w-full px-3 py-2 border ${getThemeClass('border', 'primary')} rounded-lg ${getThemeClass('bg', 'primary')} ${getThemeClass('text', 'primary')} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                placeholder="e.g., 10mm, 16 gauge"
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium ${getThemeClass('text', 'primary')} mb-2`}>Dimensions</label>
              <input
                type="text"
                value={newService.dimensions || ''}
                onChange={(e) => setNewService({...newService, dimensions: e.target.value})}
                className={`w-full px-3 py-2 border ${getThemeClass('border', 'primary')} rounded-lg ${getThemeClass('bg', 'primary')} ${getThemeClass('text', 'primary')} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                placeholder="e.g., 2m x 1m, 500mm length"
              />
            </div>
          </div>
          
          <div>
            <label className={`block text-sm font-medium ${getThemeClass('text', 'primary')} mb-2`}>Specifications</label>
            <textarea
              value={newService.specifications || ''}
              onChange={(e) => setNewService({...newService, specifications: e.target.value})}
              className={`w-full px-3 py-2 border ${getThemeClass('border', 'primary')} rounded-lg ${getThemeClass('bg', 'primary')} ${getThemeClass('text', 'primary')} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              rows="3"
              placeholder="Detailed specifications and requirements"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium ${getThemeClass('text', 'primary')} mb-2`}>Quantity</label>
              <input
                type="number"
                min="1"
                value={newService.quantity}
                onChange={(e) => setNewService({...newService, quantity: parseInt(e.target.value) || 1})}
                className={`w-full px-3 py-2 border ${getThemeClass('border', 'primary')} rounded-lg ${getThemeClass('bg', 'primary')} ${getThemeClass('text', 'primary')} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium ${getThemeClass('text', 'primary')} mb-2`}>Unit Price ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={newService.unitPrice}
                onChange={(e) => setNewService({...newService, unitPrice: parseFloat(e.target.value) || 0})}
                className={`w-full px-3 py-2 border ${getThemeClass('border', 'primary')} rounded-lg ${getThemeClass('bg', 'primary')} ${getThemeClass('text', 'primary')} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              />
            </div>
          </div>
          
          <div className={`p-4 ${getThemeClass('bg', 'tertiary')} rounded-lg`}>
            <div className="flex justify-between items-center">
              <span className={`font-medium ${getThemeClass('text', 'primary')}`}>Total Amount:</span>
              <span className="text-xl font-bold text-green-600">
                ${(newService.quantity * newService.unitPrice).toFixed(2)}
              </span>
            </div>
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
            onClick={onSubmit}
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