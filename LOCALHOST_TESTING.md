# Localhost Testing Guide

## Current Setup (Test Mode)

Your application is configured for **localhost testing**. Emails will NOT be actually sent, but will be logged to the console instead.

### What Happens When Forms Are Submitted:

1. ✅ PDF is generated with all three forms
2. ✅ PDF is saved to `server/previews/` directory
3. ✅ Email details are logged to the **server console** (not actually sent)
4. ✅ Data is saved to database

### How to See the "Email"

When you submit FormStep3, check the **server terminal** and you'll see:

```
============================================================
📧 EMAIL (TEST MODE - Not Actually Sent)
============================================================
From: test@localhost.local
To: divecenter@localhost.local
CC: user@example.com
Subject: PADI e-Forms Submission - John Doe
Attachment: PADI_Forms_John_Doe.pdf
PDF Path: D:\Development\Git\PADI-eForm\server\previews\complete_forms_2_1234567890.pdf
============================================================
```

### Check the PDF

After submission, you can open the PDF file from:
```
server/previews/complete_forms_[userId]_[timestamp].pdf
```

This PDF contains all three forms on separate pages with signatures.

## Testing Steps

1. **Start the server:**
   ```bash
   cd server
   node index.js
   ```

2. **Start the frontend:**
   ```bash
   npm run dev
   ```

3. **Complete the forms:**
   - Fill out FormStep1 and save
   - Fill out FormStep2 and save  
   - Fill out FormStep3 and submit

4. **Check the results:**
   - Look at the server terminal for the email log
   - Open the PDF file from `server/previews/`

## Switching to Production (Real Email)

When you're ready to send real emails:

1. **Update `.env`:**
   ```env
   EMAIL_MODE=production
   EMAIL_USER=your-real-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   ```

2. **Set up Gmail App Password** (see EMAIL_SETUP.md)

3. **Update dive center email in database:**
   ```sql
   UPDATE dive_centers SET email = 'real-divecenter@example.com' WHERE id = 1;
   ```

4. **Restart the server**

## Current Configuration

- 📧 Email Mode: **TEST** (emails logged, not sent)
- 🗄️ Database: **localhost MySQL**
- 🌐 API: **http://localhost:4000**
- 💾 PDF Storage: **server/previews/**
- 🖼️ Signatures: **server/signatures/**

## Benefits of Test Mode

✅ No need for real email credentials  
✅ No spam to real email addresses  
✅ Instant feedback in console  
✅ Can test email content/formatting  
✅ PDF still gets generated  
✅ All data still saved to database  

Perfect for development and testing!
