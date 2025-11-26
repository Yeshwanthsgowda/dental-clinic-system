# EmailJS Setup Guide for Contact Form

## Quick Setup (5 minutes)

### Step 1: Create EmailJS Account
1. Go to https://www.emailjs.com/
2. Sign up for FREE account (200 emails/month)
3. Verify your email

### Step 2: Add Email Service
1. Go to **Email Services** in dashboard
2. Click **Add New Service**
3. Choose **Gmail** (or your preferred email provider)
4. Connect your email: **advikdentocare@gmail.com**
5. Note down the **Service ID** (e.g., `service_abc123`)

### Step 3: Create Email Template
1. Go to **Email Templates**
2. Click **Create New Template**
3. Use this template:

**Template Name:** Contact Form

**Subject:** New Contact Form Message from {{from_name}}

**Content:**
```
You have received a new message from your website contact form:

Name: {{from_name}}
Email: {{from_email}}
Phone: {{phone}}

Message:
{{message}}

---
This email was sent from Advik Dento Care website contact form.
```

4. Save and note down the **Template ID** (e.g., `template_xyz789`)

### Step 4: Get Public Key
1. Go to **Account** → **General**
2. Find your **Public Key** (e.g., `abcXYZ123_456`)

### Step 5: Update Contact.jsx
Open `frontend/src/pages/Contact.jsx` and replace these values:

```javascript
await emailjs.send(
  'service_abc123',      // Replace with your Service ID
  'template_xyz789',     // Replace with your Template ID
  {
    from_name: formData.name,
    from_email: formData.email,
    phone: formData.phone,
    message: formData.message,
    to_email: 'advikdentocare@gmail.com',
  },
  'abcXYZ123_456'       // Replace with your Public Key
);
```

### Step 6: Test
1. Go to your contact page
2. Fill out the form
3. Click "Send Message"
4. Check **advikdentocare@gmail.com** inbox

## Email Template Variables

Make sure your EmailJS template includes these variables:
- `{{from_name}}` - Sender's name
- `{{from_email}}` - Sender's email
- `{{phone}}` - Sender's phone
- `{{message}}` - Message content

## Troubleshooting

### Emails not sending?
- Check Service ID, Template ID, and Public Key are correct
- Verify email service is connected in EmailJS dashboard
- Check browser console for errors
- Make sure you're not exceeding 200 emails/month (free tier)

### Gmail blocking emails?
- Enable "Less secure app access" in Gmail settings
- Or use App Password if 2FA is enabled

## Free Tier Limits
- 200 emails/month
- 2 email services
- 2 email templates
- Perfect for small business contact forms!

## Upgrade (Optional)
If you need more emails:
- Personal: $7/month (1000 emails)
- Professional: $15/month (5000 emails)

## Current Setup
- **To Email**: advikdentocare@gmail.com
- **CC Email**: drtejas1993@gmail.com (can be added in template)
- **Form Fields**: Name, Email, Phone, Message
- **Features**: Loading state, success/error messages, form reset

---
**Note**: Keep your Public Key in the code - it's meant to be public. Service ID and Template ID are also safe to expose.
