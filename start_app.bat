@echo off
echo Starting processes...

REM Start the server
echo Attempting to start server/run.py...
start python server/run.py
if %ERRORLEVEL% NEQ 0 echo Failed to start server/run.py

echo Attempting to start server/patient_count_stack.py...
start python server/patient_count_stack.py
if %ERRORLEVEL% NEQ 0 echo Failed to start server/patient_count_stack.py

REM Start the client
echo Changing to client directory...
cd client
echo Attempting to start npm...
start npm start
if %ERRORLEVEL% NEQ 0 echo Failed to start npm

echo All processes attempted to start. Check the opened windows for more information.

REM Wait for user input to close
pause