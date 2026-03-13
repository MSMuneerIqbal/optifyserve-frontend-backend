/**
 * HR Module Sample Data
 * Comprehensive UAE-specific mock data for all HR sub-modules.
 * Extracted from HR API mock data for standalone usage.
 *
 * All salaries in AED. UAE Labor Law compliant.
 */

import type { Employee } from '@/features/hr/types/employee.types'
import type { Department, Designation, Branch } from '@/features/hr/types/department.types'
import type { AttendanceRecord, AttendanceRegularization } from '@/features/hr/types/attendance.types'
import type { LeaveRequest, LeaveBalance } from '@/features/hr/types/leave.types'
import type { PayrollRun, Payslip } from '@/features/hr/types/payroll.types'
import type { EOSBRecord } from '@/features/hr/types/eosb.types'
import type { EmployeeDocument, DocumentExpiryAlert } from '@/features/hr/types/document.types'
import type { PerformanceReview, CategoryRating, PerformanceGoal } from '@/features/hr/types/performance.types'
import type { RatingScore } from '@/features/hr/types/performance.types'
import { DEFAULT_RATING_CATEGORIES } from '@/features/hr/types/performance.types'

// ═══════════════════════════════════════════════════════════════════════════════
// BRANCHES
// ═══════════════════════════════════════════════════════════════════════════════

