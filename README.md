# AI-Powered Campus Services Chatbot

A full-stack campus chatbot for NIST University services, built with React, Tailwind CSS, Express, and the Gemini API using Google AI Studio API keys.

## Project Structure

```text
.
|-- backend/            # Express API
|-- frontend/           # React + Tailwind UI
|-- constants (1).js    # Provided SYSTEM_PROMPT chatbot brain
|-- package.json        # Workspace scripts
`-- README.md
```

## Features

- Modern chat interface with user and assistant bubbles
- `POST /chat` backend API
- Gemini API integration with Google AI Studio API keys
- Uses the provided `SYSTEM_PROMPT` exactly as the chatbot brain
- Quick topic suggestions for admissions, fees, hostel, and placements
- Typing indicator
- Dark mode toggle
- Voice input with the Web Speech API where supported
- Local chat history persistence with `localStorage`
- Responsive mobile and desktop layout

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create the backend environment file:

```bash
cp backend/.env.example backend/.env
```

On Windows PowerShell:

```powershell
Copy-Item backend/.env.example backend/.env
```

3. Add your Google AI Studio API key in `backend/.env`.

Create a key from Google AI Studio: `https://aistudio.google.com/app/api-keys`

```env
GEMINI_API_KEY=your_google_ai_studio_api_key_here
GEMINI_MODEL=gemini-2.5-flash
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
```

4. Run the app:

```bash
npm run dev
```

Frontend: `http://localhost:5173`

Backend health check: `http://localhost:5000/health`

## API

### `POST /chat`

Request:

```json
{
  "message": "What is the B.Tech fee structure?"
}
```

Response:

```json
{
  "reply": "..."
}
```

## Notes

- The backend imports `SYSTEM_PROMPT` from `constants (1).js`.
- The API is stateless. Conversation history is stored only in the browser.
- If the answer is not covered by the prompt, the assistant should use the fallback defined in the prompt.
- Change `GEMINI_MODEL` in `backend/.env` if you want to use a different Gemini model.
