---
title: Gliahub Sprints Roadmap
description: Comprehensive Scrum sprints roadmap for Gliahub.
---

This roadmap is structured as 2-week Scrum sprints for a 4-person team.

## Team

- Backend Developer 1: Go control plane, PostgreSQL, API, auth, versioning.
- Backend Developer 2: runner, object storage, infra, Docker/containerd, Next.js support.
- NeuroAI Developer: BIDS/NWB semantics, MNE runtime, scientific node contracts, reports, Python SDK.
- Business Developer: user research, GTM, pricing, core facility motion, grant/compliance positioning.

## Roadmap scale

- Sprints 1–8: MVP Core
- Sprints 9–12: Pilot Release
- Sprints 13–18: Extensibility & Community
- Sprints 19–24: Lab Product + Core Facility Track
- Sprints 25–30: Marketplace & Scale
- Sprints 31–42: Hosted, Enterprise, and Platform Maturity


## Phase — MVP Core


### Sprint 1 — Core Execution Loop and Ownership Skeleton

**Sprint goal:** A user triggers a containerized MNE header-read job from a minimal dashboard and sees live logs.

**Backend tasks**
- users/orgs/workspaces/projects/runs/jobs schema; ownership fields; Go API /runs; DB-backed queue; Docker SDK runner; minimal log UI.

**NeuroAI tasks**
- MNE header-read container; base EEG metadata schemas.

**Business tasks**
- Persona matrix; NIH DMS positioning.

**Demo outcome**
- Click Run → container executes → logs stream → run completes.

**Acceptance criteria**
- Run state transitions persist; ownership fields exist; stdout captured.

**Risks/dependencies**
- Docker socket permissions; avoid dashboard scope creep.


### Sprint 2 — Visual Workflow Editor and Basic Auth

**Sprint goal:** A logged-in user creates a workspace/project and saves a React Flow workflow draft.

**Backend tasks**
- JWT/session auth; workspace membership; workflow draft APIs; store graph JSONB.

**NeuroAI tasks**
- Schemas for EDF ingest, bandpass, report; parameter bounds.

**Business tasks**
- Pricing assumptions; first workflow-handoff interviews.

**Demo outcome**
- Login → draw load/filter/report DAG → save → reload.

**Acceptance criteria**
- Draft persists; DAG validation blocks cycles; ownership boundary exists.

**Risks/dependencies**
- React Flow integration; keep auth simple.


### Sprint 3 — Workflow Versioning and Provenance Event Loop

**Sprint goal:** A draft can be frozen into immutable workflow version; runs emit lightweight provenance events.

**Backend tasks**
- workflow_versions; membership checks; provenance event table; runs reference workflow_version.

**NeuroAI tasks**
- Node version metadata; runtime metadata fields.

**Business tasks**
- Anti-lock-in narrative; “why not notebooks?” positioning.

**Demo outcome**
- Save v1/v2 → run v2 → inspect events.

**Acceptance criteria**
- Versions immutable; run references version; events emitted.

**Risks/dependencies**
- Versioning should not slow editor flow.


### Sprint 4 — Object Storage, Dataset Snapshots, and Code Export

**Sprint goal:** User uploads directly to MinIO/S3, creates snapshot, exports workflow as Python.

**Backend tasks**
- MinIO compose; presigned multipart endpoints; dataset object manifests; dataset_snapshots; code export endpoint.

**NeuroAI tasks**
- MNE code templates for load/filter/export.

**Business tasks**
- Grant Facilities & Resources text.

**Demo outcome**
- Upload via presigned URL → finalize dataset → export script.

**Acceptance criteria**
- API never buffers raw files; snapshot contains paths/hashes; script runs locally.

**Risks/dependencies**
- Multipart complexity; export/runtime drift.


### Sprint 5 — Real MNE Scientific Execution

**Sprint goal:** A visual workflow filters a real EDF/FIF file in Docker and saves output artifacts.

**Backend tasks**
- Stage inputs; scoped mounts; run scientific image; upload artifacts; run-node states.

**NeuroAI tasks**
- MNE runtime image; load/notch/bandpass/export wrappers; validate outputs.

**Business tasks**
- MATLAB/EEGLAB migration worksheet.

