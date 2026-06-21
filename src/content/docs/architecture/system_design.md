---
title: Gliahub System Design
description: Detailed system architecture and design specifications for Gliahub.
---

## 1. Product thesis

Gliahub is not another EEG/MEG analysis library. It is a reproducible neuroscience workflow repository and execution layer built above existing scientific tools such as MNE-Python, EEGLAB, Brainstorm, BIDS, MOABB, Braindecode, and Nilearn.

The platform should orchestrate existing scientific tools rather than replace them.

## 2. Core objects

The system is built around the following first-class objects:

```text
User
Organization
Workspace
Project
Dataset
Dataset Snapshot
Workflow Draft
Workflow Version
Execution Run
Run Node
Artifact
Report
Plugin Package
Plugin Version
Provenance Event
Audit Event
```

The most important reproducibility chain is:

```text
dataset snapshot
    +
workflow version
    +
plugin/runtime version
    +
execution parameters
    =
execution run -> artifacts -> report -> provenance
```

## 3. MVP architecture

```text
Next.js / React Flow UI
        ↓
Go Control Plane API
        ↓
PostgreSQL
(metadata, permissions, workflow versions, run state, provenance)
        ↓
DB-backed jobs table for MVP
        ↓
Go Runner Daemon
        ↓
Docker SDK / scientific Python containers
        ↓
MinIO / S3-compatible object storage
(raw data, derived artifacts, reports, logs)
```

NATS JetStream is not required for MVP. It enters when runner pools, distributed workers, dead-letter queues, retries, and event fanout are actually needed.

## 4. Control plane responsibilities

The Go control plane owns authentication and workspace ownership, organization/workspace/project APIs, workflow draft and version APIs, dataset snapshot metadata, run lifecycle state, entitlement checks, provenance and audit events, object storage presigned URL generation, and runner job dispatch.

The Go API should not execute scientific code directly.

## 5. Runner responsibilities

The Go runner claims jobs, prepares per-run working directories, downloads/stages inputs, launches Docker/containerd execution containers, streams logs, enforces timeout/resource limits, collects outputs, uploads artifacts, updates run status, and emits provenance events.

## 6. Execution model

MVP execution is workflow-container-based:

```text
one workflow run -> one scientific container -> multiple logical nodes
```

Each logical node still produces run-node events, artifacts, and provenance.

Later execution can become hybrid:

```text
inprocess_python
containerized_node
external_runtime
argo_backend
nextflow_or_hpc_backend
```

## 7. Versioning model

Do not use raw Git as the product versioning system.

Use product-native immutable snapshots:

```text
workflow draft = mutable editing state
workflow version = immutable graph snapshot
dataset snapshot = immutable object manifest
execution run = immutable execution record
```

Git can still be used for exporting workflows, mirroring code, custom plugin development, and external collaboration.

User-facing versioning should feel Kaggle-like:

```text
save version
view diff
restore
fork
run history
```

Not:

```text
branch
rebase
merge conflict
git-lfs debugging
```

## 8. Object storage model

Raw data and artifacts must not pass through the Go API.

Correct ingest flow:

```text
client/CLI
  -> presigned multipart upload
  -> MinIO/S3
  -> finalize metadata in Go API
  -> ingest/validation job
  -> dataset snapshot
```

For heavy compute, object storage remains the source of truth, while runner-local disk/NVMe cache is used as a working copy.

## 9. Plugin model

Canonical plugin and workflow specs should be JSON-based.

Recommended layers:

- Internal canonical format: JSON
- Validation: JSON Schema
- Human-editable optional format: YAML
- Developer authoring: Python SDK/decorators
- XML: only for legacy import/export adapters when required

Plugin package types:

- official domain packs,
- workspace-local custom plugins,
- verified community plugins,
- public community plugins.

## 10. Marketplace model

Marketplace is a long-term product layer, not the MVP revenue engine.

MVP foundations:

- plugin manifest,
- static EEG core plugin pack,
- locked/unlocked entitlement mock,
- JSON schema driven node parameters,
- backend run-time entitlement validation.

Later marketplace:

- plugin listings,
- verified/community labels,
- billing gates,
- plugin review CI,
- container/image scanning,
- revenue sharing.

## 11. Open-source boundary

Recommended open-source boundary:

Open source:

- workflow specification,
- plugin manifest schema,
- Python SDK,
- node SDK,
- CLI tools,
- local runner,
- basic official EEG nodes,
- export format.

Commercial/source-available:

- hosted control plane,
- billing,
- marketplace backend,
- enterprise SSO,
- advanced audit/admin features,
- hosted execution.

Always exportable:

- workflows,
- dataset manifests,
- reports,
- execution metadata,
- reproducibility bundles.

Positioning message:

> Even if Gliahub disappears tomorrow, your workflows should still run.

## 12. Runner security evolution

MVP/local:

- Docker SDK runner,
- non-root user,
- read-only root filesystem,
- no-new-privileges,
- CPU/memory/time limits,
- default no-network,
- restricted mounts,
- per-run scoped work directories.

Pilot/lab:

- isolated runner host or VM,
- no Docker socket inside user containers,
- image digest pinning,
- runner-local cache policy,
- audit logs.

Core facility/hosted:

- evaluate containerd,
- rootless execution,
- gVisor,
- Firecracker.

Enterprise/hosted scale:

- Kubernetes Jobs or Argo Workflows backend adapter,
- stronger scheduling and isolation,
- policy-based execution profiles.

Important framing: Kubernetes/Argo is not only a scaling decision. For this product, it may become a security and institutional compliance decision.

## 13. Regulatory boundary

Gliahub is currently a research workflow and reproducibility platform.

It produces research outputs, reproducibility reports, workflow metadata, analysis artifacts, and audit/provenance trails.

It does not provide clinical diagnosis, medical decision recommendations, or regulated clinical reporting.

Any hospital/clinical workflow requires later regulatory review and product-boundary decisions.
