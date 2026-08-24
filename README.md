# 🧠 HealthCoach.AI — AI-Powered Health & Stress Coach

> **Predict your stress level. Understand your lifestyle. Get personalized AI-powered guidance.**

HealthCoach.AI is an **AI-powered health and mental wellness web application** that combines **Machine Learning and Generative AI** to help users understand how their daily lifestyle habits may relate to stress.

The application uses a trained **XGBoost classification model** to predict a user's stress level from health and lifestyle parameters and provides an integrated **AI chatbot** for personalized wellness guidance.

---

## 🚀 Key Features

### 📊 AI-Based Stress Prediction

Predict your current stress level using important lifestyle and wellness indicators:

* 😴 Sleep
* 🚶 Daily Steps
* 😊 Mood
* 🏃 Physical Activity
* 📱 Screen Time
* 🍽️ Meal Quality

The trained XGBoost model classifies the user's stress into:

* 🟢 **Low**
* 🔵 **Stable**
* 🔴 **High**

---

### 🤖 AI Health Coach

HealthCoach.AI includes an interactive AI chatbot that allows users to ask questions related to:

* Mental wellness
* Lifestyle improvement
* Sleep
* Stress management
* Healthy habits
* General wellness guidance

The chatbot communicates with the backend through a secure API rather than exposing the AI API key in the frontend.

---

### 🔐 User Authentication

The application provides user authentication using **Firebase Authentication**, including:

* User registration
* Email/password login
* Password reset
* Authentication-based dashboard access

---

### 📈 Health Dashboard

The dashboard provides users with a centralized interface for interacting with their health insights and accessing the application's core features.

---

### 📋 Prediction Interface

Users can enter their lifestyle information and receive an immediate stress prediction through the Flask prediction API.

The backend validates the required inputs before passing them to the trained machine learning model.

---

## 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │      User            │
                    │  Web Browser         │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Frontend           │
                    │ HTML + Tailwind CSS  │
                    │ JavaScript            │
                    └──────────┬───────────┘
                               │
                 ┌─────────────┴─────────────┐
                 │                           │
                 ▼                           ▼
        ┌─────────────────┐        ┌─────────────────┐
        │ Firebase Auth   │        │ Flask Backend   │
        │                 │        │                 │
        │ Login / Signup  │        │ REST APIs       │
        └─────────────────┘        └────────┬────────┘
                                            │
                           ┌────────────────┴──────────────┐
                           │                               │
                           ▼                               ▼
                  ┌─────────────────┐            ┌─────────────────┐
                  │ XGBoost Model   │            │ AI Health Coach │
                  │                 │            │                 │
                  │ Stress          │            │ AI Responses    │
                  │ Classification  │            │                 │
                  └─────────────────┘            └─────────────────┘
```

---

## 🧠 Machine Learning Pipeline

The stress prediction component follows a standard machine learning workflow:

```text
Lifestyle & Health Data
          │
          ▼
    Data Preparation
          │
          ▼
 Feature Selection
          │
          ▼
 Model Training
          │
          ▼
    XGBoost Classifier
          │
          ▼
    Model Evaluation
          │
          ▼
   Trained Model (.pkl)
          │
          ▼
 Flask Prediction API
          │
          ▼
    Stress Prediction
```

The trained model is stored as:

```text
xgb_healthcoach_model.pkl
```

and loaded by the Flask backend using `joblib`.

---

## 🛠️ Tech Stack

### Machine Learning

* Python
* XGBoost
* Scikit-learn
* NumPy
* Pandas
* Joblib

### Backend

* Flask
* Flask-CORS
* REST API
* Gunicorn

### AI

* Hugging Face API
* AI-powered conversational health assistance

### Frontend

* HTML5
* JavaScript
* Tailwind CSS
* Google Fonts

### Authentication

* Firebase Authentication

### Deployment

* Gunicorn
* Environment variables
* Production-ready Flask server configuration

---

## 📂 Project Structure

```text
ai-health-coach/
│
├── notebook/
│   └── ...                    # ML experimentation/training
│
├── static/
│   └── ...                    # CSS, JavaScript and static assets
│
├── templates/
│   ├── index.html             # Landing page & authentication
│   ├── dashboard.html         # User dashboard
│   └── predictions.html       # Stress prediction interface
│
├── app.py                     # Flask application & API routes
├── hf_client.py               # AI/Hugging Face API integration
├── logger.py                  # Application logging
│
├── xgb_healthcoach_model.pkl  # Trained XGBoost model
├── requirements.txt           # Python dependencies
├── .env                       # Environment variables
└── README.md
```

---

## 🔌 API Endpoints

### `GET /`

Returns the HealthCoach.AI landing page.

### `GET /dashboard`

Loads the health dashboard.

### `GET /predictions`

Loads the stress prediction interface.

### `POST /predict`

Predicts the user's stress level.

#### Request

```json
{
  "sleep": 7,
  "steps": 8000,
  "mood": 7,
  "activity": 6,
  "screen": 5,
  "meal": 8
}
```

#### Response

```json
{
  "stress": "Stable"
}
```

### `POST /chat`

Sends a user message to the AI health coach.

#### Request

```json
{
  "message": "How can I reduce my stress?"
}
```

#### Response

```json
{
  "reply": "..."
}
```

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/shuhamPATIDAR/ai-health-coach.git
cd ai-health-coach
```