**Demo outcome**
- Upload EEG → run workflow → download processed output.

**Acceptance criteria**
- Valid artifact in MinIO; cleanup works; no full workspace mount.

**Risks/dependencies**
- Large-file memory; container permissions.


### Sprint 6 — BIDS Validation and Basic Workflow Diff

**Sprint goal:** BIDS datasets validate and workflow version parameters can be compared.

**Backend tasks**
- BIDS lifecycle; validator worker; metadata indexing; parameter diff.

**NeuroAI tasks**
- Extract BIDS entities; EEG BIDS compatibility.

**Business tasks**
- Domain-pack monetization assumptions; PI interviews on paper revision diffs.

**Demo outcome**
- Upload BIDS zip → validate → compare v1/v2 params.

**Acceptance criteria**
- Critical errors block runs; diff works; metadata shown.

**Risks/dependencies**
- Zip timeouts; validator edge cases.


### Sprint 7 — Publication-Ready Reports and Templates

**Sprint goal:** Runs generate self-contained report with QC, methods, citation, artifact manifest.

**Backend tasks**
- Report renderer; report artifact storage; report/run/provenance links.

**NeuroAI tasks**
- PSD plots; QC summary; methods templates; citation block.

**Business tasks**
- Validate report with academics; handoff-ready messaging.

**Demo outcome**
- Run → report.html with figures, methods, citations, manifest.

**Acceptance criteria**
- Offline report; report links to workflow/dataset/run.

**Risks/dependencies**
- Report must feel credible.


### Sprint 8 — MVP Compose Release and Version History UI

**Sprint goal:** The whole MVP boots locally with version history, run history, artifacts, reports.

**Backend tasks**
- Docker compose; version history UI/API; run history; artifact list; provenance view.

**NeuroAI tasks**
- Golden EEG workflow; sample data; reproducibility validation.

**Business tasks**
- Beta launch kit; pilot onboarding checklist.

**Demo outcome**
- One command launch → golden workflow → version/run/report views.

**Acceptance criteria**
- Clean-machine local deployment works; golden run reliable.

**Risks/dependencies**
- OS/compose conflicts.


## Phase — Pilot Release


### Sprint 9 — Local Installer and Template Gallery

**Sprint goal:** New users install locally and clone predefined EEG templates.

**Backend tasks**
- Installer script; seed templates; clone endpoint; template metadata.

**NeuroAI tasks**
- Bandpass, ICA cleaning, PSD templates.

**Business tasks**
- Template descriptions; first pilot lab targets.

**Demo outcome**
- Install → clone template → run sample.

**Acceptance criteria**
- Templates preserve schema/edges/params.

**Risks/dependencies**
- Local port conflicts.


### Sprint 10 — Large Dataset CLI Uploader

**Sprint goal:** Large EEG/MEG datasets upload through CLI with presigned multipart upload.

**Backend tasks**
- Upload sessions; presigned URLs; completion API; snapshot registration.

**NeuroAI tasks**
- Large-file parsing tests; metadata extraction path.

**Business tasks**
- Large-data onboarding notes.

**Demo outcome**
- CLI uploads 10GB direct to object storage and UI registers snapshot.

**Acceptance criteria**
- No API buffering; resumable/restartable; snapshot finalized.

**Risks/dependencies**
- Network dropouts; test data.


### Sprint 11 — Pilot Onboarding and First Lab Migration

**Sprint goal:** Onboard 1–3 pilot labs and migrate one messy EEG pipeline into Gliahub.

**Backend tasks**
- Fix top blockers; improve errors; migration utilities; diagnostics.

**NeuroAI tasks**
- Translate real lab script; identify missing nodes; validate against original.

**Business tasks**
- Structured interviews; before/after story; willingness-to-pay.

**Demo outcome**
- Original script → Gliahub workflow → successful run/report → feedback summary.

**Acceptance criteria**
- One real workflow runs; blockers documented.

**Risks/dependencies**
- Scope drift; scientific mismatch.


### Sprint 12 — Visual Workflow Diff and Public Template Sharing

**Sprint goal:** Users visually compare workflow versions and publish/fork stable templates.

