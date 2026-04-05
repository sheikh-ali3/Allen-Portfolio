const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.render('index', {
        title: 'Allen Whales - Dispatch Manager Portfolio',
        name: 'Allen Whales'
    });
});

app.get('/experience', (req, res) => {
    res.render('experience', {
        title: 'Experience - Allen Whales'
    });
});

app.post('/book-consultation', (req, res) => {
    const { name, email, phone, company, consultationType, preferredDate, preferredTime, message } = req.body;
    
    // Here you would typically send an email or save to database
    console.log('Consultation booking:', { name, email, phone, company, consultationType, preferredDate, preferredTime, message });
    
    // Send confirmation email (configure with your email service)
    const transporter = nodemailer.createTransporter({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Consultation Booking Confirmation - Allen Whales Dispatch Services',
        html: `
            <h2>Consultation Booking Confirmed</h2>
            <p>Dear ${name},</p>
            <p>Thank you for booking a consultation with Allen Whales Dispatch Services.</p>
            <p><strong>Consultation Details:</strong></p>
            <ul>
                <li>Type: ${consultationType}</li>
                <li>Date: ${preferredDate}</li>
                <li>Time: ${preferredTime}</li>
                <li>Duration: 30 minutes</li>
            </ul>
            <p>We will contact you shortly to confirm the exact time and provide meeting details.</p>
            <p>Best regards,<br>Allen Whales</p>
        `
    };
    
    // Uncomment below when you have email configured
    // transporter.sendMail(mailOptions, (error, info) => {
    //     if (error) console.log(error);
    //     else console.log('Email sent: ' + info.response);
    // });
    
    res.json({ success: true, message: 'Consultation booked successfully! We will contact you soon.' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
