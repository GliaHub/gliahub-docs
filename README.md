# Gliahub Documentation Pack v2

This pack rebuilds the planning documents from scratch around the latest decisions:

- Workflow-editor-first product direction, not SDK-first.
- Go control plane, PostgreSQL source of truth, MinIO/S3 object storage, Docker SDK runner for MVP.
- DB-backed queue in MVP; NATS JetStream later for runner pools and event fanout.
- Product-native versioning: dataset snapshots, workflow versions, execution runs, artifacts, reports, provenance events.
- Local-first and anti-lock-in: JSON workflow exports, Python code export, open workflow/plugin specs, open runner/SDK direction.
- Clear distinction between MVP roadmap and long-term company roadmap.
- Core facility track added before late enterprise phase.
- Runner security evolution explicitly separated from scaling evolution.
- Research-tool boundary: no clinical diagnosis or clinical decision support in the current product scope.

## Repository recommendation

Start with four repositories:

1. `gliahub` — main monorepo: web, API, runner, schemas, infra.
2. `gliahub-rfcs` — architectural decisions and product contracts.
3. `gliahub-docs` — public docs, tutorials, architecture notes.
4. `gliahub-examples` — example workflows, sample plugins, demo datasets.

Avoid splitting plugins into many repositories early. Keep official plugins inside the main monorepo until the plugin ecosystem is mature.

## Roadmap principle

Every sprint must end with either a demonstrable product capability, a reproducibility capability, a pilot-learning outcome, or a security/business decision that unlocks the next phase.

No sprint should be pure invisible infrastructure unless it is tied to a visible product outcome.
