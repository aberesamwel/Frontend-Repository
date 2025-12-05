import React from 'react';
import { Eye, Scissors, Zap } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const ServiceTable = ({ 
  services, 
  onViewDetails, 
  onStatusUpdate, 
  getStatusColor, 
  getPriorityColor 
}) => {
  const { getThemeClass } = useTheme();

  const getServiceIcon = (serviceType) => {
    const icons = {
      cutting: Scissors,
      bending: Zap,
      welding: Zap,
      fabrication: Scissors
    };
    return icons[serviceType] || Scissors;
  };

  return (
    <div className={`${getThemeClass('bg', 'secondary')} rounded-xl shadow-sm border ${getThemeClass('border', 'primary')} overflow-hidden`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={`${getThemeClass('bg', 'tertiary')} border-b ${getThemeClass('border', 'primary')}`}>
            <tr>
              <th className={`text-left py-4 px-6 font-semibold ${getThemeClass('text', 'primary')}`}>Ticket</th>
              <th className={`text-left py-4 px-6 font-semibold ${getThemeClass('text', 'primary')}`}>Customer</th>
              <th className={`text-left py-4 px-6 font-semibold ${getThemeClass('text', 'primary')}`}>Service</th>
              <th className={`text-left py-4 px-6 font-semibold ${getThemeClass('text', 'primary')}`}>Amount</th>
              <th className={`text-left py-4 px-6 font-semibold ${getThemeClass('text', 'primary')}`}>Status</th>
              <th className={`text-right py-4 px-6 font-semibold ${getThemeClass('text', 'primary')}`}>Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${getThemeClass('border', 'primary')}`}>
            {services.map((service) => {
              const ServiceIcon = getServiceIcon(service.serviceType);
              const balanceAmount = service.totalAmount - service.amountPaid;
              
              return (
                <tr key={service.id} className={`hover:${getThemeClass('bg', 'hover')} transition-colors`}>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        service.priority === 'rush' ? 'bg-red-100' :
                        service.priority === 'urgent' ? 'bg-orange-100' : 'bg-blue-100'
                      }`}>
                        <ServiceIcon className={`w-4 h-4 ${
                          service.priority === 'rush' ? 'text-red-600' :
                          service.priority === 'urgent' ? 'text-orange-600' : 'text-blue-600'
                        }`} />
                      </div>
                      <div>
                        <div className={`font-medium ${getThemeClass('text', 'primary')}`}>{service.ticketId}</div>
                        <div className={`text-sm ${getPriorityColor(service.priority)} capitalize`}>
                          {service.priority} Priority
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="py-4 px-6">
                    <div>
                      <div className={`font-medium ${getThemeClass('text', 'primary')}`}>{service.customerName}</div>
                      <div className={`text-sm ${getThemeClass('text', 'muted')}`}>{service.phone}</div>
                    </div>
                  </td>
                  
                  <td className="py-4 px-6">
                    <div>
                      <div className={`font-medium ${getThemeClass('text', 'primary')} capitalize`}>
                        {service.serviceType.replace('_', ' ')}
                      </div>
                      <div className={`text-sm ${getThemeClass('text', 'muted')}`}>{service.material}</div>
                      <div className={`text-xs ${getThemeClass('text', 'tertiary')}`}>Qty: {service.quantity}</div>
                    </div>
                  </td>
                  
                  <td className="py-4 px-6">
                    <div>
                      <div className={`font-bold ${getThemeClass('text', 'primary')}`}>${service.totalAmount.toFixed(2)}</div>
                      <div className={`text-sm ${service.amountPaid >= service.totalAmount ? 'text-green-600' : 'text-orange-600'}`}>
                        Paid: ${service.amountPaid.toFixed(2)}
                      </div>
                      {balanceAmount > 0 && (
                        <div className="text-sm text-red-600">
                          Balance: ${balanceAmount.toFixed(2)}
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td className="py-4 px-6">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(service.status)}`}>
                      {service.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  
                  <td className="py-4 px-6 text-right">
                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={() => onViewDetails(service)}
                        className="text-blue-600 hover:text-blue-800 font-medium flex items-center justify-end"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        <span className="text-xs">Details</span>
                      </button>
                      
                      {service.status === 'pending' && (
                        <button
                          onClick={() => onStatusUpdate(service.id, 'in_progress')}
                          className="text-orange-600 hover:text-orange-800 font-medium text-xs"
                        >
                          Start Work
                        </button>
                      )}
                      
                      {service.status === 'in_progress' && (
                        <button
                          onClick={() => onStatusUpdate(service.id, 'completed')}
                          className="text-green-600 hover:text-green-800 font-medium text-xs"
                        >
                          Mark Complete
                        </button>
                      )}
                      
                      {service.status === 'completed' && (
                        <button
                          onClick={() => onStatusUpdate(service.id, 'picked_up')}
                          className="text-blue-600 hover:text-blue-800 font-medium text-xs"
                        >
                          Mark Picked Up
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServiceTable;