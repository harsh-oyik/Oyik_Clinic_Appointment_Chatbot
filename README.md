# Oyik Clinic • Heritage Care & Appointment Chatbot (React Frontend)

A single-page website built with **React** and **Vite** for **Oyik Clinic** (Heritage Care & Wellness), featuring the **Oyik Clinic Appointment Chatbot** integrated with **n8n**.

---

## 🌟 Key Features

1. **Heritage Care Single-Page Website**:
   - **Hero Section**: High-resolution photography of the luxury clinic sanctuary with live availability metrics.
   - **Chatbot Spotlight**: 1-click booking chips, feature breakdown, and direct chat launch.
   - **Clinical & Heritage Specialties**: Ayurvedic Integrative Medicine, Executive Cardiology, Dermatology & Aesthetics, Spine & Joint Rehabilitation.
   - **Specialist Faculty Roster**: Doctor profiles for Dr. Ananya Sharma, Dr. Julian Vance, and Dr. Sarah Jensen with studio photography and instant "Book via Bot" actions.
   - **3-Step Appointment Workflow Guide**: Visual walk-through of the booking process.
   - **Patient Reviews & Testimonials**: Real feedback with verified badges.
   - **Header & Footer**: Clinic hours, location, emergency disclaimer, and n8n webhook status toggle.

2. **Oyik Clinic Appointment Chatbot Widget**:
   - Floating circular launcher button at the bottom-right with avatar, live pulsing indicator, and greeting tooltip.
   - Expandable, minimizable, and responsive chat drawer with Web Audio synthetic sound chimes.
   - **Interactive Appointment Booking Flow**:
     - Specialist Doctor Selection with photos and next available slots.
     - Date Selection (Today, Tomorrow, Weekend Clinic).
     - Time Slot Selector (09:30 AM, 11:15 AM, 02:30 PM, 04:15 PM, 05:45 PM).
     - Patient Intake Form (Full Name & WhatsApp/Phone).
     - **Verified Appointment Pass**: Generates booking reference (`#OYIK-XXXX`), downloadable appointment slip (`.txt`), and 1-click **Add to Google Calendar** button.

3. **n8n Chatbot Integration**:
   - Built-in **n8n Webhook Configuration Modal** to paste and test your n8n Webhook URL.
   - **Live Webhook Mode**: Forwards user messages directly to your n8n AI workflow endpoint via POST requests.
   - **Built-in Demo Simulation Mode**: Allows immediate testing of the complete clinic appointment flow even before hooking up n8n.
   - Automatic session persistence in `localStorage`.

---

## 🔌 Connecting Your n8n Workflow

### 1. In n8n
- In your n8n workflow, use a **Webhook** node or **Chat Trigger** node with `POST` method.
- Copy your **Production URL** or **Test URL** (e.g., `https://your-n8n.app.n8n.cloud/webhook/oyik-chat`).

### 2. Payload Sent from this React Frontend
When a message is sent in the chatbot, this frontend sends a POST request with the following JSON:

```json
{
  "chatInput": "I want to schedule an appointment with Dr. Ananya Sharma",
  "sessionId": "oyik_session_1729081234",
  "action": "sendMessage",
  "metadata": {
    "source": "oyik_clinic_react_frontend",
    "timestamp": "2026-10-16T14:30:00.000Z"
  }
}
```

### 3. Expected Response from n8n
Your n8n workflow can return either:
- Standard AI Chat response: `{"output": "Your response message"}`
- Or: `{"text": "Your response message"}` or `{"message": "Your response message"}`
- Or plain text string.

### 4. CORS Setting Tip
If your n8n instance is hosted on another domain or cloud, ensure CORS allows requests from your frontend origin (or set `Access-Control-Allow-Origin: *` on the Webhook Respond node).

---

## 🚀 Running the Project

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev
```

The application is served at `http://localhost:5173/`.

To build the production bundle:
```bash
npm run build
```
