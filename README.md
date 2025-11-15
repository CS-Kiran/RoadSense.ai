# RoadSense.ai

## Overview
RoadSense.ai is a smart civic engagement platform for reporting, tracking, and resolving road infrastructure issues. It connects citizens, officials, and administrators to collaboratively improve road safety and maintenance using geospatial data, real-time reporting, and analytics.

---

## Features
- **Citizen Portal:** Report road issues (potholes, cracks, debris, etc.) with geotagged images, track status, and view public map.
- **Official Portal:** Manage assigned reports, update statuses, analytics dashboard, and team management.
- **Admin Portal:** User management, official verification, report assignment, and system analytics.
- **Real-time Notifications:** For report status changes and assignments.
- **Interactive Map:** Visualize issues and severity clusters using Leaflet.
- **Authentication:** JWT-based login for citizens, officials, and admins.
- **Role-based Access:** Separate dashboards and permissions for each user type.
- **File Uploads:** Secure upload of government IDs and report images.

---

## Backend
- **Framework:** FastAPI (Python)
- **Database:** PostgreSQL (SQLAlchemy ORM)
- **Authentication:** JWT (OAuth2)
- **File Storage:** Local filesystem for uploads
- **Key Models:**
  - User (citizen, official, admin roles)
  - Report (with images, comments, status history)
  - Official, Admin, ReportImage, ReportComment

### Main API Endpoints
- `POST /api/register/citizen` — Citizen registration
- `POST /api/register/official` — Official registration (with government ID upload)
- `POST /api/login` — Login (returns JWT)
- `GET /api/users/me` — Get current user info
- `POST /api/reports` — Create a new report (with images)
- `GET /api/reports` — List/filter reports
- `GET /api/reports/{id}` — Get report details
- `PATCH /api/reports/{id}/status` — Update report status (official/admin)
- `PATCH /api/reports/{id}/assign` — Assign report (admin)
- `GET /api/reports/nearby` — Get reports near a location
- `GET /api/reports/stats/summary` — Reports statistics (official/admin)
- `GET /api/citizens/dashboard/stats` — Citizen dashboard stats

### Database Schema (Summary)
- **User:** id, full_name, email, phone_number, password_hash, role, account_status, profile_image_url, is_active, created_at
- **Official:** id, user_id, full_name, email, phone_number, employee_id, department, designation, zone, government_id_url, role, account_status, is_active
- **Report:** id, user_id, latitude, longitude, address, issue_type, title, description, status, priority, assigned_to, assigned_zone, is_anonymous, upvotes, views, created_at
- **ReportImage:** id, report_id, filename, file_path, file_size, mime_type, display_order, uploaded_at
- **ReportStatusHistory:** id, report_id, old_status, new_status, changed_by, changed_by_role, comment, created_at
- **ReportComment:** id, report_id, user_id, user_role, comment, is_internal, created_at
- **Admin:** id, username, password_hash, full_name, email, role, is_super_admin, is_active, created_at

---

## Frontend
- **Framework:** React (Vite)
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM
- **State Management:** React Context API
- **Map:** React-Leaflet, leaflet.heat

### Main Routes/Pages
- `/` — Landing page
- `/about`, `/contact`, `/map` — Public pages
- `/login`, `/register/citizen`, `/register/official` — Auth pages
- `/citizen/*` — Citizen dashboard, report issue, my reports, notifications, profile, help center
- `/official/*` — Official dashboard, assigned reports, analytics, team/zone management, notifications, profile
- `/admin/*` — Admin dashboard, user management, official verification, reports

---

## Setup & Usage

### Prerequisites
- Python 3.12+
- Node.js 18+
- PostgreSQL

### Backend Setup
```sh
cd backend
# Create and activate virtual environment (if not already)
python -m venv roadsense-env
roadsense-env\Scripts\activate  # Windows
# Install dependencies
pip install -r requirements.txt
# Set up .env file with DB and JWT secrets
# Run migrations (if any)
uvicorn main:app --reload --host localhost --port 8000
```

### Frontend Setup
```sh
cd frontend
pnpm install  # or npm install
pnpm run dev  # or npm run dev
```

---

## Folder Structure

```
RoadSense.ai/
├── backend/         # FastAPI backend, models, API, DB
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   ├── auth.py
│   ├── database.py
│   └── ...
├── frontend/        # React frontend (Vite)
│   ├── src/
│   ├── public/
│   └── ...
├── model/           # ML models, scripts, notebooks
├── Docs/            # Project documentation (reports, schema, roadmap)
└── uploads/         # Uploaded images and files
```

---

For more details, see the `Docs/` folder for project reports, database schema, and research papers.