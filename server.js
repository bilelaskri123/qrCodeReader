const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require("nodemailer");
const port = process.env.PORT || 3000

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(cors());
app.use((req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, PUT, DELETE, OPTIONS, HEAD"
    );
    next();
});

app.post('/send-email', (req, res, next) => {
    let qrCodeData = req.body.qrCode;
    let dataTable = qrCodeData.split(' ');
    let email = dataTable.filter(data => data.indexOf('@') !== -1)[0].split('//')[1];
    console.log(email);
    res.status(200).json({msg: 'success!'})
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.email,
            pass: process.env.password,
        },
    });

    const mailOptions = {
        from: process.env.email,
        to: email,
        subject: "Welcome",
        html:
            `<h3> Hi <strong> ${email} </strong> thank you for accepting our invitation </h3> <br><br> ` +
            "<br><strong> manager of Bee: chiheb DAOUD</strong> " +
            "<br><strong> Best regards</strong> "
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "server error" });
        } else {
            console.log("Email sent" + info.response);
            res.status(201).json({ msg: `email sent to ${email}` });
        }
    });
});


app.get('/', (req, res, next) => {
    return 'hello in heroku project i am very happy!'
})


app.listen(port, () => {
    console.log('server running on port 3000');
})