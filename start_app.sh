#!/bin/bash

# Start the server
python server/run.py &

python server/patient_count_stack.py &

# Start the client
cd client && npm start &


# Wait for both processes to finish
wait