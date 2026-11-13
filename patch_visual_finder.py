import re

with open('templates/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Prepare visual-finder-section HTML
vf_html = '''
                <!-- ==========================================================================
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
                    </div>

                    <!-- 6 大形狀視覺導覽卡片 (Visual Shape Cards Grid) -->
                    <div class="visual-shape-grid">

                        <!-- 1. 實心圓棒 -->
                        <div class="visual-shape-card">
                            <div class="vs-img-wrap" onclick="openImageLightbox('/static/img_factory/warehouse_6061_racks.jpg', '6061-T6 實心圓棒現貨料架（紫色端面色標管理，外徑 8mm~76.2mm+）')">
                                <img src="/static/img_factory/warehouse_6061_racks.jpg" alt="6061 實心圓棒現貨儲位" loading="lazy">
                                <span class="vs-badge-shape">🔵 實心圓棒</span>
                                <span class="vs-zoom-tip">🔍 點擊看料架大圖</span>
                            </div>
                            <div class="vs-body">
                                <div class="vs-title-row">
                                    <h4 class="vs-title">實心圓棒 (圓形棒料)</h4>
                                    <span class="vs-spec-tag">車床加工首選</span>
                                </div>
                                <ul class="vs-features">
                                    <li><b>◆ 常用用途：</b>自動化心軸、螺絲、夾治具、精密車銑零件</li>
                                    <li><b>◆ 常備牌號：</b>`6061-T6` (好車好銑) ｜ `7075-T651` (超硬高強)</li>
                                    <li><b>◆ 現貨尺寸：</b>外徑 <b>Ø8mm ~ Ø200mm+</b> 充足常備現貨</li>
                                    <li><b>◆ 現場加工：</b>全自動數控鋸床「定寸切斷」，要多長切多長！</li>
                                </ul>
                                <div class="vs-actions">
                                    <button type="button" class="btn-vs-pick" onclick="quickFillAndScroll('6061 實心圓棒 外徑: Ø mm 長度: mm 支數: 支')">
                                        📋 我要買這個 (填尺寸)
                                    </button>
                                    <button type="button" class="btn-vs-zoom" onclick="openImageLightbox('/static/img_factory/warehouse_6061_racks.jpg', '6061-T6 實心圓棒現貨料架')">
                                        🔍 實拍照
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- 2. 平面厚板 / 貼膜板 -->
                        <div class="visual-shape-card">
                            <div class="vs-img-wrap" onclick="openImageLightbox('/static/img_factory/warehouse_heavy_plates_stacked.jpg', '日本原裝進口 UACJ 貼膜鋁板與精密厚板庫存（厚度 1mm~150mm+）')">
                                <img src="/static/img_factory/warehouse_heavy_plates_stacked.jpg" alt="平面厚板與貼膜板" loading="lazy">
                                <span class="vs-badge-shape">🟩 平面厚板 / 貼膜板</span>
                                <span class="vs-zoom-tip">🔍 點擊看厚板大圖</span>
                            </div>
                            <div class="vs-body">
                                <div class="vs-title-row">
                                    <h4 class="vs-title">平面厚板 (塊狀平板)</h4>
                                    <span class="vs-spec-tag">銑床不易翹曲</span>
                                </div>
                                <ul class="vs-features">
                                    <li><b>◆ 常用用途：</b>CNC 銑床底板、機台台面、真空腔體、治具板</li>
                                    <li><b>◆ 常備牌號：</b>`5052 雙面貼膜板` (平整無應力) ｜ `6061-T651` ｜ `7075`</li>
                                    <li><b>◆ 現貨尺寸：</b>厚度 <b>1.0mm 至 150mm+</b> 木棧板在庫</li>
                                    <li><b>◆ 現場加工：</b>CM3800 大行程裁板機精準開料、四角直角鋸切！</li>
                                </ul>
                                <div class="vs-actions">
                                    <button type="button" class="btn-vs-pick" onclick="quickFillAndScroll('5052 平面貼膜鋁板 厚度: mm 尺寸: mm × mm 塊數: 塊')">
                                        📋 我要買這個 (填尺寸)
                                    </button>
                                    <button type="button" class="btn-vs-zoom" onclick="openImageLightbox('/static/img_factory/warehouse_heavy_plates_stacked.jpg', '日本原裝進口精密鋁板與貼膜厚板庫存')">
                                        🔍 實拍照
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- 3. 五線防滑花紋板 -->
                        <div class="visual-shape-card">
                            <div class="vs-img-wrap" onclick="openImageLightbox('/static/img_factory/machining_chequered_shear_action.jpg', '川洋重型剪床裁切五線防滑花紋鋁板現場作業')">
                                <img src="/static/img_factory/machining_chequered_shear_action.jpg" alt="五線防滑花紋板現場剪裁" loading="lazy">
                                <span class="vs-badge-shape">🟨 五線防滑花紋板</span>
                                <span class="vs-zoom-tip">🔍 點擊看花紋大圖</span>
                            </div>
                            <div class="vs-body">
                                <div class="vs-title-row">
                                    <h4 class="vs-title">防滑花紋板 (凸紋踩踏板)</h4>
                                    <span class="vs-spec-tag">車斗防滑耐磨</span>
                                </div>
                                <ul class="vs-features">
                                    <li><b>◆ 常用用途：</b>貨車卡車車斗鋪底、工廠樓梯、水溝蓋、斜坡踏板</li>
                                    <li><b>◆ 表面特徵：</b>五線立體防滑條紋，抓地力強、雨天不打滑、耐腐蝕</li>
                                    <li><b>◆ 現貨尺寸：</b>厚度 <b>1.5mm / 2.0mm / 3.0mm / 4.5mm</b> (標準4x8尺)</li>
                                    <li><b>◆ 現場加工：</b>川洋重型油壓剪床現場定尺寸裁切、可代客折彎！</li>
                                </ul>
                                <div class="vs-actions">
                                    <button type="button" class="btn-vs-pick" onclick="quickFillAndScroll('五線防滑花紋鋁板（車斗/踏板） 厚度: 2.0mm/3.0mm 尺寸: 4尺×8尺 或裁切: mm × mm')">
                                        📋 我要買這個 (填尺寸)
                                    </button>
                                    <button type="button" class="btn-vs-zoom" onclick="openImageLightbox('/static/img_factory/machining_chequered_shear_action.jpg', '五線防滑花紋板現場沖剪實景')">
                                        🔍 實拍照
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- 4. 四角扁條 / 方棒 / 排鋁 -->
                        <div class="visual-shape-card">
                            <div class="vs-img-wrap" onclick="openImageLightbox('/static/img_factory/warehouse_bundled_skids.jpg', '鋁扁條、方棒、排鋁現貨整裝與防護包裝')">
                                <img src="/static/img_factory/warehouse_bundled_skids.jpg" alt="鋁扁條與方棒打包" loading="lazy">
                                <span class="vs-badge-shape">🟫 扁條 / 方棒 / 排鋁</span>
                                <span class="vs-zoom-tip">🔍 點擊看包裝大圖</span>
                            </div>
                            <div class="vs-body">
                                <div class="vs-title-row">
                                    <h4 class="vs-title">長條扁鋁 (四角實心)</h4>
                                    <span class="vs-spec-tag">機架結構滑軌</span>
                                </div>
                                <ul class="vs-features">
                                    <li><b>◆ 常用用途：</b>機台導軌邊條、治具方塊墊塊、導電鋁排、固定條</li>
                                    <li><b>◆ 常備牌號：</b>`6061-T6` (易機械切削) ｜ 各式扁條及正方形棒料</li>
                                    <li><b>◆ 現貨尺寸：</b>厚度 3~50mm，寬度 10~200mm，長度 3米/6米</li>
                                    <li><b>◆ 現場加工：</b>自動高速圓鋸機定寸切斷，端面筆直無毛邊！</li>
                                </ul>
                                <div class="vs-actions">
                                    <button type="button" class="btn-vs-pick" onclick="quickFillAndScroll('四角扁條/方棒/排鋁 厚度: mm 寬度: mm 長度: mm 支數: 支')">
                                        📋 我要買這個 (填尺寸)
                                    </button>
                                    <button type="button" class="btn-vs-zoom" onclick="openImageLightbox('/static/img_factory/warehouse_bundled_skids.jpg', '鋁扁條、方棒現貨整裝')">
                                        🔍 實拍照
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- 5. 中空圓管 / 方管 -->
                        <div class="visual-shape-card">
                            <div class="vs-img-wrap" onclick="openImageLightbox('/static/img_factory/warehouse_7075_tubes_racks.jpg', '7075 與 6061 中空無縫鋁管料架')">
                                <img src="/static/img_factory/warehouse_7075_tubes_racks.jpg" alt="中空無縫鋁管料架" loading="lazy">
                                <span class="vs-badge-shape">⭕ 中空圓管 / 方管</span>
                                <span class="vs-zoom-tip">🔍 點擊看管材大圖</span>
                            </div>
                            <div class="vs-body">
                                <div class="vs-title-row">
                                    <h4 class="vs-title">中空管材 (圓管/方管)</h4>
                                    <span class="vs-spec-tag">套筒滾輪軸心</span>
                                </div>
                                <ul class="vs-features">
                                    <li><b>◆ 常用用途：</b>輸送滾輪軸套、流體管路、輕量化支柱、結構套筒</li>
                                    <li><b>◆ 特殊優勢：</b>無縫高壓管、真圓度高、內孔平整光潔、抗壓強度高</li>
                                    <li><b>◆ 現貨尺寸：</b>多元外徑與壁厚規格，支援薄壁管與超厚壁管材</li>
                                    <li><b>◆ 現場加工：</b>SOCO MC-360NF 非鐵金屬高速圓鋸快速切斷！</li>
                                </ul>
                                <div class="vs-actions">
                                    <button type="button" class="btn-vs-pick" onclick="quickFillAndScroll('中空無縫圓管/方管 外徑: mm 壁厚: mm 長度: mm 支數: 支')">
                                        📋 我要買這個 (填尺寸)
                                    </button>
                                    <button type="button" class="btn-vs-zoom" onclick="openImageLightbox('/static/img_factory/warehouse_7075_tubes_racks.jpg', '中空無縫鋁管料架')">
                                        🔍 實拍照
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- 6. 結構鋁擠型 -->
                        <div class="visual-shape-card">
                            <div class="vs-img-wrap" onclick="openImageLightbox('/static/img_factory/warehouse_extrusions_vertical.jpg', '六米長直立式 A 型架工業鋁擠型儲位區')">
                                <img src="/static/img_factory/warehouse_extrusions_vertical.jpg" alt="工業結構鋁擠型料架" loading="lazy">
                                <span class="vs-badge-shape">📐 工業結構鋁擠型</span>
                                <span class="vs-zoom-tip">🔍 點擊看擠型大圖</span>
                            </div>
                            <div class="vs-body">
                                <div class="vs-title-row">
                                    <h4 class="vs-title">結構鋁擠型 (機架組合)</h4>
                                    <span class="vs-spec-tag">工作桌防護罩</span>
                                </div>
                                <ul class="vs-features">
                                    <li><b>◆ 常用用途：</b>組裝機台外框、無塵室工作桌、安全防護罩、滑軌支架</li>
                                    <li><b>◆ 標準常備：</b>2020、3030、4040、4080、8080 等歐規/日規鋁擠型</li>
                                    <li><b>◆ 齊全配件：</b>角件螺絲螺帽、端蓋、活動鉸鏈、地腳輪一站購足</li>
                                    <li><b>◆ 現場加工：</b>直角度精密鋸切、斜角45度鋸切，即買即組裝！</li>
                                </ul>
                                <div class="vs-actions">
                                    <button type="button" class="btn-vs-pick" onclick="quickFillAndScroll('工業結構鋁擠型 規格: 4040/3030 長度: mm 支數: 支 (含配件)')">
                                        📋 我要買這個 (填尺寸)
                                    </button>
                                    <button type="button" class="btn-vs-zoom" onclick="openImageLightbox('/static/img_factory/warehouse_extrusions_vertical.jpg', '工業結構鋁擠型儲位')">
                                        🔍 實拍照
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
'''

# Insert visual-finder-section before <!-- Home Quick Portal Directory -->
target_portal = '<!-- Home Quick Portal Directory (八大核心專區分頁入口) -->'
if target_portal in html:
    html = html.replace(target_portal, vf_html + '\n                ' + target_portal)
    print('Successfully inserted visual-finder-section before portal directory!')
else:
    print('WARNING: target_portal not found!')

# 2. Update quote form with machinist-quick-picks and photo upload hint
quote_target = '<div class="form-group full">\n                                    <label for="inquiryMaterial" data-i18n="contact.lbl_material">材料型號與規格需求</label>'
quote_replacement = '''<div class="form-group full">
                                    <!-- 現場師傅形狀快捷列 (點選直接帶入) -->
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
                                    </div>
                                    <label for="inquiryMaterial" data-i18n="contact.lbl_material">材料型號與規格需求 *</label>'''

if quote_target in html:
    html = html.replace(quote_target, quote_replacement)
    print('Successfully inserted machinist-quick-picks into quote form!')
else:
    print('WARNING: quote_target not found!')

# 3. Enhance dropzone with mobile camera button
drop_target = '<div class="dropzone-icon">📐</div>'
drop_replacement = '''<div class="dropzone-icon" style="font-size: 2rem;">📐📸</div>
                                            <div class="dropzone-text">
                                                <strong style="color: #a62c22; font-size: 1.05rem;"><span data-i18n="upload_click_drag">點擊拍照上傳 / 拖曳圖檔至此</span></strong>
                                                <span><span data-i18n="upload_formats_desc">📷 <b>現場手寫尺寸便條紙、舊工件或樣品直接拍一張照片上傳</b>，亦支援 CAD (.DXF, .DWG, .PDF, .STEP)</span></span>
                                            </div>
                                            <button type="button" class="btn btn-secondary btn-sm" style="padding: 8px 14px; font-size: 0.88rem; font-weight: 700; background: #fff; border-color: #a62c22; color: #a62c22;" onclick="document.getElementById('drawingFileInput').click()">📸 拍照 / 選取照片圖檔</button>'''

# Let's inspect dropzone text
if 'dropzone-icon">📐</div>' in html:
    # replace the inner dropzone content
    old_drop_block = '''<div class="dropzone-icon">📐</div>
                                            <div class="dropzone-text">
                                                <strong><span data-i18n="upload_click_drag">點擊選取或拖曳圖檔至此</span></strong>
                                                <span><span data-i18n="upload_formats_desc">支援 2D (.DXF, .DWG, .PDF) 及 3D 實體模型 (.STEP, .STP, .IGES, .ZIP)，單檔最大 50MB</span></span>
                                            </div>
                                            <button type="button" class="btn btn-secondary btn-sm" style="pointer-events:none; padding: 6px 12px; font-size: 0.8rem;" data-i18n="contact.browse_files">瀏覽檔案</button>'''
    if old_drop_block in html:
        html = html.replace(old_drop_block, drop_replacement)
        print('Successfully enhanced dropzone with camera option!')
    else:
        print('Notice: old_drop_block slightly differed, doing regex replace')
        html = re.sub(
            r'<div class="dropzone-icon">📐</div>\s*<div class="dropzone-text">.*?</div>\s*<button[^>]+>.*?</button>',
            drop_replacement,
            html,
            flags=re.DOTALL
        )
        print('Regex replaced dropzone!')

with open('templates/index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print('Updated templates/index.html successfully!')
