from flask import Blueprint, jsonify, request
from services.lab_service import LabService
from flask_jwt_extended import jwt_required
from flask_cors import CORS, cross_origin
from SQL_Data.fetch_lab_data import fetch_lab_data_1,fetch_lab_data_2,fetch_lab_data_3
from datetime import datetime
lab_bp = Blueprint('lab', __name__)

@lab_bp.route('/', methods=['GET'])
@jwt_required()
def lab():
    # Get parameters from request
    date_from = request.args.get('date_from')
    date_to = request.args.get('date_to')
    lab_type= request.args.get('type')
    date_from = datetime.strptime(date_from, '%m-%d-%Y')
    date_to = datetime.strptime(date_to, '%m-%d-%Y')
    department_names = request.args.get('department_names', '').split(',')
    grouping_type = request.args.get('grouping_type', 'monthly').lower()
    print(grouping_type)
    if(grouping_type=='monthly'):
        date_from=date_from.strftime('%m-%Y')
        date_to=date_to.strftime('%m-%Y')
    elif(grouping_type=='weekly'):
        date_from=date_from.strftime('%Y-%m-%d %H:%M:%S')
        date_to=date_to.strftime('%Y-%m-%d %H:%M:%S')
    elif(grouping_type=='yearly'):
        date_from=date_from.strftime('%Y')
        date_to=date_to.strftime('%Y')
    lab_data_1=fetch_lab_data_1(date_from, date_to, department_names, grouping_type,lab_type)
    lab_data_2=fetch_lab_data_2(date_from, date_to, department_names, grouping_type)
    lab_data_3=fetch_lab_data_3(date_from, date_to, department_names, grouping_type)
    # Initialize the service (assuming similar logic to fetch lab data)
    print(f"Labdata1 { lab_data_1}")

    print(f"Labdata3 { lab_data_3}")
    # print(lab_data_2)
    lab_service = LabService(lab_data_1,lab_data_2,lab_data_3)

    # Get the data
    data = lab_service.get_all_lab_data(date_from, date_to, department_names, grouping_type)

    return jsonify(data) 
import psycopg2
from config import Config

db_params = {
        'dbname': Config.DB_NAME,
        'user': Config.DB_USER,
        'password': Config.DB_PASSWORD,
        'host': Config.DB_HOST
    }
@lab_bp.route('/get_type', methods=['GET'])
# @jwt_required()
def get_type():


    try:
        conn = psycopg2.connect(**db_params)
        cur = conn.cursor()
        query = """ SELECT DISTINCT lab_service_name 
            FROM (
                SELECT lab_service_name 
                FROM mv_dash_lab_one_monthly 
                ORDER BY lr_count DESC
            ) AS subquery"""
        cur.execute(query)
        rows = cur.fetchall()
        
        # Converting the fetched data into a list of strings
        lab_names = [row[0] for row in rows]

    except Exception as e:
        print(f"An error occurred: {e}")
        lab_names = []
        
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()

    return lab_names

