import React from 'react';
import { X, Calendar, Clock, Ruler, Weight } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const ServiceDetailsModal = ({ service, onClose }) => {
  const { theme, getThemeClass } = useTheme();
  const isDark = theme === 'dark';

  if (!service) return null;

  const getStatusColor = (status) => {
    const colors = {
      pending: isDark ? 'bg-yellow-900/30 text-yellow-300 border-yellow-700' : 'bg-yellow-50 text-yellow-700 border-yellow-200',
      in_progress: isDark ? 'bg-blue-900/30 text-blue-300 border-blue-700' : 'bg-blue-50 text-blue-700 border-blue-200',
      completed: isDark ? 'bg-green-900/30 text-green-300 border-green-700' : 'bg-green-50 text-green-700 border-green-200',
      picked_up: isDark ? 'bg-gray-900/30 text-gray-300 border-gray-700' : 'bg-gray-50 text-gray-700 border-gray-200'
    };
    return colors[status] || colors.pending;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`${getThemeClass('bg', 'secondary')} rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto`}>
        <div className={`p-6 ${getThemeClass('border', 'primary')} border-b`}>
          <div className="flex justify-between items-center">
            <h3 className={`text-lg font-semibold ${getThemeClass('text', 'primary')}`}>Service Details - {service.ticketId}</h3>
            <button
              onClick={onClose}
              className={`${getThemeClass('text', 'muted')} hover:${getThemeClass('text', 'primary')} transition-colors`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Header Info */}
          <div className={`${isDark ? 'bg-gradient-to-r from-blue-900/50 to-indigo-900/50' : 'bg-gradient-to-r from-blue-50 to-indigo-50'} p-4 rounded-lg`}>
            <h4 className={`text-xl font-bold ${getThemeClass('text', 'primary')}`}>{service.customerName}</h4>
            <p className={`${getThemeClass('text', 'tertiary')}`}>{service.phone}</p>
            <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium mt-2 border ${getStatusColor(service.status)}`}>
              {service.status.replace('_', ' ').toUpperCase()}
            </div>
          </div>

          {/* Product Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className={`font-semibold ${getThemeClass('text', 'primary')} mb-3 flex items-center`}>
                <Weight className="w-4 h-4 mr-2" />
                Product Information
              </h5>
              <div className="space-y-2">
                <p><span className={`${getThemeClass('text', 'muted')}`}>Material:</span> <span className={`${getThemeClass('text', 'primary')}`}>{service.material}</span></p>
                <p><span className={`${getThemeClass('text', 'muted')}`}>Quantity:</span> <span className={`${getThemeClass('text', 'primary')}`}>{service.quantity} pieces</span></p>
                {service.gauge && (
                  <p><span className={`${getThemeClass('text', 'muted')}`}>Gauge:</span> <span className={`${getThemeClass('text', 'primary')}`}>{service.gauge}</span></p>
                )}
                {service.dimensions && (
                  <p><span className={`${getThemeClass('text', 'muted')}`}>Dimensions:</span> <span className={`${getThemeClass('text', 'primary')}`}>{service.dimensions}</span></p>
                )}
                <p><span className={`${getThemeClass('text', 'muted')}`}>Service:</span> <span className={`${getThemeClass('text', 'primary')} capitalize`}>{service.serviceType.replace('_', ' ')}</span></p>
              </div>
            </div>
            
            <div>
              <h5 className={`font-semibold ${getThemeClass('text', 'primary')} mb-3`}>Financial Summary</h5>
              <div className="space-y-2">
                <p><span className={`${getThemeClass('text', 'muted')}`}>Unit Price:</span> <span className={`${getThemeClass('text', 'primary')}`}>${service.unitPrice.toFixed(2)}</span></p>
                <p><span className={`${getThemeClass('text', 'muted')}`}>Total Amount:</span> <span className="font-bold text-green-600">${service.totalAmount.toFixed(2)}</span></p>
                <p><span className={`${getThemeClass('text', 'muted')}`}>Amount Paid:</span> <span className="font-bold text-blue-600">${service.amountPaid.toFixed(2)}</span></p>
                {service.totalAmount > service.amountPaid && (
                  <p><span className={`${getThemeClass('text', 'muted')}`}>Balance Due:</span> <span className="font-bold text-red-600">${(service.totalAmount - service.amountPaid).toFixed(2)}</span></p>
                )}
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h5 className={`font-semibold ${getThemeClass('text', 'primary')} mb-3 flex items-center`}>
              <Clock className="w-4 h-4 mr-2" />
              Service Timeline
            </h5>
            <div className="space-y-3">
              <div className={`p-3 rounded-lg ${getThemeClass('bg', 'tertiary')}`}>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <span className={`font-medium ${getThemeClass('text', 'primary')}`}>Drop-off</span>
                </div>
                <p className={`text-sm ${getThemeClass('text', 'muted')} mt-1`}>{formatDate(service.dropOffTime)}</p>
              </div>
              
              {service.completedTime && (
                <div className={`p-3 rounded-lg ${getThemeClass('bg', 'tertiary')}`}>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-green-500" />
                    <span className={`font-medium ${getThemeClass('text', 'primary')}`}>Completed</span>
                  </div>
                  <p className={`text-sm ${getThemeClass('text', 'muted')} mt-1`}>{formatDate(service.completedTime)}</p>
                </div>
              )}
              
              {service.pickupTime && (
                <div className={`p-3 rounded-lg ${getThemeClass('bg', 'tertiary')}`}>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-purple-500" />
                    <span className={`font-medium ${getThemeClass('text', 'primary')}`}>Picked Up</span>
                  </div>
                  <p className={`text-sm ${getThemeClass('text', 'muted')} mt-1`}>{formatDate(service.pickupTime)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Specifications */}
          {service.specifications && (
            <div>
              <h5 className={`font-semibold ${getThemeClass('text', 'primary')} mb-3 flex items-center`}>
                <Ruler className="w-4 h-4 mr-2" />
                Specifications
              </h5>
              <p className={`${getThemeClass('text', 'tertiary')} ${getThemeClass('bg', 'tertiary')} p-3 rounded-lg`}>{service.specifications}</p>
            </div>
          )}

          {/* Notes */}
          {service.notes && (
            <div>
              <h5 className={`font-semibold ${getThemeClass('text', 'primary')} mb-3`}>Notes</h5>
              <p className={`${getThemeClass('text', 'tertiary')} ${getThemeClass('bg', 'tertiary')} p-3 rounded-lg`}>{service.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailsModal;