from io import BytesIO
import os
import mimetypes
import zipfile

from fastapi import (
    APIRouter, 
    HTTPException, 
    UploadFile, 
    File, 
    Request, 
    Depends,
    Body,
)
from fastapi.responses import StreamingResponse
from unidecode import unidecode
from async_lru import alru_cache

from src.minio_client import minio_client
from src.config import settings
from src.queries.orm import AsyncORM
from src.api.auth import access_token_check, current_role


router = APIRouter(
    prefix = "/files",
    tags = ["Files"]
)


# Settings for logo
MAX_LOGO_SIZE = 200 * 1024 # 200 KB
ALLOWED_LOGO_EXTENSIONS = {'.svg', '.png', '.jpg', '.jpeg'}

# Settings for files
MAX_FILE_SIZE = 20 * 1024 * 1024 # 20 MB


def validate_logo_extension(filename: str):
    ext = os.path.splitext(filename)[-1].lower()
    if ext not in ALLOWED_LOGO_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"Поддерживаются только файлы с расширениями: {', '.join(ALLOWED_LOGO_EXTENSIONS)}.")
    return ext

def check_files_quantity(files: list[UploadFile] = File(...)):
    if len(files) > 5:
        raise HTTPException(
            status_code=413,
            detail="Количество файлов превышает допустимое число. Максиум: 5 файлов",
        )


@router.post("/upload_logo/{company_name}")
async def upload_logo(company_name: str, file: UploadFile = File(...)):    
    file_bytes = await file.read()
    file_size = len(file_bytes)

    if file_size > MAX_LOGO_SIZE:
        raise HTTPException(
            status_code=400,
            detail="Размер файла превышает максимально допустимый размер (200 КБ).",
        )
    
    validate_logo_extension(file.filename)

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
        
        return {"message": "Файл загружен успешно!"}
    
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail="Не удалось загрузить файл. Пожалуйста, попробуйте позже.",
        )


@router.get("/get_logo/{company_name}")
async def get_employer_logo(company_name: str):
    @alru_cache(maxsize=128)
    async def _get_logo_path(name: str):
        return await AsyncORM.select_employer_logo_path_by_name(name)

    logo_path = await _get_logo_path(company_name)

    if not logo_path:
        raise HTTPException(status_code=404, detail="Логотип не найден")

    ext = validate_logo_extension(logo_path)

    mime_type, _ = mimetypes.guess_type(logo_path)
    if not mime_type:
        mime_type = 'application/octet-stream'

    try:
        minio_response = minio_client.get_object(settings.MINIO_BUCKET_LOGOS, logo_path)
        
        return StreamingResponse(
            content = minio_response,
            media_type = mime_type,
            headers = {
                "Cache-Control": "public, max-age=14400",
                "Content-Disposition": f"inline; filename={os.path.basename(logo_path)}",
            }
        )
    
    except Exception as e:
        raise HTTPException(status_code=404, detail="Логотип не найден")


@router.post("/upload_task_files/{task_id}")
async def upload_task_files(
    task_id: int,
    request: Request,
    files: list[UploadFile] = File(...),
    token_data = Depends(access_token_check),
    ):
    role = await current_role(request)

    if role == "employer":
        check_files_quantity(files)

        task_file_links = []
        for file in files:
            file_bytes = await file.read()
            if len(file_bytes) > MAX_FILE_SIZE:
                raise HTTPException(
                    status_code=400,
                    detail=f"Файл {file.filename} превышает максимальный размер 20 МБ."
                )

            file_path = f"task_{task_id}/{file.filename}"
        
            try:
                minio_client.put_object(
                bucket_name = settings.MINIO_BUCKET_TASKS,
                object_name = file_path,
                data = BytesIO(file_bytes),
                length = len(file_bytes),
                content_type = file.content_type
            )
                task_file_links.append({"file_path": file_path, "task_id": task_id})

            except Exception:
                raise HTTPException(status_code=500, detail=f"Ошибка при загрузке файла {file.filename}")

        await AsyncORM.insert_task_file_links(task_file_links)

        return {"message": "Файлы успешно загружены!"}

    else:
        raise HTTPException(status_code=403, detail="Доступ к ресурсу ограничен для вашей роли")


@router.post("/get_task_files/")
async def get_task_files(
    file_paths: list[str],
    token_data = Depends(access_token_check),
    ):
    
    if not file_paths:
        return {"message": "Нет файлов для скачивания"}
    
    zip_buffer = BytesIO()

    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
        for path in file_paths:
            try:
                response = minio_client.get_object(settings.MINIO_BUCKET_TASKS, path)
                file_data = response.read()
                zip_file.writestr(os.path.basename(path), file_data)
            except Exception:
                raise HTTPException(status_code=404, detail=f"Файл {path} не найден")

    zip_buffer.seek(0)

    return StreamingResponse(
        content=zip_buffer,
        media_type="application/zip",
        headers={
            "Content-Disposition": "attachment; filename=task_files.zip",
            "Cache-Control": "public, max-age=14400"
        }
    )


@router.post("/upload_solution_files/{solution_id}")
async def upload_solution_files(
    solution_id: int,
    request: Request,
    files: list[UploadFile] = File(...),
    token_data = Depends(access_token_check),
    ):
    role = await current_role(request)

    if role == "student":
        check_files_quantity(files)

        solution_file_links = []
        for file in files:
            file_bytes = await file.read()
            if len(file_bytes) > MAX_FILE_SIZE:
                raise HTTPException(
                    status_code=400,
                    detail=f"Файл {file.filename} превышает максимальный размер 20 МБ."
                )

            file_path = f"solution_{solution_id}/{file.filename}"
        
            try:
                minio_client.put_object(
                bucket_name = settings.MINIO_BUCKET_SOLUTIONS,
                object_name = file_path,
                data = BytesIO(file_bytes),
                length = len(file_bytes),
                content_type = file.content_type
            )
                solution_file_links.append({"file_path": file_path, "solution_id": solution_id})

            except Exception:
                raise HTTPException(status_code=500, detail=f"Ошибка при загрузке файла {file.filename}")

        await AsyncORM.insert_solution_file_links(solution_file_links)

        return {"message": "Файлы успешно загружены!"}

    else:
        raise HTTPException(status_code=403, detail="Доступ к ресурсу ограничен для вашей роли")
    

@router.post("/get_solution_files/")
async def get_solution_files(
    file_paths: list[str],
    token_data = Depends(access_token_check),
    ):
    
    if not file_paths:
        return {"message": "Нет файлов для скачивания"}
    
    zip_buffer = BytesIO()

    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
        for path in file_paths:
            try:
                response = minio_client.get_object(settings.MINIO_BUCKET_SOLUTIONS, path)
                file_data = response.read()
                zip_file.writestr(os.path.basename(path), file_data)
            except Exception:
                raise HTTPException(status_code=404, detail=f"Файл {path} не найден")

    zip_buffer.seek(0)

    return StreamingResponse(
        content=zip_buffer,
        media_type="application/zip",
        headers={
            "Content-Disposition": "attachment; filename=solution_files.zip",
            "Cache-Control": "public, max-age=14400"
        }
    )