export const sampleBranches: Branch[] = [
  {
    id: 'branch_001',
    name: 'Dubai Main Office',
    code: 'DXB-MAIN',
    address: 'Office 1204, Al Ghurair Tower, Al Rigga Road, Deira, Dubai',
    emirate: 'Dubai',
    phone: '+971 4 123 4567',
    email: 'dubai@optifyserve.com',
    status: 'active',
  },
  {
    id: 'branch_002',
    name: 'Abu Dhabi Branch',
    code: 'AUH-01',
    address: 'Office 501, Al Markaziya Tower, Hamdan Street, Abu Dhabi',
    emirate: 'Abu Dhabi',
    phone: '+971 2 234 5678',
    email: 'abudhabi@optifyserve.com',
    status: 'active',
  },
  {
    id: 'branch_003',
    name: 'Sharjah Branch',
    code: 'SHJ-01',
    address: 'Office 309, Sharjah Tower, King Faisal Road, Al Qasimia, Sharjah',
    emirate: 'Sharjah',
    phone: '+971 6 345 6789',
    email: 'sharjah@optifyserve.com',
    status: 'active',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// DEPARTMENTS
// ═══════════════════════════════════════════════════════════════════════════════

export const sampleDepartments: Department[] = [
  {
    id: 'dept_001',
    name: 'Operations',
    code: 'OPS',
    description: 'Manages day-to-day service delivery, field operations, and logistics across all branches.',
    headId: 'emp_001',
    headName: 'Mohammed Al Rashidi',
    parentId: undefined,
    parentName: undefined,
    employeeCount: 5,
    branchId: 'branch_001',
    branchName: 'Dubai Main Office',
    status: 'active',
    createdAt: '2019-01-01T08:00:00.000Z',
    updatedAt: '2024-10-15T10:00:00.000Z',
  },
  {
    id: 'dept_002',
    name: 'Sales',
    code: 'SLS',
    description: 'Responsible for business development, client acquisition, and revenue generation.',
    headId: 'emp_002',
    headName: 'Sara Ahmed Al Mansoori',
    parentId: undefined,
    parentName: undefined,
    employeeCount: 4,
    branchId: 'branch_001',
    branchName: 'Dubai Main Office',
    status: 'active',
    createdAt: '2019-01-01T08:00:00.000Z',
    updatedAt: '2024-11-01T12:00:00.000Z',
  },
  {
    id: 'dept_003',
    name: 'Administration',
    code: 'ADM',
    description: 'Handles office administration, reception, documentation, and general support services.',
    headId: 'emp_007',
    headName: 'Ahmed Hassan Ibrahim',
    parentId: undefined,
    parentName: undefined,
    employeeCount: 3,
    branchId: 'branch_001',
    branchName: 'Dubai Main Office',
    status: 'active',
    createdAt: '2019-01-01T08:00:00.000Z',
    updatedAt: '2024-09-20T09:00:00.000Z',
  },
  {
    id: 'dept_004',
    name: 'Finance & Accounts',
    code: 'FIN',
    description: 'Oversees financial planning, accounting, VAT compliance, payroll, and financial reporting.',
    headId: 'emp_010',
    headName: 'Nadia Al Farsi',
    parentId: undefined,
    parentName: undefined,
    employeeCount: 4,
    branchId: 'branch_001',
    branchName: 'Dubai Main Office',
    status: 'active',
    createdAt: '2019-01-01T08:00:00.000Z',
    updatedAt: '2024-12-01T11:00:00.000Z',
  },
  {
    id: 'dept_005',
    name: 'Human Resources',
    code: 'HR',
    description: 'Manages recruitment, employee lifecycle, payroll coordination, and HR compliance with UAE labor law.',
    headId: 'emp_009',
    headName: 'Ali Hassan Al Zaabi',
    parentId: undefined,
    parentName: undefined,
    employeeCount: 2,
    branchId: 'branch_001',
    branchName: 'Dubai Main Office',
    status: 'active',
    createdAt: '2019-01-01T08:00:00.000Z',
    updatedAt: '2024-11-15T08:00:00.000Z',
  },
  {
    id: 'dept_006',
    name: 'Technical Services',
    code: 'TECH',
    description: 'Provides field technical services including installation, maintenance, and repair for all clients.',
    headId: 'emp_003',
    headName: 'Rajesh Kumar',
    parentId: 'dept_001',
    parentName: 'Operations',
    employeeCount: 6,
    branchId: 'branch_001',
    branchName: 'Dubai Main Office',
    status: 'active',
    createdAt: '2020-06-01T08:00:00.000Z',
    updatedAt: '2024-12-10T16:00:00.000Z',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// DESIGNATIONS
// ═══════════════════════════════════════════════════════════════════════════════

export const sampleDesignations: Designation[] = [
  { id: 'desig_001', name: 'General Manager', code: 'GM', departmentId: 'dept_001', departmentName: 'Operations', level: 1, description: 'Overall management and strategic leadership of the organization.', employeeCount: 1, status: 'active', createdAt: '2019-01-01T08:00:00.000Z', updatedAt: '2024-01-01T08:00:00.000Z' },
  { id: 'desig_002', name: 'Department Manager', code: 'DM', departmentId: 'dept_002', departmentName: 'Sales', level: 2, description: 'Leads a department, manages team performance and departmental objectives.', employeeCount: 4, status: 'active', createdAt: '2019-01-01T08:00:00.000Z', updatedAt: '2024-01-01T08:00:00.000Z' },
  { id: 'desig_003', name: 'Senior Supervisor', code: 'SR-SUP', departmentId: 'dept_001', departmentName: 'Operations', level: 3, description: 'Oversees multiple supervisory teams and ensures operational standards are met.', employeeCount: 2, status: 'active', createdAt: '2019-01-01T08:00:00.000Z', updatedAt: '2024-01-01T08:00:00.000Z' },
  { id: 'desig_004', name: 'Supervisor', code: 'SUP', departmentId: 'dept_001', departmentName: 'Operations', level: 4, description: 'Supervises field teams, assigns tasks, and monitors daily operations.', employeeCount: 3, status: 'active', createdAt: '2019-01-01T08:00:00.000Z', updatedAt: '2024-01-01T08:00:00.000Z' },
  { id: 'desig_005', name: 'Senior Executive', code: 'SR-EXEC', departmentId: 'dept_002', departmentName: 'Sales', level: 4, description: 'Senior-level individual contributor managing key accounts and strategic clients.', employeeCount: 2, status: 'active', createdAt: '2019-01-01T08:00:00.000Z', updatedAt: '2024-01-01T08:00:00.000Z' },
  { id: 'desig_006', name: 'Executive', code: 'EXEC', departmentId: 'dept_003', departmentName: 'Administration', level: 5, description: 'Executes departmental tasks and handles day-to-day responsibilities.', employeeCount: 4, status: 'active', createdAt: '2019-01-01T08:00:00.000Z', updatedAt: '2024-01-01T08:00:00.000Z' },
  { id: 'desig_007', name: 'Senior Technician', code: 'SR-TECH', departmentId: 'dept_006', departmentName: 'Technical Services', level: 4, description: 'Experienced technician who handles complex installations and mentors junior technicians.', employeeCount: 2, status: 'active', createdAt: '2020-06-01T08:00:00.000Z', updatedAt: '2024-01-01T08:00:00.000Z' },
  { id: 'desig_008', name: 'Technician', code: 'TECH', departmentId: 'dept_006', departmentName: 'Technical Services', level: 5, description: 'Performs installation, maintenance, and repair services at client sites.', employeeCount: 4, status: 'active', createdAt: '2020-06-01T08:00:00.000Z', updatedAt: '2024-01-01T08:00:00.000Z' },
  { id: 'desig_009', name: 'Helper', code: 'HLP', departmentId: 'dept_006', departmentName: 'Technical Services', level: 6, description: 'Assists technicians with field work, material handling, and site preparation.', employeeCount: 2, status: 'active', createdAt: '2020-06-01T08:00:00.000Z', updatedAt: '2024-01-01T08:00:00.000Z' },
  { id: 'desig_010', name: 'Receptionist', code: 'RCP', departmentId: 'dept_003', departmentName: 'Administration', level: 6, description: 'Manages front desk, visitor reception, and telephone/email communications.', employeeCount: 2, status: 'active', createdAt: '2019-01-01T08:00:00.000Z', updatedAt: '2024-01-01T08:00:00.000Z' },
  { id: 'desig_011', name: 'Accountant', code: 'ACC', departmentId: 'dept_004', departmentName: 'Finance & Accounts', level: 5, description: 'Handles accounts payable, accounts receivable, reconciliations, and financial reporting.', employeeCount: 3, status: 'active', createdAt: '2019-01-01T08:00:00.000Z', updatedAt: '2024-01-01T08:00:00.000Z' },
  { id: 'desig_012', name: 'HR Executive', code: 'HR-EXEC', departmentId: 'dept_005', departmentName: 'Human Resources', level: 5, description: 'Manages employee records, recruitment, visa processing, and HR documentation.', employeeCount: 2, status: 'active', createdAt: '2019-01-01T08:00:00.000Z', updatedAt: '2024-01-01T08:00:00.000Z' },
  { id: 'desig_013', name: 'Sales Executive', code: 'SLS-EXEC', departmentId: 'dept_002', departmentName: 'Sales', level: 5, description: 'Generates new business, manages client relationships, and achieves sales targets.', employeeCount: 3, status: 'active', createdAt: '2019-01-01T08:00:00.000Z', updatedAt: '2024-01-01T08:00:00.000Z' },
  { id: 'desig_014', name: 'Driver', code: 'DRV', departmentId: 'dept_006', departmentName: 'Technical Services', level: 6, description: 'Transports technicians, equipment, and materials to job sites across the UAE.', employeeCount: 2, status: 'active', createdAt: '2020-06-01T08:00:00.000Z', updatedAt: '2024-01-01T08:00:00.000Z' },
  { id: 'desig_015', name: 'Office Boy', code: 'OB', departmentId: 'dept_003', departmentName: 'Administration', level: 7, description: 'Supports office operations with document delivery, filing, and hospitality tasks.', employeeCount: 1, status: 'active', createdAt: '2019-01-01T08:00:00.000Z', updatedAt: '2024-01-01T08:00:00.000Z' },
]

// ═══════════════════════════════════════════════════════════════════════════════
// EMPLOYEES (10 representative employees from the full roster)
// ═══════════════════════════════════════════════════════════════════════════════

export const sampleEmployees: Employee[] = [
  {
    id: 'emp_001', employeeId: 'EMP-2021-001', firstName: 'Mohammed', lastName: 'Al Rashidi', fullName: 'Mohammed Al Rashidi',
    email: 'mohammed.rashidi@company.ae', phone: '+971 50 123 4567', alternatePhone: '+971 4 123 4567',
    dateOfBirth: '1988-03-15', gender: 'male', maritalStatus: 'married', nationality: 'Emirati', profilePhotoUrl: undefined,
    joinDate: '2021-04-01', probationEndDate: '2021-10-01', confirmationDate: '2021-10-02',
    contractType: 'unlimited', contractStartDate: '2021-04-01',
    departmentId: 'dept_001', departmentName: 'Operations', designationId: 'desig_003', designationName: 'Senior Supervisor',
    branchId: 'branch_001', branchName: 'Dubai Main Office',
    reportingManagerId: 'emp_002', reportingManagerName: 'Sara Ahmed Al Mansoori', status: 'active',
    emiratesId: { number: '784-1988-1234567-1', expiryDate: '2027-03-14', verified: true },
    passport: { number: 'A12345678', nationality: 'United Arab Emirates', issueDate: '2019-03-15', expiryDate: '2029-03-14', placeOfIssue: 'Dubai' },
    visa: { number: '201/2021/1234567', type: 'employment', issueDate: '2021-03-25', expiryDate: '2025-03-24', sponsoredBy: 'OptifyServe Technical Services LLC', status: 'active' },
    laborCard: { number: 'MOL/2021/456789', issueDate: '2021-04-01', expiryDate: '2025-03-31', status: 'active' },
    salary: { basicSalary: 12000, housingAllowance: 3000, transportAllowance: 1000, mobileAllowance: 300, otherAllowances: 700, totalSalary: 17000 },
    bankDetails: { bankName: 'Emirates NBD', accountNumber: '1012345678901', iban: 'AE070331234567890123456', branchName: 'Deira Branch' },
    address: { street: 'Al Rigga Road', building: 'Al Ghurair Tower', flatNumber: '1204', area: 'Deira', city: 'Dubai', emirate: 'Dubai', poBox: '12345', country: 'UAE' },
    emergencyContact: { name: 'Aisha Al Rashidi', relationship: 'Spouse', phone: '+971 50 987 6543', alternatePhone: '+971 4 987 6543' },
    companyId: 'comp_001', tenantId: 'tenant_001', createdAt: '2021-04-01T08:00:00.000Z', updatedAt: '2024-11-15T10:30:00.000Z',
  },
  {
    id: 'emp_002', employeeId: 'EMP-2020-002', firstName: 'Sara', lastName: 'Ahmed Al Mansoori', fullName: 'Sara Ahmed Al Mansoori',
    email: 'sara.mansoori@company.ae', phone: '+971 55 234 5678',
    dateOfBirth: '1985-07-22', gender: 'female', maritalStatus: 'married', nationality: 'Emirati', profilePhotoUrl: undefined,
    joinDate: '2020-01-15', probationEndDate: '2020-07-15', confirmationDate: '2020-07-16',
    contractType: 'unlimited', contractStartDate: '2020-01-15',
    departmentId: 'dept_002', departmentName: 'Sales', designationId: 'desig_002', designationName: 'Department Manager',
    branchId: 'branch_001', branchName: 'Dubai Main Office', status: 'active',
    emiratesId: { number: '784-1985-7654321-2', expiryDate: '2026-07-21', verified: true },
    passport: { number: 'B98765432', nationality: 'United Arab Emirates', issueDate: '2018-07-22', expiryDate: '2028-07-21', placeOfIssue: 'Abu Dhabi' },
    visa: { number: '201/2020/9876543', type: 'employment', issueDate: '2020-01-10', expiryDate: '2026-01-09', sponsoredBy: 'OptifyServe Technical Services LLC', status: 'active' },
    laborCard: { number: 'MOL/2020/654321', issueDate: '2020-01-15', expiryDate: '2026-01-14', status: 'active' },
    salary: { basicSalary: 18000, housingAllowance: 5000, transportAllowance: 1500, mobileAllowance: 500, otherAllowances: 1000, totalSalary: 26000 },
    bankDetails: { bankName: 'First Abu Dhabi Bank (FAB)', accountNumber: '5009876543210', iban: 'AE340090005009876543210', branchName: 'Sheikh Zayed Road Branch' },
    address: { street: 'Al Wasl Road', building: 'Pinnacle Tower', flatNumber: '2301', area: 'Jumeirah', city: 'Dubai', emirate: 'Dubai', country: 'UAE' },
    emergencyContact: { name: 'Ahmed Al Mansoori', relationship: 'Spouse', phone: '+971 50 111 2222' },
    companyId: 'comp_001', tenantId: 'tenant_001', createdAt: '2020-01-15T08:00:00.000Z', updatedAt: '2024-12-01T09:00:00.000Z',
  },
  {
    id: 'emp_003', employeeId: 'EMP-2022-003', firstName: 'Rajesh', lastName: 'Kumar', fullName: 'Rajesh Kumar',
    email: 'rajesh.kumar@company.ae', phone: '+971 56 345 6789',
    dateOfBirth: '1990-11-08', gender: 'male', maritalStatus: 'married', nationality: 'Indian', profilePhotoUrl: undefined,
    joinDate: '2022-03-01', probationEndDate: '2022-09-01', confirmationDate: '2022-09-02',
    contractType: 'limited', contractStartDate: '2022-03-01', contractEndDate: '2025-02-28',
    departmentId: 'dept_006', departmentName: 'Technical Services', designationId: 'desig_007', designationName: 'Senior Technician',
    branchId: 'branch_001', branchName: 'Dubai Main Office',
    reportingManagerId: 'emp_001', reportingManagerName: 'Mohammed Al Rashidi', status: 'active',
    emiratesId: { number: '784-1990-2345678-3', expiryDate: '2025-11-07', verified: true },
    passport: { number: 'P1234567', nationality: 'India', issueDate: '2017-11-08', expiryDate: '2027-11-07', placeOfIssue: 'Mumbai' },
    visa: { number: '201/2022/2345678', type: 'employment', issueDate: '2022-02-20', expiryDate: '2025-02-19', sponsoredBy: 'OptifyServe Technical Services LLC', status: 'active' },
    laborCard: { number: 'MOL/2022/234567', issueDate: '2022-03-01', expiryDate: '2025-02-28', status: 'active' },
    salary: { basicSalary: 5500, housingAllowance: 1000, transportAllowance: 500, mobileAllowance: 200, otherAllowances: 300, totalSalary: 7500 },
    bankDetails: { bankName: 'Mashreq Bank', accountNumber: '0191234567890', iban: 'AE240190000191234567890', branchName: 'Al Quoz Branch' },
    address: { street: 'Al Nahda Road', building: 'Al Nahda Residence', flatNumber: '505', area: 'Al Nahda', city: 'Dubai', emirate: 'Dubai', country: 'UAE' },
    emergencyContact: { name: 'Priya Kumar', relationship: 'Spouse', phone: '+91 98765 43210' },
    companyId: 'comp_001', tenantId: 'tenant_001', createdAt: '2022-03-01T08:00:00.000Z', updatedAt: '2024-10-20T11:00:00.000Z',
  },
  {
    id: 'emp_004', employeeId: 'EMP-2023-004', firstName: 'Maria', lastName: 'Santos', fullName: 'Maria Santos',
    email: 'maria.santos@company.ae', phone: '+971 50 456 7890',
    dateOfBirth: '1993-05-30', gender: 'female', maritalStatus: 'single', nationality: 'Filipino', profilePhotoUrl: undefined,
    joinDate: '2023-01-10', probationEndDate: '2023-07-10', confirmationDate: '2023-07-11',
    contractType: 'limited', contractStartDate: '2023-01-10', contractEndDate: '2026-01-09',
    departmentId: 'dept_003', departmentName: 'Administration', designationId: 'desig_010', designationName: 'Receptionist',
    branchId: 'branch_001', branchName: 'Dubai Main Office',
    reportingManagerId: 'emp_007', reportingManagerName: 'Ahmed Hassan Ibrahim', status: 'active',
    emiratesId: { number: '784-1993-3456789-4', expiryDate: '2026-05-29', verified: true },
    passport: { number: 'EC1234567', nationality: 'Philippines', issueDate: '2019-05-30', expiryDate: '2029-05-29', placeOfIssue: 'Manila' },
    visa: { number: '201/2023/3456789', type: 'employment', issueDate: '2023-01-01', expiryDate: '2026-12-31', sponsoredBy: 'OptifyServe Technical Services LLC', status: 'active' },
    laborCard: { number: 'MOL/2023/345678', issueDate: '2023-01-10', expiryDate: '2026-01-09', status: 'active' },
    salary: { basicSalary: 3500, housingAllowance: 700, transportAllowance: 300, mobileAllowance: 100, otherAllowances: 400, totalSalary: 5000 },
    bankDetails: { bankName: 'Emirates NBD', accountNumber: '1023456789012', iban: 'AE070331023456789012345', branchName: 'Business Bay Branch' },
    address: { street: 'Al Barsha Road', building: 'Al Barsha Heights', flatNumber: '309', area: 'Al Barsha', city: 'Dubai', emirate: 'Dubai', country: 'UAE' },
    emergencyContact: { name: 'Rosa Santos', relationship: 'Mother', phone: '+63 912 345 6789' },
    companyId: 'comp_001', tenantId: 'tenant_001', createdAt: '2023-01-10T08:00:00.000Z', updatedAt: '2024-11-01T12:00:00.000Z',
  },
  {
    id: 'emp_005', employeeId: 'EMP-2021-005', firstName: 'Khalid', lastName: 'Hassan Ibrahim', fullName: 'Khalid Hassan Ibrahim',
    email: 'khalid.ibrahim@company.ae', phone: '+971 55 567 8901',
    dateOfBirth: '1987-09-12', gender: 'male', maritalStatus: 'married', nationality: 'Egyptian', profilePhotoUrl: undefined,
    joinDate: '2021-07-01', probationEndDate: '2022-01-01', confirmationDate: '2022-01-02',
    contractType: 'unlimited', contractStartDate: '2021-07-01',
    departmentId: 'dept_004', departmentName: 'Finance & Accounts', designationId: 'desig_011', designationName: 'Accountant',
    branchId: 'branch_001', branchName: 'Dubai Main Office',
    reportingManagerId: 'emp_010', reportingManagerName: 'Nadia Al Farsi', status: 'active',
    emiratesId: { number: '784-1987-4567890-5', expiryDate: '2026-09-11', verified: true },
    passport: { number: 'A9876543', nationality: 'Egypt', issueDate: '2018-09-12', expiryDate: '2028-09-11', placeOfIssue: 'Cairo' },
    visa: { number: '201/2021/4567890', type: 'employment', issueDate: '2021-06-20', expiryDate: '2025-06-19', sponsoredBy: 'OptifyServe Technical Services LLC', status: 'active' },
    laborCard: { number: 'MOL/2021/456789', issueDate: '2021-07-01', expiryDate: '2025-06-30', status: 'active' },
    salary: { basicSalary: 7000, housingAllowance: 1500, transportAllowance: 600, mobileAllowance: 200, otherAllowances: 700, totalSalary: 10000 },
    bankDetails: { bankName: 'Abu Dhabi Commercial Bank (ADCB)', accountNumber: '1234567890123', iban: 'AE460030001234567890123', branchName: 'Karama Branch' },
    address: { street: 'Al Karama Street', building: 'Karama Center', flatNumber: '702', area: 'Al Karama', city: 'Dubai', emirate: 'Dubai', country: 'UAE' },
    emergencyContact: { name: 'Hana Hassan', relationship: 'Spouse', phone: '+971 50 222 3333' },
    companyId: 'comp_001', tenantId: 'tenant_001', createdAt: '2021-07-01T08:00:00.000Z', updatedAt: '2024-12-10T14:00:00.000Z',
  },
  {
    id: 'emp_006', employeeId: 'EMP-2022-006', firstName: 'Imran', lastName: 'Ali Siddiqui', fullName: 'Imran Ali Siddiqui',
    email: 'imran.siddiqui@company.ae', phone: '+971 56 678 9012',
    dateOfBirth: '1992-01-25', gender: 'male', maritalStatus: 'single', nationality: 'Pakistani', profilePhotoUrl: undefined,
    joinDate: '2022-08-15', probationEndDate: '2023-02-15', confirmationDate: '2023-02-16',
    contractType: 'limited', contractStartDate: '2022-08-15', contractEndDate: '2025-08-14',
    departmentId: 'dept_006', departmentName: 'Technical Services', designationId: 'desig_008', designationName: 'Technician',
    branchId: 'branch_002', branchName: 'Abu Dhabi Branch',
    reportingManagerId: 'emp_003', reportingManagerName: 'Rajesh Kumar', status: 'active',
    emiratesId: { number: '784-1992-5678901-6', expiryDate: '2025-01-24', verified: true },
    passport: { number: 'BK1234567', nationality: 'Pakistan', issueDate: '2018-01-25', expiryDate: '2028-01-24', placeOfIssue: 'Karachi' },
    visa: { number: '201/2022/5678901', type: 'employment', issueDate: '2022-08-01', expiryDate: '2025-07-31', sponsoredBy: 'OptifyServe Technical Services LLC', status: 'active' },
    laborCard: { number: 'MOL/2022/567890', issueDate: '2022-08-15', expiryDate: '2025-08-14', status: 'active' },
    salary: { basicSalary: 4000, housingAllowance: 800, transportAllowance: 400, mobileAllowance: 150, otherAllowances: 150, totalSalary: 5500 },
    bankDetails: { bankName: 'RAK Bank', accountNumber: '0126789012345', iban: 'AE020400000126789012345', branchName: 'Abu Dhabi Branch' },
    address: { street: 'Hamdan Street', building: 'Al Markaziya Tower', flatNumber: '110', area: 'Al Markaziya', city: 'Abu Dhabi', emirate: 'Abu Dhabi', country: 'UAE' },
    emergencyContact: { name: 'Ali Siddiqui', relationship: 'Father', phone: '+92 300 1234567' },
    companyId: 'comp_001', tenantId: 'tenant_001', createdAt: '2022-08-15T08:00:00.000Z', updatedAt: '2024-09-30T16:00:00.000Z',
  },
  {
    id: 'emp_007', employeeId: 'EMP-2019-007', firstName: 'Ahmed', lastName: 'Hassan Ibrahim', fullName: 'Ahmed Hassan Ibrahim',
    email: 'ahmed.ibrahim@company.ae', phone: '+971 50 789 0123',
    dateOfBirth: '1982-06-18', gender: 'male', maritalStatus: 'married', nationality: 'Jordanian', profilePhotoUrl: undefined,
    joinDate: '2019-05-01', probationEndDate: '2019-11-01', confirmationDate: '2019-11-02',
    contractType: 'unlimited', contractStartDate: '2019-05-01',
    departmentId: 'dept_003', departmentName: 'Administration', designationId: 'desig_002', designationName: 'Department Manager',
    branchId: 'branch_001', branchName: 'Dubai Main Office', status: 'active',
    emiratesId: { number: '784-1982-6789012-7', expiryDate: '2028-06-17', verified: true },
    passport: { number: 'E7654321', nationality: 'Jordan', issueDate: '2020-06-18', expiryDate: '2030-06-17', placeOfIssue: 'Amman' },
    visa: { number: '201/2019/6789012', type: 'employment', issueDate: '2019-04-20', expiryDate: '2027-04-19', sponsoredBy: 'OptifyServe Technical Services LLC', status: 'active' },
    laborCard: { number: 'MOL/2019/678901', issueDate: '2019-05-01', expiryDate: '2027-04-30', status: 'active' },
    salary: { basicSalary: 15000, housingAllowance: 4000, transportAllowance: 1200, mobileAllowance: 400, otherAllowances: 400, totalSalary: 21000 },
    bankDetails: { bankName: 'Dubai Islamic Bank', accountNumber: '0234567890123', iban: 'AE150240000234567890123', branchName: 'Al Barsha Branch' },
    address: { street: 'Umm Suqeim Road', building: 'Madinat Jumeirah Living', flatNumber: '1502', area: 'Umm Suqeim', city: 'Dubai', emirate: 'Dubai', country: 'UAE' },
    emergencyContact: { name: 'Rania Hassan', relationship: 'Spouse', phone: '+971 55 333 4444' },
    companyId: 'comp_001', tenantId: 'tenant_001', createdAt: '2019-05-01T08:00:00.000Z', updatedAt: '2024-12-15T10:00:00.000Z',
  },
  {
    id: 'emp_009', employeeId: 'EMP-2022-009', firstName: 'Ali', lastName: 'Hassan Al Zaabi', fullName: 'Ali Hassan Al Zaabi',
    email: 'ali.alzaabi@company.ae', phone: '+971 56 901 2345',
    dateOfBirth: '1991-12-03', gender: 'male', maritalStatus: 'single', nationality: 'Emirati', profilePhotoUrl: undefined,
    joinDate: '2022-11-01', probationEndDate: '2023-05-01', confirmationDate: '2023-05-02',
    contractType: 'unlimited', contractStartDate: '2022-11-01',
    departmentId: 'dept_005', departmentName: 'Human Resources', designationId: 'desig_012', designationName: 'HR Executive',
    branchId: 'branch_001', branchName: 'Dubai Main Office',
    reportingManagerId: 'emp_007', reportingManagerName: 'Ahmed Hassan Ibrahim', status: 'active',
    emiratesId: { number: '784-1991-8901234-9', expiryDate: '2027-12-02', verified: true },
    passport: { number: 'Z2345678', nationality: 'United Arab Emirates', issueDate: '2019-12-03', expiryDate: '2029-12-02', placeOfIssue: 'Dubai' },
    visa: { number: '201/2022/8901234', type: 'employment', issueDate: '2022-10-20', expiryDate: '2026-10-19', sponsoredBy: 'OptifyServe Technical Services LLC', status: 'active' },
    laborCard: { number: 'MOL/2022/890123', issueDate: '2022-11-01', expiryDate: '2026-10-31', status: 'active' },
    salary: { basicSalary: 8000, housingAllowance: 2000, transportAllowance: 800, mobileAllowance: 300, otherAllowances: 900, totalSalary: 12000 },
    bankDetails: { bankName: 'Emirates Islamic', accountNumber: '0348901234567', iban: 'AE990340000348901234567', branchName: 'Deira City Centre Branch' },
    address: { street: 'Al Muteena Street', building: 'Al Muteena Residence', flatNumber: '601', area: 'Al Muteena', city: 'Dubai', emirate: 'Dubai', country: 'UAE' },
    emergencyContact: { name: 'Hassan Al Zaabi', relationship: 'Father', phone: '+971 50 444 5555' },
    companyId: 'comp_001', tenantId: 'tenant_001', createdAt: '2022-11-01T08:00:00.000Z', updatedAt: '2024-12-20T09:00:00.000Z',
  },
  {
    id: 'emp_010', employeeId: 'EMP-2020-010', firstName: 'Nadia', lastName: 'Al Farsi', fullName: 'Nadia Al Farsi',
    email: 'nadia.alfarsi@company.ae', phone: '+971 50 012 3456',
    dateOfBirth: '1984-08-19', gender: 'female', maritalStatus: 'married', nationality: 'Emirati', profilePhotoUrl: undefined,
    joinDate: '2020-09-01', probationEndDate: '2021-03-01', confirmationDate: '2021-03-02',
    contractType: 'unlimited', contractStartDate: '2020-09-01',
    departmentId: 'dept_004', departmentName: 'Finance & Accounts', designationId: 'desig_002', designationName: 'Department Manager',
    branchId: 'branch_001', branchName: 'Dubai Main Office', status: 'active',
    emiratesId: { number: '784-1984-9012345-0', expiryDate: '2026-08-18', verified: true },
    passport: { number: 'C5678901', nationality: 'United Arab Emirates', issueDate: '2020-08-19', expiryDate: '2030-08-18', placeOfIssue: 'Dubai' },
    visa: { number: '201/2020/9012345', type: 'employment', issueDate: '2020-08-25', expiryDate: '2026-08-24', sponsoredBy: 'OptifyServe Technical Services LLC', status: 'active' },
    laborCard: { number: 'MOL/2020/901234', issueDate: '2020-09-01', expiryDate: '2026-08-31', status: 'active' },
    salary: { basicSalary: 20000, housingAllowance: 5000, transportAllowance: 1500, mobileAllowance: 500, otherAllowances: 3000, totalSalary: 30000 },
    bankDetails: { bankName: 'First Abu Dhabi Bank (FAB)', accountNumber: '5010012345678', iban: 'AE340090005010012345678', branchName: 'DIFC Branch' },
    address: { street: 'Financial Centre Road', building: 'Gate District', flatNumber: '3204', area: 'DIFC', city: 'Dubai', emirate: 'Dubai', country: 'UAE' },
    emergencyContact: { name: 'Saif Al Farsi', relationship: 'Spouse', phone: '+971 55 666 7777' },
    companyId: 'comp_001', tenantId: 'tenant_001', createdAt: '2020-09-01T08:00:00.000Z', updatedAt: '2024-12-18T15:00:00.000Z',
  },
  {
    id: 'emp_015', employeeId: 'EMP-2020-015', firstName: 'Tariq', lastName: 'Mahmood', fullName: 'Tariq Mahmood',
    email: 'tariq.mahmood@company.ae', phone: '+971 50 567 1234',
    dateOfBirth: '1980-11-30', gender: 'male', maritalStatus: 'married', nationality: 'Pakistani', profilePhotoUrl: undefined,
    joinDate: '2020-06-01', probationEndDate: '2020-12-01', confirmationDate: '2020-12-02',
    contractType: 'unlimited', contractStartDate: '2020-06-01',
    departmentId: 'dept_001', departmentName: 'Operations', designationId: 'desig_001', designationName: 'General Manager',
    branchId: 'branch_001', branchName: 'Dubai Main Office', status: 'active',
    emiratesId: { number: '784-1980-4567123-5', expiryDate: '2028-11-29', verified: true },
    passport: { number: 'HK4567123', nationality: 'Pakistan', issueDate: '2022-11-30', expiryDate: '2032-11-29', placeOfIssue: 'Lahore' },
    visa: { number: '201/2020/4567123', type: 'employment', issueDate: '2020-05-20', expiryDate: '2028-05-19', sponsoredBy: 'OptifyServe Technical Services LLC', status: 'active' },
    laborCard: { number: 'MOL/2020/456712', issueDate: '2020-06-01', expiryDate: '2028-05-31', status: 'active' },
    salary: { basicSalary: 25000, housingAllowance: 7000, transportAllowance: 2000, mobileAllowance: 700, otherAllowances: 5300, totalSalary: 40000 },
    bankDetails: { bankName: 'First Abu Dhabi Bank (FAB)', accountNumber: '5014567123456', iban: 'AE340090005014567123456', branchName: 'DIFC Branch' },
    address: { street: 'Palm Jumeirah', building: 'Shoreline Apartments', flatNumber: '2501', area: 'Palm Jumeirah', city: 'Dubai', emirate: 'Dubai', country: 'UAE' },
    emergencyContact: { name: 'Sadia Mahmood', relationship: 'Spouse', phone: '+971 55 888 9999' },
    companyId: 'comp_001', tenantId: 'tenant_001', createdAt: '2020-06-01T08:00:00.000Z', updatedAt: '2024-12-22T16:00:00.000Z',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// ATTENDANCE RECORDS (sample daily records)
// ═══════════════════════════════════════════════════════════════════════════════

export const sampleAttendanceRecords: AttendanceRecord[] = [
  { id: 'att_emp_001_2026-02-16', employeeId: 'emp_001', employeeName: 'Mohammed Al Rashidi', departmentName: 'Operations', date: '2026-02-16', shift: 'general', checkInTime: '07:52', checkOutTime: '17:30', status: 'present', workingHours: 8.63, overtimeHours: 0, lateMinutes: 0, earlyDepartureMinutes: 0, isManualEntry: false, createdAt: '2026-02-16T07:52:00.000Z' },
  { id: 'att_emp_002_2026-02-16', employeeId: 'emp_002', employeeName: 'Sara Ahmed Al Mansoori', departmentName: 'Sales', date: '2026-02-16', shift: 'general', checkInTime: '08:03', checkOutTime: '18:00', status: 'present', workingHours: 8.95, overtimeHours: 0, lateMinutes: 0, earlyDepartureMinutes: 0, isManualEntry: false, createdAt: '2026-02-16T08:03:00.000Z' },
  { id: 'att_emp_003_2026-02-16', employeeId: 'emp_003', employeeName: 'Rajesh Kumar', departmentName: 'Technical Services', date: '2026-02-16', shift: 'morning', checkInTime: '08:22', checkOutTime: '19:00', status: 'late', workingHours: 9.63, overtimeHours: 0.63, lateMinutes: 7, earlyDepartureMinutes: 0, isManualEntry: false, createdAt: '2026-02-16T08:22:00.000Z' },
  { id: 'att_emp_004_2026-02-16', employeeId: 'emp_004', employeeName: 'Maria Santos', departmentName: 'Administration', date: '2026-02-16', shift: 'general', checkInTime: '07:45', checkOutTime: '17:00', status: 'present', workingHours: 8.25, overtimeHours: 0, lateMinutes: 0, earlyDepartureMinutes: 0, isManualEntry: false, createdAt: '2026-02-16T07:45:00.000Z' },
  { id: 'att_emp_005_2026-02-16', employeeId: 'emp_005', employeeName: 'Khalid Hassan Ibrahim', departmentName: 'Finance & Accounts', date: '2026-02-16', shift: 'general', status: 'absent', workingHours: 0, overtimeHours: 0, lateMinutes: 0, earlyDepartureMinutes: 0, notes: 'No show - follow up required', isManualEntry: false, createdAt: '2026-02-16T09:00:00.000Z' },
  { id: 'att_emp_006_2026-02-16', employeeId: 'emp_006', employeeName: 'Imran Ali Siddiqui', departmentName: 'Technical Services', date: '2026-02-16', shift: 'morning', checkInTime: '08:45', checkOutTime: '20:00', status: 'late', workingHours: 10.25, overtimeHours: 1.25, lateMinutes: 30, earlyDepartureMinutes: 0, isManualEntry: false, createdAt: '2026-02-16T08:45:00.000Z' },
  { id: 'att_emp_007_2026-02-16', employeeId: 'emp_007', employeeName: 'Ahmed Hassan Ibrahim', departmentName: 'Administration', date: '2026-02-16', shift: 'general', checkInTime: '08:15', checkOutTime: '17:15', status: 'present', workingHours: 8.0, overtimeHours: 0, lateMinutes: 0, earlyDepartureMinutes: 0, isManualEntry: false, createdAt: '2026-02-16T08:15:00.000Z' },
  { id: 'att_emp_009_2026-02-16', employeeId: 'emp_009', employeeName: 'Ali Hassan Al Zaabi', departmentName: 'Human Resources', date: '2026-02-16', shift: 'general', status: 'on-leave', workingHours: 0, overtimeHours: 0, lateMinutes: 0, earlyDepartureMinutes: 0, notes: 'Annual leave approved', isManualEntry: false, createdAt: '2026-02-16T09:00:00.000Z' },
  { id: 'att_emp_010_2026-02-16', employeeId: 'emp_010', employeeName: 'Nadia Al Farsi', departmentName: 'Finance & Accounts', date: '2026-02-16', shift: 'general', checkInTime: '08:05', checkOutTime: '18:20', status: 'present', workingHours: 9.25, overtimeHours: 0.25, lateMinutes: 0, earlyDepartureMinutes: 0, isManualEntry: false, createdAt: '2026-02-16T08:05:00.000Z' },
  { id: 'att_emp_015_2026-02-16', employeeId: 'emp_015', employeeName: 'Tariq Mahmood', departmentName: 'Operations', date: '2026-02-16', shift: 'general', checkInTime: '07:45', checkOutTime: '18:45', status: 'present', workingHours: 10.0, overtimeHours: 1.0, lateMinutes: 0, earlyDepartureMinutes: 0, isManualEntry: false, createdAt: '2026-02-16T07:45:00.000Z' },
  { id: 'att_emp_001_2026-02-14', employeeId: 'emp_001', employeeName: 'Mohammed Al Rashidi', departmentName: 'Operations', date: '2026-02-14', shift: 'general', status: 'weekend', workingHours: 0, overtimeHours: 0, lateMinutes: 0, earlyDepartureMinutes: 0, isManualEntry: false, createdAt: '2026-02-14T09:00:00.000Z' },
  { id: 'att_emp_004_2026-02-15', employeeId: 'emp_004', employeeName: 'Maria Santos', departmentName: 'Administration', date: '2026-02-15', shift: 'general', checkInTime: '08:00', checkOutTime: '13:00', status: 'half-day', workingHours: 4.0, overtimeHours: 0, lateMinutes: 0, earlyDepartureMinutes: 0, notes: 'Approved half-day', isManualEntry: false, createdAt: '2026-02-15T08:00:00.000Z' },
]

// ═══════════════════════════════════════════════════════════════════════════════
// ATTENDANCE REGULARIZATIONS
// ═══════════════════════════════════════════════════════════════════════════════

export const sampleAttendanceRegularizations: AttendanceRegularization[] = [
  { id: 'reg_001', employeeId: 'emp_001', employeeName: 'Mohammed Al Rashidi', date: '2026-02-10', reason: 'Forgot to check out - attended full day', requestedCheckIn: '08:05', requestedCheckOut: '17:30', status: 'approved', approvedBy: 'Ahmed Al Farouq', approvedAt: '2026-02-11T09:15:00.000Z', comments: 'Verified via CCTV footage', createdAt: '2026-02-11T08:00:00.000Z' },
  { id: 'reg_002', employeeId: 'emp_006', employeeName: 'Imran Ali Siddiqui', date: '2026-02-12', reason: 'Biometric device malfunction - IT confirmed issue', requestedCheckIn: '09:00', requestedCheckOut: '18:00', status: 'pending', createdAt: '2026-02-13T08:30:00.000Z' },
  { id: 'reg_003', employeeId: 'emp_005', employeeName: 'Khalid Hassan Ibrahim', date: '2026-02-08', reason: 'Check-in not recorded due to system downtime', requestedCheckIn: '08:15', requestedCheckOut: '17:15', status: 'rejected', approvedBy: 'Ahmed Al Farouq', approvedAt: '2026-02-09T10:00:00.000Z', comments: 'No supporting evidence provided', createdAt: '2026-02-09T08:00:00.000Z' },
  { id: 'reg_004', employeeId: 'emp_015', employeeName: 'Tariq Mahmood', date: '2026-02-14', reason: 'Was at client site - reader unavailable', requestedCheckIn: '07:55', requestedCheckOut: '18:30', status: 'pending', createdAt: '2026-02-15T08:00:00.000Z' },
  { id: 'reg_005', employeeId: 'emp_002', employeeName: 'Sara Ahmed Al Mansoori', date: '2026-02-06', reason: 'Early departure approved by manager but not recorded', requestedCheckIn: '08:00', requestedCheckOut: '14:00', status: 'approved', approvedBy: 'Ahmed Al Farouq', approvedAt: '2026-02-07T09:00:00.000Z', createdAt: '2026-02-07T08:00:00.000Z' },
]

// ═══════════════════════════════════════════════════════════════════════════════
// LEAVE REQUESTS
// ═══════════════════════════════════════════════════════════════════════════════

export const sampleLeaveRequests: LeaveRequest[] = [
  { id: 'lr_001', employeeId: 'emp_002', employeeName: 'Sara Ahmed Al Mansoori', departmentName: 'Sales', leaveTypeId: 'annual', leaveTypeName: 'Annual Leave', startDate: '2026-02-17', endDate: '2026-02-21', duration: 'full-day', totalDays: 5, reason: 'Family vacation to Oman', status: 'approved', approverId: 'usr_mgr_001', approverName: 'Ahmed Al Farouq', approverComments: 'Approved. Please ensure handover before departure.', approvedAt: '2026-02-12T10:30:00.000Z', appliedAt: '2026-02-10T09:00:00.000Z', createdAt: '2026-02-10T09:00:00.000Z', updatedAt: '2026-02-12T10:30:00.000Z' },
  { id: 'lr_002', employeeId: 'emp_006', employeeName: 'Imran Ali Siddiqui', departmentName: 'Technical Services', leaveTypeId: 'sick', leaveTypeName: 'Sick Leave', startDate: '2026-02-13', endDate: '2026-02-14', duration: 'full-day', totalDays: 2, reason: 'Fever and acute cold', attachmentUrl: '/uploads/medical_certificate_lr002.pdf', status: 'approved', approverId: 'usr_mgr_001', approverName: 'Ahmed Al Farouq', approvedAt: '2026-02-13T08:15:00.000Z', appliedAt: '2026-02-13T07:45:00.000Z', createdAt: '2026-02-13T07:45:00.000Z', updatedAt: '2026-02-13T08:15:00.000Z' },
  { id: 'lr_003', employeeId: 'emp_001', employeeName: 'Mohammed Al Rashidi', departmentName: 'Operations', leaveTypeId: 'emergency', leaveTypeName: 'Emergency Leave', startDate: '2026-02-18', endDate: '2026-02-18', duration: 'full-day', totalDays: 1, reason: 'Father hospitalized - urgent family matter', status: 'pending', appliedAt: '2026-02-18T06:30:00.000Z', createdAt: '2026-02-18T06:30:00.000Z', updatedAt: '2026-02-18T06:30:00.000Z' },
  { id: 'lr_004', employeeId: 'emp_004', employeeName: 'Maria Santos', departmentName: 'Administration', leaveTypeId: 'annual', leaveTypeName: 'Annual Leave', startDate: '2026-03-10', endDate: '2026-03-19', duration: 'full-day', totalDays: 8, reason: 'Annual home visit to Philippines', status: 'pending', appliedAt: '2026-02-15T11:00:00.000Z', createdAt: '2026-02-15T11:00:00.000Z', updatedAt: '2026-02-15T11:00:00.000Z' },
  { id: 'lr_005', employeeId: 'emp_005', employeeName: 'Khalid Hassan Ibrahim', departmentName: 'Finance & Accounts', leaveTypeId: 'annual', leaveTypeName: 'Annual Leave', startDate: '2026-01-26', endDate: '2026-01-30', duration: 'full-day', totalDays: 5, reason: 'National Day celebrations and rest', status: 'approved', approverId: 'usr_mgr_001', approverName: 'Ahmed Al Farouq', approvedAt: '2026-01-20T14:00:00.000Z', appliedAt: '2026-01-18T10:00:00.000Z', createdAt: '2026-01-18T10:00:00.000Z', updatedAt: '2026-01-20T14:00:00.000Z' },
  { id: 'lr_006', employeeId: 'emp_003', employeeName: 'Rajesh Kumar', departmentName: 'Technical Services', leaveTypeId: 'sick', leaveTypeName: 'Sick Leave', startDate: '2026-02-05', endDate: '2026-02-07', duration: 'full-day', totalDays: 3, reason: 'Post-surgery recovery', attachmentUrl: '/uploads/medical_certificate_lr006.pdf', status: 'approved', approverId: 'usr_mgr_001', approverName: 'Ahmed Al Farouq', approvedAt: '2026-02-05T09:00:00.000Z', appliedAt: '2026-02-04T22:00:00.000Z', createdAt: '2026-02-04T22:00:00.000Z', updatedAt: '2026-02-05T09:00:00.000Z' },
  { id: 'lr_007', employeeId: 'emp_015', employeeName: 'Tariq Mahmood', departmentName: 'Operations', leaveTypeId: 'paternity', leaveTypeName: 'Paternity Leave', startDate: '2026-02-03', endDate: '2026-02-07', duration: 'full-day', totalDays: 5, reason: 'Birth of baby boy - Alhamdulillah', attachmentUrl: '/uploads/birth_certificate_lr007.pdf', status: 'approved', approverId: 'usr_mgr_001', approverName: 'Ahmed Al Farouq', approvedAt: '2026-02-03T08:30:00.000Z', appliedAt: '2026-02-03T07:00:00.000Z', createdAt: '2026-02-03T07:00:00.000Z', updatedAt: '2026-02-03T08:30:00.000Z' },
  { id: 'lr_008', employeeId: 'emp_010', employeeName: 'Nadia Al Farsi', departmentName: 'Finance & Accounts', leaveTypeId: 'unpaid', leaveTypeName: 'Unpaid Leave', startDate: '2026-02-24', endDate: '2026-02-28', duration: 'full-day', totalDays: 5, reason: 'Extended family matter that requires travel', status: 'rejected', approverId: 'usr_mgr_001', approverName: 'Ahmed Al Farouq', approverComments: 'Team is short-staffed this period; request cannot be accommodated.', approvedAt: '2026-02-16T11:00:00.000Z', appliedAt: '2026-02-14T10:00:00.000Z', createdAt: '2026-02-14T10:00:00.000Z', updatedAt: '2026-02-16T11:00:00.000Z' },
  { id: 'lr_009', employeeId: 'emp_009', employeeName: 'Ali Hassan Al Zaabi', departmentName: 'Human Resources', leaveTypeId: 'annual', leaveTypeName: 'Annual Leave', startDate: '2026-02-11', endDate: '2026-02-11', duration: 'half-day-morning', totalDays: 0.5, reason: 'Personal appointment in the morning', status: 'approved', approverId: 'usr_mgr_001', approverName: 'Ahmed Al Farouq', approvedAt: '2026-02-10T15:00:00.000Z', appliedAt: '2026-02-10T14:00:00.000Z', createdAt: '2026-02-10T14:00:00.000Z', updatedAt: '2026-02-10T15:00:00.000Z' },
  { id: 'lr_010', employeeId: 'emp_007', employeeName: 'Ahmed Hassan Ibrahim', departmentName: 'Administration', leaveTypeId: 'compassionate', leaveTypeName: 'Compassionate Leave', startDate: '2026-01-15', endDate: '2026-01-17', duration: 'full-day', totalDays: 3, reason: 'Passing of uncle - travelling to Jordan', status: 'approved', approverId: 'usr_mgr_001', approverName: 'Ahmed Al Farouq', approvedAt: '2026-01-15T07:00:00.000Z', appliedAt: '2026-01-15T06:30:00.000Z', createdAt: '2026-01-15T06:30:00.000Z', updatedAt: '2026-01-15T07:00:00.000Z' },
]

// ═══════════════════════════════════════════════════════════════════════════════
// LEAVE BALANCES (for Mohammed Al Rashidi - emp_001)
// ═══════════════════════════════════════════════════════════════════════════════

export const sampleLeaveBalances: LeaveBalance[] = [
  { leaveTypeId: 'annual', leaveTypeName: 'Annual Leave', entitled: 30, taken: 8, pending: 5, balance: 17, carriedForward: 3 },
  { leaveTypeId: 'sick', leaveTypeName: 'Sick Leave', entitled: 90, taken: 2, pending: 0, balance: 88, carriedForward: 0 },
  { leaveTypeId: 'emergency', leaveTypeName: 'Emergency Leave', entitled: 5, taken: 2, pending: 0, balance: 3, carriedForward: 0 },
  { leaveTypeId: 'compassionate', leaveTypeName: 'Compassionate Leave', entitled: 5, taken: 0, pending: 0, balance: 5, carriedForward: 0 },
  { leaveTypeId: 'hajj', leaveTypeName: 'Hajj Leave', entitled: 30, taken: 0, pending: 0, balance: 30, carriedForward: 0 },
  { leaveTypeId: 'unpaid', leaveTypeName: 'Unpaid Leave', entitled: 30, taken: 0, pending: 0, balance: 30, carriedForward: 0 },
  { leaveTypeId: 'maternity', leaveTypeName: 'Maternity Leave', entitled: 60, taken: 0, pending: 0, balance: 60, carriedForward: 0 },
  { leaveTypeId: 'paternity', leaveTypeName: 'Paternity Leave', entitled: 5, taken: 0, pending: 0, balance: 5, carriedForward: 0 },
]

// ═══════════════════════════════════════════════════════════════════════════════
// PAYROLL RUNS
// ═══════════════════════════════════════════════════════════════════════════════

export const samplePayrollRuns: PayrollRun[] = [
  { id: 'pr_001', month: 1, year: 2026, totalEmployees: 20, totalEarnings: 455000, totalDeductions: 12500, totalNetSalary: 442500, status: 'completed', processedBy: 'Nadia Al Farsi', processedAt: '2026-01-31T14:00:00.000Z', createdAt: '2026-01-01T08:00:00.000Z', updatedAt: '2026-01-31T14:00:00.000Z' },
  { id: 'pr_002', month: 2, year: 2026, totalEmployees: 20, totalEarnings: 458200, totalDeductions: 11800, totalNetSalary: 446400, status: 'completed', processedBy: 'Nadia Al Farsi', processedAt: '2026-02-28T15:30:00.000Z', createdAt: '2026-02-01T08:00:00.000Z', updatedAt: '2026-02-28T15:30:00.000Z' },
  { id: 'pr_003', month: 3, year: 2026, totalEmployees: 20, totalEarnings: 460000, totalDeductions: 0, totalNetSalary: 460000, status: 'draft', createdAt: '2026-03-01T08:00:00.000Z', updatedAt: '2026-03-01T08:00:00.000Z' },
]

// ═══════════════════════════════════════════════════════════════════════════════
// PAYSLIPS (sample payslips for Jan 2026 run)
// ═══════════════════════════════════════════════════════════════════════════════

export const samplePayslips: Payslip[] = [
  { id: 'ps_pr_001_emp_001', payrollRunId: 'pr_001', employeeId: 'emp_001', employeeName: 'Mohammed Al Rashidi', employeeIdNumber: 'EMP-2021-001', departmentName: 'Operations', designationName: 'Senior Supervisor', month: 1, year: 2026, basicSalary: 12000, housingAllowance: 3000, transportAllowance: 1000, mobileAllowance: 300, otherAllowances: 700, overtimeHours: 8, overtimeRate: 85.23, overtimeAmount: 681.82, totalEarnings: 17681.82, absenceDeduction: 0, lateDeduction: 0, loanRepayment: 500, advanceRecovery: 0, otherDeductions: 0, totalDeductions: 500, netSalary: 17181.82, totalWorkingDays: 22, presentDays: 22, absentDays: 0, leaveDays: 0, paymentMethod: 'bank_transfer', paymentDate: '2026-01-28', bankName: 'Emirates NBD', accountNumber: 'AE070331234567890123456', iban: 'AE070331234567890123456', status: 'paid', generatedAt: '2026-01-25T10:00:00.000Z', paidAt: '2026-01-28T09:00:00.000Z' },
  { id: 'ps_pr_001_emp_002', payrollRunId: 'pr_001', employeeId: 'emp_002', employeeName: 'Sara Ahmed Al Mansoori', employeeIdNumber: 'EMP-2020-002', departmentName: 'Sales', designationName: 'Department Manager', month: 1, year: 2026, basicSalary: 18000, housingAllowance: 5000, transportAllowance: 1500, mobileAllowance: 500, otherAllowances: 1000, overtimeHours: 0, overtimeRate: 0, overtimeAmount: 0, totalEarnings: 26000, absenceDeduction: 0, lateDeduction: 0, loanRepayment: 0, advanceRecovery: 1000, otherDeductions: 0, totalDeductions: 1000, netSalary: 25000, totalWorkingDays: 22, presentDays: 22, absentDays: 0, leaveDays: 0, paymentMethod: 'bank_transfer', paymentDate: '2026-01-28', bankName: 'First Abu Dhabi Bank (FAB)', accountNumber: 'AE340090005009876543210', iban: 'AE340090005009876543210', status: 'paid', generatedAt: '2026-01-25T10:00:00.000Z', paidAt: '2026-01-28T09:00:00.000Z' },
  { id: 'ps_pr_001_emp_003', payrollRunId: 'pr_001', employeeId: 'emp_003', employeeName: 'Rajesh Kumar', employeeIdNumber: 'EMP-2022-003', departmentName: 'Technical Services', designationName: 'Senior Technician', month: 1, year: 2026, basicSalary: 5500, housingAllowance: 1000, transportAllowance: 500, mobileAllowance: 200, otherAllowances: 300, overtimeHours: 12, overtimeRate: 39.06, overtimeAmount: 468.75, totalEarnings: 7968.75, absenceDeduction: 500, lateDeduction: 0, loanRepayment: 0, advanceRecovery: 0, otherDeductions: 0, totalDeductions: 500, netSalary: 7468.75, totalWorkingDays: 22, presentDays: 20, absentDays: 2, leaveDays: 0, paymentMethod: 'bank_transfer', paymentDate: '2026-01-28', bankName: 'Mashreq Bank', accountNumber: 'AE240190000191234567890', iban: 'AE240190000191234567890', status: 'paid', generatedAt: '2026-01-25T10:00:00.000Z', paidAt: '2026-01-28T09:00:00.000Z' },
  { id: 'ps_pr_001_emp_006', payrollRunId: 'pr_001', employeeId: 'emp_006', employeeName: 'Imran Ali Siddiqui', employeeIdNumber: 'EMP-2022-006', departmentName: 'Technical Services', designationName: 'Technician', month: 1, year: 2026, basicSalary: 4000, housingAllowance: 800, transportAllowance: 400, mobileAllowance: 150, otherAllowances: 150, overtimeHours: 6, overtimeRate: 28.41, overtimeAmount: 170.45, totalEarnings: 5670.45, absenceDeduction: 0, lateDeduction: 90.91, loanRepayment: 0, advanceRecovery: 0, otherDeductions: 0, totalDeductions: 90.91, netSalary: 5579.55, totalWorkingDays: 22, presentDays: 22, absentDays: 0, leaveDays: 0, paymentMethod: 'bank_transfer', paymentDate: '2026-01-28', bankName: 'RAK Bank', accountNumber: 'AE020400000126789012345', iban: 'AE020400000126789012345', status: 'paid', generatedAt: '2026-01-25T10:00:00.000Z', paidAt: '2026-01-28T09:00:00.000Z' },
  { id: 'ps_pr_001_emp_015', payrollRunId: 'pr_001', employeeId: 'emp_015', employeeName: 'Tariq Mahmood', employeeIdNumber: 'EMP-2020-015', departmentName: 'Operations', designationName: 'General Manager', month: 1, year: 2026, basicSalary: 25000, housingAllowance: 7000, transportAllowance: 2000, mobileAllowance: 700, otherAllowances: 5300, overtimeHours: 0, overtimeRate: 0, overtimeAmount: 0, totalEarnings: 40000, absenceDeduction: 0, lateDeduction: 0, loanRepayment: 0, advanceRecovery: 0, otherDeductions: 0, totalDeductions: 0, netSalary: 40000, totalWorkingDays: 22, presentDays: 22, absentDays: 0, leaveDays: 0, paymentMethod: 'bank_transfer', paymentDate: '2026-01-28', bankName: 'First Abu Dhabi Bank (FAB)', accountNumber: 'AE340090005014567123456', iban: 'AE340090005014567123456', status: 'paid', generatedAt: '2026-01-25T10:00:00.000Z', paidAt: '2026-01-28T09:00:00.000Z' },
]

// ═══════════════════════════════════════════════════════════════════════════════
// EOSB RECORDS (End of Service Benefit / Gratuity per UAE Labor Law)
// ═══════════════════════════════════════════════════════════════════════════════

export const sampleEOSBRecords: EOSBRecord[] = [
  { id: 'eosb_001', employeeId: 'emp_021', employeeName: 'Hassan Al Blooshi', calculationDate: '2025-12-15', joinDate: '2019-03-01', terminationDate: '2025-12-15', contractType: 'unlimited', terminationReason: 'resignation', yearsOfService: 6.79, lastBasicSalary: 12000, grossGratuity: 38700, netGratuity: 38700, leaveEncashment: 4800, totalSettlement: 43500, status: 'paid', createdAt: '2025-12-15T10:00:00.000Z' },
  { id: 'eosb_002', employeeId: 'emp_022', employeeName: 'Reem Al Kaabi', calculationDate: '2025-11-30', joinDate: '2021-06-15', terminationDate: '2025-11-30', contractType: 'unlimited', terminationReason: 'employer_termination', yearsOfService: 4.46, lastBasicSalary: 9500, grossGratuity: 18876.67, netGratuity: 18876.67, leaveEncashment: 3166.67, totalSettlement: 22043.34, status: 'paid', createdAt: '2025-11-30T09:00:00.000Z' },
  { id: 'eosb_003', employeeId: 'emp_023', employeeName: 'Tariq Al Hammadi', calculationDate: '2026-01-10', joinDate: '2016-09-01', terminationDate: '2026-01-10', contractType: 'limited', terminationReason: 'contract_expiry', yearsOfService: 9.35, lastBasicSalary: 15000, grossGratuity: 68250, netGratuity: 68250, leaveEncashment: 7500, totalSettlement: 75750, status: 'approved', createdAt: '2026-01-10T11:30:00.000Z' },
  { id: 'eosb_004', employeeId: 'emp_024', employeeName: 'Layla Al Qasimi', calculationDate: '2026-02-01', joinDate: '2023-04-01', terminationDate: '2026-02-01', contractType: 'unlimited', terminationReason: 'resignation', yearsOfService: 2.84, lastBasicSalary: 7000, grossGratuity: 4066.67, netGratuity: 4066.67, leaveEncashment: 1166.67, totalSettlement: 5233.34, status: 'calculated', createdAt: '2026-02-01T08:00:00.000Z' },
  { id: 'eosb_005', employeeId: 'emp_025', employeeName: 'Nasser Al Dhaheri', calculationDate: '2026-02-10', joinDate: '2018-11-15', terminationDate: '2026-02-10', contractType: 'unlimited', terminationReason: 'retirement', yearsOfService: 7.24, lastBasicSalary: 20000, grossGratuity: 84000, netGratuity: 84000, leaveEncashment: 10000, totalSettlement: 94000, status: 'approved', createdAt: '2026-02-10T08:00:00.000Z' },
]

// ═══════════════════════════════════════════════════════════════════════════════
// EMPLOYEE DOCUMENTS
// ═══════════════════════════════════════════════════════════════════════════════

export const sampleDocuments: EmployeeDocument[] = [
  { id: 'doc_001', employeeId: 'emp_001', employeeName: 'Mohammed Al Rashidi', documentTypeId: 'emirates_id', documentTypeName: 'Emirates ID', fileName: 'emirates_id_emp001.pdf', fileUrl: '/uploads/doc_001.pdf', fileSize: 245000, fileFormat: 'pdf', issueDate: '2022-06-15', expiryDate: '2027-09-10', verificationStatus: 'verified', verifiedBy: 'Nadia Al Farsi', verifiedAt: '2024-01-10T09:00:00.000Z', uploadedAt: '2024-01-08T08:00:00.000Z', updatedAt: '2024-01-10T09:00:00.000Z' },
  { id: 'doc_002', employeeId: 'emp_001', employeeName: 'Mohammed Al Rashidi', documentTypeId: 'passport', documentTypeName: 'Passport', fileName: 'passport_emp001.pdf', fileUrl: '/uploads/doc_002.pdf', fileSize: 380000, fileFormat: 'pdf', issueDate: '2021-03-20', expiryDate: '2026-04-19', verificationStatus: 'verified', verifiedBy: 'Nadia Al Farsi', verifiedAt: '2024-01-10T09:05:00.000Z', uploadedAt: '2024-01-08T08:05:00.000Z', updatedAt: '2024-01-10T09:05:00.000Z' },
  { id: 'doc_003', employeeId: 'emp_001', employeeName: 'Mohammed Al Rashidi', documentTypeId: 'visa', documentTypeName: 'UAE Visa', fileName: 'visa_emp001.pdf', fileUrl: '/uploads/doc_003.pdf', fileSize: 195000, fileFormat: 'pdf', issueDate: '2023-09-01', expiryDate: '2026-02-03', verificationStatus: 'expired', verifiedBy: 'Nadia Al Farsi', verifiedAt: '2023-09-05T10:00:00.000Z', uploadedAt: '2023-09-02T09:00:00.000Z', updatedAt: '2026-02-04T00:00:00.000Z' },
  { id: 'doc_004', employeeId: 'emp_002', employeeName: 'Sara Ahmed Al Mansoori', documentTypeId: 'emirates_id', documentTypeName: 'Emirates ID', fileName: 'emirates_id_emp002.pdf', fileUrl: '/uploads/doc_004.pdf', fileSize: 260000, fileFormat: 'pdf', issueDate: '2023-02-10', expiryDate: '2028-02-09', verificationStatus: 'verified', verifiedBy: 'Khalid Hassan Ibrahim', verifiedAt: '2024-02-20T10:00:00.000Z', uploadedAt: '2024-02-18T09:00:00.000Z', updatedAt: '2024-02-20T10:00:00.000Z' },
  { id: 'doc_005', employeeId: 'emp_002', employeeName: 'Sara Ahmed Al Mansoori', documentTypeId: 'employment_contract', documentTypeName: 'Employment Contract', fileName: 'contract_emp002.pdf', fileUrl: '/uploads/doc_005.pdf', fileSize: 512000, fileFormat: 'pdf', issueDate: '2020-01-15', verificationStatus: 'verified', verifiedBy: 'Tariq Mahmood', verifiedAt: '2020-01-16T08:00:00.000Z', uploadedAt: '2020-01-15T12:00:00.000Z', updatedAt: '2020-01-16T08:00:00.000Z' },
  { id: 'doc_006', employeeId: 'emp_003', employeeName: 'Rajesh Kumar', documentTypeId: 'emirates_id', documentTypeName: 'Emirates ID', fileName: 'emirates_id_emp003.pdf', fileUrl: '/uploads/doc_006.pdf', fileSize: 230000, fileFormat: 'pdf', issueDate: '2024-01-05', expiryDate: '2026-03-15', verificationStatus: 'verified', verifiedBy: 'Nadia Al Farsi', verifiedAt: '2024-01-07T10:00:00.000Z', uploadedAt: '2024-01-06T09:00:00.000Z', updatedAt: '2024-01-07T10:00:00.000Z' },
  { id: 'doc_007', employeeId: 'emp_003', employeeName: 'Rajesh Kumar', documentTypeId: 'visa', documentTypeName: 'UAE Visa', fileName: 'visa_emp003.pdf', fileUrl: '/uploads/doc_007.pdf', fileSize: 200000, fileFormat: 'pdf', issueDate: '2022-01-10', expiryDate: '2026-02-13', verificationStatus: 'expired', uploadedAt: '2022-01-12T08:00:00.000Z', updatedAt: '2026-02-14T00:00:00.000Z' },
  { id: 'doc_008', employeeId: 'emp_005', employeeName: 'Khalid Hassan Ibrahim', documentTypeId: 'passport', documentTypeName: 'Passport', fileName: 'passport_emp005.pdf', fileUrl: '/uploads/doc_008.pdf', fileSize: 350000, fileFormat: 'pdf', issueDate: '2018-09-12', expiryDate: '2029-06-20', verificationStatus: 'verified', verifiedBy: 'Nadia Al Farsi', verifiedAt: '2024-05-25T09:00:00.000Z', uploadedAt: '2024-05-22T08:00:00.000Z', updatedAt: '2024-05-25T09:00:00.000Z' },
  { id: 'doc_009', employeeId: 'emp_005', employeeName: 'Khalid Hassan Ibrahim', documentTypeId: 'labor_card', documentTypeName: 'Labor Card', fileName: 'labor_card_emp005.pdf', fileUrl: '/uploads/doc_009.pdf', fileSize: 180000, fileFormat: 'pdf', issueDate: '2024-06-01', expiryDate: '2026-05-07', verificationStatus: 'verified', verifiedBy: 'Nadia Al Farsi', verifiedAt: '2024-06-05T10:00:00.000Z', uploadedAt: '2024-06-03T09:00:00.000Z', updatedAt: '2024-06-05T10:00:00.000Z' },
  { id: 'doc_010', employeeId: 'emp_006', employeeName: 'Imran Ali Siddiqui', documentTypeId: 'medical_certificate', documentTypeName: 'Medical Certificate', fileName: 'medical_emp006.pdf', fileUrl: '/uploads/doc_010.pdf', fileSize: 155000, fileFormat: 'pdf', issueDate: '2025-01-10', expiryDate: '2026-02-23', verificationStatus: 'pending', uploadedAt: '2025-01-12T08:00:00.000Z', updatedAt: '2025-01-12T08:00:00.000Z' },
  { id: 'doc_011', employeeId: 'emp_010', employeeName: 'Nadia Al Farsi', documentTypeId: 'educational_certificate', documentTypeName: 'Educational Certificate', fileName: 'degree_emp010.pdf', fileUrl: '/uploads/doc_011.pdf', fileSize: 620000, fileFormat: 'pdf', issueDate: '2006-06-15', verificationStatus: 'verified', verifiedBy: 'Tariq Mahmood', verifiedAt: '2020-09-05T08:00:00.000Z', uploadedAt: '2020-09-03T07:00:00.000Z', updatedAt: '2020-09-05T08:00:00.000Z' },
  { id: 'doc_012', employeeId: 'emp_007', employeeName: 'Ahmed Hassan Ibrahim', documentTypeId: 'noc', documentTypeName: 'No Objection Certificate', fileName: 'noc_emp007.pdf', fileUrl: '/uploads/doc_012.pdf', fileSize: 135000, fileFormat: 'pdf', issueDate: '2024-06-10', verificationStatus: 'pending', uploadedAt: '2024-06-10T12:00:00.000Z', updatedAt: '2024-06-10T12:00:00.000Z' },
]

// ═══════════════════════════════════════════════════════════════════════════════
// DOCUMENT EXPIRY ALERTS
// ═══════════════════════════════════════════════════════════════════════════════

export const sampleDocumentExpiryAlerts: DocumentExpiryAlert[] = [
  { id: 'alert_001', employeeId: 'emp_001', employeeName: 'Mohammed Al Rashidi', departmentName: 'Operations', documentTypeId: 'visa', documentTypeName: 'UAE Visa', expiryDate: '2026-02-03', daysUntilExpiry: -26, severity: 'expired' },
  { id: 'alert_002', employeeId: 'emp_003', employeeName: 'Rajesh Kumar', departmentName: 'Technical Services', documentTypeId: 'visa', documentTypeName: 'UAE Visa', expiryDate: '2026-02-13', daysUntilExpiry: -16, severity: 'expired' },
  { id: 'alert_003', employeeId: 'emp_006', employeeName: 'Imran Ali Siddiqui', departmentName: 'Technical Services', documentTypeId: 'medical_certificate', documentTypeName: 'Medical Certificate', expiryDate: '2026-02-23', daysUntilExpiry: -6, severity: 'expired' },
  { id: 'alert_004', employeeId: 'emp_003', employeeName: 'Rajesh Kumar', departmentName: 'Technical Services', documentTypeId: 'emirates_id', documentTypeName: 'Emirates ID', expiryDate: '2026-03-15', daysUntilExpiry: 14, severity: 'warning' },
  { id: 'alert_005', employeeId: 'emp_001', employeeName: 'Mohammed Al Rashidi', departmentName: 'Operations', documentTypeId: 'passport', documentTypeName: 'Passport', expiryDate: '2026-04-19', daysUntilExpiry: 49, severity: 'info' },
  { id: 'alert_006', employeeId: 'emp_005', employeeName: 'Khalid Hassan Ibrahim', departmentName: 'Finance & Accounts', documentTypeId: 'labor_card', documentTypeName: 'Labor Card', expiryDate: '2026-05-07', daysUntilExpiry: 67, severity: 'info' },
]

// ═══════════════════════════════════════════════════════════════════════════════
// PERFORMANCE REVIEWS
// ═══════════════════════════════════════════════════════════════════════════════

function buildCategoryRatings(selfScores: number[], managerScores: number[]): CategoryRating[] {
  return DEFAULT_RATING_CATEGORIES.map((cat, i) => ({
    categoryId: cat.id,
    categoryName: cat.name,
    weight: cat.weight,
    selfRating: selfScores[i] as RatingScore,
    managerRating: managerScores[i] as RatingScore,
    comments: i % 2 === 0 ? `Good performance in ${cat.name.toLowerCase()}.` : undefined,
  }))
}

function buildGoals(completed: boolean): PerformanceGoal[] {
  return [
    { id: completed ? 'goal_prev_001' : 'goal_new_001', title: 'Complete advanced certification', description: 'Obtain relevant industry certification to enhance technical skills.', targetDate: '2026-06-30', status: completed ? 'completed' : 'in-progress', progress: completed ? 100 : 60 },
    { id: completed ? 'goal_prev_002' : 'goal_new_002', title: 'Improve customer satisfaction score', description: 'Achieve a customer satisfaction score of 4.5 or above in all handled cases.', targetDate: '2026-09-30', status: 'in-progress', progress: 45 },
    { id: completed ? 'goal_prev_003' : 'goal_new_003', title: 'Lead cross-functional project', description: 'Take ownership of at least one cross-department initiative.', targetDate: '2026-12-31', status: 'not-started', progress: 0 },
  ]
}

function weightedAvg(ratings: CategoryRating[], field: 'selfRating' | 'managerRating'): number {
  let totalWeight = 0
  let weightedSum = 0
  ratings.forEach((r) => {
    const val = r[field]
    if (val !== undefined) {
      weightedSum += val * r.weight
      totalWeight += r.weight
    }
  })
  return totalWeight > 0 ? Math.round((weightedSum / totalWeight) * 100) / 100 : 0
}

const reviewData: Array<{ id: string; name: string; dept: string; designation: string; self: number[]; manager: number[] }> = [
  { id: 'emp_001', name: 'Mohammed Al Rashidi', dept: 'Operations', designation: 'Senior Supervisor', self: [4, 5, 4, 4, 3, 5], manager: [4, 4, 5, 4, 4, 5] },
  { id: 'emp_002', name: 'Sara Ahmed Al Mansoori', dept: 'Sales', designation: 'Department Manager', self: [5, 5, 5, 4, 5, 5], manager: [5, 5, 4, 5, 5, 5] },
  { id: 'emp_003', name: 'Rajesh Kumar', dept: 'Technical Services', designation: 'Senior Technician', self: [3, 3, 4, 4, 3, 4], manager: [3, 3, 3, 4, 3, 4] },
  { id: 'emp_005', name: 'Khalid Hassan Ibrahim', dept: 'Finance & Accounts', designation: 'Accountant', self: [4, 4, 4, 5, 4, 5], manager: [4, 5, 4, 5, 4, 5] },
  { id: 'emp_007', name: 'Ahmed Hassan Ibrahim', dept: 'Administration', designation: 'Department Manager', self: [5, 4, 5, 5, 5, 5], manager: [5, 5, 5, 4, 5, 5] },
  { id: 'emp_010', name: 'Nadia Al Farsi', dept: 'Finance & Accounts', designation: 'Department Manager', self: [5, 5, 5, 5, 5, 4], manager: [5, 5, 5, 5, 4, 5] },
  { id: 'emp_015', name: 'Tariq Mahmood', dept: 'Operations', designation: 'General Manager', self: [4, 4, 4, 4, 4, 5], manager: [4, 4, 4, 5, 4, 4] },
  { id: 'emp_006', name: 'Imran Ali Siddiqui', dept: 'Technical Services', designation: 'Technician', self: [3, 4, 3, 4, 3, 3], manager: [3, 3, 4, 4, 3, 4] },
]

export const samplePerformanceReviews: PerformanceReview[] = reviewData.map((emp, i) => {
  const catRatings = buildCategoryRatings(emp.self, emp.manager)
  const selfAvg = weightedAvg(catRatings, 'selfRating')
  const managerAvg = weightedAvg(catRatings, 'managerRating')
  const overall = Math.round(((selfAvg + managerAvg) / 2) * 100) / 100
  const isCompleted = i % 3 !== 2
  const period: 'annual' | 'semi-annual' = i % 2 === 0 ? 'annual' : 'semi-annual'

  return {
    id: `rev_${String(i + 1).padStart(3, '0')}`,
    employeeId: emp.id,
    employeeName: emp.name,
    employeePhoto: undefined,
    departmentName: emp.dept,
    designationName: emp.designation,
    reviewerId: 'emp_010',
    reviewerName: 'Nadia Al Farsi',
    period,
    periodLabel: period === 'annual' ? 'Annual 2025' : 'H2 2025',
    year: 2025,
    startDate: period === 'annual' ? '2025-01-01' : '2025-07-01',
    endDate: '2025-12-31',
    status: isCompleted ? 'completed' : 'manager-review',
    categoryRatings: catRatings,
    overallSelfRating: selfAvg,
    overallManagerRating: managerAvg,
    overallRating: isCompleted ? overall : undefined,
    selfComments: `I believe I performed well in ${emp.designation} responsibilities this period and met most of my targets.`,
    managerComments: isCompleted
      ? `${emp.name} has shown consistent dedication and delivered quality work throughout the review period.`
      : undefined,
    strengths: isCompleted ? 'Strong technical knowledge, reliable attendance, and proactive communication.' : undefined,
    areasOfImprovement: isCompleted ? 'Could improve cross-team collaboration and delegation skills.' : undefined,
    previousGoals: buildGoals(true),
    newGoals: buildGoals(false),
    completedAt: isCompleted ? '2026-01-15T10:00:00.000Z' : undefined,
    createdAt: '2025-12-01T08:00:00.000Z',
    updatedAt: '2026-02-18T10:00:00.000Z',
  }
})
