#!/bin/bash

# Exit immediately if any command exits with a non-zero status.
set -e

echo "==== Setting up backend virtual environment ===="
cd backend

# If the virtual environment doesn't exist, create it.
if [ ! -d "venv" ]; then
  echo "Creating virtual environment..."
  python -m venv venv
fi

echo "Installing backend dependencies..."
# Use the virtual environment's pip to install requirements from the requirements.txt inside backend/backend/
./venv/bin/pip install -r backend/requirements.txt

cd ..

echo "==== Installing frontend dependencies ===="
cd frontend
npm install

cd ..
echo "==== Setup complete ===="
