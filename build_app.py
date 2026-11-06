import os
import subprocess
import sys

print("=== 開始封裝法寶實業獨立桌面應用程式 (PyInstaller) ===")

excludes = [
    'torch', 'torchaudio', 'torchvision', 'scipy', 'matplotlib', 
    'tensorboard', 'gradio', 'selenium', 'pandas', 'numpy', 
    'sympy', 'rembg', 'ImageIO', 'sklearn', 'cv2', 'PIL.ImageQt'
]

exclude_args = []
for ex in excludes:
    exclude_args.extend(['--exclude-module', ex])

cmd = [
    sys.executable, '-m', 'PyInstaller',
    '--noconfirm',
    '--onedir',
    '--windowed',
    '--distpath', 'release',
    '--name', '法寶實業',
    '--icon', 'app.ico',
    '--add-data', 'templates;templates',
    '--add-data', 'static;static',
    '--add-data', 'data;data',
    '--add-data', 'bin;bin',
    *exclude_args,
    'desktop_app.py'
]

print("執行指令:", " ".join(cmd))
subprocess.run(cmd, check=True)
print("\n🎉 封裝完成！執行檔位於: release/法寶實業/法寶實業.exe")

