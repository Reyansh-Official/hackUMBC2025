#!/bin/bash

# Integration script to run both frontend and backend

# Start the backend server
echo "Starting backend server..."
cd "$(dirname "$0")/2. back-end"
python app.py &
BACKEND_PID=$!
echo "Backend server started with PID: $BACKEND_PID"

# Wait for backend to initialize
sleep 2

# Start the frontend server
echo "Starting frontend server..."
cd "$(dirname "$0")/1. front-end/finscholars"
python -m http.server 3000 &
FRONTEND_PID=$!
echo "Frontend server started with PID: $FRONTEND_PID"

echo "FinScholars application is running!"
echo "- Frontend: http://localhost:3000"
echo "- Backend API: http://localhost:5000"

# Handle script termination
trap "echo 'Shutting down servers...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT TERM EXIT

# Keep script running
wait