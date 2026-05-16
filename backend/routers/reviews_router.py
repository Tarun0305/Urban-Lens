from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend import models, auth
from pydantic import BaseModel

router = APIRouter()

class ReviewCreate(BaseModel):
    report_id: int
    reviewee_id: int
    rating: int
    comment: str

@router.post("")
def create_review(review_data: ReviewCreate, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    report = db.query(models.Report).filter(models.Report.id == review_data.report_id).first()
    if not report or report.status != "done":
        raise HTTPException(status_code=400, detail="Can only review completed tasks")
    
    new_review = models.Review(
        **review_data.dict(),
        reviewer_id=current_user.id,
        reviewer_role=current_user.role
    )
    db.add(new_review)
    
    # Update reviewee rating
    reviewee = db.query(models.User).filter(models.User.id == review_data.reviewee_id).first()
    reviews = db.query(models.Review).filter(models.Review.reviewee_id == review_data.reviewee_id).all()
    total_rating = sum([r.rating for r in reviews]) + review_data.rating
    reviewee.rating = total_rating / (len(reviews) + 1)
    
    db.commit()
    return new_review

@router.get("/contractor/{id}")
def get_contractor_reviews(id: int, db: Session = Depends(get_db)):
    return db.query(models.Review).filter(models.Review.reviewee_id == id).all()
