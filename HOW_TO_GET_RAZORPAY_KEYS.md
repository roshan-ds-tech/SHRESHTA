# How to Get Razorpay Key ID and Key Secret

## Step-by-Step Instructions

### From the Razorpay Dashboard Page You're Currently On:

1. **Key ID (Already Visible):**
   - Look at the "API keys & integration" section
   - You'll see an API key like: `rzp_live_Rnw7eHP1oCtmT0`
   - This is your **Key ID** - you can copy it directly
   - Click on the key or use the copy icon if available

2. **Key Secret (Needs to be Revealed):**
   - Look for one of these buttons/links near the API key:
     - **"Reveal Key Secret"** button
     - **"Show Key Secret"** button  
     - **"View Key Secret"** link
     - An **eye icon** or **lock icon** next to the key
   - Click on it to reveal the Key Secret
   - ⚠️ **Important:** The Key Secret is shown only ONCE when revealed
   - Copy it immediately and store it securely
   - You cannot retrieve it again if you lose it (you'll need to regenerate)

### If You Don't See the Key Secret Option:

1. **Check if you need to reveal it:**
   - Look for any clickable text/button that says "Reveal", "Show", or "View"
   - The Key Secret is intentionally hidden for security

2. **If you need to regenerate:**
   - Click the **"Regenerate Key"** button (blue button on the right)
   - ⚠️ **Warning:** This will create NEW keys and invalidate old ones
   - Only do this if you haven't started using the keys yet
   - After regenerating, you'll see both Key ID and Key Secret

### Alternative: Test Mode Keys

For development/testing, you might want Test Mode keys:

1. Look for a toggle or dropdown that says **"Test Mode"** or **"Live Mode"**
2. Switch to **Test Mode**
3. Generate/view Test Mode keys
4. Test keys start with `rzp_test_` instead of `rzp_live_`

### Quick Checklist:

- [ ] Found your Key ID (starts with `rzp_live_` or `rzp_test_`)
- [ ] Clicked "Reveal Key Secret" or similar button
- [ ] Copied both keys immediately
- [ ] Stored keys securely (will be used in environment variables)

### What to Do After Getting Keys:

1. **Backend Setup:**
   ```bash
   # Set environment variables
   export RAZORPAY_KEY_ID="rzp_live_Rnw7eHP1oCtmT0"
   export RAZORPAY_KEY_SECRET="your_secret_key_here"
   ```

2. **Frontend Setup:**
   Create `.env` file in `SHRESHTA/` directory:
   ```
   VITE_RAZORPAY_KEY_ID=rzp_live_Rnw7eHP1oCtmT0
   VITE_API_URL=http://localhost:8000
   ```

### Security Reminder:

- ✅ Key ID can be shared (used in frontend)
- ❌ Key Secret MUST be kept secret (backend only)
- ❌ Never commit Key Secret to Git
- ✅ Use environment variables for Key Secret

### Need Help?

If you can't find the "Reveal Key Secret" button:
1. Check if there's a dropdown arrow next to the API key
2. Look for a "Manage" or "Settings" button near the API key
3. Try clicking directly on the masked/asterisked key area
4. Check the Razorpay documentation: https://razorpay.com/docs/payments/dashboard/api-key-management/

