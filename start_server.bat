@echo off
chcp 65001 >nul
title 法寶實業 - 沉浸式互動官方網站 (Waitress + Flask + Edge-TTS)
echo =====================================================================
echo   🚀 正在啟動 法寶實業 沉浸式互動伺服器...
echo   ⚡ 架構：Waitress (多執行緒生產伺服器) + Flask + Edge-TTS
echo   🌐 瀏覽器請造訪：http://localhost:5000
echo =====================================================================
echo.
python run.py
pause

