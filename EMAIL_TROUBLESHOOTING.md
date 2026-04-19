# Email Troubleshooting Guide

## 🔴 Common Issue: Gmail App Password Required

**Most Likely Problem**: You're using your regular Gmail password instead of an "App Password"

### How to Fix:

#### Step 1: Enable 2-Step Verification (Required)
1. Go to https://myaccount.google.com/security
2. Sign in to your <your-email>@gmail.com account
3. Click on "2-Step Verification" and turn it ON
4. Follow the setup process ( you'll need your phone)

#### Step 2: Generate App Password
1. Go to https://myaccount.google.com/apppasswords
2. Sign in again if needed
3. Select "Mail" from the dropdown
4. Select "Other (Custom name)" and type "Portfolio Website"
5. Click "Generate"
6. **COPY THE 16-DIGIT PASSWORD** (it looks like: xxxx xxxx xxxx xxxx)

#### Step 3: Update .env File
Update your `.env` file with the app password:

```env
EMAIL_USER=<your-email>@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx  (your 16-digit app password)
```

**IMPORTANT**: Remove the spaces from the app password when pasting!

#### Step 4: Restart Server
```bash
cd "d:\Allen Portfolio"
# Stop current server (Ctrl+C)
# Then restart:
npm start
```

## 🧪 Testing Steps

### Test 1: Check Environment Variables
Visit: http://localhost:3000/test-env

**Expected Result**:
```json
{
  "email_user": "<your-email>@gmail.com",
  "email_pass": "SET (hidden)",
  "node_env": "development"
}
```

If you see "NOT SET", the .env file isn't loading properly.

### Test 2: Check Server Console
When you start the server, look for:
- ✅ "Email server is ready to send messages" - GOOD
- ❌ "Email transporter error" - BAD (check .env file)

### Test 3: Send Test Email
Visit: http://localhost:3000/test-email

This will manually send a test email to <your-email>@gmail.com

**Expected Results**:
- Success: {"success": true, "message": "Test email sent successfully!"}
- Check your Gmail inbox for the test email

### Test 4: Check Gmail Spam Folder
Sometimes emails go to spam! Check:
1. Gmail inbox
2. Spam folder
3. Promotions tab

## 🔧 Alternative: Use Different Email Service

If Gmail keeps failing, you can use a different service:

### Option 1: SendGrid (Recommended for production)
1. Sign up at https://sendgrid.com
2. Get API key
3. Update server.js:

```javascript
const transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    auth: {
        user: 'apikey',
        pass: 'YOUR_SENDGRID_API_KEY'
    }
});
```

### Option 2: Ethereal Email (For testing)
Free testing service - emails don't actually send but you can preview them:
https://ethereal.email

## 📋 Debug Checklist

- [ ] .env file exists in project root
- [ ] EMAIL_USER = <your-email>@gmail.com
- [ ] EMAIL_PASS = 16-digit Gmail App Password (not regular password)
- [ ] Server restarted after .env changes
- [ ] Visit /test-env shows email_user is set
- [ ] Visit /test-email returns success
- [ ] Check Gmail spam folder
- [ ] Server console shows no errors

## 🆘 Still Not Working?

### Check Server Logs
Look for these messages when server starts:
```
✅ Email server is ready to send messages
📧 Using email: <your-email>@gmail.com
```

If you see errors, the .env file isn't loading.

### Verify .env File Location
The .env file should be at:
```
d:\Allen Portfolio\.env
```

### Common .env File Issues
1. **Wrong filename**: Should be `.env` not `env.txt` or `.env.txt`
2. **Hidden extensions**: Windows might hide .txt extension
3. **Wrong location**: Must be in project root, not in views/ or public/
4. **Spaces in values**: Make sure no spaces around = sign

### Manual Test with Debug
Add this to server.js temporarily:
```javascript
console.log('Current directory:', __dirname);
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('Files in directory:', require('fs').readdirSync('.'));
```

## ✅ Success Indicators

You'll know it's working when:
1. Server console shows: "✅ Email server is ready to send messages"
2. Visiting /test-email returns success
3. You receive the test email in your Gmail
4. Form submissions trigger email notifications

## 📞 Still Having Issues?

If you've tried everything and it's still not working, the issue might be:
1. Gmail security blocking the app
2. Firewall/antivirus blocking port 587
3. Your internet provider blocking SMTP

**Quick Fix**: Use SendGrid or another email service instead of Gmail.
