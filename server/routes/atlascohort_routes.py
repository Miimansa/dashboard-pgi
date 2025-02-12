from flask import Blueprint,request ,jsonify
from flask_jwt_extended import  jwt_required
from SQL_Data.fetch_atlascohor import fetch_person_data
from services.atlascohor_service import PersonServices
atlas_bp = Blueprint('atlas', __name__)

@atlas_bp.route('/', methods=['GET'])
# @jwt_required()
def getlist():
    limit  = request.args.get('limit')
    personlist_data=fetch_person_data(limit)
    personlist_service= PersonServices(personlist_data)
    data = personlist_service.get_all_person_data()
    return jsonify(data)

