from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from backend.database import get_db
from backend import models, auth

router = APIRouter()

@router.get("/summary")
def get_summary(db: Session = Depends(get_db)):
    total_reports = db.query(models.Report).count()
    pending = db.query(models.Report).filter(models.Report.status == "pending").count()
    bidding = db.query(models.Report).filter(models.Report.status == "bidding").count()
    in_progress = db.query(models.Report).filter(models.Report.status == "in_progress").count()
    done = db.query(models.Report).filter(models.Report.status == "done").count()
    rejected = db.query(models.Report).filter(models.Report.status == "rejected").count()
    
    categories = db.query(models.Report.category, func.count(models.Report.id)).group_by(models.Report.category).all()
    severities = db.query(models.Report.severity, func.count(models.Report.id)).group_by(models.Report.severity).all()
    
    return {
        "total_reports": total_reports,
        "pending": pending,
        "bidding": bidding,
        "in_progress": in_progress,
        "done": done,
        "rejected": rejected,
        "by_category": dict(categories),
        "by_severity": dict(severities),
        "avg_resolution_days": 4.5 # Mock data for now
    }
