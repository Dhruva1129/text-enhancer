import os
import google.generativeai as genai
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from deep_translator import GoogleTranslator
from gtts import gTTS
from dotenv import load_dotenv

# Import image enhancement router
from image_enha import router as image_enhancer_router

# Load environment variables from .env
load_dotenv()

# Get API keys from .env
OCR_SPACE_API_KEY = os.getenv("OCR_SPACE_API_KEY")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# Validate API keys
if not OCR_SPACE_API_KEY:
    raise ValueError("❌ Missing OCR_SPACE_API_KEY! Set it in your .env file.")
if not GOOGLE_API_KEY:
    raise ValueError("❌ Missing GOOGLE_API_KEY! Set it in your .env file.")

# Configure Google Gemini AI
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel("gemini-1.5-pro-latest")

# Initialize FastAPI
app = FastAPI()

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://text-enhancer-pi.vercel.app/"],  # Update if different frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include image enhancement router
app.include_router(image_enhancer_router, prefix="/image")

# Define request models
class TextEnhancementRequest(BaseModel):
    text: str
    tone: str

class TranslationRequest(BaseModel):
    text: str
    language: str

class TextToSpeechRequest(BaseModel):
    text: str
    language: str


@app.post("/enhance")
async def enhance_text(request: TextEnhancementRequest):
    """
    Enhances the given text while preserving grammar and tone.
    """
    try:
        if not request.text.strip():
            raise HTTPException(status_code=400, detail="Text input cannot be empty.")

        prompt = (
            f"Enhance this text in a '{request.tone}' tone while keeping it grammatically correct and easy to understand: '{request.text}'"
        )
        response = model.generate_content(prompt)

        if not hasattr(response, "text") or not response.text.strip():
            raise HTTPException(status_code=500, detail="Failed to generate enhanced text.")

        return {"enhanced_text": response.text.strip()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/translate")
async def translate_text(request: TranslationRequest):
    """
    Translates text into the requested language using Google Translate.
    """
    try:
        translated = GoogleTranslator(source="auto", target=request.language).translate(request.text)
        return {"translated_text": translated}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Translation error: {str(e)}")


@app.post("/speak")
async def text_to_speech(request: TextToSpeechRequest):
    """
    Converts text to speech using Google Text-to-Speech (gTTS).
    """
    try:
        tts = gTTS(text=request.text, lang=request.language)
        file_path = "speech.mp3"
        tts.save(file_path)
        return FileResponse(file_path, media_type="audio/mpeg", filename="speech.mp3")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/")
def home():
    return {
        "message": "AI Text Enhancer API is running!",
        "ocr_api_status": "✅ Loaded" if OCR_SPACE_API_KEY else "❌ Not Set",
        "google_api_status": "✅ Loaded" if GOOGLE_API_KEY else "❌ Not Set",
    }



# import google.generativeai as genai
# from fastapi import FastAPI, HTTPException, Form
# from pydantic import BaseModel
# import os
# from fastapi.middleware.cors import CORSMiddleware
# from googletrans import Translator
# from gtts import gTTS
# from fastapi.responses import FileResponse
# from fastapi import UploadFile, File

# from deep_translator import GoogleTranslator

# from image_enha import router as image_enhancer_router


# # import os
# # os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "google-vision-key.json"


# # import requests
# # from fastapi import UploadFile, File

# # from fastapi import FastAPI, UploadFile, File, HTTPException
# # import requests
# # from typing import Optional


# from dotenv import load_dotenv

# # Load environment variables
# load_dotenv()

# # router = APIRouter()

# # API Keys
# OCR_SPACE_API_KEY = os.getenv("OCR_SPACE_API_KEY", "your_ocr_space_api_key")  # Set this in .env
# GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "your_google_api_key")  # Set this in .env

# # Configure Gemini AI
# genai.configure(api_key=GOOGLE_API_KEY)
# model = GenerativeModel("gemini-1.5-pro-latest")


# # Load API key from environment variable
# GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# # Raise an error if API key is missing
# if not GOOGLE_API_KEY:
#     raise ValueError("Missing Google API Key! Set GOOGLE_API_KEY as an environment variable.")

# # Configure the Gemini AI model
# # genai.configure(api_key=GOOGLE_API_KEY)

# # GOOGLE_API_KEY="AIzaSyALZKlYvpfm9tCzpcvOf11pLhW6kpPc1wY"

# # Configure Google Gemini API Key
# # genai.configure(api_key="AIzaSyALZKlYvpfm9tCzpcvOf11pLhW6kpPc1wY")
# # model = genai.GenerativeModel("gemini-1.5-pro-latest")


# # Initialize FastAPI
# app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:3000"],  # React frontend
#     # allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# app.include_router(image_enhancer_router, prefix="/image")

# # Define request models
# class TextEnhancementRequest(BaseModel):
#     text: str
#     tone: str

# class TranslationRequest(BaseModel):
#     text: str
#     language: str

# class TextToSpeechRequest(BaseModel):
#     text: str
#     language: str

# translator = Translator()

# @app.post("/enhance")
# async def enhance_text(request: TextEnhancementRequest):
#     try:
#         if not request.text.strip():
#             raise HTTPException(status_code=400, detail="Text input cannot be empty.")

#         prompt = f"Enhance this text in a single line without using complex words in a '{request.tone}' tone while fixing grammar in a simple understandable language: '{request.text}'"
#         response = model.generate_content(prompt)

#         if not hasattr(response, "text") or not response.text.strip():
#             raise HTTPException(status_code=500, detail="Failed to generate enhanced text.")

#         return {"enhanced_text": response.text.strip()}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


# # @app.post("/enhance")
# # async def enhance_text(request: TextEnhancementRequest):
# #     try:
# #         prompt = f"Enhance this text in a single line without using complex words in a '{request.tone}' tone while fixing grammar in a simple understandable language : '{request.text}'"
# #         response = model.generate_content(prompt)
# #         return {"enhanced_text": response.text}
# #     except Exception as e:
# #         raise HTTPException(status_code=500, detail=str(e))



# @app.post("/translate")
# async def translate_text(request: TranslationRequest):
#     try:
#         translated = GoogleTranslator(source="auto", target=request.language).translate(request.text)
#         return {"translated_text": translated}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Translation error: {str(e)}")

# # @app.post("/translate")
# # async def translate_text(request: TranslationRequest):
# #     try:
# #         translated = translator.translate(request.text, dest=request.language)
# #         return {"translated_text": translated.text}
# #     except Exception as e:
# #         raise HTTPException(status_code=500, detail=str(e))

# @app.post("/speak")
# async def text_to_speech(request: TextToSpeechRequest):
#     try:
#         tts = gTTS(text=request.text, lang=request.language)
#         file_path = "speech.mp3"
#         tts.save(file_path)
#         return FileResponse(file_path, media_type="audio/mpeg", filename="speech.mp3")
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
    
# OCR_API_KEY = "K82850298288957"  # You can register for a free key at https://ocr.space/OCRAPI

# @app.post("/image-to-enhanced-text")
# async def image_to_enhanced_text(
#     file: UploadFile = File(...),
#     tone: str = Form("neutral")  # Receive tone from frontend
# ):
#     try:
#         image_bytes = await file.read()
        
#         # OCR API request
#         response = requests.post(
#             "https://api.ocr.space/parse/image",
#             files={"filename": image_bytes},
#             data={"apikey": OCR_API_KEY, "language": "eng"},
#         )
#         result = response.json()
        
#         if "ParsedResults" not in result or not result["ParsedResults"]:
#             raise HTTPException(status_code=400, detail="No text found in image.")
        
#         extracted_text = result["ParsedResults"][0]["ParsedText"]

#         # Prompt for Gemini with selected tone
#         prompt = (
#             f"Enhance the following text by improving grammar and clarity in a {tone} tone with some symbols, while strictly preserving its structure, formatting, line breaks, indentation, bullet points, and paragraph spacing—without altering layout or readability."
#             f"Extracted Text:{extracted_text}"
#         )
        
#         gemini_response = model.generate_content(prompt)

#         return {
#             "enhanced_text": gemini_response.text,
#             "raw_text": extracted_text
#         }
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


# import uuid

# @app.post("/speak")
# async def text_to_speech(request: TextToSpeechRequest):
#     try:
#         filename = f"speech_{uuid.uuid4().hex}.mp3"
#         tts = gTTS(text=request.text, lang=request.language)
#         tts.save(filename)

#         response = FileResponse(filename, media_type="audio/mpeg", filename="speech.mp3")

#         # Delete the file after sending response
#         @response.call_on_close
#         def cleanup():
#             os.remove(filename)

#         return response
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


# print(f"Google API Key Loaded: {GOOGLE_API_KEY[:5]}******")



# import google.generativeai as genai
# from fastapi import FastAPI, HTTPException
# from pydantic import BaseModel
# from fastapi.middleware.cors import CORSMiddleware
# from googletrans import Translator
# # from googletrans import Translator

# import os

# # Securely Load API Key
# # API_KEY = os.getenv("AIzaSyALZKlYvpfm9tCzpcvOf11pLhW6kpPc1wY")
# # if not API_KEY:
# #     raise ValueError("🚨 Missing or incorrect Google API key!")

# # API_KEY = os.getenv("GOOGLE_API_KEY")

# # if not API_KEY:
# #     raise ValueError("🚨 Missing or incorrect Google API key! Set GOOGLE_API_KEY in your environment variables.")

# genai.configure(api_key="AIzaSyALZKlYvpfm9tCzpcvOf11pLhW6kpPc1wY")
# model = genai.GenerativeModel("gemini-pro")

# # genai.configure(api_key=API_KEY)
# # model = genai.GenerativeModel("gemini-pro")

# # Initialize FastAPI
# app = FastAPI()

# # CORS Setup
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:3001"],  # Adjust if frontend runs on a different URL
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Translator Instance
# translator = Translator()

# # Supported Tones
# SUPPORTED_TONES = [
#     "formal", "casual", "poetic", "sarcastic", "professional", "motivational"
# ]

# # Supported Languages
# SUPPORTED_LANGUAGES = {
#     "en": "English",
#     "hi": "Hindi",
#     "te": "Telugu",
#     "ta": "Tamil",
#     "kn": "Kannada",
#     "bn": "Bengali",
#     "mr": "Marathi",
#     "gu": "Gujarati",
#     "ml": "Malayalam",
#     "pa": "Punjabi",
# }

# # Request Model
# class TextEnhancementRequest(BaseModel):
#     text: str
#     tone: str
#     target_language: str = "en"  # Default to English

# @app.post("/enhance")
# async def enhance_text(request: TextEnhancementRequest):
#     try:
#         # Validate Tone
#         if request.tone not in SUPPORTED_TONES:
#             raise HTTPException(status_code=400, detail="Invalid tone selected")

#         # Validate Language
#         if request.target_language not in SUPPORTED_LANGUAGES:
#             raise HTTPException(status_code=400, detail="Invalid language selected")

#         # Generate Enhanced Text
#         prompt = f"Improve this text in a single line '{request.text}' in a {request.tone} tone while fixing grammar and making it more clear."
#         response = model.generate_content(prompt)
#         enhanced_text = response.text.strip()

#         # Translate if Necessary
#         translated_text = enhanced_text
#         if request.target_language != "en":
#             translated_text = translator.translate(enhanced_text, dest=request.target_language).text

#         return {
#             "enhanced_text": enhanced_text,
#             "translated_text": translated_text,
#             "language": SUPPORTED_LANGUAGES[request.target_language],
#         }

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))





