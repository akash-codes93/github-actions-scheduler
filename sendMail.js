let nodemailer = require('nodemailer');


let sendMail = (account) => {

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'akash5gupta5@gmail.com',
            pass: process.env['MAIL_PASSWORD']
        }
    });

    let mailOptions = {
        from: 'akash5gupta5@gmail.com',
        to: 'akash.gupta1@olx.com',
        subject: 'Please take medicine! Type: ' +  account,
        text: ''
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

}

module.exports = sendMail
