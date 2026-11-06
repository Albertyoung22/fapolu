import asyncio
import os
import json
import edge_tts

VOICE = "zh-TW-HsiaoChenNeural" # Taiwan female professional neural voice
# Alternative: "zh-TW-YunJheNeural" (Taiwan male neural voice)

async def generate():
    with open('data/fapolu_complete_data.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    os.makedirs('static/audio', exist_ok=True)
    
    for ch in data['tour_chapters']:
        out_path = ch['audio_file'].lstrip('/')
        print(f"Generating TTS for [{ch['title']}] -> {out_path}...")
        tts = edge_tts.Communicate(ch['script'], VOICE, rate="+0%")
        await tts.save(out_path)
        print(f"Generated {out_path} ({os.path.getsize(out_path)} bytes)")

if __name__ == '__main__':
    asyncio.run(generate())
    print("All tour chapters audio generated successfully!")

