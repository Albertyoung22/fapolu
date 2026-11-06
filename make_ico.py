from PIL import Image
import os

img_path = 'static/img_crawled/pro_1.jpg'
if os.path.exists(img_path):
    img = Image.open(img_path)
    img = img.resize((256, 256), Image.Resampling.LANCZOS)
    img.save('app.ico', format='ICO', sizes=[(256, 256), (128, 128), (64, 64), (48, 48), (32, 32), (16, 16)])
    print("Created app.ico successfully!")

