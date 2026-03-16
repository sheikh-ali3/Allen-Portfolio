# Allen Whales - Dispatch Manager Portfolio

A professional Node.js portfolio website for Allen Whales, showcasing dispatch management services for US-based trucking companies.

## Features

- **Animated Title Switching**: Alternates between "Logistics Coordinator" and "Dispatch Manager"
- **Professional Design**: Corporate color scheme with trucking industry imagery
- **Consultation Booking**: 30-minute consultation booking system
- **Contact Options**: Phone call and Google Meet integration
- **Responsive Design**: Mobile-friendly layout
- **Service Showcase**: Comprehensive dispatch services display
- **Achievements Section**: Highlights key metrics (25+ trucks, 95% on-time delivery)
- **Testimonials**: Client feedback and reviews
- **Modern UI**: Built with Tailwind CSS and smooth animations

## Tech Stack

- **Backend**: Node.js with Express.js
- **Frontend**: EJS templating engine
- **Styling**: Tailwind CSS
- **Icons**: Font Awesome
- **Email**: Nodemailer (for consultation confirmations)
- **Images**: Unsplash for professional trucking photos

## Getting Started

### Prerequisites
- Node.js installed on your system
- npm or yarn package manager

### Installation

1. Clone or download this project
2. Navigate to the project directory
3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` file with your email configuration:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   PORT=3000
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Or start production server:
   ```bash
   npm start
   ```

7. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
d:\Allen Portfolio\
├── package.json          # Project dependencies and scripts
├── server.js             # Express server setup
├── .env.example          # Environment variables template
├── README.md             # Project documentation
├── views\
│   └── index.ejs         # Main portfolio page template
├── public\               # Static assets (CSS, JS, images)
└── routes\               # Route handlers (if needed)
```

## Features Overview

### Hero Section
- Professional gradient background with trucking imagery
- Animated title switching between roles
- Clear call-to-action buttons for hiring and consultations

### Services Section
- Six core services displayed in card layout
- Icons and descriptions for each service
- Hover effects for enhanced interactivity

### Achievements Section
- Key metrics display (25+ trucks, 95% on-time delivery)
- Visual representation of success statistics
- Professional imagery integration

### Consultation Booking
- Modal-based booking form
- 30-minute consultation slots
- Phone and Google Meet options
- Email confirmation system (when configured)

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimizations
- Smooth scrolling navigation

## Customization

### Colors and Branding
The color scheme uses professional corporate colors:
- Primary: Blue (#1e3a8a, #3730a3, #4c1d95)
- Secondary: Orange (#f97316) for CTAs
- Neutral: Grays and whites

### Content Updates
To personalize the content:
1. Edit `views/index.ejs` to update text, services, and testimonials
2. Replace images in the `<img>` tags with your own
3. Update contact information and links

### Email Configuration
To enable email confirmations:
1. Set up a Gmail account with app password
2. Update `.env` with your credentials
3. Uncomment the email sending code in `server.js`

## Deployment

### Local Development
Run `npm run dev` for development with automatic restarts.

### Production Deployment
1. Set `NODE_ENV=production` in your environment
2. Run `npm start` for production server
3. Consider using PM2 for process management

### Hosting Options
- **Heroku**: Easy Node.js deployment
- **Vercel**: Serverless hosting
- **DigitalOcean**: VPS hosting
- **AWS**: Cloud hosting with EC2

## Security Considerations

- Input validation on forms
- Rate limiting for consultation bookings
- Secure email configuration
- HTTPS in production

## Support

For questions or customization requests, refer to the code comments or reach out through the consultation form on the portfolio.

---

**Built with ❤️ for Allen Whales - Professional Dispatch Manager**
