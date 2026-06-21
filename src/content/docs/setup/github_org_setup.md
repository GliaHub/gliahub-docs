# GitHub Organization Setup

## Recommended repositories

### 1. `gliahub`
Main monorepo.

Suggested structure:

```text
gliahub/
  apps/
    web/
    api/
  runner/
  packages/
    schemas/
    ui/
  plugins/
    eeg-core/
    reports/
  infra/
    docker-compose/
  docs-internal/
```

### 2. `gliahub-rfcs`
Architecture decisions.

Suggested structure:

```text
rfcs/
  0001-organization-workspace-model.md
  0002-dataset-snapshot-model.md
  0003-workflow-specification.md
  0004-product-native-versioning.md
  0005-execution-backend.md
  0006-plugin-manifest.md
  0007-provenance-model.md
  0008-open-source-boundary.md
```

### 3. `gliahub-docs`
Public documentation.

Suggested sections:

```text
getting-started/
architecture/
workflow-editor/
datasets/
plugins/
runner/
deployment/
tutorials/
```

### 4. `gliahub-examples`
Examples and templates.

Suggested structure:

```text
eeg-basic-preprocessing/
bids-validation/
report-generation/
custom-node-example/
moabb-benchmark/
```

## GitHub Projects setup

Use GitHub Projects first. Jira is unnecessary at the current team size.

Columns:

```text
Backlog
Ready
Sprint
In Progress
Review
Done
```

Custom fields:

```text
Phase
Sprint
Role
Priority
Type
Status
Risk
```

Issue types:

```text
Epic
Feature
Task
Bug
Research
Decision
RFC
```

Labels:

```text
backend
frontend
runner
neuroai
business
infra
docs
security
marketplace
core-facility
mvp
pilot
lab-product
enterprise
```

Milestones:

```text
MVP Core
Pilot Release
Extensibility & Community
Lab Product + Core Facility
Marketplace & Scale
Hosted / Enterprise
```

## Rule of thumb

- Use issues for work.
- Use RFCs for decisions.
- Use discussions for open community questions.
- Use docs for stable user-facing knowledge.
