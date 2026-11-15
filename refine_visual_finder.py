import re

with open('templates/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Refine the section header
old_header = '''                <!-- ==========================================================================
                     現場師傅專用 · 看圖直覺找料專區 (Visual Shape Material Finder)
                     ========================================================================== -->
                <div class="visual-finder-section glass-card" id="visualFinderSection">
                    <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 16px; margin-bottom: 22px; border-bottom: 2px solid rgba(166, 44, 34, 0.12); padding-bottom: 16px;">
                        <div>
                            <div class="vf-header-tag">
                                <span>👷‍♂️ 現場師傅專用 · 看圖快速找料</span>
                                <span style="background: rgba(255,255,255,0.25); padding: 1px 7px; border-radius: 10px; font-size: 0.75rem;">直覺挑選</span>
                            </div>
                            <h3 class="vf-title">
                                看圖片選形狀 · 不用背專業代號直接點
                            </h3>
                            <p class="vf-subtitle">
                                現場師傅與加工頭家專用！點選您需要的材料外觀形狀，查看現貨尺寸，或一鍵帶入估價單，支援<b>手機拍照手寫草圖</b>快速核算。
                            </p>
                        </div>
                        <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
                            <a href="tel:0422584931" class="btn btn-primary" style="padding: 10px 18px; font-size: 0.92rem; font-weight: 700; border-radius: 30px; display: inline-flex; align-items: center; gap: 6px;">
                                <span>📞 電話直撥叫料</span>
                            </a>
                            <button type="button" class="btn btn-secondary" onclick="quickSnapInquiry()" style="padding: 10px 18px; font-size: 0.92rem; font-weight: 700; border-radius: 30px; display: inline-flex; align-items: center; gap: 6px; background: #fff; border-color: #a62c22; color: #a62c22;">
                                <span>📸 拍照傳圖估價</span>
                            </button>
                        </div>
                    </div>'''

new_header = '''                <!-- ==========================================================================
                     視覺化材料斷面圖鑑 · 依形狀快速選料 (Visual Material Directory)
                     ========================================================================== -->
                <div class="visual-finder-section glass-card" id="visualFinderSection">
                    <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 16px; margin-bottom: 24px; border-bottom: 1px solid rgba(0,0,0,0.08); padding-bottom: 18px;">
                        <div>
                            <div class="vf-header-tag">
                                <span>✦ 現貨斷面圖鑑 · 視覺化快速選料</span>
                                <span style="background: rgba(255,255,255,0.2); padding: 1px 8px; border-radius: 10px; font-size: 0.76rem; font-weight: 600;">依形狀選型</span>
                            </div>
                            <h3 class="vf-title">
                                常用材料斷面圖鑑 · 依形狀直覺選料
                            </h3>
                            <p class="vf-subtitle">
                                精選六大金屬斷面與實拍儲位，點選常用形狀即可快速檢視尺寸、帶入詢價單，支援<b>手機拍照手繪草圖</b>上傳估算。
                            </p>
                        </div>
                        <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
                            <a href="tel:0422584931" class="btn btn-primary" style="padding: 9px 18px; font-size: 0.9rem; font-weight: 700; border-radius: 8px; display: inline-flex; align-items: center; gap: 6px;">
                                <span>📞 廠區專線洽詢</span>
                            </a>
                            <button type="button" class="btn btn-secondary" onclick="quickSnapInquiry()" style="padding: 9px 18px; font-size: 0.9rem; font-weight: 700; border-radius: 8px; display: inline-flex; align-items: center; gap: 6px; background: #fff; border-color: rgba(0,0,0,0.18); color: var(--text-main);">
                                <span>📸 拍照傳圖估價</span>
                            </button>
                        </div>
                    </div>'''

if old_header in html:
    html = html.replace(old_header, new_header)
    print('Header refined successfully!')
else:
    print('Warning: old_header not matched exactly, trying regex...')
    # fallback regex
    pattern = r'<div class="visual-finder-section glass-card" id="visualFinderSection">.*?<div class="visual-shape-grid">'
    # Let's inspect if needed

# 2. Refine badges and button text
# Badges:
html = html.replace('<span class="vs-badge-shape">🔵 實心圓棒</span>', '<span class="vs-badge-shape">實心圓棒 · Round Bar</span>')
html = html.replace('<span class="vs-badge-shape">🟩 平面厚板 / 貼膜板</span>', '<span class="vs-badge-shape">平面厚板 / 貼膜板 · Plate</span>')
html = html.replace('<span class="vs-badge-shape">🟨 五線防滑花紋板</span>', '<span class="vs-badge-shape">防滑花紋板 · Chequered</span>')
html = html.replace('<span class="vs-badge-shape">🟫 扁條 / 方棒 / 排鋁</span>', '<span class="vs-badge-shape">實心扁條 / 方棒 · Flat & Square</span>')
html = html.replace('<span class="vs-badge-shape">⭕ 中空圓管 / 方管</span>', '<span class="vs-badge-shape">中空無縫管 · Tube</span>')
html = html.replace('<span class="vs-badge-shape">📐 工業結構鋁擠型</span>', '<span class="vs-badge-shape">工業結構擠型 · Extrusion</span>')

# Zoom tip:
html = html.replace('<span class="vs-zoom-tip">🔍 點擊看料架大圖</span>', '<span class="vs-zoom-tip">🔍 檢視儲位圖鑑</span>')
html = html.replace('<span class="vs-zoom-tip">🔍 點擊看厚板大圖</span>', '<span class="vs-zoom-tip">🔍 檢視儲位圖鑑</span>')
html = html.replace('<span class="vs-zoom-tip">🔍 點擊看花紋大圖</span>', '<span class="vs-zoom-tip">🔍 檢視加工圖鑑</span>')
html = html.replace('<span class="vs-zoom-tip">🔍 點擊看包裝大圖</span>', '<span class="vs-zoom-tip">🔍 檢視包裝圖鑑</span>')
html = html.replace('<span class="vs-zoom-tip">🔍 點擊看管材大圖</span>', '<span class="vs-zoom-tip">🔍 檢視料架圖鑑</span>')
html = html.replace('<span class="vs-zoom-tip">🔍 點擊看擠型大圖</span>', '<span class="vs-zoom-tip">🔍 檢視儲位圖鑑</span>')

# Buttons:
# Replace "📋 我要買這個 (填尺寸)" with "📋 選取規格 · 帶入詢價"
html = html.replace('📋 我要買這個 (填尺寸)', '📋 選取規格 · 帶入詢價')

# Replace "🔍 實拍照" with "🔍 檢視儲位圖鑑"
html = html.replace('🔍 實拍照', '🔍 檢視儲位圖鑑')

# 3. Refine Quote Form quick picks:
old_qp = '''                                    <!-- 現場師傅形狀快捷列 (點選直接帶入) -->
                                    <div class="machinist-quick-picks" style="margin-bottom: 8px;">
                                        <span style="font-size: 0.86rem; font-weight: 700; color: #a62c22; display: flex; align-items: center; gap: 6px; margin-bottom: 8px;">
                                            <span>👉 現場師傅快捷點選（點一下自動帶入材料形狀）：</span>
                                        </span>
                                        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                                            <button type="button" class="chip-shape-btn" onclick="fillQuickMaterial('6061 實心圓棒 外徑: Ø mm 長度: mm 支數: 支')">🔵 實心圓棒</button>
                                            <button type="button" class="chip-shape-btn" onclick="fillQuickMaterial('5052 平面貼膜鋁板 厚度: mm 尺寸: mm × mm 塊數: 塊')">🟩 平面厚板/貼膜板</button>
                                            <button type="button" class="chip-shape-btn" onclick="fillQuickMaterial('五線防滑花紋鋁板（車斗/踏板） 厚度: 2.0mm/3.0mm 尺寸: 4尺×8尺 或裁切: mm × mm')">🟨 防滑花紋板</button>
                                            <button type="button" class="chip-shape-btn" onclick="fillQuickMaterial('四角扁條/方棒/排鋁 厚度: mm 寬度: mm 長度: mm 支數: 支')">🟫 扁條/方棒</button>
                                            <button type="button" class="chip-shape-btn" onclick="fillQuickMaterial('中空無縫圓管/方管 外徑: mm 壁厚: mm 長度: mm 支數: 支')">⭕ 圓管/方管</button>
                                            <button type="button" class="chip-shape-btn" onclick="fillQuickMaterial('工業結構鋁擠型 規格: 4040/3030 長度: mm 支數: 支')">📐 結構鋁擠型</button>
                                        </div>
                                    </div>'''

new_qp = '''                                    <!-- 常用斷面規格快捷選取列 -->
                                    <div class="machinist-quick-picks" style="margin-bottom: 10px;">
                                        <span style="font-size: 0.84rem; font-weight: 700; color: var(--text-main); display: flex; align-items: center; gap: 6px; margin-bottom: 8px;">
                                            <span>📐 常用規格快捷帶入（點擊自動填寫規格範本）：</span>
                                        </span>
                                        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                                            <button type="button" class="chip-shape-btn" onclick="fillQuickMaterial('6061 實心圓棒 外徑: Ø mm 長度: mm 支數: 支')">實心圓棒 (Ø8~200mm+)</button>
                                            <button type="button" class="chip-shape-btn" onclick="fillQuickMaterial('5052 平面貼膜鋁板 厚度: mm 尺寸: mm × mm 塊數: 塊')">平面厚板 / 貼膜板 (1~150mm+)</button>
                                            <button type="button" class="chip-shape-btn" onclick="fillQuickMaterial('五線防滑花紋鋁板 厚度: 2.0mm/3.0mm 尺寸: 4尺×8尺 或裁切: mm × mm')">防滑花紋板 (五線踏板)</button>
                                            <button type="button" class="chip-shape-btn" onclick="fillQuickMaterial('四角扁條/方棒/排鋁 厚度: mm 寬度: mm 長度: mm 支數: 支')">實心扁條 / 方棒 / 排鋁</button>
                                            <button type="button" class="chip-shape-btn" onclick="fillQuickMaterial('中空無縫圓管/方管 外徑: mm 壁厚: mm 長度: mm 支數: 支')">中空無縫管 (圓管/方管)</button>
                                            <button type="button" class="chip-shape-btn" onclick="fillQuickMaterial('工業結構鋁擠型 規格: 4040/3030 長度: mm 支數: 支')">工業結構鋁擠型</button>
                                        </div>
                                    </div>'''

if old_qp in html:
    html = html.replace(old_qp, new_qp)
    print('Quote form quick picks refined successfully!')
else:
    print('Notice: old_qp not matched exactly, replacing parts...')
    html = html.replace('👉 現場師傅快捷點選（點一下自動帶入材料形狀）：', '📐 常用規格快捷帶入（點擊自動填寫規格範本）：')
    html = html.replace('>🔵 實心圓棒<', '>實心圓棒 (Ø8~200mm+)<')
    html = html.replace('>🟩 平面厚板/貼膜板<', '>平面厚板 / 貼膜板 (1~150mm+)<')
    html = html.replace('>🟨 防滑花紋板<', '>防滑花紋板 (五線踏板)<')
    html = html.replace('>🟫 扁條/方棒<', '>實心扁條 / 方棒 / 排鋁<')
    html = html.replace('>⭕ 圓管/方管<', '>中空無縫管 (圓管/方管)<')
    html = html.replace('>📐 結構鋁擠型<', '>工業結構鋁擠型<')

with open('templates/index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print('Updated templates/index.html successfully!')
