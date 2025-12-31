# IoT Club MACE - Unified Ecosystem

Welcome to the official repository for the IoT Club MACE web ecosystem. This monorepo contains the three main applications that power our club's digital presence.

## 🏗️ Project Structure

This project is organized as a monorepo using npm workspaces:

- **`apps/main`**: The modern, neon-themed landing page and main website.
- **`apps/membership`**: The new student membership registration portal (Mocked Payment & ID Generation).
- **`apps/lending`**: The legacy lending system for borrowing components.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

### Environment Setup

1.  Copy the example environment file:
    ```bash
    cp .env.example .env
    ```
2.  Fill in your Firebase and Cloudinary credentials in the `.env` file.
    *(Note: For the Membership app, you need `VITE_CLOUDINARY_CLOUD_NAME` and `VITE_CLOUDINARY_UPLOAD_PRESET`)*

### Installation

Install all dependencies for the entire workspace from the root directory:

```bash
npm install
```

### ⚡ Running the Ecosystem

You can launch all three applications and the Firebase emulators simultaneously with a single command:

```bash
npm run dev
```

**Or simply double-click `dev.bat` on Windows!**

Access the apps at:
- **Main Website**: [http://localhost:5173](http://localhost:5173)
- **Membership Portal**: [http://localhost:5174](http://localhost:5174)
- **Lending System**: [http://localhost:5175](http://localhost:5175)

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Framer Motion
- **Backend**: Firebase (Hosting, Firestore, Cloud Functions - Emulated Locally)
- **Tooling**: npm workspaces, Concurrently

## 👥 Contributing

1.  Clone the repository.
2.  Install dependencies.
3.  Create a feature branch.
4.  Submit a Pull Request.

---

**IoT Club MACE - Innovate • Build • Connect**
