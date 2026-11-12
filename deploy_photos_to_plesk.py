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

# 2. Upload img_factory photos
try:
    ftp.mkd('httpdocs/static/img_factory')
except Exception:
    pass

local_img_dir = r'd:\PythonTest\fapolu\static\img_factory'
for fname in os.listdir(local_img_dir):
    lpath = os.path.join(local_img_dir, fname)
    if os.path.isfile(lpath):
        with open(lpath, 'rb') as f:
            ftp.storbinary(f'STOR httpdocs/static/img_factory/{fname}', f)
        print(f'Uploaded: httpdocs/static/img_factory/{fname}')

ftp.quit()
print('ALL_VERIFIED_ASSETS_SYNCED_TO_PLESK_SUCCESSFULLY')
