from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import joblib
import numpy as np
from hf_client import get_ai_response 
from logger import setup_logger
import os

app = Flask(__name__)

# 🔐 Restrict CORS (replace with your domain later)
CORS(app, resources={r"/*": {"origins": "*"}})

logger = setup_logger()

# 🔐 Load API key securely
HF_API_KEY = os.environ.get("HF_API_KEY")

if not HF_API_KEY:
    raise ValueError("HF_API_KEY not set in environment variables")

# 🔐 Load Model
try:
    model = joblib.load('xgb_healthcoach_model.pkl')
    logger.info("Model loaded successfully.")
except Exception as e:
    logger.error(f"Model error: {e}")
    model = None

# -------------------------
# 🌐 Routes
# -------------------------
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

@app.route('/predictions')
def predictions():
    return render_template('predictions.html')

# -------------------------
# 🧠 Prediction API
# -------------------------
@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json

        # ✅ Input validation
        required_fields = ['sleep', 'steps', 'mood', 'activity', 'screen', 'meal']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing field: {field}"}), 400

        features = np.array([[ 
            float(data['sleep']), 
            float(data['steps']), 
            float(data['mood']), 
            float(data['activity']), 
            float(data['screen']), 
            float(data['meal'])
        ]])

        prediction = model.predict(features)[0]

        stress_map = {0: "Low", 1: "Stable", 2: "High"}

        return jsonify({
            "stress": stress_map.get(int(prediction), "Stable")
        })

    except Exception as e:
        logger.error(f"Prediction error: {e}")
        return jsonify({"error": "Prediction failed"}), 500

# -------------------------
# 🤖 AI Chat API (SECURE)
# -------------------------
@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.json

        user_msg = data.get("message")
        stress = data.get("stress", "Stable")

        if not user_msg:
            return jsonify({"error": "Message is required"}), 400

        # 🎯 Smart prefix
        if stress == "High":
            prefix = "User is highly stressed. Give calm, short and helpful advice. "
        elif stress == "Low":
            prefix = "User is relaxed. Talk friendly and positive. "
        else:
            prefix = "User is normal. Give balanced advice. "

        final_prompt = prefix + user_msg

        # 🔐 API call (key stays hidden in backend)
        ai_reply = get_ai_response(final_prompt)

        return jsonify({"reply": ai_reply})

    except Exception as e:
        logger.error(f"Chat error: {e}")
        return jsonify({"reply": "AI service unavailable"}), 500

# -------------------------
# 🚀 Run App
# -------------------------
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=10000)
