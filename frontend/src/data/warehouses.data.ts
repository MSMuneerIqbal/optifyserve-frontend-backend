/**
 * Warehouse Sample Data
 * Three UAE warehouses: Dubai (main), Abu Dhabi (branch), Sharjah (branch)
 */

import type { Warehouse } from '@/features/inventory/types'

export const sampleWarehouses: Warehouse[] = [
  {
    id: 'wh_001',
    name: 'Main Warehouse Dubai',
    code: 'WH-DUB',
    type: 'main',
    status: 'active',
    isDefault: true,
    address: {
      street: 'Rashid Sweets Street, Al Quoz Industrial Area 3',
      city: 'Dubai',
      emirate: 'Dubai',
      country: 'UAE',
    },
    phone: '+971 4 123 4567',
    email: 'warehouse.dubai@optifyserve.com',
    managerId: 'usr_001',
    notes: 'Main storage facility for Dubai operations. Open Sun-Thu 7:00 AM - 6:00 PM.',
    isActive: true,
    createdBy: { id: 'usr_001', name: 'System Admin' },
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'wh_002',
    name: 'Branch Warehouse Abu Dhabi',
    code: 'WH-ADH',
    type: 'branch',
    status: 'active',
    isDefault: false,
    address: {
      street: 'Mussafah Industrial Area, Sector M-17',
      city: 'Abu Dhabi',
      emirate: 'Abu Dhabi',
      country: 'UAE',
    },
    phone: '+971 2 550 1234',
    email: 'warehouse.abudhabi@optifyserve.com',
    managerId: 'usr_004',
    notes: 'Branch facility serving Abu Dhabi and Al Ain region. Handles ADNOC and government contracts.',
    isActive: true,
    createdBy: { id: 'usr_001', name: 'System Admin' },
    createdAt: '2025-01-05T00:00:00Z',
    updatedAt: '2025-01-05T00:00:00Z',
  },
  {
    id: 'wh_003',
    name: 'Branch Warehouse Sharjah',
    code: 'WH-SHJ',
    type: 'branch',
    status: 'active',
    isDefault: false,
    address: {
      street: 'Industrial Area 6, Street 15',
      city: 'Sharjah',
      emirate: 'Sharjah',
      country: 'UAE',
    },
    phone: '+971 6 534 5678',
    email: 'warehouse.sharjah@optifyserve.com',
    managerId: 'usr_005',
    notes: 'Branch facility covering Sharjah, Ajman, and northern emirates. SEWA contract support.',
    isActive: true,
    createdBy: { id: 'usr_001', name: 'System Admin' },
    createdAt: '2025-01-10T00:00:00Z',
    updatedAt: '2025-01-10T00:00:00Z',
  },
]
