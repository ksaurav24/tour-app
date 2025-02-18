const nodemailer = require("nodemailer");
const ApiError = require("./ApiError");
const getLogger = require("../utils/logger");

const logger = getLogger('Mailer');

const transporter = nodemailer.createTransport({
  // eslint-disable-next-line no-undef
  host: process.env.SMTP_HOST,     // smtp server
  port: 587, 
  secure: false,
  auth: {
    // eslint-disable-next-line no-undef
    user: process.env.MAIL_USER,   // generated user
    // eslint-disable-next-line no-undef
    pass: process.env.MAIL_PASSWORD,   // generated password
  },
});

const VerifyHtml = (url) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email - TravelBuddy</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .logo {
            text-align: center;
            margin-bottom: 20px;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            text-decoration: none;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <h1>TravelBuddy</h1>
        </div>
        <p>Hello there,</p>
        <p>Thank you for signing up with TravelBuddy! We're excited to have you on board. To complete your registration, please verify your email address by clicking the button below or using the verification link.</p>
        <p style="text-align: center;">
            <a href=${url} class="button">Verify Email</a>
        </p>
        <p>Alternatively, you can copy and paste the following URL into your browser:</p>
        <p><a href=${url}>
            ${url}
        </a></p>
        <p>If you didn't create an account with TravelBuddy, please disregard this email.</p>
        <p>Best regards,<br>The TravelBuddy Team</p>
    </div>
</body>
</html>`;
};

const ResetHtml = (url) => {
    return `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password - TravelBuddy</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 30px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .logo {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo h1 {
            color: #4CAF50;
            font-size: 36px;
            margin: 0;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #4CAF50;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            text-align: center;
            transition: background-color 0.3s ease;
        }
        .button:hover {
            background-color: #45a049;
        }
        .link {
            color: #4CAF50;
            word-break: break-all;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 14px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <h1>TravelBuddy</h1>
        </div>
        <p>Hello there,</p>
        <p>We received a request to reset your password for your TravelBuddy account. If you didn't make this request, please ignore this email.</p>
        <p>To reset your password, click the button below or use the provided link:</p>
        <p style="text-align: center; margin: 30px 0;">
            <a href="${url}" class="button">Reset Password</a>
        </p>
        <p>Alternatively, you can copy and paste the following URL into your browser:</p>
        <p><a href="${url}" class="link">
            ${url}
        </a></p>
        <p>This password reset link will expire in 24 hours for security reasons.</p>
        <p>If you didn't request a password reset, please ignore this email.</p>
        <div class="footer">
            <p>Best regards,<br>The TravelBuddy Team</p>
        </div>
    </div>
</body>
</html>

    `;
}

const sendMail = async(to, emailType, url) => {
    try {
        const mailOptions = {
            from: 'TravelApp <noreply@travel.app>',
            to,
            subject:emailType === 'VERIFY' ? 'Verify your email address' : 'Reset your password',
            html: emailType === 'VERIFY' ? VerifyHtml(url) : ResetHtml(url)
        }
        const info = await transporter.sendMail(mailOptions)
        logger.info('Email sent', { emailType, to, messageId: info.messageId });
        return info;
    } catch (error) {
        logger.error('Error sending email', { error: error.message });
        throw new ApiError(500, 'Error in sending email')
    }
}

module.exports = sendMail;