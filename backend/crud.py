from sqlalchemy.orm import Session
from models import User, Ticket
from schemas import UserRegister, TicketCreate, TicketUpdate
from auth import hash_password, verify_password
from datetime import datetime
import random
import string


# ==================== USER OPERATIONS ====================

def get_user_by_username(db: Session, username: str) -> User:
    return db.query(User).filter(User.username == username).first()


def get_user_by_email(db: Session, email: str) -> User:
    return db.query(User).filter(User.email == email).first()


def get_user_by_id(db: Session, user_id: int) -> User:
    return db.query(User).filter(User.id == user_id).first()


def get_all_users(db: Session):
    return db.query(User).filter(User.role == "customer").all()


def create_user(db: Session, user: UserRegister, role: str = "customer") -> User:
    if get_user_by_username(db, user.username):
        return None

    if get_user_by_email(db, user.email):
        return None

    db_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hash_password(user.password),
        role=role,
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user


def authenticate_user(db: Session, username: str, password: str) -> User:
    user = get_user_by_username(db, username)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user


# ==================== TICKET OPERATIONS ====================

def generate_ticket_id(db: Session) -> str:
    while True:
        ticket_id = f"TKT-{''.join(random.choices(string.digits, k=4))}"
        existing = db.query(Ticket).filter(Ticket.ticket_id == ticket_id).first()
        if not existing:
            return ticket_id


def create_ticket(db: Session, ticket: TicketCreate, user_id: int) -> Ticket:
    user = get_user_by_id(db, user_id)
    if not user:
        return None

    db_ticket = Ticket(
        ticket_id=generate_ticket_id(db),
        customer_id=user_id,
        customer_name=user.username,
        customer_email=user.email,
        subject=ticket.subject,
        description=ticket.description,
        category=ticket.category,     # ✅ saved
        priority=ticket.priority,     # ✅ saved
        status="Open",
    )
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    return db_ticket


def get_ticket(db: Session, ticket_id: str) -> Ticket:
    return db.query(Ticket).filter(Ticket.ticket_id == ticket_id).first()


def get_user_tickets(db: Session, user_id: int, status: str = None, search: str = None):
    query = db.query(Ticket).filter(Ticket.customer_id == user_id)

    if status:
        query = query.filter(Ticket.status == status)

    if search:
        search_term = f"%{search}%"
        query = query.filter(
            Ticket.subject.ilike(search_term) |
            Ticket.description.ilike(search_term) |
            Ticket.ticket_id.ilike(search_term)
        )

    return query.order_by(Ticket.created_at.desc()).all()


def get_all_tickets(db: Session, status: str = None, search: str = None):
    query = db.query(Ticket)

    if status:
        query = query.filter(Ticket.status == status)

    if search:
        search_term = f"%{search}%"
        query = query.filter(
            Ticket.customer_name.ilike(search_term) |
            Ticket.customer_email.ilike(search_term) |
            Ticket.subject.ilike(search_term) |
            Ticket.ticket_id.ilike(search_term)
        )

    return query.order_by(Ticket.created_at.desc()).all()


def update_ticket(db: Session, ticket_id: str, ticket: TicketUpdate) -> Ticket:
    db_ticket = get_ticket(db, ticket_id)
    if not db_ticket:
        return None

    if ticket.status:
        db_ticket.status = ticket.status
    if ticket.notes is not None:
        db_ticket.notes = ticket.notes

    db_ticket.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_ticket)
    return db_ticket


def delete_ticket(db: Session, ticket_id: str) -> bool:
    db_ticket = get_ticket(db, ticket_id)
    if not db_ticket:
        return False
    db.delete(db_ticket)
    db.commit()
    return True


def get_stats(db: Session):
    all_tickets = db.query(Ticket).all()
    total_customers = db.query(User).filter(User.role == "customer").count()
    return {
        "total": len(all_tickets),
        "open": sum(1 for t in all_tickets if t.status == "Open"),
        "in_progress": sum(1 for t in all_tickets if t.status == "In Progress"),
        "closed": sum(1 for t in all_tickets if t.status == "Closed"),
        "total_customers": total_customers,
    }
