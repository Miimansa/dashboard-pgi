from flask import Blueprint, jsonify, request
from SQL_Data.fetch_home_data import fetch_home_data_1,fetch_home_data_2,fetch_label
from services.home_service import HomeService
from flask_jwt_extended import jwt_required
from datetime import datetime
home_bp = Blueprint('home', __name__)
from flask_cors import CORS, cross_origin

@home_bp.route('/', methods=['GET'])
@cross_origin(supports_credentials=True)
@jwt_required()
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
    print(home_data_2)
    home_service = HomeService(home_data_1,home_data_2,label_data)

    # Get the data
    data = home_service.get_all_home_data(date_from, date_to, department_names, grouping_type)
    # print(data)
    return jsonify(data)
