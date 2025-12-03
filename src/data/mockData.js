import { 
  Truck, Wrench, Settings, Home, AlertTriangle, 
  Calendar, TrendingUp, DollarSign, Users, FileText 
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
    title: 'Total Revenue', 
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

export const recentActivities = [
  {
    id: 1,
    type: 'progress',
    message: 'VB-2024-001: Welding phase completed - 65% progress',
    time: '15 minutes ago',
    status: 'success'
  },
  {
    id: 2,
    type: 'payment',
    message: 'Payment received: $15,000 from Metro Logistics LLC',
    time: '45 minutes ago',
    status: 'success'
  },
  {
    id: 3,
    type: 'material',
    message: 'Material delivery: Steel sheets for VB-2024-003',
    time: '2 hours ago',
    status: 'info'
  },
  {
    id: 4,
    type: 'quality',
    message: 'Quality inspection passed for VB-2024-004',
    time: '4 hours ago',
    status: 'success'
  }
];

export const monthlyData = [
  { month: 'Jan', revenue: 285000, projects: 8, profit: 52000 },
  { month: 'Feb', revenue: 322000, projects: 12, profit: 68000 },
  { month: 'Mar', revenue: 458000, projects: 15, profit: 89000 },
  { month: 'Apr', revenue: 394000, projects: 11, profit: 72000 },
  { month: 'May', revenue: 512000, projects: 18, profit: 95000 },
  { month: 'Jun', revenue: 485200, projects: 16, profit: 87500 }
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
  { name: 'Materials', icon: Wrench, active: false, path: '/materials' },

  { name: 'Reports', icon: FileText, active: false, path: '/reports' },
  { name: 'Settings', icon: Settings, active: false, path: '/settings' }
];