# Gliahub Comprehensive Scrum Sprint Plan & Scope Roadmap

This document outlines the end-to-end development roadmap and Agile sprint plan for **Gliahub**, structured as **2-week Scrum sprints**. 

The plan is tailored to our 4-person team:
* **Backend Team (2 Developers - BE1 & BE2):** Responsibilities include database structures, Go control plane, execution runner daemon, local storage integrations, and basic Next.js UI templates.
* **NeuroAI Developer (1 Developer):** Responsibilities include BIDS/NWB semantics, format verification, MNE runtime containers, JSON contract schemas, and the Python SDK.
* **Business Developer (1 Developer):** Responsibilities include user research, grant compliance frameworks, monetization structures, and GTM coordination.

---

## 1. Product Architecture & Scope Boundaries

### Core Architecture Path
1. **Control Plane:** Go-based API backend acting as the central coordination system.
2. **Relational Database:** PostgreSQL as the transactional source of truth (metadata, workflow versions, run state, permissions, and provenance). Runs queue via a database-backed job table in the MVP.
3. **Data Plane:** Large signal files (EEG/MEG), output artifacts, and HTML reports live in S3-compatible Object Storage (MinIO local-first, AWS S3/GCP Cloud Storage later). Ingest routes via **S3 Presigned Multipart Uploads** directly from client to storage.
4. **Execution Broker:** NATS JetStream is deferred from Phase 1, introduced in Phase 5 once separate distributed runner processes and runner pools are required.
5. **Execution Abstraction:** The Go Control Plane defines the `ExecutionBackend` interface on **Day One (Sprint 1)** to decouple visual graph triggers from container mechanics. The initial implementation uses the Docker SDK.
6. **Execution Runtime:** Ephemeral Docker containers containing MNE-Python, PyTorch/Braindecode (running on CPU in MVP), and Moabb dependencies, managed by a Go runner daemon using the Docker SDK.
7. **Interface Layer:** Next.js frontend centering on a **low-code visual workflow builder** (React Flow canvas) with the Python SDK introduced later for plugin authors.
8. **Native Versioning:** Kaggle-like immutable state objects: `dataset snapshot`, `workflow version`, `execution run`, `artifact`, `report`, and `provenance event`. Users experience "save version," "diff," "restore," "fork," and "run history"—never raw Git branch/rebase models.

### Release Phases
* **Phase 1: MVP Core (Sprints 1–8):** Focuses on core execution interfaces, React Flow canvas, versioning, S3 uploads, MNE containers, BIDS verification, and publication-ready templates.
* **Phase 2: Pilot Release & Onboarding (Sprints 9–12):** Focuses on local installers, template libraries, and direct lab onboarding/migrations.
* **Phase 3: Extensibility & Code Integration (Sprints 13–18):** Focuses on SDK decorators, custom node plugins, and interactive Jupyter notebook prototypes.
* **Phase 4: Lab Product (Sprints 19–24):** Focuses on private workspaces, RBAC boundaries, version diff comparison, and handoff package exports.
* **Phase 5: Marketplace & Scale (Sprints 25–30):** Focuses on licensing gates, NATS runner pools, and resource-aware GPU scheduling.
* **Phase 6: Enterprise & Hosted (Sprints 31–42):** Focuses on Argo/Kubernetes execution, SSO, OpenNeuro imports, and hosted cloud layers.

---

## 2. Phase 1: MVP Core (Sprints 1–8)

### Sprint 1: Core Execution Loop (Vertical Slice)
* **Sprint Goal:** Establish the database schema, launch the Go API, and configure the Go runner via a clean interface to execute an MNE script and stream logs to a Next.js console.
* **Backend Tasks:**
  * Configure postgres container with migrations for `runs`, `workspaces`, and `jobs` (DB-backed queue).
  * Design the Go `ExecutionBackend` interface boundary on Day One to abstract runner engines.
  * Implement the Docker SDK implementation of the `ExecutionBackend` interface.
  * Scaffold Go API server with a `/runs` trigger route and a websocket log-streaming hook.
  * Build a Next.js dashboard view showing active projects and a live terminal console displaying container stdout.
