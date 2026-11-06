import os
import subprocess

desktop = os.path.join(os.path.expanduser('~'), 'Desktop')
lnk_path = os.path.join(desktop, '法寶實業 - 沉浸式互動系統.lnk')
exe_path = os.path.abspath(r'release\法寶實業\法寶實業.exe')
work_dir = os.path.abspath(r'release\法寶實業')
ico_path = os.path.abspath('app.ico')

vbs = f'''
Set oWS = WScript.CreateObject("WScript.Shell")
sLinkFile = "{lnk_path}"
Set oLink = oWS.CreateShortcut(sLinkFile)
oLink.TargetPath = "{exe_path}"
oLink.WorkingDirectory = "{work_dir}"
oLink.IconLocation = "{exe_path},0"
oLink.Description = "法寶實業有限公司 - 沉浸式互動系統 (原生桌面應用程式)"
oLink.Save
'''

vbs_file = 'temp_shortcut.vbs'
with open(vbs_file, 'w', encoding='ansi') as f:
    f.write(vbs)

try:
    subprocess.run(['cscript', '//Nologo', vbs_file], check=True)
    print("Desktop shortcut successfully updated to point to release EXE:", lnk_path)
finally:
    if os.path.exists(vbs_file):
        os.remove(vbs_file)
