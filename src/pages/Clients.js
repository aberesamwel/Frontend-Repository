import React from 'react';
import { User, Phone, Mail, MapPin } from 'lucide-react';

const Clients = ({ projects }) => {
  const clients = React.useMemo(() => {
    const clientMap = {};
    projects.forEach(project => {
      if (!clientMap[project.clientName]) {
        clientMap[project.clientName] = {
          name: project.clientName,
          projects: [],
          totalValue: 0,
          totalProfit: 0
        };
      }
      clientMap[project.clientName].projects.push(project);
      clientMap[project.clientName].totalValue += project.clientPayment;
      clientMap[project.clientName].totalProfit += project.profit;
    });
    return Object.values(clientMap);
  }, [projects]);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Clients</h1>
        <p className="text-slate-600">Manage client relationships and project history</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{client.name}</h3>
                <p className="text-sm text-slate-500">{client.projects.length} projects</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Total Value:</span>
                <span className="text-sm font-semibold text-green-600">${client.totalValue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Total Profit:</span>
                <span className="text-sm font-semibold text-blue-600">${client.totalProfit.toLocaleString()}</span>
              </div>
              <div className="pt-3 border-t">
                <h4 className="text-sm font-medium text-slate-700 mb-2">Recent Projects:</h4>
                {client.projects.slice(0, 3).map(project => (
                  <div key={project.id} className="text-xs text-slate-500 mb-1">
                    {project.projectId} - {project.vehicleType}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Clients;