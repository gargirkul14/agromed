# AgroMed AI – Farmer Health & Safety Assistant

> **Academic Major Project: Full-Stack Web Application**  
> *Dedicated to protecting the occupational health and safety of farmers.*

---

## 1. Project Overview

**AgroMed AI** is a full-stack, AI-powered occupational health and safety assistant engineered specifically for agricultural workers and farmers. 

Farmers regularly handle hazardous chemical formulations (organophosphates, carbamates, herbicides, synthetic pyrethroids, and caustic nitrogen fertilizers) and endure long shifts in extreme heat and dust. Many agricultural laborers lack access to safety training, personal protective equipment (PPE) guidelines, or immediate first-aid protocols.

### Key Mission & Ethics
- **Educational Awareness Only**: AgroMed AI assists in understanding and preventing occupational hazards.
- **Strict Non-Diagnostic Ethics**: AgroMed AI **does NOT diagnose diseases or replace medical doctors**. For severe symptoms, it prominently directs users to emergency healthcare services.

---

## 2. Key Features

1. **Health Risk Assessment Engine**:
   - Evaluates chemical toxicity, exposure duration, activity hazard class, symptom clusters, and active PPE.
   - Generates an objective **Safety Score (0–100)** and **Risk Level (LOW / MEDIUM / HIGH)**.
   - Computes immediate on-field precautions and personalized risk mitigations.
2. **Personalized Safety Recommendations**:
   - Context-aware advice cards prioritized as *High*, *Medium*, or *General* across 8 categories: Chemical Safety, PPE, Hydration, Rest Breaks, Work Duration, Heat Protection, Storage, and Spraying Practices.
3. **PPE Safety Guide & Gap Analysis**:
   - Activity-specific gear matching (Pesticide Spraying, Chemical Mixing, Fertilizer Application, Harvesting, General Farm Work).
   - Side-by-side comparison comparing required gear against the farmer's registered inventory, identifying missing items.
4. **Ask AgroMed AI (Chatbot)**:
   - Conversational AI powered by **Google Gemini API** with agricultural health guardrails.
   - Built-in knowledge fallback engine to ensure offline presentations to teachers work without failure.
5. **Safety Knowledge Center**:
   - 10+ categorized, verified guides covering chemical decontamination, organophosphate poisoning prevention, eye-flush first aid, and silo safety with keyword search.
6. **Farmer Health Dashboard & History**:
   - Visual safety score gauge, profile completion meter, daily safety tips, and SVG safety trend line chart.
7. **Admin Command Center**:
   - Role-based surveillance dashboard with metrics on registered farmers, total assessments, high-risk flags, assessment auditing, knowledge base CRUD, and chemical safety database management.

---

## 3. Technology Stack

| Layer | Technologies Used |
|---|---|
| **Frontend** | React.js 18, Vite 5, Tailwind CSS 3, React Router DOM 6, Axios, Lucide React |
| **Backend** | Node.js (ES Modules), Express.js 4, CORS, Dotenv |
| **Database** | PostgreSQL |
| **ORM** | Prisma ORM 5 |
| **Authentication** | JWT (JSON Web Tokens), bcryptjs password hashing |
| **Artificial Intelligence** | Google Gemini API (`@google/generative-ai`) |

---

## 4. Folder Structure

```
agromed-ai/
├── backend/
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── articleController.js
│   │   ├── assessmentController.js
│   │   ├── authController.js
│   │   ├── chemicalController.js
│   │   ├── farmerController.js
│   │   ├── ppeController.js
│   │   ├── recommendationController.js
│   │   └── workProfileController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── roleMiddleware.js
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── articleRoutes.js
│   │   ├── assessmentRoutes.js
│   │   ├── authRoutes.js
│   │   ├── chemicalRoutes.js
│   │   ├── chatRoutes.js
│   │   ├── farmerRoutes.js
│   │   ├── ppeRoutes.js
│   │   ├── recommendationRoutes.js
│   │   └── workProfileRoutes.js
│   ├── services/
│   │   ├── emailService.js
│   │   ├── geminiService.js
│   │   ├── ppeService.js
│   │   ├── recommendationEngine.js
│   │   └── riskEngine.js
│   ├── tests/
│   │   └── auth_otp_test.js
│   ├── utils/
│   │   ├── db.js
│   │   ├── token.js
│   │   └── validators.js
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AdminSidebar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── RiskMeter.jsx
│   │   │   ├── ScoreTrendChart.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── Topbar.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── layouts/
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── DashboardLayout.jsx
│   │   │   └── MainLayout.jsx
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── ArticleManagement.jsx
│   │   │   │   ├── AssessmentMonitoring.jsx
│   │   │   │   ├── ChemicalSafetyManagement.jsx
│   │   │   │   └── FarmerManagement.jsx
│   │   │   ├── ArticleDetailPage.jsx
│   │   │   ├── AssessmentResultPage.jsx
│   │   │   ├── ChatbotPage.jsx
│   │   │   ├── FarmerDashboard.jsx
│   │   │   ├── FarmerProfilePage.jsx
│   │   │   ├── HealthAssessmentPage.jsx
│   │   │   ├── HealthHistoryPage.jsx
│   │   │   ├── KnowledgeCenterPage.jsx
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── PPEGuidePage.jsx
│   │   │   ├── RecommendationsPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── WorkProfilePage.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── utils/
│   │   │   └── constants.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── index.html
├── package.json
├── README.md
└── .gitignore
```

