# DEADLOCK

**DEADLOCK** is a web application that demonstrates the implementation of the Banker's Algorithm for deadlock avoidance in operating systems.

## 🚀 Live Demo

🔗 **Frontend**: [DEADLOCK App](https://deadlock-mu.vercel.app/index.html)  

---

## 📌 Features
- Step-by-step execution of Banker's Algorithm
- Safe state detection with process execution order
- Handles deadlock detection and prevention
- Intuitive UI for entering allocation, maximum, and available resources

---

## 🛠️ Installation & Setup


```

### Run Locally
```sh
npm start
```

---

## ⚙️ Backend API

The backend API processes the Banker's Algorithm and determines whether a system is in a safe state

### 🖥️ Local Setup for Backend
```sh

cd BackendForDeadlock
npm install
node server.js
```

### 📌 API Endpoint
- **POST** `/api/bankers` → Accepts allocation, max, and available resources, returns safe sequence or deadlock detection.

Example Request:
```json
{
  "allocation": [[0, 1, 0], [2, 0, 0], [3, 0, 2]],
  "maxMatrix": [[7, 5, 3], [3, 2, 2], [9, 0, 2]],
  "available": [3, 3, 2],
  "processCount": 3,
  "resourceCount": 3
}
```

Example Response (Safe State):
```json
{
  "isSafe": true,
  "safeSequence": [1, 2, 0],
  "steps": ["Process P1 executed...", "Process P2 executed...", "Process P0 executed..."]
}
```

Example Response (Deadlock Detected):
```json
{
  "isSafe": false,
  "steps": ["No process can be executed. Deadlock detected!"]
}
```

---

## 📜 License
This project is open-source and available under the MIT License.

---

## ✨ Author
Developed by **Aaryan Sood** )