# # import google.generativeai as genai
# # from fastapi import FastAPI, HTTPException
# # from pydantic import BaseModel
# # import os
# # from fastapi.middleware.cors import CORSMiddleware


# # # import os
# # # import google.generativeai as genai

# # # Set API Key
# # # API_KEY = os.getenv("GOOGLE_API_KEY", "AIzaSyALZKlYvpfm9tCzpcvOf11pLhW6kpPc1wY")
# # # if API_KEY == "AIzaSyALZKlYvpfm9tCzpcvOf11pLhW6kpPc1wY":
# # #     raise ValueError("🚨 Missing or incorrect Google API key!")

# # # genai.configure(api_key=API_KEY)
# # # model = genai.GenerativeModel("gemini-pro")

# # genai.configure(api_key="AIzaSyALZKlYvpfm9tCzpcvOf11pLhW6kpPc1wY")

# # model = genai.GenerativeModel("gemini-pro")

# # # Set API Key
# # # os.environ["GOOGLE_API_KEY"] = "yAIzaSyCEHerWnJk_HT1xRkZZ07oIuqTW6IDxl5Y"

# # # Initialize Gemini model
# # # genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
# # # model = genai.GenerativeModel("gemini-pro")

# # app = FastAPI()

# # app.add_middleware(
# #     CORSMiddleware,
# #     allow_origins=["http://localhost:3000"],  # React frontend
# #     allow_credentials=True,
# #     allow_methods=["*"],
# #     allow_headers=["*"],
# # )

# # class TextEnhancementRequest(BaseModel):
# #     text: str
# #     tone: str

# # @app.post("/enhance")
# # async def enhance_text(request: TextEnhancementRequest):
# #     try:
# #         prompt = f"Enhance this text in simple understandable language: '{request.text}' in a '{request.tone}' tone in a sentance while fixing grammar."
# #         response = model.generate_content(prompt)
# #         return {"enhanced_text": response.text}
# #     except Exception as e: 
# #         raise HTTPException(status_code=500, detail=str(e))
