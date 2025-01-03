import base64
from pathlib import Path

import uvicorn
from fastapi import FastAPI
from fastapi.responses import FileResponse

from labelui.api.models import *

app = FastAPI()

@app.get('/')
async def home():
	pass

@app.post('/image/load')
async def get_image(request: GetImageRequest):
	image_file_path = Path(request.file_path)
	image_b64 = base64.encodebytes(image_file_path.read_bytes()).decode('utf-8')
	return GetImageResponse(image=image_b64)

def start(host: str, port: int):
	uvicorn.run(app, host=host, port=port)