from fastapi import FastAPI
from routes import router

app = FastAPI()

@app.get("/")
def healthcheck:
    return "working"

app.include_router(router)