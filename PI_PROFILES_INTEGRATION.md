# 🔗 Pi Network Profiles Integration

This document describes the integration with `profiles.pinet.com` for importing user profile data into Droplink.

## 📋 Overview

The Pi Network Profiles integration allows users to:
- Import their profile data from the official Pi Network profiles service
- Automatically populate their Droplink profile with bio, avatar, and social links
- Search and discover other Pi Network users
- Seamlessly connect their Pi Network identity with Droplink

## 🏗️ Architecture

### Components

1. **`src/services/piProfileService.ts`** - Core service for API interactions
2. **`src/components/PiProfileImport.tsx`** - React component for profile import UI
3. **`src/hooks/usePiProfileImport.ts`** - Custom hook for state management
4. **`src/pages/PiProfileImport.tsx`** - Full page for profile import workflow

### API Endpoints

- **Profile Fetch**: `https://profiles.pinet.com/api/v1/profiles/{username}`
- **Profile Search**: `https://profiles.pinet.com/api/v1/profiles/search?q={query}`

## 🚀 Features

### Profile Import
- Fetch user profiles by username
- Import display name, bio, and avatar
- Convert social links to Droplink format
- Handle verification badges and follower counts

### Profile Search
- Search for profiles by name or username
- Display search results with profile previews
- Allow selection from search results

### Data Transformation
- Convert Pi Network profile format to Droplink format
- Map social media links to appropriate icons
- Handle missing or optional fields gracefully

## 📊 Data Structure

### Pi Network Profile Interface
```typescript
interface PiNetworkProfile {
  uid: string;
  username: string;
  displayName?: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    youtube?: string;
    tiktok?: string;
    linkedin?: string;
  };
  badges?: string[];
  followers?: number;
  following?: number;
  verified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
```

### Droplink Profile Format
```typescript
{
  displayName: string;
  bio: string;
  avatar: string;
  links: Array<{
    title: string;
    url: string;
    icon: string;
    active: boolean;
  }>;
  theme: string;
  customDomain: string;
  analytics: {
    views: number;
    clicks: number;
  };
}
```

## 🔧 Usage

### Basic Profile Import
```typescript
import { fetchPiNetworkProfile } from '@/services/piProfileService';

const result = await fetchPiNetworkProfile('username');
if (result.success) {
  const droplinkProfile = importPiProfileToDroplink(result.profile);
  // Use the imported profile data
}
```

### Using the React Component
```typescript
import PiProfileImport from '@/components/PiProfileImport';

<PiProfileImport 
  onProfileImport={(profileData) => {
    // Handle imported profile data
  }}
  onCancel={() => {
    // Handle cancellation
  }}
/>
```

### Using the Custom Hook
```typescript
import { usePiProfileImport } from '@/hooks/usePiProfileImport';

const {
  isLoading,
  profile,
  searchResults,
  error,
  searchProfile,
  importProfile
} = usePiProfileImport();

// Search for a profile
await searchProfile('username');

// Import the profile
const droplinkProfile = importProfile(profile);
```

## 🛣️ Routes

- **`/pi-profile-import`** - Main profile import page
- **`/pi-profile-import?username={username}`** - Pre-populated with username

## 🔒 Security & Validation

### Username Validation
- Pi Network usernames must be 3-20 characters
- Only alphanumeric characters and underscores allowed
- Regex pattern: `/^[a-zA-Z0-9_]{3,20}$/`

### Error Handling
- Network errors with user-friendly messages
- Profile not found scenarios
- Invalid username format validation
- Rate limiting considerations

## 🎨 UI/UX Features

### Loading States
- Search loading indicators
- Profile fetch loading states
- Import progress feedback

### Error States
- Clear error messages
- Retry functionality
- Fallback options

### Success States
- Profile preview before import
- Import confirmation
- Success feedback with imported data summary

## 🔄 Integration Points

### Onboarding Flow
- Option to import Pi Network profile during signup
- Seamless transition from import to profile creation

### Dashboard Integration
- Import option in profile settings
- Quick import from dashboard

### Profile Management
- Update imported data
- Sync with Pi Network profile changes
- Manual override capabilities

## 📱 Mobile Responsiveness

- Responsive design for all screen sizes
- Touch-friendly interface
- Optimized for mobile browsers

## 🔧 Configuration

### Environment Variables
```env
# Optional: Custom API endpoints
VITE_PI_PROFILES_API_URL=https://profiles.pinet.com/api/v1
```

### API Rate Limiting
- Implement appropriate delays between requests
- Handle rate limit responses gracefully
- Cache successful responses when possible

## 🧪 Testing

### Unit Tests
- Service function testing
- Hook testing
- Component testing

### Integration Tests
- API endpoint testing
- End-to-end workflow testing
- Error scenario testing

## 🚀 Future Enhancements

### Planned Features
- [ ] Real-time profile sync
- [ ] Batch profile import
- [ ] Profile comparison tools
- [ ] Advanced search filters
- [ ] Profile analytics integration

### API Improvements
- [ ] Caching layer
- [ ] Offline support
- [ ] Background sync
- [ ] Push notifications for profile updates

## 📚 Resources

- [Pi Network Profiles API Documentation](https://profiles.pinet.com)
- [Pi Network Developer Documentation](https://developers.minepi.com)
- [Droplink API Documentation](./API_DOCUMENTATION.md)

## 🤝 Contributing

When contributing to the Pi Network profiles integration:

1. Follow the existing code patterns
2. Add appropriate error handling
3. Include unit tests for new functionality
4. Update this documentation
5. Test on both development and production environments

## 📄 License

This integration follows the same license as the main Droplink project.
