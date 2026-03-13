# BACKEND SPECIFICATION — OptifyServe ERP

> **Phase 2 of 5** | Generated: 2026-03-13
> **Purpose**: Complete backend architecture specification for Node.js/Express/Prisma stack.
> **Depends on**: FRONTEND_ANALYSIS.md (Phase 1)

---

## 1. System Overview

**Product**: OptifyServe ERP — Multi-tenant SaaS backend for UAE service & maintenance companies
**Architecture**: RESTful API server (monolith-first, modular structure)
**Runtime**: Node.js with TypeScript (strict mode)
**Framework**: Express.js
**ORM**: Prisma with PostgreSQL 16
**Auth**: JWT (access + refresh tokens)
**Queue**: BullMQ + Redis
**Real-time**: Socket.io
**Deployment**: Docker (local) → Railway (staging) → Azure (production)

### Design Philosophy
- **MVP-first**: Ship working features, harden later
- **Modular monolith**: Feature-based folder structure, easy to extract later
- **Strict TypeScript**: No `any`, no silent assumptions
- **Financial correctness**: `decimal.js` everywhere, never floats for money
- **Tenant isolation**: `tenantId` enforced at every layer from day one
- **Practical**: No unnecessary abstractions, no fake scaffolding

---

## 2. Scope & MVP Recommendation

### MVP (Phase 1) — Core Business Operations
| Priority | Module | Reason |
|----------|--------|--------|
| P0 | Auth + Tenants | Foundation for everything |
| P0 | Users + Roles + Permissions | RBAC required by all modules |
| P0 | Settings (Company Profile, Branches) | Required for document numbering, VAT |
| P1 | CRM (Customers, Leads) | Revenue pipeline |
| P1 | Sales (Quotations, Invoices, Payments) | Revenue generation |
| P1 | Jobs (Jobs, Technicians, Service Reports) | Core business |
| P1 | Inventory (Items, Warehouses, Stock) | Parts for jobs |

### Post-MVP (Phase 2) — Operations & Finance
| Priority | Module | Reason |
|----------|--------|--------|
| P2 | Purchase (Vendors, POs, GRN, Returns, Payments) | Procurement |
| P2 | Accounts (COA, JE, AR, AP, Expenses) | Finance |
| P2 | HR (Employees, Attendance, Leave) | People management |
| P2 | Dispatcher (Real-time) | Field operations |
| P2 | Audit (Logging) | Compliance |

### Post-MVP (Phase 3) — Advanced
| Priority | Module | Reason |
|----------|--------|--------|
| P3 | HR (Payroll, EOSB, Performance) | Complex calculations |
| P3 | Accounts (VAT Returns, Bank Recon, Reports) | Financial reporting |
| P3 | Platform Admin (Tenants, Plans, Analytics) | SaaS management |
| P3 | Notifications (Email, WhatsApp) | Communication |
| P3 | Reports/Export (PDF, Excel) | Document generation |

---

## 3. Module Map

Based on FRONTEND_ANALYSIS.md, the backend serves 14 frontend modules through the following API module grouping:

```
Backend Modules (15):
├── auth          → Login, logout, refresh, password reset, sessions
├── tenants       → Tenant CRUD, subscription, module enablement
├── users         → User CRUD, invitations, profile
├── roles         → Role CRUD, permission assignment
├── permissions   → Permission listing (read-only seed data)
├── crm           → Customers, leads, follow-ups
├── sales         → Quotations, invoices, payments
├── inventory     → Items, categories, warehouses, stock levels, movements
├── purchase      → Vendors, POs, GRN, returns, vendor payments
├── accounts      → COA, JE, AR, AP, expenses, bank recon, VAT, reports
├── hr            → Employees, departments, attendance, leave, payroll, EOSB, documents, performance
├── jobs          → Jobs, technicians, scheduling, service reports, feedback
├── dispatcher    → Real-time overview, assignment suggestions
├── audit         → Audit log (read-only for API; write via middleware)
├── settings      → Company profile, branches, notifications, integrations, security, tax config
```

---

## 4. Backend Architecture

### Layered Architecture (per module)

```
Request → Router → Middleware → Controller → Service → Repository → Prisma → PostgreSQL
                     │                          │
                     ├── Auth middleware         ├── Validation (Zod)
                     ├── Tenant middleware       ├── Business logic
                     ├── Permission middleware   ├── Financial calculations (decimal.js)
                     └── Rate limit middleware   └── Audit logging
```