---

## 5. Step-by-Step Teacher Demonstration Guide

When presenting this project to evaluators and teachers, follow this smooth demonstration flow:

### Step 1: Pre-Configured Demo Credentials
Quick-fill buttons are integrated directly into the login screen:
- **Demo Farmer**: `farmer@agromed.ai` | Password: `Farmer@123`
- **Demo Admin**: `admin@agromed.ai` | Password: `Admin@123`

### Step 2: Teacher Walkthrough Script
1. **Show the Landing Page (`/`)**:
   - Highlight the mission: *"Protecting the People Who Feed the Nation"*.
   - Point out the 6 core features, the 4-step workflow, and the non-diagnostic medical disclaimer banner.
2. **Login as Farmer (`farmer@agromed.ai`)**:
   - Demonstrate the **Farmer Health Dashboard**:
     - Safety Score Gauge (e.g. 82/100).
     - Recent assessments and SVG Safety Score timeline chart.
     - Rotating daily safety tips.
3. **Show Profiles (`/profile` and `/work-profile`)**:
   - Demonstrate farmer personal demographics, crop types (Paddy/Cotton), shift hours, and chemical usage.
4. **Conduct a Live Health Assessment (`/assessment`)**:
   - *Test Scenario A (High Hazard Case)*:
     - Activity: `Pesticide Spraying`
     - Chemical: `Chlorpyrifos 20% EC`
     - Duration: `3–5 hours`
     - Symptoms: Check `Dizziness`, `Eye Irritation`, and `Breathing Difficulty`
     - PPE: Select `Gloves` only (missing mask & goggles)
   - Click **Calculate Risk & Safety Score**:
     - View the Result: **HIGH RISK**, score `< 40`, flashing red critical medical emergency advisory, identified risk factors, and immediate decontamination steps.
5. **Inspect the PPE Guide (`/ppe-guide`)**:
   - Select `Pesticide Spraying`: show how the system automatically performs **Gap Analysis** comparing the farmer's registered inventory against required gear (e.g., ✓ Gloves Equipped vs ✗ Respirator Mask Missing).
6. **Chat with AgroMed AI (`/chatbot`)**:
   - Click the prompt chip: *"I sprayed pesticides today and now I feel dizzy."*
   - Show how the AI provides structured emergency steps, hydration advice, and disclaimers.
7. **Demonstrate Safety Knowledge Center (`/knowledge`)**:
   - Filter by `First Aid Basics` or search `"organophosphate"` to read the full guide.
8. **Switch to Admin Portal (`admin@agromed.ai`)**:
   - View aggregated health surveillance statistics: total farmers, high risk incidents, and average safety score.
   - Inspect registered farmer profiles, audit assessments, and demonstrate publishing a new safety article or adding a chemical record.

---

## 6. Installation & Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- PostgreSQL (optional for local deployment; if not running, AgroMed automatically activates zero-setup presentation mode with full demo data)

### Step 1: Install Dependencies
Open a terminal in the root directory:
```bash
# Install backend packages
cd backend
npm install

# Install frontend packages
cd ../frontend
npm install
```

### Step 2: Environment Configuration
In `backend/.env`:
```ini
PORT=5000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/agromed_db?schema=public"
JWT_SECRET="agromed_super_secret_jwt_key_2026_academic_project"
GEMINI_API_KEY="your_google_gemini_api_key_here"
```

