import os
import shutil
import subprocess

folder = r'd:\PythonTest\fapolu\法寶FB專頁素材'
os.makedirs(folder, exist_ok=True)

# Copy images with friendly names
src_avatar = r'C:\Users\ALBERT\.gemini\antigravity\brain\18be7b3f-d26d-4018-a043-31870444c192\fapo_metal_profile_avatar_v2_1795392589336.jpg'
src_cover1 = r'C:\Users\ALBERT\.gemini\antigravity\brain\18be7b3f-d26d-4018-a043-31870444c192\fapo_metal_fb_cover_1795392571843.jpg'
src_cover2 = r'C:\Users\ALBERT\.gemini\antigravity\brain\18be7b3f-d26d-4018-a043-31870444c192\fapo_metal_fb_cover_v2_1795392587609.jpg'

shutil.copy2(src_avatar, os.path.join(folder, '1_大頭貼照_Avatar.jpg'))
shutil.copy2(src_cover1, os.path.join(folder, '2_封面照片_倉儲實景.jpg'))
shutil.copy2(src_cover2, os.path.join(folder, '2_封面照片_鋼材特寫.jpg'))

post_content = """【法寶實業有限公司 · 官方 Facebook 粉絲專頁正式上線！】🎉

深耕特殊金屬與模具材料領域近40年，法寶實業始終秉持「以客為尊、現貨齊備、精密裁切、迅速發貨」的核心理念，服務全台各大精密機械、模具加工與高科技產業製造夥伴。

🏭 全台直營物流發貨網絡：
🔹 台北行政總公司：統籌全台進出口貿易調度與北部即時服務
🔹 台中大型物流中心：配置大型重切削裁板機與數控圓棒鋸床
🔹 台南雙營運中心（佳里倉／麻豆新廠）：南部萬坪原木棧板與常備庫存迅速調撥

🌟 核心常備現貨與加工服務：
✔ 模具鋼系列：SKD11 / SKD61 / S50C / SCM440 等專業鋼材
✔ 航太級鋁合金：7075-T6 / 6061-T6 / 5083 等精密貼膜防刮厚板與圓棒
✔ 紅銅、黃銅與快削鋼系列：齊全規格現貨供應
✔ 現代化裁切加工：大型圓棒鋸床、無刮痕板材裁切、嚴格公差檢驗

🌐 官方網站規格庫全新改版上線：https://fapolu.com.tw
歡迎各大模具廠、自動化設備廠、精密五金加工夥伴隨時致電或線上詢價！

📞 台北總公司：(02) 2718-3134
📞 中部物流中心：(04) 2258-4931
📞 南部營運中心：(06) 726-3666

#法寶實業 #特殊鋼 #模具鋼 #SKD11 #SKD61 #7075鋁合金 #精密金屬裁切 #金屬材料批發 #全台發貨
"""

with open(os.path.join(folder, '首發歡迎貼文文案.txt'), 'w', encoding='utf-8') as f:
    f.write(post_content)

print('Files copied to:', folder)
subprocess.Popen(['explorer.exe', folder])
