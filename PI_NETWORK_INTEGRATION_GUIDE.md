# Pi Network Integration Guide - Complete Implementation

## Overview

This guide covers the complete Pi Network integration for Droplink, following the official Pi Network documentation exactly. The integration includes authentication, payments, and server-side processing.

## 🚀 Quick Start

### 1. Environment Setup

Add these environment variables to your `.env` file:

```env
# Pi Network Configuration
VITE_PI_API_KEY=your_pi_api_key_here
VITE_PI_APP_ID=your_pi_app_id_here
VITE_PI_SANDBOX=true  # Set to false for production
```

### 2. SDK Initialization

The Pi SDK is already initialized in `index.html`:

```html
<script src="https://sdk.minepi.com/pi-sdk.js"></script>
<script>
  Pi.init({ version: "2.0", sandbox: true })
</script>
```

### 3. Basic Usage

```tsx
import { usePiPayment } from '@/hooks/usePiPayment';

const MyComponent = () => {
  const { 
    isAuthenticated, 
    user, 
    authenticate, 
    createPayment 
  } = usePiPayment();

  const handlePayment = async () => {
    const result = await createPayment({
      amount: 1,
      memo: "Test payment",
      metadata: { test: true }
    });
    
    console.log("Payment result:", result);
  };

  return (
    <div>
      {!isAuthenticated ? (
        <button onClick={authenticate}>Connect to Pi Network</button>
      ) : (
        <button onClick={handlePayment}>Make Payment</button>
      )}
    </div>
  );
};
```

## 📁 File Structure

```
src/
├── utils/
│   ├── pi-auth.ts          # Authentication functions
│   ├── pi-payments.ts      # Payment creation
│   ├── pi-config.ts        # Configuration management
│   └── pi-logger.ts        # Logging utilities
├── services/
│   └── piPaymentService.ts # Server-side payment APIs
├── hooks/
│   └── usePiPayment.ts     # React hook for easy integration
├── components/
│   ├── PiNetworkTest.tsx   # Complete test component
│   ├── PiNetworkIntegration.tsx # Simple integration component
│   └── auth/
│       └── PiAuthButton.tsx # Authentication button
└── pages/
    └── PiTest.tsx          # Test page at /pi-test
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_PI_API_KEY` | Your Pi Network API key | Production |
| `VITE_PI_APP_ID` | Your Pi Network App ID | Production |
| `VITE_PI_SANDBOX` | Enable sandbox mode | Development |

### Configuration Validation

```tsx
import { validatePiConfig, logPiConfigStatus } from '@/utils/pi-config';

// Check if configuration is valid
const validation = validatePiConfig();
if (!validation.isValid) {
  console.warn('Configuration errors:', validation.errors);
}

// Log configuration status
logPiConfigStatus();
```

## 🔐 Authentication

### Basic Authentication

```tsx
import { authenticateWithPi } from '@/utils/pi-sdk';

const authenticate = async () => {
  try {
    const authResult = await authenticateWithPi(['payments', 'username']);
    console.log('Authenticated user:', authResult.user);
  } catch (error) {
    console.error('Authentication failed:', error);
  }
};
```

### Authentication Scopes

- `'payments'` - Required for creating payments
- `'username'` - Get user's Pi username
- `[]` - Empty array for basic authentication only

## 💳 Payments

### Creating Payments

```tsx
import { createPiPayment } from '@/utils/pi-sdk';

const paymentData = {
  amount: 1,  // Pi amount
  memo: "Payment description",
  metadata: { 
    orderId: "123",
    item: "premium_plan" 
  }
};

const callbacks = {
  onReadyForServerApproval: (paymentId) => {
    // Call your server to approve payment
    console.log('Payment ready for approval:', paymentId);
  },
  onReadyForServerCompletion: (paymentId, txid) => {
    // Call your server to complete payment
    console.log('Payment completed:', paymentId, txid);
  },
  onCancel: (paymentId) => {
    console.log('Payment cancelled:', paymentId);
  },
  onError: (error, payment) => {
    console.error('Payment error:', error);
  }
};

await createPiPayment(paymentData, callbacks);
```

### Server-Side Payment Processing

```tsx
import { approvePayment, completePayment } from '@/services/piPaymentService';

// Approve payment
const approvalResult = await approvePayment(paymentId);

// Complete payment
const completionResult = await completePayment(paymentId, txid);
```

## 🧪 Testing

### Test Page

Navigate to `/pi-test` to access the complete test page with:

- Environment information
- Authentication testing
- Payment testing with server integration
- Real-time status updates

