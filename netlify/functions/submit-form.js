const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ success: false, message: 'Method not allowed' }),
            headers: { 'Access-Control-Allow-Origin': '*' }
        };
    }

    // Parse the request body
    let body;
    try {
        body = JSON.parse(event.body);
    } catch (e) {
        // Try parsing as form data
        const params = new URLSearchParams(event.body);
        body = Object.fromEntries(params);
    }

    const { 
        formType, name, email, phone, company, 
        consultationType, preferredDate, preferredTime, message,
        city, country, companyType, trainingType, format, startDate, goals,
        firstName, lastName, purpose
    } = body;

    // Verify environment variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                success: false, 
                message: 'Server email configuration incomplete.' 
            }),
            headers: { 'Access-Control-Allow-Origin': '*' }
        };
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    let mailOptions;
    let responseMessage;

    // Handle different form types
    if (formType === 'consultation' || consultationType) {
        // Consultation booking
        mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Consultation Booking Confirmation - Allen Whales Dispatch Services',
            html: `
                <h2>Consultation Booking Confirmed</h2>
                <p>Dear ${name},</p>
                <p>Thank you for booking a consultation with Allen Whales Dispatch Services.</p>
                <p><strong>Consultation Details:</strong></p>
                <ul>
                    <li>Type: ${consultationType || 'N/A'}</li>
                    <li>Date: ${preferredDate || 'N/A'}</li>
                    <li>Time: ${preferredTime || 'N/A'}</li>
                    <li>Duration: 30 minutes</li>
                </ul>
                <p>We will contact you shortly to confirm the exact time and provide meeting details.</p>
                <p>Best regards,<br>Allen Whales</p>
            `
        };
        responseMessage = 'Consultation booked successfully! We will contact you soon.';

        // Also notify owner
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: '🔔 New Consultation Booking',
            html: `
                <h2>New Consultation Booking</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
                <p><strong>Company:</strong> ${company || 'N/A'}</p>
                <p><strong>Type:</strong> ${consultationType || 'N/A'}</p>
                <p><strong>Date:</strong> ${preferredDate || 'N/A'}</p>
                <p><strong>Time:</strong> ${preferredTime || 'N/A'}</p>
                <p><strong>Message:</strong> ${message || 'N/A'}</p>
            `
        });

    } else if (formType === 'training' || trainingType) {
        // Training booking
        mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Training Booking Confirmation - Allen Whales Logistics Training',
            html: `
                <h2>Training Booking Confirmed</h2>
                <p>Dear ${name},</p>
                <p>Thank you for booking training with Allen Whales Logistics Training Services.</p>
                <p><strong>Training Details:</strong></p>
                <ul>
                    <li>Training Type: ${trainingType || 'N/A'}</li>
                    <li>Format: ${format || 'N/A'}</li>
                    <li>Start Date: ${startDate || 'N/A'}</li>
                    <li>Location: ${city || 'N/A'}, ${country || 'N/A'}</li>
                </ul>
                <p>We will contact you shortly to discuss your training program.</p>
                <p>Best regards,<br>Allen Whales</p>
            `
        };
        responseMessage = 'Training booked successfully! We will contact you soon.';

        // Notify owner
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: '🔔 New Training Booking',
            html: `
                <h2>New Training Booking</h2>
                <p><strong>From:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
                <p><strong>Training:</strong> ${trainingType || 'N/A'}</p>
                <p><strong>Format:</strong> ${format || 'N/A'}</p>
            `
        });

    } else if (formType === 'hire' || purpose) {
        // Hire inquiry
        const fullName = name || `${firstName} ${lastName}`;
        mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: `💼 New Hire Inquiry: ${fullName}`,
            text: `
You have a new hiring inquiry!

--- CONTACT DETAILS ---
Name: ${fullName}
Company: ${company || 'N/A'}
Phone: ${phone || 'N/A'}
Email: ${email}

--- PURPOSE ---
${purpose || 'N/A'}

Submitted at: ${new Date().toLocaleString()}
`
        };
        responseMessage = 'Thank you! Your hiring inquiry has been received.';
    } else {
        return {
            statusCode: 400,
            body: JSON.stringify({ success: false, message: 'Unknown form type' }),
            headers: { 'Access-Control-Allow-Origin': '*' }
        };
    }

    try {
        await transporter.sendMail(mailOptions);
        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, message: responseMessage }),
            headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*' 
            }
        };
    } catch (error) {
        console.error('Email error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                success: false, 
                message: 'Error sending email. Please try again.' 
            }),
            headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*' 
            }
        };
    }
};
