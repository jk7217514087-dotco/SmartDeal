@echo off
title SmartDeal Windows Setup
color 0b
echo ========================================================
echo        SmartDeal PRO - Windows Desktop App Setup
echo ========================================================
echo.
echo Installing SmartDeal Standalone App on your Windows Desktop...
echo.

powershell -NoProfile -ExecutionPolicy Bypass -Command "$appDir = Join-Path $env:LOCALAPPDATA 'SmartDeal'; if (!(Test-Path $appDir)) { New-Item -ItemType Directory -Path $appDir -Force | Out-Null }; $icoPath = Join-Path $appDir 'smartdeal.ico'; try { (New-Object System.Net.WebClient).DownloadFile('https://smart-deal-m4ca.vercel.app/smartdeal.ico', $icoPath) } catch {}; $edge = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'; if (!(Test-Path $edge)) { $edge = 'C:\Program Files\Google\Chrome\Application\chrome.exe' }; $w = New-Object -COM WScript.Shell; $d = $w.CreateShortcut([Environment]::GetFolderPath('Desktop') + '\SmartDeal.lnk'); $d.TargetPath = $edge; $d.Arguments = '--app=https://smart-deal-m4ca.vercel.app/'; if (Test-Path $icoPath) { $d.IconLocation = $icoPath + ',0' }; $d.Description = 'SmartDeal - Smart Shopping & Price Comparison'; $d.Save(); $p = $w.CreateShortcut([Environment]::GetFolderPath('Programs') + '\SmartDeal.lnk'); $p.TargetPath = $edge; $p.Arguments = '--app=https://smart-deal-m4ca.vercel.app/'; if (Test-Path $icoPath) { $p.IconLocation = $icoPath + ',0' }; $p.Description = 'SmartDeal - Smart Shopping & Price Comparison'; $p.Save(); [System.Runtime.InteropServices.Marshal]::ReleaseComObject($w) | Out-Null;"

echo [SUCCESS] SmartDeal Standalone App installed on your Desktop!
echo [SUCCESS] SmartDeal added to Windows Start Menu!
echo.
echo Launching SmartDeal Standalone Window...

if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" (
    start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --app=https://smart-deal-m4ca.vercel.app/ --window-size=1280,850
    exit /b
)
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --app=https://smart-deal-m4ca.vercel.app/ --window-size=1280,850
    exit /b
)
start "" "https://smart-deal-m4ca.vercel.app/"
exit /b
