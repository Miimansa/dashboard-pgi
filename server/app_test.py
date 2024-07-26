from flask import Flask
from flask_cors import CORS
from datetime import timedelta
from config import Config
from extensions import db, jwt, bcrypt,mail

def create_app():
    app = Flask(__name__)
    CORS(app, support_credentials=True)
    app.config.from_object(Config)
    # Configure database
    app.config['SQLALCHEMY_DATABASE_URI'] = f"postgresql://{Config.DB_USER}:{Config.DB_PASSWORD}@{Config.DB_HOST}/{Config.DB_NAME}"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Configure JWT
    app.config['JWT_SECRET_KEY'] = Config.JWT_SECRET_KEY
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    bcrypt.init_app(app)
    mail.init_app(app)
    # Import and register blueprints
    from routes.home_routes import home_bp
    from routes.lab_routes import lab_bp
    from routes.dashboard_routes import dashboard_bp
    from routes.resources_routes import resources_bp
    from routes.emergency_routes import emergency_bp
    from routes.disease_routes import disease_bp
    from routes.auth_routes import auth_bp

    app.register_blueprint(dashboard_bp, url_prefix='/dashboard')
    app.register_blueprint(home_bp, url_prefix='/home')
    app.register_blueprint(lab_bp, url_prefix='/lab')
    app.register_blueprint(resources_bp, url_prefix='/resources')
    app.register_blueprint(emergency_bp, url_prefix='/emergency')
    app.register_blueprint(disease_bp, url_prefix='/disease')
    app.register_blueprint(auth_bp, url_prefix='/auth')

    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True,port=5001)