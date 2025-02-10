from flask import Blueprint, jsonify, request
from SQL_Data.fetch_home_data import fetch_home_data_1,fetch_home_data_2,fetch_label
from services.home_service import HomeService
import pandas as pd
from flask_jwt_extended import jwt_required
from datetime import datetime
home_bp = Blueprint('home', __name__)
from flask_cors import CORS, cross_origin

@home_bp.route('/', methods=['GET'])
@cross_origin(supports_credentials=True)
# @jwt_required()
def home():
    # Fetch the data from PostgreSQL


    # Get parameters from request
    date_from = request.args.get('date_from')
    date_to = request.args.get('date_to')
    date_from = datetime.strptime(date_from, '%m-%d-%Y')
    date_to = datetime.strptime(date_to, '%m-%d-%Y')
    department_names = request.args.get('department_names', '').split(',')
    
    label_data=fetch_label(date_from,date_to,department_names)
    print(label_data)
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
    # fetching data from sql query
    home_data_1=fetch_home_data_1(date_from, date_to, department_names, grouping_type)
    home_data_2=fetch_home_data_2(date_from, date_to, department_names, grouping_type)
    print("###################################################################################################")
    print(home_data_1,home_data_2)
    print("###################################################################################################")
    
    home_service = HomeService(home_data_1,home_data_2,label_data)

    # Get the data
    data = home_service.get_all_home_data(date_from, date_to, department_names, grouping_type)
    print(data)
    return jsonify(data)
import psycopg2
from config import Config

db_params = {
        'dbname': Config.DB_NAME,
        'user': Config.DB_USER,
        'password': Config.DB_PASSWORD,
        'host': Config.DB_HOST
    }

import psycopg2
from flask import request, jsonify
from datetime import datetime

@home_bp.route('/get_visit', methods=['GET'])
@jwt_required()
def get_visit():
    # Get parameters from the request
    date_from = request.args.get('date_from')
    date_to = request.args.get('date_to')
    date_from = datetime.strptime(date_from, '%m-%d-%Y')
    date_to = datetime.strptime(date_to, '%m-%d-%Y')
    departments = request.args.get('departments')
    genders = request.args.get('genders')
    visit_types = request.args.get('visitTypes')
    if(visit_types):
        visit_types = "32217,9203,0,44797555"

    factor = request.args.get('factor')
    grouping_type = request.args.get('grouping_type', 'monthly').lower()
    if(grouping_type=='monthly'):
        date_from=date_from.strftime('%m-%Y')
        date_to=date_to.strftime('%m-%Y')
    elif(grouping_type=='weekly'):
        date_from=date_from.strftime('%Y-%m-%d %H:%M:%S')
        date_to=date_to.strftime('%Y-%m-%d %H:%M:%S')
    elif(grouping_type=='yearly'):
        date_from=date_from.strftime('%Y')
        date_to=date_to.strftime('%Y')
    # Validate the factor
    if factor not in ['department', 'gender', 'visitType']:
        return jsonify({"error": "Invalid factor"}), 400
    # Initialize query variables
    query = ""
    date_format = ""

    # Determine the table and date format based on grouping_type
    if grouping_type == 'monthly':
        date_trunc = 'month'
        date_format = '%b %Y'
        query = f"""
SELECT 
    v.data_month, 
    care_site.care_site_name AS dept_name,
    v.gender,
    v.visit_type,
    v.visit_count

FROM (
    SELECT 
            to_char(visit_start_date, 'YYYY-MM') AS data_month, 
            person.gender_source_value as gender,
            COUNT(*) AS visit_count,
            COALESCE(visit_occurrence.care_site_id, 24473) AS depid,
            visit_concept_id as visit_type
    FROM visit_occurrence 
    inner join
    person
    on visit_occurrence.person_id = person.person_id
    group by data_month ,depid,visit_type,gender
) v 
INNER JOIN care_site ON v.depid = care_site.care_site_id
WHERE TO_DATE(v.data_month, 'YYYY-MM') >= TO_DATE(%s, 'MM-YYYY')  
AND TO_DATE(v.data_month, 'YYYY-MM') <= TO_DATE(%s, 'MM-YYYY')
        """
    elif grouping_type == 'weekly':
        date_trunc = 'week'
        date_format = 'DD/MM/YYYY'
        query = f"""
SELECT 
    v.data_month, 
    care_site.care_site_name AS dept_name,
    v.gender,
    v.visit_type,
    v.visit_count

FROM (
    SELECT 
            date_trunc('week',visit_occurrence.visit_start_date) AS data_month, 
            person.gender_source_value as gender,
            COUNT(*) AS visit_count,
            COALESCE(visit_occurrence.care_site_id, 24473) AS depid,
            visit_concept_id as visit_type
    FROM visit_occurrence 
    inner join
    person
    on visit_occurrence.person_id = person.person_id
    group by data_month ,depid,visit_type,gender
) v 
INNER JOIN care_site ON v.depid = care_site.care_site_id
            WHERE v.data_month >= %s
              AND v.data_month <=%s
        """
    elif grouping_type == 'yearly':
        date_trunc = 'year'
        date_format = 'YYYY'
        query = f"""
SELECT 
    v.data_month, 
    care_site.care_site_name AS dept_name,
    v.gender,
    v.visit_type,
    v.visit_count

FROM (
    SELECT 
            to_char(visit_start_date, 'YYYY') AS data_month, 
            person.gender_source_value as gender,
            COUNT(*) AS visit_count,
            COALESCE(visit_occurrence.care_site_id, 24473) AS depid,
            visit_concept_id as visit_type
    FROM visit_occurrence 
    inner join
    person
    on visit_occurrence.person_id = person.person_id
    group by data_month ,depid,visit_type,gender
) v 
INNER JOIN care_site ON v.depid = care_site.care_site_id
WHERE TO_DATE(v.data_month, 'YYYY') >= TO_DATE(%s, 'YYYY')  
AND TO_DATE(v.data_month, 'YYYY') <= TO_DATE(%s, 'YYYY')
        """
    else:
        return jsonify({"error": "Invalid grouping_type"}), 400

    try:
        # Establish database connection
        conn = psycopg2.connect(**db_params)
        cur = conn.cursor()

        # Add filters based on provided parameters
        params = [date_from, date_to]

        if departments:
            query += " AND care_site.care_site_name IN %s"
            params.append(tuple(departments.split(',')))

        if genders:
            query += " AND gender IN %s"
            params.append(tuple(genders.split(',')))

        if visit_types:
            query += " AND visit_type IN %s"
            params.append(tuple(visit_types.split(',')))
        query+= "ORDER BY v.data_month;"
        # Group by factor and execute the query
        print(query)
        print(params)
        print(cur.mogrify(query, params).decode('utf-8'))
        cur.execute(query, params)
        rows = cur.fetchall()
        home_data_2 = pd.DataFrame(rows, columns=['dataDate', 'department', 'gender', 'visitType', 'visitCount'])

        # Group by factor and sum visitCount
        if factor not in home_data_2.columns:
            raise ValueError(f"Invalid factor: {factor}. Valid options are: {', '.join(home_data_2.columns)}")

        # Group by the specified factor and sum visitCount
        grouped_data = home_data_2.groupby(factor)['visitCount'].sum().reset_index()

        # Create result list in the required format
        result = [
            {"name": row[factor], "value": int(row['visitCount'])}
            for _, row in grouped_data.iterrows()
        ]


    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({"error": str(e)}), 500

    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()

    return jsonify(result)
