from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from server.routes import router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Allow frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

@app.get("/")
def healthcheck():
    return "working"

app.include_router(router)