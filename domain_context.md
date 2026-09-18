# Domain Context & Ubiquitous Language

This document maps out the Domain-Driven Design (DDD) context for the Family Budget application, ensuring all technical and non-technical stakeholders share a common vocabulary and structural understanding.

## 1. Ubiquitous Language

| Term | Definition |
| :--- | :--- |
| **Family / Household** | The primary tenant in the system. A logical grouping of Users who share a financial context. |
| **Member** | A registered User who belongs to a Family. Members have roles (Admin, Contributor). |
| **Category** | A classification for expenses (e.g., "Groceries"). Belongs to a Family. |
| **Budget Cycle** | A defined time period (usually a calendar month) where financial limits apply. |
| **Budget Limit** | The maximum intended spend for a specific Category within a Budget Cycle. |
| **Expense / Transaction** | A record of money spent. Must be tied to a Category, a Member (logger), and a Date. |

## 2. Bounded Contexts

For this application, the entire system fits neatly into a **Core Financial Collaboration Context**. However, logically, it can be subdivided into:
1. **Identity & Access Context:** User registration, Family creation, Invitations, Roles.
2. **Budgeting Context:** Category definitions, monthly limits, progress calculations.
3. **Ledger/Expense Context:** Recording individual transactions, calculating totals.

## 3. Entities & Aggregates

### Aggregate Root: `Family`
The `Family` acts as the primary aggregate root. To ensure strict data isolation (multi-tenancy at the family level), almost all other entities belong to a `Family`.

- **Entity: `User`** (Global, but mapped to a Family via a `FamilyMember` association).
- **Entity: `Category`**
  - Attributes: `ID`, `FamilyID`, `Name`, `Icon`, `Color`, `IsActive`.
- **Entity: `Budget`**
  - Attributes: `ID`, `FamilyID`, `CategoryID`, `Month`, `Year`, `AmountLimit`.
- **Entity: `Expense`**
  - Attributes: `ID`, `FamilyID`, `CategoryID`, `MemberID` (who spent it), `Amount`, `Date`, `Note`.

### Value Objects
- **Money / Currency:** Represents amounts. Should strictly handle decimal precision to avoid floating-point errors (e.g., store in cents as integers, or use a precise Decimal type).
- **DateRange:** Represents the start and end of a Budget Cycle.

## 4. Domain Rules & Invariants
- An `Expense` cannot be created without a valid, active `Category`.
- A `User` can only view or modify data linked to their current `Family`.
- Deleting a `Category` should not delete historical `Expenses`. Instead, the Category should be marked as `Archived` or `Inactive` to preserve historical integrity.
- Only an `Admin` can alter `Budget Limits`.
