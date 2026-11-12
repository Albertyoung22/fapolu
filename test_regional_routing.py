import app
import db

with app.app.test_client() as client:
    # 1. Test North
    res1 = client.post('/api/contact', json={
        'companyName': '新竹半導體研發科技',
        'contactPerson': '李經理',
        'contactPhone': '0933111222',
        'contactEmail': 'hsinchu@test.com',
        'deliveryCounty': '新竹市',
        'inquiryMaterial': '6061-T651 鋁板 30mm',
        'inquiryMessage': '需要兩面銑平與陽極處理'
    })
    print('North Submission:', res1.status_code, res1.get_json())

    # 2. Test Central
    res2 = client.post('/api/contact', json={
        'companyName': '台中精密機械企業',
        'contactPerson': '張廠長',
        'contactPhone': '0922333444',
        'contactEmail': 'taichung@test.com',
        'deliveryCounty': '台中市',
        'inquiryMaterial': '7075 圓棒 Dia.80',
        'inquiryMessage': 'CNC 定寸切斷'
    })
    print('Central Submission:', res2.status_code, res2.get_json())

    # 3. Test South
    res3 = client.post('/api/contact', json={
        'companyName': '南部造船工業社',
        'contactPerson': '黃課長',
        'contactPhone': '0911555666',
        'contactEmail': 'kaohsiung@test.com',
        'deliveryCounty': '高雄市',
        'inquiryMaterial': '5083 防鏽花紋板 5mm',
        'inquiryMessage': '折彎與防滑加工'
    })
    print('South Submission:', res3.status_code, res3.get_json())

    # Check Inquiries from DB
    inquiries = db.get_all_inquiries()
    print('\n=== LATEST INQUIRIES ROUTING IN DB ===')
    for item in inquiries[-3:]:
        c_name = item.get('company_name') or item.get('companyName')
        branch = item.get('branch')
        tid = item.get('id')
        print(f"[{tid}] {c_name} -> {branch}")
