---
trigger: always_on
---

# Antigravity Rules (Core Tenets & Constraints)

The "Antigravity Rules" are the non-negotiable principles that keep this project grounded, focused, and free from scope bloat. When facing a product or technical decision, refer to these rules.

## 1. Zero-Friction Data Entry
*If it takes more than 5 seconds to log an expense, we have failed.*
- **Implication:** The "Add Expense" button must be universally accessible from any screen. Defaults should be smart (default date to 'today', default user to 'self'). Avoid unnecessary required fields.

## 2. Mobile-First, Always
*Families manage money on the go, in the supermarket aisle, or at the restaurant table.*
- **Implication:** UI components must be touch-friendly. The application should behave like a Progressive Web App (PWA) with large tap targets and responsive layouts. Desktop is secondary.

## 3. Strict Multi-Tenancy (The "Vegas Rule")
*What happens in a Family, stays in that Family.*
- **Implication:** A user from Family A must never, under any circumstances, be able to query, guess via API, or view data from Family B. Every backend query MUST inherently scope by `family_id`. 

## 4. Blame-Free Transparency
*The app is a tool for awareness, not a weapon for arguments.*
- **Implication:** Design the UI to highlight progress and teamwork rather than punitive warnings. Use encouraging language. Avoid harsh red error states for going slightly over budget; use softer alerts (e.g., amber).

## 5. Simplicity Over Complex Accounting
*We are building a budget tracker for normal people, not an ERP for accountants.*
- **Implication:** No double-entry bookkeeping. No complex asset depreciation. No split-ledger reconciliation. Money goes out = Expense. Keep the domain model simple and understandable.

## 6. Offline Tolerance (Opt-in)
*Supermarkets often have terrible cell reception.*
- **Implication:** The app should handle brief periods of lost connectivity gracefully. Caching recent dashboard data and allowing the UI to remain responsive is critical. 
