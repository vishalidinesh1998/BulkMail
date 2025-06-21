📧 Bulk Mail Sender
A full-stack web application to send bulk emails using a custom message and email list uploaded via Excel sheet. Built using React (Vite), Node.js (Express), MongoDB Atlas, and Nodemailer.

🗂 Project Structure
bash
Copy
Edit
BulkMail/
├── frontend/        # React app (Vite)
│   └── ...
├── backend/         # Express API server
│   └── index.js
├── vercel.json      # Vercel configuration
├── README.md
🚀 Features
Upload .xlsx Excel files containing email addresses

Compose and send a custom message

Send emails in bulk via Gmail SMTP

Uses MongoDB to store credentials securely

🛠 Tech Stack
Layer	Technology
Frontend	React (Vite + Tailwind CSS)
Backend	Node.js + Express
Emailing	Nodemailer + Gmail App Password
Database	MongoDB Atlas
Hosting	Vercel (Fullstack App)

⚙️ Installation
1. Clone the Repository
bash
Copy
Edit
git clone https://github.com/your-username/BulkMail.git
cd BulkMail
2. Set up Frontend
bash
Copy
Edit
cd frontend
npm install
npm run dev    # for local development
3. Set up Backend
bash
Copy
Edit
cd ../backend
npm install
node index.js
✅ Make sure MongoDB Atlas is connected and .env variables are configured.

✉️ MongoDB Credential Document Format
In your MongoDB Atlas bulkmail collection, add a document like:

json
Copy
Edit
{
  "user": "your-email@gmail.com",
  "pass": "your-gmail-app-password"
}
🧪 Testing the Flow
Run backend and frontend

Visit the app

Enter your message

Upload an Excel file with email addresses (1 per row in column A)

Click Send

⚠️ Gmail App Password Setup
Enable 2-Step Verification on your Gmail

Go to App Passwords

Generate a password for "Mail"

Use that password in MongoDB credentials

🌐 Deployment (Vercel)
✅ Setup vercel.json
json
Copy
Edit
{
  "version": 2,
  "builds": [
    { "src": "backend/index.js", "use": "@vercel/node" },
    { "src": "frontend/package.json", "use": "@vercel/static-build" }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "backend/index.js" },
    { "src": "/(.*)", "dest": "frontend/dist/index.html" }
  ]
}
Push to GitHub

Connect your GitHub repo to Vercel

Done!