### Layer Responsibilities

| Layer | Responsibility | Rules |
|-------|---------------|-------|
| **Router** | Route definitions, HTTP method mapping | No business logic. Just wiring. |
| **Middleware** | Cross-cutting concerns (auth, tenant, permissions, rate limit) | Shared across modules. |
| **Controller** | Request parsing, response formatting, error handling | Thin. Calls service. Returns formatted response. |
| **Service** | Business logic, validation, orchestration | Core logic lives here. Calls repository. |
| **Repository** | Data access, Prisma queries, raw SQL where needed | Tenant-scoped. No business logic. |
| **Schema** | Zod validation schemas for request bodies | Reusable. Exported for tests. |
| **Types** | TypeScript interfaces and types | Strict. No `any`. |
| **Mapper** | Entity ↔ DTO transformations (optional) | Only when entity shape differs from response. |

---

## 5. Folder Structure

```
backend/
├── prisma/
│   ├── schema.prisma              # Prisma schema
│   ├── migrations/                # Generated migrations
│   └── seed.ts                    # Seed script
├── src/
│   ├── app/
│   │   ├── server.ts              # Express app creation + middleware setup
│   │   ├── routes.ts              # Central route registration
│   │   └── socket.ts              # Socket.io setup
│   ├── config/
│   │   ├── env.ts                 # Environment variables (validated with Zod)
│   │   ├── database.ts            # Prisma client singleton
│   │   ├── redis.ts               # Redis connection
│   │   ├── logger.ts              # Winston logger config
│   │   └── swagger.ts             # OpenAPI config
│   ├── common/
│   │   ├── errors/
│   │   │   ├── app-error.ts       # Base error class
│   │   │   ├── not-found.ts       # 404
│   │   │   ├── unauthorized.ts    # 401
│   │   │   ├── forbidden.ts       # 403
│   │   │   └── validation.ts      # 422
│   │   ├── types/
│   │   │   ├── express.d.ts       # Express augmentation (req.user, req.tenantId)
│   │   │   ├── pagination.ts      # PaginatedResponse<T>, PaginationQuery
│   │   │   ├── api-response.ts    # ApiResponse<T>, ApiError
│   │   │   └── common.ts          # Shared types (Address, Money, DateRange, etc.)
│   │   ├── utils/
│   │   │   ├── decimal.ts         # decimal.js helpers (add, subtract, multiply, VAT calc)
│   │   │   ├── date.ts            # dayjs helpers
│   │   │   ├── hash.ts            # bcryptjs helpers
│   │   │   ├── jwt.ts             # JWT sign/verify helpers
│   │   │   ├── pagination.ts      # Pagination helper (offset, limit from page/pageSize)
│   │   │   └── sequence.ts        # Document number generator
│   │   └── constants/
│   │       ├── permissions.ts     # 52 permission constants
│   │       ├── uae.ts             # Emirates, VAT rate, phone regex, TRN regex
│   │       └── defaults.ts        # Default page size, token expiry, etc.
│   ├── middlewares/
│   │   ├── auth.middleware.ts             # JWT verification, attach req.user
│   │   ├── tenant.middleware.ts           # Extract tenantId from user, attach req.tenantId
│   │   ├── permission.middleware.ts       # Check req.user.permissions against required
│   │   ├── validate.middleware.ts         # Zod schema validation for req.body/query/params
│   │   ├── rate-limit.middleware.ts       # express-rate-limit config
│   │   ├── audit.middleware.ts            # Auto-log mutations to audit_logs
│   │   ├── error-handler.middleware.ts    # Global error handler
│   │   ├── request-id.middleware.ts       # UUID per request for tracing
│   │   └── morgan.middleware.ts           # HTTP request logging
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.schema.ts            # Zod: loginSchema, refreshSchema, forgotPasswordSchema
│   │   │   └── auth.types.ts
│   │   ├── tenants/
│   │   │   ├── tenants.routes.ts
│   │   │   ├── tenants.controller.ts
│   │   │   ├── tenants.service.ts
│   │   │   ├── tenants.repository.ts
│   │   │   ├── tenants.schema.ts
│   │   │   └── tenants.types.ts
│   │   ├── users/
│   │   │   ├── users.routes.ts
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── users.repository.ts
│   │   │   ├── users.schema.ts
│   │   │   └── users.types.ts
│   │   ├── roles/
│   │   │   ├── roles.routes.ts
│   │   │   ├── roles.controller.ts
│   │   │   ├── roles.service.ts
│   │   │   ├── roles.repository.ts
│   │   │   └── roles.schema.ts
│   │   ├── crm/
│   │   │   ├── crm.routes.ts
│   │   │   ├── customers/
│   │   │   │   ├── customers.controller.ts
│   │   │   │   ├── customers.service.ts
│   │   │   │   ├── customers.repository.ts
│   │   │   │   ├── customers.schema.ts
│   │   │   │   └── customers.types.ts
│   │   │   └── leads/
│   │   │       ├── leads.controller.ts
│   │   │       ├── leads.service.ts
│   │   │       ├── leads.repository.ts
│   │   │       ├── leads.schema.ts
│   │   │       └── leads.types.ts
│   │   ├── sales/
│   │   │   ├── sales.routes.ts
│   │   │   ├── quotations/
│   │   │   ├── invoices/
│   │   │   └── payments/
│   │   ├── inventory/
│   │   │   ├── inventory.routes.ts
│   │   │   ├── items/
│   │   │   ├── warehouses/
│   │   │   ├── stock/
│   │   │   └── categories/
│   │   ├── purchase/
│   │   │   ├── purchase.routes.ts
│   │   │   ├── vendors/
│   │   │   ├── purchase-orders/
│   │   │   ├── grn/
│   │   │   ├── returns/
│   │   │   └── vendor-payments/
│   │   ├── accounts/
│   │   │   ├── accounts.routes.ts
│   │   │   ├── chart-of-accounts/
│   │   │   ├── journal-entries/
│   │   │   ├── receivable/
│   │   │   ├── payable/
│   │   │   ├── expenses/
│   │   │   ├── bank-reconciliation/
│   │   │   ├── vat/
│   │   │   └── reports/
│   │   ├── hr/
│   │   │   ├── hr.routes.ts
│   │   │   ├── employees/
│   │   │   ├── departments/
│   │   │   ├── attendance/
│   │   │   ├── leave/
│   │   │   ├── payroll/
│   │   │   ├── eosb/
│   │   │   ├── documents/
│   │   │   └── performance/
│   │   ├── jobs/
│   │   │   ├── jobs.routes.ts
│   │   │   ├── jobs/
│   │   │   ├── technicians/
│   │   │   ├── service-reports/
│   │   │   └── feedback/
│   │   ├── dispatcher/
│   │   │   ├── dispatcher.routes.ts
│   │   │   ├── dispatcher.controller.ts
│   │   │   ├── dispatcher.service.ts
│   │   │   └── dispatcher.types.ts
│   │   ├── audit/
│   │   │   ├── audit.routes.ts
│   │   │   ├── audit.controller.ts
│   │   │   ├── audit.service.ts
│   │   │   ├── audit.repository.ts
│   │   │   └── audit.types.ts
│   │   └── settings/
│   │       ├── settings.routes.ts
│   │       ├── company-profile/
│   │       ├── branches/
│   │       ├── notifications/
│   │       ├── integrations/
│   │       ├── security/
│   │       └── tax/
│   ├── queues/
│   │   ├── queue.config.ts        # BullMQ connection
│   │   ├── email.queue.ts         # Email sending jobs
│   │   ├── report.queue.ts        # PDF/Excel generation
│   │   ├── notification.queue.ts  # Push/WhatsApp notifications
│   │   └── recurring.queue.ts     # Recurring job scheduling
│   ├── socket/
│   │   ├── socket.config.ts       # Socket.io server config
│   │   ├── auth.handler.ts        # Socket auth middleware
│   │   ├── dispatcher.handler.ts  # Dispatcher namespace events
│   │   └── notification.handler.ts # Notification namespace events
│   └── index.ts                   # Entry point
├── tests/
│   ├── setup.ts                   # Test DB setup/teardown
│   ├── helpers/                   # Test factories, auth helpers
│   ├── unit/                      # Service-level tests
│   └── integration/               # API endpoint tests (Supertest)
├── docker-compose.yml             # PostgreSQL + Redis
├── Dockerfile                     # Production image
├── .env                           # Environment variables
├── .env.example                   # Template
├── tsconfig.json                  # TypeScript config (strict)
├── jest.config.ts                 # Jest config
├── package.json
└── README.md
```

