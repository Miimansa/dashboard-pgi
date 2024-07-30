from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, verify_jwt_in_request
from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError
from models import User
from schemas import UserSchema, LoginSchema, ProfileUpdateSchema
from extensions import db, bcrypt
from email_service import generate_otp, send_otp_email
import json

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    schema = UserSchema()
    try:
        data = schema.load(request.json)
    except ValidationError as err:
        return jsonify(err.messages), 400

    try:
        print(data)
        hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        with open('./data/selectedcharts.json', 'r') as f:
            bio_data = json.load(f)
        new_user = User(username=data['username'], email=data['email'], password=hashed_password,bio=bio_data,full_name=data['full_name'])
        db.session.add(new_user)
        otp = generate_otp()
        new_user.set_otp(otp)
        db.session.commit()
        send_otp_email(new_user.email, otp)
    
        return jsonify({"message": "User registered. Please verify your email with the OTP sent."}), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({"message": "Username or email already exists"}), 409
    except Exception as e:
        db.session.rollback()
        print(e)
        return jsonify({"message": "An error occurred while registering user"}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    schema = LoginSchema()
    try:
        data = schema.load(request.json)
    except ValidationError as err:
        return jsonify(err.messages), 400

    try:
        print(f"Login attempt: {data['username']}, {data['password']}")
        user = User.query.filter_by(username=data['username']).first()

        if user:
            print(f"User found: {user.username}")
            print(f"Stored Password: {user.password}")  # Check stored password

            if bcrypt.check_password_hash(user.password, data['password']):
                access_token = create_access_token(identity=user.id)
                sentdata = jsonify({
                                        "access_token": access_token,
                                        "user": {
                                            "email": user.email,
                                            "full_name": user.full_name,
                                            "username": user.username,
                                            "bio": json.loads(user.bio),
                                            "theme":user.theme
        
                                        }
                                    }), 200
                print(json.loads(user.bio))
                return sentdata
            return jsonify({"message": "Invalid username or password"}), 401
        else:
            return jsonify({"message": "User not found"}), 404

    except Exception as e:
        print(f"Exception occurred during login: {str(e)}")
        return jsonify({"message": "An unexpected error occurred"}), 500



@auth_bp.route('/verify-otp', methods=['POST'])
def verify_otp():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    
    if not user:
        return jsonify({"message": "User not found"}), 404
    
    if user.verify_otp(data['otp']):
        user.is_verified = True
        db.session.commit()
        return jsonify({"message": "Email verified successfully"}), 200
    else:
        return jsonify({"message": "Invalid or expired OTP"}), 400

@auth_bp.route('/resend-otp', methods=['POST'])
def resend_otp():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    print(data) 
    if not user:
        return jsonify({"message": "User not found"}), 404
    
    otp = generate_otp()
    user.set_otp(otp)
    db.session.commit()
    # send_otp_email(user.email, otp)
    
    return jsonify({"message": "New OTP sent to your email"}), 200

@auth_bp.route('/user-settings', methods=['PUT'])
@jwt_required()
def update_bio():
    if not request.is_json:
        return jsonify({"message": "Request must be JSON"}), 415

    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"message": "User not found"}), 404

    try:
        update_data = request.get_json()
        if not update_data or not isinstance(update_data, dict):
            return jsonify({"message": "Invalid update data. Expected a JSON object."}), 400

        if user.bio is None:
            user.bio = {}
        elif isinstance(user.bio, str):
            # If bio is a string (perhaps it's a JSON string), try to parse it
            try:
                user.bio = json.loads(user.bio)
            except json.JSONDecodeError:
                return jsonify({"message": "Current bio is not a valid JSON string"}), 500

        for section, section_data in update_data.items():
            if not isinstance(section_data, dict):
                return jsonify({"message": f"Invalid data for section '{section}'. Expected a JSON object."}), 400

            if section not in user.bio:
                user.bio[section] = {}
            
            for chart, chart_data in section_data.items():
                if not isinstance(chart_data, dict):
                    return jsonify({"message": f"Invalid data for chart '{chart}' in section '{section}'. Expected a JSON object."}), 400

                if chart not in user.bio[section]:
                    user.bio[section][chart] = {}
                
                user.bio[section][chart].update(chart_data)

        db.session.commit()
        user_data = {
            "email": user.email,
            "full_name": user.full_name,
            "username": user.username,
            "bio": json.loads(user.bio),
            "theme":user.theme
        }
        
        return jsonify(user_data), 200
    except Exception as e:
        db.session.rollback()
        print(f"Error updating bio: {str(e)}")
        return jsonify({"message": "An error occurred while updating bio", "error": str(e)}), 500
