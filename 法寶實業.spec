# -*- mode: python ; coding: utf-8 -*-


a = Analysis(
    ['desktop_app.py'],
    pathex=[],
    binaries=[],
    datas=[('templates', 'templates'), ('static', 'static'), ('data', 'data'), ('bin', 'bin')],
    hiddenimports=[],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=['torch', 'torchaudio', 'torchvision', 'scipy', 'matplotlib', 'tensorboard', 'gradio', 'selenium', 'pandas', 'numpy', 'sympy', 'rembg', 'ImageIO', 'sklearn', 'cv2', 'PIL.ImageQt'],
    noarchive=False,
    optimize=0,
)
pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name='法寶實業',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    console=False,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    icon=['app.ico'],
)
coll = COLLECT(
    exe,
    a.binaries,
    a.datas,
    strip=False,
    upx=True,
    upx_exclude=[],
    name='法寶實業',
)
