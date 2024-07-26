from flask import Blueprint, request, jsonify
from services.disease_service import  DiseaseServices
from flask_jwt_extended import jwt_required
from SQL_Data.fetch_disease_data import fetch_disease_data_1,fetch_disease_data_2
from datetime import datetime
disease_bp=Blueprint('disease',__name__)

@disease_bp.route('/',methods=['GET'])
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
        date_from=date_from.strftime('%d-%m-%Y')
        date_to=date_to.strftime('%d-%m-%Y')
    elif(grouping_type=='yearly'):
        date_from=date_from.strftime('%Y')
        date_to=date_to.strftime('%Y')
    disease_data_1=fetch_disease_data_1(date_from, date_to, department_names, grouping_type)
    disease_data_2=fetch_disease_data_2(date_from, date_to, department_names, grouping_type)
    print(disease_data_1)
    print(disease_data_2)
    resouces_service = DiseaseServices(disease_data_1,disease_data_2)

    # Get the data
    data = resouces_service.get_all_disease_data(date_from, date_to, department_names, grouping_type)
    return jsonify(data)