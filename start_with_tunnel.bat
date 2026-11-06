@echo off
chcp 65001 >nul
title 法寶實業 - 沉浸式互動伺服器 (附 Cloudflare Tunnel 外網穿透)
echo =====================================================================
echo   🚀 正在啟動 法寶實業 伺服器與 Cloudflare Tunnel 內網穿透...
echo   ⚡ 核心：Waitress + Flask + Edge-TTS + Cloudflare Quick Tunnel
echo   🌐 本地埠號：5000
echo =====================================================================
echo.
python run.py -p 5000 --tunnel
pause

