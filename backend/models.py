from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="customer")

    tickets = relationship("Ticket", back_populates="customer")

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)


class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(String, unique=True, index=True)

    customer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    customer = relationship("User", back_populates="tickets")

    customer_name = Column(String, nullable=False)
    customer_email = Column(String, nullable=False)

    subject = Column(String, nullable=False)
    description = Column(Text, nullable=False)

    category = Column(String, default="Other")       # ✅ added
    priority = Column(String, default="Low")          # ✅ added

    status = Column(String, default="Open")
    notes = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)