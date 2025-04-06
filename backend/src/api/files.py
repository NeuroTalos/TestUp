import uuid
from pathlib import Path

from fastapi import APIRouter, HTTPException, UploadFile, File


MAX_FILE_SIZE = 1 * 1024 * 1024
UPLOAD_DIRECTORY = "src/upload_files"

router = APIRouter(
    prefix = "/files",
    tags = ["Files"]
)


@router.post("")
async def upload_file(file: UploadFile = File(...)):
    if len(await file.read()) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail="File size exceeds the 1 MB limit."
        )
    
    await file.seek(0)

    file_id = str(uuid.uuid4())
    file_location = Path(f"{UPLOAD_DIRECTORY}/{file_id}_{file.filename}")

    with open(file_location, "wb") as f:
        content = await file.read()
        f.write(content)
    
    return {"file_id": file_id, "filename": file.filename}


# @app.get("/files/{file_id}")
# async def get_file(file_id: str):
#     return FileResponse(f"{UPLOAD_DIRECTORY}/{file_id}")


# TODO Make endpoint for download files