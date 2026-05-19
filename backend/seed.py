"""
Database seeding script to create demo users.
Run this once to populate the database with test data.
"""

from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models
import crud
import schemas

# Create tables
models.Base.metadata.create_all(bind=engine)

db = SessionLocal()

try:
    # Check if demo users already exist
    existing_customer = crud.get_user_by_username(db, "customer1")
    existing_admin = crud.get_user_by_username(db, "admin1")

    if not existing_customer:
        # Create demo customer
        customer_data = schemas.UserRegister(
            username="customer1",
            email="customer@example.com",
            password="password123"
        )
        customer = crud.create_user(db, customer_data)
        print(f"✅ Created customer: {customer.username}")
    else:
        print("ℹ️  Customer 'customer1' already exists")

    if not existing_admin:
        # Create demo admin
        admin_data = schemas.UserRegister(
            username="admin1",
            email="admin@example.com",
            password="password123"
        )
        admin = crud.create_user(db, admin_data)
        # Update role to admin
        admin.role = "admin"
        db.commit()
        print(f"✅ Created admin: {admin.username}")
    else:
        print("ℹ️  Admin 'admin1' already exists")

    print("\n✅ Database seeding completed!")
    print("\nDemo Credentials:")
    print("  Customer: customer1 / password123")
    print("  Admin:    admin1 / password123")

except Exception as e:
    print(f"❌ Error: {e}")
    db.rollback()

finally:
    db.close()
