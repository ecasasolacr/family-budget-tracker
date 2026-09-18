# Architecture & Technical Decisions

This document outlines the high-level architecture and technical stack for the Family Budget application.

## 1. System Architecture Diagram

```mermaid
graph TD
    Client[Web Browser / PWA] -->|HTTPS| NextJS[Next.js App Router]
    
    subgraph Frontend / Server-Side Rendering
        NextJS -->|React Server Components| SupabaseClient[Supabase JS Client]
        NextJS -->|Server Actions| SupabaseClient
    end
    
    subgraph Backend Services
        SupabaseClient -->|PostgREST API| Postgres[(PostgreSQL DB)]
        SupabaseClient -->|GoTrue API| Auth[Supabase Auth]
    end

    %% RLS Enforcement
    Postgres -.->|Row Level Security| SecurityGate{Family ID Check}
    SecurityGate -.->|Isolates Data| Postgres

    %% Styling
    classDef default fill:#f9f9f9,stroke:#333,stroke-width:2px;
    classDef primary fill:#e0f2fe,stroke:#0284c7,stroke-width:2px;
    classDef database fill:#dcfce7,stroke:#16a34a,stroke-width:2px;
    classDef security fill:#fee2e2,stroke:#dc2626,stroke-width:2px;

    class NextJS primary;
    class Postgres database;
    class SecurityGate security;
    
    %% Thicker lines for visibility
    linkStyle default stroke-width:3px;
```

## 2. Tech Stack Recommendations

### Frontend Structure & Architecture


- **Framework:** Next.js (React). Provides excellent performance, routing (App Router), and component reusability.
- **State Management:** React Query (for server state and caching) + Zustand (for local UI state).
- **Styling:** Tailwind CSS + **shadcn/ui** for highly customizable, accessible, and beautifully designed components.
- **PWA (Progressive Web App):** Configure service workers so users can install the app on their phone home screen for quick expense entry.

### Backend & Database (Supabase + MCP)
- **Primary Datastore:** Supabase (PostgreSQL). Excellent relational integrity, which is crucial for financial data.
- **Authentication:** Supabase Auth. Offloads the security and complexity of password resets, 2FA, and social logins.
- **AI Integration (MCP):** The development workflow will utilize the official **Supabase Model Context Protocol (MCP) server**. This bridges the gap between AI tools (like Cursor or Claude) and the Supabase project, enabling natural language commands and agent-like experiences for database management.

## 3. Data Model (Relational Schema Draft)

- `users` (id, email, name, created_at)
- `families` (id, name, created_at)
- `family_members` (user_id, family_id, role, joined_at)
- `categories` (id, family_id, name, icon, is_active)
- `budgets` (id, category_id, family_id, month, year, amount_limit)
- `expenses` (id, family_id, category_id, user_id, amount, date, description)

## 4. Key Architectural Decisions
- **Multi-Tenancy Strategy:** We will leverage Supabase's powerful **Row-Level Security (RLS)** strictly isolating data using `family_id` on every core table to ensure data does not leak between families.
- **AI-Native Development Workflow:** By running the Supabase MCP server locally, AI assistants can autonomously inspect the schema, generate and execute SQL, author migrations, and debug RLS policies directly against a development database.
- **Security & Best Practices:** We will point the MCP server at a dedicated development/staging Supabase project rather than production to prevent accidental data modification by AI agents.
