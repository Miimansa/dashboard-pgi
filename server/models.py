from extensions import db
from sqlalchemy.orm import validates
import re
import datetime


from sqlalchemy.dialects.postgresql import JSONB

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    full_name = db.Column(db.String(120))
    bio = db.Column(db.Text)
    otp = db.Column(db.String(6))
    otp_expiry = db.Column(db.DateTime)
    is_verified = db.Column(db.Boolean, default=False)
    theme = db.Column(db.String(50), default='default')
    default_departments = db.Column(JSONB, default=[
        "Surgical Gastroenterology",
        "Paediatric Gastroenterology",
        "Gastroenterology",
        "Hematology",
        "Hepatology"
    ])
    default_labtypes = db.Column(JSONB, default=[])
    default_dischargestatus = db.Column(JSONB, default=[
        "Death",
        "Normal Discharge"
    ])


    def set_otp(self, otp):
        self.otp = otp
        self.otp_expiry = datetime.datetime.utcnow() + datetime.timedelta(minutes=5)

    def verify_otp(self, otp):
        return self.otp == otp and datetime.datetime.utcnow() <= self.otp_expiry
    @validates('username')
    def validate_username(self, key, username):
        if not username:
            raise ValueError("Username is required")
        if not re.match("^[a-zA-Z0-9_.-]+$", username):
            raise ValueError("Username can only contain letters, numbers, and ._-")
        if len(username) < 3 or len(username) > 80:
            raise ValueError("Username must be between 3 and 80 characters")
        return username

    @validates('email')
    def validate_email(self, key, email):
        if not email:
            raise ValueError("Email is required")
        if not re.match("[^@]+@[^@]+\.[^@]+", email):
            raise ValueError("Invalid email format")
        return email

    def __repr__(self):
        return f'<User {self.username}>'