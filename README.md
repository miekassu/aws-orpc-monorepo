# oRPC AWS Lambda Monorepo Experiment

> **Experimental** contract-first API development with oRPC, AWS Lambda, and React

This monorepo demonstrates oRPC's contract-first approach for building type-safe APIs with AWS Lambda deployment and React frontend integration.

## Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React Web     │◄──►│  AWS Lambda      │◄──►│  Service Core   │
│   (Frontend)    │    │  (Infrastructure)│    │  (Business)     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │                       │
         ▼                        ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ @orpc/tanstack- │    │   RPC Handler    │    │   Procedures    │
│     query       │    │   AWS Adapter    │    │   & Routers     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                                               │
         └───────────────────┬───────────────────────────┘
                             ▼
                   ┌─────────────────┐
                   │ Shared Contracts│
                   │   (Schema)      │
                   └─────────────────┘
```

## Apps and Packages

### Applications (`/apps`)

- **`web`** - React + Vite frontend with oRPC integration
  - Uses `@orpc/tanstack-query` for API calls
  - Demonstrates full CRUD operations with "posts"

- **`infra/lambda`** - AWS Lambda with CDK deployment
  - Response streaming support for oRPC

### Packages (`/packages`)

- **`shared-contracts`** - oRPC contract definitions
  - Zod schema validation
  - Type-safe API contracts
  - Single source of truth for API structure

- **`service-core`** - Business logic and procedures
  - Decoupled from infrastructure concerns
  - Reusable across different deployment targets
  - Dependency injection pattern

- **`@repo/eslint-config`** - Shared ESLint configuration
- **`@repo/typescript-config`** - Shared TypeScript configuration

## Future Enhancement Possibilities

### Infrastructure

- [ ] **Database Integration**: Replace in-memory store with RDS/DynamoDB
- [ ] **Authentication**: JWT/OAuth integration with auth middleware
- [ ] **API Gateway**: Custom domain and rate limiting

### Features

- [ ] **Real-time Updates**: WebSocket support for live data
- [ ] **File Uploads**: S3 integration for media handling

### Developer Experience

- [ ] **OpenAPI Generation**: Auto-generate REST docs from contracts

## Tech Stack

- **Frontend**: React + Vite + TanStack Query
- **Backend**: oRPC + AWS Lambda + Node.js
- **Schema**: Zod validation
- **Deployment**: AWS CDK + Lambda with streaming
- **Monorepo**: Turborepo + pnpm workspaces
- **TypeScript**: End-to-end type safety

---

_This is an experimental project exploring oRPC's capabilities in a serverless monorepo architecture._
