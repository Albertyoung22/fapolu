import asyncio
import os
import json
import edge_tts

VOICES = [
    ("zh-TW-HsiaoChenNeural", ""),       # Taiwan female professional neural voice -> tour_xxx.mp3
    ("zh-TW-YunJheNeural", "_male"),     # Taiwan male steady neural voice -> tour_xxx_male.mp3
]

async def generate():
    with open('data/fapolu_complete_data.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    os.makedirs('static/audio', exist_ok=True)
    
    for voice_name, suffix in VOICES:
        for ch in data['tour_chapters']:
            base_path = ch['audio_file'].lstrip('/')
            if suffix:
                root, ext = os.path.splitext(base_path)
                out_path = f"{root}{suffix}{ext}"
            else:
                out_path = base_path

            if suffix == "" and os.path.exists(out_path) and os.path.getsize(out_path) > 10000:
                print(f"Skipping existing [{ch['title']}] ({voice_name}) -> {out_path}")
                continue

            print(f"Generating TTS ({voice_name}) for [{ch['title']}] -> {out_path}...")
            tts = edge_tts.Communicate(ch['script'], voice_name, rate="+0%")
            await tts.save(out_path)
            print(f"Generated {out_path} ({os.path.getsize(out_path)} bytes)")

if __name__ == '__main__':
    asyncio.run(generate())
    print("All female & male tour chapters audio generated successfully!")
