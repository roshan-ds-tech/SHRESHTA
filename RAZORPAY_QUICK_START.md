# Razorpay Integration - Quick Start

## ✅ What's Been Implemented

1. ✅ Razorpay script added to `index.html`
2. ✅ Backend payment endpoints created
3. ✅ Frontend checkout handler implemented in CartPage
4. ✅ Payment verification on backend
5. ✅ Environment variable configuration ready

## 🚀 Quick Setup (3 Steps)

### Step 1: Get Your Razorpay Keys
1. Go to https://dashboard.razorpay.com
2. Settings → API Keys → Generate Test Keys
3. Copy **Key ID** and **Key Secret**

### Step 2: Install Razorpay SDK
```bash
cd backend/shreshta_backend
pip install razorpay
```

### Step 3: Set Environment Variables

**Backend (.env file or environment variables):**
```
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxx
```

**Frontend (.env file in SHRESHTA/ directory):**
```
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxx
VITE_API_URL=http://localhost:8000
```

## 📝 Files Modified/Created

### Backend:
- `backend/shreshta_backend/accounts/views.py` - Added payment views
- `backend/shreshta_backend/accounts/urls.py` - Added payment routes
- `backend/shreshta_backend/firstbackend/settings.py` - Added Razorpay config

### Frontend:
- `index.html` - Added Razorpay script
- `src/pages/CartPage.tsx` - Added checkout handler

### Documentation:
- `RAZORPAY_SETUP.md` - Complete setup guide
- `RAZORPAY_QUICK_START.md` - This file

## 🧪 Testing

Use Razorpay test cards:
- **Card:** `4111 1111 1111 1111`
- **Expiry:** Any future date
- **CVV:** Any 3 digits
- **Name:** Any name

## 🔗 API Endpoints

- `POST /accounts/payment/create-order/` - Create payment order
- `POST /accounts/payment/verify/` - Verify payment

## 📖 Full Documentation

See `RAZORPAY_SETUP.md` for detailed instructions.

