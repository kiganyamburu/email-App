# Email Configuration Guide

The Email Sending App requires SMTP configuration to send actual emails. Here are the environment variables you need to set:

## Environment Variables

Create a `.env` file in the root directory or set these environment variables:

```bash
# SMTP Configuration
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASS=your-email-password

# Sender Information
FROM_EMAIL="Your App Name <noreply@yourdomain.com>"
```

## Popular SMTP Providers

### Gmail
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=your-app-password  # Use App Password, not regular password
```

### Outlook/Hotmail
```bash
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

### SendGrid
```bash
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

### Mailgun
```bash
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@your-domain.mailgun.org
SMTP_PASS=your-mailgun-password
```

## Development/Testing

For development and testing without a real SMTP provider, the app will use Ethereal Email (fake SMTP service) by default. This allows you to test the interface without sending real emails.

## Security Notes

- Never commit SMTP credentials to version control
- Use environment variables or secure secret management
- For Gmail, use App Passwords instead of your regular password
- Enable 2FA on your email accounts when possible

## Troubleshooting

1. **Connection errors**: Check your SMTP host and port
2. **Authentication errors**: Verify username and password
3. **Gmail issues**: Make sure you're using an App Password
4. **Firewall issues**: Ensure port 587 (or 465 for SSL) is open

## Testing the Configuration

The app includes a connection test that runs automatically when you open the interface. You'll see a connection status indicator in the top-right corner of the app.
