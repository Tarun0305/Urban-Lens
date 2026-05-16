import os
from fastapi import APIRouter, UploadFile, File, HTTPException
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@router.post("/transcribe")
async def transcribe_voice(audio: UploadFile = File(...)):
    # Save temp file
    temp_path = f"temp_{audio.filename}"
    with open(temp_path, "wb") as buffer:
        buffer.write(await audio.read())
    
    try:
        with open(temp_path, "rb") as audio_file:
            transcript = client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file,
                response_format="verbose_json"
            )
        
        os.remove(temp_path)
        return {
            "transcript": transcript.text,
            "detected_language": transcript.language
        }
    except Exception as e:
        if os.path.exists(temp_path): os.remove(temp_path)
        print(f"Whisper Error: {e}")
        return {
            "transcript": "Audio processing failed.",
            "detected_language": "en"
        }
