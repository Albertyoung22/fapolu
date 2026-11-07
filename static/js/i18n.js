/**
 * FAPO ENTERPRISE - Multi-Language Internationalization (i18n) Comprehensive Engine
 * Languages: Traditional Chinese (zh-TW), English (en), Japanese (ja), Korean (ko)
 */

(function() {
    'use strict';

    const TRANSLATIONS = {
        'zh-TW': {
            // Site & Global
            'site.title': '法寶實業有限公司 | FAPO ENTERPRISE - 全方位鋁合金材料供應鏈與精密加工',
            'site.company': '法寶實業有限公司',
            'site.tagline': 'FAPO ENTERPRISE CO., LTD. · 創立於 1986',

            // Navigation
            'nav.home': '首頁',
            'nav.about': '關於我們',
            'nav.network': '服務網絡',
            'nav.products': '旗艦材料',
            'nav.specs': '現貨規格',
            'nav.machining': '精密加工',
            'nav.cases': '代表實績',
            'nav.tech': '技術知識庫',
            'nav.contact': '聯絡諮詢',
            'nav.quote': '立即詢價',
            'nav.share': '外網分享',
            'nav.admin': '後台管理',

            // Breadcrumb
            'crumb.home': '🏠 首頁總覽',
            'crumb.rfq': '📋 線上圖面估價 →',

            // Hero Section
            'hero.badge': '✦ 創立於 1986 · 近四十年金屬深耕',
            'hero.title': '全方位鋁合金材料供應鏈<br><span class="highlight">高階精密加工一站整合</span>',
            'hero.lead': '結合深厚金屬冶金專業與先進 CNC 精密銑削、大尺寸鋸切及原廠出廠證明，為航太、半導體及精密工業客戶提供可靠夥伴級服務。',
            'hero.btn_quote': '📋 立即線上圖面估價',
            'hero.btn_specs': '🔍 檢索現貨庫存規格',
            'hero.btn_tour': '🎙️ 啟動沉浸式語音導覽',
            'hero.stat1_num': '38+',
            'hero.stat1_label': '年專業誠信商譽',
            'hero.stat2_num': '3,071+',
            'hero.stat2_label': '現貨與免開模規格',
            'hero.stat3_num': '4',
            'hero.stat3_label': '北中南營運據點',
            'hero.stat4_num': '100%',
            'hero.stat4_label': '原廠材質證明保證',

            // Section Tags & Headers
            'section.about_tag': 'About FAPO Enterprise · Since 1986',
            'section.about_title': '關於法寶 · 沿革與專業承諾',
            'section.network_tag': 'Logistics & Branches',
            'section.network_title': '全台北中南服務網絡佈局',
            'section.products_tag': 'Flagship Materials',
            'section.products_title': '精選旗艦鋁材與多元合金',
            'section.specs_tag': 'Inventory & Mold Specs',
            'section.specs_title': '現貨規格與現有模具即時檢索系統',
            'section.machining_tag': 'High-End Processing',
            'section.machining_title': '高階精密加工與表面工程',
            'section.cases_tag': 'Track Record & Solutions',
            'section.cases_title': '代表實績與產業解決方案',
            'section.tech_tag': 'Engineering Metallurgy Hub',
            'section.tech_title': '鋁材工程知識庫 · 特性選用與物性表',
            'section.contact_tag': 'Direct Inquiry',
            'section.contact_title': '即時諮詢與快速估價',

            // About Us Section
            'about.tag': 'About FAPO Enterprise · Since 1986',
            'about.title': '關於法寶實業 · 深耕台灣四十載',
            'about.desc': 'Since 1986 —— 北、中、南服務網絡再升級 —— 從國際金屬貿易啟航，穩健轉型為兼具「龐大現貨庫存」與「精密裁切加工」的全方位供應鏈夥伴。',
            'about.tab_all': '全部總覽',
            'about.tab_overview': '成立概要',
            'about.tab_vision': '經營理念 & 願景',
            'about.tab_services': '九大營業項目',
            'about.tab_industries': '銷售應用行業',
            'about.seal_tag': '創立於 1986 年 · 成立概要',
            'about.caption_title': '以鋁為本 · 服務為先',
            'about.caption_sub': '全台串連庫存網絡 · 迅速精準調撥送達',
            'about.headline': '深耕台灣四十載，全方位鋁合金材料供應鏈',
            'about.subheadline': 'Since 1986 —— 北、中、南服務網絡再升級',
            'about.h_history': '【企業沿革與願景】',
            'about.history': '法寶實業有限公司成立於 1986 年，初期專注於進出口貿易業務。歷經近 40 年的耕耘，我們已從單純的貿易商，轉型為具備「龐大現貨庫存」與「精密裁切加工能力」的綜合材料供應商。我們致力於提供迅速、優良、高效率的專業服務，成為客戶最堅實的後盾。',
            'about.h_network': '【全台服務據點佈局】',
            'about.net1_title': '台北總公司：',
            'about.net1_desc': '國際貿易樞紐、進出口報關與北部業務行政中心。',
            'about.net2_title': '台中物流中心：',
            'about.net2_desc': '緊鄰國道1號，常備各式工業鋁板棒管與大尺寸精準裁切。',
            'about.net3_title': '台南營運中心：',
            'about.net3_desc': '深耕南部半導體與高科技廊道，配備全新自動化設備與龐大倉儲空間。',
            'about.h_promise': '【我們的承諾】',
            'about.promise': '所有出廠鋁材均具備原廠檢驗證明（Mill Sheet），並提供完善的退換貨保證與即時技術諮詢服務。',
            'about.btn_listen': '🎙️ 語音聆聽成立概要',
            'about.philo_title': '以鋁為本 · 專業誠信 · 卓越創新',
            'about.philo_desc': '我們堅信，優質的材料是精密工業的基石。法寶實業始終秉持誠信原則，引進國際頂級非鐵金屬，透過嚴格的公差管控與客製化加工服務，協助客戶提升產品良率與國際競爭力。',
            'about.vision_title': '全方位金屬供應鏈整合與永續發展',
            'about.vision_intro': '展望未來，法寶實業持續投資智慧化倉儲與高速 CNC 加工設備，拓展半導體腔體與航太結構專用合金庫存，並積極落實下料餘料分類回收與綠色節能供應鏈目標。',
            'about.vp1_title': '✦ 擴大高精度裁切與精密加工能量',
            'about.vp1_desc': '引進高速大型龍門銑削與多軸鋸切設備，提供公差極小化之毛胚客製加工服務。',
            'about.vp2_title': '✦ 建立全台綠色永續回收與減碳供應鏈',
            'about.vp2_desc': '落實下料餘料分類回收與循環再生機制，符合國際綠色環保製造標準規範。',
            'about.vp3_title': '✦ 深化航太與半導體高階合金認證',
            'about.vp3_desc': '每批材料均隨貨附原廠出廠檢驗證明（Mill Sheet），符合 AS9100 與 RoHS 嚴格品質體系。',
            'about.vision_goal': '以近四十年的深厚專業為基石，法寶實業持續超越自我，與台灣高科技製造業攜手邁向全球舞台！',
            'about.btn_listen_vision': '🎙️ 語音聆聽經營理念與願景',
            'about.vis_tag1': '誠信立基 · 整合共榮',
            'about.vis_tag2': '深耕半導體與航太關鍵供應鏈',
            'about.services_heading': '營業項目總覽 · 九大核心服務範疇',
            'about.services_desc': '涵蓋多元金屬材料批發零售、精密機械加工、材料技術顧問與國際環保檢驗證明一貫化支援',
            'about.industries_heading': '銷售與應用行業 · 跨足十一大產業領域',
            'about.industries_desc': '長期供應全台高科技電子、半導體設備、醫療器材、航太運輸及精密機械產業關鍵金屬材料',

            // Network Section
            'network.desc': '為即時回應全台客戶的材料需求，法寶實業於台北、台中、台南雙廠區打造緊密服務網，專屬物流車隊與大尺寸自動化裁切設備，實現最迅速的材料調撥與送達。',

            // Footer
            'footer.desc': '深耕台灣近四十載，以鋁為本、服務為先。全方位供應純鋁、鋁合金板、擠型材、特殊合金與精密 CNC 加工、表面陽極一貫化整合服務。',
            'footer.col_nav': '快速導覽',
            'footer.col_tech': '技術與加工',
            'footer.col_quality': '品質與認證',
            'footer.rights': '版權所有',

            // Actions
            'action.call': '📞 直接通話',
            'action.map': '🗺️ 地圖導航',
            'action.intro': '🎙️ 語音導覽與特色介紹',

            // AI Assistant Widget
            'ai.launcher': 'AI 智能客服',
            'ai.launcher_sub': '現貨查詢 · 智慧算料',
            'ai.header_title': '法寶 AI 智能工程客服',
            'ai.online_status': '即時連線 (3,071 筆現貨/模具規格庫)',
            'ai.tab_chat': '💬 智能規格與選料對答',
            'ai.tab_cpsat': '🧮 母材裁切最佳化',
            'ai.placeholder': '輸入或以語音說出規格需求、裁切尺寸...',
            'ai.send': '發送',
            'ai.chip1': '📦 6061圓棒 50mm',
            'ai.chip2': '🔬 陽極高強選料',
            'ai.chip3': '🧮 智慧下料範例',
            'ai.chip4': '📍 據點與證明',
            'ai.greeting_text': '您好！我是 <strong>法寶實業 AI 智能工程客服</strong>（即時串聯 3,071 筆現貨與模具規格資料庫）。<br><br>您可以直接詢問：<br>• <strong>現貨與模具查詢</strong>：「6061 圓棒 50mm」、「7075 厚 20mm 鋁板」<br>• <strong>智慧裁切排料</strong>：「母材 3000mm 切 800*3, 550*4, 420*5」<br>• <strong>工程選料顧問</strong>：「推薦適合硬陽極與高強度的鋁材」<br><button type="button" class="ai-bubble-audio-btn" onclick="readAloudText(\'您好！我是法寶實業 AI 智慧工程客服。您可以透過語音或文字向我查詢現貨庫存、工程選料，或是使用 Google OR-Tools CP-SAT 進行母材下料裁切最佳化計算！\', this)">🔊 語音朗讀介紹</button>'
        },

        'en': {
            // Site & Global
            'site.title': 'FAPO ENTERPRISE CO., LTD. | Integrated Aluminum Supply Chain & Precision Machining',
            'site.company': 'FAPO ENTERPRISE CO., LTD.',
            'site.tagline': 'Established in 1986 · Precision Aluminum & Specialty Alloys',

            // Navigation
            'nav.home': 'Home',
            'nav.about': 'About Us',
            'nav.network': 'Network',
            'nav.products': 'Materials',
            'nav.specs': 'Stock Specs',
            'nav.machining': 'Machining',
            'nav.cases': 'Case Studies',
            'nav.tech': 'Tech Hub',
            'nav.contact': 'Contact Us',
            'nav.quote': 'Get a Quote',
            'nav.share': 'Share',
            'nav.admin': 'Admin Portal',

            // Breadcrumb
            'crumb.home': '🏠 Home Overview',
            'crumb.rfq': '📋 Online RFQ Quote →',

            // Hero Section
            'hero.badge': '✦ Founded in 1986 · 40 Years of Aluminum Excellence',
            'hero.title': 'Integrated Aluminum Supply Chain<br><span class="highlight">& High-End Precision Machining</span>',
            'hero.lead': 'Combining deep metallurgical expertise with state-of-the-art CNC milling, large-scale sawing, and certified mill test sheets to empower aerospace, semiconductor, and precision engineering.',
            'hero.btn_quote': '📋 Online CAD / Drawing RFQ',
            'hero.btn_specs': '🔍 Search Stock Inventory',
            'hero.btn_tour': '🎙️ Audio Guide Tour',
            'hero.stat1_num': '38+',
            'hero.stat1_label': 'Years of Heritage',
            'hero.stat2_num': '3,071+',
            'hero.stat2_label': 'Stock SKUs & Mold Specs',
            'hero.stat3_num': '4',
            'hero.stat3_label': 'Nationwide Branch Hubs',
            'hero.stat4_num': '100%',
            'hero.stat4_label': 'Certified Mill Sheets (MTR)',

            // Section Tags & Headers
            'section.about_tag': 'About FAPO Enterprise · Since 1986',
            'section.about_title': 'About FAPO · History & Quality Dedication',
            'section.network_tag': 'Logistics & Branches',
            'section.network_title': 'Nationwide Branch & Logistics Network',
            'section.products_tag': 'Flagship Materials',
            'section.products_title': 'Flagship Aluminum & Specialty Alloys',
            'section.specs_tag': 'Inventory & Mold Specs',
            'section.specs_title': 'Real-Time Stock & Mold Specification Explorer',
            'section.machining_tag': 'High-End Processing',
            'section.machining_title': 'High-End Precision Machining & Surface Engineering',
            'section.cases_tag': 'Track Record & Solutions',
            'section.cases_title': 'Track Record & Industry Engineering Solutions',
            'section.tech_tag': 'Engineering Metallurgy Hub',
            'section.tech_title': 'Aluminum Engineering Knowledge & Alloy Properties',
            'section.contact_tag': 'Direct Inquiry',
            'section.contact_title': 'Direct Inquiry & Rapid RFQ Quotation',

            // About Us Section
            'about.tag': 'About FAPO Enterprise · Since 1986',
            'about.title': 'About FAPO Enterprise · Four Decades in Taiwan',
            'about.desc': 'Since 1986 —— Upgraded North-Central-South service hubs —— Transitioning from global metal trading into a full-service aluminum supply chain with vast stock inventory and precision CNC machining.',
            'about.tab_all': 'All Overview',
            'about.tab_overview': 'Company History',
            'about.tab_vision': 'Philosophy & Vision',
            'about.tab_services': '9 Core Services',
            'about.tab_industries': '11 Target Industries',
            'about.seal_tag': 'Founded in 1986 · Company Overview',
            'about.caption_title': 'Aluminum Rooted · Service Foremost',
            'about.caption_sub': 'Nationwide stock network with swift and certified delivery',
            'about.headline': '40 Years of Aluminum Supply Chain & Precision Machining',
            'about.subheadline': 'Since 1986 —— Upgraded North, Central & South Logistics Hubs',
            'about.h_history': '[ Corporate History & Milestones ]',
            'about.history': 'Founded in 1986, FAPO Enterprise initially specialized in international metals trading. Over four decades of dedicated craftsmanship, we have transformed into an integrated industrial aluminum supplier boasting extensive on-hand inventory and high-precision CNC cutting capabilities, serving as a reliable backbone for semiconductor, aerospace, and precision machining leaders.',
            'about.h_network': '[ Nationwide Logistics Hubs ]',
            'about.net1_title': 'Taipei HQ: ',
            'about.net1_desc': 'Global trade nexus, import/export customs clearance, and northern operations center.',
            'about.net2_title': 'Taichung Logistics: ',
            'about.net2_desc': 'Adjacent to National Highway 1, stocking alloy plates, rods, pipes with large-scale sawing.',
            'about.net3_title': 'Tainan Logistics: ',
            'about.net3_desc': 'Serving the southern semiconductor and tech corridor with automated cutting and vast warehouse capacity.',
            'about.h_promise': '[ Our Quality Commitment ]',
            'about.promise': 'Every shipment includes certified mill test sheets (MTR) with 100% traceability and direct metallurgical consulting support.',
            'about.btn_listen': '🎙️ Audio Guide: Company Overview',
            'about.philo_title': 'Alloy Excellence · Professionalism · Integrity',
            'about.philo_desc': 'We believe premium materials form the cornerstone of high-precision manufacturing. FAPO adheres to uncompromising integrity, sourcing world-class alloys and executing micron-level cutting to elevate customer yields and global competitiveness.',
            'about.vision_title': 'Integrated Metal Supply Chain & Sustainability',
            'about.vision_intro': 'Looking ahead, FAPO is expanding automated warehousing and high-speed CNC centers to supply specialized aerospace and semiconductor alloys while establishing sustainable recycling supply chains.',
            'about.vp1_title': '✦ Expanding High-Precision Milling & Sawing',
            'about.vp1_desc': 'Equipped with gantry milling and multi-axis sawing to deliver minimized tolerance custom blanks.',
            'about.vp2_title': '✦ Green Sustainability & Carbon Reduction',
            'about.vp2_desc': 'Implementing scrap alloy sorting and closed-loop recycling complying with RoHS and ISO standards.',
            'about.vp3_title': '✦ Certified Aerospace & Semiconductor Alloys',
            'about.vp3_desc': 'All shipments accompanied by certified mill test sheets adhering to AS9100 and RoHS frameworks.',
            'about.vision_goal': 'Rooted in 40 years of metallurgical excellence, FAPO is proud to partner with high-tech manufacturing leaders worldwide!',
            'about.btn_listen_vision': '🎙️ Audio Guide: Vision & Philosophy',
            'about.vis_tag1': 'Integrity First · Mutual Growth',
            'about.vis_tag2': 'Dedicated to Semiconductor & Aerospace Supply Chains',
            'about.services_heading': 'Business Scope · 9 Core Services',
            'about.services_desc': 'Covering wholesale aluminum plates, precision CNC milling, metallurgical consulting, and certified mill sheets.',
            'about.industries_heading': 'Target Industries · 11 Application Sectors',
            'about.industries_desc': 'Trusted supplier of vital metal materials to semiconductor, aerospace, medical, automation, and transport industries.',

            // Network Section
            'network.desc': 'To meet prompt demands across Taiwan, FAPO operates direct logistics centers in Taipei, Taichung, and Tainan equipped with dedicated transport fleets and automated large-scale cutting equipment.',

            // Footer
            'footer.desc': 'Rooted in Taiwan for nearly 40 years, prioritizing quality and customer partnership. Complete supplier of pure aluminum, alloy plates, custom extrusions, precision CNC machining, and surface anodizing.',
            'footer.col_nav': 'Navigation',
            'footer.col_tech': 'Technology & Machining',
            'footer.col_quality': 'Quality & Standards',
            'footer.rights': 'All Rights Reserved',

            // Actions
            'action.call': '📞 Call Now',
            'action.map': '🗺️ Google Maps',
            'action.intro': '🎙️ Audio Tour & Feature Overview',

            // AI Assistant Widget
            'ai.launcher': 'AI Assistant',
            'ai.launcher_sub': 'Inventory & Cutting Optimizer',
            'ai.header_title': 'FAPO AI Engineering Assistant',
            'ai.online_status': 'Live Connected (3,071 Stock & Mold SKUs)',
            'ai.tab_chat': '💬 Specs & Alloy Q&A',
            'ai.tab_cpsat': '🧮 Cutting Stock Optimizer',
            'ai.placeholder': 'Ask stock specs, cutting plan, or alloy advice...',
            'ai.send': 'Send',
            'ai.chip1': '📦 6061 Rod 50mm',
            'ai.chip2': '🔬 High-Strength & Anodizing',
            'ai.chip3': '🧮 Cutting Demo',
            'ai.chip4': '📍 Hubs & MTR Cert',
            'ai.greeting_text': 'Hello! I am the <strong>FAPO AI Engineering Assistant</strong>, connected in real-time to our database of 3,071 stock items and mold specs.<br><br>Feel free to ask me:<br>• <strong>Stock & Mold Specs</strong>: "6061 Round Bar 50mm", "7075 Aluminum Plate 20mm"<br>• <strong>Smart Cutting Stock</strong>: "Raw stock 3000mm cut 800*3, 550*4, 420*5"<br>• <strong>Alloy Engineering</strong>: "Recommend aluminum for hard anodizing & high strength"<br><button type="button" class="ai-bubble-audio-btn" onclick="readAloudText(\'Hello! I am the FAPO AI Engineering Assistant. You can inquire about our stock inventory, alloy recommendations, or run 1D cutting stock optimization using Google OR-Tools CP-SAT.\', this)">🔊 Audio Introduction</button>'
        },

        'ja': {
            // Site & Global
            'site.title': '法宝実業有限公司 | FAPO ENTERPRISE - アルミニウム総合材料サプライチェーンと超精密加工',
            'site.company': '法宝実業有限公司',
            'site.tagline': '1986年創立 · 高機能アルミニウムと特殊非鉄金属',

            // Navigation
            'nav.home': 'ホーム',
            'nav.about': '会社概要',
            'nav.network': '拠点網',
            'nav.products': '旗艦材料',
            'nav.specs': '在庫規格',
            'nav.machining': '精密加工',
            'nav.cases': '実績紹介',
            'nav.tech': '技術ナレッジ',
            'nav.contact': 'お問い合わせ',
            'nav.quote': 'お見積り',
            'nav.share': '共有',
            'nav.admin': '管理画面',

            // Breadcrumb
            'crumb.home': '🏠 ホーム概要',
            'crumb.rfq': '📋 オンライン見積り →',

            // Hero Section
            'hero.badge': '✦ 1986年創立 · 40年にわたる金属の信頼と実績',
            'hero.title': 'アルミニウム総合材料サプライチェーン<br><span class="highlight">と超精密加工技術</span>',
            'hero.lead': '高度な冶金技術と最新鋭のCNCフライス加工、大型切断機、原廠ミルシート（検査証明書）を兼ね備え、航空宇宙・半導体・精密機器産業に信頼されるパートナーとして貢献します。',
            'hero.btn_quote': '📋 オンライン図面見積り',
            'hero.btn_specs': '🔍 在庫・金型スペック検索',
            'hero.btn_tour': '🎙️ 音声ガイドを開始',
            'hero.stat1_num': '38+',
            'hero.stat1_label': '年の実績と歴史',
            'hero.stat2_num': '3,071+',
            'hero.stat2_label': '点の常備在庫・金型',
            'hero.stat3_num': '4',
            'hero.stat3_label': '大物流・加工センター',
            'hero.stat4_num': '100%',
            'hero.stat4_label': '原廠ミルシート保証',

            // Section Tags & Headers
            'section.about_tag': 'About FAPO Enterprise · Since 1986',
            'section.about_title': '法宝実業について · 沿革と品質へのこだわり',
            'section.network_tag': 'Logistics & Branches',
            'section.network_title': '台湾全域拠点・物流ネットワーク',
            'section.products_tag': 'Flagship Materials',
            'section.products_title': '旗艦アルミニウム材料・特殊合金',
            'section.specs_tag': 'Inventory & Mold Specs',
            'section.specs_title': '在庫規格・既存金型リアルタイム検索システム',
            'section.machining_tag': 'High-End Processing',
            'section.machining_title': '高度精密加工・表面エンジニアリング',
            'section.cases_tag': 'Track Record & Solutions',
            'section.cases_title': '主要実績・産業ソリューション',
            'section.tech_tag': 'Engineering Metallurgy Hub',
            'section.tech_title': 'アルミニウム技術ナレッジ・物性対照表',
            'section.contact_tag': 'Direct Inquiry',
            'section.contact_title': 'お問い合わせ・お見積もり依頼',

            // About Us Section
            'about.tag': 'About FAPO Enterprise · Since 1986',
            'about.title': '法宝実業について · 台湾で40年の歩み',
            'about.desc': '1986年創立 —— 台湾北中南の物流拠点をさらに強化 —— 国際非鉄金属貿易からスタートし、豊富な常備在庫と高精度切断加工を兼ね備えた総合サプライヤーへと成長しました。',
            'about.tab_all': '全体概要',
            'about.tab_overview': '設立概要',
            'about.tab_vision': '経営理念とビジョン',
            'about.tab_services': '9大事業項目',
            'about.tab_industries': '販売適用分野',
            'about.seal_tag': '1986年設立 · 概要',
            'about.caption_title': 'アルミを礎に · 顧客第一',
            'about.caption_sub': '台湾全域在庫網と迅速確実な配送',
            'about.headline': '40年の信頼 · アルミ総合サプライチェーン',
            'about.subheadline': '1986年創立 —— 台湾全土をカバーする3大物流拠点',
            'about.h_history': '【企業の歩みとビジョン】',
            'about.history': '法宝実業有限公司は1986年に設立され、非鉄金属の国際貿易から始まりました。約40年にわたる信頼と実績を積み重ね、現在では「豊富な常備在庫」と「高度精密切断加工」を併せ持つ総合アルミニウム材料サプライヤーへと発展。半導体や航空宇宙分野のお客様に迅速で高品質な製品をお届けしています。',
            'about.h_network': '【台湾全域サービス拠点】',
            'about.net1_title': '台北本社：',
            'about.net1_desc': '国際貿易ハブ、輸出入通関および北部営業管理センター。',
            'about.net2_title': '台中物流センター：',
            'about.net2_desc': '国道1号に隣接し、常備在庫の厚板・棒・パイプと大径精密切断加工を完備。',
            'about.net3_title': '台南物流拠点：',
            'about.net3_desc': '南部半導体・先端産業クラスターに密着し、最新自動化設備と広大な倉庫を配備。',
            'about.h_promise': '【私たちの品質の誓約】',
            'about.promise': 'すべての出荷品に原廠ミルシート（検査証明書）を添付し、万全の品質保証体制と即応技術サポートを提供します。',
            'about.btn_listen': '🎙️ 音声ガイド：設立概要',
            'about.philo_title': '品質至上 · 誠実と信頼 · 技術革新',
            'about.philo_desc': '高品質な材料こそが精密工業の礎であると確信しています。法宝実業は誠実さを社訓とし、世界最高水準の非鉄金属を調達。厳密な寸法公差管理とカスタマイズ加工により、お客様の歩留まり向上と競争力強化に貢献します。',
            'about.vision_title': '総合金属サプライチェーンと持続可能な発展',
            'about.vision_intro': '今後に向けて、スマート物流倉庫と高速CNC加工機への設備投資を強化し、半導体真空チャンバーや航空宇宙専用合金のラインナップを拡充。持続可能なリサイクル供給体制を推進します。',
            'about.vp1_title': '✦ 高精度切断・微細CNC加工能力の拡張',
            'about.vp1_desc': '大型門型フライス盤や多軸切断機を導入し、厳しい公差要求に応える特注加工に対応。',
            'about.vp2_title': '✦ 台湾全域グリーン循環リサイクル体制の確立',
            'about.vp2_desc': '端材の徹底分別とリサイクル循環体制を構築し、RoHSなど国際環境基準に適合。',
            'about.vp3_title': '✦ 航空宇宙・半導体向け高機能合金認証の深化',
            'about.vp3_desc': '全ロットに原廠ミルシートを添付し、AS9100・RoHSなどの厳格な品質基準をクリア。',
            'about.vision_goal': '約40年の確かな技術と信頼を基盤に、台湾の先端ものづくり産業と共に世界へ羽ばたきます！',
            'about.btn_listen_vision': '🎙️ 音声ガイド：理念とビジョン',
            'about.vis_tag1': '誠実と信頼 · 統合による共栄',
            'about.vis_tag2': '半導体・航空宇宙の重要サプライチェーン',
            'about.services_heading': '事業概要 · 9つのコアサービス',
            'about.services_desc': 'アルミニウム板・形材の卸売から精密加工、技術コンサルティング、各種証明書発行までの一貫サポート',
            'about.industries_heading': '納入実績分野 · 11大産業分野への展開',
            'about.industries_desc': '半導体装置、航空宇宙、医療機器、産業用ロボット、精密機器産業へ不可欠な金属素材を安定供給',

            // Network Section
            'network.desc': '台湾全域のお客様のご要望に即応するため、台北・台中・台南に直営拠点を展開。自社専用トラック便と大型自動切断機により迅速確実な納入を実現します。',

            // Footer
            'footer.desc': '台湾で40年近くの信頼。アルミを原点とし、顧客第一主義を貫きます。純アルミ、アルミ合金厚板、押出形材、特殊合金の供給から精密CNC加工、表面アルマイト処理までの一貫統合サービス。',
            'footer.col_nav': 'クイックナビ',
            'footer.col_tech': '技術と加工',
            'footer.col_quality': '品質と認証',
            'footer.rights': '無断転載を禁じます',

            // Actions
            'action.call': '📞 電話で問い合わせ',
            'action.map': '🗺️ 地図ナビ',
            'action.intro': '🎙️ 音声ガイドと拠点紹介',

            // AI Assistant Widget
            'ai.launcher': 'AI 営業技術相談',
            'ai.launcher_sub': 'リアルタイム在庫・歩留り計算',
            'ai.header_title': '法宝 AI 技術相談アシスタント',
            'ai.online_status': 'オンライン接続中 (3,071件の在庫・金型DB連携)',
            'ai.tab_chat': '💬 規格・材料選定AI相談',
            'ai.tab_cpsat': '🧮 定寸切断最適化',
            'ai.placeholder': '規格、切断寸法、合金選定のご相談を入力...',
            'ai.send': '送信',
            'ai.chip1': '📦 6061 丸棒 50mm',
            'ai.chip2': '🔬 高強度・陽極酸化選定',
            'ai.chip3': '🧮 定寸切断サンプル',
            'ai.chip4': '📍 拠点とミルシート',
            'ai.greeting_text': 'こんにちは！<strong>法宝実業 AI 営業技術アシスタント</strong>です（3,071件の常備在庫および金型仕様データベースとリアルタイム連携）。<br><br>お気軽にお尋ねください：<br>• <strong>在庫・金型スペック検索</strong>：「6061 丸棒 50mm」、「7075 板厚 20mm」<br>• <strong>スマート定寸切断・歩留り計算</strong>：「母材 3000mm 切断 800*3, 550*4, 420*5」<br>• <strong>材料選定・技術相談</strong>：「硬質アルマイトおよび高強度に適したアルミ材」<br><button type="button" class="ai-bubble-audio-btn" onclick="readAloudText(\'こんにちは！法宝実業 AI 営業技術アシスタントです。在庫規格の検索や合金選定、グーグル OR-Tools CP-SAT による定寸切断の最適化計算をご案内いたします。\', this)">🔊 音声で案内を聞く</button>'
        },

        'ko': {
            // Site & Global
            'site.title': '법보실업 유한회사 | FAPO ENTERPRISE - 종합 알루미늄 소재 공급망 및 초정밀 가공',
            'site.company': '법보실업 유한회사',
            'site.tagline': '1986년 창립 · 알루미늄 및 비철금속 정밀가공',

            // Navigation
            'nav.home': '홈',
            'nav.about': '회사소개',
            'nav.network': '거점망',
            'nav.products': '주요소재',
            'nav.specs': '재고규격',
            'nav.machining': '정밀가공',
            'nav.cases': '대표실적',
            'nav.tech': '기술지식',
            'nav.contact': '문의하기',
            'nav.quote': '견적요청',
            'nav.share': '공유',
            'nav.admin': '관리자',

            // Breadcrumb
            'crumb.home': '🏠 홈 개요',
            'crumb.rfq': '📋 온라인 견적요청 →',

            // Hero Section
            'hero.badge': '✦ 1986년 설립 · 40년 전통의 알루미늄 전문 기업',
            'hero.title': '종합 알루미늄 소재 공급망<br><span class="highlight">및 초정밀 가공 솔루션</span>',
            'hero.lead': '깊이 있는 금속 야금 기술력과 첨단 CNC 밀링, 대형 절단기 및 공인 원자재 밀시트(검사증명서)를 바탕으로 항공우주, 반도체 및 정밀 산업 고객에게 신뢰할 수 있는 파트너십을 제공합니다.',
            'hero.btn_quote': '📋 도면 기반 실시간 견적',
            'hero.btn_specs': '🔍 실시간 재고 규격 검색',
            'hero.btn_tour': '🎙️ 음성 가이드 도슨트',
            'hero.stat1_num': '38+',
            'hero.stat1_label': '년 역사의 기술과 신뢰',
            'hero.stat2_num': '3,071+',
            'hero.stat2_label': '개 상시 보유 재고 규격',
            'hero.stat3_num': '4',
            'hero.stat3_label': '대 전국 물류 및 가공 공장',
            'hero.stat4_num': '100%',
            'hero.stat4_label': '정품 밀시트(MTR) 보증',

            // Section Tags & Headers
            'section.about_tag': 'About FAPO Enterprise · Since 1986',
            'section.about_title': '법보실업 소개 · 연혁 및 품질 약속',
            'section.network_tag': 'Logistics & Branches',
            'section.network_title': '대만 전국 서비스 및 물류 거점망',
            'section.products_tag': 'Flagship Materials',
            'section.products_title': '엄선된 주요 알루미늄 및 특수 합금',
            'section.specs_tag': 'Inventory & Mold Specs',
            'section.specs_title': '재고 규격 및 보유 금형 실시간 검색 시스템',
            'section.machining_tag': 'High-End Processing',
            'section.machining_title': '고정밀 가공 및 표면처리 엔지니어링',
            'section.cases_tag': 'Track Record & Solutions',
            'section.cases_title': '대표 실적 및 산업별 솔루션',
            'section.tech_tag': 'Engineering Metallurgy Hub',
            'section.tech_title': '알루미늄 엔지니어링 지식 허브 및 물성 대조표',
            'section.contact_tag': 'Direct Inquiry',
            'section.contact_title': '실시간 상담 및 빠른 견적 요청',

            // About Us Section
            'about.tag': 'About FAPO Enterprise · Since 1986',
            'about.title': '법보실업 소개 · 대만 40년 전통의 기업',
            'about.desc': '1986년 설립 —— 대만 전국 물류 및 가공 거점 강화 —— 국제 비철금속 무역으로 출발하여 방대한 상시 재고와 정밀 절단 가공력을 갖춘 종합 알루미늄 공급망 파트너로 도약했습니다.',
            'about.tab_all': '전체 개요',
            'about.tab_overview': '설립 개요',
            'about.tab_vision': '경영 이념 및 비전',
            'about.tab_services': '9대 핵심 사업',
            'about.tab_industries': '11대 산업 분야',
            'about.seal_tag': '1986년 설립 · 회사 개요',
            'about.caption_title': '알루미늄의 기본 · 고객 최우선',
            'about.caption_sub': '전국 재고망 연동 및 신속하고 정밀한 납품',
            'about.headline': '40년 역사 · 종합 알루미늄 공급망 파트너',
            'about.subheadline': '1986년 창립 —— 대만 전역을 잇는 3대 물류 네트워크',
            'about.h_history': '[ 기업 연혁 및 비전 ]',
            'about.history': '법보실업 유한회사는 1986년 설립 이래 비철금속 국제 무역을 시작으로 성장해 왔습니다. 지난 40여 년간의 기술 축적을 통해 단순 무역상을 넘어 방대한 상시 재고와 초정밀 CNC 절단 가공 기술을 갖춘 종합 알루미늄 전문 기업으로 도약했습니다.',
            'about.h_network': '[ 전국 물류 거점망 ]',
            'about.net1_title': '타이베이 본사: ',
            'about.net1_desc': '국제 무역 허브, 수출입 통관 및 북부 영업 관리 센터.',
            'about.net2_title': '타이중 물류센터: ',
            'about.net2_desc': '국도 1호선 인근, 판재/환봉/파이프 상시 보유 및 대형 정밀 절단 설비 완비.',
            'about.net3_title': '타이난 물류거점: ',
            'about.net3_desc': '남부 반도체 및 첨단 기술 산업단지 지원, 최신 자동화 절단 설비와 대규모 물류 창고 보유.',
            'about.h_promise': '[ 우리의 품질 약속 ]',
            'about.promise': '모든 출하 소재에 공인 원자재 밀시트(MTR)를 100% 동봉하며 철저한 품질 보증 및 전문 기술 자문을 제공합니다.',
            'about.btn_listen': '🎙️ 음성 가이드: 회사 개요',
            'about.philo_title': '품질 본위 · 전문성과 신뢰 · 기술 혁신',
            'about.philo_desc': '우수한 품질의 소재가 정밀 산업의 초석이라 믿습니다. 법보실업은 철저한 품질 관리와 맞춤형 정밀 가공을 통해 고객사의 수율 향상과 글로벌 경쟁력 강화에 기여합니다.',
            'about.vision_title': '종합 금속 공급망 및 지속 가능한 발전',
            'about.vision_intro': '앞으로 스마트 물류 창고와 초고속 CNC 가공 장비 투자를 확대하여 반도체 진공 챔버 및 항공우주 전용 합금 라인업을 강화하고, 지속 가능한 친환경 공급망을 구축해 나갈 것입니다.',
            'about.vp1_title': '✦ 고정밀 밀링 및 대형 절단 가공력 확대',
            'about.vp1_desc': '대형 갠트리 밀링 및 다축 절단기를 도입하여 공차를 최소화한 맞춤형 소재 공급.',
            'about.vp2_title': '✦ 친환경 순환 경제 및 탄소 중립 공급망',
            'about.vp2_desc': '가공 잔재물의 엄격한 분류 및 재활용 순환 시스템을 운영하여 환경 규범 준수.',
            'about.vp3_title': '✦ 항공우주 및 반도체 공인 고성능 합금 강화',
            'about.vp3_desc': '모든 출하 소재에 공인 밀시트(MTR)를 동봉하며 AS9100 및 RoHS 품질 기준 준수.',
            'about.vision_goal': '40여 년간 축적된 전문성을 바탕으로 글로벌 첨단 제조 기업들과 함께 전진하겠습니다!',
            'about.btn_listen_vision': '🎙️ 음성 가이드: 이념과 비전',
            'about.vis_tag1': '신뢰 기반 · 동반 성장',
            'about.vis_tag2': '반도체 및 항공우주 핵심 공급망 강화',
            'about.services_heading': '사업 개요 · 9대 핵심 사업 영역',
            'about.services_desc': '알루미늄 판재/형재 도소매, 초정밀 CNC 가공, 금속 기술 컨설팅 및 환경 인증 원스톱 지원',
            'about.industries_heading': '주요 공급 분야 · 11대 핵심 산업군',
            'about.industries_desc': '반도체 장비, 항공우주, 의료기기, 자동화 로봇 및 정밀 기계 산업에 고품질 소재 안정적 공급',

            // Network Section
            'network.desc': '대만 전역 고객의 긴급한 자재 수요에 대응하기 위해 타이베이, 타이중, 타이난 거점을 구축하고 전용 물류 차량과 첨단 자동화 절단 설비로 신속한 납품을 실현합니다.',

            // Footer
            'footer.desc': '대만에서 40여 년간 고객과 함께 성장해 왔습니다. 순수 알루미늄, 알루미늄 판재, 압출 형재, 특수 합금 공급부터 초정밀 CNC 가공 및 아노다이징 표面처리까지 원스톱 통합 솔루션을 제공합니다.',
            'footer.col_nav': '빠른 이동',
            'footer.col_tech': '기술 및 가공',
            'footer.col_quality': '품질 및 인증',
            'footer.rights': '판권 소유',

            // Actions
            'action.call': '📞 전화 연결',
            'action.map': '🗺️ 지도 보기',
            'action.intro': '🎙️ 음성 안내 및 거점 소개',

            // AI Assistant Widget
            'ai.launcher': 'AI 스마트 고객지원',
            'ai.launcher_sub': '실시간 재고 · 최적 절단 계산',
            'ai.header_title': '법보 AI 엔지니어링 챗봇',
            'ai.online_status': '실시간 연결 중 (3,071개 재고/금형 DB 연동)',
            'ai.tab_chat': '💬 규격 및 소재 상담',
            'ai.tab_cpsat': '🧮 절단 최적화 계산기',
            'ai.placeholder': '규격 검색, 절단 치수, 소재 추천 문의...',
            'ai.send': '전송',
            'ai.chip1': '📦 6061 환봉 50mm',
            'ai.chip2': '🔬 아노다이징 고강도 소재',
            'ai.chip3': '🧮 절단 계산 예시',
            'ai.chip4': '📍 거점 및 밀시트',
            'ai.greeting_text': '안녕하십니까! <strong>법보실업 AI 엔지니어링 챗봇</strong>입니다 (3,071건의 상시 보유 재고 및 금형 규격 DB 실시간 연동).<br><br>편하게 문의해 주세요:<br>• <strong>재고 및 금형 규격 조회</strong>: "6061 환봉 50mm", "7075 판재 두께 20mm"<br>• <strong>스마트 모재 절단 최적화</strong>: "원자재 3000mm 절단 800*3, 550*4, 420*5"<br>• <strong>엔지니어링 소재 추천</strong>: "하드 아노다이징 및 고강도에 적합한 알루미늄 추천"<br><button type="button" class="ai-bubble-audio-btn" onclick="readAloudText(\'안녕하십니까! 법보실업 AI 엔지니어링 챗봇입니다. 재고 규격 검색과 소재 추천, 구글 OR-Tools CP-SAT 모재 절단 최적화 솔루션을 제공합니다.\', this)">🔊 음성 안내 듣기</button>'
        }
    };

    const LANG_LABELS = {
        'zh-TW': { label: '繁體中文', flag: '🇹🇼' },
        'en': { label: 'English', flag: '🇺🇸' },
        'ja': { label: '日本語', flag: '🇯🇵' },
        'ko': { label: '한국어', flag: '🇰🇷' }
    };

    window.getCurrentLanguage = function() {
        return localStorage.getItem('fapo_lang') || 'zh-TW';
    };

    window.switchLanguage = function(lang) {
        if (!TRANSLATIONS[lang]) lang = 'zh-TW';
        localStorage.setItem('fapo_lang', lang);
        document.documentElement.lang = lang;

        // Update dropdown button text and flag
        const labelEl = document.getElementById('langCurrentLabel');
        const info = LANG_LABELS[lang];
        if (labelEl && info) {
            labelEl.textContent = info.label;
        }

        // Update active class in dropdowns
        document.querySelectorAll('.lang-opt').forEach(opt => {
            opt.classList.toggle('active', opt.dataset.lang === lang);
        });
        document.querySelectorAll('.mobile-lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });

        // Close dropdown
        const wrap = document.getElementById('langSelectorWrap');
        if (wrap) wrap.classList.remove('open');
        const btn = document.getElementById('langCurrentBtn');
        if (btn) btn.setAttribute('aria-expanded', 'false');

        // Apply translations
        applyTranslations(lang);

        // Notify other components (TTS voice, charts, router crumb & pager)
        window.dispatchEvent(new CustomEvent('fapo-language-changed', { detail: { lang: lang } }));
    };

    function applyTranslations(lang) {
        const dict = TRANSLATIONS[lang] || TRANSLATIONS['zh-TW'];
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.dataset.i18n;
            if (dict[key]) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = dict[key];
                } else {
                    el.innerHTML = dict[key];
                }
            }
        });

        // Update AI Chat initial greeting bubble if still showing default greeting
        const defaultBubble = document.getElementById('aiDefaultGreeting');
        if (defaultBubble && dict['ai.greeting_text']) {
            defaultBubble.innerHTML = dict['ai.greeting_text'];
        }

        // Update Subpage Crumb Label and Pager buttons immediately if helper is present
        if (window.updateSubpageCrumbAndPager) {
            window.updateSubpageCrumbAndPager(window.CURRENT_PAGE_ID || 'hero');
        }
    }

    function initLanguageSelector() {
        const wrap = document.getElementById('langSelectorWrap');
        const btn = document.getElementById('langCurrentBtn');
        if (btn && wrap) {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const isOpen = wrap.classList.toggle('open');
                btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            });

            document.addEventListener('click', (e) => {
                if (!wrap.contains(e.target)) {
                    wrap.classList.remove('open');
                    btn.setAttribute('aria-expanded', 'false');
                }
            });
        }

        // Apply saved or browser language
        let savedLang = localStorage.getItem('fapo_lang');
        if (!savedLang) {
            const navLang = (navigator.language || '').toLowerCase();
            if (navLang.startsWith('ja')) savedLang = 'ja';
            else if (navLang.startsWith('ko')) savedLang = 'ko';
            else if (navLang.startsWith('en')) savedLang = 'en';
            else savedLang = 'zh-TW';
        }
        window.switchLanguage(savedLang);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLanguageSelector);
    } else {
        initLanguageSelector();
    }
})();
