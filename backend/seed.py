import sys
import os
# Add current directory to path so we can import from backend
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.database import SessionLocal, engine, Base
from backend.models import User
from backend.auth import get_password_hash

def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    users = [
        {
            "full_name": "Tarun Citizen",
            "email": "tarun.citizen@test.com",
            "phone": "9876543210",
            "password": "password123",
            "role": "citizen"
        },
        {
            "full_name": "Tarun Municipal",
            "email": "tarun.municipal@test.com",
            "phone": "9876543211",
            "password": "password123",
            "role": "municipal"
        },
        {
            "full_name": "Tarun Contractor",
            "email": "tarun.contractor@test.com",
            "phone": "9876543212",
            "password": "password123",
            "role": "contractor",
            "specializations": ["road_repair", "streetlight"]
        },
        {
            "full_name": "Tarun Admin",
            "email": "tarun.admin@test.com",
            "phone": "9876543213",
            "password": "password123",
            "role": "admin"
        }
    ]

    for user_data in users:
        existing = db.query(User).filter(User.email == user_data["email"]).first()
        if not existing:
            user = User(
                full_name=user_data["full_name"],
                email=user_data["email"],
                phone=user_data["phone"],
                password_hash=get_password_hash(user_data["password"]),
                role=user_data["role"],
                specializations=user_data.get("specializations")
            )
            db.add(user)
    
    db.commit()
    db.close()
    print("Seed complete.")

if __name__ == "__main__":
    seed()
