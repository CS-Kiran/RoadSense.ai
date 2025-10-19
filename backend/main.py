from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text  # Add this import
from database import engine, get_db, Base

app = FastAPI(title="Roadmap.ai API")

Base.metadata.create_all(bind=engine)

@app.get("/")
def read_root():
    return {"message": "Roadmap.ai API is running"}

@app.get("/health")
def health_check(db: Session = Depends(get_db)):
    try:
        # Wrap the SQL string in text()
        db.execute(text("SELECT 1"))
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)
