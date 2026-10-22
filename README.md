# Rent Buddy - Property Management App

A mobile-first property management application built with React and TypeScript, designed for property owners to manage their rental properties, tenants, leases, and financial transactions locally.

## 🏠 Features

### Core Functionality
- **Property Management**: Add, edit, and manage multiple properties with detailed information
- **Tenant Management**: Maintain tenant profiles with contact information
- **Lease Management**: Assign tenants to properties with lease terms and conditions
- **Financial Tracking**: Record rent and maintenance payments with split payment support
- **Dashboard**: Real-time overview of income, property status, and recent transactions

### Mobile-First Design
- Responsive design that works seamlessly on mobile devices
- Touch-friendly interface with floating action buttons
- Collapsible sidebar navigation
- Optimized for both mobile and desktop use

### Local Data Storage
- All data stored locally using browser localStorage
- No internet connection required
- Data persists across browser sessions
- Perfect for offline use

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd rent-budy-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Default Login Credentials
- **Username**: `admin`
- **Password**: `admin123`

## 📱 Usage Guide

### 1. Getting Started
1. Login with the default credentials
2. Start by adding your properties in the Properties section
3. Add tenant information in the Tenants section
4. Create lease agreements in the Leases section
5. Record payments in the Transactions section

### 2. Property Management
- Add new properties with detailed information
- Include property type, address, bedrooms, bathrooms, and area
- Edit or delete properties as needed
- View property status (occupied/vacant)

### 3. Tenant Management
- Create tenant profiles with contact information
- Manage multiple tenants
- Edit tenant details or mark as inactive

### 4. Lease Management
- Assign tenants to available properties
- Set lease terms including rent, security deposit, and maintenance charges
- Define lease start and end dates
- Track active and expired leases

### 5. Financial Tracking
- Record rent payments with various payment methods
- Track maintenance payments
- Support for split payments (rent + maintenance)
- View transaction history and income summaries

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **UI Framework**: Material-UI (MUI) v5
- **Routing**: React Router v6
- **State Management**: React Context API
- **Data Storage**: Browser localStorage
- **Styling**: CSS Grid, Flexbox, Material-UI theming

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Dashboard.tsx    # Main dashboard view
│   ├── Layout.tsx       # App layout with sidebar
│   ├── LoginScreen.tsx  # Authentication screen
│   ├── Properties.tsx   # Property management
│   ├── Tenants.tsx      # Tenant management
│   ├── Leases.tsx       # Lease management
│   ├── Transactions.tsx # Financial transactions
│   └── Sidebar.tsx      # Navigation sidebar
├── contexts/            # React contexts
│   └── AuthContext.tsx  # Authentication state
├── services/            # Business logic
│   └── storageService.ts # Local storage operations
├── types/               # TypeScript interfaces
│   └── index.ts         # Data type definitions
└── App.tsx              # Main application component
```

## 🎨 Design Features

### Mobile-First Approach
- Responsive grid layouts that adapt to screen size
- Touch-friendly buttons and interactive elements
- Floating action buttons for mobile devices
- Collapsible navigation for smaller screens

### User Experience
- Clean, modern Material Design interface
- Intuitive navigation with clear visual hierarchy
- Consistent color scheme and typography
- Loading states and error handling
- Form validation and user feedback

### Data Management
- Local storage with automatic data persistence
- Real-time updates across all components
- Data validation and error handling
- Backup and restore functionality (localStorage)

## 🔧 Customization

### Theme Customization
The app uses Material-UI theming. You can customize colors, typography, and component styles in `src/App.tsx`:

```typescript
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Change primary color
    },
    secondary: {
      main: '#dc004e', // Change secondary color
    },
  },
  // Add more customizations...
});
```

### Adding New Features
The modular architecture makes it easy to add new features:
1. Create new components in the `components/` directory
2. Add new types in `types/index.ts`
3. Extend the storage service for new data operations
4. Update routing in `App.tsx`

## 📊 Data Schema

The application uses the following data structure:

- **Properties**: Property details, addresses, specifications
- **Tenants**: Tenant information and contact details
- **Leases**: Property-tenant relationships with terms
- **Transactions**: Financial records and payments
- **Property Types**: Categorization of properties

## 🔒 Security & Privacy

- All data is stored locally in the browser
- No data is transmitted to external servers
- User authentication is handled locally
- Data privacy is maintained as no cloud storage is used

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy Options
- **Static Hosting**: Deploy the `build` folder to any static hosting service
- **PWA**: The app can be configured as a Progressive Web App
- **Electron**: Can be wrapped in Electron for desktop deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation above
- Review the code comments
- Create an issue in the repository

## 🔮 Future Enhancements

Potential features for future versions:
- Cloud synchronization
- Document management
- Advanced reporting and analytics
- Tenant portal
- Expense tracking
- Automated notifications
- Multi-user support

---

**Rent Buddy** - Simplifying property management for landlords.
