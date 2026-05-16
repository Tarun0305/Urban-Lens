import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from backend.database import get_db
from backend import models, auth
from typing import Optional

router = APIRouter()

@router.post("")
async def post_progress(
    report_id: int = Form(...),
    note: str = Form(...),
    money_spent: float = Form(0.0),
    workers_today: int = Form(0),
    photo: Optional[UploadFile] = File(None),
    video: Optional[UploadFile] = File(None),
    audio: Optional[UploadFile] = File(None),
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != "contractor":
        raise HTTPException(status_code=403, detail="Only contractors can post progress")
    
    report = db.query(models.Report).filter(models.Report.id == report_id).first()
    if not report or report.assigned_contractor_id != current_user.id:
        raise HTTPException(status_code=400, detail="Not authorized for this report")
    
    # Set status to in_progress if it was just assigned
    if report.status == "assigned":
        report.status = "in_progress"

    new_progress = models.DailyProgress(
        report_id=report_id,
        contractor_id=current_user.id,
        note=note,
        money_spent=money_spent,
        workers_today=workers_today
    )

    if photo:
        file_ext = photo.filename.split(".")[-1]
        file_name = f"{uuid.uuid4()}.{file_ext}"
        file_path = f"uploads/progress/{file_name}"
        with open(file_path, "wb") as buffer:
            buffer.write(await photo.read())
        new_progress.photo_url = f"/uploads/progress/{file_name}"

    if video:
        file_ext = video.filename.split(".")[-1]
        file_name = f"{uuid.uuid4()}.{file_ext}"
        file_path = f"uploads/progress/{file_name}"
        with open(file_path, "wb") as buffer:
            buffer.write(await video.read())
        new_progress.video_url = f"/uploads/progress/{file_name}"

    if audio:
        file_ext = audio.filename.split(".")[-1]
        file_name = f"{uuid.uuid4()}.{file_ext}"
        file_path = f"uploads/progress/{file_name}"
        with open(file_path, "wb") as buffer:
            buffer.write(await audio.read())
        new_progress.audio_url = f"/uploads/progress/{file_name}"

    db.add(new_progress)
    
    # Notify municipal + citizen
    db.add(models.Notification(
        user_id=report.citizen_id,
        title="Progress Update",
        message=f"A daily progress update was posted for issue #{report.id}"
    ))
    
    municipal_officers = db.query(models.User).filter(models.User.role == "municipal").all()
    for officer in municipal_officers:
        db.add(models.Notification(
            user_id=officer.id,
            title="Contractor Progress Update",
            message=f"Contractor posted progress for issue #{report.id}"
        ))

    db.commit()
    return new_progress

@router.get("/{report_id}")
def get_progress(report_id: int, db: Session = Depends(get_db)):
    return db.query(models.DailyProgress).filter(models.DailyProgress.report_id == report_id).all()
