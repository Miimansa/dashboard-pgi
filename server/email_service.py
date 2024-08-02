from flask_mail import Message
from extensions import mail
import pyotp

def generate_otp():
    totp = pyotp.TOTP(pyotp.random_base32(), interval=300)  # 5 minutes validity
    return totp.now()

def send_otp_email(email, otp):
    msg = Message('Your OTP for Authentication',
                  recipients=[email])
    msg.body = f'Your OTP is: {otp}. It will expire in 5 minutes.'
    print("Sending Mail")
    mail.send(msg)
    print("Mail Sent")