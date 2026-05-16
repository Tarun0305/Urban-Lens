from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime, Text, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from backend.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String)
    email = Column(String, unique=True, index=True)
    phone = Column(String)
    password_hash = Column(String)
    role = Column(String)  # "citizen" | "municipal" | "contractor" | "admin"
    language = Column(String, default="en")  # "en" | "kn" | "hi"
    points = Column(Integer, default=0)
    rating = Column(Float, default=5.0)
    avatar_url = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Contractor-specific fields
    specializations = Column(JSON, nullable=True) # JSON array: ["road_repair", "tree_fall", "streetlight", "garbage", "other"]
    custom_tags = Column(JSON, nullable=True) # JSON array
    years_experience = Column(Integer, nullable=True)
    bio = Column(Text, nullable=True)

class Report(Base):
    __tablename__ = "reports"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(Text)
    category = Column(String) # "pothole" | "garbage" | "streetlight" | "tree_fall" | "other"
    status = Column(String, default="pending") # "pending" | "ai_verified" | "bidding" | "assigned" | "in_progress" | "done" | "rejected"
    
    citizen_id = Column(Integer, ForeignKey("users.id"))
    assigned_contractor_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    assigned_by_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    latitude = Column(Float)
    longitude = Column(Float)
    address = Column(String)
    area = Column(String)
    road_name = Column(String, nullable=True)
    cross_street = Column(String, nullable=True)

    ai_verified = Column(Boolean, default=False)
    ai_confidence = Column(Float, nullable=True)
    ai_result = Column(Text, nullable=True)
    ai_duplicate_flagged = Column(Boolean, default=False)
    ai_cluster_group_id = Column(String, nullable=True)

    image_url = Column(String, nullable=True)
    video_url = Column(String, nullable=True)
    audio_url = Column(String, nullable=True)
    
    description_language = Column(String, default="en") # "en" | "kn" | "hi"
    severity = Column(String, default="low") # "low" | "medium" | "high"
    ai_severity_assessment = Column(Text, nullable=True)
    estimated_cost = Column(Float, nullable=True)
    
    work_start_date = Column(DateTime, nullable=True)
    work_end_date = Column(DateTime, nullable=True)
    workforce_count = Column(Integer, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    resolved_at = Column(DateTime, nullable=True)

class Bid(Base):
    __tablename__ = "bids"
    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(Integer, ForeignKey("reports.id"))
    contractor_id = Column(Integer, ForeignKey("users.id"))
    quoted_price = Column(Float)
    proposed_start_date = Column(DateTime)
    proposed_end_date = Column(DateTime)
    proposed_workforce = Column(Integer)
    message = Column(Text)
    status = Column(String, default="pending") # "pending" | "accepted" | "rejected"
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class DailyProgress(Base):
    __tablename__ = "daily_progress"
    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(Integer, ForeignKey("reports.id"))
    contractor_id = Column(Integer, ForeignKey("users.id"))
    note = Column(Text)
    photo_url = Column(String, nullable=True)
    video_url = Column(String, nullable=True)
    audio_url = Column(String, nullable=True)
    money_spent = Column(Float, default=0.0)
    workers_today = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Review(Base):
    __tablename__ = "reviews"
    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(Integer, ForeignKey("reports.id"))
    reviewer_id = Column(Integer, ForeignKey("users.id"))
    reviewee_id = Column(Integer, ForeignKey("users.id"))
    reviewer_role = Column(String) # "citizen" | "municipal"
    rating = Column(Integer) # 1-5
    comment = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String)
    message = Column(Text)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