**Backend tasks**
- Visual diff model; publish/fork APIs; template search.

**NeuroAI tasks**
- Mark scientific parameter changes meaningful/minor; validation checklist.

**Business tasks**
- Validate paper-revision diff story; first public gallery.

**Demo outcome**
- Compare v1/v2 visually → publish → fork.

**Acceptance criteria**
- Diff shows changes; fork preserves schema; no private data leaks.

**Risks/dependencies**
- Public/private boundary.


## Phase — Extensibility & Community


### Sprint 13 — Plugin Author Documentation and Starter Repository

**Sprint goal:** External developers understand how to build a Gliahub node plugin.

**Backend tasks**
- Plugin registration draft; manifest validation endpoint; starter repo.

**NeuroAI tasks**
- Example custom EEG node; type docs; local test harness.

**Business tasks**
- Contributor guide and ecosystem positioning.

**Demo outcome**
- Clone starter → validate → load example node.

**Acceptance criteria**
- Starter works on clean machine; clear errors.

**Risks/dependencies**
- Docs must not assume internal knowledge.


### Sprint 14 — Python SDK Node Authoring Decorators

**Sprint goal:** Developers create nodes with Python decorators and generate manifests automatically.

**Backend tasks**
- Accept generated manifests; validate compatibility; local-only plugin install.

**NeuroAI tasks**
- @node decorator; type-hint schema inference; scientific I/O types.

**Business tasks**
- Identify first 5 plugin authors.

**Demo outcome**
- Write @node → generate manifest → node appears.

**Acceptance criteria**
- Generated JSON Schema valid; node can run locally.

**Risks/dependencies**
- Python type inference complexity.


### Sprint 15 — MOABB Benchmark Integration

**Sprint goal:** EEG benchmark workflows run through MOABB and produce comparison reports.

**Backend tasks**
- Benchmark run type; metrics storage.

**NeuroAI tasks**
- MOABB wrapper container; benchmark report templates.

**Business tasks**
- Benchmark story for credibility.

**Demo outcome**
- Run MOABB workflow → accuracy table and figures.

**Acceptance criteria**
- Standard outputs captured; report consistent.

**Risks/dependencies**
- Long compute time.


### Sprint 16 — Braindecode CPU Training Support

**Sprint goal:** CPU-only deep-learning nodes run using Braindecode.

**Backend tasks**
- Long-running logs; cancellation.

**NeuroAI tasks**
- Braindecode runtime; CPU training node; metric streaming.

**Business tasks**
- Validate DL demand.

**Demo outcome**
- Run training → stream progress metrics.

**Acceptance criteria**
- No GPU dependency; cancellation works.

**Risks/dependencies**
- Slow CPU training.


### Sprint 17 — Python SDK Client Release

**Sprint goal:** Users interact with Gliahub through Python client.

**Backend tasks**
- Stabilize API; token refresh.

**NeuroAI tasks**
- gliahub-sdk; list datasets, launch run, stream logs, download artifact.

**Business tasks**
- SDK announcement/docs.

**Demo outcome**
- Python console logs in and starts run.

**Acceptance criteria**
- SDK handles errors; examples work against compose.

**Risks/dependencies**
- API instability.


### Sprint 18 — Community Extension Templates and Verified Plugin Draft

**Sprint goal:** Community has examples, contribution rules, and initial plugin trust model.

**Backend tasks**
- official/community/verified fields; plugin manifest versioning; validation tests.

**NeuroAI tasks**
- Example MNE/MOABB wrappers; validation notes.

**Business tasks**
- Contribution guide; verification policy.

**Demo outcome**
- Contributor builds sample plugin and runs locally.

**Acceptance criteria**
- Examples usable; status model exists.

**Risks/dependencies**
- Marketplace expectations too early.


## Phase — Lab Product + Core Facility


### Sprint 19 — Private Workspaces and RBAC

**Sprint goal:** Labs collaborate privately with role-based access control.

**Backend tasks**
- Owner/Admin/Contributor/Viewer; permission enforcement; project membership.

**NeuroAI tasks**
- Permission-aware report visibility; raw vs report access needs.

**Business tasks**
- Lab Pro packaging and pricing test.

**Demo outcome**
- Viewer sees report but cannot edit/download raw data.

