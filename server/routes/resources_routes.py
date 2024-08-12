from flask import Blueprint , jsonify,request
from services.resources_service import ResoucesServices
from flask_jwt_extended import jwt_required
from datetime import datetime
from SQL_Data.fetch_resources_data import fetch_resources_data_1,fetch_resources_data_2,fetch_resources_data_3,fetch_resources_data_4
resources_bp=Blueprint('resources',__name__)

@resources_bp.route('/',methods=['GET'])
@jwt_required()
def resources():
    # Get parameters from request
    date_from = request.args.get('date_from')
    date_to = request.args.get('date_to')
    date_from = datetime.strptime(date_from, '%m-%d-%Y')
    date_to = datetime.strptime(date_to, '%m-%d-%Y')
    department_names = request.args.get('department_names', '').split(',')
    grouping_type = request.args.get('grouping_type', 'monthly').lower()
    # Initialize the service (assuming similar logic to fetch lab data)
    if(grouping_type=='monthly'):
        date_from=date_from.strftime('%m-%Y')
        date_to=date_to.strftime('%m-%Y')
    elif(grouping_type=='weekly'):
        date_from=date_from.strftime('%Y-%m-%d %H:%M:%S')
        date_to=date_to.strftime('%Y-%m-%d %H:%M:%S')
    elif(grouping_type=='yearly'):
        date_from=date_from.strftime('%Y')
        date_to=date_to.strftime('%Y')
    
    resource_data_1=fetch_resources_data_1(date_from, date_to, department_names, grouping_type)
    resource_data_2=fetch_resources_data_2(date_from, date_to, department_names, grouping_type)
    resource_data_3=fetch_resources_data_3(date_from, date_to, department_names, grouping_type)
    print(f"blood count {resource_data_1}")
    print(f"oxygen count {resource_data_2}")
    print(f"OT count {resource_data_3}")
    resouces_service = ResoucesServices(resource_data_1,resource_data_2,resource_data_3)

    # Get the data
    data = resouces_service.get_all_resources_data(date_from, date_to, department_names, grouping_type)

    return jsonify(data)

import json
import pandas as pd
@resources_bp.route('/resources-agg/',methods=['GET'])
@jwt_required()
def resources_agg():
    # Get parameters from request
    date_from = request.args.get('date_from')
    date_to = request.args.get('date_to')
    date_from = datetime.strptime(date_from, '%m-%d-%Y')
    date_to = datetime.strptime(date_to, '%m-%d-%Y')
    factor = request.args.get('factor')
    department_names = request.args.get('department_names', '').split(',')
    grouping_type = request.args.get('grouping_type', 'monthly').lower()
    bloodgroups = request.args.get('blood-groups', '').split(',')
    
    # Clean up blood groups to ensure correct formatting
    bloodgroups = [bg.strip() for bg in bloodgroups if bg.strip()]
    
    # Initialize the service (assuming similar logic to fetch lab data)
    if grouping_type == 'monthly':
        date_from = date_from.strftime('%m-%Y')
        date_to = date_to.strftime('%m-%Y')
    elif grouping_type == 'weekly':
        date_from = date_from.strftime('%Y-%m-%d %H:%M:%S')
        date_to = date_to.strftime('%Y-%m-%d %H:%M:%S')
    elif grouping_type == 'yearly':
        date_from = date_from.strftime('%Y')
        date_to = date_to.strftime('%Y')
    
    resource_data_1 = fetch_resources_data_4(date_from, date_to, department_names, grouping_type, bloodgroups)

    # Get the data
    if resource_data_1.empty:
        return json.dumps({"message": "No data available"}, indent=2)

    if grouping_type == 'monthly':
        resource_data_1['Date'] = pd.to_datetime(resource_data_1['Date'], format='%Y-%m')
    elif grouping_type == 'yearly':
        resource_data_1['Date'] = pd.to_datetime(resource_data_1['Date'], format='%Y')
    
    # Group by factor and sum the Count
    grouped = resource_data_1.groupby(factor)['Count'].sum().reset_index()
    
    # Sort by Count in descending order
    grouped = grouped.sort_values('Count', ascending=False)
    
    result = [
        {"name": row[factor], "value": int(row['Count'])}
        for _, row in grouped.iterrows()
    ]

    return result