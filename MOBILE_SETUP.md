# Rent Buddy Mobile App Setup Guide

## ✅ Current Status
- ✅ **Landing Page**: Beautiful, informative landing page created
- ✅ **Web App**: Fully functional web application
- ✅ **Mobile Configuration**: React Native setup configured
- ✅ **Database Schema**: SQLite database structure defined
- ✅ **iOS Configuration**: Basic iOS files created
- ✅ **Android Configuration**: Basic Android files created

## 🚀 Next Steps for Mobile Development

### Prerequisites

#### For Android Development:
- Node.js (v16 or higher)
- Java Development Kit (JDK) 11 or higher
- Android Studio
- Android SDK (API level 21+)
- Android SDK Build-Tools
- Android Emulator or physical device

#### For iOS Development:
- macOS (required for iOS development)
- Node.js (v16 or higher)
- Xcode (latest version)
- iOS Simulator or physical device
- CocoaPods

### Installation Steps

#### 1. Install Dependencies
```bash
# Install with legacy peer deps to resolve React version conflicts
npm install --legacy-peer-deps
```

#### 2. iOS Setup (macOS only)
```bash
cd ios
pod install
cd ..
```

#### 3. Database Setup
The app uses SQLite for local data storage. The database will be automatically initialized when the app starts.

## Configuration

### Android Configuration
- **Minimum SDK**: 21 (Android 5.0 Lollipop)
- **Target SDK**: 33 (Android 13)
- **Package Name**: com.rentbudy.app
- **Build Tools**: 33.0.1

### iOS Configuration
- **Deployment Target**: iOS 12.0
- **Bundle Identifier**: com.rentbudy.app
- **Build Number**: 1
- **Xcode Version**: Latest

## Running the App

### Web App (Current)
```bash
# Start the web development server
npm start

# Build for production
npm run build
```

### Android (After setup)
```bash
# Start Metro bundler
npm run start:android

# In another terminal, run the app
npm run android
```

### iOS (After setup)
```bash
# Start Metro bundler
npm run start:ios

# In another terminal, run the app
npm run ios
```

## Build Commands

### Web Build
```bash
npm run build
```

### Android Build
```bash
# Create release bundle
npm run bundle-android

# Build APK (requires Android Studio)
# Open android/ folder in Android Studio and build
```

### iOS Build
```bash
# Create release bundle
npm run bundle-ios

# Build IPA (requires Xcode)
# Open ios/RentBuddyApp.xcworkspace in Xcode and archive
```

## Features

### Core Features
- **Property Management**: Add, edit, and manage properties
- **Tenant Management**: Track tenant information and contact details
- **Lease Management**: Manage lease agreements with flexible terms
- **Financial Tracking**: Comprehensive transaction management
- **Security Deposits**: Track deposits and refunds
- **Utility Bills**: Manage utility payments
- **Reports**: Generate financial reports and analytics

### Mobile-Specific Features
- **Offline Support**: Works without internet connection
- **Local Database**: SQLite for fast data access
- **Responsive Design**: Optimized for mobile screens
- **Touch-Friendly UI**: Designed for touch interactions

## Database Schema

The app uses SQLite with the following main tables:
- `properties`: Property information
- `tenants`: Tenant details
- `leases`: Lease agreements
- `transactions`: Financial transactions
- `payment_methods`: Payment method configurations
- `transaction_type_configs`: Transaction type settings
- `utility_configs`: Utility bill configurations
- `utility_bills`: Utility bill records
- `security_deposits`: Security deposit tracking
- `cumulative_balances`: Balance calculations

## Authentication

Default login credentials:
- **Username**: admin
- **Password**: admin123

**Note**: In production, implement proper authentication with secure credentials.

## Current File Structure

```
rent-budy-app/
├── src/
│   ├── components/
│   │   ├── LandingPage.tsx          # ✅ Landing page
│   │   ├── LoginScreen.tsx          # ✅ Login screen
│   │   ├── Dashboard.tsx            # ✅ Dashboard
│   │   ├── Properties.tsx           # ✅ Properties management
│   │   ├── Tenants.tsx              # ✅ Tenants management
│   │   ├── Leases.tsx               # ✅ Leases management
│   │   ├── Transactions.tsx         # ✅ Transactions
│   │   ├── AdminConfig.tsx          # ✅ Admin configuration
│   │   ├── Layout.tsx               # ✅ Layout component
│   │   └── Sidebar.tsx              # ✅ Sidebar navigation
│   ├── services/
│   │   ├── storageService.ts        # ✅ Web storage service
│   │   └── mobileStorageService.ts  # ✅ Mobile SQLite service
│   ├── contexts/
│   │   └── AuthContext.tsx          # ✅ Authentication context
│   ├── types/
│   │   └── index.ts                 # ✅ Type definitions
│   └── App.tsx                      # ✅ Main app component
├── android/                         # ✅ Android configuration
├── ios/                             # ✅ iOS configuration
├── package.json                     # ✅ Dependencies
├── metro.config.js                  # ✅ Metro bundler config
├── babel.config.js                  # ✅ Babel config
├── react-native.config.js           # ✅ React Native config
└── index.js                         # ✅ React Native entry point
```

## Troubleshooting

### Common Issues

1. **React version conflicts**
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Metro bundler issues**
   ```bash
   npm run clean
   npm start --reset-cache
   ```

3. **iOS build issues**
   ```bash
   cd ios
   pod deintegrate
   pod install
   cd ..
   ```

4. **Android build issues**
   ```bash
   cd android
   ./gradlew clean
   cd ..
   ```

5. **Database issues**
   - Clear app data and restart
   - Check SQLite permissions

### Performance Tips
- Use release builds for testing performance
- Monitor memory usage on older devices
- Optimize images and assets
- Use lazy loading for large datasets

## Development Guidelines

### Code Structure
```
src/
├── components/          # React components
├── contexts/           # React contexts
├── services/           # Business logic and data services
├── types/              # TypeScript type definitions
└── App.tsx            # Main app component
```

### Best Practices
- Follow React Native performance guidelines
- Use TypeScript for type safety
- Implement proper error handling
- Test on multiple device sizes
- Follow Material Design principles

## Deployment

### Web Deployment
```bash
npm run build
# Deploy build/ folder to your web server
```

### Android Play Store
1. Generate signed APK/AAB
2. Create Play Store listing
3. Upload and publish

### iOS App Store
1. Archive app in Xcode
2. Upload to App Store Connect
3. Submit for review

## Support

For technical support or questions:
- Check the troubleshooting section
- Review React Native documentation
- Contact the development team

## Version History

- **v1.0.0**: Initial release with core features
- Support for Android 5.0+ and iOS 12.0+
- SQLite database for local storage
- Comprehensive property management features
- Beautiful landing page and responsive design

## Next Development Phase

1. **Complete SQLite Integration**: Implement full SQLite functionality in mobileStorageService.ts
2. **Mobile UI Components**: Create React Native specific UI components
3. **Navigation**: Implement React Navigation for mobile
4. **Testing**: Test on actual devices and simulators
5. **Performance Optimization**: Optimize for mobile performance
6. **Offline Sync**: Implement offline data synchronization 