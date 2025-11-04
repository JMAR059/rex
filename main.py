from fastapi import FastAPI
from src.routes import router

app = FastAPI()

@app.get("/")
def healthcheck():
    return "working"

app.include_router(router)