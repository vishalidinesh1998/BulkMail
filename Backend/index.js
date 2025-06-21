const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const { promises } = require("nodemailer/lib/xoauth2");
const mongoose = require("mongoose")

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://vishali:123@cluster0.jvcy0yc.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0").then(function () {
  console.log("Conected to Db")
}).catch(function (error) {
  console.log("Failed connection Db")
})

//model
const credential = mongoose.model("credential", {}, "bulkmail")





app.post("/sendmail", function (req, res) {

  var msg = req.body.msg
  var emaillist = req.body.emaillist
  credential.find().then(function (data) {

    // Use Gmail SMTP with App Password
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: data[0].toJSON().user,
        pass: data[0].toJSON().pass                    // your 16-character App Password (no spaces)
      },


    });



    new Promise(async function (reslove, reject) {
      try {
        for (var i = 0; i < emaillist.length; i++) {

          // Send mail
          await transporter.sendMail(

            {
              from: "dvishaliarumugam98@gmail.com",
              to: emaillist[i],
              subject: "Mail from BulkMailer",
              text: msg,
            },
          )
          console.log("Email sent to :", emaillist[i])
        }
        reslove("success")
      }
      catch (error) {
        reject("Failed")
      }


    }).then(function () {
      res.send(true)
    }).catch(function () {
      res.send(false)
    })

  }).catch(function (error) {
    console.log(error)
  })


})



app.listen(5000, function () {
  console.log("Server started.....");
});
