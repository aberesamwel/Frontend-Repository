// Sample metal works services for testing analytics
export const sampleMetalWorksServices = [
  {
    id: 1,
    ticket_id: 'MW-001',
    customer_name: 'John Doe',
    phone: '+254712345678',
    service_type: 'cutting',
    material: 'Steel Sheet',
    priority: 'standard',
    total_amount: 5000,
    amount_paid: 3000,
    payment_status: 'partial',
    payment_method: 'mpesa',
    status: 'completed',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    completed_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    quantity: 5,
    gauge: '2mm',
    dimensions: '1200x800mm'
  },
  {
    id: 2,
    ticket_id: 'MW-002',
    customer_name: 'Jane Smith',
    phone: '+254723456789',
    service_type: 'welding',
    material: 'Aluminum',
    priority: 'urgent',
    total_amount: 8500,
    amount_paid: 8500,
    payment_status: 'paid',
    payment_method: 'cash',
    status: 'picked_up',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    completed_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    delivered_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    quantity: 3,
    specifications: 'Custom frame welding'
  },
  {
    id: 3,
    ticket_id: 'MW-003',
    customer_name: 'Mike Johnson',
    phone: '+254734567890',
    service_type: 'bending',
    material: 'Mild Steel',
    priority: 'standard',
    total_amount: 3200,
    amount_paid: 0,
    payment_status: 'unpaid',
    payment_method: null,
    status: 'in_progress',
    created_at: new Date().toISOString(), // Today
    quantity: 2,
    gauge: '3mm',
    dimensions: '2000x1000mm'
  },
  {
    id: 4,
    ticket_id: 'MW-004',
    customer_name: 'Sarah Wilson',
    phone: '+254745678901',
    service_type: 'fabrication',
    material: 'Stainless Steel',
    priority: 'rush',
    total_amount: 12000,
    amount_paid: 6000,
    payment_status: 'partial',
    payment_method: 'bank',
    status: 'pending',
    created_at: new Date().toISOString(), // Today
    quantity: 1,
    specifications: 'Custom gate fabrication'
  },
  {
    id: 5,
    ticket_id: 'MW-005',
    customer_name: 'David Brown',
    phone: '+254756789012',
    service_type: 'cutting',
    material: 'Carbon Steel',
    priority: 'standard',
    total_amount: 4500,
    amount_paid: 4500,
    payment_status: 'paid',
    payment_method: 'card',
    status: 'completed',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
    completed_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    quantity: 8,
    gauge: '1.5mm',
    dimensions: '800x600mm'
  }
];

export const seedMetalWorksServices = (force = false) => {
  const existing = localStorage.getItem('metalworks-services');
  if (!existing || force) {
    localStorage.setItem('metalworks-services', JSON.stringify(sampleMetalWorksServices));
    console.log('Seeded metal works services with sample data');
    return true;
  }
  return false;
};