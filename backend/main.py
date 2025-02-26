from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import asyncio
from dotenv import load_dotenv

# Локальные импорты
import models
from database import engine, get_db
from routers import plots, requests, admin, quiz, contacts
from telegram_bot.bot import start_bot
import crud
from schemas import ContactInfoBase

load_dotenv()

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="AltaiLand API")

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Создаем директории для статических файлов, если их нет
os.makedirs("static/images", exist_ok=True)
os.makedirs("static/uploads", exist_ok=True)

# Монтируем статические файлы
app.mount("/images", StaticFiles(directory="static/images"), name="images")
app.mount("/uploads", StaticFiles(directory="static/uploads"), name="uploads")

# Подключаем роутеры
app.include_router(plots.router, prefix="/plots", tags=["plots"])
app.include_router(requests.router, prefix="/admin", tags=["admin"])
app.include_router(admin.router)
app.include_router(quiz.router)
app.include_router(contacts.router)

# Добавим тестовый эндпоинт для проверки загрузки
@app.post("/test-upload")
async def test_upload(file: UploadFile = File(...)):
    print(f"Test upload received: {file.filename}")  # Для отладки
    return {"filename": file.filename}

@app.on_event("startup")
async def startup_event():
    # Запускаем бота в отдельном таске
    asyncio.create_task(start_bot())
    
    # Инициализируем контактную информацию, если её нет
    db = next(get_db())
    contact_info = crud.get_contact_info(db)
    if not contact_info:
        default_contacts = ContactInfoBase(
            phone="+7 (XXX) XXX-XX-XX",
            email="example@example.com",
            address="Адрес компании",
            work_hours={
                "monday_friday": "09:00 - 18:00",
                "saturday_sunday": "Выходной"
            },
            social_links={
                "whatsapp": {"enabled": False, "username": ""},
                "telegram": {"enabled": False, "username": ""},
                "vk": {"enabled": False, "username": ""}
            }
        )
        crud.create_contact_info(db, default_contacts)

@app.get("/")
async def root():
    return {"message": "Welcome to AltaiLand API"} 