* **NeuroAI Tasks:**
  * Write the baseline mock Python execution container script that reads an EEG raw file (`.fif`) header, extracts sampling rate and channel list, and prints them to stdout.
  * Define standard JSON schemas representing base EEG variables (sampling rate, channels, epoch lengths).
* **Business Tasks:**
  * Map customer persona matrices (PI vs. Postdoc vs. PhD student) and identify core pipeline handoff friction points.
  * Draft the initial template for the **NIH Data Management & Sharing (DMS) Compliance Statement**, detailing how Gliahub satisfies metadata standards.
* **Demo Outcome:** Click "Run" on the dashboard -> Go API registers the job -> Go Runner spawns a container via the `ExecutionBackend` interface -> UI console streams live stdout detailing the sampling rate and channel counts of the target EEG file.
* **Acceptance Criteria:**
  * Go server connects to PostgreSQL database container and logs status checks.
  * Go runner executes container using the local Docker Socket and captures stdout streams accurately.
  * Relational tables record execution state changes (`queued` -> `running` -> `completed`).
* **Risks/Dependencies:**
  * Go runner permission conflicts accessing the host socket (`/var/run/docker.sock`).

---

### Sprint 2: Visual Workflow Editor (React Flow Canvas)
* **Sprint Goal:** Build the React Flow canvas to visually arrange EEG load, filter, and report nodes and save/load the DAG structure.
* **Backend Tasks:**
  * Design database tables and queries to serialize React Flow node and edge coordinates in Postgres.
  * Write REST APIs (`GET/PUT /workflows/{id}/draft`) mapping node layout structures.
* **NeuroAI Tasks:**
  * Define schema contracts for three core nodes: `Raw EDF Ingestion`, `Bandpass Filter`, and `HTML Report`.
  * Define validation bounds for parameter inputs (such as filter low/high frequency cuts) using JSON schemas.
* **Business Tasks:**
  * Structure the pricing tier pilot terms (Free local execution vs. Paid private workspaces).
  * Draft the User Feedback Survey focusing on pipeline sharing issues inside academic labs.
* **Demo Outcome:** Drag MNE Bandpass Filter and Ingest boxes on the canvas, connect their ports, save the layout, refresh the page, and verify the graph positions are restored.
* **Acceptance Criteria:**
  * Visual connections prevent feedback loops (graph validation detects circular edges).
  * API successfully marshals and stores the visual node graph state in Postgres JSONB.
* **Risks/Dependencies:**
  * Coordinate translation mismatches between React Flow canvas rendering and backend models.

---

### Sprint 3: Workflow Versioning & Provenance Event Loop
* **Sprint Goal:** Integrate the backend versioning state and emit real-time provenance tracking logs on execution starts and completions.
* **Backend Tasks:**
  * Design database tables for immutable configurations: `workflow_versions`.
  * Write APIs to freeze visual drafts into permanent workflow versions.
  * Implement the core event logging system emitting `run started`, `run completed`, and `artifact produced` records to the DB during runner execution cycles.
  * Render dynamic parameter forms in the editor sidebar based on node schemas, showing locked badges for locked nodes.
* **NeuroAI Tasks:**
  * Author the static EEG-Core plugin manifest json mapping parameter specifications for MNE filtering (`mne.filter.filter_data`).
  * Generate unique workflow JSON hashes to lock version records.
* **Business Tasks:**
  * Conduct paid pilot outreach interviews with 3 target PI advisors.
  * Validate institutional procurement budget limits (e.g. credit card thresholds vs. formal tender processes).
* **Demo Outcome:** Save version "v1" of a workflow -> trigger execution -> UI displays active version index and logs matching events (`run started`, `artifact produced`) in real-time.
* **Acceptance Criteria:**
  * Visual canvas parameters lock upon version freeze API triggers.
  * Database writes immutable provenance events linked to the version ID.
* **Risks/Dependencies:**
  * Sync timing between runner event loops and database commits.

---

