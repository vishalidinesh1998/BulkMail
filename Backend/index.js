const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");

const app = express();

//CORS setup
app.use(cors({
  origin: "https://bulkmail-g9hr.onrender.com", // replace with your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
}));

app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb+srv://vishali:123@cluster0.jvcy0yc.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log("MongoDB Connection Failed:", error));

// Mongoose Model for credentials
const credentialSchema = new mongoose.Schema({
  user: String,
  pass: String
});
const Credential = mongoose.model("Credential", credentialSchema, "bulkmail");

//Email Sending Endpoint
app.post("/sendmail", async (req, res) => {
  const { msg, emaillist } = req.body;

  if (!msg || !emaillist || !Array.isArray(emaillist) || emaillist.length === 0) {
    return res.status(400).send({ error: "Message or email list missing or invalid." });
  }

  try {
    const credentials = await Credential.find();

    if (!credentials.length) {
      console.error("No credentials found in database.");
      return res.status(500).send({ error: "No email credentials found." });
    }

    const { user, pass } = credentials[0];

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user,
        pass, // Must be Gmail App Password if 2FA is on
      },
    });

    for (let i = 0; i < emaillist.length; i++) {
      await transporter.sendMail({
        from: user,
        to: emaillist[i],
        subject: "Mail from BulkMailer",
        text: msg,
      });
      console.log(`Email sent to: ${emaillist[i]}`);
    }

    return res.send(true);
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).send({ error: "Email sending failed." });
  }
});

//Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
