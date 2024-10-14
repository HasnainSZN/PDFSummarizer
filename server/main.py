from fastapi import FastAPI, File, UploadFile
import PyPDF2
import os
from groq import Groq

# Set your Groq API key
GROQ_API_KEY = "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"  # Replace with your actual API key
os.environ["GROQ_API_KEY"] = GROQ_API_KEY

# Initialize Groq client
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

app = FastAPI()

# Function to extract text from PDF
def extract_text_from_pdf(pdf_file):
    reader = PyPDF2.PdfReader(pdf_file)
    text = ""
    for page_num in range(len(reader.pages)):
        page = reader.pages[page_num]
        text += page.extract_text() or ''  # Handle None text
    return text

# API route to summarize PDF using Groq
@app.post("/summarize")
async def summarize_pdf(file: UploadFile = File(...)):
    try:
        # Extract text from the uploaded PDF
        pdf_text = extract_text_from_pdf(file.file)

        # Create a system prompt for the Groq API
        system_prompt = {
            "role": "system",
            "content": "You are a Summarizer. You generate summaries that capture the essence of the text and complete understanding of it."
        }

        # Initialize chat history
        chat_history = [system_prompt]

        # Append the user input (PDF text) to the chat history
        chat_history.append({"role": "user", "content": pdf_text})

        # Generate a response using Groq's chat completion model (LLaMA 3.1-70B)
        response = client.chat.completions.create(
            model="llama-3.1-70b-versatile",
            messages=chat_history,
            max_tokens=1000,
            temperature=1.2
        )

        # Extract the assistant's response
        assistant_response = response.choices[0].message.content

        # Return the summary in the response
        return {"summary": assistant_response}

    except Exception as e:
        return {"error": str(e)}
