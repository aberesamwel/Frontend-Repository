import { materialService } from '../services/materialService';

const defaultMaterials = [
  { name: 'ANGLE LINES', unit: 'pcs', price: 15.50, supplier: 'Steel Supply Co', quantity: 100 },
  { name: 'CHANNELS', unit: 'pcs', price: 25.00, supplier: 'Steel Supply Co', quantity: 50 },
  { name: 'PAINT', unit: 'l', price: 45.00, supplier: 'Paint World', quantity: 20 },
  { name: 'RED OXIDE', unit: 'l', price: 35.00, supplier: 'Paint World', quantity: 15 },
  { name: 'THINNER', unit: 'l', price: 12.00, supplier: 'Paint World', quantity: 25 },
  { name: 'TUBES', unit: 'pcs', price: 18.75, supplier: 'Steel Supply Co', quantity: 80 },
  { name: 'FLAT BAR', unit: 'pcs', price: 22.50, supplier: 'Steel Supply Co', quantity: 60 },
  { name: 'ROUND BAR', unit: 'pcs', price: 20.00, supplier: 'Steel Supply Co', quantity: 40 },
  { name: 'PIPES', unit: 'pcs', price: 30.00, supplier: 'Steel Supply Co', quantity: 35 },
  { name: 'GAS', unit: 'kg', price: 8.50, supplier: 'Gas Depot', quantity: 200 },
  { name: 'WHITE SILICON', unit: 'pcs', price: 6.75, supplier: 'Hardware Store', quantity: 50 },
  { name: 'SAND PAPER', unit: 'pcs', price: 2.25, supplier: 'Hardware Store', quantity: 100 },
  { name: 'FILLER', unit: 'kg', price: 15.00, supplier: 'Paint World', quantity: 30 },
  { name: 'STEEL SHEETS', unit: 'pcs', price: 85.00, supplier: 'Steel Supply Co', quantity: 25 },
  { name: 'ALUMINUM SHEETS', unit: 'pcs', price: 95.00, supplier: 'Metal Works', quantity: 20 },
  { name: 'BOLTS & NUTS', unit: 'box', price: 12.50, supplier: 'Hardware Store', quantity: 40 },
  { name: 'WELDING RODS', unit: 'kg', price: 25.00, supplier: 'Welding Supply', quantity: 50 },
  { name: 'PRIMER', unit: 'l', price: 28.00, supplier: 'Paint World', quantity: 18 },
  { name: 'CUTTING DISCS', unit: 'pcs', price: 4.50, supplier: 'Tool Supply', quantity: 75 },
  { name: 'GRINDING DISCS', unit: 'pcs', price: 3.75, supplier: 'Tool Supply', quantity: 80 },
  { name: 'SAFETY EQUIPMENT', unit: 'pcs', price: 35.00, supplier: 'Safety First', quantity: 15 }
];

export const seedDefaultMaterials = async () => {
  try {
    console.log('🌱 Seeding default materials...');
    
    // Get existing materials
    const response = await materialService.getAll();
    const existingMaterials = response.data.results || response.data || [];
    const existingNames = existingMaterials.map(m => m.name);
    
    // Filter out materials that already exist
    const newMaterials = defaultMaterials.filter(m => !existingNames.includes(m.name));
    
    if (newMaterials.length === 0) {
      console.log('✅ All default materials already exist in database');
      return { success: true, message: 'All materials already exist' };
    }
    
    // Add new materials
    const results = [];
    for (const material of newMaterials) {
      try {
        const result = await materialService.create(material);
        results.push(result.data);
        console.log(`✅ Added: ${material.name}`);
      } catch (error) {
        console.error(`❌ Failed to add ${material.name}:`, error.response?.data || error.message);
      }
    }
    
    console.log(`🎉 Successfully seeded ${results.length} materials`);
    return { 
      success: true, 
      message: `Added ${results.length} new materials to database`,
      materials: results 
    };
    
  } catch (error) {
    console.error('❌ Failed to seed materials:', error);
    return { 
      success: false, 
      message: 'Failed to seed materials: ' + error.message 
    };
  }
};

export const checkAndSeedMaterials = async () => {
  try {
    const response = await materialService.getAll();
    const materials = response.data.results || response.data || [];
    
    // If no materials exist, seed them
    if (materials.length === 0) {
      return await seedDefaultMaterials();
    }
    
    return { success: true, message: 'Materials already exist', materials };
  } catch (error) {
    // If API fails, try to seed
    console.log('API not available, attempting to seed when connection is restored...');
    return { success: false, message: 'API not available' };
  }
};