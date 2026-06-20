# Osteoporosis Detection System

An AI-powered clinical system designed for the automated detection and severity analysis of osteoporosis from medical imagery. This system leverages a Deep Learning model to analyze patient scans and provides an intuitive, secure, and modern web interface for clinicians to upload multi-image cases and review detailed visual reports.

## ✨ Features

- **AI-Powered Detection**: Utilizes a customized Deep Learning model built with TensorFlow/Keras for analyzing scans.
- **Advanced Visual Results**: Features an interactive dashboard with Chart.js to show prediction confidence, severity coding, and detailed analysis breakdown.
- **Clinical Workflow Support**: Seamlessly handle multi-image batch uploads with a clean drag-and-drop interface.
- **Secure Authentication**: Protected routes with JWT token-based authentication (Login / Signup) via Django REST Framework SimpleJWT.
- **Patient History**: Maintain a searchable history of past patient uploads and diagnostic predictions.
- **Modern Responsive UI**: Fully responsive and polished interface built with React and Tailwind CSS, featuring smooth transitions and clinical-grade aesthetics.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Charts**: Chart.js & react-chartjs-2
- **Data Fetching**: Axios

### Backend
- **Framework**: Django & Django REST Framework (DRF)
- **Machine Learning**: TensorFlow & NumPy
- **Authentication**: JWT (JSON Web Tokens)
- **Database**: PostgreSQL / SQLite (configured via `dj-database-url`)
- **Image Processing**: Pillow

---

## 🚀 Setup and Installation

### Prerequisites
- Python 3.9+
- Node.js 18+
- npm or yarn

### 1. Backend Setup

Open a terminal and navigate to the `backend` directory:

```bash
cd backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations
python manage.py migrate

# Start the development server
python manage.py runserver
```

> **Note:** Make sure you have your `.env` configured inside the `backend` directory for any database credentials and your secret keys.

### 2. Frontend Setup

Open a new terminal and navigate to the `frontend` directory:

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will start typically on `http://localhost:5173`.

---

## 📁 Project Structure

```text
osteoporosis-system/
│
├── backend/                   # Django REST Framework backend
│   ├── accounts/              # User authentication and JWT management
│   ├── core/                  # Main Django project settings and URLs
│   ├── predictions/           # ML model integration and prediction logic
│   ├── media/                 # Uploaded images and scans
│   ├── requirements.txt       # Python dependencies
│   └── manage.py              # Django entry point
│
├── frontend/                  # React + Vite frontend
│   ├── public/                # Static assets
│   ├── src/
│   │   ├── components/        # Reusable React components (Navbar, ProtectedRoute)
│   │   ├── pages/             # Application views (Dashboard, Upload, History, Results)
│   │   ├── services/          # Axios API configuration (api.js)
│   │   ├── index.css          # Global Tailwind styles
│   │   └── App.jsx            # Main app component and router
│   ├── package.json           # Node dependencies
│   └── tailwind.config.js     # Tailwind CSS configuration
│
└── model/                     # Pre-trained deep learning models
    └── model.h5               # Main inference model
```

---


