from flask import Blueprint ,jsonify,request
from services.emergency_service import EmergencyServices
from flask_jwt_extended import jwt_required
from datetime import datetime
import psycopg2
from config import Config
from SQL_Data.fetch_emergency_data import fetch_emergency_data_1,fetch_emergency_data_2,fetch_emergency_data_3,fetch_emergency_data_4
import json
import pandas as pd


def piedata(df,grouping_type,factor):
    if df.empty:
        return json.dumps({"message": "No data available"}, indent=2)

    if(grouping_type=='monthly'):
        df['Date'] = pd.to_datetime(df['Date'], format='%Y-%m')
    elif(grouping_type=='yearly'):
            df['Date'] = pd.to_datetime(df['Date'], format='%Y')
    # Group by Type and sum the Count
    print(df)
    grouped = df.groupby(factor)['Count'].sum().reset_index()
    
    # Sort by Count in descending order
    grouped = grouped.sort_values('Count', ascending=False)
    print(grouped)
    result = [
            {"name": row[factor], "value": int(row['Count'])}
            for _, row in df.iterrows()
        ]


    return result

emergency_bp=Blueprint('emergency',__name__)

@emergency_bp.route('/',methods=['GET'])
@jwt_required()
def emergency():
        # Get parameters from request
    date_from = request.args.get('date_from')
    date_to = request.args.get('date_to')
    date_from = datetime.strptime(date_from, '%m-%d-%Y')
    date_to = datetime.strptime(date_to, '%m-%d-%Y')
    department_names = request.args.get('department_names', '').split(',')
    grouping_type = request.args.get('grouping_type', 'monthly').lower()
    discharge_type= request.args.get('type')
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
    # Initialize the service (assuming similar logic to fetch lab data)
    emergency_data_1=fetch_emergency_data_1(date_from, date_to, department_names, grouping_type)
    emergency_data_2=fetch_emergency_data_2(date_from, date_to, department_names, grouping_type,discharge_type)
    emergency_data_3=fetch_emergency_data_3(date_from, date_to, department_names, grouping_type)
    emergency_data_4=fetch_emergency_data_4(date_from, date_to, department_names, grouping_type)
    emergency_service = EmergencyServices(emergency_data_1,emergency_data_2,emergency_data_3,emergency_data_4)
    # Get the data
    data = emergency_service.get_all_emergency_data(date_from, date_to, department_names, grouping_type)
    return jsonify(data)

db_params = {
        'dbname': Config.DB_NAME,
        'user': Config.DB_USER,
        'password': Config.DB_PASSWORD,
        'host': Config.DB_HOST
    }
@emergency_bp.route('/get_dischargeType', methods=['GET'])
# @jwt_required()
def get_type():
        try:
            conn = psycopg2.connect(**db_params)
            cur = conn.cursor()
            query = """ SELECT DISTINCT dischargestatus 
                FROM (
                    SELECT dischargestatus 
                    FROM mv_dash_emrg_one_yearly 
                    ORDER BY dischargestatus DESC
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

@emergency_bp.route('/emergency-agg/', methods=['GET'])
@jwt_required()
def emergency_agg():
    # Get parameters from request
    date_from = request.args.get('date_from')
    date_to = request.args.get('date_to')
    discharge_type= request.args.get('discharge_types')
    date_from = datetime.strptime(date_from, '%m-%d-%Y')
    date_to = datetime.strptime(date_to, '%m-%d-%Y')
    department_names = request.args.get('department_names', '').split(',')
    factor = request.args.get('factor')
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
    lab_data_1=fetch_emergency_data_2(date_from, date_to, department_names, grouping_type,discharge_type)
    # Initialize the service (assuming similar logic to fetch lab data)
    print(f"Labdata1 { lab_data_1}")



    # Get the data
    data = piedata(lab_data_1, grouping_type,factor)

    return jsonify(data) 