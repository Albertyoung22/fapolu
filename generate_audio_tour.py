import asyncio
import os
import json
import edge_tts

# Voice presets: (voice_id, rate, pitch, filename_suffix, add_zen_pauses)
VOICE_PRESETS = [
    # 莊嚴禪韻男聲：放慢語速、降低音調，呈現寺院法師開示般溫厚安定感
    ("zh-TW-YunJheNeural", "-18%", "-10Hz", "_male", True),
    # 慈悲溫婉女聲：柔和舒緩、靜心安定
    ("zh-TW-HsiaoChenNeural", "-15%", "-4Hz", "_zen_female", True),
    # 標準專業女聲：保留原速清晰商務播報
    ("zh-TW-HsiaoChenNeural", "+0%", "+0Hz", "", False),
]


def format_zen_script(script: str) -> str:
    """加入適度呼吸停頓，讓語氣更從容莊嚴"""
    text = script.replace("。", "。…… ").replace("；", "；… ")
    return text


async def generate():
    with open('data/fapolu_complete_data.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    os.makedirs('static/audio', exist_ok=True)

    for voice_name, rate, pitch, suffix, is_zen in VOICE_PRESETS:
        for ch in data['tour_chapters']:
            base_path = ch['audio_file'].lstrip('/')
            root, ext = os.path.splitext(base_path)
            out_path = f"{root}{suffix}{ext}" if suffix else base_path

            # Skip regenerating if file already exists
            if os.path.exists(out_path) and os.path.getsize(out_path) > 10000:
                print(f"Skipping existing [{ch['title']}] -> {out_path}")
                continue

            script_text = format_zen_script(ch['script']) if is_zen else ch['script']
            print(f"Generating [{ch['title']}] ({voice_name}, rate={rate}, pitch={pitch}) -> {out_path}...")
            tts = edge_tts.Communicate(script_text, voice_name, rate=rate, pitch=pitch)
            await tts.save(out_path)
            print(f"  -> Saved {out_path} ({os.path.getsize(out_path)} bytes)")


if __name__ == '__main__':
    asyncio.run(generate())
    print("All Zen & standard tour chapters generated successfully!")