### Sprint 4: Storage Integration & Dataset Snapshots
* **Sprint Goal:** Integrate MinIO object storage, implement dataset snapshots, and support presigned multipart uploads directly from client.
* **Backend Tasks:**
  * Deploy MinIO object storage within the local docker-compose configuration.
  * Implement Go endpoints generating **MinIO presigned multipart upload credentials** for client uploads.
  * Design database tables for `dataset_snapshots` and map relationship references to execution runs.
* **NeuroAI Tasks:**
  * Develop directory-hashing routines to assign SHA-256 fingerprints to datasets prior to upload completions.
  * Define BIDS-preflight file checks.
* **Business Tasks:**
  * Write copy-pasteable "Facilities and Resources" text templates explaining Gliahub architecture for NIH and Horizon Europe grant applications.
* **Demo Outcome:** Upload a sample EDF file via the UI dashboard directly to MinIO using multipart presigned URLs, generating a dataset snapshot linked to versioned runs.
* **Acceptance Criteria:**
  * Client connects directly to storage to upload files, avoiding API server memory buffering.
  * Database rejects any mutation requests on locked dataset snapshot tables.
* **Risks/Dependencies:**
  * High latency hashing massive directory structures.

---

### Sprint 5: Code Export & MNE Scientific Execution
* **Sprint Goal:** Run a visual workflow that filters a raw EDF signal using MNE-Python inside the runner container, and support downloading it or exporting the visual DAG as a Python script.
* **Backend Tasks:**
  * Update Go Runner to download target inputs from MinIO, mount workspace directories, start the scientific Docker container, and upload output artifacts.
  * Save output object paths and execution states in PostgreSQL.
  * Develop the code generator mapping visual workflow JSON graphs directly to MNE-Python scripts.
* **NeuroAI Tasks:**
  * Compile the OCI-compliant scientific base image with MNE-Python installed.
  * Write the python wrapper running filter/notch calculations on mounted data according to workflow parameters.
* **Business Tasks:**
  * Compile onboarding files and migration worksheets for researchers transitioning from MATLAB tools (EEGLAB).
* **Demo Outcome:** Run the workflow containing filter nodes -> download the processed `.fif` output file -> click "Export Code" to download a runnable script executing the same MNE pipeline locally.
* **Acceptance Criteria:**
  * Output file exists in MinIO and contains valid filtered EEG signals.
  * Go runner executes clean container cleanup sequences on failure exits.
* **Risks/Dependencies:**
  * Sync discrepancies between exported scripts and the Docker runtime code.

---

### Sprint 6: BIDS Preflight Validation
* **Sprint Goal:** Integrate the JavaScript BIDS validator to verify directory formatting on dataset upload.
* **Backend Tasks:**
  * Build zip extractor workers and metadata indexing routines.
  * Connect JS `bids-validator` hooks within the upload lifecycle.
* **NeuroAI Tasks:**
  * Build Python query helpers to extract subject, session, and modality lists from validated BIDS paths.
* **Business Tasks:**
  * Draft custom node monetization policies (bundling specialty nodes into purchaseable "Domain Packs").
* **Demo Outcome:** Upload a zipped dataset -> preflight panel validates layout -> UI lists detected subjects and sessions.
* **Acceptance Criteria:**
  * API blocks upload runs if the BIDS validator returns critical directory formatting errors.
  * Validated datasets successfully register all subject and session schemas in Postgres.
* **Risks/Dependencies:**
  * Processing timeouts unpacking massive datasets.

---

### Sprint 7: Publication-Ready Reports & Templates
* **Sprint Goal:** Automatically generate self-contained HTML reports containing PSD/QC figures, paper methods drafts, and citation guidelines.
* **Backend Tasks:**
  * Create relational database models linking artifacts and report files to execution runs.
  * Develop background templates compiling markdown text and images into HTML report templates.
* **NeuroAI Tasks:**
  * Generate matplotlib Power Spectral Density (PSD) figures and epoch averages inside the run execution container.
  * Build python modules outputting boilerplate research methodology text and standard citation blocks.
* **Business Tasks:**
  * Finalize plan options and payment boundaries based on pilot interviews.
