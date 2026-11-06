$WshShell = New-Object -ComObject WScript.Shell
$DesktopPath = [System.Environment]::GetFolderPath([System.Environment+SpecialFolder]::Desktop)
$ShortcutPath = Join-Path -Path $DesktopPath -ChildPath "法寶實業 - 沉浸式互動系統.lnk"
$TargetBat = "d:\PythonTest\fapolu\start_desktop.bat"

$Shortcut = $WshShell.CreateShortcut($ShortcutPath)
$Shortcut.TargetPath = $TargetBat
$Shortcut.WorkingDirectory = "d:\PythonTest\fapolu"
$Shortcut.Description = "法寶實業有限公司 - 沉浸式互動桌面應用程式"
$Shortcut.Save()

Write-Host "Desktop shortcut created successfully at: $ShortcutPath"

