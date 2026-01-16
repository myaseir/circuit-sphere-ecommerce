🌐 Circuit Sphere - Full-Stack Electronics E-Commerce
Circuit Sphere is a specialized e-commerce platform designed for engineering students and tech enthusiasts in Pakistan. It focuses on providing high-quality electronic components, sensors, and customized Final Year Project (FYP) Kits.

🚀 Project Overview
This project is a monorepo containing both the frontend and backend of the Circuit Sphere platform. It features a modern, responsive user interface and a high-performance asynchronous API.
Component,Technology
Frontend,"Next.js 14 (App Router), TypeScript, Tailwind CSS"
State Management,"Redux Toolkit (Cart, Wishlist, QuickView)"
Backend,"FastAPI (Python), Asynchronous Programming"
Database,MongoDB (NoSQL)
Image Hosting,Cloudinary (High-resolution technical diagrams)


✨ Key Technical Features1. Advanced SEO & Slug LogicThe platform uses custom slugification logic to transform product categories and titles into search-engine-friendly URLs.Example: FYP (Final Year Project) Kits → /shop?category=fyp-kits2. High-Resolution Datasheet RenderingOptimized for technical users. The system handles large-scale vertical specification images (e.g., $956 \times 2671$) with natural scaling to ensure pinouts and schematics remain crystal clear on both mobile and desktop.3. Smart Price & Sale LogicDynamic Discounting: Automatically calculates percentage off based on original_price and current price.Stock Management: Real-time "In Stock" and "Out of Stock" status indicators linked to the MongoDB stock_quantity.
circuit-sphere-ecommerce/
├── frontend/             # Next.js Application
│   ├── src/components/   # Modular React Components
│   ├── src/redux/        # Global State Management
│   └── public/           # Static Assets
## 🏛️ Architecture: Clean Architecture (Onion Pattern)

The backend is built following Clean Architecture principles to ensure a strict separation of concerns:

- **Entities (Models):** Pure business logic and Pydantic schemas. Independent of MongoDB.
- **Use Cases (Services):** Contains the core business rules of the application.
- **Interface Adapters (Repositories):** Converts data from the database format (MongoDB/Motor) into Entities.
- **Frameworks & Drivers (API):** FastAPI routes, Middlewares, and Configuration.



### Folder Structure
```text
backend/
├── app/
│   ├── api/            # Framework Layer: FastAPI routes & endpoints
│   ├── core/           # Configuration, security, and global constants
│   ├── models/         # Entities: Pydantic schemas for data validation
│   ├── repositories/   # Adapters: Database operations (MongoDB/Motor)
│   └── services/       # Use Cases: Business logic orchestration
├── main.py             # Entry point
└── requirements.txt    # Dependency management

A professional README.md is essential for a Computer Science project, especially one as complex as Circuit Sphere. It serves as your documentation and your portfolio piece.Here is a high-quality, structured README designed specifically for your stack.🌐 Circuit Sphere - Full-Stack Electronics E-CommerceCircuit Sphere is a specialized e-commerce platform designed for engineering students and tech enthusiasts in Pakistan. It focuses on providing high-quality electronic components, sensors, and customized Final Year Project (FYP) Kits.🚀 Project OverviewThis project is a monorepo containing both the frontend and backend of the Circuit Sphere platform. It features a modern, responsive user interface and a high-performance asynchronous API.🛠️ Tech StackComponentTechnologyFrontendNext.js 14 (App Router), TypeScript, Tailwind CSSState ManagementRedux Toolkit (Cart, Wishlist, QuickView)BackendFastAPI (Python), Asynchronous ProgrammingDatabaseMongoDB (NoSQL)Image HostingCloudinary (High-resolution technical diagrams)✨ Key Technical Features1. Advanced SEO & Slug LogicThe platform uses custom slugification logic to transform product categories and titles into search-engine-friendly URLs.Example: FYP (Final Year Project) Kits → /shop?category=fyp-kits2. High-Resolution Datasheet RenderingOptimized for technical users. The system handles large-scale vertical specification images (e.g., $956 \times 2671$) with natural scaling to ensure pinouts and schematics remain crystal clear on both mobile and desktop.3. Smart Price & Sale LogicDynamic Discounting: Automatically calculates percentage off based on original_price and current price.Stock Management: Real-time "In Stock" and "Out of Stock" status indicators linked to the MongoDB stock_quantity.📁 Repository StructurePlaintextcircuit-sphere-ecommerce/
├── frontend/             # Next.js Application
│   ├── src/components/   # Modular React Components
│   ├── src/redux/        # Global State Management
│   └── public/           # Static Assets
├── backend/              # FastAPI Application
│   ├── app/models/       # MongoDB Schemas (Pydantic)
│   ├── app/repositories/ # Database Logic
│   └── main.py           # API Entry Point
└── README.md
⚙️ Installation & SetupBackend (FastAPI)Navigate to the backend folder: cd backendCreate a virtual environment: python -m venv venvActivate it: source venv/bin/activate (Mac/Linux) or venv\Scripts\activate (Windows)Install dependencies: pip install -r requirements.txtStart the server: uvicorn main:app --reloadFrontend (Next.js)Navigate to the frontend folder: cd frontendInstall packages: npm installRun the development server: npm run dev📈 Future Roadmap[ ] Integration of JazzCash / EasyPaisa payment gateways.[ ] AI-powered "Project Kit Recommendation" system.[ ] User authentication and order tracking dashboard.
👤 Muhammad Yasir Full Stack Engineer
