const sgMail = require('@sendgrid/mail');

sgMail.setApiKey('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');

function sendEmail(mailOptions) {
  return new Promise((resolve, reject) => {
    sgMail.send(mailOptions, (error, result) => {
      if (error) return reject(error);
      return resolve(result);
    });
  });
}

module.exports = { sendEmail }
