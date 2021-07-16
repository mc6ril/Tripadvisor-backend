const express = require('express');
const formidable = require('express-formidable');
const cors = require('cors');
const app = express();
app.use(formidable());
app.use(cors());
require('dotenv').config();

//Mailgun congiguration
const api_key = process.env.API_KEY; /* VOTRE CLÉ API */
const domain = process.env.DOMAIN;
const mailgun = require('mailgun-js')({ apiKey: api_key, domain: domain });

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Bienvenu sur Tripadvisor !' });
});

app.post('/', async (req, res) => {
    try {
        const { firstname, lastname, email, description } = req.fields;

        const data = {
            from: `${firstname} ${lastname} <${email}>`,
            to: 'lesot.cyril@gmail.com',
            text: description,
        };
        mailgun.messages().send(data, (error, body) => {
            if (!error) {
                return res.status(200).json(body);
            } else {
                return res.status(401).json(error);
            }
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.all('*', (req, res) => {
    res.status(404).json({ message: 'Page not found' });
});

app.listen(process.env.PORT, () => {
    console.log('Server started');
});
