import os
from datetime import datetime, timedelta, timezone
from random import randint

import jwt
from fastapi import APIRouter, HTTPException, BackgroundTasks, Request
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from jinja2 import Environment, FileSystemLoader, select_autoescape

from src.config import settings
from src.schemas.email import EmailSchema
from src.queries.orm import AsyncORM


router = APIRouter(
    prefix = "/email",
    tags = ["Email"],
)


conf = ConnectionConfig(
    MAIL_USERNAME = settings.MAIL_USERNAME,
    MAIL_PASSWORD = settings.MAIL_PASSWORD,
    MAIL_FROM = settings.MAIL_FROM,
    MAIL_PORT = settings.MAIL_PORT,
    MAIL_SERVER = settings.MAIL_SERVER,
    MAIL_STARTTLS = False,
    MAIL_SSL_TLS = True,
    USE_CREDENTIALS = True,
)


template_dir = os.path.join(os.path.dirname(__file__), "../templates")
env = Environment(
    loader=FileSystemLoader(template_dir),
    autoescape=select_autoescape(['html', 'xml'])
)


def render_reset_email(reset_link: str) -> str:
    template = env.get_template("password_reset.html")
    return template.render(reset_link = reset_link)


@router.post("/send_email")
async def send_reset_password_email(email_request: EmailSchema, background_tasks: BackgroundTasks):
    result = await AsyncORM.check_email_exist(email_request.email)

    if not result:
        raise HTTPException(status_code=200, detail="Если Email существует, письмо для сброса пароля отправлено")
    
    expire = datetime.now(timezone.utc) + timedelta(hours=1)
    reset_token = jwt.encode(
        {"sub": email_request.email, "exp": expire},
        settings.SECRET_KEY,
        algorithm="HS256"
    )

    frontend_url = f"http://{settings.FRONTEND_HOST}:{settings.FRONTEND_PORT}"
    reset_link = f"{frontend_url}/reset-password?token={reset_token}"
    
    email_body = render_reset_email(reset_link)

    message = MessageSchema(
        subject = "Сброс пароля на TestUP",
        recipients = [email_request.email],
        body = email_body,
        subtype = "html",
    )

    fm = FastMail(conf)
    background_tasks.add_task(fm.send_message, message)
    
    return {"msg": "Если Email существует, письмо для сброса пароля отправлено"}


@router.post("/update_password")
async def update_password(request: Request):
    data = await request.json()
    token = data.get("token")
    new_password = data.get("new_password")

    if not token or not new_password:
        raise HTTPException(status_code=400, detail="Токен и новый пароль обязательны")
    
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        email = payload.get("sub")

        if email is None:
            raise HTTPException(status_code=400, detail="Некорректный токен")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=400, detail="Срок действия токена истёк")
    except jwt.PyJWTError:
        raise HTTPException(status_code=400, detail="Некорректный токен")
    
    updated = await AsyncORM.update_user_password(email = email, new_password = new_password)
    if not updated:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    return {"msg": "Пароль успешно обновлён"}


@router.post("/send_verification_code")
async def send_verification_code(email_request: EmailSchema, background_tasks: BackgroundTasks):
    email = email_request.email

    if not email:
        raise HTTPException(status_code=400, detail="Email обязателен")

    code = randint(1000, 9999)
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=10)

    existing = await AsyncORM.get_verification_code_by_email(email)

    email_verification_code = {
            "email": email,
            "code": code,
            "expires_at": expires_at,
        }

    if existing:
        await AsyncORM.update_email_code(email, code, expires_at)
    else:
        await AsyncORM.store_email_code(email_verification_code)

    template = env.get_template("email_verification_code.html")
    email_body = template.render(code=code)

    message = MessageSchema(
        subject="Код подтверждения регистрации на TestUP",
        recipients=[email],
        body=email_body,
        subtype="html",
    )

    fm = FastMail(conf)
    background_tasks.add_task(fm.send_message, message)

    return {"msg": "Код отправлен на почту"}