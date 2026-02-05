# 🚀 Droplink Backend Setup Guide

Complete backend implementation for Droplink using Supabase.

---

## 📋 Table of Contents

1. [Database Schema](#database-schema)
2. [Edge Functions](#edge-functions)
3. [Authentication](#authentication)
4. [API Endpoints](#api-endpoints)
5. [Deployment](#deployment)
6. [Environment Variables](#environment-variables)

---

## 🗄️ Database Schema

### Core Tables

#### `user_profiles`
- **Purpose**: Store user profile information
- **Key Fields**: `id`, `username`, `display_name`, `bio`, `avatar_url`, `plan`, `intent`
- **Relationships**: One-to-many with `links`, `subscriptions`, `analytics`

#### `links`
- **Purpose**: Store user's social media and website links
- **Key Fields**: `id`, `user_id`, `title`, `url`, `icon`, `position`, `clicks`
- **Features**: Position ordering, click tracking, active/inactive status

#### `subscriptions`
- **Purpose**: Track user subscription plans and payments
- **Key Fields**: `user_id`, `plan`, `amount`, `payment_id`, `expires_at`
- **Plans**: `free`, `basic`, `pro`, `premium`

#### `analytics`
- **Purpose**: Track page views and link clicks
- **Key Fields**: `user_id`, `link_id`, `page_view`, `link_click`, `ip_address`
- **Privacy**: IP addresses for unique visitor tracking

#### `user_features`
- **Purpose**: Feature flags based on user plan
- **Key Fields**: `max_links`, `can_schedule`, `can_sell`, `can_use_analytics`
- **Auto-updated**: When user plan changes

### Supporting Tables

- **`user_metadata`**: SEO and social media metadata
- **`user_platforms`**: User's social media platforms
- **`products`**: Digital products for sale
- **`orders`**: Purchase transactions
- **`tips`**: Pi Network tipping system
- **`admin_users`**: Admin user management
- **`newsletter_subscribers`**: Email marketing
- **`career_applications`**: Job applications

---

## ⚡ Edge Functions

### Authentication & User Management

#### `check-admin`
- **Purpose**: Verify if user is admin
- **Input**: `{ piUserId, username }`
- **Output**: `{ isAdmin, adminData }`

#### `user-management`
- **Purpose**: CRUD operations for user profiles
- **Actions**:
  - `create_profile`: Create new user profile
  - `update_profile`: Update existing profile
  - `get_profile`: Retrieve user profile
  - `add_links`: Add multiple links
  - `update_plan`: Change user subscription plan

### Payments & Subscriptions

#### `pi-payment`
- **Purpose**: Process Pi Network payments
- **Input**: `{ amount, user_id, plan }`
- **Output**: `{ payment_id, status }`

#### `complete-payment`
- **Purpose**: Complete payment and activate subscription
- **Input**: `{ payment_id, user_id }`
- **Output**: `{ success, subscription }`

#### `process-subscription`
- **Purpose**: Handle subscription lifecycle
- **Actions**: Create, renew, cancel subscriptions

#### `cancel-subscription`
- **Purpose**: Cancel active subscription
- **Input**: `{ user_id, subscription_id }`

### Analytics & Tracking

#### `analytics`
- **Purpose**: Track and retrieve analytics data
- **Actions**:
  - `track_page_view`: Record page visit
  - `track_link_click`: Record link click
  - `get_analytics`: Retrieve user analytics
  - `get_link_analytics`: Get specific link stats

### Pi Network Integration

#### `import-pi-profile`
- **Purpose**: Import user's Pi Network profile
- **Input**: `{ pi_username, user_id }`
- **Output**: `{ imported_data, status }`

#### `verify-pi-domain`
- **Purpose**: Verify Pi Network domain ownership
- **Input**: `{ domain, user_id }`
- **Output**: `{ verified, domain }`

#### `pinet-meta`
- **Purpose**: Fetch Pi Network metadata
- **Input**: `{ pi_username }`
- **Output**: `{ profile_data, links }`

### Digital Products

#### `process-product-order`
- **Purpose**: Handle digital product purchases
- **Input**: `{ product_id, user_id, payment_id }`
- **Output**: `{ download_url, status }`

#### `secure-download`
- **Purpose**: Secure file downloads
- **Input**: `{ product_id, user_id }`
- **Output**: `{ download_url, expires_at }`

### Tipping System

#### `record-tip`
- **Purpose**: Record Pi Network tips
- **Input**: `{ from_user_id, to_user_id, amount, message }`
- **Output**: `{ tip_id, status }`

---

## 🔐 Authentication

### Pi Network Integration

```typescript
// Pi Network authentication flow
const piAuth = {
  // Initialize Pi SDK
  init: () => {
    Pi.init({ version: '2.0' });
  },
  
  // Authenticate user
  authenticate: async () => {
    const auth = await Pi.authenticate(['payments'], onIncompletePaymentFound);
    return auth;
  },
  
  // Create payment
  createPayment: async (amount: number, memo: string) => {
    const payment = await Pi.createPayment({
      amount: amount,
      memo: memo,
      metadata: { productId: 'subscription' }
    });
    return payment;
  }
};
```

### Supabase Auth Integration

```typescript
// User session management
const authService = {
  // Get current session
  getSession: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },
  
  // Sign out
  signOut: async () => {
    await supabase.auth.signOut();
  },
  
  // Listen to auth changes
  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback);
  }
};
```

---

## 🌐 API Endpoints

### User Management

```typescript
// Create user profile
POST /functions/v1/user-management
{
  "action": "create_profile",
  "userId": "uuid",
  "profileData": {
    "username": "john_doe",
    "display_name": "John Doe",
    "bio": "Creator and entrepreneur",
    "intent": "creator",
    "plan": "basic"
  }
}

// Update profile
POST /functions/v1/user-management
{
  "action": "update_profile",
  "userId": "uuid",
  "profileData": {
    "display_name": "John Doe Updated",
    "bio": "Updated bio"
  }
}
```

### Analytics

```typescript
// Track page view
POST /functions/v1/analytics
{
  "action": "track_page_view",
  "userId": "uuid",
  "analyticsData": {
    "referrer": "https://google.com",
    "user_agent": "Mozilla/5.0...",
    "ip_address": "192.168.1.1"
  }
}

// Get analytics
POST /functions/v1/analytics
{
  "action": "get_analytics",
  "userId": "uuid"
}
```

### Payments

```typescript
// Process Pi payment
POST /functions/v1/pi-payment
{
  "amount": 10.5,
  "user_id": "uuid",
  "plan": "pro",
  "memo": "Pro subscription"
}

// Complete payment
POST /functions/v1/complete-payment
{
  "payment_id": "pi_payment_id",
  "user_id": "uuid"
}
```

---

## 🚀 Deployment

### 1. Supabase Project Setup

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Initialize project
supabase init

# Link to your project
supabase link --project-ref pgkfqzdapxfnsmharqzv
```

### 2. Database Migration

```bash
# Apply database schema
supabase db push

# Or run migration manually
psql -h pgkfqzdapxfnsmharqzv.supabase.co -U postgres -d postgres -f supabase/migrations/001_initial_schema.sql
```

### 3. Deploy Edge Functions

```bash
# Deploy all functions
supabase functions deploy

# Deploy specific function
supabase functions deploy user-management
supabase functions deploy analytics
supabase functions deploy pi-payment
```

### 4. Environment Variables

Set these in your Supabase project dashboard:

```env
# Supabase
SUPABASE_URL=https://pgkfqzdapxfnsmharqzv.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Pi Network
PI_API_KEY=your_pi_api_key
PI_APP_ID=droplink
PI_SANDBOX=true

# Optional: Analytics
GOOGLE_ANALYTICS_ID=your_ga_id
```

---

## 🔧 Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `SUPABASE_URL` | Your Supabase project URL | `https://pgkfqzdapxfnsmharqzv.supabase.co` |
| `SUPABASE_ANON_KEY` | Public anon key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key for functions | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

### Pi Network Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PI_API_KEY` | Pi Network API key | `your_pi_api_key` |
| `PI_APP_ID` | Your Pi app identifier | `droplink` |
| `PI_SANDBOX` | Use sandbox mode | `true` |

### Optional Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `GOOGLE_ANALYTICS_ID` | Google Analytics ID | `G-XXXXXXXXXX` |
| `SENTRY_DSN` | Sentry error tracking | `https://...` |

---

## 📊 Database Functions

### Built-in Functions

```sql
-- Update user plan and features
SELECT update_user_plan('user_uuid', 'pro');

-- Check if user owns sticker
SELECT user_owns_sticker('user_uuid', 'sticker_id');

-- Update user domain
SELECT update_user_domain('user_uuid', 'pi_domain', 'john.pi');

-- Update Pi domain specifically
SELECT update_user_pi_domain('user_uuid', 'john.pi');
```

---

## 🔒 Security

### Row Level Security (RLS)

All tables have RLS enabled with appropriate policies:

- **Public Read Access**: User profiles and active links
- **User Management**: Users can only manage their own data
- **Admin Access**: Admin users have elevated permissions

### API Security

- **CORS**: Configured for web app access
- **Rate Limiting**: Implemented on edge functions
- **Input Validation**: All inputs validated
- **Error Handling**: Comprehensive error handling

---

## 📈 Monitoring

### Analytics Dashboard

Track key metrics:
- **Page Views**: Total profile visits
- **Link Clicks**: Individual link performance
- **Unique Visitors**: IP-based visitor tracking
- **Top Links**: Best performing links
- **Conversion Rates**: Click-through rates

### Error Monitoring

- **Function Logs**: Supabase function logs
- **Database Logs**: Query performance
- **Client Errors**: Frontend error tracking

---

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd drop-link-v2-18-2
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

3. **Deploy database schema**
   ```bash
   supabase db push
   ```

4. **Deploy edge functions**
   ```bash
   supabase functions deploy
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

---

## 📞 Support

For backend issues:
- Check Supabase logs in dashboard
- Review function logs in CLI
- Test endpoints with Postman/curl
- Check database queries in SQL editor

---

## 🔄 Updates

To update the backend:

1. **Database changes**: Create new migration
2. **Function updates**: Deploy specific functions
3. **Schema changes**: Run `supabase db push`
4. **Environment variables**: Update in dashboard

---

**🎉 Your Droplink backend is now complete and ready for production!** 