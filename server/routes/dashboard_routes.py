from flask import Blueprint, jsonify
from config import Config
import psycopg2
import pandas as pd
from flask_jwt_extended import jwt_required, get_jwt_identity

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/dept_names', methods=['GET'])
@jwt_required()
def dashboard():
    db_params = { 
        'dbname': Config.DB_NAME,
        'user': Config.DB_USER,
        'password': Config.DB_PASSWORD,
        'host': Config.DB_HOST
    }

    query = "SELECT department_name FROM HISDEPARTMENT where department_id in (28,8,27,5,110928387);"
    
    conn = None
    cur = None
    try:
        conn = psycopg2.connect(**db_params)
        cur = conn.cursor()
        
        print(f"Executed query: {query}")
        cur.execute(query)
        rows = cur.fetchall()
        print(rows)
        
        # Convert to DataFrame
        df = pd.DataFrame(rows, columns=['department_name'])
        
        # Convert DataFrame to JSON
        result = df['department_name'].tolist()
        
        return jsonify(result), 200
    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({"error": "An error occurred while fetching department names"}), 500
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()