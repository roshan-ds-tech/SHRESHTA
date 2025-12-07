# Razorpay Payment Integration Setup Guide

This guide will help you set up Razorpay payment gateway for your Shreshta e-commerce application.

## Prerequisites

1. A Razorpay account - Sign up at https://dashboard.razorpay.com
2. Python backend with Django installed
3. Node.js and npm for frontend

## Step 1: Get Razorpay API Keys

1. Go to https://dashboard.razorpay.com
2. Sign up or log in to your account
3. Navigate to **Settings** → **API Keys**
4. Click on **Generate Test Keys** (for development) or use **Live Keys** (for production)
5. Copy the following:
   - **Key ID** (e.g., `rzp_test_xxxxx`)
   - **Key Secret** (e.g., `xxxxxxxxxxxxx`) ⚠️ Keep this secret!

## Step 2: Install Razorpay Python SDK

Install the Razorpay Python SDK in your backend:

```bash
cd backend/shreshta_backend
pip install razorpay
```

Or add to your `requirements.txt`:

```
razorpay>=1.4.0
```

## Step 3: Configure Backend Environment Variables

1. Navigate to your Django backend directory:
   ```bash
   cd backend/shreshta_backend
   ```

2. Add Razorpay keys to your Django settings. In `firstbackend/settings.py`, add:

   ```python
   # Razorpay Configuration
   RAZORPAY_KEY_ID = os.environ.get('RAZORPAY_KEY_ID', 'your_key_id_here')
   RAZORPAY_KEY_SECRET = os.environ.get('RAZORPAY_KEY_SECRET', 'your_key_secret_here')
   ```

   **OR** set them as environment variables:

   **On Windows (PowerShell):**
   ```powershell
   $env:RAZORPAY_KEY_ID="rzp_test_xxxxx"
   $env:RAZORPAY_KEY_SECRET="xxxxxxxxxxxxx"
   ```

   **On Linux/Mac:**
   ```bash
   export RAZORPAY_KEY_ID="rzp_test_xxxxx"
   export RAZORPAY_KEY_SECRET="xxxxxxxxxxxxx"
   ```

   **For production**, use a `.env` file (recommended):
   - Create a `.env` file in your backend directory
   - Add:
     ```
     RAZORPAY_KEY_ID=rzp_test_xxxxx
     RAZORPAY_KEY_SECRET=xxxxxxxxxxxxx
     ```
   - Install `python-dotenv` and load it in settings.py:
     ```python
     from dotenv import load_dotenv
     load_dotenv()
     ```

## Step 4: Configure Frontend Environment Variables

1. Create a `.env` file in your frontend root directory (`SHRESHTA/`)

2. Add your Razorpay Key ID (only the public key, never the secret!):
   ```
   VITE_RAZORPAY_KEY_ID=rzp_test_xxxxx
   VITE_API_URL=http://localhost:8000
   ```

   **Note:** 
   - `VITE_` prefix is required for Vite to expose these variables
   - Only use the **Key ID** in frontend, never the Key Secret!

## Step 5: Install Python Dependencies

Make sure you have the required Python packages. Create or update `requirements.txt` in your backend:

```
razorpay>=1.4.0
Django>=5.2.7
djangorestframework>=3.14.0
django-cors-headers>=4.0.0
python-dotenv>=1.0.0
```

Install dependencies:
```bash
pip install -r requirements.txt
```

## Step 6: Test the Integration

1. **Start your Django backend:**
   ```bash
   cd backend/shreshta_backend
   python manage.py runserver
   ```

2. **Start your frontend:**
   ```bash
   npm run dev
   ```

3. **Test the payment flow:**
   - Add items to cart
   - Click "Proceed to Checkout"
   - You should see the Razorpay payment popup
   - Use Razorpay test cards:
     - Card Number: `4111 1111 1111 1111`
     - Expiry: Any future date
     - CVV: Any 3 digits
     - Name: Any name

## API Endpoints

The following endpoints have been added:

- **POST** `/accounts/payment/create-order/` - Create a Razorpay order
  - Body: `{ "amount": 1000 }` (amount in rupees)
  - Returns: Order details with order ID

- **POST** `/accounts/payment/verify/` - Verify payment signature
  - Body: Payment response from Razorpay
  - Returns: Verification status

## Security Notes

⚠️ **IMPORTANT SECURITY REMINDERS:**

1. **Never expose your Key Secret in frontend code**
2. Always verify payment signatures on the backend
3. Use environment variables for sensitive keys
4. In production, use HTTPS for all API calls
5. Enable webhook verification for production payments

## Troubleshooting

### Issue: "Razorpay is not defined"
- Make sure the Razorpay script is loaded in `index.html`
- Check browser console for script loading errors

### Issue: "Invalid API Key"
- Verify your Key ID is correct
- Ensure you're using test keys in test mode and live keys in production
- Check that environment variables are loaded correctly

### Issue: "Payment verification failed"
- Check that Key Secret is correctly set in backend
- Verify that payment data is sent correctly from frontend

### Issue: Backend can't find Razorpay module
- Install razorpay: `pip install razorpay`
- Check Python environment is activated

## Support

For Razorpay-specific issues, visit:
- Razorpay Documentation: https://razorpay.com/docs/
- Razorpay Support: https://razorpay.com/support/

For application-specific issues, check the backend logs and browser console.

