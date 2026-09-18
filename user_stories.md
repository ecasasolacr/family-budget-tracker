# Family Budget App: User Stories & Status Tracker

This document serves as the master list of user stories for the Family Budget Web App. It is intended to be a living document; as features are implemented, their status should be updated here.

## Legend
- 🔴 **Not Started**
- 🟡 **In Progress**
- 🟢 **Completed**

---

## 1. Authentication & Family Management

| ID | As a... | I want to... | So that I can... | Status |
| :--- | :--- | :--- | :--- | :--- |
| **US 1.1** | New User | Create an account using my email and password | Access the application securely. | 🟢 **Completed** |
| **US 1.2** | User | Create a new "Family" during onboarding | Establish a shared financial workspace. | 🟢 **Completed** |
| **US 1.3** | Admin | Generate an invite code or link | Share it with my partner/roommates to join my family. | 🟢 **Completed** |
| **US 1.4** | New User | Enter an invite code during sign-up/onboarding | Join an existing family's workspace immediately. | 🟢 **Completed** |
| **US 1.5** | Admin | View a list of current family members | See who has access to the household budget. | 🔴 **Not Started** |
| **US 1.6** | Admin | Remove a family member | Revoke access for someone who no longer shares finances. | 🔴 **Not Started** |

---

## 2. Category Management

| ID | As a... | I want to... | So that I can... | Status |
| :--- | :--- | :--- | :--- | :--- |
| **US 2.1** | Family Member | See a list of default expense categories (e.g., Housing, Groceries) | Quickly categorize my spending without setup. | 🟢 **Completed** |
| **US 2.2** | Admin | Create a custom category with a name and color/icon | Track expenses specific to our family's lifestyle. | 🟢 **Completed** |
| **US 2.3** | Admin | Edit an existing category's name or icon | Fix mistakes or update our tracking preferences. | 🟢 **Completed** |
| **US 2.4** | Admin | Deactivate/Hide a category | Stop using it for new expenses without deleting historical data. | 🟢 **Completed** |

---

## 3. Budgeting

| ID | As a... | I want to... | So that I can... | Status |
| :--- | :--- | :--- | :--- | :--- |
| **US 3.1** | Admin | Set a monthly spending limit for a specific category | Control our household spending in that area. | 🟢 **Completed** |
| **US 3.2** | Family Member | View a visual progress bar of spending vs. budget per category | Quickly see if we are approaching our limits. | 🔴 **Not Started** |
| **US 3.3** | Admin | Edit the budget limit for the current month | Adjust to unexpected financial changes. | 🟢 **Completed** |
| **US 3.4** | Family Member | Receive a visual warning (e.g., amber color) when nearing a budget limit | Slow down spending before going over budget. | 🔴 **Not Started** |

---

## 4. Expense Tracking

| ID | As a... | I want to... | So that I can... | Status |
| :--- | :--- | :--- | :--- | :--- |
| **US 4.1** | Family Member | Add a new expense (Amount, Category, Date) | Keep the family ledger up to date. | 🟢 **Completed** |
| **US 4.2** | Family Member | Add an optional note to an expense | Remember specifically what the money was spent on. | 🟢 **Completed** |
| **US 4.3** | Family Member | View a chronological feed of recent expenses | See exactly where our money has gone recently. | 🟢 **Completed** |
| **US 4.4** | Family Member | Edit or delete an expense I created | Correct mistakes in my data entry. | 🟢 **Completed** |
| **US 4.5** | Admin | Edit or delete ANY expense | Correct mistakes made by other family members. | 🟢 **Completed** (Handled via RLS policies) |

---

## 5. Dashboard & Reporting

| ID | As a... | I want to... | So that I can... | Status |
| :--- | :--- | :--- | :--- | :--- |
| **US 5.1** | Family Member | See the total amount spent this current month | Know our overall financial footprint at a glance. | 🟢 **Completed** |
| **US 5.2** | Family Member | See the total remaining budget across all categories | Know how much discretionary money is left. | 🟢 **Completed** |
| **US 5.3** | Family Member | View a pie chart/breakdown of spending by category | Identify which areas consume the most money. | 🟢 **Completed** |
| **US 5.4** | Family Member | Filter the dashboard view by previous months | Compare current spending habits with past performance. | 🟢 **Completed** |
