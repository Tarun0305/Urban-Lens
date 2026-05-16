from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend import models, auth
from typing import List, Optional
from pydantic import BaseModel

router = APIRouter()

class SpecializationUpdate(BaseModel):
    specializations: List[str]
    custom_tags: List[str]

@router.get("")
def get_users(role: Optional[str] = None, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    
    query = db.query(models.User)
    if role: query = query.filter(models.User.role == role)
    return query.all()

@router.get("/leaderboard")
def get_leaderboard(db: Session = Depends(get_db)):
    # Simple leaderboard: top contractors by rating
    return db.query(models.User).filter(models.User.role == "contractor").order_by(models.User.rating.desc()).limit(10).all()

@router.get("/contractors/by-specialization")
def get_contractors_by_spec(category: str, db: Session = Depends(get_db)):
    return db.query(models.User).filter(
        models.User.role == "contractor",
        models.User.specializations.contains([category])
    ).all()

@router.put("/me/specializations")
def update_my_specs(data: SpecializationUpdate, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "contractor":
        raise HTTPException(status_code=403, detail="Only contractors can update specializations")
    
    current_user.specializations = data.specializations
    current_user.custom_tags = data.custom_tags
    db.commit()
    return {"message": "Specializations updated"}

@router.put("/{id}")
def update_user(id: int, data: dict, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    
    user = db.query(models.User).filter(models.User.id == id).first()
    for key, value in data.items():
        setattr(user, key, value)
    db.commit()
    return user
