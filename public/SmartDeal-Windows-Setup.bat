@echo off
title SmartDeal Windows Desktop Setup
color 0b
echo ========================================================
echo        SmartDeal PRO - Windows Desktop App Setup
echo ========================================================
echo.
echo Installing SmartDeal App on your Desktop and Start Menu...
echo.

set "DESKTOP_DIR=%USERPROFILE%\Desktop"
set "START_MENU_DIR=%APPDATA%\Microsoft\Windows\Start Menu\Programs"

(
echo [InternetShortcut]
echo URL=https://smart-deal-m4ca.vercel.app/
echo IconIndex=0
echo IconFile=https://smart-deal-m4ca.vercel.app/favicon.png
echo HotKey=0
) > "%DESKTOP_DIR%\SmartDeal.url"

(
echo [InternetShortcut]
echo URL=https://smart-deal-m4ca.vercel.app/
echo IconIndex=0
echo IconFile=https://smart-deal-m4ca.vercel.app/favicon.png
echo HotKey=0
) > "%START_MENU_DIR%\SmartDeal.url"

echo [SUCCESS] SmartDeal icon added to your Windows Desktop!
echo [SUCCESS] SmartDeal added to your Windows Start Menu!
echo.
echo Opening SmartDeal Standalone App...

if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" (
    start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --app=https://smart-deal-m4ca.vercel.app/ --window-size=1280,850
    exit /b
)
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --app=https://smart-deal-m4ca.vercel.app/ --window-size=1280,850
    exit /b
)
start "" "%DESKTOP_DIR%\SmartDeal.url"
exit /b
