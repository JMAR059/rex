from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from src.routes import router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def healthcheck():
    return "working"

app.include_router(router)