---

## 6. Coding Conventions

### TypeScript
- **Strict mode**: `"strict": true` in tsconfig
- **No `any`**: Use `unknown` + type guards, or proper types
- **No `as` casts**: Except for well-documented narrow cases (e.g., Prisma result typing)
- **Explicit return types**: All public functions
- **Enums**: Use `as const` arrays + type inference (matching frontend pattern)
- **Naming**: camelCase for variables/functions, PascalCase for types/classes, SCREAMING_SNAKE for constants

### File Naming
- `kebab-case.ts` for all files
- `.routes.ts`, `.controller.ts`, `.service.ts`, `.repository.ts`, `.schema.ts`, `.types.ts`
- Test files: `*.test.ts` or `*.spec.ts`

### Import Order
1. Node.js built-ins
2. External packages
3. Internal aliases (`@/config`, `@/common`, `@/middlewares`, `@/modules`)
4. Relative imports

### Error Handling
- Services throw typed `AppError` subclasses
- Controllers catch nothing (global error handler middleware)
- Never swallow errors silently
- Always include error context (entity ID, operation name)

---

## 7. API Design Rules

### Base URL
```
/api/v1
```

### HTTP Methods
| Method | Usage | Idempotent |
|--------|-------|-----------|
| GET | Read (list, get by ID) | Yes |
| POST | Create, actions (login, convert, assign) | No |
| PUT | Full update | Yes |
| PATCH | Partial update, status change | Yes |
| DELETE | Soft delete (set deleted_at) | Yes |

