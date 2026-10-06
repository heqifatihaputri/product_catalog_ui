# Product Catalog Frontend (UI)

A modern, responsive, and type-safe frontend dashboard for managing product catalog data. Built with React, Vite, TypeScript, and Tailwind CSS, communicating seamlessly with the Golang (Gin) REST API backend.

---

## 🚀 Tech Stack

- **Framework:** React + Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios
- **Routing:** React Router DOM (v6)
- **Icons:** Lucide React / Heroicons (if applicable)

---

## ⚙️ Installation & Setup

Follow these steps to run the frontend application locally:

### 1. Prerequisites

Ensure you have **Node.js** (v18 or higher) and **npm/yarn** installed.

### 2. Clone & Install Dependencies

```bash
git clone git@github.com:heqifatihaputri/product_catalog_ui.git
cd product-catalog-ui
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory if you need to customize the backend API URL:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### 4. Run Development Server

```bash
npm run dev
```

The application will start locally at:

```text
http://localhost:5173
```

> **Note:** Make sure the backend service (product-catalog) is running on `http://localhost:8080` before logging in or fetching product data.
