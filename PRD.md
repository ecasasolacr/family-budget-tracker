# Product Requirements Document (PRD): Family Budget Web App

## 1. Product Overview
The Family Budget Web App is a collaborative, real-time financial tracking tool designed specifically for households. Unlike single-user financial tools, this application is built around the "Family" as the core unit, allowing multiple household members to track expenses, set monthly goals, and monitor financial health transparently.

## 2. Target Audience
- Families and households sharing financial responsibilities.
- Couples looking to track joint expenses.
- Roommates seeking a transparent way to manage shared household costs.

## 3. Core Objectives
- **Visibility:** Provide a real-time, unified view of household spending.
- **Collaboration:** Lower the friction for any family member to log expenses.
- **Control:** Allow users to set and monitor monthly budgets by custom categories.

## 4. Key Features & Requirements

### 4.1. Authentication & User Management
- Users must be able to sign up using email/password or social login (Google/Apple).
- A user can create a "Family" (acting as the Administrator).
- Administrators can invite other members via email links or invite codes.
- Role-Based Access Control (RBAC):
  - **Admin:** Can invite/remove users, edit budget limits, manage categories, and delete the family unit.
  - **Member:** Can log expenses, view budgets, and view categories.
  - **Child/View-Only (Optional v2):** Can only log expenses against a specific allowance category, or only view data.

### 4.2. Category Management
- System should provide default categories (Housing, Groceries, Utilities, Entertainment, Transport).
- Admins can create, edit, disable, or delete custom categories.
- Categories can optionally have icons and color codes for visual distinction.

### 4.3. Budgeting
- Admins can set a monthly financial limit per category.
- Budgets operate on a calendar month basis.
- Rollover budgeting (optional setting): Unused budget from the previous month rolls into the next.
- Visual indicators (e.g., progress bars) showing Amount Spent vs. Budgeted Amount.

### 4.4. Expense Tracking
- Any member can register an expense.
- Required fields for an expense: Amount, Category, Date.
- Optional fields: Note/Description, Payer (which member paid), Receipt Image.
- Support for recurring expenses (e.g., Netflix subscription, Rent).

### 4.5. Reporting & Dashboard
- Dashboard showing current month's remaining budget.
- Breakdown of expenses by category (Pie chart/Bar chart).
- Recent transactions feed identifying who logged what.

## 5. Out of Scope (for MVP)
- Bank account syncing / Plaid integration (manual entry only for MVP to ensure rapid deployment).
- Complex investment tracking.
- Split-bill calculations (e.g., "User A owes User B $20").

## 6. Success Metrics
- **Activation Rate:** % of created families that invite at least one other member.
- **Engagement:** Average number of expenses logged per family per week.
- **Retention:** % of families actively setting budgets in month 2 and month 3.
