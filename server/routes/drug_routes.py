from flask import Blueprint, jsonify, request
from services.drug_service import DrugService
from flask_jwt_extended import jwt_required
from flask_cors import CORS, cross_origin
from SQL_Data.fetch_drug import fetch_drug_data_1,fetch_drug_data_2,fetch_drug_data_3
from datetime import datetime
import json
import pandas as pd


def get_patient_count_by_department_drugtests(df,grouping_type,factor):
    if df.empty:
        return json.dumps({"message": "No data available"}, indent=2)

    if(grouping_type=='monthly'):
        df['Date'] = pd.to_datetime(df['Date'], format='%Y-%m')
    elif(grouping_type=='yearly'):
            df['Date'] = pd.to_datetime(df['Date'], format='%Y')
    # Group by Type and sum the Count
    print(df)
    grouped = df.groupby(factor)['drug Record Count'].sum().reset_index()
    
    # Sort by Count in descending order
    grouped = grouped.sort_values('drug Record Count', ascending=False)
    print(grouped)
    result = [
            {"name": row[factor], "value": int(row['drug Record Count'])}
            for _, row in df.iterrows()
        ]
    return result


drug_bp = Blueprint('drug', __name__)

@drug_bp.route('/', methods=['GET'])
# @jwt_required()
def drug():
    # Get parameters from request
    date_from = request.args.get('date_from')
    date_to = request.args.get('date_to')
    drug_type= request.args.get('type')
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
    drug_data_1=fetch_drug_data_1(date_from, date_to, department_names, grouping_type,drug_type)
    drug_data_2=fetch_drug_data_2(date_from, date_to, department_names, grouping_type)
    drug_data_3=fetch_drug_data_3(date_from, date_to, department_names, grouping_type)
    # Initialize the service (assuming similar logic to fetch drug data)
    print(f"drugdata1 { drug_data_1}")

    print(f"drugdata3 { drug_data_3}")
    # print(drug_data_2)
    drug_service = DrugService(drug_data_1,drug_data_2,drug_data_3)

    # Get the data
    data = drug_service.get_all_drug_data(date_from, date_to, department_names, grouping_type)

    return jsonify(data) 
import psycopg2
from config import Config

db_params = {
        'dbname': Config.DB_NAME,
        'user': Config.DB_USER,
        'password': Config.DB_PASSWORD,
        'host': Config.DB_HOST
    }



@drug_bp.route('/get_type', methods=['GET'])
# @jwt_required()
def get_type():
    try:
        conn = psycopg2.connect(**db_params)
        cur = conn.cursor()
        query = """
        select distinct drug_name from
        (
        select to_char(d.drug_exposure_start_date, 'YYYY-MM') AS data_month,
        COALESCE(v.care_site_id, 24473) AS department,
        c.concept_id as drug_id,
        c.concept_name as drug_name,
        count(*) as dr_count from 
        drug_exposure1 as d inner join visit_occurrence as v
        on COALESCE(d.visit_occurrence_id, 404644) = v.visit_occurrence_id
        inner join concept as c
        on d.drug_concept_id = c.concept_id 
        group by data_month,department,drug_id,drug_name
        ORDER BY dr_count DESC
        ) as subquery
        limit 5
"""
        cur.execute(query)
        rows = cur.fetchall()
        
        # Converting the fetched data into a list of strings
        drug_names = [row[0] for row in rows]

    except Exception as e:
        print(f"An error occurred: {e}")
        drug_names = []
        
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()

    return drug_names


@drug_bp.route('/drug-agg/', methods=['GET'])
# @jwt_required()
def drug_agg():
    # Get parameters from request
    date_from = request.args.get('date_from')
    date_to = request.args.get('date_to')
    drug_type= request.args.get('type')
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
    drug_data_1=fetch_drug_data_1(date_from, date_to, department_names, grouping_type,drug_type)
    # Initialize the service (assuming similar logic to fetch drug data)
    print(f"drugdata1 { drug_data_1}")
    # Get the data
    data = get_patient_count_by_department_drugtests(drug_data_1, grouping_type,factor)

    return jsonify(data) 