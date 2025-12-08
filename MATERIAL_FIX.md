# Material Creation Fix - 400 Error

## Problem
When adding a new material, got error: `Failed to add material: Request failed with status code 400`

## Root Cause
Frontend was sending incorrect field names that didn't match the backend API expectations:
- Frontend sent: `unit_price` 
- Backend expects: `price`
- Frontend was also sending `status` which is auto-calculated by backend

## Backend Material Model Fields
```python
Required fields:
- name (string, unique)
- quantity (decimal)
- unit (choice: 'kg', 'pcs', 'm', 'm2', 'l', 'box', 'roll')
- price (decimal)

Optional fields:
- supplier (string)
- sku (string)
- cost_price (decimal)
- min_stock (decimal, default: 10)
- critical_stock (decimal, default: 5)
- category (string)
- location (string)
- description (text)

Auto-calculated:
- status (auto-updated based on quantity thresholds)
```

## Fix Applied
Updated `/src/pages/Materials.js`:

1. **Material creation payload** - Changed field name:
   ```javascript
   // Before
   unit_price: parseFloat(newMaterial.price)
   
   // After
   price: parseFloat(newMaterial.price)
   ```

2. **Removed status from payload** - Backend auto-calculates it

3. **Status display** - Added formatters to handle backend's snake_case format:
   - Backend returns: `in_stock`, `low_stock`, `critical`, `out_of_stock`
   - Frontend displays: "In Stock", "Low Stock", "Critical", "Out Of Stock"

4. **Price field references** - Simplified to use only `price` field

## Testing
✅ Add new material with all required fields
✅ Verify material appears in list
✅ Check status is displayed correctly
✅ Verify price calculations work
