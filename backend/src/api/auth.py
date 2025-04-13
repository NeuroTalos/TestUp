from fastapi import APIRouter, HTTPException, Response, Depends
from authx import AuthX, AuthXConfig

from src.queries.orm import AsyncORM
from src.schemas.auth import AuthSchema

router = APIRouter(
    prefix= "/auth",
    tags = ["Authorization"],
)

config = AuthXConfig()
config.JWT_SECRET_KEY = "SECRET_KEY"
config.JWT_ACCESS_COOKIE_NAME = "access_token"
config.JWT_TOKEN_LOCATION = ["cookies"]

security = AuthX(config = config)

@router.post("/login")
async def login_student(data: AuthSchema, response: Response):
    is_valid = await AsyncORM.check_password(data.login, data.password)

    if not is_valid:
        raise HTTPException(status_code=401, detail="Неверный логин или пароль")
    else:
        token = security.create_access_token(uid="12345")
        response.set_cookie(
            key = config.JWT_ACCESS_COOKIE_NAME, 
            value = token,
            httponly = True,
            samesite = "strict",
            secure = True,
            max_age = 3600
        )
        
        return {"message": "Logged in successfully" }
    
@router.delete("/logout")
async def logout_student(response: Response):
    response.delete_cookie(config.JWT_ACCESS_COOKIE_NAME)
    
    return {"message": "Logged in successfully" }
    
@router.get("/check" , dependencies = [Depends(security.access_token_required)])
async def auth_check():
    return {"ok": True}

# TODO Make function for real user_id from data base