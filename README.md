<a href="https://ibb.co/xtNN9QTK"><img src="https://i.ibb.co/MxmmwL0y/Untitled-design-8.png" alt="Untitled-design-8" border="0"></a>

# Droplink - Pi Network Application

## Overview

Droplink is a comprehensive link-in-bio platform built for the Pi Network ecosystem. It allows users to create beautiful, customizable profile pages with multiple links that can be shared through a single URL, making it perfect for Pi Network pioneers who want to share their content, products, or services.

## Features

- **Multiple Links**: Add unlimited links to your profile
- **Pi Network Integration**: Native Pi authentication and payment support
- **Link Analytics**: Track clicks and visitor data
- **Custom Themes**: Personalize your profile with custom themes and styles
- **Subscription Plans**: Free, Starter, Pro, and Premium tiers with increasing capabilities
- **Pi Payments**: Accept Pi payments for products and services
- **Profile QR Code**: Generate QR codes for offline traffic

## Pi Network Integration

This application features full Pi Network integration:

### Authentication

Users can authenticate with Pi Network using the Pi Browser. The authentication flow is handled by the Pi SDK and allows users to authenticate with their Pi Network accounts.

### Payments

The application supports Pi payments for subscriptions and products. The payment flow is integrated with the Pi SDK and allows users to make payments using Pi cryptocurrency.

## Getting Started

### Prerequisites

- Node.js & npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- Pi Browser (for testing Pi Network features)
- Git

### Repository Structure

This project follows a comprehensive structure with:
- **Source Code**: Located in `src/` directory
- **Components**: Reusable UI components in `src/components/`
- **Pages**: Application pages in `src/pages/`
- **Services**: API and integration services in `src/services/`
- **Documentation**: Extensive documentation files in the root directory
- **GitHub Integration**: Issue templates, PR templates, and CI/CD workflows

### Local Development

```sh
# Step 1: Clone the repository
git clone https://github.com/ReimagineTruth/droplink-dashboard.git

# Step 2: Navigate to the project directory
cd droplink-dashboard

# Step 3: Install the necessary dependencies
npm install

# Step 4: Start the development server
npm run dev

### Quick Setup (Alternative)

For a faster setup, you can use our setup scripts:

**On macOS/Linux:**
```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

**On Windows:**
```cmd
scripts\setup.bat
```

These scripts will automatically:
- Check for required dependencies
- Install npm packages
- Create environment files
- Run linting and build checks
- Provide next steps guidance
```

### Pi Network SDK Integration

The application uses the Pi Network SDK for authentication and payments. Key integration points:

1. **SDK Initialization**: The Pi SDK is initialized in the application with proper sandbox/production mode detection.
2. **Authentication**: Users can sign in using their Pi Network accounts.
3. **Payments**: The application supports Pi payments for subscriptions and features.

### Environment Variables

Create a `.env` file with the following variables:

```
VITE_PI_API_KEY=your_pi_api_key
VITE_PI_SANDBOX=true  # Set to false for production
```

## Deployment

1. Build the project:
```sh
npm run build
```

2. Deploy using your preferred hosting service or directly through Lovable by clicking on Share -> Publish.

## License

This project is licensed under the PiOS License - see the LICENSE file for details.

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on how to:

- Set up your development environment
- Submit bug reports and feature requests
- Contribute code changes
- Test Pi Network integrations

## Support

For support or questions, contact us at mrwainorganization@gmail.com

## Project Structure

For a detailed overview of the project structure, see [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md).
