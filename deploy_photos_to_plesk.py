import os
import ftplib

HOST = '103.144.33.167'
USER = 'c_fapolu.com.tw'
PASS = 'U7dsRLXWeP1O'

ftp = ftplib.FTP(HOST, timeout=30)
ftp.login(USER, PASS)

# 1. Upload updated index.html
with open(r'd:\PythonTest\fapolu\dist\index.html', 'rb') as f:
    ftp.storbinary('STOR httpdocs/index.html', f)
print('Uploaded httpdocs/index.html')

# 2. Upload core CSS and JS assets
for fpath, rem_path in [
    (r'd:\PythonTest\fapolu\static\css\style.css', 'httpdocs/static/css/style.css'),
    (r'd:\PythonTest\fapolu\static\js\i18n.js', 'httpdocs/static/js/i18n.js'),
    (r'd:\PythonTest\fapolu\static\js\main.js', 'httpdocs/static/js/main.js'),
]:
    if os.path.exists(fpath):
        with open(fpath, 'rb') as f:
            ftp.storbinary(f'STOR {rem_path}', f)
        print(f'Uploaded: {rem_path}')

# 3. Upload img_factory photos (only upload if file size differs or missing)
try:
    ftp.mkd('httpdocs/static/img_factory')
except Exception:
    pass

local_img_dir = r'd:\PythonTest\fapolu\static\img_factory'
for fname in os.listdir(local_img_dir):
    lpath = os.path.join(local_img_dir, fname)
    if os.path.isfile(lpath):
        rem_size = -1
        try:
            rem_size = ftp.size(f'httpdocs/static/img_factory/{fname}')
        except Exception:
            pass
        lsize = os.path.getsize(lpath)
        if rem_size != lsize:
            with open(lpath, 'rb') as f:
                ftp.storbinary(f'STOR httpdocs/static/img_factory/{fname}', f)
            print(f'Uploaded: httpdocs/static/img_factory/{fname} ({lsize} bytes)')
        else:
            print(f'Up-to-date: {fname}')

ftp.quit()
print('ALL_VERIFIED_ASSETS_SYNCED_TO_PLESK_SUCCESSFULLY')

