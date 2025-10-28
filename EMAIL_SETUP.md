# Email Setup Instructions

## Overview
The system automatically sends a PDF containing all three completed forms to the dive center email (with a copy to the participant) when Form 3 is submitted.

## Configuration Steps

### 1. Copy Environment File
```bash
cp .env.example .env
```

### 2. Configure Email Settings

#### For Gmail:
1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Generate an App Password:
   - Go to Security → 2-Step Verification → App passwords
   - Select "Mail" and "Other (Custom name)"
   - Copy the 16-character password
4. Update `.env`:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=xxxx-xxxx-xxxx-xxxx
```

#### For Other Email Providers:
Update the transporter configuration in `server/index.js`:

**Outlook/Office365:**
```javascript
service: 'Outlook365'
```

**Yahoo:**
```javascript
service: 'Yahoo'
```

**Custom SMTP:**
```javascript
host: 'smtp.your-domain.com',
port: 587,
secure: false,
auth: {
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASSWORD
}
```

### 3. Set Dive Center Email

In your database, update the dive center email:
```sql
UPDATE dive_centers 
SET email = 'divecenter@example.com' 
WHERE id = 1;
```

Or set a default fallback email in `.env`:
```env
DEFAULT_DIVE_CENTER_EMAIL=backup@example.com
```

### 4. Test Email Functionality

1. Restart the server
2. Complete all three forms
3. Submit Form 3
4. Check both emails (dive center and participant)

## Email Content

The email includes:
- **To:** Dive center email
- **CC:** Participant email
- **Subject:** PADI e-Forms Submission - [Participant Name]
- **Attachment:** PDF with all three forms (separate pages)

## PDF Content

The PDF includes:
- Page 1: Form 1 - Standard Safe Diving Practices
- Page 2: Form 2 - Non-Agency Disclosure and Liability Release  
- Page 3: Form 3 - Diver Medical Participant Questionnaire
- All signatures are included as images

## Troubleshooting

### Email not sending
- Check `.env` file exists and has correct credentials
- Verify email service is configured correctly
- Check server console for error messages
- Ensure dive center has an email address in the database

### PDF not generating
- Check `server/previews` directory exists
- Verify signature files exist in `server/signatures`
- Check server console for PDF generation errors

### Missing dive center email
- Set `DEFAULT_DIVE_CENTER_EMAIL` in `.env` as fallback
- Update dive center email in database

## Security Notes

- Never commit `.env` file to version control
- Use app-specific passwords, not your main email password
- Keep email credentials secure
- Consider using a dedicated email account for the system
