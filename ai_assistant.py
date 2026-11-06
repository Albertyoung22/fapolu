# -*- coding: utf-8 -*-
"""
FAPO Enterprise AI Customer Service & Google OR-Tools CP-SAT Optimization Engine
================================================================================
Uses `ortools.sat.python.cp_model` to provide:
1. 1D Cutting Stock Optimization (母材定寸裁切餘料最小化求解)
2. Optimal Inventory Specification Matching (3,071 筆現貨與模具智能選料求解)
3. Multi-Criteria Alloy Recommendation & Natural Language Metallurgy QA
"""

import re
import math
from ortools.sat.python import cp_model


# ==============================================================================
#  1. Google OR-Tools CP-SAT: 1D Cutting Stock Solver (一維母材下料最佳化)
# ==============================================================================
def solve_cutting_stock_cpsat(stock_length_mm=3000, kerf_mm=3, demands=None):
    """
    Solves the 1D Cutting Stock Problem using Google OR-Tools CP-SAT (`cp_model`).

    Parameters:
        stock_length_mm (int): Standard mother bar/plate length in mm (default 3000mm).
        kerf_mm (int): Saw blade kerf loss per cut in mm (default 3mm).
        demands (list of dict): [{"length": 680, "qty": 3}, {"length": 450, "qty": 4}, ...]

    Returns:
        dict: Optimal cutting plan, utilization rate, waste stats, and solver metadata.
    """
    if not demands:
        demands = [
            {"length": 800, "qty": 3},
            {"length": 550, "qty": 4},
            {"length": 420, "qty": 5}
        ]

    stock_L = max(100, min(12000, int(stock_length_mm)))
    kerf = max(0, min(20, int(kerf_mm)))

    valid_demands = []
    for d in demands:
        try:
            length = int(float(d.get("length", 0)))
            qty = int(float(d.get("qty", 0)))
            if 10 <= length <= stock_L and 1 <= qty <= 100:
                valid_demands.append({"length": length, "qty": qty})
        except (ValueError, TypeError):
            continue

    if not valid_demands:
        return {
            "success": False,
            "error": f"請輸入有效的裁切長度（10mm ~ {stock_L}mm）與數量（1 ~ 100支）。"
        }

    # Upper bound on number of stock bars needed
    max_bars = 0
    for d in valid_demands:
        max_per_bar = max(1, (stock_L + kerf) // (d["length"] + kerf))
        max_bars += math.ceil(d["qty"] / max_per_bar)
    max_bars = min(max_bars, 60)

    model = cp_model.CpModel()
    num_items = len(valid_demands)

    # Decision variables:
    # y[b]: 1 if bar b is used, 0 otherwise
    y = [model.NewBoolVar(f"bar_used_{b}") for b in range(max_bars)]

    # x[i, b]: number of pieces of demand i cut from bar b
    x = {}
    for i, d in enumerate(valid_demands):
        max_possible = min(d["qty"], (stock_L + kerf) // (d["length"] + kerf))
        for b in range(max_bars):
            x[(i, b)] = model.NewIntVar(0, max_possible, f"x_{i}_{b}")

    # Constraint 1: Every demand quantity must be exactly satisfied
    for i, d in enumerate(valid_demands):
        model.Add(sum(x[(i, b)] for b in range(max_bars)) == d["qty"])

    # Constraint 2: Total cut lengths + kerf on bar b cannot exceed stock_L * y[b]
    # Note: If k pieces are cut on a bar, there are at most k saw cuts (each piece + kerf <= stock_L + kerf)
    for b in range(max_bars):
        used_len = sum(x[(i, b)] * (valid_demands[i]["length"] + kerf) for i in range(num_items))
        model.Add(used_len <= (stock_L + kerf) * y[b])

    # Constraint 3: Symmetry breaking (use lower-indexed bars first, and order by used length)
    for b in range(max_bars - 1):
        model.Add(y[b] >= y[b + 1])

    # Objective: Minimize total bars used (primary weight = 100,000),
    # and slightly prefer concentrating cuts on earlier bars so the last bar has maximum reusable offcut
    objective_terms = []
    for b in range(max_bars):
        # Primary cost: using a bar costs 100000; secondary bonus: earlier bars have slightly lower weight
        objective_terms.append(y[b] * (100000 + b * 10))
        for i in range(num_items):
            objective_terms.append(x[(i, b)] * b)

    model.Minimize(sum(objective_terms))

    solver = cp_model.CpSolver()
    solver.parameters.max_time_in_seconds = 3.0
    solver.parameters.num_search_workers = 4
    status = solver.Solve(model)

    if status not in (cp_model.OPTIMAL, cp_model.FEASIBLE):
        return {
            "success": False,
            "error": "CP-SAT 求解器無法在限制內找到可行裁切方案，請確認單支裁切長度未超過母材總長。"
        }

    bars_plan = []
    total_net_cut_mm = 0
    total_kerf_mm = 0

    for b in range(max_bars):
        if solver.Value(y[b]) == 1:
            cuts_on_bar = []
            pieces_count = 0
            net_mm = 0
            for i, d in enumerate(valid_demands):
                cnt = solver.Value(x[(i, b)])
                if cnt > 0:
                    cuts_on_bar.append({
                        "length": d["length"],
                        "count": cnt,
                        "label": f"{d['length']}mm × {cnt}支"
                    })
                    pieces_count += cnt
                    net_mm += d["length"] * cnt

            # Kerf count: if pieces occupy full bar, pieces_count - 1; else pieces_count cuts
            kerf_used = pieces_count * kerf
            if net_mm + kerf_used > stock_L:
                kerf_used = max(0, (pieces_count - 1) * kerf)

            rem_mm = max(0, stock_L - net_mm - kerf_used)
            utilization = round((net_mm / stock_L) * 100, 1)

            total_net_cut_mm += net_mm
            total_kerf_mm += kerf_used

            bars_plan.append({
                "bar_no": len(bars_plan) + 1,
                "cuts": cuts_on_bar,
                "cuts_summary": " + ".join(c["label"] for c in cuts_on_bar),
                "net_used_mm": net_mm,
                "kerf_loss_mm": kerf_used,
                "remnant_mm": rem_mm,
                "utilization_pct": utilization
            })

    total_bars_used = len(bars_plan)
    total_stock_mm = total_bars_used * stock_L
    overall_utilization = round((total_net_cut_mm / total_stock_mm) * 100, 2) if total_stock_mm else 0
    total_remnant_mm = max(0, total_stock_mm - total_net_cut_mm - total_kerf_mm)

    return {
        "success": True,
        "solver_status": "OPTIMAL (全域最佳解)" if status == cp_model.OPTIMAL else "FEASIBLE (可行優化解)",
        "solve_time_ms": round(solver.WallTime() * 1000, 2),
        "stock_length_mm": stock_L,
        "kerf_mm": kerf,
        "total_bars_used": total_bars_used,
        "total_pieces_cut": sum(d["qty"] for d in valid_demands),
        "overall_utilization_pct": overall_utilization,
        "total_net_cut_mm": total_net_cut_mm,
        "total_kerf_mm": total_kerf_mm,
        "total_remnant_mm": total_remnant_mm,
        "demands": valid_demands,
        "bars_plan": bars_plan
    }


# ==============================================================================
#  2. Google OR-Tools CP-SAT: Optimal Alloy & Spec Selection (最佳材質與規格選型求解)
# ==============================================================================
ALLOY_PROFILES = [
    {"alloy": "6061-T651", "strength": 86, "corrosion": 88, "machinability": 92, "anodizing": 96, "weldability": 85, "cost_efficiency": 90, "desc": "精密機械、自動化夾治具、半導體腔體與陽極處理主力"},
    {"alloy": "7075-T651", "strength": 98, "corrosion": 65, "machinability": 96, "anodizing": 78, "weldability": 40, "cost_efficiency": 65, "desc": "航太超硬鋁、高應力模具、軍工與高剛性傳動零件首選"},
    {"alloy": "5052-H32",  "strength": 62, "corrosion": 96, "machinability": 72, "anodizing": 88, "weldability": 95, "cost_efficiency": 90, "desc": "耐海水腐蝕、折彎鈑金外殼、船舶與機箱結構主力"},
    {"alloy": "5083-H112", "strength": 75, "corrosion": 98, "machinability": 75, "anodizing": 86, "weldability": 96, "cost_efficiency": 82, "desc": "大型船用結構、低溫壓力容器與高耐蝕厚板"},
    {"alloy": "2024-T351", "strength": 90, "corrosion": 58, "machinability": 90, "anodizing": 68, "weldability": 45, "cost_efficiency": 68, "desc": "高疲勞強度航太結構、飛機骨架與高應力扣件"},
    {"alloy": "1050-H14",  "strength": 35, "corrosion": 98, "machinability": 55, "anodizing": 95, "weldability": 98, "cost_efficiency": 96, "desc": "高導電導熱純鋁、反射板、散熱鰭片與深抽沖壓件"},
    {"alloy": "Korea 4N 超平板", "strength": 78, "corrosion": 95, "machinability": 92, "anodizing": 98, "weldability": 90, "cost_efficiency": 75, "desc": "南韓進口超低殘留內應力精密銑面鋁板，雙面公差極致穩定"}
]


def solve_optimal_alloy_cpsat(weights=None, min_constraints=None):
    """
    Uses Google OR-Tools CP-SAT (`cp_model.CpModel`) to select the optimal alloy
    given engineering priority weights and minimum threshold constraints.
    """
    weights = weights or {"strength": 5, "corrosion": 5, "machinability": 5, "anodizing": 5, "weldability": 3, "cost_efficiency": 5}
    min_constraints = min_constraints or {}

    model = cp_model.CpModel()
    n = len(ALLOY_PROFILES)
    select = [model.NewBoolVar(f"select_alloy_{i}") for i in range(n)]

    # Must pick exactly 1 primary recommendation
    model.Add(sum(select) == 1)

    # Apply hard engineering constraints if feasible
    for i, prof in enumerate(ALLOY_PROFILES):
        for prop, min_val in min_constraints.items():
            if prof.get(prop, 0) < min_val:
                model.Add(select[i] == 0)

    # Objective: Maximize weighted engineering score
    scores = []
    for i, prof in enumerate(ALLOY_PROFILES):
        score = sum(prof.get(k, 50) * int(weights.get(k, 5)) for k in weights)
        scores.append((score, i, prof))

    model.Maximize(sum(score * select[i] for score, i, _ in scores))

    solver = cp_model.CpSolver()
    status = solver.Solve(model)

    if status in (cp_model.OPTIMAL, cp_model.FEASIBLE):
        for score, i, prof in scores:
            if solver.Value(select[i]) == 1:
                ranked = sorted(scores, key=lambda x: x[0], reverse=True)
                return {
                    "primary": prof,
                    "alternatives": [r[2] for r in ranked if r[2]["alloy"] != prof["alloy"]][:2]
                }

    # Fallback if hard constraints were too strict: relax constraints and pick top weighted
    ranked = sorted(scores, key=lambda x: x[0], reverse=True)
    return {
        "primary": ranked[0][2],
        "alternatives": [r[2] for r in ranked[1:3]]
    }


def extract_number(text):
    m = re.search(r'(\d+(?:\.\d+)?)', str(text))
    return float(m.group(1)) if m else None


def find_optimal_inventory_specs_cpsat(query_text, inventory_data):
    """
    Searches inventory_data and uses CP-SAT to rank/select the closest available
    stock/mold specifications with minimal machining allowance waste when a target dimension is requested.
    """
    q = query_text.lower().strip()

    # Extract alloy if mentioned
    target_alloy = None
    for al in ["7075", "6061", "5083", "5052", "2024", "1050", "4n"]:
        if al in q:
            target_alloy = al
            break

    # Extract target shape
    target_shape = None
    shape_keywords = [
        ("圓棒", ["圓棒", "丸棒", "round bar", "棒"]),
        ("圓管", ["圓管", "管", "tube", "pipe"]),
        ("扁條", ["扁條", "鋁排", "扁鋁", "flat"]),
        ("四方條", ["四方條", "方棒", "方條"]),
        ("正方管", ["正方管", "方管"]),
        ("長方管", ["長方管", "矩管"]),
        ("六角條", ["六角", "六方"]),
        ("鋁板", ["鋁板", "厚", "板", "plate", "sheet"])
    ]
    for shape_label, kw_list in shape_keywords:
        if any(k in q for k in kw_list):
            target_shape = shape_label
            break

    # Extract target dimension (e.g. 厚 10mm, 直徑 50mm, 25mm)
    dim_match = re.search(r'(?:厚|直徑|外徑|對邊|dia\.?|φ|ψ|t\s*=?\s*)?\s*(\d+(?:\.\d+)?)\s*(?:mm|公厘|ミリ)?', q)
    target_dim = float(dim_match.group(1)) if dim_match else None
    if target_dim in (6061, 7075, 5052, 5083, 2024, 1050, 3000):
        # Look for another number that is not the alloy code
        nums = [float(x) for x in re.findall(r'\d+(?:\.\d+)?', q) if float(x) not in (6061, 7075, 5052, 5083, 2024, 1050, 3000)]
        target_dim = nums[0] if nums else None

    candidates = []
    for item in inventory_data:
        cat = str(item.get("category", ""))
        mat = str(item.get("material", ""))
        dim = str(item.get("dimension", ""))
        size = str(item.get("size", ""))

        if target_alloy and target_alloy not in mat.lower() and target_alloy not in cat.lower():
            continue
        if target_shape and target_shape not in cat:
            continue

        item_dim_val = extract_number(dim)
        candidates.append((item, item_dim_val))

    if not candidates:
        candidates = [(item, extract_number(item.get("dimension", ""))) for item in inventory_data[:100]]

    # If target_dim is specified, use CP-SAT to select up to 5 optimal specs that satisfy
    # dimension >= target_dim (machining allowance >= 0) while minimizing overshoot + prioritizing stock
    if target_dim is not None:
        valid_cands = [(it, d) for it, d in candidates if d is not None and d >= target_dim and (d - target_dim) <= max(30.0, target_dim * 0.6)]
        if not valid_cands:
            valid_cands = [(it, d) for it, d in candidates if d is not None]

        valid_cands = valid_cands[:80]
        if valid_cands:
            model = cp_model.CpModel()
            k_pick = min(5, len(valid_cands))
            pick = [model.NewBoolVar(f"pick_{i}") for i in range(len(valid_cands))]
            model.Add(sum(pick) == k_pick)

            penalties = []
            for i, (it, d) in enumerate(valid_cands):
                overshoot = abs(d - target_dim)
                under_penalty = 5000 if d < target_dim else 0
                mold_penalty = 20 if it.get("group") == "mold" else 0
                cost = int(overshoot * 100) + under_penalty + mold_penalty
                penalties.append(cost * pick[i])

            model.Minimize(sum(penalties))
            solver = cp_model.CpSolver()
            solver.parameters.max_time_in_seconds = 1.0
            status = solver.Solve(model)

            if status in (cp_model.OPTIMAL, cp_model.FEASIBLE):
                selected = [valid_cands[i][0] for i in range(len(valid_cands)) if solver.Value(pick[i]) == 1]
                selected.sort(key=lambda x: abs((extract_number(x.get("dimension", "")) or 0) - target_dim))
                return selected

    return [c[0] for c in candidates[:6]]


# ==============================================================================
#  3. Main Conversational AI Handler (AI 客服對話大腦)
# ==============================================================================
def process_ai_chat(message, inventory_data):
    """
    Processes user message and returns an AI response with structured cards,
    CP-SAT optimization results, and quick RFQ actions.
    """
    msg = (message or "").strip()
    if not msg:
        return {
            "reply": "您好！我是 **法寶實業 AI 智能工程客服（搭載 Google OR-Tools CP-SAT 最佳化引擎）**。請問今天需要查詢現貨規格、鋁合金選料建議，還是進行母材定寸裁切下料最佳化計算呢？",
            "specs": [],
            "cutting_plan": None
        }

    low = msg.lower()

    # 1. Check if the user is asking for Cutting Stock Optimization (下料 / 裁切 / CP-SAT 算料)
    if any(k in low for k in ["下料", "排料", "裁切優化", "裁切最佳化", "cp-sat", "ortools", "餘料", "幾支母材", "切"]):
        # Try to parse pattern like: 800*3, 550*4 or 800mm 3支
        pairs = re.findall(r'(\d{2,4})\s*(?:mm|公厘)?\s*[x*×,，:：\s]\s*(\d{1,3})\s*(?:支|件|段|片)?', low)
        # Filter out stock length if user wrote "母材 3000mm"
        stock_match = re.search(r'(?:母材|總長|標準長|原料)\s*(\d{3,5})', low)
        stock_len = int(stock_match.group(1)) if stock_match else 3000

        demands = []
        for l_str, q_str in pairs:
            l_val = int(l_str)
            q_val = int(q_str)
            if l_val != stock_len and 10 <= l_val <= stock_len and 1 <= q_val <= 100:
                demands.append({"length": l_val, "qty": q_val})

        if demands:
            plan = solve_cutting_stock_cpsat(stock_length_mm=stock_len, kerf_mm=3, demands=demands)
            if plan.get("success"):
                reply_lines = [
                    f"🧮 **Google OR-Tools CP-SAT 下料最佳化求解完成！**",
                    f"• **求解狀態**：`{plan['solver_status']}`（耗時 `{plan['solve_time_ms']} ms`）",
                    f"• **母材長度**：`{plan['stock_length_mm']} mm`（含每刀鋸縫損耗 `{plan['kerf_mm']} mm`）",
                    f"• **最少需用母材**：**`{plan['total_bars_used']} 支`**（共裁切 `{plan['total_pieces_cut']} 段`）",
                    f"• **材料總利用率**：**`{plan['overall_utilization_pct']}%`**（總餘料 `{plan['total_remnant_mm']} mm`）",
                    "",
                    "📋 **最佳裁切排程明細**："
                ]
                for b in plan["bars_plan"]:
                    reply_lines.append(
                        f"  - **第 {b['bar_no']} 支**：裁切 `{b['cuts_summary']}` ｜ 實耗 `{b['net_used_mm']}mm` ｜ 餘料 `{b['remnant_mm']}mm` (利用率 {b['utilization_pct']}%)"
                    )
                return {
                    "reply": "\n".join(reply_lines),
                    "specs": [],
                    "cutting_plan": plan
                }

    # 2. Check if user asks for Alloy Selection / Recommendation (選料 / 推薦 / 陽極 / 海水 / 航太 / 哪種鋁)
    if any(k in low for k in ["推薦", "選料", "適合", "哪種", "差在哪", "比較", "陽極", "海水", "耐蝕", "航太", "高強度", "超平板", "變形"]):
        weights = {"strength": 5, "corrosion": 5, "machinability": 5, "anodizing": 5, "weldability": 3, "cost_efficiency": 5}
        min_cons = {}
        if any(k in low for k in ["陽極", "外觀", "染色", "硬陽"]):
            weights["anodizing"] = 15
            min_cons["anodizing"] = 85
        if any(k in low for k in ["高強", "航太", "超硬", "模具", "剛性"]):
            weights["strength"] = 18
            min_cons["strength"] = 85
        if any(k in low for k in ["海水", "船舶", "耐蝕", "防鏽", "折彎", "鈑金"]):
            weights["corrosion"] = 16
            weights["weldability"] = 12
            min_cons["corrosion"] = 90
        if any(k in low for k in ["超平", "不變形", "低應力", "半導體", "真空腔"]):
            weights["anodizing"] = 15
            weights["corrosion"] = 15

        rec = solve_optimal_alloy_cpsat(weights, min_cons)
        prim = rec["primary"]
        alts = rec["alternatives"]
        matched_specs = find_optimal_inventory_specs_cpsat(prim["alloy"][:4], inventory_data)

        reply = (
            f"🔬 **CP-SAT 多目標材質選型求解建議**：\n\n"
            f"🏆 **首選推薦牌號：`{prim['alloy']}`**\n"
            f"• **核心優勢**：{prim['desc']}\n"
            f"• **工程指標**：強度評分 `{prim['strength']}` ｜ 耐蝕性 `{prim['corrosion']}` ｜ 切削性 `{prim['machinability']}` ｜ 陽極效果 `{prim['anodizing']}`\n\n"
            f"💡 **次要替代方案**：`{alts[0]['alloy']}`（{alts[0]['desc']}）、`{alts[1]['alloy']}`\n"
            f"下方已為您同步檢索法寶實業現有庫存規格，可一鍵加入詢價單："
        )
        return {
            "reply": reply,
            "specs": matched_specs[:5],
            "cutting_plan": None
        }

    # 3. Check if user asks about company branch / contact / delivery / mill certificate
    if any(k in low for k in ["據點", "電話", "地址", "台北", "台中", "台南", "聯絡", "配送", "送貨", "材質證明", "檢驗", "rohs"]):
        reply = (
            "📍 **法寶實業全台三大直營樞紐與品質保證**：\n\n"
            "• **台北總公司**：台北市松山區民權東路三段136號3樓之5 ｜ ☎️ `(02) 2718-3134`\n"
            "• **台中物流中心**：台中市西屯區台灣大道四段五巷167及167-1號 ｜ ☎️ `(04) 2258-4931`\n"
            "• **台南雙廠區**：台南市佳里區麻佳路三段70巷30號 ｜ ☎️ `(06) 726-3666`\n\n"
            "✅ **隨貨檢附證明**：每批出廠鋁材皆可提供原廠材質證明書（Mill Sheet / MTR）、RoHS / REACH 國際無毒環保檢驗報告。"
        )
        return {"reply": reply, "specs": [], "cutting_plan": None}

    # 4. Inventory / Mold Specification Search with CP-SAT Minimal Machining Allowance Matching
    matched_specs = find_optimal_inventory_specs_cpsat(msg, inventory_data)
    if matched_specs:
        reply = (
            f"📦 **已透過 CP-SAT 規格匹配引擎為您檢索「`{msg}`」的最佳現貨與模具規格**（優先挑選加工裕度最接近、切削餘料最少之項目）：\n"
            f"您可以直接點擊下方規格旁的 **「＋詢價」** 按鈕帶入詢價單，或切換至 **「🧮 CP-SAT 下料優化」** 計算定寸裁切方案！"
        )
        return {
            "reply": reply,
            "specs": matched_specs[:6],
            "cutting_plan": None
        }

    return {
        "reply": (
            "您好！我是法寶實業 AI 智能工程客服。您可以試著問我：\n"
            "1️⃣ **查現貨與模具**：「`6061 圓棒 直徑 50mm`」、「`7075 鋁板 厚 20mm`」、「`鋁扁條`」\n"
            "2️⃣ **CP-SAT 母材裁切優化**：「`母材 3000mm 切 800*3, 550*4, 420*5`」或點擊上方 **「🧮 CP-SAT 下料計算」** 頁籤\n"
            "3️⃣ **工程選料建議**：「`推薦適合硬陽與高強度的鋁合金`」、「`海水耐蝕鈑金用哪種鋁？`」"
        ),
        "specs": [],
        "cutting_plan": None
    }
