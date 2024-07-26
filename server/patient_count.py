from flask import Flask, request, jsonify
import os
import psycopg2
from flask_cors import CORS
from dotenv import load_dotenv
from config import Config

load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route('/disease_counts', methods=['GET'])
def get_disease_counts():
    try:
        disease_name = request.args.get('disease_name')
        date_from = request.args.get('date_from')
        date_to = request.args.get('date_to')
        
        if not disease_name:
            return jsonify({'error': 'Disease name is required'}), 400

        query = construct_query(disease_name, date_from, date_to)
        results = execute_query(query)
        return jsonify(results)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def construct_query(disease_name, date_from, date_to):
    try:
        # Split the disease name into words and join with '%' between each word
        disease_name_words = disease_name.lower().split()
        disease_name_pattern = f"%{'%'.join(disease_name_words)}%"
        print(disease_name_pattern)
        
        query = f"""
        SELECT 'VISIT' as COL1, count(*), count(distinct visit_fk)
        FROM VISIT
        WHERE (lower(provisionaldiagnosis) LIKE '{disease_name_pattern}'
            OR lower(clinicalnotes) LIKE '{disease_name_pattern}'
            OR lower(finaldiagnosis) LIKE '{disease_name_pattern}')
        UNION ALL
        SELECT 'DS' as COL1, count(*), count(distinct patientid)
        FROM dischargesummary
        WHERE lower(summary) LIKE '{disease_name_pattern}'
        """
        
        # if date_from and date_to:
        #     query += f" AND visit_date BETWEEN '{date_from}' AND '{date_to}'"
        
        return query
    except Exception as e:
        raise Exception(f"Error constructing query: {str(e)}")

def execute_query(query):
    try:
        conn = psycopg2.connect(
            host=Config.DB_HOST,
            database=Config.DB_NAME,
            user=Config.DB_USER,
            password=Config.DB_PASSWORD
        )
        cur = conn.cursor()
        print(query)
        cur.execute(query)
        results = cur.fetchall()
        
        visit_count = 0
        visit_patients = 0
        ds_count = 0
        ds_patients = 0
        
        for row in results:
            if row[0] == 'VISIT':
                visit_count = row[1]
                visit_patients = row[2]
            elif row[0] == 'DS':
                ds_count = row[1]
                ds_patients = row[2]
        
        return [{
            "discharge_summaries": ds_count,
            "ds_patients": ds_patients,
            "patients": visit_patients,
            "visits": visit_count
        }]
    except psycopg2.Error as e:
        raise Exception(f"Database error: {str(e)}")
    except Exception as e:
        raise Exception(f"Error executing query: {str(e)}")
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()

if __name__ == '__main__':
    try:
        port = int(os.getenv('PATIENT_COUNT_PORT', 7657))
        app.run(port=port, debug=True)
    except Exception as e:
        print(f"Error starting the application: {str(e)}")