const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const google = require('googleapis').google

exports.sendMail = async (baseUrl, user, subject, message) => {
    try {

        const oauth2Client = new google.auth.OAuth2(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            process.env.REDIRECT_URL
        );

        const ASCESS_TOKEN = oauth2Client.getAccessToken((err, token) => {

        })


        const { email, _id } = user

        const token = jwt.sign({ id: _id }, process.env.JWT_SECRET);


        const url = `${baseUrl}/${token}`;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                type: "OAuth2",
                user: process.env.SMTP_USER,
                pass: process.env.SMPT_PASS,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: ASCESS_TOKEN,

            }
        });


        const info = await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: email,
            subject: subject,
            text: message,
            html: `<h2> Verify to : <a href=${url}>Click Here</a>  </h2>`
        });


        return info
    } catch (error) {
        console.log(error);
    }
}