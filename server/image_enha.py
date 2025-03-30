import os
import requests
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
import google.generativeai as genai
from google.generativeai import GenerativeModel
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

router = APIRouter()

# API Keys
OCR_SPACE_API_KEY = os.getenv("OCR_SPACE_API_KEY")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# Configure Gemini AI
genai.configure(api_key=GOOGLE_API_KEY)
model = GenerativeModel("gemini-1.5-pro-latest")

@router.post("/image-to-enhanced-text/")
async def image_to_enhanced_text(
    file: UploadFile = File(...),
    tone: str = Form("formal")  # Default tone if not provided
):
    try:
        print(f"✅ File received: {file.filename}")
        print(f"🎨 Tone selected: {tone}")
        image_bytes = await file.read()

        # OCR.Space text extraction
        response = requests.post(
            "https://api.ocr.space/parse/image",
            files={"file": (file.filename, image_bytes, file.content_type)},
            data={
                "apikey": OCR_SPACE_API_KEY,
                "language": "eng",
                "isOverlayRequired": False,
            },
        )

        result = response.json()
        
        if result.get("IsErroredOnProcessing"):
            error_msg = result.get("ErrorMessage", ["OCR failed"])[0]
            raise HTTPException(status_code=400, detail=f"OCR.Space Error: {error_msg}")

        extracted_text = result["ParsedResults"][0]["ParsedText"]
        print("📝 Extracted Text:", extracted_text)

        # Gemini AI Enhancement
        prompt = (
            f"Enhance the following text by improving grammar and clarity in a {tone} tone with some symbols, while strictly preserving its structure, formatting, line breaks, indentation, bullet points, and paragraph spacing—without altering layout or readability. "
            f"Extracted Text:\n{extracted_text}"
        )

        gemini_response = model.generate_content(prompt)
        enhanced_text = gemini_response.text.strip()
        print("✨ Enhanced Text:", enhanced_text)

        return {
            "enhanced_text": enhanced_text,
            "raw_text": extracted_text
        }

    except Exception as e:
        print("❌ Server Error:", str(e))
        raise HTTPException(status_code=500, detail=str(e))