* **Demo Outcome:** Run the workflow -> download a single `report.html` page containing inline figures, parameter listings, copy-pasteable paper Methods text, and citation references.
* **Acceptance Criteria:**
  * HTML report is self-contained (all images embedded as base64 strings).
  * Generated methodology text updates dynamically based on the active node parameters.
* **Risks/Dependencies:**
  * High memory footprints when compiling dense signal graphics.

---

### Sprint 8: Local docker-compose Release (MVP Target)
* **Sprint Goal:** Bundle the entire Gliahub platform into a single docker-compose configuration for local lab distribution.
* **Backend Tasks:**
  * Package PostgreSQL, MinIO, Go API, Go Runner, and UI dashboard into a single `docker-compose.yml` config.
  * Compile configuration helper shell scripts.
* **NeuroAI Tasks:**
  * Build and register the final stable scientific Docker runtime image.
* **Business Tasks:**
  * Deliver the GTM Beta Launch Kit, compile tutorials, and prepare pilot workspace marketing templates.
* **Demo Outcome:** Run the local docker-compose stack with a single command -> access dashboard -> upload data -> execute pipeline -> download publication report.
* **Acceptance Criteria:**
  * Compose script boots the entire system locally with default environment settings.
  * The local runner processes EDF files without external network connections.
* **Risks/Dependencies:**
  * Host port usage conflicts on targeted lab servers.

---

## 3. Phase 2: Pilot Release & Onboarding (Sprints 9–12)

### Sprint 9: Project & Report Templates
* **Sprint Goal:** Establish project template gallery workspaces and report custom templates to bootstrap new installations.
* **Backend Tasks:**
  * Create migrations populating default workflow template structures.
* **NeuroAI Tasks:**
  * Author standard pipelines: EEG bandpass preprocessing, ICA artifact cleaning, and PSD extraction templates.
* **Business Tasks:**
  * Write template guide articles describing typical configurations.
* **Demo Outcome:** Open the template dashboard -> clone the EEG basic preprocessing template -> run it instantly against sample datasets.
* **Acceptance Criteria:**
  * Cloned workflows preserve graph structures, edge coordinates, and parameters.
* **Risks/Dependencies:**
  * Node ID mismatches during cloning.

### Sprint 10: Multi-Gigabyte Ingestion direct to Storage
* **Sprint Goal:** Build a CLI tool supporting chunked, resumable presigned multipart uploads directly to MinIO for multi-gigabyte EEG files.
* **Backend Tasks:**
  * Create multipart presigned URL generators and completion endpoints.
* **NeuroAI Tasks:**
  * Evaluate file indexing memory footprints on 5GB+ datasets.
* **Business Tasks:**
  * Analyze upload latency performance metrics.
* **Demo Outcome:** Upload a 10GB dataset using the CLI tool -> progress bar indicates upload -> database snapshot locks on completion.
* **Acceptance Criteria:**
  * Client connects directly to MinIO/S3 using multipart signatures, bypassing control plane file buffering.
* **Risks/Dependencies:**
  * Egress limits on targeted clouds.

### Sprint 11: Pilot Onboarding & Migration
* **Sprint Goal:** Complete the first true lab installation, migrate legacy workflows, and run structured interviews.
* **Backend Tasks:**
  * Deploy Gliahub on a partner lab server and monitor system performance.
* **NeuroAI Tasks:**
  * Translate a partner lab's legacy MATLAB script workflow into a Gliahub visual DAG.
* **Business Tasks:**
  * Coordinate pilot onboarding, document migration friction, and run user experience interviews.
* **Demo Outcome:** Show the partner lab running their pipeline inside Gliahub and export the corresponding report.
* **Acceptance Criteria:**
  * The migrated workflow outputs identical signals compared to the legacy Matlab results.
* **Risks/Dependencies:**
  * Partner server permission limits.

### Sprint 12: Public Template sharing
* **Sprint Goal:** Enable users to publish workflows to a public gallery page where others can search and fork them.
* **Backend / NeuroAI / Business Tasks:**
  * Build public project view controllers, fork increment counters, and user templates search indexes.
* **Demo Outcome:** Publish a private pipeline -> view it in the public list -> log in as another user -> fork the pipeline.
* **Acceptance Criteria:**
  * Forked workflows preserve the original parameters and reference schemas.
