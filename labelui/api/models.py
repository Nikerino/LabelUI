import typing as t

from pydantic import BaseModel, Field


class GetImageRequest(BaseModel):
	file_path: str

class GetImageResponse(BaseModel):
	image: str