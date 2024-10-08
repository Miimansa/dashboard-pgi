import threading
import queue
import pickle
import requests
import os
from flask import Flask, request, jsonify
from dotenv import dotenv_values

env_vars = dotenv_values('.env')  
app = Flask(__name__)
request_queue = queue.Queue()
request_file = 'requests.pkl'


# Function to process disease_counts_single requests
def process_disease_counts_single(req_data):
    disease_name = req_data['disease_name']
    date_from = req_data['date_from']
    date_to = req_data['date_to']
    info_id = req_data['info_id']
    sr_no = req_data['sr_no']

    # Call the /disease_counts endpoint
    patient_count_port = env_vars.get('PATIENT_COUNT_PORT')
    response = requests.get(f'http://localhost:{patient_count_port}/disease_counts?disease_name={disease_name}&date_from={date_from}&date_to={date_to}')

    # Process the response as needed
    if response.status_code == 200:
        disease_count = response.json()
        # Prepare the data for the PUT request
        data = {
            'sr_no': sr_no,
            'visits': disease_count[0]['visits'],
            'patients': disease_count[0]['patients'],
            'discharge_summaries': disease_count[0]['discharge_summaries'],
            'ds_patients': disease_count[0]['ds_patients']
        }
        # Send the PUT request to update the patient_counts_disease record
        patient_disease_port = env_vars.get('REACT_APP_DISEASE_APP_PORT')
        update_response = requests.put(f'http://localhost:{patient_disease_port}/patient_counts_disease/{info_id}', json=data)
        if update_response.status_code == 200:
            print("Record updated successfully.")
        else:
            print(f"Error updating record: {update_response.status_code} - {update_response.text}")
    else:
        print(f"Error calling /disease_counts: {response.status_code} - {response.text}")

def process_single_request(req_data):
    try:
        process_disease_counts_single(req_data)
        print(f"Processed request. Remaining: {request_queue.qsize()}")
        remove_request_from_file(req_data)
    except Exception as e:
        print(f"Error processing request: {e}")

def process_requests():
    while True:
        req_data = request_queue.get()
        process_single_request(req_data)
        request_queue.task_done()

processor_thread = threading.Thread(target=process_requests, daemon=True)
processor_thread.start()

@app.route('/process_request', methods=['POST'])
def process_request():
    req_data = request.get_json()
    request_queue.put(req_data)
    save_request_to_file(req_data)
    return jsonify({'message': 'Request received and queued for processing.'}), 202

def save_request_to_file(req_data):
    try:
        with open(request_file, 'ab') as f:
            pickle.dump(req_data, f)
    except Exception as e:
        print(f"Error saving request to file: {e}")

def remove_request_from_file(processed_req):
    temp_file = 'temp_requests.pkl'
    try:
        # Read all requests, skipping the processed one
        with open(request_file, 'rb') as f_in, open(temp_file, 'wb') as f_out:
            while True:
                try:
                    req_data = pickle.load(f_in)
                    if req_data != processed_req:
                        pickle.dump(req_data, f_out)
                except EOFError:
                    break
        
        # Replace the original file with the temp file
        os.replace(temp_file, request_file)
    except Exception as e:
        print(f"Error removing processed request from file: {e}")

def load_requests_from_file():
    loaded_requests = 0
    try:
        with open(request_file, 'rb') as f:
            while True:
                try:
                    req_data = pickle.load(f)
                    request_queue.put(req_data)
                    loaded_requests += 1
                except EOFError:
                    break
    except FileNotFoundError:
        print("No saved requests file found.")
    except Exception as e:
        print(f"Error loading requests from file: {e}")
    return loaded_requests

if __name__ == '__main__':
    loaded_requests = load_requests_from_file()
    print(f"Loaded {loaded_requests} requests from file.")

    try:
        port = int(env_vars.get('PATIENT_COUNT_STACK_PORT', 7346))
        print(f"Starting server on port {port}")
        app.run(host='0.0.0.0', port=port, debug=True)
    except KeyboardInterrupt:
        print("Stopping server...")