* **Risks/Dependencies:**
  * Unauthenticated path security exposures.

---

## 4. Phase 3: Extensibility & Code Integration (Sprints 13–18)

### Sprint 13: Python SDK Node Authoring Decorators
* **Sprint Goal:** Build the `@node` Python SDK decorator engine to auto-generate node parameter JSON schemas for custom code.
* **Backend / NeuroAI / Business Tasks:**
  * Develop the API parser extracting class signatures and validate schemas against the UI node generator.
* **Demo Outcome:** Run a Python script decorated with `@node` -> API registers a custom node displaying custom input forms in the UI.
* **Acceptance Criteria:**
  * Generated JSON schemas validate parameter types (integer, string, range) correctly.
* **Risks/Dependencies:**
  * Parser failures on complex type definitions.

### Sprint 14: Local Runner SDK Integration
* **Sprint Goal:** Enable running workflows directly on local developer machines via the Python SDK.
* **Backend / NeuroAI / Business Tasks:**
  * Create the local execution controller and package path mappings inside the Python SDK.
* **Demo Outcome:** Run `workflow.run_local()` -> Python executes MNE script locally using local data.
* **Acceptance Criteria:**
  * Local executions output identical parameters and files to container runs.
* **Risks/Dependencies:**
  * Out-of-sync local package dependencies.

### Sprint 15: MOABB EEG Benchmark Integration
* **Sprint Goal:** Integrate the Mother of All EEG Benchmarks (MOABB) to validate and compare classification pipelines.
* **Backend / NeuroAI / Business Tasks:**
  * Create MOABB evaluation wrapper containers and compile report formatting rules.
* **Demo Outcome:** Trigger a classification workflow -> output report renders pipeline comparisons.
* **Acceptance Criteria:**
  * Output results generate standard MOABB accuracy tables and figures.
* **Risks/Dependencies:**
  * Long compute times on large benchmark datasets.

### Sprint 16: Braindecode DL Training Support (CPU Only)
* **Sprint Goal:** Support deep learning model training on CPU using Braindecode nodes.
* **Backend / NeuroAI / Business Tasks:**
  * Integrate Braindecode modules in the scientific container and write CPU training loop nodes.
* **Demo Outcome:** Execute a Braindecode training pipeline -> logs stream progress metrics.
* **Acceptance Criteria:**
  * Runs execute purely on CPU environments (no GPU scheduling dependencies yet).
* **Risks/Dependencies:**
  * Slow epoch durations running on CPU cores.

### Sprint 17: Python SDK Client Release
* **Sprint Goal:** Deliver the public client library `gliahub-sdk` to authenticate and interact with workspaces.
* **Backend / NeuroAI / Business Tasks:**
  * Build SDK auth handler, write documentation guides, and publish library packages.
* **Demo Outcome:** Log in and query active workspace datasets using the python console client.
* **Acceptance Criteria:**
  * Library handles token renewals and exceptions gracefully.
* **Risks/Dependencies:**
  * API version break issues.

### Sprint 18: Custom Code Nodes & Interactive Notebooks Prototype
* **Sprint Goal:** Deploy custom python code execution nodes and spin up interactive containers linked to datasets.
* **Backend Tasks:**
  * Scaffold basic container session managers spawning lightweight Python shells.
* **NeuroAI Tasks:**
  * Define the input/output boundaries for the `Custom Python Code` node.
* **Business Tasks:**
  * Assess feedback from beta users requesting sandbox coding features.
* **Demo Outcome:** Insert a `Custom Code` node -> write inline python manipulations -> run workflow -> check output.
* **Acceptance Criteria:**
  * Visual editor maps code input fields to execution containers cleanly.
* **Risks/Dependencies:**
  * Resource isolation leaks.

---

## 5. Phase 4: Lab Product (Sprints 19–24)

### Sprint 19: Private Workspaces & Coarse RBAC
* **Sprint Goal:** Enforce project level permissions, distinguishing between Owner, Contributor, and Viewer.
* **Backend / NeuroAI / Business Tasks:**
  * Implement database RBAC tables and write auth checks across data and execution routes.
