'use strict';

const nodemailer = require('nodemailer'),
    transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: 'invischat@hotmail.com',
        pass: 'Tt239allo!'
    }
});

const MailSender = {
    /**
     * Email data
     */
    emailData: {
        from: 'invischat@hotmail.com',
        to: 'yuriy.matviyuk22@gmail.com',
        subject: 'Email from Invischat',
        text: 'default text'
    },

    /**
     * Send email
     *
     * @param namespace
     * @param message
     */
    sendEmail: function(namespace, message) {
        this.emailData.text = message;
        transporter.sendMail(this.emailData, (error) => {
            if (error) {
                namespace.emit('email sending error')
            } else {
                namespace.emit('email send successfully')
            }
        })
    }
};

export default MailSender
