# 🔧 Mock Authentication Setup

Your Droplink application now uses **mock authentication** for development and testing.

---

## ✅ What's Working

### **Mock Sign In/Sign Up**
- ✅ Any email/password combination works
- ✅ No actual Supabase authentication required
- ✅ User sessions stored in localStorage
- ✅ Profile data persisted locally

### **Mock User Features**
- ✅ User profiles with customizable data
- ✅ Plan upgrades (Free → Basic → Pro → Premium)
- ✅ Subscription management
- ✅ Profile updates
- ✅ Sign out functionality

### **Visual Indicators**
- ✅ "Mock Auth" badge appears when mock mode is active
- ✅ Toast notifications for all auth actions
- ✅ Console logs for debugging

---

## 🚀 How to Test

### **1. Sign Up (Any Email/Password)**
```
Email: test@example.com
Password: password123
Username: testuser
First Name: Test
Last Name: User
```

### **2. Sign In (Any Credentials)**
```
Email: any@email.com
Password: anypassword
```

### **3. Dashboard Access**
- After signup/signin, you'll be redirected to `/dashboard`
- Your mock profile will be loaded automatically
- All dashboard features work with mock data

---

## 🔧 Mock Data Storage

### **LocalStorage Keys**
```javascript
// Mock session
localStorage.getItem('mockSession')
// Contains: { user: {...}, access_token: "...", refresh_token: "..." }

// Mock profile
localStorage.getItem('mockProfile')
// Contains: { id: "...", username: "...", display_name: "...", plan: "free", ... }
```

### **Mock User Structure**
```javascript
{
  id: "mock_user_1234567890",
  email: "test@example.com",
  created_at: "2025-01-XX...",
  user_metadata: {
    username: "test",
    first_name: "Test",
    last_name: "User",
    display_name: "Test User",
    marketing_consent: true
  }
}
```

### **Mock Profile Structure**
```javascript
{
  id: "mock_user_1234567890",
  username: "testuser",
  display_name: "Test User",
  bio: "",
  avatar_url: null,
  intent: "personal",
  plan: "free",
  consent_updates: true,
  created_at: "2025-01-XX...",
  updated_at: "2025-01-XX..."
}
```

---

## 🎯 Testing Scenarios

### **1. New User Signup**
1. Go to `/signup`
2. Fill in any form data
3. Click "Create Account"
4. Should redirect to dashboard with mock profile

### **2. Existing User Login**
1. Go to `/login`
2. Enter any email/password
3. Click "Sign In"
4. Should redirect to dashboard

### **3. Plan Upgrades**
1. Go to dashboard
2. Try upgrading plans (Free → Basic → Pro → Premium)
3. Check that ads disappear for paid plans

### **4. Profile Updates**
1. Go to dashboard
2. Update profile information
3. Changes should persist in localStorage

### **5. Sign Out**
1. Click sign out
2. Should clear localStorage and redirect to home

---

## 🔄 Switching to Real Auth

When you're ready to use real Supabase authentication:

### **1. Update useEmailAuth.ts**
```typescript
// Replace mock functions with real Supabase calls
const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  // ... real implementation
};
```

### **2. Update UserContext.tsx**
```typescript
// Remove mock session checks
// Use real Supabase session management
```

### **3. Deploy Backend**
```bash
# Deploy database schema
supabase db push

# Deploy edge functions
supabase functions deploy
```

---

## 🐛 Troubleshooting

### **Mock Auth Not Working**
- Check browser console for errors
- Clear localStorage: `localStorage.clear()`
- Refresh page and try again

### **Profile Not Loading**
- Check if `mockProfile` exists in localStorage
- Try signing out and back in
- Check browser console for errors

### **Dashboard Not Accessible**
- Ensure you're signed in (check for "Mock Auth" badge)
- Try going to `/login` and signing in again
- Check if user state is properly set

---

## 📝 Development Notes

### **Benefits of Mock Auth**
- ✅ No backend setup required
- ✅ Fast development and testing
- ✅ No API rate limits
- ✅ Predictable behavior
- ✅ Easy to debug

### **Limitations**
- ❌ Data doesn't persist across browsers
- ❌ No real user management
- ❌ No actual payments
- ❌ No real analytics
- ❌ No Pi Network integration

---

## 🎉 Ready to Test!

Your signup workflow should now work perfectly with mock authentication. Try creating an account and exploring the dashboard!

**The "Mock Auth" badge will appear in the top-right corner when mock mode is active.** 