*(Note: If you do not have a Gemini API key yet, AgroMed AI includes an intelligent occupational safety responder that seamlessly answers questions during evaluation).*

### Step 3: PostgreSQL & Prisma Setup (When Using PostgreSQL)
If PostgreSQL is installed locally or via cloud (e.g. Supabase, Neon):
```bash
cd backend
npx prisma generate
npx prisma db push
node prisma/seed.js
```

---

## 7. Running the Application

### Option A: Single Command (Recommended)
From the root `agromed-ai/` directory, simply run:
```bash
npm start
```
* Starts **both the Express backend and Vite frontend** concurrently with colored logs.
* **Automatically opens your web browser** directly to `http://localhost:5173`.
* Displays the clickable link `http://localhost:5173` right in the terminal.

### Option B: Separate Terminals
If you prefer running backend and frontend in separate terminals:
* **Terminal 1 (Backend)**:
  ```bash
  cd backend
  npm start
  ```
* **Terminal 2 (Frontend)**:
  ```bash
  cd frontend
  npm run dev
  ```

---

## 7.1 Accessing From Other Laptops / Devices

### Method A: Same Wi-Fi or Mobile Hotspot (LAN Host Link)
Both Vite and Express are configured with `host: 0.0.0.0`. When your laptop is connected to Wi-Fi or a hotspot:
- **Local Network Link**: `http://192.168.1.6:5173`
- Open this link on **any other laptop, teacher's tablet, or smartphone** connected to the same network.

### Method B: Public Worldwide Online Link (Localtunnel)
To generate an instant HTTPS link that works on **any laptop anywhere in the world**:
```bash
# In the project root or frontend folder:
npx localtunnel --port 5173
```
* This prints an instant live URL: `https://xxxx.loca.lt`
* Share this URL with your teachers to test from any device or location!

---

## 8. Rule-Based Health Risk Engine Algorithm

Unlike black-box machine learning models, AgroMed AI uses a transparent, auditable medical scoring algorithm:

$$\text{Safety Score} = 100 - \Delta_{\text{duration}} - \Delta_{\text{activity}} - (\Delta_{\text{symptoms}} \times F_{\text{duration}}) - \Delta_{\text{PPE}}$$

1. **Duration Deduction ($\Delta_{\text{duration}}$)**:
   - $<1$ hour: $-2$ pts
   - $1-3$ hours: $-8$ pts
   - $3-5$ hours: $-15$ pts
   - $>5$ hours: $-25$ pts
2. **Activity Hazard Class ($\Delta_{\text{activity}}$)**:
   - Pesticide Spraying / Mixing: $-15$ pts
   - Fertilizer Application: $-8$ pts
3. **Symptom Severity & Critical Escalation**:
   - `Breathing Difficulty`: Critical respiratory flag, automatic $-45$ pts and forces **HIGH RISK**.
   - `Dizziness`: $-20$ pts (neurological organophosphate aerosol inhalation indicator).
   - `Nausea`: $-18$ pts (systemic toxicity indicator).
   - `Eye Irritation`: $-18$ pts.
   - `Skin Irritation`: $-15$ pts.
4. **PPE Protection Factor**:
   - `None`: $-30$ pts.
   - Missing Mask during spraying: $-15$ pts.
   - Missing Gloves: $-15$ pts.
   - Fully protected: Bonus $+10$ pts.
5. **Score Interpretation**:
   - **80 – 100**: Good Safety Level (Low Risk)
   - **60 – 79**: Moderate Safety Level (Medium Risk)
   - **40 – 59**: Needs Improvement (Medium Risk)
   - **0 – 39**: High Occupational Hazard (High Risk)

---

## 9. API Reference

### Authentication & Secure Registration (with Email OTP)
- `POST /api/auth/register/request-otp` – Validates registration details, checks uniqueness, hashes 6-digit OTP, and delivers email.
- `POST /api/auth/register/verify-otp` – Validates single-use 6-digit OTP, verifies email, creates user & farmer profile, returns JWT.
- `POST /api/auth/register/resend-otp` – Issues fresh OTP with 60-second rate-limiting cooldown.
- `POST /api/auth/register` – Blocked (HTTP 403 Forbidden) to prevent direct registration bypass.
- `POST /api/auth/login` – Authenticate farmer or admin (enforces verified status).
- `GET /api/auth/profile` – Fetch current session profile.
- `PUT /api/auth/profile` – Update contact details.

