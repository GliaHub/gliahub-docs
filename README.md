# Gliahub Documentation 🚀

Welcome to the documentation repository for **Gliahub**—a reproducible, collaborative neuroscience workflow orchestrator and execution layer built on top of scientific tools like MNE-Python, BIDS, and more.

This repository hosts the source files for the official Gliahub public documentation website, powered by Astro and Starlight.

## 🌐 Live Documentation

The documentation is automatically built and deployed via GitHub Actions to:
👉 **[https://gliahub.github.io/gliahub-docs/](https://gliahub.github.io/gliahub-docs/)**

---

## 📂 Repository Structure

Inside this repository, the files are structured as follows:

```text
.
├── public/                # Static assets (favicons, etc.)
├── src/
│   ├── assets/            # Embedded documentation images/media
│   ├── content/
│   │   └── docs/          # Documentation pages
│   │       ├── architecture/    # Core system design & concepts
│   │       ├── roadmap/         # Agile sprint plan & milestone scopes
│   │       ├── setup/           # GitHub org & monorepo setups
│   │       └── index.mdx        # Homepage configuration
│   └── content.config.ts  # Astro Content Collections configuration
├── astro.config.mjs       # Astro & Starlight config
├── package.json           # Node dependencies
└── tsconfig.json          # TypeScript configurations
```

---

## 💻 Local Development

To run the documentation portal locally on your machine, follow these steps:

### Prerequisites

* Node.js (v24 or higher recommended)
* npm (bundled with Node.js)

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/GliaHub/gliahub-docs.git
   cd gliahub-docs
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Commands

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts the local dev server at `localhost:4321` |
| `npm run build` | Builds the static production site to `./dist/` |
| `npm run preview` | Previews the build locally before deploying |
| `npm run astro -- --help` | Gets help using the Astro CLI |

---

## ✍️ Contribution

To propose updates to the documentation:
1. Fork the repository and create a new branch.
2. Update the `.md` or `.mdx` files under `src/content/docs/`. Make sure every new document has the proper Astro frontmatter (`title` and `description`).
3. Commit and push your changes, then submit a Pull Request.

---

*For platform features, codebase architecture, and implementation details, visit the main monorepo at [gliahub/gliahub](https://github.com/GliaHub/gliahub).*
