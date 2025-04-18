from fastapi import APIRouter, HTTPException, Response, Request
import secrets

from src.queries.orm import AsyncORM
from src.schemas.auth import AuthSchema
from src.api.exeptions import security, config, access_token_check

router = APIRouter(
    prefix= "/auth",
    tags = ["Authorization"],
)


@router.post("/login")
async def login_student(data: AuthSchema, response: Response):
    is_valid = await AsyncORM.check_password(data.login, data.password)

    if not is_valid:
        raise HTTPException(status_code=401, detail="Неверный логин или пароль")
    else:
        student_id = str(await AsyncORM.select_id_by_login(data.login))
        token = security.create_access_token(uid = student_id, csrf = True, return_csrf_token=True)
       
        response.set_cookie(
            key = config.JWT_ACCESS_COOKIE_NAME, 
            value = token,
            httponly = True,
            samesite = "strict",
            secure = True,
            max_age = 3600,
            path="/",
        )
        
        return {"message": "Login in successfully" }
    
@router.delete("/logout")
async def logout_student(response: Response):
    response.delete_cookie(config.JWT_ACCESS_COOKIE_NAME)
    
    return {"message": "Logged in successfully" }
    
@router.get("/check")
async def auth_check(request: Request):
    await access_token_check(request)
    
    return {"ok": True}
