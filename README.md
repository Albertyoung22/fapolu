# 法寶實業有限公司 (FAPO ENTERPRISE CO., LTD.)
## 沉浸式互動官方網站 · 全方位鋁合金材料供應鏈與精密加工整合首選

本專案完整爬取並依據台灣 [法寶實業有限公司官方網站 (fapolu.com.tw)](https://fapolu.com.tw/) 之所有歷史沿革、四大營運據點、旗艦材料型錄、490+項現貨規格表、高階精密加工部、半導體與航太實績、國際硬度對照表等所有完整資料，進行現代化重新規劃與架構升級。

採用 **Waitress 生產級 WSGI 伺服器**、**Flask 輕量後端**、以及 **Microsoft Edge-TTS 台灣神經網路語音引擎**，打造兼具未來金屬科技感、3D 晶格粒子物理互動與全自動章節語音導覽的沉浸式互動網頁體驗。

---

### 🌟 系統亮點與特色

1. **完整依據原廠資料庫與規格重構**：
   - **企業底蘊**：創立於 1986 年，深耕台灣近 40 載，以鋁為本、服務為先。
   - **北中南四大營運網絡**：台北總公司、台中沙鹿物流裁切中心、台南佳里一廠、台南麻豆二廠（含完整電話、傳真、信箱與地址）。
   - **精選旗艦鋁材**：日本原廠進口 UACJ 5052 貼膜板（低殘留應力）、7075-T651 航太鋁、6061-T6 精密結構板、5083 船用耐蝕板、1050 工業純鋁板、韓國精平板、金銀鏡面與二爪/三爪/五爪/人字/鑽石壓花板、2xxx/5xxx/6xxx/7xxx 鋁擠型材、客製開模、不鏽鋼與銅材。
   - **490+ 筆實體常備現貨庫存資料庫**：內建即時檢索、分類過濾、頁碼分頁與「一鍵加入詢價單」功能。
   - **加工製造能量**：CNC 銑床、精密車床、連續沖剪折床、航太級五軸同動加工、大型龍門銑床、拋光拉絲與表面陽極處理。
   - **代表實績**：半導體晶圓設備高真空蝕刻機台大型腔體底座（真平度 <0.03mm）、航太無人載具結構件（7075 原廠 Mill Sheet 探傷認證）。
   - **工程技術工具箱**：內建國際標準硬度對照試算器（HB ⇄ HRC / HRB / HV / HS / MPa）與熱處理調質代號辭典（F, O, H12~H38, T4, T6, T651, T73 等）。

2. **微軟 Edge-TTS 沉浸式語音導覽系統**：
   - 預載五大核心章節語音導覽（企業簡介、北中南佈局、旗艦材料、精密加工、半導體航太實績）。
   - 支援動態即時 TTS 生成與本機快取（`/api/tts`），每個產品卡片、加工製程、實績案例皆附有「🎙️ 語音朗讀」按鈕。
   - 支援台灣專業女聲（`zh-TW-HsiaoChenNeural` 曉臻）與沉穩男聲（`zh-TW-YunJheNeural` 雲哲）即時切換。
   - 底部沉浸式語音控制底座（Floating Dock）：具備播放/暫停、波形畫布視覺化（Waveform Visualizer）、章節快速選取、語速調整（0.9x ~ 1.2x）及語音與視窗平滑自動聯動滾動（Scroll Spy）。

3. **視覺與互動架構 (Immersive Web Experience)**：
   - 鈦金屬深藍曜黑風格（Titanium Glassmorphic Theme）與動態發光外框。
   - HTML5 Canvas 3D 鋁晶格粒子物理連線背景（Lattice Network），隨滑鼠游標產生即時引力互動。
   - 響應式佈局支援桌機、平板與手機無縫自適應瀏覽。

---

4. **Cloudflare Tunnel 內網穿透 (全自動外網公開連線)**：
   - **自動調用與下載**：系統自動管理 `bin/cloudflared.exe` 核心，若本機不存在則自動自 Cloudflare 官方 GitHub 下載。
   - **穿透本地 Port 5000**：透過 Quick Tunnel 穿透本機 Waitress WSGI 伺服器，免固定 IP、免設定路由器通訊埠轉發。
   - **自動捕獲 trycloudflare.com 網址**：自動從日誌中捕獲隨機分配的 `https://xxxx.trycloudflare.com` 公開網址並儲存至 `data/public_url.txt`。
   - **網頁/桌面端即時互動**：導航列內建「🌐 外網分享」按鈕，可一鍵查看、啟動與複製外網網址，隨時將沉浸式官方網站分享給手機、客戶或遠端電腦瀏覽！

---

### 📁 專案目錄結構

```
d:\PythonTest\fapolu\
├── app.py                     # Flask 後端應用與 API 路由 (TTS、現貨查詢、聯絡諮詢、Tunnel狀態)
├── tunnel.py                  # Cloudflare Tunnel 核心調用與自動捕獲模組
├── run.py                     # Waitress 生產級多執行緒伺服器啟動腳本 (支援 --tunnel 參數)
├── desktop_app.py             # Windows WebView2 沉浸式桌面應用程式
├── start_desktop.bat          # 桌面應用程式一鍵啟動
├── start_server.bat           # 本機/區網伺服器一鍵啟動
├── start_with_tunnel.bat      # 伺服器 + Cloudflare Tunnel 外網穿透一鍵啟動
├── bin/
│   └── cloudflared.exe        # Cloudflare 官方穿透核心
├── data/
│   ├── fapolu_complete_data.json # 完整結構化企業與材料資料庫
│   ├── inventory_specs.json   # 490+ 筆常備現貨規格表
│   ├── inquiries.json         # 客戶在線詢價與諮詢紀錄
│   └── public_url.txt         # 當前活躍的 trycloudflare.com 外網網址
├── static/
│   ├── css/style.css          # 沉浸式深色玻璃態高科技主題
│   ├── js/main.js             # 3D 晶格畫布、Edge-TTS 播放器、現貨檢索、硬度計算器、Tunnel管理
│   ├── audio/                 # 預合成導覽語音檔
│   └── img_crawled/           # 原廠真實產品與製程圖片
└── templates/
    └── index.html             # 現代化沉浸式主網頁 (內建外網分享彈窗)
```

---

### 🚀 啟動與使用說明

#### 方法一：啟動伺服器並開啟 Cloudflare 外網穿透 (最推薦)
雙擊專案目錄下的：
```
start_with_tunnel.bat
```
或在終端機中執行：
```powershell
python run.py --tunnel
```
終端機會自動印出並捕獲分配的公開外網網址（例如：`https://xxxx.trycloudflare.com`），任何外網的手機或電腦即可直接連線！

#### 方法二：桌面應用程式啟動 (Desktop App 獨立原生視窗)
- **捷徑啟動**：直接在您的 **Windows 桌面上** 雙擊捷徑 **「法寶實業 - 沉浸式互動系統」**
- **批次檔啟動**：雙擊 `start_desktop.bat`
- **指令列啟動**：`python desktop_app.py`（若需同時開穿透可加 `--tunnel`）

#### 方法三：僅本機/區域網路伺服器啟動
雙擊 `start_server.bat`，造訪 [http://localhost:5000](http://localhost:5000)。

