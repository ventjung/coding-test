from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from google import genai
import uvicorn
import json

app = FastAPI()

# Cors settings
origins = [
    "http://localhost:3000"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load users
with open("dummyData.json", "r") as f:
    users = json.load(f)

@app.get("/api/data")
def get_data():
    """
    Returns list of users.
    """
    return users

@app.post("/api/ai")
async def ai_endpoint(request: Request):
    """
    Accepts a user question and returns a placeholder AI response.
    (Optionally integrate a real AI model or external service here.)
    """

    body = await request.json()
    user_question = body.get("question", "")
    
    if not user_question:
        raise  "No question provided."
    
    client = genai.Client(api_key="AIzaSyCI6QC_FgHRRlMV9zxRXnCy5Ecmpv1kaqI") # hardcoded for simplicity
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=user_question,
    )
    
    # Placeholder logic: echo the question or generate a simple response
    # Replace with real AI logic as desired (e.g., call to an LLM).
    return {"answer": f"{response.text}"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
