@echo off
title CampusHub Auto-Start
cd /d "%~dp0"
echo Starting CampusHub Server & Tunnel...
start /b node server.cjs
timeout /t 2 >nul
start /b .\cloudflared.exe tunnel --protocol http2 --url http://localhost:5000
exit