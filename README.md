# Data Governance Dashboard

An AI-powered data steward dashboard built on top of OpenMetadata. Surfaces governance issues across your data catalog and identifies cost-saving opportunities, all in two focused views.

---

## Setup

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Mac/Windows) or Docker Engine (Linux)
- Node.js 18+
- Git

### Steps

**1. Start OpenMetadata**

```bash
git clone https://github.com/open-metadata/OpenMetadata.git
cd OpenMetadata/docker/local-metadata
docker compose up -d
```

Wait 2–3 minutes for services to initialize, then open [http://localhost:8585](http://localhost:8585) and log in with `admin / admin`.

Verify sample tables are visible under **Explore → Tables** (you should see `dim_customer`, `fact_order`, `dim_product`, etc.).

If sample data isn't loaded:

```bash
docker compose --profile sample-data up -d
```

***Note: For development, I've used hosted instance rather than using the openmetadata, URL: https://sandbox.open-metadata.org, generated a token and used it in the development***

**2. Get an API token**

1. In OpenMetadata, go to **Settings → Bots → ingestion-bot**
2. Copy the token (starts with `eyJ...`)
3. Add it to your `.env` file (see below)

**3. Start the frontend**

```bash
cd /path/to/this-project
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000)

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_APP_AUTH_TOKEN=your_token_here
```

---

## Features

### Page 1 — AI Recommendations

Detects governance issues across all tables and suggests one-click fixes:

- **Missing owner** → suggests a team based on table name pattern
- **Missing or short description** → generates a draft from column names
- **Untagged PII columns** → detects `email`, `phone`, `ssn`, `address` columns without `PII.*` tags

Actions write back to OpenMetadata via `PATCH /api/v1/tables/{id}` — changes are reflected live after each apply.

Includes search by table name / FQN and filter by issue type (High severity / PII / No Owner / No Description).

### Page 2 — Cost Optimization

Groups tables into five usage tiers based on `usageSummary.weeklyStats.count`:

| Tier | Label | Share of tables |
|------|-------|----------------|
| T1 | Mission Critical | Top 10% |
| T2 | High Usage | Next 20% |
| T3 | Moderate | Next 30% |
| T4 | Low Usage | Next 25% |
| T5 | Dormant / Archive Candidates | Bottom 15% |

Costs are simulated using query count as a proxy (`$0.50/query/day + $0.10/GB storage`). Recommendations are sorted by `Impact × Confidence` score.

---

## Design Decisions

- **Client-side issue detection** — `detectIssues` and `generateRecommendations` run against table objects already fetched from OpenMetadata, keeping the API surface minimal and the UI snappy with no extra round trips.

- **Shared `TableContext`** — both pages consume the same context so the full table list is fetched once on load and shared across routes. `refresh()` re-fetches after any `PATCH` to keep state in sync with OpenMetadata.

- **Index-based PII patching** — the OpenMetadata JSON Patch API for column tags uses paths like `/columns/0/tags`. Column indices are resolved at patch time from the live table object so they reflect current server state.

- **Simulated costs** — real warehouse billing (Snowflake credits, BigQuery slots) is out of scope. The cost formula uses daily query count as a proportional proxy, which is enough to surface the right optimization priorities.

- **Session-only dismissals** — dismissed recommendations are held in local React state and reset on reload. Persisting them would require either a backend or a localStorage layer, which felt out of scope for a read-heavy governance tool.

---

## Tech Stack

- React + Vite
- Material UI (MUI)
- OpenMetadata(Hosted Instance) REST API