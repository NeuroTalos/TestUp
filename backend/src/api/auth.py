from fastapi import APIRouter, HTTPException, Response, Request
from authx import AuthX, AuthXConfig

from src.queries.orm import AsyncORM
from src.schemas.auth import AuthSchema
from src.config import settings


config = AuthXConfig()
config.JWT_SECRET_KEY = settings.SECRET_KEY
config.JWT_ACCESS_COOKIE_NAME = "access_token"
config.JWT_TOKEN_LOCATION = ["cookies"]
config.JWT_CSRF_METHODS = ["DELETE"]

security = AuthX(config = config)


async def access_token_check(request: Request):
    try:
        token_data = await security.access_token_required(request)
        return token_data
    
    except Exception as e:
        raise HTTPException(status_code=401, detail="Неавторизован")


async def current_role(request: Request) -> str:
    token_data = await security.access_token_required(request)
    role = token_data.role

    if not role:
        raise HTTPException(status_code=403, detail="Роль не указана")

    return role


router = APIRouter(
    prefix= "/auth",
    tags = ["Authorization"],
)


@router.post("/login")
async def login_user(data: AuthSchema, response: Response):
    is_valid, role = await AsyncORM.check_password(data.login, data.password)

    if not is_valid:
        raise HTTPException(status_code=401, detail="Неверный логин или пароль")
    else:
        user_id = str(await AsyncORM.select_id_by_login(data.login, role))
        token = security.create_access_token(
            uid = user_id, 
            data = {"role": role},
            csrf = True, 
            return_csrf_token=True,
        )
       
        response.set_cookie(
            key = config.JWT_ACCESS_COOKIE_NAME, 
            value = token,
            httponly = True,
            samesite = "strict",
            secure = True,
            max_age = 3600,
            path="/",
        )
        
        return {"message": "Login in successfully", "role": role}
    
@router.delete("/logout")
async def logout_user(response: Response):
    response.delete_cookie(config.JWT_ACCESS_COOKIE_NAME)
    
    return {"message": "Logged in successfully" }
    
@router.get("/check")
async def auth_check(request: Request):
    await access_token_check(request)
    
    return {"ok": True}