### URL Patterns
```
GET    /api/v1/{resource}              → List (paginated)
POST   /api/v1/{resource}              → Create
GET    /api/v1/{resource}/:id          → Get by ID
PUT    /api/v1/{resource}/:id          → Update
DELETE /api/v1/{resource}/:id          → Soft delete
PATCH  /api/v1/{resource}/:id/status   → Status change
POST   /api/v1/{resource}/:id/{action} → Custom action (convert, approve, assign)
```

### Query Parameters (Lists)
```
?page=1&pageSize=25                    → Pagination
?search=keyword                        → Full-text search
?sortBy=createdAt&sortDir=desc         → Sorting
?status=active&emirate=dubai           → Filtering
?dateFrom=2026-01-01&dateTo=2026-03-01 → Date range
```

### Nested Resources
```
GET    /api/v1/invoices/:id/payments   → Invoice payments
POST   /api/v1/invoices/:id/payments   → Record payment
GET    /api/v1/jobs/:id/service-report → Job's service report
```

---

## 8. Response Format Standard

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "requestId": "uuid"
  }
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "pageSize": 25,
    "totalItems": 142,
    "totalPages": 6,
    "hasNextPage": true,
    "hasPreviousPage": false
  },
  "meta": {
    "requestId": "uuid"
  }
}
```

### Empty Success (204)
No body.

---

## 9. Error Format Standard

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "email": ["Email is required", "Must be a valid email"],
      "phone": ["Invalid UAE phone number format"]
    }
  },
  "meta": {
    "requestId": "uuid"
  }
}
```

### Error Codes
| HTTP | Code | When |
|------|------|------|
| 400 | `BAD_REQUEST` | Malformed request |
| 401 | `UNAUTHORIZED` | Missing/invalid/expired JWT |
| 403 | `FORBIDDEN` | Valid JWT but insufficient permissions |
| 404 | `NOT_FOUND` | Resource not found (or not in tenant scope) |
| 409 | `CONFLICT` | Duplicate (e.g., email already exists in tenant) |
| 422 | `VALIDATION_ERROR` | Zod validation failure |
| 429 | `RATE_LIMITED` | Too many requests |
| 500 | `INTERNAL_ERROR` | Unexpected server error |

> **Security note**: 404 is returned for both "not found" and "exists but belongs to different tenant" — never leak cross-tenant existence.

---

## 10. Auth Strategy

### JWT Access Token
- **Expiry**: 15 minutes
- **Algorithm**: HS256 (configurable to RS256 for production)
- **Payload**:
```json
{
  "sub": "user-uuid",
  "tenantId": "tenant-uuid",
  "role": "admin",
  "permissions": ["crm.view", "crm.create", ...],
  "iat": 1234567890,
  "exp": 1234568790
}
```
- **Storage**: Frontend stores in memory (not localStorage for security)
- **Transmission**: `Authorization: Bearer <token>`

