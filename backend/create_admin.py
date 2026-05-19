"""
Run this ONCE to create the admin user:
    python create_admin.py
"""
from database import SessionLocal
from models import User
from auth import hash_password

db = SessionLocal()

existing = db.query(User).filter(User.username == "admin").first()
if existing:
    print("⚠️  Admin already exists!")
    print(f"   Username : {existing.username}")
    print(f"   Email    : {existing.email}")
    print(f"   Role     : {existing.role}")
else:
    admin = User(
        username="admin",
        email="admin@crm.com",
        hashed_password=hash_password("admin123"),
        role="admin",
    )
    db.add(admin)
    db.commit()
    print("✅ Admin created successfully!")
    print("   Username : admin")
    print("   Password : admin123")
    print("   Email    : admin@crm.com")

db.close()