import * as functions from 'firebase-functions';
require('cors');
const nodemailer = require('nodemailer');
const gmailEmail = 'aptcom.io@gmail.com';
const gmailPassword = 'aptcom1234';
const mailTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: gmailEmail,
        pass: gmailPassword,
    },
});
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
const admin = require('firebase-admin');
admin.initializeApp();

const cors = require('cors')({
    origin: true,
    allowedHeaders: ['Content-Type', 'Access-Control-Allow-Origin', 'Content-Length', 'X-Requested-With', 'Accept'],
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    optionsSuccessStatus: 200
});

exports.deleteUser = functions.https.onRequest((req, res) => {
    const uid = req.body.uid;

    const delUser = admin.auth().deleteUser(uid);
    return cors(req, res, () => {
        delUser.then(() => {
            res.status(200).send({ success: true, msg: 'User Deleted Succesfully' });
        }).catch((error) => {
            console.log("Error deleting user:", error);

            res.json(error);
        });
    });


});

exports.sendEmail = functions.https.onRequest((req, res) => {
    // const uid = req.body.uid;
    console.log(req.body);    

    return cors(req, res, () => {
       
        const mailOptions = {
            from: '"Aptcom" <noreply@aptcom.io>',
            to: req.body.toEmail,
            subject: 'A new Service Request',
            text: req.body.message,
            html: req.body.message
        };

        mailTransport.sendMail(mailOptions).then((data) => {
            console.log('dbCompaniesOnUpdate:Welcome confirmation email');
            res.status(200).send({ success: true, message: data });
            return;
        }).catch((error) => {
            console.error('There was an error while sending the email:', error);
            res.status(400).send({ success: false, error: error });
        });
    });   
    
});