### Login Flow
1. `POST /api/v1/auth/login` with `{ email, password }`
2. Validate credentials (bcryptjs compare)
3. Check user status (active only)
4. Check tenant status (active/trial only)
5. Generate access token (15min) + refresh token (7d)
6. Store refresh token in `user_sessions` with device/IP
7. Update `users.last_login_at`
8. Log to audit
9. Return `{ user, accessToken, refreshToken }`

### Password Hashing
- **Algorithm**: bcryptjs with 12 salt rounds
- **Storage**: `users.password_hash`
- **Comparison**: `bcrypt.compare(input, hash)`

---

## 11. Refresh Token Strategy

### Refresh Token
- **Format**: Cryptographically random string (64 bytes, hex-encoded)
- **Expiry**: 7 days
- **Storage**: Hashed in `user_sessions.refresh_token` (never store plaintext)
- **One-time use**: Each refresh generates a new token pair (rotation)

### Refresh Flow
1. `POST /api/v1/auth/refresh` with `{ refreshToken }`
2. Hash the provided refresh token
3. Find matching session in `user_sessions` (not expired)
4. Verify session user is still active, tenant still active
5. Generate new access + refresh token pair
6. Update session with new refresh token hash and `last_active_at`
7. Return new token pair

### Token Rotation
- Old refresh token is invalidated on use
- Prevents replay attacks
- If a stolen token is used after rotation, both tokens are invalidated (detect compromise)

### Session Management
- `GET /api/v1/auth/sessions` → list active sessions for user
- `DELETE /api/v1/auth/sessions/:id` → revoke specific session
- `POST /api/v1/auth/logout` → revoke current session
- Max concurrent sessions configurable per tenant (default: 3)

---

## 12. Role/Permission Strategy

### Architecture
- Permissions are **global seed data** (52 records, not tenant-specific)
- Roles are **tenant-scoped** (each tenant creates custom roles)
- 4 system roles seeded per tenant: Administrator, Manager, Staff, Technician
- System roles cannot be deleted; can have permissions adjusted
- Custom roles can be created by tenant admins

### Permission Format
```
{module}.{action}
```
Examples: `crm.view`, `crm.create`, `sales.approve`, `hr.payroll`, `settings.manage`

### Permission Check Middleware
```typescript
// Usage in routes:
router.get('/customers',
  auth(),                     // verify JWT
  tenant(),                   // extract tenantId
  permission('crm.view'),     // check permission
  customersController.list
)
```

### Super Admin
- `super_admin` role exists only at platform level (not tenant-scoped)
- Can access all tenants and platform admin endpoints
- Permission check bypassed for super_admin
- Super admin endpoints under `/api/v1/admin/*`

---

## 13. Tenant Strategy in Application Layer

### Tenant Context Flow
1. **Auth middleware** verifies JWT → attaches `req.user` (includes `tenantId`)
2. **Tenant middleware** extracts `req.user.tenantId` → attaches `req.tenantId`
3. **Tenant middleware** verifies tenant is active (not suspended/cancelled)
4. **Repository layer** adds `WHERE tenant_id = req.tenantId` to all queries
5. **Create operations** auto-set `tenant_id` from context (never from request body)

### Tenant Scoping Rules
- **Never trust `tenantId` from request payloads** — always derive from JWT
- All business tables have `tenantId` column
- All repository methods accept `tenantId` parameter
- All unique constraints are tenant-aware (e.g., `UNIQUE(tenant_id, email)`)
- Cross-tenant access only for super_admin via admin endpoints
- Foreign key references within same tenant only

### Prisma Extension for Tenant Scoping
```typescript
// Prisma client extension to auto-scope queries
const prismaWithTenant = (tenantId: string) => {
  return prisma.$extends({
    query: {
      $allModels: {
        async findMany({ args, query }) {
          args.where = { ...args.where, tenantId }
          return query(args)
        },
        async create({ args, query }) {
          args.data = { ...args.data, tenantId }
          return query(args)
        },
        // ... similar for findFirst, update, delete
      }
    }
  })
}
```

---

## 14. Validation Strategy with Zod

### Request Validation
- **Body**: `validate('body', createCustomerSchema)`
- **Query**: `validate('query', customerListQuerySchema)`
- **Params**: `validate('params', idParamSchema)`

### Validation Middleware
```typescript
function validate(source: 'body' | 'query' | 'params', schema: ZodSchema) {
  return (req, res, next) => {
    const result = schema.safeParse(req[source])
    if (!result.success) {
      throw new ValidationError(result.error.flatten().fieldErrors)
    }
    req[source] = result.data  // parsed + typed
    next()
  }
}
```

