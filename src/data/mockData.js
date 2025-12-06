import { 
  Truck, Wrench, Settings, Home, AlertTriangle, 
  Calendar, TrendingUp, DollarSign, Users, FileText, Hammer, Scissors, Phone 
} from 'lucide-react';

export const kpiData = [
  { 
    title: 'Active Projects', 
    value: '24', 
    change: '+8', 
    changeType: 'positive', 
    icon: Truck,
    subtitle: 'In Progress'
  },
  { 
    title: 'Total Sales', 
    value: '$485,200', 
    change: '+22.5%', 
    changeType: 'positive', 
    icon: DollarSign,
    subtitle: 'This Month'
  },
  { 
    title: 'Profit Margin', 
    value: '34.8%', 
    change: '+2.1%', 
    changeType: 'positive', 
    icon: TrendingUp,
    subtitle: 'Average'
  },
  { 
    title: 'Pending Delivery', 
    value: '7', 
    change: '-2', 
    changeType: 'negative', 
    icon: AlertTriangle,
    subtitle: 'Ready for Pickup'
  }
];

export const projectsData = [
  { 
    id: 1, 
    projectId: 'VB-2024-001', 
    clientName: 'John Smith Transport', 
    vehicleType: 'Truck Body - Flatbed', 
    clientPayment: 45000,
    materialCost: 28500,
    laborCost: 8200,
    profit: 8300,
    profitMargin: 18.4,
    status: 'In Progress',
    progress: 65,
    startDate: '2024-01-15',
    estimatedCompletion: '2024-02-28'
  },
  { 
    id: 2, 
    projectId: 'VB-2024-002', 
    clientName: 'Metro Logistics LLC', 
    vehicleType: 'Van Body - Refrigerated', 
    clientPayment: 62000,
    materialCost: 38200,
    laborCost: 12500,
    profit: 11300,
    profitMargin: 18.2,
    status: 'Material Sourcing',
    progress: 25,
    startDate: '2024-01-22',
    estimatedCompletion: '2024-03-15'
  },
  { 
    id: 3, 
    projectId: 'VB-2024-003', 
    clientName: 'City Construction Co', 
    vehicleType: 'Dump Truck Body', 
    clientPayment: 78000,
    materialCost: 52000,
    laborCost: 15200,
    profit: 10800,
    profitMargin: 13.8,
    status: 'Welding Phase',
    progress: 45,
    startDate: '2024-01-08',
    estimatedCompletion: '2024-03-01'
  },
  { 
    id: 4, 
    projectId: 'VB-2024-004', 
    clientName: 'Fresh Foods Delivery', 
    vehicleType: 'Box Truck Body', 
    clientPayment: 35000,
    materialCost: 22800,
    laborCost: 6500,
    profit: 5700,
    profitMargin: 16.3,
    status: 'Quality Check',
    progress: 90,
    startDate: '2023-12-20',
    estimatedCompletion: '2024-02-10'
  },
  { 
    id: 5, 
    projectId: 'VB-2024-005', 
    clientName: 'Emergency Services Inc', 
    vehicleType: 'Ambulance Body', 
    clientPayment: 125000,
    materialCost: 85000,
    laborCost: 22000,
    profit: 18000,
    profitMargin: 14.4,
    status: 'Interior Fitting',
    progress: 75,
    startDate: '2024-01-05',
    estimatedCompletion: '2024-03-20'
  }
];

// Static activities removed - now using dynamic ActivityLogger

export const monthlyData = [
  { month: 'Jan', sales: 285000, projects: 8, profit: 52000 },
  { month: 'Feb', sales: 322000, projects: 12, profit: 68000 },
  { month: 'Mar', sales: 458000, projects: 15, profit: 89000 },
  { month: 'Apr', sales: 394000, projects: 11, profit: 72000 },
  { month: 'May', sales: 512000, projects: 18, profit: 95000 },
  { month: 'Jun', sales: 485200, projects: 16, profit: 87500 }
];

export const inventoryData = [
  { 
    id: 1, 
    sku: 'STL-001', 
    name: 'Steel Sheets 4x8ft', 
    category: 'Raw Materials', 
    brand: 'SteelCorp', 
    quantity: 45, 
    minStock: 10,
    price: 124.99,
    location: 'Warehouse A-1',
    status: 'In Stock'
  },
  { 
    id: 2, 
    sku: 'WLD-205', 
    name: 'Welding Rods Pack', 
    category: 'Welding Supplies', 
    brand: 'Lincoln Electric', 
    quantity: 8, 
    minStock: 15,
    price: 89.50,
    location: 'Tool Room B-2',
    status: 'Low Stock'
  },
  { 
    id: 3, 
    sku: 'HYD-301', 
    name: 'Hydraulic Cylinder', 
    category: 'Hydraulics', 
    brand: 'Parker', 
    quantity: 12, 
    minStock: 5,
    price: 445.00,
    location: 'Parts Storage C-3',
    status: 'In Stock'
  },
  { 
    id: 4, 
    sku: 'PNT-102', 
    name: 'Industrial Paint Gallon', 
    category: 'Finishing', 
    brand: 'Sherwin Williams', 
    quantity: 3, 
    minStock: 8,
    price: 78.99,
    location: 'Paint Booth D-1',
    status: 'Low Stock'
  },
  { 
    id: 5, 
    sku: 'BLT-401', 
    name: 'Heavy Duty Bolts Set', 
    category: 'Fasteners', 
    brand: 'Fastenal', 
    quantity: 156, 
    minStock: 50,
    price: 35.75,
    location: 'Hardware Bin E-5',
    status: 'In Stock'
  },
  { 
    id: 6, 
    sku: 'RBR-501', 
    name: 'Rubber Seals Kit', 
    category: 'Sealing', 
    brand: 'Gates', 
    quantity: 28, 
    minStock: 15,
    price: 67.30,
    location: 'Parts Storage C-7',
    status: 'In Stock'
  }
];

