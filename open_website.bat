@echo off
title 1 Month Anniversary Surprise Website
echo ====================================================
echo Starting Anniversary Surprise Website...
echo ====================================================
start "" "http://localhost:8000"
python -m http.server 8000
pause
