const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();

app.use(cors());
app.use(express.json());

app.post('/send-email', (req, res) => {
    const { name, email, message } = req.body;

    // Configura el transporte SMTP para enviar el correo desde tu cuenta de Gmail
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'smartsocialhelp@gmail.com', // Reemplaza con tu cuenta de Gmail
            pass: 'fockyfqvgghulybi', // Reemplaza con tu contraseña de Gmail
        },
    });

    const mailOptions = {
        from: `${email}`,
        to: 'smartsocialhelp@gmail.com', // Reemplaza con la dirección de correo a la que deseas enviar el formulario
        subject: 'Formulario de contacto',
        text: `
      Nombre: ${name}
      Email: ${email}
      Mensaje: ${message}
    `,
    };

    transporter.sendMail(mailOptions, (error) => {
        if (error) {
            console.error(error);
            res.status(500).send('Error al enviar el correo');
        } else {
            res.sendStatus(200);
        }
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor en ejecución en el puerto ${PORT}`);
});