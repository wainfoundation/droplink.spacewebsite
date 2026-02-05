# Contributing to Droplink Dashboard

Thank you for your interest in contributing to Droplink Dashboard! This document provides guidelines and information for contributors.

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Create a new branch for your feature/fix
4. Make your changes
5. Test your changes thoroughly
6. Submit a pull request

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/droplink-dashboard.git

# Navigate to the project directory
cd droplink-dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

## Code Style Guidelines

- Use TypeScript for all new code
- Follow the existing code style and formatting
- Use meaningful variable and function names
- Add comments for complex logic
- Write tests for new features

## Pi Network Integration

When working with Pi Network features:

1. Ensure you have Pi Browser installed for testing
2. Use the sandbox environment for development
3. Test authentication flows thoroughly
4. Verify payment integrations work correctly

## Environment Variables

Create a `.env` file with the following variables:

```env
VITE_PI_API_KEY=your_pi_api_key
VITE_PI_SANDBOX=true
```

## Testing

Before submitting a pull request:

1. Run the linter: `npm run lint`
2. Build the project: `npm run build`
3. Test all Pi Network integrations
4. Verify the application works in both development and production modes

## Pull Request Guidelines

- Provide a clear description of your changes
- Include screenshots for UI changes
- Reference any related issues
- Ensure all tests pass
- Update documentation if necessary

## Questions or Issues?

If you have questions or encounter issues:

1. Check the existing documentation
2. Search existing issues
3. Create a new issue with detailed information
4. Contact the maintainers at mrwainorganization@gmail.com

Thank you for contributing to Droplink Dashboard!
