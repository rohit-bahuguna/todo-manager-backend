const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

exports.sendMail = async (baseUrl, user, subject, message) => {
    try {
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
                pass: process.env.SMPT_PASS
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