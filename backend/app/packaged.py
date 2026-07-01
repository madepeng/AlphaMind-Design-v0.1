import uvicorn

from app.main import app


def run() -> None:
    uvicorn.run(
        app,
        host="127.0.0.1",
        port=8000,
        access_log=False,
    )


if __name__ == "__main__":
    run()
