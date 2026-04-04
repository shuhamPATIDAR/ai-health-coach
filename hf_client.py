import os
import requests

# 🔐 Get API key securely
API_KEY = os.getenv("HF_API_KEY")

if not API_KEY:
    raise ValueError("OPENROUTER_API_KEY not set in environment variables")

def get_ai_response(prompt):
    try:
        url = "https://openrouter.ai/api/v1/chat/completions"

        headers = {
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": "openai/gpt-3.5-turbo",
            "messages": [
                {"role": "system", "content": "You are a helpful health assistant."},
                {"role": "user", "content": prompt}
            ]
        }

        # ⏱️ Add timeout
        response = requests.post(url, headers=headers, json=payload, timeout=10)

        if response.status_code == 200:
            data = response.json()
            return data["choices"][0]["message"]["content"]

        elif response.status_code == 401:
            return "Invalid API key. Please check server configuration."

        elif response.status_code == 429:
            return "API rate limit exceeded. Try again later."

        else:
            return "AI service temporarily unavailable."

    except requests.exceptions.Timeout:
        return "AI request timed out. Please try again."

    except Exception:
        return "Server error while processing AI request."
