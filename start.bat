@echo off
chcp 65001

echo.
echo Запуск сервера...
start "" node server.js

timeout /t 2 /nobreak >nul

echo.
echo Открытие интерфейса...
start "" main.html

echo.


