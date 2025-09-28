#!/bin/bash
# Backend deployment script

# Install dependencies
pip install -r requirements.txt

# Run with Gunicorn in production mode
gunicorn -c gunicorn_config.py main:app