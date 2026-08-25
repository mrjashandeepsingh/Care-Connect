import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse

from backend.app.config import settings
from backend.app.database import ensure_database_schema

from fastapi import FastAPI

app = FastAPI()
# Routers
from backend.app.routers import auth, doctors, queue, ai, reviews, patients

@asynccontextmanager
async def lifespan(app: FastAPI):
    ensure_database_schema()
    yield

app = FastAPI(
    title=settings.APP_NAME,
    description="Care Connect patient and doctor healthcare access platform",
    version="2.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
STATIC_DIR = os.path.join(BASE_DIR, "frontend", "static")
TEMPLATES_DIR = os.path.join(BASE_DIR, "frontend", "templates")

if os.path.exists(STATIC_DIR):
    app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")
templates = Jinja2Templates(directory=TEMPLATES_DIR) if os.path.exists(TEMPLATES_DIR) else None

app.include_router(auth.router)
app.include_router(doctors.router)
app.include_router(queue.router)
app.include_router(ai.router)
app.include_router(reviews.router)
app.include_router(patients.router)

@app.get("/api/health")
def health_check():
    ensure_database_schema()
    return {
        "status": "ok",
        "service": "Care Connect API"
    }


@app.get("/", response_class=HTMLResponse)
def page_landing(request: Request):
    return templates.TemplateResponse("index.html", {"request": request, "page_title": "Care Connect — Know where to go. Know when to go."})

@app.get("/how-it-works", response_class=HTMLResponse)
def page_how_it_works(request: Request):
    return templates.TemplateResponse("index.html", {"request": request, "page_title": "How Care Connect Works"})

@app.get("/for-doctors", response_class=HTMLResponse)
def page_for_doctors(request: Request):
    return templates.TemplateResponse("index.html", {"request": request, "page_title": "Care Connect for Healthcare Providers"})

@app.get("/login", response_class=HTMLResponse)
def page_login(request: Request):
    return templates.TemplateResponse("login.html", {"request": request, "page_title": "Log In — Care Connect"})

@app.get("/signup", response_class=HTMLResponse)
def page_signup(request: Request):
    return templates.TemplateResponse("signup.html", {"request": request, "page_title": "Patient Registration — Care Connect"})

@app.get("/patient/signup", response_class=HTMLResponse)
def page_patient_signup(request: Request):
    return templates.TemplateResponse("signup.html", {"request": request, "page_title": "Patient Registration — Care Connect"})

@app.get("/doctor/register", response_class=HTMLResponse)
def page_doctor_register(request: Request):
    return templates.TemplateResponse("doctor_register.html", {"request": request, "page_title": "Doctor Registration — Care Connect"})

@app.get("/patient/dashboard", response_class=HTMLResponse)
def page_patient_dashboard(request: Request):
    return templates.TemplateResponse("patient_dashboard.html", {"request": request, "page_title": "Patient Dashboard — Care Connect"})

@app.get("/patient/search", response_class=HTMLResponse)
@app.get("/patient/doctors", response_class=HTMLResponse)
def page_doctor_search(request: Request):
    return templates.TemplateResponse("doctor_search.html", {"request": request, "page_title": "Find Healthcare Providers — Care Connect"})

@app.get("/patient/doctors/{doctor_id}", response_class=HTMLResponse)
def page_doctor_profile(doctor_id: int, request: Request):
    return templates.TemplateResponse("doctor_profile.html", {"request": request, "doctor_id": doctor_id, "page_title": "Doctor Profile — Care Connect"})

@app.get("/patient/queue", response_class=HTMLResponse)
def page_patient_queue(request: Request):
    return templates.TemplateResponse("patient_queue.html", {"request": request, "page_title": "Live Queue Tracker — Care Connect"})

@app.get("/patient/profile", response_class=HTMLResponse)
def page_patient_profile(request: Request):
    return templates.TemplateResponse("patient_profile.html", {"request": request, "page_title": "Patient Profile — Care Connect"})

@app.get("/doctor/dashboard", response_class=HTMLResponse)
@app.get("/doctor/queue", response_class=HTMLResponse)
@app.get("/doctor/profile", response_class=HTMLResponse)
def page_doctor_dashboard(request: Request):
    return templates.TemplateResponse("doctor_dashboard.html", {"request": request, "page_title": "Doctor Workspace — Care Connect"})

@app.get("/doctor/login", response_class=HTMLResponse)
def page_doctor_login(request: Request):
    return templates.TemplateResponse("login.html", {"request": request, "page_title": "Doctor Portal Login — Care Connect"})

@app.get("/doctor-register", response_class=HTMLResponse)
def legacy_doctor_register(request: Request):
    return templates.TemplateResponse("doctor_register.html", {"request": request, "page_title": "Doctor Registration — Care Connect"})

@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "message": "Care Connect backend is running"
    }

