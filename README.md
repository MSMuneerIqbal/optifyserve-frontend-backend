# OptifySoft - SaaS ERP System

OptifySoft SaaS Product Development

---

## Software Requirements Specification (SRS)

**ISO/IEC/IEEE 29148:2018 Compliant**

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Overall Description](#2-overall-description)
3. [System Features](#3-system-features)
4. [External Interface Requirements](#4-external-interface-requirements)
5. [Non-Functional Requirements](#5-non-functional-requirements)
6. [Use Case Diagrams](#6-use-case-diagrams)
7. [Database Schema Mapping](#7-database-schema-mapping)
8. [System Architecture Mapping](#8-system-architecture-mapping)
9. [Assumptions and Dependencies](#9-assumptions-and-dependencies)
10. [Approval](#10-approval)

---

## 1. Introduction

### 1.1 Purpose

This document provides a detailed Software Requirements Specification (SRS) for a SaaS-based ERP system designed for service-based and maintenance companies operating in the UAE. The purpose of this document is to define functional and non-functional requirements clearly for developers, testers, project managers, and stakeholders.

### 1.2 Document Conventions

- The term **shall** indicates a mandatory requirement.
- The term **should** indicates a recommended feature.
- The term **may** indicates an optional feature.

### 1.3 Intended Audience

- Internal Development Team
- QA and Testing Team
- Project Managers
- Stakeholders and Product Owners

### 1.4 Product Scope

The ERP system will provide modules for CRM, Sales, Inventory, Purchase, Accounts, HR, Project/Service Management, and Reporting with multi-company and multi-branch support.

### 1.5 Definitions, Acronyms, Abbreviations

| Term | Definition |
|------|------------|
| ERP | Enterprise Resource Planning |
| CRM | Customer Relationship Management |
| VAT | Value Added Tax |
| API | Application Programming Interface |
| UAT | User Acceptance Testing |

---

## 2. Overall Description

### 2.1 Product Perspective

The system is a web-based SaaS ERP application consisting of a React frontend, ASP.NET Core Web API backend, and PostgreSQL database. It follows a multi-tenant architecture.

### 2.2 Product Functions

- User and role management
- Customer and lead management
- Quotation, sales order, and invoicing
- Inventory and warehouse management
- Accounting and finance
- HR and staff management
- Project and service execution
- Reporting and analytics

### 2.3 User Classes and Characteristics

| User Class | Description |
|------------|-------------|
| Admin | Full system access and configuration |
| Manager | Operational control and reporting |
| Staff | Module-based limited access |
| Technician | Job and service-related access |

### 2.4 Operating Environment

- Web browsers (Chrome, Edge, Firefox)
- Desktop and mobile devices
- Cloud-hosted servers

### 2.5 Design and Implementation Constraints

- UAE VAT compliance
- Cloud-based hosting
- Internet connectivity required

---

## 3. System Features

### 3.1 Core System

#### 3.1.1 Dashboard

- The system shall provide a consolidated dashboard showing sales, purchases, accounts, and inventory.

#### 3.1.2 User & Role Management

- The system shall support role-based access control.
- The system shall provide secure authentication.

### 3.2 CRM Module

#### 3.2.1 Customer Management

- The system shall store customer profiles and service history.

#### 3.2.2 Lead Management

- The system shall manage lead lifecycle (New, Follow-up, Closed).

### 3.3 Sales Module

#### 3.3.1 Quotation Management

- The system shall allow quotation creation and approval.

#### 3.3.2 Invoice & Billing

- The system shall generate VAT-compliant invoices.

### 3.4 Inventory Management

- The system shall manage stock in/out.
- The system shall generate low-stock alerts.

### 3.5 Accounts & Finance

- The system shall manage receivables and payables.
- The system shall record expenses and payments.

### 3.6 HR Management

- The system shall manage employee profiles, attendance, and leave.

### 3.7 Project / Service Management

- The system shall manage jobs, technician assignments, and service reports.

---

## 4. External Interface Requirements

### 4.1 User Interfaces

- Web-based responsive UI

### 4.2 Software Interfaces

- WhatsApp Business API
- Google Maps API

---

## 5. Non-Functional Requirements

### 5.1 Performance

- The system shall respond to user requests within 2 seconds under normal load (up to 100 concurrent users).
- The system shall handle up to 500 concurrent users during peak hours with response times not exceeding 5 seconds.
- Database queries shall complete within 1 second for standard operations.

### 5.2 Security

- Role-based authorization
- Encrypted sensitive data

### 5.3 Availability

- High availability with backup and recovery

---

## 6. Use Case Diagrams

### 6.1 Main Actors

- Admin
- Manager
- Staff
- Technician

### 6.2 Core Use Cases

- Manage Users
- Manage Customers
- Create Quotation
- Approve Quotation
- Generate Invoice
- Assign Technician
- Record Service Report
- Generate Reports

*(Detailed UML diagrams will be created as part of the design documentation phase.)*

### 6.3 High-Level Use Case Diagram (Textual UML)

```
                +-------------------+
                |      Admin        |
                +-------------------+
                 |  Manage Users
                 |  Configure System
                 |  View Reports
                 v
+---------------------------------------------------+
|                   ERP SYSTEM                      |
|---------------------------------------------------|
| CRM | Sales | Purchase | Inventory | Accounts     |
| HR  | Projects/Service | Reports   | Settings     |
+---------------------------------------------------+
                 ^            ^           ^
                 |            |           |
        +--------------+ +-----------+ +------------+
        |   Manager    | |   Staff   | | Technician |
        +--------------+ +-----------+ +------------+
        | Sales Orders | | Data Entry| | Job Updates|
        | Approvals    | | Invoices  | | Service Rep|
```

**Notes:**
- Admin has full system access
- Manager has operational and approval rights
- Staff handles daily data entry
- Technician interacts mainly with Job & Service modules

---

## 7. Database Schema Mapping

### 7.1 Core Tables

- Users
- Roles
- Permissions

### 7.2 CRM Tables

- Customers
- Leads
- FollowUps

### 7.3 Sales Tables

- Quotations
- QuotationItems
- SalesOrders
- Invoices
- InvoiceItems

### 7.4 Inventory Tables

- Products
- Warehouses
- StockTransactions

### 7.5 Finance Tables

- Payments
- Expenses
- Accounts

### 7.6 HR Tables

- Employees
- Attendance
- Leaves

### 7.7 Project Tables

- Jobs
- JobAssignments
- ServiceReports

*(All tables include TenantId for multi-tenancy support.)*

---

## 8. System Architecture Mapping

### 8.1 Architecture Overview

The ERP system will follow a modern 3-tier architecture with clear separation of concerns. This ensures scalability, security, and maintainability.

**Presentation Layer (Frontend):**
- Technology: React.js
- Purpose:
  - User interface for Admin, Manager, Staff, and Technicians
  - Dashboards, forms, reports, and workflows
  - Role-based UI rendering

**Application Layer (Backend / API):**
- Technology: ASP.NET Core Web API
- Purpose:
  - Business logic implementation
  - Authentication & authorization
  - Validation, workflows, and integrations

**Data Layer (Database):**
- Technology: PostgreSQL
- Purpose:
  - Centralized data storage
  - ACID-compliant transactional system
  - Supports reporting and analytics

### 8.2 High-Level Architecture Flow

```
User → React Frontend → ASP.NET Core API → PostgreSQL Database
```

**Optional Integrations:**
- WhatsApp API
- Email/SMS Gateway
- Google Maps API
- File Storage (Invoices, Reports, Documents)

### 8.3 Module-to-Architecture Mapping

#### Core System
- **React:** Dashboard UI, User Management Screens
- **API:** Role-based access, authentication, permissions
- **DB:** Users, Roles, Permissions tables

#### CRM Module
- **React:** Customer profiles, lead pipelines
- **API:** Lead lifecycle logic, follow-ups
- **DB:** Customers, Leads, FollowUps

#### Sales Module
- **React:** Quotations, invoices, sales orders
- **API:** Pricing logic, VAT calculation, status handling
- **DB:** Quotations, SalesOrders, Invoices, Payments

#### Purchase & Vendors
- **React:** Supplier management, purchase orders
- **API:** PO workflows, receiving tracking
- **DB:** Vendors, PurchaseOrders, StockReceipts

#### Inventory Management
- **React:** Stock dashboards, alerts
- **API:** Stock movement logic
- **DB:** Items, Warehouses, StockTransactions

#### Accounts & Finance
- **React:** Finance reports, expenses
- **API:** Ledger logic, receivable/payable calculations
- **DB:** Accounts, Expenses, Transactions

#### HR & Staff Management
- **React:** Employee profiles, attendance views
- **API:** Leave approvals, attendance rules
- **DB:** Employees, Attendance, Leaves

#### Project / Service Management
- **React:** Job scheduling, service reports
- **API:** Technician assignment, workflow control
- **DB:** Projects, Jobs, ServiceReports

#### Reports & Analytics
- **React:** Charts, filters, exports
- **API:** Aggregation and reporting queries
- **DB:** Read-optimized queries and views

### 8.4 System Architecture Diagram (C4 – Container Level)

```
+-------------------+        HTTPS        +---------------------------+
|   Web Browser     | <----------------> |        React Frontend     |
| (User Interface)  |                    |  (Role-based UI, SPA)     |
+-------------------+                    +-------------+-------------+
                                                      |
                                                      | REST API (JSON)
                                                      v
                                     +-------------------------------+
                                     | ASP.NET Core Web API          |
                                     |-------------------------------|
                                     | Auth & RBAC (JWT)             |
                                     | Business Logic                |
                                     | ERP Modules APIs              |
                                     +---------------+---------------+
                                                     |
                                                     | ORM (EF Core)
                                                     v
                                     +-------------------------------+
                                     | PostgreSQL Database           |
                                     |-------------------------------|
                                     | Transactions                  |
                                     | Master Data                   |
                                     | Reports & Analytics           |
                                     +-------------------------------+
```

### 8.5 Security Architecture

- JWT-based authentication
- Role-Based Access Control (RBAC)
- HTTPS enforced
- Server-side validation in API
- Input validation and audit logging

### 8.6 Deployment Architecture

```
Users
  |
  v
React App (CDN / Web Server)
  |
ASP.NET Core API (Docker / Cloud VM)
  |
PostgreSQL (Managed DB / Cloud)
```

**Supports:**
- Multi-tenant SaaS
- Horizontal scaling
- Cloud platforms (Azure / AWS)

### 8.7 Scalability & Future Readiness

- Modular API design
- Multi-company & multi-branch support
- Mobile app support via same APIs
- Cloud deployment readiness

### 8.8 Architecture Benefits

- Clean separation of concerns
- Easy team collaboration
- High performance and scalability
- Enterprise-grade security

---

## 9. Assumptions and Dependencies

- Third-party APIs availability
- Compliance with UAE regulations

---

## 10. Approval

This document is subject to review and approval by stakeholders before development begins.

---

**End of IEEE SRS Document**

---

## License

See the [LICENSE](LICENSE) file for details.