### Schema Examples
```typescript
// Customer creation
const createCustomerSchema = z.object({
  name: z.string().min(2).max(255),
  email: z.string().email(),
  phone: z.string().regex(/^(\+971|00971|0)?[0-9]{9}$/),
  customerType: z.enum(['individual', 'corporate', 'government']),
  taxRegistrationNumber: z.string().length(15).regex(/^\d{15}$/).optional(),
  address: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    emirate: z.enum(['dubai', 'abu-dhabi', 'sharjah', 'ajman', 'rak', 'uaq', 'fujairah']),
    country: z.string().default('UAE'),
  }),
})

// Pagination query
const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortDir: z.enum(['asc', 'desc']).default('desc'),
})
```

### UAE-Specific Validators
- **TRN**: 15 digits, numeric only
- **Phone**: +971 format (9 digits after country code)
- **Emirate**: 7 valid values (kebab-case)
- **VAT rate**: 0 or 5 (percentage)
- **IBAN**: AE + 21 characters

---

## 15. Logging Strategy with Winston + Morgan

### Winston Configuration
```typescript
// Levels: error, warn, info, http, debug
const logger = createLogger({
  level: env.LOG_LEVEL || 'info',
  format: combine(timestamp(), json()),
  defaultMeta: { service: 'optifyserve-api' },
  transports: [
    new transports.Console({ format: combine(colorize(), simple()) }),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' }),
  ],
})
```

### What to Log
| Level | What |
|-------|------|
| **error** | Unhandled exceptions, database errors, external service failures |
| **warn** | Failed auth attempts, rate limit hits, deprecated usage |
| **info** | Request/response (Morgan), business events (payment received, job completed) |
| **http** | HTTP request details (Morgan format) |
| **debug** | Query details, cache hits/misses (dev only) |

### Request Context
Every log entry includes: `requestId`, `tenantId`, `userId`, `method`, `path`

### Morgan Integration
```typescript
app.use(morgan('combined', { stream: { write: (msg) => logger.http(msg.trim()) } }))
```

---

## 16. Queue Strategy with BullMQ

### Redis Connection
Single Redis instance for both BullMQ and caching (separate key prefixes).

### Queue Definitions
| Queue | Purpose | Priority | Retry |
|-------|---------|----------|-------|
| `email` | Send emails (invoice, password reset, notifications) | Medium | 3 retries, exponential backoff |
| `notification` | Push/WhatsApp notifications | Medium | 3 retries |
| `report` | PDF/Excel generation | Low | 2 retries |
| `recurring` | Recurring job scheduling | High | 5 retries |
| `audit` | Async audit log writing (for high-throughput) | Low | 5 retries |

### Job Patterns
```typescript
// Enqueue
await emailQueue.add('send-invoice', { invoiceId, recipientEmail }, {
  attempts: 3,
  backoff: { type: 'exponential', delay: 5000 },
})

// Process
emailQueue.process('send-invoice', async (job) => {
  const { invoiceId, recipientEmail } = job.data
  const invoice = await invoiceService.getById(invoiceId)
  const pdf = await pdfService.generateInvoice(invoice)
  await emailService.send(recipientEmail, 'Invoice', pdf)
})
```

---

## 17. Real-time Strategy with Socket.io

### Namespace Design
```
/                          → Default (unused)
/dispatcher                → Dispatcher real-time events
/notifications             → User notifications
```

### Authentication
Socket.io connections require JWT token in handshake:
```typescript
io.use((socket, next) => {
  const token = socket.handshake.auth.token
  const payload = jwt.verify(token)
  socket.data.user = payload
  socket.join(`tenant:${payload.tenantId}`)  // room per tenant
  next()
})
```

### Events

**Dispatcher namespace** (`/dispatcher`):
| Event | Direction | Payload |
|-------|-----------|---------|
| `technician:location` | Client → Server | `{ technicianId, lat, lng, accuracy }` |
| `technician:status` | Server → Client | `{ technicianId, status, location }` |
| `job:status` | Server → Client | `{ jobId, status, technicianId }` |
| `job:assigned` | Server → Client | `{ jobId, technicianId, technicianName }` |
| `stats:update` | Server → Client | `{ ...dispatcherStats }` |

**Notifications namespace** (`/notifications`):
| Event | Direction | Payload |
|-------|-----------|---------|
| `notification:new` | Server → Client | `{ id, title, message, module, action, timestamp }` |
| `notification:read` | Client → Server | `{ notificationId }` |
| `notification:count` | Server → Client | `{ unreadCount }` |

