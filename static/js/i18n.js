/**
 * FAPO ENTERPRISE - Multi-Language Internationalization (i18n) Engine
 * Languages: Traditional Chinese (zh-TW), English (en), Japanese (ja), Korean (ko)
 */

(function() {
    'use strict';

    const TRANSLATIONS = {
        'zh-TW': {
            'site.title': '法寶實業有限公司 | FAPO ENTERPRISE - 全方位鋁合金材料供應鏈與精密加工',
            'site.company': '法寶實業有限公司',
            'site.tagline': 'FAPO ENTERPRISE CO., LTD. · 創立於 1986',
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

            'hero.badge': '✦ 創立於 1986 · 近四十年金屬深耕',
            'hero.title': '全方位鋁合金材料供應鏈<br>與精密加工',
            'hero.lead': '結合深厚金屬冶金專業與先進 CNC 精密銑削、大尺寸鋸切及原廠出廠證明，為航太、半導體及精密工業客戶提供可靠夥伴級服務。',
            'hero.btn_quote': '📋 立即線上圖面估價',
            'hero.btn_specs': '🔍 檢索現貨庫存規格',
            'hero.btn_tour': '🎙️ 啟動沉浸式語音導覽',
            'hero.stat1_num': '38+',
            'hero.stat1_label': '年產業服務經驗',
            'hero.stat2_num': '3,071+',
            'hero.stat2_label': '筆在庫規格與模號',
            'hero.stat3_num': '4',
            'hero.stat3_label': '大北中南物流服務處',
            'hero.stat4_num': '100%',
            'hero.stat4_label': '附原廠出廠材質證明',

            'section.about_tag': 'About FAPO',
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

            'footer.desc': '深耕台灣近四十載，以鋁為本、服務為先。全方位供應純鋁、鋁合金板、擠型材、特殊合金與精密 CNC 加工、表面陽極一貫化整合服務。',
            'footer.col_nav': '快速導覽',
            'footer.col_tech': '技術與加工',
            'footer.col_quality': '品質與認證',
            'footer.rights': '版權所有',

            'action.call': '📞 直接通話',
            'action.map': '🗺️ 地圖導航',
            'action.intro': '🎙️ 語音導覽與特色介紹',

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
            'site.title': 'FAPO ENTERPRISE CO., LTD. | Integrated Aluminum Supply Chain & Precision Machining',
            'site.company': 'FAPO ENTERPRISE CO., LTD.',
            'site.tagline': 'Established in 1986 · Precision Aluminum & Alloys',
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

            'hero.badge': '✦ Founded in 1986 · 40 Years of Aluminum Excellence',
            'hero.title': 'Integrated Aluminum Supply Chain<br>& Precision Machining',
            'hero.lead': 'Combining metallurgical expertise with state-of-the-art CNC milling, large-scale cutting, and certified mill sheets to empower aerospace, semiconductor, and industrial manufacturing.',
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

            'section.about_tag': 'About FAPO',
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

            'footer.desc': 'Rooted in Taiwan for nearly 40 years, prioritizing quality and customer partnership. Complete supplier of pure aluminum, alloy plates, custom extrusions, precision CNC machining, and surface anodizing.',
            'footer.col_nav': 'Navigation',
            'footer.col_tech': 'Technology & Machining',
            'footer.col_quality': 'Quality & Standards',
            'footer.rights': 'All Rights Reserved',

            'action.call': '📞 Call Now',
            'action.map': '🗺️ Google Maps',
            'action.intro': '🎙️ Audio Tour & Feature Overview',

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
            'site.title': '法宝実業有限公司 | FAPO ENTERPRISE - アルミニウム総合材料サプライチェーンと超精密加工',
            'site.company': '法宝実業有限公司',
            'site.tagline': '1986年創立 · 高機能アルミニウムと特殊非鉄金属',
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

            'hero.badge': '✦ 1986年創立 · 40年にわたる金属の信頼と実績',
            'hero.title': 'アルミニウム総合材料サプライチェーン<br>と超精密加工技術',
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

            'section.about_tag': 'About FAPO',
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

            'footer.desc': '台湾で40年近くの信頼。アルミを原点とし、顧客第一主義を貫きます。純アルミ、アルミ合金厚板、押出形材、特殊合金の供給から精密CNC加工、表面アルマイト処理までの一貫統合サービス。',
            'footer.col_nav': 'クイックナビ',
            'footer.col_tech': '技術と加工',
            'footer.col_quality': '品質と認証',
            'footer.rights': '無断転載を禁じます',

            'action.call': '📞 電話で問い合わせ',
            'action.map': '🗺️ 地図ナビ',
            'action.intro': '🎙️ 音声ガイドと拠点紹介',

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
            'site.title': '법보실업 유한회사 | FAPO ENTERPRISE - 종합 알루미늄 소재 공급망 및 초정밀 가공',
            'site.company': '법보실업 유한회사',
            'site.tagline': '1986년 창립 · 알루미늄 및 비철금속 정밀가공',
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

            'hero.badge': '✦ 1986년 설립 · 40년 전통의 알루미늄 전문 기업',
            'hero.title': '종합 알루미늄 소재 공급망<br>및 초정밀 가공 솔루션',
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

            'section.about_tag': 'About FAPO',
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

            'footer.desc': '대만에서 40여 년간 고객과 함께 성장해 왔습니다. 순수 알루미늄, 알루미늄 판재, 압출 형재, 특수 합금 공급부터 초정밀 CNC 가공 및 아노다이징 표면처리까지 원스톱 통합 솔루션을 제공합니다.',
            'footer.col_nav': '빠른 이동',
            'footer.col_tech': '기술 및 가공',
            'footer.col_quality': '품질 및 인증',
            'footer.rights': '판권 소유',

            'action.call': '📞 전화 연결',
            'action.map': '🗺️ 지도 보기',
            'action.intro': '🎙️ 음성 안내 및 거점 소개',

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

        // Notify other components (TTS voice, charts, etc.)
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