export const navItems = [
  { name: 'Dashboard', icon: Home, active: true, path: '/' },
  { name: 'Projects', icon: Truck, active: false, path: '/projects' },
  { name: 'Clients', icon: Users, active: false, path: '/clients' },
  { name: 'Contacts', icon: Phone, active: false, path: '/contacts' },
  { name: 'Materials', icon: Wrench, active: false, path: '/materials' },
  { name: 'Tools', icon: Hammer, active: false, path: '/tools' },
  { name: 'Metal Works', icon: Scissors, active: false, path: '/metalworks' },
  { name: 'Calendar', icon: Calendar, active: false, path: '/calendar' },
  { name: 'Reports', icon: FileText, active: false, path: '/reports' },
  { name: 'Settings', icon: Settings, active: false, path: '/settings' }
];

export const notifications = [
  {
    id: 1,
    type: 'meeting',
    title: 'Client Meeting - Metro Logistics',
    message: 'Project review meeting scheduled for today at 2:00 PM',
    time: '2024-01-15T14:00:00',
    priority: 'high',
    read: false
  },
  {
    id: 2,
    type: 'deadline',
    title: 'Project Deadline Approaching',
    message: 'VB-2024-004 delivery due in 2 days',
    time: '2024-01-17T09:00:00',
    priority: 'medium',
    read: false
  },
  {
    id: 3,
    type: 'material',
    title: 'Low Stock Alert',
    message: 'Welding Rods Pack running low (8 units remaining)',
    time: '2024-01-15T08:30:00',
    priority: 'medium',
    read: true
  }
];

export const toolsData = [
  {
    id: 1,
    name: 'Welding Machine - MIG 200A',
    category: 'Welding Equipment',
    serialNumber: 'WM-2024-001',
    quantity: 1,
    toolGroup: null,
    status: 'checked_out',
    checkedOutBy: 'Mike Johnson',
    checkedOutTime: '2024-01-13T08:30:00', // 2 days ago
    location: 'Bay 3 - Welding Station',
    condition: 'Good',
    notes: 'Heavy welding project'
  },
  {
    id: 2,
    name: 'Angle Grinder - 9 inch',
    category: 'Power Tools',
    serialNumber: 'AG-2024-015',
    quantity: 1,
    toolGroup: null,
    status: 'available',
    checkedOutBy: null,
    checkedOutTime: null,
    location: 'Tool Room A - Shelf 2',
    condition: 'Excellent',
    returnedTime: '2024-01-14T16:30:00',
    lastReturnedBy: 'Tom Wilson'
  },
  {
    id: 3,
    name: 'Hydraulic Jack - 20 Ton',
    category: 'Lifting Equipment',
    serialNumber: 'HJ-2024-008',
    quantity: 1,
    toolGroup: null,
    status: 'checked_out',
    checkedOutBy: 'Sarah Wilson',
    checkedOutTime: '2024-01-15T09:15:00', // Today
    location: 'Bay 1 - Assembly Area',
    condition: 'Good',
    notes: 'Vehicle lift maintenance'
  },
  {
    id: 4,
    name: 'Plasma Cutter - 40A',
    category: 'Cutting Tools',
    serialNumber: 'PC-2024-003',
    quantity: 1,
    toolGroup: null,
    status: 'maintenance',
    checkedOutBy: null,
    checkedOutTime: null,
    location: 'Maintenance Shop',
    condition: 'Under Repair'
  },
  {
    id: 5,
    name: 'Impact Wrench Set',
    category: 'Hand Tools',
    serialNumber: 'IW-2024-022',
    quantity: 1,
    toolGroup: null,
    status: 'available',
    checkedOutBy: null,
    checkedOutTime: null,
    location: 'Tool Room B - Cabinet 5',
    condition: 'Good'
  },
  {
    id: 6,
    name: 'Overhead Crane Remote',
    category: 'Lifting Equipment',
    serialNumber: 'CR-2024-001',
    quantity: 1,
    toolGroup: null,
    status: 'checked_out',
    checkedOutBy: 'David Chen',
    checkedOutTime: '2024-01-10T07:45:00', // 5 days ago (overdue)
    location: 'Bay 2 - Heavy Assembly',
    condition: 'Excellent',
    notes: 'Long-term project use'
  }
];

export const userProfile = {
  name: 'John Doe',
  role: 'Workshop Manager',
  email: 'john.doe@pexsteel.com',
  phone: '+1 (555) 123-4567',
  department: 'Operations',
  joinDate: '2022-03-15',
  avatar: null,
  initials: 'JD',
  status: 'Online',
  permissions: ['admin', 'reports', 'projects'],
  meetings: [
    {
      id: 1,
      title: 'Project Review - Metro Logistics',
      date: '2024-01-15',
      time: '14:00',
      client: 'Metro Logistics LLC',
      project: 'VB-2024-002'
    },
    {
      id: 2,
      title: 'Material Supplier Meeting',
      date: '2024-01-18',
      time: '10:30',
      client: 'SteelCorp Industries',
      project: 'General'
    }
  ]
};