* **Demo Outcome:** Viewer account attempts to edit a visual workflow -> UI and API reject request with a security error.
* **Acceptance Criteria:**
  * All REST endpoints verify token permissions before returning data.
* **Risks/Dependencies:**
  * Permission leak configuration issues.

### Sprint 20: Audit Log Logging Service
* **Sprint Goal:** Record all sensitive operations in an append-only audit database.
* **Backend / NeuroAI / Business Tasks:**
  * Implement DB hooks and trigger log captures for upload, delete, run start, and member edit activities.
* **Demo Outcome:** View an admin dashboard page listing who executed runs and downloaded artifacts.
* **Acceptance Criteria:**
  * Logs are immutable and cannot be edited by project managers.
* **Risks/Dependencies:**
  * Database load spikes under high logs frequency.

### Sprint 21: Workflow Version Diffs
* **Sprint Goal:** Implement the visual comparison overlay highlighting edits between workflow versions.
* **Backend / NeuroAI / Business Tasks:**
  * Develop workflow JSON compare utilities and implement diff rendering overlays in Next.js.
* **Demo Outcome:** Open the version history -> select two items -> UI renders added nodes in green and removed nodes in red.
* **Acceptance Criteria:**
  * JSON comparisons handle modified edge connections correctly.
* **Risks/Dependencies:**
  * Rerender loops on complex graph diffs.

### Sprint 22: Dataset Version Diffs
* **Sprint Goal:** Compare directory trees across dataset snapshots.
* **Backend / NeuroAI / Business Tasks:**
  * Implement manifest comparison tools and format listing differences.
* **Demo Outcome:** View version comparisons highlighting added, deleted, or modified EEG data files.
* **Acceptance Criteria:**
  * Diff reports identify hash mismatches for altered signal files.
* **Risks/Dependencies:**
  * Index scanning times on huge directories.

### Sprint 23: Report Handoff Package Exporters
* **Sprint Goal:** Export execution results, workflows, dataset manifests, and reports inside a single ZIP package.
* **Backend / NeuroAI / Business Tasks:**
  * Write compression builders and format provenance metadata documents inside the output ZIP.
* **Demo Outcome:** Click "Export Bundle" -> download a structured ZIP archive containing data, run logs, and HTML reports.
* **Acceptance Criteria:**
  * Exported bundle contains all parameters required to re-run the pipeline in a clean environment.
  * Metadata utilizes standardized W3C PROV schema templates.
* **Risks/Dependencies:**
  * Disk usage issues on the compression server.

### Sprint 24: Pilot SLA Validation
* **Sprint Goal:** Deploy pilot workspace models to institutional partners to test stability.
* **Backend / NeuroAI / Business Tasks:**
  * Conduct support sessions, audit uptime profiles, and fix critical production failures.
* **Demo Outcome:** Review system metrics dashboards showing continuous run completions.
* **Acceptance Criteria:**
  * Maintain system uptime above 99% during pilot periods.
* **Risks/Dependencies:**
  * Integration errors with partner local networks.

---

## 6. Phase 5: Marketplace & Scale (Sprints 25–30)

### Sprint 25: Node Marketplace Listings
* **Sprint Goal:** Build the interface listing official, verified, and community plugins.
* **Backend / NeuroAI / Business Tasks:**
  * Create marketplace database tables and write search views.
* **Demo Outcome:** Search the plugin registry -> click "Install" on a custom plugin -> node joins the pipeline editor palette.
* **Acceptance Criteria:**
  * Workspace installs are recorded and gated by permission level.
* **Risks/Dependencies:**
  * Dependency conflicts between active plugins.

### Sprint 26: Entitlement Gates Validation
* **Sprint Goal:** Restrict custom node executions based on plan subscriptions.
* **Backend / NeuroAI / Business Tasks:**
  * Build runtime entitlement verification checks in the Go Control Plane.
* **Demo Outcome:** Run a workflow containing a locked node -> execution rejects start with an entitlement billing warning.
* **Acceptance Criteria:**
  * API rejects queue insertions on unauthorized node references.