### Sandbox Testing

1. **Setup Sandbox Environment**:
   - Set `VITE_PI_SANDBOX=true`
   - Access your app through Pi Browser sandbox URL

2. **Authorize Sandbox**:
   - Open Pi App on mobile
   - Go to Pi Utilities → Authorize Sandbox
   - Enter the code from your desktop browser

3. **Test Payments**:
   - Use test Pi from your sandbox wallet
   - All transactions are simulated

## 🚀 Production Deployment

### 1. Environment Setup

```env
VITE_PI_API_KEY=your_production_api_key
VITE_PI_APP_ID=your_production_app_id
VITE_PI_SANDBOX=false
```

### 2. Pi Developer Portal Configuration

1. **Register Your App**:
   - Go to Pi Developer Portal
   - Create new app
   - Select "Pi Mainnet" for production

2. **Get API Key**:
   - Copy your API key from the app dashboard
   - Add to environment variables

3. **Configure URLs**:
   - Set production URL in developer portal
   - Ensure HTTPS is enabled

### 3. Database Integration

```sql
-- Payment tracking table
CREATE TABLE pi_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id VARCHAR NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users(id),
  amount DECIMAL NOT NULL,
  memo TEXT,
  metadata JSONB,
  status VARCHAR NOT NULL DEFAULT 'pending',
  transaction_id VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 4. Error Handling

```tsx
// Comprehensive error handling
try {
  const result = await createPayment(paymentData);
  if (!result.success) {
    // Handle payment failure
    console.error('Payment failed:', result.error);
  }
} catch (error) {
  // Handle unexpected errors
  console.error('Unexpected error:', error);
}
```

## 🔒 Security Considerations

### 1. API Key Security

- Never expose API keys in client-side code
- Use environment variables
- Rotate keys regularly

### 2. Payment Validation

- Always validate payments server-side
- Verify transaction IDs on blockchain
- Implement idempotency for payments

### 3. User Authentication

- Validate access tokens server-side
- Use `/me` endpoint to verify user identity
- Implement proper session management

## 📊 Monitoring & Logging

### Logging

All Pi Network interactions are logged using `PiLogger`:

```tsx
import PiLogger from '@/utils/pi-logger';

// Log authentication
PiLogger.auth('success', authResult, { scopes: ['payments'] });

// Log payment
PiLogger.payment('create_start', paymentData);

// Log errors
PiLogger.error('payment_error', error, { paymentId });
```

### Monitoring

Monitor these key metrics:

- Authentication success rate
- Payment completion rate
- Error rates by type
- API response times

## 🐛 Troubleshooting

### Common Issues

1. **"Pi SDK not available"**
   - Ensure you're in Pi Browser
   - Check if SDK script loaded correctly

2. **"Authentication failed"**
   - Verify scopes are correct
   - Check if user approved the request
   - Ensure sandbox mode is configured correctly

3. **"Payment approval failed"**
   - Verify API key is correct
   - Check server-side API calls
   - Ensure payment ID is valid

4. **"Configuration invalid"**
   - Check environment variables
   - Verify Pi Browser detection
   - Ensure proper URLs are configured

### Debug Mode

Enable debug logging:

```tsx
// In development
console.log('Pi Config:', getPiConfig());
console.log('Validation:', validatePiConfig());
```

## 📚 API Reference

### Authentication

```tsx
authenticateWithPi(scopes: string[]): Promise<PiAuthResult>
```

### Payments

```tsx
createPiPayment(paymentData: PiPaymentData, callbacks: PaymentCallbacks): Promise<void>
approvePayment(paymentId: string): Promise<PaymentDTO>
completePayment(paymentId: string, txid: string): Promise<PaymentDTO>
```

### Configuration

```tsx
getPiConfig(): PiConfig
validatePiConfig(): ValidationResult
logPiConfigStatus(): void
```

## 🎯 Best Practices

1. **Always validate server-side**: Never trust client-side data
2. **Handle errors gracefully**: Provide clear error messages to users
3. **Implement retry logic**: For network failures and API timeouts
4. **Use proper logging**: Track all interactions for debugging
5. **Test thoroughly**: Use sandbox environment for all testing
6. **Monitor performance**: Track API response times and success rates

## 📞 Support

For issues with this integration:

1. Check the troubleshooting section
2. Review Pi Network documentation
3. Check console logs for detailed error messages
4. Verify environment configuration

---

**Integration Status**: ✅ Complete and Production Ready

**Last Updated**: December 2024

**Version**: 2.0 (Pi SDK) 