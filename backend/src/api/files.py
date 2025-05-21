from io import BytesIO
import os
import mimetypes

from fastapi import APIRouter, HTTPException, UploadFile, File, Request
from fastapi.responses import StreamingResponse
from unidecode import unidecode

from src.minio_client import minio_client
from src.config import settings
from src.queries.orm import AsyncORM
from src.api.auth import access_token_check


router = APIRouter(
    prefix = "/files",
    tags = ["Files"]
)


# Max length for logo (200 KB)
MAX_FILE_SIZE = 200 * 1024

ALLOWED_EXTENSIONS = {'.svg', '.png', '.jpg', '.jpeg'}


def validate_file_extension(filename: str):
    ext = os.path.splitext(filename)[-1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"Поддерживаются только файлы с расширениями: {', '.join(ALLOWED_EXTENSIONS)}.")
    return ext


@router.post("/upload_logo")
async def upload_logo(company_name: str, file: UploadFile = File(...)):
    file_bytes = await file.read()
    file_size = len(file_bytes)

    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail="Размер файла превышает максимально допустимый размер (200 КБ).",
        )
    
    validate_file_extension(file.filename)

    file_path = f"{unidecode(company_name)}/{file.filename}"

    try:
        minio_client.put_object(
                bucket_name = settings.MINIO_BUCKET_LOGOS,
                object_name = file_path,
                data = BytesIO(file_bytes),
                length = len(file_bytes),
                content_type = file.content_type
            )
        
        await AsyncORM.update_employer_logo_path(company_name, file_path)
        
        return {"message": "Файл загружен успешно!", "filename": file.filename}
    
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail="Не удалось загрузить файл. Пожалуйста, попробуйте позже.",
        )


@router.get("/get_logo")
async def get_employer_logo(company_name, request: Request):
    token_data = await access_token_check(request)

    logo_path = await AsyncORM.select_employer_logo_path_by_name(company_name)

    if not logo_path:
        raise HTTPException(status_code=404, detail="Логотип не найден")

    ext = validate_file_extension(logo_path)

    mime_type, _ = mimetypes.guess_type(logo_path)
    if not mime_type:
        mime_type = 'application/octet-stream'

    try:
        minio_response = minio_client.get_object(settings.MINIO_BUCKET_LOGOS, logo_path)
        
        return StreamingResponse(
            content = minio_response,
            media_type = mime_type,
            headers = {"Content-Disposition": f"inline; filename={os.path.basename(logo_path)}"}
        )
    
    except Exception as e:
        raise HTTPException(status_code=404, detail="Логотип не найден")