from pydantic import BaseModel


class FileLinksSchema(BaseModel):
    id: int
    file_path: str

    class Config:
        from_attributes = True