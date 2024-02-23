

export async function sendEmailWithAttachment(to: string, subject: string, text: string, attachmentPath: string): Promise<void> {
  // Create a transporter object using the default SMTP transport.
//   const transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 587,
//     secure: false,
//     auth: {
//       user: 'gabrielmottab@gmail.com',
//       pass: 'process.env.SMTP_PASSWORD',
//     },
//   });

//   // Send mail with defined transport object.
//   const info = await transporter.sendMail({
//     from: '"Your Name" <your_email@example.com>', // Sender address
//     to: to, // List of recipients
//     subject: subject, // Subject line
//     text: text, // Plain text body
//     attachments: [{
//       path: attachmentPath, // Stream the file to be attached
//     }],
//   });

//   console.log('Message sent: %s', info.messageId);
}

// Example usage
const to = 'gabrielmotta@gmail.com';
const subject = 'Here is your PDF';
const text = 'Please find the attached PDF.';
const attachmentPath = 'path_to_output.pdf';

sendEmailWithAttachment(to, subject, text, attachmentPath)
  .then(() => console.log('Email sent successfully.'))
  .catch(error => console.error('Error sending email:', error));