### Room Strategy
- Tenant room: `tenant:{tenantId}` — broadcast to all users in tenant
- User room: `user:{userId}` — target specific user
- Dispatcher room: `dispatcher:{tenantId}` — only dispatcher operators

---

## 18. Swagger/OpenAPI Strategy

### Generation
- **swagger-jsdoc** + **swagger-ui-express**
- JSDoc annotations on route files
- Auto-generated from Zod schemas where possible

### Access
- **Dev/Staging**: `GET /api-docs` → Swagger UI
- **Production**: Disabled or behind auth

### Documentation Pattern
```typescript
/**
 * @openapi
 * /api/v1/customers:
 *   get:
 *     tags: [CRM]
 *     summary: List customers
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *     responses:
 *       200:
 *         description: Paginated customer list
 */
```

---

## 19. Testing Strategy

### Test Types
| Type | Tool | Coverage Target | When |
|------|------|----------------|------|
| Unit | Jest | Services, utils, validators | Every PR |
| Integration | Jest + Supertest | API endpoints end-to-end | Every PR |
| Database | Jest + test DB | Repository queries, constraints | Critical paths |

### Test Database
- Separate PostgreSQL database for tests (Docker)
- Prisma migrate on test DB before suite
- Transaction-based test isolation (rollback after each test)
- Test factories for creating entities with defaults

### Priority Tests
1. Auth (login, refresh, permission check)
2. Tenant isolation (verify cross-tenant data access impossible)
3. Financial calculations (VAT, invoice totals, EOSB)
4. Business rules (double-entry balance, stock levels, aging buckets)

### Test Naming
```typescript
describe('CustomerService', () => {
  describe('create', () => {
    it('should create a customer with valid data')
    it('should reject duplicate email within same tenant')
    it('should allow same email in different tenants')
    it('should auto-generate customer number')
  })
})
```

---

## 20. Deployment/Environment Strategy

### Environment Variables
```env
# Server
NODE_ENV=development|staging|production
PORT=3000
LOG_LEVEL=debug|info|warn|error

# Database
DATABASE_URL=postgresql://user:pass@host:5432/optifyserve?schema=public

# Redis
REDIS_URL=redis://localhost:6379

# Auth
JWT_SECRET=your-256-bit-secret
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# Email (Nodemailer)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=noreply@optifyserve.com
SMTP_PASS=secret

# File Storage
STORAGE_PROVIDER=local|s3
S3_BUCKET=optifyserve-files
S3_REGION=me-south-1

# External
GOOGLE_MAPS_API_KEY=xxx
WHATSAPP_API_TOKEN=xxx
```

### Docker Compose (Local Development)
```yaml
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: optifyserve
      POSTGRES_USER: optifyserve
      POSTGRES_PASSWORD: optifyserve
    ports: ["5432:5432"]
    volumes: ["pgdata:/var/lib/postgresql/data"]

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]

volumes:
  pgdata:
```

### Deployment Targets
| Environment | Database | Redis | Notes |
|------------|----------|-------|-------|
| Local | Docker PostgreSQL 16 | Docker Redis 7 | `docker-compose up` |
| Staging | Railway PostgreSQL | Railway Redis | Auto-deploy from `staging` branch |
| Production | Azure Database for PostgreSQL | Azure Cache for Redis | Deploy from `main` branch |

---

## 21. Recommended Implementation Order

Based on dependency analysis and MVP priorities:

### Foundation (Weeks 1-2)
1. Project scaffolding (Express, TypeScript, Prisma, Docker)
2. Config system (env validation with Zod)
3. Logger (Winston + Morgan)
4. Error handling (AppError hierarchy + global handler)
5. Database connection (Prisma client singleton)
6. Redis connection

### Auth & Tenancy (Weeks 2-3)
7. Prisma schema: tenants, users, roles, permissions, sessions
8. Auth module (login, logout, refresh, forgot password)
9. Auth middleware (JWT verification)
10. Tenant middleware (tenant context extraction)
11. Permission middleware
12. Seed script (permissions, default tenant, admin user, system roles)

### Shared Infrastructure (Week 3)
13. Validation middleware (Zod)
14. Pagination helper
15. Audit middleware (auto-log mutations)
16. Rate limiting
17. Request ID middleware
18. Swagger setup
19. Document number generator (sequence_counters)

