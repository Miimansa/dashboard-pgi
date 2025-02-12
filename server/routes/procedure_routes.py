from flask import Blueprint, jsonify, request
from services.procedure_service import ProcedureService
from flask_jwt_extended import jwt_required
from flask_cors import CORS, cross_origin
from SQL_Data.fetch_procedure_data import fetch_procedure_data_1,fetch_procedure_data_2,fetch_procedure_data_3
from datetime import datetime
import json
import pandas as pd


def get_patient_count_by_department_proceduretests(df,grouping_type,factor):
    if df.empty:
        return json.dumps({"message": "No data available"}, indent=2)

    if(grouping_type=='monthly'):
        df['Date'] = pd.to_datetime(df['Date'], format='%Y-%m')
    elif(grouping_type=='yearly'):
            df['Date'] = pd.to_datetime(df['Date'], format='%Y')
    # Group by Type and sum the Count
    print(df)
    grouped = df.groupby(factor)['procedure Record Count'].sum().reset_index()
    
    # Sort by Count in descending order
    grouped = grouped.sort_values('procedure Record Count', ascending=False)
    print(grouped)
    result = [
            {"name": row[factor], "value": int(row['procedure Record Count'])}
            for _, row in df.iterrows()
        ]
    return result


procedure_bp = Blueprint('procedure', __name__)

@procedure_bp.route('/', methods=['GET'])
# @jwt_required()
def procedure():
    # Get parameters from request
    date_from = request.args.get('date_from')
    date_to = request.args.get('date_to')
    procedure_type= request.args.get('type')
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
    procedure_data_1=fetch_procedure_data_1(date_from, date_to, department_names, grouping_type,procedure_type)
    procedure_data_2=fetch_procedure_data_2(date_from, date_to, department_names, grouping_type)
    procedure_data_3=fetch_procedure_data_3(date_from, date_to, department_names, grouping_type)
    # Initialize the service (assuming similar logic to fetch procedure data)
    print(f"proceduredata1 { procedure_data_1}")

    print(f"proceduredata3 { procedure_data_3}")
    # print(procedure_data_2)
    procedure_service = ProcedureService(procedure_data_1,procedure_data_2,procedure_data_3)

    # Get the data
    data = procedure_service.get_all_procedure_data(date_from, date_to, department_names, grouping_type)

    return jsonify(data) 
import psycopg2
from config import Config

db_params = {
        'dbname': Config.DB_NAME,
        'user': Config.DB_USER,
        'password': Config.DB_PASSWORD,
        'host': Config.DB_HOST
    }



@procedure_bp.route('/get_type', methods=['GET'])
# @jwt_required()
def get_type():


    try:
        conn = psycopg2.connect(**db_params)
        cur = conn.cursor()
        query = """
    select distinct procedure_name from
        (
            select to_char(p.procedure_date, 'YYYY-MM') AS data_month,
            COALESCE(v.care_site_id, 24473) AS department,
            c.concept_id as procedure_id,
            c.concept_name as procedure_name,
            count(*) as pr_count from 
            procedure_occurrence as p inner join visit_occurrence as v
            on COALESCE(p.visit_occurrence_id, 404644) = v.visit_occurrence_id
            inner join concept as c
            on p.procedure_concept_id = c.concept_id 
            group by data_month,department,procedure_id,procedure_name
            ORDER BY pr_count DESC
        ) as subquery
        limit 5
"""
        cur.execute(query)
        rows = cur.fetchall()
        
        # Converting the fetched data into a list of strings
        procedure_names = [row[0] for row in rows]

    except Exception as e:
        print(f"An error occurred: {e}")
        procedure_names = []
        
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()

    return procedure_names


@procedure_bp.route('/procedure-agg/', methods=['GET'])
# @jwt_required()
def procedure_agg():
    # Get parameters from request
    date_from = request.args.get('date_from')
    date_to = request.args.get('date_to')
    procedure_type= request.args.get('type')
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
    procedure_data_1=fetch_procedure_data_1(date_from, date_to, department_names, grouping_type,procedure_type)
    # Initialize the service (assuming similar logic to fetch procedure data)
    print(f"proceduredata1 { procedure_data_1}")



    # Get the data
    data = get_patient_count_by_department_proceduretests(procedure_data_1, grouping_type,factor)

    return jsonify(data) 