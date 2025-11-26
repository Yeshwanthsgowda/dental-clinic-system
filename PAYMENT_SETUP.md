# Payment Integration Setup Guide

## Overview
This project now includes Razorpay payment integration for consultation fees. Patients pay ₹500 consultation fee online, while treatment charges are collected at the clinic.

## Setup Instructions

### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

### 2. Run Database Migration
```bash
cd backend
npx prisma migrate dev --name add_payment_fields
npx prisma generate
```

### 3. Get Razorpay API Keys

#### For Testing (Free):
1. Go to https://razorpay.com/
2. Sign up for a free account
3. Go to Settings → API Keys
4. Generate Test Keys (Key ID and Key Secret)

#### For Production:
1. Complete KYC verification on Razorpay
2. Generate Live Keys

### 4. Update Environment Variables

Add to `backend/.env`:
```env
RAZORPAY_KEY_ID=your_razorpay_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here
```

### 5. Restart Backend Server
```bash
cd backend
npm run dev
```

## Features

### Payment Flow:
1. Patient books appointment
2. Appointment created with "PENDING" payment status
3. Payment modal opens automatically
4. Patient pays ₹500 consultation fee via:
   - UPI (Google Pay, PhonePe, Paytm, etc.)
   - Credit/Debit Cards
   - Net Banking
5. Payment verified
6. Appointment status changes to "CONFIRMED"
7. Patient redirected to appointments page

### Payment Methods Supported:
- ✅ UPI (All apps)
- ✅ Credit Cards (Visa, Mastercard, Amex, etc.)
- ✅ Debit Cards
- ✅ Net Banking (All major banks)
- ✅ Wallets (Paytm, PhonePe, etc.)

### Security:
- Payment verification using Razorpay signature
- Secure HTTPS communication
- PCI DSS compliant

## Testing

### Test Cards (Razorpay Test Mode):
- Card Number: 4111 1111 1111 1111
- CVV: Any 3 digits
- Expiry: Any future date

### Test UPI:
- UPI ID: success@razorpay
- This will simulate successful payment

## Consultation Fee
- Default: ₹500
- Can be changed in `AIBookAppointment.jsx` (CONSULTATION_FEE constant)
- Treatment charges are collected at the clinic (not online)

## Troubleshooting

### Payment Modal Not Opening:
- Check browser console for errors
- Ensure Razorpay script is loading
- Check internet connection

### Payment Verification Failed:
- Verify RAZORPAY_KEY_SECRET is correct in .env
- Check backend logs for errors
- Ensure database is updated with payment fields

### Database Migration Issues:
```bash
cd backend
npx prisma migrate reset
npx prisma migrate dev
npx prisma generate
```

## Support
For Razorpay issues: https://razorpay.com/docs/
For integration help: Check backend logs and browser console
