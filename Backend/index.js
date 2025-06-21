const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");

const app = express();
app.use(cors({
  origin: ["https://bulk-mail-ebon.vercel.app", "http://localhost:3000"]
}));
app.use(express.json());

mongoose.connect("mongodb+srv://vishali:123@cluster0.jvcy0yc.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("Connected to DB"))
  .catch(() => console.log("Failed connection DB"));

// Mongoose model
const credential = mongoose.model("credential", {}, "bulkmail");

app.post("/sendmail", async (req, res) => {
  try {
    const { msg, emaillist } = req.body;

    // Find credentials from DB
    const data = await credential.find();
    if (!data.length) {
      return res.status(500).send(false);
    }

    // Create transporter using Gmail SMTP and credentials from DB
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: data[0].toJSON().user,
        pass: data[0].toJSON().pass,
      },
    });

    // Send emails sequentially
    for (const email of emaillist) {
      await transporter.sendMail({
        from: data[0].toJSON().user,
        to: email,
        subject: "Mail from BulkMailer",
        text: msg,
      });
      console.log("Email sent to:", email);
    }

    res.send(true);
  } catch (error) {
    console.error(error);
    res.status(500).send(false);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
