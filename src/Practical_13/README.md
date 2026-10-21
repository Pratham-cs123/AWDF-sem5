# Practical 13: AI API Integration into a Web Application

- **Course:** ITUE301 — Advanced Web Development Frameworks
- **CO / PO:** CO6 / PO3, PO5, PO12
- **Objective:** To integrate an external AI service (OpenAI / Gemini) into the existing application securely and understand responsible AI usage.

---

## 1. Architecture Flow Diagram

```
React Frontend
      │ 'Generate Description' Click
      ▼
Express Backend (/api/ai/generate-description)
      │ API Key stored server-side only in .env (NEVER exposed to frontend!)
      ▼
OpenAI API (gpt-4o-mini) OR Google Gemini API (gemini-1.5-flash)
      │
      ├───────────────────────────────┬───────────────────────────────┐
      │                                                               │
  [Success]                                                       [API Failure / Offline / No Key]
      │                                                               │
      ▼                                                               ▼
Return AI Completion to Client                                Catch Error ──► Graceful Degradation
Status 200 { fallback: false }                                Return Smart Heuristic Fallback
Editable suggestion in UI                                     Status 200 { fallback: true }
                                                              Core application NEVER crashes!
```

---

## 2. Key Questions & Viva Answers

### Q1: Why must the AI API key be called from the backend rather than directly from the React frontend?
- **Answer:**
  1. **Frontend Exposure:** Any code running in the browser is completely public. An API key stored in React code or environment variables prefixed with `VITE_` can be trivially extracted by opening browser DevTools Network tab or inspecting source maps.
  2. **Financial and Abuse Risk:** Stolen API keys lead to quota exhaustion, massive unauthorized billing charges, and account bans.
  3. **Backend as Secure Proxy:** The Express backend securely loads the secret from `.env` on the server and enforces rate limiting, authentication, and validation before proxying to the AI provider.

### Q2: What does 'graceful degradation' mean in this context, and why does it matter?
- **Answer:** Graceful degradation is an architectural resilience pattern where an application continues to operate with a reduced level of functionality when external dependencies fail, instead of crashing entirely. If OpenAI or Gemini experiences a 504 gateway timeout, rate limit (429), or network drop, the backend catches the error and returns a meaningful fallback suggestion. The user can still create and manage tasks normally.

### Q3: What are the privacy, governance, and ethical implications of sending task data to an external AI API?
- **Answer:**
  1. **Data Confidentiality & PII:** Personally Identifiable Information (passwords, medical records, financial tokens) should NEVER be sent to public third-party LLMs.
  2. **Model Training Opt-out:** Enterprise agreements must specify that prompt data will not be retained or used to retrain public models.
  3. **User Agency & Disclaimers:** AI suggestions must never be auto-committed silently; the UI must always display a disclaimer and require human review.

---

## 3. Running Practical 13

### Step 1: Install Dependencies
```bash
cd "src/Practical_13"
npm install
```

### Step 2: Configure Environment Variables (Optional)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Add your `OPENAI_API_KEY` or `GEMINI_API_KEY`. (If omitted, the server automatically runs in intelligent Graceful Degradation fallback mode).

### Step 3: Run the Server
```bash
npm start
# Server running at http://localhost:5005
```

### Step 4: Test with Postman / Thunder Client
1. Send `POST http://localhost:5005/api/ai/generate-description` with:
   ```json
   {
     "title": "Migrate database schema to MongoDB Atlas cluster"
   }
   ```
2. Inspect response: Contains AI-generated description, provider tag, and fallback status.
3. Test rate limiting: Send 2 requests within 3 seconds to verify HTTP 429 rate limit protection.
