from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from backend.database import get_db
from backend import models, auth
from pydantic import BaseModel

router = APIRouter()

class BidCreate(BaseModel):
    report_id: int
    quoted_price: float
    proposed_start_date: datetime
    proposed_end_date: datetime
    proposed_workforce: int
    message: str

@router.post("")
def place_bid(bid_data: BidCreate, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "contractor":
        raise HTTPException(status_code=403, detail="Only contractors can bid")
    
    report = db.query(models.Report).filter(models.Report.id == bid_data.report_id).first()
    if not report or report.status != "bidding":
        raise HTTPException(status_code=400, detail="Report not open for bidding")
    
    # Check specialization
    if report.category not in (current_user.specializations or []):
        if "other" not in (current_user.specializations or []):
             raise HTTPException(status_code=400, detail="You don't have matching specialization for this issue")

    new_bid = models.Bid(
        **bid_data.dict(),
        contractor_id=current_user.id
    )
    db.add(new_bid)
    
    # Notify municipal (simulating assignment to municipal)
    municipal_officers = db.query(models.User).filter(models.User.role == "municipal").all()
    for officer in municipal_officers:
        db.add(models.Notification(
            user_id=officer.id,
            title="New Bid Received",
            message=f"Contractor {current_user.full_name} has bid on report #{report.id}"
        ))
        
    db.commit()
    return new_bid

@router.get("/{report_id}")
def get_bids(report_id: int, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    if current_user.role not in ["municipal", "admin"]:
        raise HTTPException(status_code=403, detail="Unauthorized")
    
    bids = db.query(models.Bid).filter(models.Bid.report_id == report_id).all()
    res = []
    for bid in bids:
        contractor = db.query(models.User).filter(models.User.id == bid.contractor_id).first()
        res.append({
            "bid": bid,
            "contractor": contractor
        })
    return res

@router.put("/{bid_id}/accept")
def accept_bid(bid_id: int, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    if current_user.role not in ["municipal", "admin"]:
        raise HTTPException(status_code=403, detail="Unauthorized")
    
    bid = db.query(models.Bid).filter(models.Bid.id == bid_id).first()
    if not bid:
        raise HTTPException(status_code=404, detail="Bid not found")
    
    report = db.query(models.Report).filter(models.Report.id == bid.report_id).first()
    
    # Update bid statuses
    bid.status = "accepted"
    other_bids = db.query(models.Bid).filter(models.Bid.report_id == bid.report_id, models.Bid.id != bid_id).all()
    for ob in other_bids:
        ob.status = "rejected"
        db.add(models.Notification(
            user_id=ob.contractor_id,
            title="Bid Rejected",
            message=f"Your bid for report #{report.id} was not accepted."
        ))
    
    # Update report
    report.status = "assigned"
    report.assigned_contractor_id = bid.contractor_id
    report.assigned_by_id = current_user.id
    report.estimated_cost = bid.quoted_price
    report.work_start_date = bid.proposed_start_date
    report.work_end_date = bid.proposed_end_date
    report.workforce_count = bid.proposed_workforce
    
    # Notify winning contractor
    db.add(models.Notification(
        user_id=bid.contractor_id,
        title="Bid Accepted!",
        message=f"Your bid for report #{report.id} has been accepted. Start work soon."
    ))
    
    # Notify citizen
    db.add(models.Notification(
        user_id=report.citizen_id,
        title="Contractor Assigned",
        message=f"A contractor has been assigned to fix your reported issue #{report.id}."
    ))
    
    db.commit()
    return {"message": "Bid accepted successfully"}
