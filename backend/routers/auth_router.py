from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from backend.database import get_db
from backend import models, auth
from pydantic import BaseModel, EmailStr
from typing import Optional, List

router = APIRouter()

class UserRegister(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    password: str
    role: str
    language: str = "en"
    specializations: Optional[List[str]] = None
    custom_tags: Optional[List[str]] = None
    years_experience: Optional[int] = None
    bio: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

@router.post("/register")
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user_data.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_user = models.User(
        full_name=user_data.full_name,
        email=user_data.email,
        phone=user_data.phone,
        password_hash=auth.get_password_hash(user_data.password),
        role=user_data.role,
        language=user_data.language,
        specializations=user_data.specializations,
        custom_tags=user_data.custom_tags,
        years_experience=user_data.years_experience,
        bio=user_data.bio
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User created successfully"}

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    user_dict = {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "role": user.role,
        "language": user.language
    }
    
    return {"access_token": access_token, "token_type": "bearer", "user": user_dict}

@router.get("/me")
def get_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user
