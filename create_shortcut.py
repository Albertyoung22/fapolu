import os
import sys
from win32com.client import Dispatch

def create_desktop_shortcut():
    shell = Dispatch('WScript.Shell')
    desktop = shell.SpecialFolders('Desktop')
    lnk_path = os.path.join(desktop, '法寶實業 - 沉浸式桌面系統.lnk')
    ico_path = os.path.abspath('app.ico')

    exe_path = os.path.abspath(r'release\法寶實業\法寶實業.exe')
    if os.path.exists(exe_path):
        target = exe_path
        w_dir = os.path.dirname(exe_path)
    else:
        target = os.path.abspath('start_desktop.bat')
        w_dir = os.path.abspath('.')

    shortcut = shell.CreateShortCut(lnk_path)
    shortcut.TargetPath = target
    shortcut.WorkingDirectory = w_dir
    shortcut.IconLocation = f"{ico_path},0"
    shortcut.Description = "法寶實業有限公司 - 全方位鋁合金材料供應鏈與精密加工 (沉浸式互動系統)"
    shortcut.Save()
    print("✓ 桌面捷徑已更新，圖示連結至:", ico_path)

if __name__ == '__main__':
    create_desktop_shortcut()
