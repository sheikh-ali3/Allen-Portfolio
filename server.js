const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Create a single transporter instance to reuse
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    debug: true, // Enable debug logging
    logger: true  // Enable logger
});

// Verify transporter connection on startup
transporter.verify(function(error, success) {
    if (error) {
        console.log('❌ Email transporter error:', error);
        console.log('📧 EMAIL_USER:', process.env.EMAIL_USER || 'NOT SET');
        console.log('🔑 EMAIL_PASS:', process.env.EMAIL_PASS ? 'SET' : 'NOT SET');
    } else {
        console.log('✅ Email server is ready to send messages');
        console.log('📧 Using email:', process.env.EMAIL_USER);
    }
});

const app = express();
const PORT = process.env.PORT || 3000;


// Middleware
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Test route to verify environment variables
app.get('/test-env', (req, res) => {
    res.json({
        email_user: process.env.EMAIL_USER || 'NOT SET',
        email_pass: process.env.EMAIL_PASS ? 'SET (hidden)' : 'NOT SET',
        node_env: process.env.NODE_ENV || 'development'
    });
});

// Test email route - manually send a test email
app.get('/test-email', async (req, res) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        return res.json({ 
            success: false, 
            message: 'Email configuration missing in .env file' 
        });
    }
    
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, // Send to yourself
        subject: 'Test Email - Portfolio System',
        html: `
            <h2>Test Email</h2>
            <p>This is a test email from your portfolio system.</p>
            <p>If you received this, your email configuration is working!</p>
            <p>Time sent: ${new Date().toLocaleString()}</p>
        `
    };
    
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Test email sent:', info.response);
        res.json({ 
            success: true, 
            message: 'Test email sent successfully! Check your inbox.',
            response: info.response 
        });
    } catch (error) {
        console.error('Test email error:', error);
        res.json({ 
            success: false, 
            message: 'Failed to send test email',
            error: error.message 
        });
    }
});

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

app.get('/training', (req, res) => {
    res.render('training', {
        title: 'Training Services - Allen Whales'
    });
});

app.post('/book-consultation', (req, res) => {
    const { name, email, phone, company, consultationType, preferredDate, preferredTime, message } = req.body;
    
    // Here you would typically send an email or save to database
    console.log('Consultation booking:', { name, email, phone, company, consultationType, preferredDate, preferredTime, message });
    
    // Verify environment variables are set
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error('Email configuration missing. Please check .env file');
        return res.json({ 
            success: false, 
            message: 'Server email configuration incomplete. Please contact support.' 
        });
    }
    
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
    
    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Email error:', error);
            res.json({ success: false, message: 'Error sending email. Please try again.' });
        } else {
            console.log('Consultation email sent: ' + info.response);
            res.json({ success: true, message: 'Consultation booked successfully! We will contact you soon.' });
        }
    });
});

app.post('/book-training', (req, res) => {
    const { name, email, phone, city, country, companyType, trainingType, format, startDate, goals } = req.body;
    
    // Verify environment variables are set
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error('Email configuration missing. Please check .env file');
        return res.json({ 
            success: false, 
            message: 'Server email configuration incomplete. Please contact support.' 
        });
    }
    
    // Here you would typically send an email or save to database
    console.log('Training booking:', { name, email, phone, city, country, companyType, trainingType, format, startDate, goals });
    
    // Send confirmation email (configure with your email service)
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Training Booking Confirmation - Allen Whales Logistics Training',
        html: `
            <h2>Training Booking Confirmed</h2>
            <p>Dear ${name},</p>
            <p>Thank you for booking training with Allen Whales Logistics Training Services.</p>
            <p><strong>Training Details:</strong></p>
            <ul>
                <li>Training Type: ${trainingType}</li>
                <li>Format: ${format}</li>
                <li>Start Date: ${startDate}</li>
                <li>Location: ${city}, ${country}</li>
                <li>Type: ${companyType}</li>
                <li>Goals: ${goals}</li>
            </ul>
            <p>We will contact you shortly to discuss your training program and schedule the sessions.</p>
            <p>Best regards,<br>Allen Whales</p>
        `
    };
    
    // Send email to user
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('❌ Training email error:', error);
            return res.json({ success: false, message: 'Error sending email. Please try again.' });
        }
        
        console.log('✅ Training email sent to user: ' + info.response);
        
        // Also send notification to site owner
        const ownerMailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Send to yourself
            subject: '🔔 New Training Booking - Action Required',
            html: `
                <h2>New Training Booking Received</h2>
                <p><strong>From:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Location:</strong> ${city}, ${country}</p>
                <p><strong>Type:</strong> ${companyType}</p>
                <p><strong>Training:</strong> ${trainingType}</p>
                <p><strong>Format:</strong> ${format}</p>
                <p><strong>Start Date:</strong> ${startDate}</p>
                <p><strong>Goals:</strong> ${goals || 'Not specified'}</p>
                <hr>
                <p>Please contact this lead within 24 hours.</p>
            `
        };
        
        transporter.sendMail(ownerMailOptions, (ownerError, ownerInfo) => {
            if (ownerError) {
                console.log('⚠️  Owner notification failed:', ownerError);
            } else {
                console.log('✅ Owner notification sent: ' + ownerInfo.response);
            }
        });
        
        res.json({ success: true, message: 'Training booked successfully! We will contact you soon to finalize the program.' });
    });
});

app.post('/hire-me', async (req, res) => {
    const { firstName, lastName, company, phone, email, purpose } = req.body;
    
    console.log('New Hire Inquiry:', {
        firstName, lastName, company, phone, email, purpose,
        timestamp: new Date().toISOString()
    });

    // Prepare email
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.NOTIFICATION_EMAIL,
        subject: `💼 New Hire Inquiry: ${firstName} ${lastName}`,
        text: `
You have a new hiring inquiry from your portfolio website!

--- CONTACT DETAILS ---
Name: ${firstName} ${lastName}
Company: ${company}
Phone: ${phone}
Email: ${email}

--- PURPOSE OF HIRING ---
${purpose}

-----------------------
Submitted at: ${new Date().toLocaleString()}
`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({
            success: true,
            message: 'Thank you! Your hiring inquiry has been received. Allen will contact you shortly.'
        });
    } catch (error) {
        console.error('Email Error:', error);
        // Still return success because it's logged to console, 
        // but the site owner should check their logs if email fails.
        res.json({
            success: true,
            message: 'Thank you! Your inquiry was received (Note: Email alert failed, but data is logged).'
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
