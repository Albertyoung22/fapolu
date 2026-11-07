$WshShell = New-Object -ComObject WScript.Shell
$DesktopPath = [System.Environment]::GetFolderPath([System.Environment+SpecialFolder]::Desktop)
$ShortcutPath = Join-Path -Path $DesktopPath -ChildPath "法寶實業 - 沉浸式桌面系統.lnk"
$TargetBat = "d:\PythonTest\fapolu\start_desktop.bat"
$IconIco = "d:\PythonTest\fapolu\app.ico"

$Shortcut = $WshShell.CreateShortcut($ShortcutPath)
$Shortcut.TargetPath = $TargetBat
$Shortcut.WorkingDirectory = "d:\PythonTest\fapolu"
$Shortcut.IconLocation = "$IconIco,0"
$Shortcut.Description = "法寶實業有限公司 - 沉浸式互動系統 (官方桌面版)"
$Shortcut.Save()

Write-Host "Desktop shortcut created successfully with official icon at: $ShortcutPath"
