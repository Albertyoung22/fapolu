import requests
import json

base_url = "http://127.0.0.1:5000"

print("1. Testing GET / ...")
r = requests.get(base_url, timeout=5)
print(f"Status: {r.status_code}, Length: {len(r.text)}")
assert r.status_code == 200
assert "法寶實業有限公司" in r.text
print("✓ Index HTML OK!")

print("\n2. Testing GET /api/specs?q=5052 ...")
r = requests.get(f"{base_url}/api/specs?q=5052&per_page=5", timeout=5)
print(f"Status: {r.status_code}")
data = r.json()
print(f"Total matching 5052 specs: {data['total']}, Returned items: {len(data['items'])}")
assert r.status_code == 200
assert data['total'] > 0
print("✓ Specs API OK!")

print("\n3. Testing GET /api/tts ...")
r = requests.get(f"{base_url}/api/tts?text=法寶實業歡迎您&voice=zh-TW-HsiaoChenNeural", timeout=10)
print(f"Status: {r.status_code}, Response: {r.json()}")
assert r.status_code == 200
assert "url" in r.json()
print("✓ Edge TTS API OK!")

print("\n4. Testing POST /api/contact ...")
contact_payload = {
    "companyName": "先進半導體測試",
    "contactPerson": "張工程師",
    "contactPhone": "0912-888-999",
    "contactEmail": "engineer@test.com",
    "inquiryMaterial": "UACJ 5052 貼膜板 20mm",
    "inquiryMessage": "測試詢價"
}
r = requests.post(f"{base_url}/api/contact", json=contact_payload, timeout=5)
print(f"Status: {r.status_code}, Response: {r.json()}")
assert r.status_code == 200
assert r.json()['success'] is True
print("✓ Contact RFQ API OK!")

print("\n🎉 ALL TESTS PASSED SUCCESSFULLY!")