@auth_bp.route('/get-bio', methods=['GET'])
@jwt_required()
def get_bio():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"message": "User not found"}), 404

    return jsonify({"bio": user.bio}), 200

@auth_bp.route('/profile', methods=['GET', 'PUT'])
@jwt_required()
def profile():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"message": "User not found"}), 404

    if request.method == 'GET':
        schema = UserSchema(exclude=['password'])
        return jsonify(schema.dump(user)), 200

    elif request.method == 'PUT':
        schema = ProfileUpdateSchema()
        try:
            data = schema.load(request.json)
        except ValidationError as err:
            return jsonify(err.messages), 400

        try:
            for key, value in data.items():
                setattr(user, key, value)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            return jsonify({"message": "An error occurred while updating profile"}), 500

        return jsonify({"message": "Profile updated successfully"}), 200


@auth_bp.route('/update-theme', methods=['PUT'])
@jwt_required()
def update_theme():
    if not request.is_json:
        return jsonify({"message": "Request must be JSON"}), 415
    
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
  
    if not user:
        return jsonify({"message": "User not found"}), 404

    try:
        data = request.get_json()
        new_theme = data.get('theme')
        if not new_theme or not isinstance(new_theme, str):
            return jsonify({"message": "Invalid theme. Expected a non-empty string."}), 400

        user.theme = new_theme
        db.session.commit()

        return jsonify({"message": "Theme updated successfully", "theme": user.theme}), 200
    except Exception as e:
        db.session.rollback()
        print(f"Error updating theme: {str(e)}")
        return jsonify({"message": "An error occurred while updating theme", "error": str(e)}), 500

@auth_bp.route('/check-token', methods=['GET'])
def check_token():
    try:
        verify_jwt_in_request()
        return jsonify({"message": "Token is valid", "valid": True}), 200
    except Exception as e:
        return jsonify({"message": "Token is invalid or expired", "valid": False}), 401

from flask import jsonify
from email_service import send_otp_email

@auth_bp.route('/reset-password-request', methods=['POST'])
def reset_password_request():
    data = request.get_json()
    email = data.get('email')
    
    if not email:
        return jsonify({"message": "Email is required"}), 400

    user = User.query.filter_by(email=email).first()
    
    if not user:
        return jsonify({"message": "User not found"}), 404
    
    if not user.is_verified:
        return jsonify({"message": "Email not verified"}), 403

    otp = generate_otp()
    user.set_otp(otp)
    db.session.commit()
    
    send_otp_email(user.email, otp)
    
    return jsonify({"message": "OTP sent to your email for password reset"}), 200

@auth_bp.route('/verify-reset-otp', methods=['POST'])
def verify_reset_otp():
    data = request.get_json()
    email = data.get('email')
    otp = data.get('otp')
    
    if not email or not otp:
        return jsonify({"message": "Email and OTP are required"}), 400

    user = User.query.filter_by(email=email).first()
    
    if not user:
        return jsonify({"message": "User not found"}), 404

    if user.verify_otp(otp):
        return jsonify({"message": "OTP verified successfully"}), 200
    else:
        return jsonify({"message": "Invalid or expired OTP"}), 400

@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    email = data.get('email')
    new_password = data.get('new_password')
    
    if not email or not new_password :
        return jsonify({"message": "Email, new password"}), 400

    user = User.query.filter_by(email=email).first()
    
    if not user:
        return jsonify({"message": "User not found"}), 404


    hashed_password = bcrypt.generate_password_hash(new_password).decode('utf-8')
    user.password = hashed_password
    db.session.commit()

    return jsonify({"message": "Password reset successfully"}), 200

@auth_bp.route('/new-password', methods=['POST'])
def change_password():
    data = request.get_json()
    email = data.get('email')
    old_password = data.get('old_password')
    new_password = data.get('new_password')
    
    if not email or not old_password or not new_password:
        return jsonify({"message": "Email, old password, and new password are required"}), 400

    user = User.query.filter_by(email=email).first()
    
    if not user:
        return jsonify({"message": "User not found"}), 404

    # Check if the old password is correct
    if not bcrypt.check_password_hash(user.password, old_password):
        return jsonify({"message": "Incorrect old password"}), 401

    # Hash the new password and update
    hashed_password = bcrypt.generate_password_hash(new_password).decode('utf-8')
    user.password = hashed_password
    db.session.commit()

    return jsonify({"message": "Password changed successfully"}), 200

@auth_bp.errorhandler(Exception)
def handle_exception(e):
    # Log the error here (e.g., using app.logger.error(str(e)))
    print(e)
    return jsonify({"message": "An unexpected error occurred"}), 500
