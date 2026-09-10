# User Stories

This document outlines the agile user stories required to build the MVP. They are organized by Epic and follow the standard format: *As a [type of user], I want to [an action] so that [a benefit/value].*

## Epic 1: Onboarding & Family Management
- **US 1.1:** As a new user, I want to create an account using my email or Google account so that I can securely access the application.
  - *Acceptance Criteria:* User can sign up, log in, and log out. Password reset flow works.
- **US 1.2:** As a new user, I want to create a "Family" profile during onboarding so that I can establish a shared workspace for my household.
- **US 1.3:** As a Family Admin, I want to generate an invite link or send an email invitation to my partner/family members so that they can join my workspace.
- **US 1.4:** As an invited user, I want to click an invite link and create an account that automatically links me to the existing Family workspace.

## Epic 2: Category Management
- **US 2.1:** As a Family Admin, I want to see a default list of common expense categories so that I don't have to set up everything from scratch.
- **US 2.2:** As a Family Admin, I want to create a custom category (e.g., "Dog's Vet Bills") with a specific color/icon so that we can track expenses unique to our household.
- **US 2.3:** As a Family Admin, I want to archive a category we no longer use, so it stops showing up in the expense entry form without deleting historical data.

## Epic 3: Budgeting
- **US 3.1:** As a Family Admin, I want to set a monthly spending limit for specific categories (e.g., $500 for Groceries) so that we have a financial goal to stick to.
- **US 3.2:** As a user, I want to view a monthly summary that compares our total spending per category against the set limits.
  - *Acceptance Criteria:* Visual indicator (e.g., green/yellow/red progress bar). Should correctly handle months where no limit is set (uncapped).
- **US 3.3:** As a user, I want to easily toggle between previous months and the current month so I can review past financial performance.

## Epic 4: Expense Tracking
- **US 4.1:** As a user, I want to quickly input an expense with an amount, category, and date so that the transaction is recorded.
- **US 4.2:** As a user, I want to add optional notes to an expense (e.g., "Dinner at Joe's") so that we remember what the transaction was for.
- **US 4.3:** As a user, I want to view a chronological feed of all household expenses, showing who logged them and when.
- **US 4.4:** As a user who made a mistake, I want to edit or delete an expense I recently created.

## Epic 5: Dashboard & Insights
- **US 5.1:** As a user, I want a high-level dashboard showing "Total Budgeted", "Total Spent", and "Remaining Balance" for the current month.
- **US 5.2:** As a user, I want to see a pie chart of my current month's expenses grouped by category so I can quickly identify where most of our money is going.
