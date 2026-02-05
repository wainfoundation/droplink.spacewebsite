# Droplink Dashboard - Project Structure

This document provides an overview of the project structure and organization.

## Root Directory

```
droplink-dashboard/
├── .github/                    # GitHub configuration files
│   ├── ISSUE_TEMPLATE/        # Issue templates
│   └── workflows/             # GitHub Actions workflows
├── public/                    # Static assets
├── src/                       # Source code
├── supabase/                  # Supabase configuration
├── dist/                      # Build output
├── node_modules/              # Dependencies
└── Documentation files        # Various .md files
```

## Source Code Structure (`src/`)

```
src/
├── components/                # React components
│   ├── ui/                   # Reusable UI components (shadcn/ui)
│   ├── auth/                 # Authentication components
│   ├── dashboard/            # Dashboard-specific components
│   ├── forms/                # Form components
│   ├── layout/               # Layout components
│   └── modals/               # Modal components
├── pages/                    # Page components
│   ├── auth/                 # Authentication pages
│   ├── dashboard/            # Dashboard pages
│   ├── profile/              # Profile pages
│   └── public/               # Public pages
├── hooks/                    # Custom React hooks
├── context/                  # React context providers
├── services/                 # API services
├── utils/                    # Utility functions
├── lib/                      # Library configurations
├── config/                   # Configuration files
├── data/                     # Static data
├── integrations/             # Third-party integrations
│   └── supabase/            # Supabase integration
├── store/                    # State management (Zustand)
└── App.tsx                   # Main application component
```

## Key Directories Explained

### Components (`src/components/`)
- **ui/**: Reusable UI components built with shadcn/ui
- **auth/**: Authentication-related components
- **dashboard/**: Dashboard-specific components
- **forms/**: Form components and validation
- **layout/**: Layout and navigation components
- **modals/**: Modal and dialog components

### Pages (`src/pages/`)
- **auth/**: Login, registration, and authentication pages
- **dashboard/**: Main dashboard and management pages
- **profile/**: User profile and settings pages
- **public/**: Public-facing pages (link pages, etc.)

### Services (`src/services/`)
- API service functions
- Pi Network integration services
- Supabase database services
- External API integrations

### Hooks (`src/hooks/`)
- Custom React hooks for common functionality
- Pi Network integration hooks
- Form handling hooks
- Data fetching hooks

### Context (`src/context/`)
- React context providers for global state
- User context for authentication
- Profile context for user data

### Store (`src/store/`)
- Zustand state management
- Authentication store
- User preferences store

## Configuration Files

### Environment Files
- `env.development`: Development environment variables
- `env.production`: Production environment variables

### Build Configuration
- `vite.config.ts`: Vite build configuration
- `tailwind.config.ts`: Tailwind CSS configuration
- `tsconfig.json`: TypeScript configuration
- `eslint.config.js`: ESLint configuration

### Deployment
- `vercel.json`: Vercel deployment configuration
- `deploy-backend.sh`: Backend deployment script

## Supabase Integration

```
supabase/
├── config.toml              # Supabase configuration
├── functions/               # Edge functions
└── migrations/              # Database migrations
```

## Documentation

The project includes extensive documentation:
- `README.md`: Main project documentation
- `CONTRIBUTING.md`: Contribution guidelines
- `DEPLOYMENT_GUIDE.md`: Deployment instructions
- `ENVIRONMENT_SETUP.md`: Environment setup guide
- Various feature-specific documentation files

## Pi Network Integration

The project has comprehensive Pi Network integration:
- Authentication through Pi Browser
- Payment processing
- Sandbox and mainnet support
- Profile integration

## Development Workflow

1. **Setup**: Follow the environment setup guide
2. **Development**: Use `npm run dev` for local development
3. **Testing**: Test in Pi Browser for Pi Network features
4. **Building**: Use `npm run build` for production builds
5. **Deployment**: Follow the deployment guide

## Key Technologies

- **Frontend**: React 18, TypeScript, Vite
- **UI**: Tailwind CSS, shadcn/ui, Radix UI
- **State Management**: Zustand
- **Backend**: Supabase
- **Authentication**: Pi Network SDK
- **Deployment**: Vercel
- **CI/CD**: GitHub Actions
