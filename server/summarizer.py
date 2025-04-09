from fastapi import APIRouter, UploadFile, File, Form
import fitz  # PyMuPDF
import docx
import google.generativeai as genai
import os
from dotenv import load_dotenv

router = APIRouter()

# Load environment variables
load_dotenv()

# Load Gemini key
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY").strip('"')
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel("gemini-1.5-pro-latest")

def extract_text_from_pdf(file):
    doc = fitz.open(stream=file.file.read(), filetype="pdf")
    return "\n".join(page.get_text() for page in doc)

def extract_text_from_docx(file):
    doc = docx.Document(file.file)
    return "\n".join([p.text for p in doc.paragraphs])

@router.post("/summarize")
async def summarize_text(file: UploadFile = File(None), text: str = Form(None)):
    if not file and not text:
        return {"error": "Please provide a file or text input"}

    content = ""
    if file:
        if file.filename.endswith(".pdf"):
            content = extract_text_from_pdf(file)
        elif file.filename.endswith(".docx"):
            content = extract_text_from_docx(file)
        else:
            return {"error": "Unsupported file type"}
    else:
        content = text

    prompt = f"Summarize the following text:\n\n{content}"
    response = model.generate_content(prompt)
    return {"summary": response.text}
