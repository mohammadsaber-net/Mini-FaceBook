# Mini Facebook – Backend API

This project is the backend API for a social media platform similar to Facebook.
It handles authentication, users, Stories, posts, image uploads, background jobs, and email notifications.

---

## 🚀 Features
- REST API built with **Express**
- Authentication using **Clerk**
- MongoDB database with **Mongoose**
- Image upload and storage using **ImageKit**
- Background jobs & event handling with **Inngest**
- Email notifications using **Nodemailer**
- File uploads with **Multer**
- Secure environment configuration with **dotenv**

---

## 🛠 Tech Stack
- **Node.js**
- **Express**
- **MongoDB & Mongoose**
- **Clerk Authentication**
- **ImageKit**
- **Inngest**
- **Nodemailer**

---

## 📦 Installation

Navigate to the backend folder:

```bash
cd back-end
npm install
Run the development server:

bash
npm run dev
The server will run on the specified PORT.

🔑 Environment Variables
Create a .env file and add:

env
INNGEST_EVENT_KEY=
INNGEST_SIGNING_KEY=

PORT=
MONGOOSE=

CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
IMAGEKIT_URL_ENDPOINT=

SENDER_EMAIL=
STMP_USER=
STMP_PASS=
📌 Notes
This backend is designed to support a real-time social media platform.

Handles media uploads, background tasks, and authentication.

Can be connected to any frontend client.

👨‍💻 Author
Mohammad Saber
