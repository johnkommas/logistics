import socket
import datetime

from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import uvicorn
import os

# Create directories if they don't exist
os.makedirs("static/css", exist_ok=True)
os.makedirs("static/js", exist_ok=True)
os.makedirs("templates", exist_ok=True)

app = FastAPI(title="Logistics ERP Visualization")

# Mount static files directory
app.mount("/static", StaticFiles(directory="static"), name="static")

# Set up templates
templates = Jinja2Templates(directory="templates")

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    current_year = datetime.datetime.now().year
    return templates.TemplateResponse("index.html", {"request": request, "current_year": current_year})

@app.get("/procedures/{procedure_id}", response_class=HTMLResponse)
async def get_procedure(request: Request, procedure_id: str):
    current_year = datetime.datetime.now().year
    return templates.TemplateResponse("procedure.html", {
        "request": request,
        "procedure_id": procedure_id,
        "current_year": current_year
    })

if __name__ == "__main__":
    hostname = socket.gethostname()
    ip_address = socket.gethostbyname(hostname)
    uvicorn.run("main:app", host=ip_address, port=8080, reload=True)
