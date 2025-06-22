const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");

const app = express();

app.use(cors({
    origin: "https://bulkmail-g9hr.onrender.com",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));

app.use(express.json());

mongoose.connect("mongodb+srv://vishali:123@cluster0.jvcy0yc.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("Connected to Db"))
  .catch((error) => console.log("Failed connection Db", error));

//model
const credential = mongoose.model("credential", {}, "bulkmail");

app.post("/sendmail", function (req, res) {
  var msg = req.body.msg;
  var emaillist = req.body.emaillist;

  credential.find().then(function (data) {
    if (!data.length) {
      console.log("No credentials found");
      return res.status(500).send(false);
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: data[0].toJSON().user,
        pass: data[0].toJSON().pass,
      },
    });

    new Promise(async function (resolve, reject) {
      try {
        for (var i = 0; i < emaillist.length; i++) {
          await transporter.sendMail({
            from: data[0].toJSON().user,
            to: emaillist[i],
            subject: "Mail from BulkMailer",
            text: msg,
          });
          console.log("Email sent to :", emaillist[i]);
        }
        resolve("success");
      } catch (error) {
        console.error("Error sending mail:", error);
        reject("Failed");
      }
    }).then(function () {
      res.send(true);
    }).catch(function () {
      res.status(500).send(false);
    });
  }).catch(function (error) {
    console.error("DB find error:", error);
    res.status(500).send(false);
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
