# Pi Network Authentication Test Guide

## 🎯 **Quick Test Setup**

### **1. Environment Variables**
Create a `.env` file in your project root:

```env
# Pi Network Configuration
VITE_PI_API_KEY=your_test_api_key_here
VITE_PI_APP_ID=droplink
VITE_PI_SANDBOX=true
```

### **2. Test the Authentication**
1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to the test page:**
   ```
   http://localhost:5173/pi-auth-test
   ```

3. **Use Pi Browser for testing:**
   - Open Pi Browser
   - Navigate to: `https://sandbox.minepi.com/browser/open?url=http://localhost:5173/pi-auth-test`
   - Or use the direct URL in Pi Browser: `http://localhost:5173/pi-auth-test`

## 🔧 **What's Fixed**

### **Content Security Policy (CSP)**
- ✅ Added Supabase domains to CSP
- ✅ Added Pi API domains to CSP
- ✅ Fixed connection blocking issues

### **Pi Authentication**
- ✅ Sandbox mode detection
- ✅ Mock authentication for development
- ✅ Proper error handling
- ✅ Console logging for debugging

## 🧪 **Testing Steps**

### **Step 1: Environment Check**
The test page will show:
- ✅ Environment (SANDBOX/DEVELOPMENT/PRODUCTION)
- ✅ Pi Browser detection
- ✅ Sandbox mode status
- ✅ App ID configuration

### **Step 2: Authentication Test**
1. Click "Test Pi Authentication"
2. Pi Browser will prompt for authentication
3. Grant permissions for payments and username
4. Check the result display

### **Step 3: Console Logs**
Monitor the browser console for:
- Configuration details
- Authentication process logs
- Success/error messages

## 🐛 **Troubleshooting**

### **Common Issues:**

#### **1. "Pi SDK not available"**
- **Solution:** Make sure you're using Pi Browser
- **Test:** Navigate to `https://sandbox.minepi.com/browser/open?url=http://localhost:5173/pi-auth-test`

#### **2. CSP Violations**
- **Solution:** The CSP has been updated to allow Supabase and Pi API connections
- **Check:** No more "Refused to connect" errors in console

#### **3. Authentication Fails**
- **Solution:** Ensure you're in sandbox mode
- **Check:** URL should contain `sandbox.minepi.com` or `VITE_PI_SANDBOX=true`

#### **4. No Access Token**
- **Solution:** In sandbox mode, mock tokens are generated
- **Expected:** "Access Token: Present" in success display

## 📊 **Expected Results**

### **Success Case:**
```
✅ Authentication Successful!
👤 User ID: sandbox_user_1234567890
👤 Username: sandbox_user
⚡ Access Token: Present
```

### **Console Logs:**
```
Starting Pi authentication test...
Config: { isPiBrowser: true, isSandbox: true, ... }
Pi authenticate result: { accessToken: "...", user: {...} }
Authentication result: { accessToken: "...", user: {...} }
```

## 🚀 **Production Ready**

Once testing is successful in sandbox mode:

1. **Set production environment variables:**
   ```env
   VITE_PI_SANDBOX=false
   VITE_PI_API_KEY=your_real_api_key
   VITE_PI_APP_ID=your_real_app_id
   ```

2. **Test in production Pi Browser:**
   - Use `https://minepi.com/browser/open?url=your_app_url`
   - Real authentication will be performed

3. **Monitor API calls:**
   - Real Pi API validation will occur
   - Access tokens will be validated with `/me` endpoint

## 📝 **Integration Notes**

- **Sandbox Mode:** Uses mock authentication for development
- **Production Mode:** Real Pi API validation
- **Error Handling:** Comprehensive error catching and display
- **Logging:** Detailed console logs for debugging
- **Security:** CSP properly configured for Pi Network domains

The authentication should now work properly in sandbox mode! 🎉 