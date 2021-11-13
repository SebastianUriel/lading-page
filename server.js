// .env
require('dotenv').config();

// Librerias
const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(cors());

// Folder public
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
 });

// --- Proceso de encriptacion ---
const crypto = require('crypto');

const encript = (text) => {
    const iv = crypto.randomBytes(Number(process.env.RANDOM_BYTES));
    const cipher = crypto.createCipheriv(process.env.ALGORITHM, process.env.SECRET_KEY, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return {
        iv: iv.toString('hex'),
        content: encrypted.toString('hex')
    };
}

const decrypt = (iv, content) => {
    const decipher = crypto.createDecipheriv(process.env.ALGORITHM, process.env.SECRET_KEY, Buffer.from(iv, 'hex'));
    const decrpyted = Buffer.concat([decipher.update(Buffer.from(content, 'hex')), decipher.final()]);
    return decrpyted.toString();
}

app.post('/encript', (req, res) => {
    let { text } = req.body;
    let result = encript(text);
    return res.send(result);
});

app.post('/decrypt', (req, res) => {
    let { iv, content } = req.body;
    let result = decrypt(iv, content);
    return res.send({ text: result });
});

// --- Proceso envio de correo ---
const nodemailer = require('nodemailer');

app.post('/email', (req, res) => {
    /*try {
        let { name, cellphone, email, service } = req.body;

        let pass = decrypt(process.env.IV, process.env.CONTENT);
    
        let transport = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL,
                pass: pass
            }
        });
    
        let mailOptions = {
            from: process.env.EMAIL_FROM,
            to: process.env.EMAIL_TO,
            subject: '¡NUEVO CONTACTO INTERESADO!',
            text: 'Hey there, it’s our first message sent with Nodemailer ',
            html: '<b>Hey there! </b><br> This is our first message sent with Nodemailer<br /><img src="cid:uniq-mailtrap.png" alt="mailtrap" />'
        };
    
        transport.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error)
                return res.send({ message: 'Hay un error al tratar de enviar el contacto, favor de comunicarce con soporte.' });
            } else {
                console.log(info);
                return res.send({ message: '¡Envío de contacto exitoso!' });
            }
        });
    } catch(err) {
        console.log(err)
        return res.send({ message: 'Hay un error al tratar de enviar el contacto, favor de comunicarce con soporte.' });
    }*/

    return setTimeout(() => {
        return res.send({ message: '¡Envío de contacto exitoso!' });
    }, 4000);
});

app.listen(port, () => {
   console.log(`Server is up at port ${port}`);
});