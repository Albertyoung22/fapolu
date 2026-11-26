import json
import os
import pandas as pd
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

json_path = r'data\inventory_specs.json'
output_xlsx = r'd:\PythonTest\fapolu\法寶金屬_官網品項規格全量盤點核對表_3071筆.xlsx'
output_csv = r'd:\PythonTest\fapolu\法寶金屬_官網品項規格全量盤點核對表_3071筆.csv'

with open(json_path, 'r', encoding='utf-8') as f:
    raw_data = json.load(f)

# Build rows
rows = []
for item in raw_data:
    group_tw = "📦 常備現貨 (Stock)" if item.get('group') == 'stock' else "⚙️ 現有模具 (Mold)"
    rows.append({
        '系統編號 (ID)': item.get('id', ''),
        '類別群組': group_tw,
        '產品分類 (Category)': item.get('category', ''),
        '材質標示 (Material)': item.get('material', ''),
        '規格/厚度/外徑 (Dimension)': item.get('dimension', ''),
        '尺寸/長度/規格 (Size)': item.get('size', ''),
        '目前狀態備註': item.get('note', ''),
        '【業務審核判定】(保留 / 刪除 / 需修改)': '',
        '【正確規格修正填寫】': '',
        '【修改原因 / 備註說明】': ''
    })

df_all = pd.DataFrame(rows)
df_stock = df_all[df_all['類別群組'].str.contains('現貨')].copy()
df_mold = df_all[df_all['類別群組'].str.contains('模具')].copy()

# Export CSV with BOM for universal Excel compatibility
df_all.to_csv(output_csv, index=False, encoding='utf-8-sig')

# Create Excel with openpyxl
wb = openpyxl.Workbook()
# Remove default sheet
wb.remove(wb.active)

# Color palettes
header_fill_blue = PatternFill(start_color="1E3A8A", end_color="1E3A8A", fill_type="solid") # Dark Navy
header_fill_green = PatternFill(start_color="065F46", end_color="065F46", fill_type="solid") # Emerald for action
header_font = Font(name="微軟正黑體", size=11, bold=True, color="FFFFFF")
regular_font = Font(name="微軟正黑體", size=10)
thin_border = Border(
    left=Side(style='thin', color='CBD5E1'),
    right=Side(style='thin', color='CBD5E1'),
    top=Side(style='thin', color='CBD5E1'),
    bottom=Side(style='thin', color='CBD5E1')
)

sheets_to_create = [
    ("📋 全站品項總表(3071筆)", df_all),
    ("📦 常備現貨專區(514筆)", df_stock),
    ("⚙️ 現有模具專區(2557筆)", df_mold)
]

for title, df in sheets_to_create:
    ws = wb.create_sheet(title=title)
    
    # Write headers
    headers = list(df.columns)
    ws.append(headers)
    
    # Write data rows
    for r in df.itertuples(index=False):
        ws.append(list(r))
        
    # Style header
    for col_idx, col_name in enumerate(headers, 1):
        cell = ws.cell(row=1, column=col_idx)
        cell.font = header_font
        cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        # Highlight action columns in distinctive emerald/gold
        if "業務" in col_name or "修正" in col_name or "修改" in col_name:
            cell.fill = header_fill_green
        else:
            cell.fill = header_fill_blue
            
    # Style data rows and auto-fit column widths
    ws.row_dimensions[1].height = 28
    for row_idx in range(2, len(df) + 2):
        ws.row_dimensions[row_idx].height = 20
        for col_idx in range(1, len(headers) + 1):
            cell = ws.cell(row=row_idx, column=col_idx)
            cell.font = regular_font
            cell.border = thin_border
            if col_idx in [1, 2, 8]:
                cell.alignment = Alignment(horizontal="center", vertical="center")
            else:
                cell.alignment = Alignment(horizontal="left", vertical="center")
                
            # If action columns, add soft hint background
            if col_idx in [8, 9, 10]:
                cell.fill = PatternFill(start_color="F0FDF4", end_color="F0FDF4", fill_type="solid")

    # Column widths
    for col_idx, col_name in enumerate(headers, 1):
        col_letter = get_column_letter(col_idx)
        if col_idx == 1:
            ws.column_dimensions[col_letter].width = 14
        elif col_idx in [2, 3]:
            ws.column_dimensions[col_letter].width = 24
        elif col_idx in [4, 5, 6]:
            ws.column_dimensions[col_letter].width = 22
        elif col_idx == 7:
            ws.column_dimensions[col_letter].width = 14
        elif col_idx == 8:
            ws.column_dimensions[col_letter].width = 24
        elif col_idx in [9, 10]:
            ws.column_dimensions[col_letter].width = 32

    # Freeze panes (freeze header row)
    ws.freeze_panes = 'A2'
    # Enable auto filter
    ws.auto_filter.ref = ws.dimensions

wb.save(output_xlsx)
print(f"Successfully generated Excel: {output_xlsx}")
print(f"Successfully generated CSV: {output_csv}")
