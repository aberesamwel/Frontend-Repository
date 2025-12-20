// Convert backend snake_case to frontend camelCase
export const normalizeProject = (project) => {
  if (!project) return null;
  
  return {
    id: project.id,
    projectId: project.projectId || project.project_id,
    clientName: project.clientName || project.client_name,
    phone: project.phone,
    chassisBrand: project.chassisBrand || project.chassis_brand,
    chassisModel: project.chassisModel || project.chassis_model,
    bodyType: project.bodyType || project.body_type,
    vehicleType: project.vehicleType || project.vehicle_type,
    clientPayment: parseFloat(project.clientPayment || project.client_payment || 0),
    materialCost: parseFloat(project.materialCost || project.material_cost || 0),
    laborCost: parseFloat(project.laborCost || project.labor_cost || 0),
    profit: parseFloat(project.profit || 0),
    profitMargin: parseFloat(project.profitMargin || project.profit_margin || 0),
    status: project.status,
    progress: parseInt(project.progress || 0),
    startDate: project.startDate || project.start_date,
    estimatedCompletion: project.estimatedCompletion || project.estimated_completion,
    completedAt: project.completedAt || project.completed_at,
    deliveredAt: project.deliveredAt || project.delivered_at,
    materials: project.materials || [],
    notes: project.notes || '',
    amountPaid: parseFloat(project.amountPaid || project.amount_paid || 0),
    createdAt: project.createdAt || project.created_at,
    updatedAt: project.updatedAt || project.updated_at
  };
};

export const normalizeMaterial = (material) => {
  if (!material) return null;
  
  return {
    id: material.id,
    name: material.name,
    quantity: parseFloat(material.quantity || 0),
    unit: material.unit,
    price: parseFloat(material.price || 0),
    supplier: material.supplier,
    status: material.status,
    minStock: material.minStock || material.min_stock || 10,
    criticalStock: material.criticalStock || material.critical_stock || 5,
    createdAt: material.createdAt || material.created_at,
    updatedAt: material.updatedAt || material.updated_at
  };
};

export const normalizeClient = (client) => {
  if (!client) return null;
  
  return {
    id: client.id,
    name: client.name,
    phone: client.phone,
    email: client.email,
    address: client.address,
    serviceType: client.serviceType || client.service_type,
    createdAt: client.createdAt || client.created_at
  };
};