* **Risks/Dependencies:**
  * Sub-second database validation latencies.

### Sprint 27: Workspace-Local Plugins
* **Sprint Goal:** Enable uploading private workspace-only custom plugins.
* **Backend / NeuroAI / Business Tasks:**
  * Build isolated registry indexes and write custom manifest upload endpoints.
* **Demo Outcome:** Upload a private node manifest -> node appears in your workspace palette but remains hidden from other organizations.
* **Acceptance Criteria:**
  * Registry enforces organization boundaries on plugin loads.
* **Risks/Dependencies:**
  * Version numbering collisions on private manifests.

### Sprint 28: Billing Events Integration
* **Sprint Goal:** Track execution minutes and storage space to prepare invoice data.
* **Backend / NeuroAI / Business Tasks:**
  * Code usage counters and write billing log aggregations.
* **Demo Outcome:** Open the billing panel -> view running totals for database metrics, compute durations, and object storage bytes.
* **Acceptance Criteria:**
  * Metric recordings trigger asynchronously to prevent queue blocks.
* **Risks/Dependencies:**
  * Missing events during broker outages.

### Sprint 29: NATS JetStream Integration (Distributed Queue)
* **Sprint Goal:** Transition the execution queue from database tables to NATS JetStream topics.
* **Backend / NeuroAI / Business Tasks:**
  * Set up NATS JetStream configurations and update control plane to publish runs as queue messages.
* **Demo Outcome:** Queue multiple runs simultaneously -> NATS distributes tasks to active listening runner daemons.
* **Acceptance Criteria:**
  * Go runner claims and leases are managed via NATS consumer group protocols.
* **Risks/Dependencies:**
  * Message duplication hazards.

### Sprint 30: Resource-Aware GPU Scheduling
* **Sprint Goal:** Implement runner labels matching CPU/GPU hardware profiles and activate CUDA support.
* **Backend / NeuroAI / Business Tasks:**
  * Write resource matching algorithms in the Go runner daemon and enable CUDA GPU access.
* **Demo Outcome:** Trigger a GPU training run -> system schedules task specifically to a GPU-enabled runner node.
* **Acceptance Criteria:**
  * Docker Runner accesses host GPU drivers to execute accelerated training jobs.
* **Risks/Dependencies:**
  * Hardware driver mismatch failures.

---

## 7. Phase 6: Enterprise & Hosted (Sprints 31–42)

### Sprint 31: Hardened Container Execution (gVisor)
* **Sprint Goal:** Integrate gVisor application kernels to isolate untrusted custom nodes.
* **Backend / NeuroAI / Business Tasks:**
  * Set up gVisor runsc runtime layers and configure docker launch profiles.
* **Demo Outcome:** Execute a custom node containing malicious path traversal code -> execution terminates safely with blocked access logs.
* **Acceptance Criteria:**
  * Runsc flags are applied only to custom community nodes.
* **Risks/Dependencies:**
  * Performance overhead on large arrays processing.

### Sprint 32: Hosted Control Plane Beta
* **Sprint Goal:** Deploy a multi-tenant cloud control plane to managed environments.
* **Backend / NeuroAI / Business Tasks:**
  * Build tenant database routers and set up cloud network ingress.
* **Demo Outcome:** Multiple users register on a unified cloud URL and operate isolated workspaces.
* **Acceptance Criteria:**
  * Database queries isolate tenant scopes at connection levels.
* **Risks/Dependencies:**
  * Cloud networking latencies.

### Sprint 33: Argo Workflows on Kubernetes Adapter
* **Sprint Goal:** Build the Argo adapter converting Gliahub workflow DAGs to K8s CRDs (utilizing the ExecutionBackend interface).
* **Backend / NeuroAI / Business Tasks:**
  * Write the Argo YAML manifest generator and configure cluster event monitors.
* **Demo Outcome:** Trigger a workflow run -> dashboard shows pods launching in a local Kubernetes cluster.
* **Acceptance Criteria:**
  * Argo status updates translate back to database execution records.
* **Risks/Dependencies:**
  * Setup complexities in Kubernetes environments.