### 2. Create a virtual environment

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

On macOS/Linux:

```bash
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

---

## 🔑 Environment Variables

Create a `.env` file in the project root:

```env
HF_API_KEY=your_huggingface_api_key
```

> **Important:** Never commit your real API keys or other secrets to GitHub.

---

## ▶️ Run Locally

Start the Flask application:

```bash
python app.py
```

The application will run locally at:

```text
http://localhost:10000
```

You can then open the application in your browser.

---

## 📦 Production Deployment

The application is configured to work with **Gunicorn** and supports the `PORT` environment variable, making it suitable for cloud deployment platforms.

Example:

```bash
gunicorn app:app
```

The Flask application binds to:

```text
0.0.0.0
```

and uses the platform-provided `PORT` when available.

---

## 🎯 Project Objective

The goal of HealthCoach.AI is to demonstrate how **Machine Learning, Generative AI, and web application development** can be combined to create a practical health and wellness application.

Instead of providing only a static prediction, the project combines:

```text
Machine Learning
       +
AI Conversation
       +
Lifestyle Analysis
       +
Web Application
       =
Personalized Health Coaching
```

---

## 📊 Machine Learning Model

The core prediction model is an **XGBoost classifier**.

### Input Features

| Feature  | Description             |
| -------- | ----------------------- |
| Sleep    | Daily sleep duration    |
| Steps    | Daily number of steps   |
| Mood     | User-reported mood      |
| Activity | Physical activity level |
| Screen   | Screen-time level       |
| Meal     | Meal/food quality       |

### Output

The model predicts one of three stress categories:

```text
0 → Low
1 → Stable
2 → High
```

The backend converts the numerical prediction into a human-readable stress category before returning it to the frontend.

---

## 🔒 Security Considerations

The project follows several basic security practices:

* API credentials are loaded through environment variables.
* AI requests are handled by the backend.
* Input fields are validated before prediction.
* API errors are handled by the Flask backend.
* Application logging is implemented for debugging and monitoring.

> **Note:** This project is intended for educational and demonstration purposes. It is **not a medical diagnostic system** and should not be used as a replacement for professional medical advice.

---

## 🔮 Future Improvements

Planned improvements could include:

* [ ] Personalized recommendation engine
* [ ] Historical stress tracking
* [ ] Advanced health analytics
* [ ] Improved model explainability using SHAP
* [ ] Model performance monitoring
* [ ] Automated model retraining
* [ ] More lifestyle and wellness features
* [ ] Mobile application
* [ ] Better authentication and authorization
* [ ] Database-backed user health history
* [ ] CI/CD pipeline
* [ ] Comprehensive automated testing

---

## 🌟 Why This Project?

HealthCoach.AI demonstrates an end-to-end **AI/ML application development workflow**:

**Data → Machine Learning → Model Deployment → REST API → Frontend → AI Integration**

It brings together practical skills in:

* Machine Learning
* XGBoost
* Python
* Flask
* REST APIs
* Generative AI
* Firebase Authentication
* Frontend Development
* Model Deployment
* Environment & API Security

---

## 👨‍💻 Author

**Shubham Patidar**

M.Tech — AI/ML

GitHub: [@shuhamPATIDAR](https://github.com/shuhamPATIDAR)

---

## ⭐ Support

If you find this project useful or interesting, consider giving the repository a ⭐ on GitHub.

**Repository:** https://github.com/shuhamPATIDAR/ai-health-coach
