import React, { useState } from 'react';
import { Eye, Scissors, Zap, Banknote, Smartphone, CreditCard, Landmark, Wallet } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const ServiceTable = ({ 
  services, 
  onViewDetails, 
  onStatusUpdate, 
  onPaymentUpdate,
  getStatusColor, 
  getPriorityColor 
}) => {
  const { getThemeClass } = useTheme();
  const [partialAmounts, setPartialAmounts] = useState({});

  const paymentMethods = [
    { id: 'cash', name: 'Cash', icon: Banknote, color: 'text-green-600' },
    { id: 'mpesa', name: 'M-Pesa', icon: Smartphone, color: 'text-green-500' },
    { id: 'card', name: 'Card', icon: CreditCard, color: 'text-blue-600' },
    { id: 'bank', name: 'Bank Transfer', icon: Landmark, color: 'text-purple-600' },
    { id: 'crypto', name: 'Crypto', icon: Wallet, color: 'text-orange-500' }
  ];

  const getPaymentMethodIcon = (method) => {
    const paymentMethod = paymentMethods.find(pm => pm.id === method);
    return paymentMethod || { icon: Banknote, color: 'text-gray-500' };
  };

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
              <th className={`text-left py-4 px-6 font-semibold ${getThemeClass('text', 'primary')}`}>Timeline</th>
              <th className={`text-right py-4 px-6 font-semibold ${getThemeClass('text', 'primary')}`}>Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${getThemeClass('border', 'primary')}`}>
            {services.map((service) => {
              const serviceType = service.service || service.service_type || service.serviceType || '';
              const ServiceIcon = getServiceIcon(serviceType.toLowerCase());
              const totalAmount = parseFloat(service.total_amount || service.totalAmount || 0);
              const amountPaid = parseFloat(service.amount_paid || service.amountPaid || 0);
              const ticketId = service.ticket_id || service.ticketId || '';
              const customerName = service.customer || service.client_name || service.customer_name || service.customerName || '';
              const phone = service.phone || '';
              const balanceAmount = totalAmount - amountPaid;
              const dropOffTime = service.drop_off_time || service.dropOffTime || service.created_at;
              const pickupTime = service.pickup_time || service.pickupTime;
              
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
                        <div className={`font-medium ${getThemeClass('text', 'primary')}`}>{ticketId}</div>
                        <div className={`text-sm ${getPriorityColor(service.priority)} capitalize`}>
                          {service.priority} Priority
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="py-4 px-6">
                    <div>
                      <div className={`font-medium ${getThemeClass('text', 'primary')}`}>{customerName}</div>
                      <div className={`text-sm ${getThemeClass('text', 'muted')}`}>{phone}</div>
                    </div>
                  </td>
                  
                  <td className="py-4 px-6">
                    <div>
                      <div className={`font-medium ${getThemeClass('text', 'primary')} capitalize`}>
                        {serviceType.replace('_', ' ') || 'Metal Works'}
                      </div>
                      <div className={`text-sm ${getThemeClass('text', 'muted')}`}>{service.material || 'Steel'}</div>
                      <div className="flex items-center space-x-3 mt-1">
                        <div className={`text-xs ${getThemeClass('text', 'tertiary')}`}>Qty: {service.quantity || 1}</div>
                        {service.gauge && (
                          <div className={`text-xs ${getThemeClass('text', 'tertiary')}`}>Gauge: {service.gauge}</div>
                        )}
                        {service.dimensions && (
                          <div className={`text-xs ${getThemeClass('text', 'tertiary')}`}>Size: {service.dimensions}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  
                  <td className="py-4 px-6">
                    <div className="space-y-2">
                      <div className={`font-bold ${getThemeClass('text', 'primary')}`}>
                        Total: ${totalAmount.toFixed(2)}
                      </div>
                      
                      <div className="space-y-1">
                        <div className={`text-sm flex items-center space-x-2 ${amountPaid >= totalAmount ? 'text-green-600' : 'text-orange-600'}`}>
                          <span>Paid: ${amountPaid.toFixed(2)}</span>
                          {service.paymentMethod && (() => {
                            const { icon: PaymentIcon, color } = getPaymentMethodIcon(service.paymentMethod);
                            return <PaymentIcon className={`w-3 h-3 ${color}`} />;
                          })()}
                        </div>
                        
                        {balanceAmount > 0 && (
                          <div className="text-sm font-medium text-red-600">
                            Debt: ${balanceAmount.toFixed(2)}
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <input
                          type="number"
                          min="0"
                          max={totalAmount}
                          step="0.01"
                          value={partialAmounts[service.id] !== undefined ? partialAmounts[service.id] : amountPaid}
                          onChange={(e) => {
                            const amount = parseFloat(e.target.value) || 0;
                            setPartialAmounts(prev => ({ ...prev, [service.id]: amount }));
                          }}
                          onBlur={(e) => {
                            const amount = parseFloat(e.target.value) || 0;
                            const status = amount === 0 ? 'unpaid' : amount >= totalAmount ? 'paid' : 'partial';
                            onPaymentUpdate(service.id, status, amount);
                          }}
                          className={`text-xs border rounded px-2 py-1 w-full ${getThemeClass('bg', 'primary')} ${getThemeClass('border', 'primary')} ${getThemeClass('text', 'primary')}`}
                          placeholder="Amount paid"
                        />
                        
                        <select
                          value={service.paymentMethod || ''}
                          onChange={(e) => onPaymentUpdate(service.id, service.paymentStatus, service.amountPaid, e.target.value)}
                          className={`text-xs border rounded px-2 py-1 w-full ${getThemeClass('bg', 'primary')} ${getThemeClass('border', 'primary')} ${getThemeClass('text', 'primary')}`}
                        >
                          <option value="">Payment Method</option>
                          {paymentMethods.map(method => (
                            <option key={method.id} value={method.id}>{method.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </td>
                  
                  <td className="py-4 px-6">
                    <select
                      value={service.status}
                      onChange={(e) => onStatusUpdate(service.id, e.target.value)}
                      className={`text-xs border rounded px-2 py-1 ${getStatusColor(service.status)} font-medium`}
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="picked_up">Picked Up</option>
                    </select>
                  </td>
                  
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <div className={`text-sm ${getThemeClass('text', 'primary')}`}>
                        {dropOffTime ? new Date(dropOffTime).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric' 
                        }) : 'No date'}
                      </div>
                      <div className={`text-xs ${getThemeClass('text', 'muted')}`}>
                        {dropOffTime ? new Date(dropOffTime).toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        }) : ''}
                      </div>
                      {pickupTime && (
                        <div className="text-xs text-green-600 font-medium">
                          ✓ Picked up {new Date(pickupTime).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </div>
                      )}
                    </div>
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