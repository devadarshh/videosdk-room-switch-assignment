Perfect 👍 — here’s your **complete single-file `README.md`** ready to **copy and paste directly into GitHub**.

---

````markdown
# 🎥 VideoSDK Room Switch Demo (React)

This project demonstrates how to **seamlessly switch a participant from one VideoSDK room to another** without requiring a page reload or full reconnection.  
It also showcases **Media Relay**, a feature that relays media streams (audio/video) between rooms to maintain real-time continuity.

---

## 🚀 Objective

Implement functionality to seamlessly switch a participant from one VideoSDK room (Room A) to another (Room B) while maintaining audio/video continuity as much as possible.  
Additionally, explore and demonstrate the **Media Relay** feature for switching rooms efficiently.

---

## 🧠 Features

- Join a VideoSDK meeting (**Room A**)
- Seamlessly switch to another meeting (**Room B**)
- Demonstrate **Media Relay** (relay audio/video stream between rooms)
- Simple, minimal React UI with clear buttons:
  - **Join Room A**
  - **Switch to Room B**
  - **Start Media Relay**

---

## 🛠️ Tech Stack

- **React.js**
- **VideoSDK React SDK (`@videosdk.live/react-sdk`)**
- **Vanilla CSS**
- **JavaScript (ES6)**

---

## 🧩 Project Setup Steps

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/<your-username>/videosdk-room-switch-demo.git
cd videosdk-room-switch-demo
```
````

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Set Up Environment Variables

Create a `.env` file in the project root and add your VideoSDK credentials:

```bash
REACT_APP_VIDEOSDK_TOKEN=<your_auth_token>
```

You can generate a temporary token from the [VideoSDK Dashboard](https://app.videosdk.live/dashboard).

### 4️⃣ Start the Development Server

```bash
npm start
```

Your app will be live at:

```
http://localhost:3000
```

---

## 🧭 Implementation Overview

### 🔹 Normal Room Switching

Room switching is achieved using VideoSDK’s `switchTo()` method.

**Process:**

1. User joins **Room A** using `createMeeting()` and `join()`.
2. On clicking **Switch Room**, `switchTo(newMeetingId)` is called.
3. The SDK internally handles disconnection from Room A and reconnection to Room B — maintaining participant state.
4. The participant is now seamlessly moved to **Room B**.

**Example:**

```js
await meeting.switchTo({
  meetingId: targetMeetingId,
  authToken: authToken,
});
```

---

### 🔹 Media Relay Switching

Media Relay allows relaying media streams between rooms without the participant having to leave the first room manually.

**Process:**

1. Media relay is started using the `startMediaRelay()` method.
2. It relays the participant’s audio and video from **Room A → Room B**.
3. This approach is ideal for **multi-room broadcasts** or **transition phases**.

**Example:**

```js
await meeting.startMediaRelay({
  targetRoomId: targetMeetingId,
});
```

---

## 🎬 Demo Scenarios

1. **Normal Room Switching**

   - Join Room A → Switch to Room B using `switchTo()`.

2. **Media Relay**

   - Join Room A → Start Media Relay → Observe audio/video streamed in Room B.

---

## ⚙️ UI Structure

| Button                | Function                                             |
| --------------------- | ---------------------------------------------------- |
| **Join Room A**       | Joins the first VideoSDK room.                       |
| **Switch to Room B**  | Calls `switchTo()` to change room without reloading. |
| **Start Media Relay** | Starts relaying participant media to another room.   |

---

## 📊 Limitations & Challenges

| Type                    | Description                                                                          |
| ----------------------- | ------------------------------------------------------------------------------------ |
| 🔸 Audio/Video Sync     | Minimal delay (~1–2 seconds) may occur during switch.                                |
| 🔸 SDK Event Handling   | Must rebind `onParticipantJoined` and `onParticipantLeft` after switching.           |
| 🔸 Media Relay          | One-way only — relay sends media but doesn’t automatically join target room.         |
| 🔸 Browser Restrictions | Some browsers require fresh permission prompts for webcam/mic after context changes. |

---

## 📘 Differences: Normal Switch vs Media Relay

| Aspect   | Normal Switch (`switchTo`)       | Media Relay (`startMediaRelay`)    |
| -------- | -------------------------------- | ---------------------------------- |
| Purpose  | Move participant to another room | Stream audio/video to another room |
| Control  | Participant fully joins Room B   | Participant stays in Room A        |
| Latency  | Very low                         | Slightly higher (due to relay)     |
| Use Case | Room migration                   | Broadcast or linked sessions       |

---
