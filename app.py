from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import joblib
import numpy as np
from hf_client import get_ai_response 
from logger import setup_logger
import os
from dotenv import load_dotenv
load_dotenv()
print("HF KEY:", os.getenv("HF_API_KEY"))

app = Flask(__name__)
CORS(app)
logger = setup_logger()

# Load Model (Ensure 6 features match: Sleep, Steps, Mood, Activity, Screen, Meal)
try:
    model = joblib.load('xgb_healthcoach_model.pkl')
    logger.info("Model loaded successfully.")
except Exception as e:
    logger.error(f"Model error: {e}")

@app.route('/')
def index(): return render_template('index.html')

@app.route('/dashboard')
def dashboard(): return render_template('dashboard.html')

@app.route('/predictions')
def predictions(): return render_template('predictions.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        features = np.array([[
            float(data['sleep']), float(data['steps']), float(data['mood']), 
            float(data['activity']), float(data['screen']), float(data['meal'])
        ]])
        prediction = model.predict(features)[0]
        stress_map = {0: "Low", 1: "Stable", 2: "High"}
        return jsonify({"stress": stress_map.get(int(prediction), "Stable")})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/chat', methods=['POST'])
def chat():
    try:
        user_msg = request.json.get("message")
        stress = request.json.get("stress", "Stable")

        # 🎯 Smart prefix based on stress
        if stress == "High":
            prefix = "User is highly stressed. Give calm, short and helpful advice. "
        elif stress == "Low":
            prefix = "User is relaxed. Talk friendly and positive. "
        else:
            prefix = "User is normal. Give balanced advice. "

        final_prompt = prefix + user_msg

        ai_reply = get_ai_response(final_prompt)

        return jsonify({"reply": ai_reply})

    except Exception as e:
        print("CHAT ERROR:", e)
        return jsonify({"reply": "AI error"})

if __name__ == '__main__':
    app.run(debug=True, use_reloader=False)