### Core Modules — MVP (Weeks 4-6)
20. Settings: Company profile, branches, tax configuration
21. CRM: Customers, leads, follow-ups
22. Sales: Quotations, invoices, payments
23. Inventory: Items, categories, warehouses, stock levels, movements
24. Jobs: Jobs, technicians, service reports, feedback

### Operations Modules (Weeks 7-9)
25. Purchase: Vendors, POs, GRN, returns, vendor payments
26. Accounts: COA, journal entries, AR, AP, expenses
27. HR: Employees, departments, attendance, leave

### Advanced (Weeks 10-12)
28. Socket.io: Dispatcher real-time
29. BullMQ: Email, notification queues
30. HR: Payroll, EOSB, performance, documents
31. Accounts: VAT returns, bank reconciliation, financial reports
32. Platform Admin: Tenants, plans, analytics
33. Report generation: PDF (Puppeteer), Excel (ExcelJS)

---

## 22. Risks & Assumptions

### Risks
| Risk | Impact | Mitigation |
|------|--------|-----------|
| Prisma limitations with PostgreSQL RLS | High | Evaluate in DB spec; likely Position B for MVP |
| Prisma limitations with raw SQL triggers | Medium | Use Prisma `$executeRaw` for trigger migrations |
| Financial rounding errors | High | Use decimal.js consistently; test with edge cases |
| Large Prisma schema (84 tables) | Medium | Code-generate where possible; modular schema files via Prisma's `@@map` |
| WebSocket scaling | Low (MVP) | Single server for MVP; Redis adapter for multi-server later |
| File upload security | Medium | Validate file types, size limits, virus scan (future) |
| PDF generation performance | Medium | Queue-based (BullMQ), not synchronous |

### Assumptions
1. PostgreSQL 16 is the only supported database
2. Single-region deployment (UAE) for MVP
3. File storage starts as local filesystem, migrates to S3 later
4. WhatsApp integration is via third-party API (not built-in)
5. Google Maps API key is provided by client
6. No mobile app backend for MVP (web-only)
7. Max 50 concurrent users per tenant for MVP performance target
8. Frontend team handles their own integration (backend provides Swagger)

---

## 23. Confirmed vs Inferred vs Recommended

### Confirmed (from source code + PROJECT_SPEC.md + backend-master.md)
- Tech stack: Node.js, Express, Prisma, PostgreSQL, JWT, bcryptjs, Zod, decimal.js, dayjs, BullMQ, Redis, Socket.io, Winston, Morgan, Swagger, Jest, Supertest, ExcelJS, Puppeteer, Nodemailer, Helmet, express-rate-limit
- 14 frontend modules requiring backend API
- 55+ entity types with TypeScript definitions
- 84 database tables with full SQL schema
- JWT auth with refresh tokens
- Multi-tenancy with tenantId on all business tables
- UAE compliance (VAT, TRN, EOSB, labor law)

### Inferred (from UI patterns and data structures)
- ~200 API endpoints needed (CRUD + actions per entity)
- Pagination: page/pageSize/totalItems/totalPages format
- Search: full-text on name/description fields
- Sorting: configurable per column
- Filtering: status, date range, entity references
- File uploads: employee docs, service report photos, company logo
- Email templates: invoice, quotation, password reset, notifications

### Recommended (not in source but advisable)
- API versioning (`/api/v1/`) from day one
- Request tracing (requestId in every log + response)
- Health check endpoint (`GET /api/v1/health`)
- Graceful shutdown (drain connections on SIGTERM)
- Database connection pooling (Prisma default is fine)
- CORS whitelist (configurable per environment)
- Compression middleware (gzip responses)
- Security headers (Helmet defaults + HSTS)
- Content Security Policy headers for production

---

## PHASE SUMMARY

**File**: BACKEND_SPECIFICATION.md
**Discovered**: The backend needs ~200 API endpoints across 15 modules, with JWT auth, tenant-scoped repositories, and financial correctness (decimal.js) as non-negotiable foundations.
**Decided**: MVP-first approach: Foundation + Auth + CRM + Sales + Jobs + Inventory first (Weeks 1-6), deferring Purchase, Accounts, HR, and Platform Admin to Weeks 7-12.
**Next phase depends on**: Database specification must define the Prisma schema strategy, resolve RLS vs application-layer scoping, and establish the migration approach for the existing 84-table SQL design.

---

*End of BACKEND_SPECIFICATION.md*
