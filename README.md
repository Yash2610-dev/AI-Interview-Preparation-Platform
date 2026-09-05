# 🤖 AI Interview Preparation Platform

An AI-powered full-stack web application that helps users prepare for technical interviews by generating interview questions using AI.

## 📌 About the Project

AI Interview Preparation Platform is a full-stack MERN application designed to help users practice technical interview questions.
The application allows users to create an account, prepare for interviews, and generate interview questions using Gemini AI.

## 🚀 Features

- 🔐 User Authentication
- 👤 User Registration & Login
- 🤖 AI-generated Interview Questions
- 📝 Interview Preparation
- 💾 MongoDB Database Integration
- 🔗 REST API Integration
- 📱 Responsive User Interface
- 🎨 Modern UI using Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios
- React Router

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication

### AI
- Google Gemini AI

### Tools
- Git
- GitHub
- VS Code
- Postman

## 📂 Project Structure

```text
AI-Interview-Preparation-Platform/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── controller/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   └── package.json
│
├── .gitignore
└── README.md
```

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/AI-Interview-Preparation-Platform.git
cd AI-Interview-Preparation-Platform
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` folder:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_google_gemini_api_key
```

Run the backend server:
```bash
npm start
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create a `.env` file inside the `frontend/` folder:
```env
VITE_API_BASE_URL=http://localhost:5000
```

Run the frontend:
```bash
npm run dev
```

The app should now be running at `http://localhost:5173` (or your configured port).

## 📸 Screenshots

> Add screenshots of your app here to showcase the UI.

| Login Page | Dashboard | AI Question Generator |
|:---:|:---:|:---:|
| _screenshot_ | _screenshot_ | _screenshot_ |

## 🔮 Future Enhancements

- 🎥 Mock video interview simulation
- 📊 Performance analytics dashboard
- 🌐 Multi-language question support
- 🏆 Leaderboard & gamification

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📬 Contact

**Yash Agrahari**
- LinkedIn: [linkedin.com/in/yash-agrahari-7a03273b4](https://www.linkedin.com/in/yash-agrahari-7a03273b4)
- GitHub: [@Yash2610-dev](https://github.com/Yash2610-dev)

---
⭐ If you found this project helpful, consider giving it a star on GitHub!
