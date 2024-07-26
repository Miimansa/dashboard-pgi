from flask import Blueprint ,jsonify,request
from services.emergency_service import EmergencyServices
from flask_jwt_extended import jwt_required
from datetime import datetime

from SQL_Data.fetch_emergency_data import fetch_emergency_data_1,fetch_emergency_data_2,fetch_emergency_data_3
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
    emergency_data_2=fetch_emergency_data_2(date_from, date_to, department_names, grouping_type)
    emergency_data_3=fetch_emergency_data_3(date_from, date_to, department_names, grouping_type)
    emergency_service = EmergencyServices(emergency_data_1,emergency_data_2,emergency_data_3)
    # Get the data
    data = emergency_service.get_all_emergency_data(date_from, date_to, department_names, grouping_type)
    return jsonify(data)