**Acceptance criteria**
- All endpoints enforce roles.

**Risks/dependencies**
- Permission leaks.


### Sprint 20 — Audit Logs and Facility Admin View

**Sprint goal:** Sensitive actions are recorded and admins review activity across projects.

**Backend tasks**
- Append-only audit; admin dashboard; log uploads/downloads/runs/members.

**NeuroAI tasks**
- Scientific audit events; analysis metadata context.

**Business tasks**
- Validate audit needs with PI/facility personas.

**Demo outcome**
- Admin sees who did what.

**Acceptance criteria**
- Immutable audit records; filters work.

**Risks/dependencies**
- Audit volume.


### Sprint 21 — Core Facility Multi-Lab Isolation

**Sprint goal:** A core facility manages multiple PI labs under one account without leakage.

**Backend tasks**
- Facility model; lab sub-workspaces; PI/lab isolation; facility admin role.

**NeuroAI tasks**
- Facility templates; shared vs private assets.

**Business tasks**
- Core facility pitch and pilot list.

**Demo outcome**
- Facility admin sees lab workspaces; Lab A cannot access Lab B.

**Acceptance criteria**
- Isolation tests pass.

**Risks/dependencies**
- Complex permissions.


### Sprint 22 — Core Facility Queue and Usage Reports

**Sprint goal:** Facilities see run queues and export recharge-style usage reports.

**Backend tasks**
- Queue dashboard; per-project usage; run/storage/report metrics.

**NeuroAI tasks**
- Workflow compute labels.

**Business tasks**
- Validate recharge report format.

**Demo outcome**
- Facility admin exports project usage CSV.

**Acceptance criteria**
- Usage reports separate labs; privacy preserved.

**Risks/dependencies**
- Attribution accuracy.


### Sprint 23 — Dataset Snapshot Diff and Report Handoff Bundle

**Sprint goal:** Users compare dataset snapshots and export reproducibility bundles.

**Backend tasks**
- Dataset manifest diff; bundle generator; include workflow, manifest, params, logs, report, provenance.

**NeuroAI tasks**
- Scientific metadata in bundle; re-run context validation.

**Business tasks**
- Validate handoff/paper revision scenarios.

**Demo outcome**
- Compare snapshots and download bundle.

**Acceptance criteria**
- Bundle contains re-run metadata; diff detects file changes.

**Risks/dependencies**
- Bundle size.


### Sprint 24 — Pilot Stability and Lab Pro Readiness

**Sprint goal:** Stabilize pilots and prepare paid Lab Pro conversations.

**Backend tasks**
- Fix blockers; monitoring; backup/restore notes.

**NeuroAI tasks**
- Validate outputs; improve default workflows.

**Business tasks**
- Pricing test; testimonials; support expectations.

**Demo outcome**
- Review pilot metrics and readiness checklist.

**Acceptance criteria**
- Pilot workflows reliable; paid criteria documented.

**Risks/dependencies**
- Scope creep.


## Phase — Marketplace & Scale


### Sprint 25 — Node Marketplace Listings

**Sprint goal:** Workspaces browse, install, and manage official/community plugins.

**Backend tasks**
- Marketplace tables; install APIs; search/filter.

**NeuroAI tasks**
- EEG-core metadata; compatibility notes.

**Business tasks**
- Marketplace packaging by domain.

**Demo outcome**
- Install plugin and see nodes in palette.

**Acceptance criteria**
- Installs recorded; status visible.

**Risks/dependencies**
- Dependency conflicts.


### Sprint 26 — Entitlement Gates and Plan Validation

**Sprint goal:** Paid domain packs are visible but execution-locked unless entitled.

**Backend tasks**
- Entitlement checks in control plane and runner path; plan matrix.

**NeuroAI tasks**
- Mark node packs by domain/compute profile.

**Business tasks**
- Pricing tests.

**Demo outcome**
- Locked CV node visible, run blocked.

**Acceptance criteria**
- Backend blocks unauthorized execution.

**Risks/dependencies**
- UI/API entitlement drift.


### Sprint 27 — Workspace-Local Private Plugins

**Sprint goal:** Labs install private plugins visible only to their workspace.