### Sprint 34: Enterprise SSO Identity Integration
* **Sprint Goal:** Integrate enterprise OIDC/SAML federation for user logins.
* **Backend / NeuroAI / Business Tasks:**
  * Connect OIDC flows to Okta/AD, and set up domain-based automatic tenant assignment.
* **Demo Outcome:** Log in via institutional SSO and automatically join the matching organizational directory.
* **Acceptance Criteria:**
  * SSO tokens pass organization context details securely.
* **Risks/Dependencies:**
  * Identity provider sync timing.

### Sprint 35: DANDI & OpenNeuro Import/Export Integrations
* **Sprint Goal:** Expose search and download integration wrappers for OpenNeuro and DANDI.
* **Backend / NeuroAI / Business Tasks:**
  * Build archival connectors utilizing DANDI REST APIs.
* **Demo Outcome:** Select an OpenNeuro dataset ID in the UI -> dataset imports directly into workspace.
* **Acceptance Criteria:**
  * Imports preserve standard BIDS validation layouts.
* **Risks/Dependencies:**
  * Rate-limiting restrictions on archival endpoints.

### Sprint 36: Nilearn Multimodal fMRI Core Pack
* **Sprint Goal:** Deliver support for multimodal fMRI workflow nodes using Nilearn.
* **Backend / NeuroAI / Business Tasks:**
  * Package Nilearn dependencies in execution images and author NIfTI loader nodes.
* **Demo Outcome:** Run a NIfTI GLM workflow -> output report renders brain activation surfaces.
* **Acceptance Criteria:**
  * Processing handles NIfTI coordinate geometry accurately.
* **Risks/Dependencies:**
  * Massive memory requirements processing fMRI volumes.

### Sprint 37: Interactive Notebook Session Scale
* **Sprint Goal:** Enable spawning scalable Jupyter kernels within container clusters.
* **Backend / NeuroAI / Business Tasks:**
  * Build session routers and load balancing algorithms.
* **Demo Outcome:** Scale notebook workspaces across cluster containers.
* **Acceptance Criteria:**
  * Notebook resources adhere to organization budgets.
* **Risks/Dependencies:**
  * Container spawning delays.

### Sprint 38: Real-time Visual Collaboration (YJS)
* **Sprint Goal:** Support multi-user concurrent visual workflow editing.
* **Backend / NeuroAI / Business Tasks:**
  * Integrate YJS client sync libraries and implement document presence updates.
* **Demo Outcome:** Open a workflow editor on two screens -> dragging a node updates position in real-time.
* **Acceptance Criteria:**
  * Sync resolving logic handles network dropouts gracefully.
* **Risks/Dependencies:**
  * Connection overhead on WebSocket servers.

### Sprint 40: Automated Plugin Review CI Pipeline
* **Sprint Goal:** Automate validation scans for community plugins.
* **Backend / NeuroAI / Business Tasks:**
  * Code static review analyzers, license check scripts, and image validation daemons.
* **Demo Outcome:** Publish a plugin -> review worker scans image and applies "Verified" badge.
* **Acceptance Criteria:**
  * Scan failures block publication updates in the marketplace.
* **Risks/Dependencies:**
  * Long pipeline run durations.

### Sprint 41: Enterprise Compliance Reporting
* **Sprint Goal:** Automate export procedures for data auditing and classification reviews.
* **Backend / NeuroAI / Business Tasks:**
  * Implement audit trail document export tools and classification labeling options.
* **Demo Outcome:** Trigger audit download -> system generates compliance logs.
* **Acceptance Criteria:**
  * Reports compile all activities within target timestamps.
* **Risks/Dependencies:**
  * Missing context fields.

### Sprint 42: Cache Optimization & Cost Dashboard
* **Sprint Goal:** Implement caching strategies and a cost control dashboard.
* **Backend / NeuroAI / Business Tasks:**
  * Implement runner NVME cache cleanups and configure cost charts.
* **Demo Outcome:** Check cost dashboard -> view breakdowns of storage and runner costs.
* **Acceptance Criteria:**
  * LRU cache triggers reliably when disk use crosses limits.
* **Risks/Dependencies:**
  * Cache mismatch occurrences.