### Farmer & Work Profile
- `GET /api/farmer/profile` – Retrieve farmer personal details & completion %
- `PUT /api/farmer/profile` – Update personal information
- `GET /api/work-profile` – Retrieve crops, hours, and chemical usage
- `POST /api/work-profile` – Save or update work environment

### Health Risk Assessment
- `POST /api/health-assessment` – Submit task details and calculate risk
- `GET /api/health-assessment` – Fetch assessment history for logged-in farmer
- `GET /api/health-assessment/:id` – Fetch detailed assessment result

### Safety & Recommendations
- `GET /api/recommendations` – Get prioritized contextual safety cards
- `GET /api/ppe-recommendations?activity=...` – Fetch PPE requirements & gap analysis

### AI Chatbot
- `POST /api/chat` – Submit query to AgroMed AI assistant
- `GET /api/chat/history` – Retrieve conversation history
- `DELETE /api/chat/history` – Clear chat history

### Knowledge Center & Chemicals
- `GET /api/articles` – Search and filter safety guides
- `GET /api/articles/:id` – Read full guide
- `GET /api/chemicals` – Query chemical safety database

### Admin Management (`role: ADMIN` required)
- `GET /api/admin/dashboard` – System surveillance statistics
- `GET /api/admin/farmers` – Searchable farmer directory
- `GET /api/admin/assessments` – Filterable assessment audit feed
- `POST /api/admin/articles` – Publish new safety article
- `PUT /api/admin/articles/:id` – Edit safety article
- `DELETE /api/admin/articles/:id` – Remove safety article
- `POST /api/admin/chemicals` – Index new chemical
- `PUT /api/admin/chemicals/:id` – Update chemical precautions
- `DELETE /api/admin/chemicals/:id` – Delete chemical record

---

## 10. Academic Major Project Verification

- [x] Full-Stack Monorepo Structure (`frontend/` and `backend/`)
- [x] PostgreSQL & Prisma ORM Schema with 8 models and relationships
- [x] Secure Email OTP Verification & Cryptographic SHA-256 OTP Hashing
- [x] Indian Mobile Number Validation (+91, 10-digit 6-9 series)
- [x] Rate Limiting (60s resend cooldown, max 5 failed attempts)
- [x] Direct Registration Bypass Protection (HTTP 403)
- [x] JWT Authentication & bcrypt Password Hashing
- [x] Role-Based Authorization (Farmer vs Admin)
- [x] Transparent Rule-Based Health Risk Scoring Engine
- [x] Google Gemini AI Chatbot integration with safety guardrails
- [x] Zero-setup Presentation Mode for teachers with pre-seeded demo accounts
- [x] 10+ Pre-seeded Safety Articles across all categories
- [x] Responsive, accessible UI built with React, Vite, and Tailwind CSS
- [x] Comprehensive documentation and walkthrough script

---

## 11. Email OTP Configuration & Testing

### 11.1 SMTP Environment Variables (`backend/.env`)
To enable real email dispatch for OTP codes, add your SMTP credentials to `backend/.env`:
```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_SECURE="false"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-16-char-google-app-password"
EMAIL_FROM="\"AgroMed AI\" <your-email@gmail.com>"
OTP_EXPIRY_MINUTES=5
```
> **Gmail Note**: Use a 16-character Google **App Password** (Google Account -> Security -> 2-Step Verification -> App Passwords).  
> **If SMTP is Unconfigured**: The system returns HTTP 503 Service Unavailable with a clear message to prevent false success claims.

### 11.2 Running the Automated Test Suite
Run the 17-test verification suite with zero external dependencies:
```bash
cd backend
npm test
```
This tests:
1. Valid registration details & format normalization.
2. Invalid email format rejection (e.g. `usergmail.com`, `user@`).
3. Empty email rejection.
4. Indian mobile phone validation (regex `/^(?:\+91[\-\s]?)?[6-9]\d{9}$/`).
5. Existing email duplication checks.
6. SMTP unconfigured error handling (503 Service Unavailable).
7. Incorrect OTP rejection and attempt tracking.
8. Expired OTP rejection (5-minute expiry).
9. Reusing an already-verified OTP rejection.
10. Excessive incorrect OTP attempts invalidation (locked after 5 attempts).
11. Resend OTP rate-limiting cooldown (60s).
12. Direct registration bypass prevention (403 Forbidden).
13. Verified account creation and JWT issuance.
14. Newly registered user login verification.
15. Existing demo Farmer & Admin accounts authentication.