**Backend tasks**
- Private plugin namespace; manifest validation; workspace visibility.

**NeuroAI tasks**
- Private EEG preprocessing example.

**Business tasks**
- Position private plugins as paid value.

**Demo outcome**
- Upload private plugin and use it only in workspace.

**Acceptance criteria**
- Cross-org invisibility enforced.

**Risks/dependencies**
- Private code security review.


### Sprint 28 — Billing Events and Usage Metering

**Sprint goal:** Store execution/storage/plugin usage events for future billing.

**Backend tasks**
- Usage events; compute duration; storage bytes; plugin runs; billing mock.

**NeuroAI tasks**
- Classify compute-heavy runs.

**Business tasks**
- Test usage-based vs flat pricing.

**Demo outcome**
- Billing panel shows usage.

**Acceptance criteria**
- Async non-blocking collection; attributable usage.

**Risks/dependencies**
- Missing events.


### Sprint 29 — NATS JetStream Distributed Queue

**Sprint goal:** Move from DB queue to NATS for runner pools and event fanout.

**Backend tasks**
- NATS setup; publish jobs; consumer groups; leases; retries; DLQ; Postgres source of truth.

**NeuroAI tasks**
- Validate deterministic retries.

**Business tasks**
- Scale story for pilots/facilities.

**Demo outcome**
- 20 runs distributed across runners.

**Acceptance criteria**
- Duplicate messages safe; heartbeat/leases work.

**Risks/dependencies**
- Idempotency.


### Sprint 30 — Resource-Aware GPU Scheduling

**Sprint goal:** Runner pool routes jobs based on CPU/GPU labels and resource hints.

**Backend tasks**
- Runner labels/heartbeat; matching; CUDA profile; GPU queue.

**NeuroAI tasks**
- GPU training node; resource hints.

**Business tasks**
- Hosted GPU pricing evaluation.

**Demo outcome**
- GPU job routes to GPU runner.

**Acceptance criteria**
- Jobs wait for matching runner.

**Risks/dependencies**
- Driver mismatch; starvation.


## Phase — Hosted / Enterprise


### Sprint 31 — Hardened Container Execution

**Sprint goal:** Strengthen sandboxing for untrusted custom plugins.

**Backend tasks**
- Evaluate gVisor/rootless/containerd/Firecracker; execution profiles; no Docker socket exposure.

**NeuroAI tasks**
- Benchmark overhead.

**Business tasks**
- Security questionnaire answers.

**Demo outcome**
- Malicious test plugin blocked.

**Acceptance criteria**
- Hardened profile for community plugins.

**Risks/dependencies**
- Performance overhead.


### Sprint 32 — Hosted Control Plane Beta

**Sprint goal:** Deploy managed multi-tenant control plane.

**Backend tasks**
- Hosted API/UI; tenant checks; managed storage; quotas.

**NeuroAI tasks**
- Hosted workflow compatibility.

**Business tasks**
- Select hosted beta users.

**Demo outcome**
- Multiple orgs use hosted URL.

**Acceptance criteria**
- Tenant boundaries and quotas verified.

**Risks/dependencies**
- Cloud cost/networking.


### Sprint 33 — Execution Backend Abstraction Hardening

**Sprint goal:** Standardize execution backend interface and conformance tests.

**Backend tasks**
- Docker backend behind ExecutionBackend; conformance tests; Argo boundary.

**NeuroAI tasks**
- Validate outputs across mocks.

**Business tasks**
- Deployment flexibility messaging.

**Demo outcome**
- Same contract works through Docker/test backend.

**Acceptance criteria**
- Abstraction tests pass.

**Risks/dependencies**
- Refactor regressions.


### Sprint 34 — Argo Workflows on Kubernetes Adapter

**Sprint goal:** Run Gliahub workflows through Argo on Kubernetes.

**Backend tasks**
- DAG → Argo manifest; monitor status; bridge logs/artifacts.

**NeuroAI tasks**
- Container packaging for Argo; artifact path validation.

**Business tasks**
- Security/compliance reason for K8s option.

**Demo outcome**
- Trigger workflow → Argo pods launch.

**Acceptance criteria**
- Status maps back; artifacts land in object storage.

**Risks/dependencies**
- K8s setup complexity.


### Sprint 35 — Enterprise SSO

**Sprint goal:** Enterprise users authenticate through OIDC/SAML.

**Backend tasks**
- OIDC; SAML path; domain-to-org; admin SSO settings.

**NeuroAI tasks**
- Support data governance docs.

**Business tasks**
- Enterprise security packet.

**Demo outcome**
- Institutional user logs in through SSO.

**Acceptance criteria**
- SSO tokens map securely.

**Risks/dependencies**
- IdP variability.


### Sprint 36 — DANDI and OpenNeuro Import/Export

**Sprint goal:** Users import/export datasets and metadata to public neuroscience archives.

**Backend tasks**
- Connector skeleton; archive import job; export metadata bundle.

**NeuroAI tasks**
- BIDS/NWB compatibility; conversion constraints.

**Business tasks**
- Private-to-public workflow bridge positioning.

**Demo outcome**
- Import OpenNeuro dataset and run workflow.

**Acceptance criteria**
- Imported dataset validates.

**Risks/dependencies**
- API rate limits.


### Sprint 37 — Nilearn fMRI Core Pack

**Sprint goal:** Add initial fMRI/NIfTI workflow nodes.

**Backend tasks**
- fMRI domain metadata; resource hints.

**NeuroAI tasks**
- Nilearn/Nibabel runtime; NIfTI loader; GLM/ROI nodes.

**Business tasks**
- Validate fMRI expansion demand.

**Demo outcome**
- Run sample NIfTI workflow.

**Acceptance criteria**
- Geometry handled; unsafe runs prevented.

**Risks/dependencies**
- Memory requirements.


### Sprint 38 — Interactive Notebook Prototype

**Sprint goal:** Launch workspace-linked notebooks without making notebooks the primary product.

**Backend tasks**
- Notebook session container; scoped mounts; idle cleanup; notebook-to-node prototype.

**NeuroAI tasks**
- Notebook examples that become nodes.

**Business tasks**
- Validate notebook demand.

**Demo outcome**
- Launch notebook and promote cell to node.

**Acceptance criteria**
- Cleanup works; path isolation.

**Risks/dependencies**
- Session security.


### Sprint 39 — Real-Time Collaboration

**Sprint goal:** Multiple users edit workflow drafts simultaneously.

**Backend tasks**
- YJS sync; presence/comments; explicit version save.

**NeuroAI tasks**
- Schema consistency during concurrent editing.

**Business tasks**
- Test with lab teams.

**Demo outcome**
- Two users edit same draft and save version.

**Acceptance criteria**
- Sync handles disconnects; deterministic save.

**Risks/dependencies**
- WebSocket scaling.


### Sprint 40 — Automated Plugin Review CI

**Sprint goal:** Community plugins are reviewed and verified through automated pipeline.

**Backend tasks**
- Submission flow; image scans; schema tests; license checks; verified badge.

**NeuroAI tasks**
- Scientific validation tests.

**Business tasks**
- Marketplace trust policy.

**Demo outcome**
- Submit plugin → scan → verified status.

**Acceptance criteria**
- Failed scans block publication.

**Risks/dependencies**
- Long scans.


### Sprint 41 — Enterprise Compliance Reporting

**Sprint goal:** Admins export audit and classification reports.

**Backend tasks**
- Audit export; data classification; retention/export/delete support.

**NeuroAI tasks**
- Metadata retention requirements.

**Business tasks**
- Enterprise compliance packet.

**Demo outcome**
- Admin downloads compliance report.

**Acceptance criteria**
- Complete action metadata.

**Risks/dependencies**
- Missing context fields.


### Sprint 42 — Cache Optimization and Cost Dashboard

**Sprint goal:** Optimize large-data workflows and expose cost visibility.

**Backend tasks**
- Runner cache policy; LRU cleanup; cost dashboard; cache metrics.

**NeuroAI tasks**
- Benchmark repeated runs.

**Business tasks**
- Hosted margin modeling.

**Demo outcome**
- Repeat run uses cache; costs shown.

**Acceptance criteria**
- LRU works; costs attributable.

**Risks/dependencies**
- Cache correctness.
