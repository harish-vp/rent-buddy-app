import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import {
  Home,
  // People,
  Receipt,
  TrendingUp,
  CheckCircle,
  Cancel
} from '@mui/icons-material';
import { storageService } from '../services/storageService';
import { DashboardStats, Property, Lease, Transaction } from '../types';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalIncome: 0,
    totalProperties: 0,
    occupiedProperties: 0,
    vacantProperties: 0,
    totalTenants: 0,
    totalSecurityDeposits: 0,
    pendingRenewals: 0,
    overdueBills: 0
  });
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [leases, setLeases] = useState<Lease[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    const dashboardStats = storageService.getDashboardStats();
    const transactions = storageService.getTransactions();
    const allProperties = storageService.getProperties();
    const allLeases = storageService.getActiveLeases();

    setStats(dashboardStats);
    setRecentTransactions(transactions.slice(-5).reverse()); // Last 5 transactions
    setProperties(allProperties);
    setLeases(allLeases);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getPropertyStatus = (propertyId: string) => {
    const lease = leases.find(l => l.property_id === propertyId);
    return lease ? 'Occupied' : 'Vacant';
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
  }> = ({ title, value, icon, color }) => (
    <Card sx={{ height: '100%', bgcolor: 'background.paper' }}>
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 1, md: 2 } }}>
          <Box sx={{ 
            p: { xs: 0.75, md: 1 }, 
            borderRadius: 1, 
            bgcolor: color, 
            color: 'white',
            mr: { xs: 1.5, md: 2 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Box sx={{ fontSize: { xs: '1.2rem', md: '1.5rem' } }}>
              {icon}
            </Box>
          </Box>
          <Typography 
            variant="h6" 
            component="div"
            sx={{ 
              fontSize: { xs: '0.875rem', md: '1.25rem' },
              fontWeight: 500
            }}
          >
            {title}
          </Typography>
        </Box>
        <Typography 
          variant="h4" 
          component="div" 
          sx={{ 
            fontWeight: 'bold',
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
          }}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom 
        sx={{ 
          mb: { xs: 2, md: 4 },
          fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
        }}
      >
        Dashboard
      </Typography>

      {/* Stats Cards */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
        gap: { xs: 2, md: 3 }, 
        mb: { xs: 2, md: 4 } 
      }}>
        <StatCard
          title="Total Income"
          value={formatCurrency(stats.totalIncome)}
          icon={<TrendingUp />}
          color="#4caf50"
        />
        <StatCard
          title="Total Properties"
          value={stats.totalProperties}
          icon={<Home />}
          color="#2196f3"
        />
        <StatCard
          title="Occupied"
          value={stats.occupiedProperties}
          icon={<CheckCircle />}
          color="#4caf50"
        />
        <StatCard
          title="Vacant"
          value={stats.vacantProperties}
          icon={<Cancel />}
          color="#f44336"
        />
      </Box>

      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
        gap: { xs: 2, md: 3 } 
      }}>
        {/* Recent Transactions */}
        <Paper sx={{ p: { xs: 2, md: 3 }, height: 'fit-content' }}>
          <Typography 
            variant="h6" 
            gutterBottom 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              fontSize: { xs: '1rem', md: '1.25rem' }
            }}
          >
            <Receipt sx={{ mr: 1, fontSize: { xs: '1.2rem', md: '1.5rem' } }} />
            Recent Transactions
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {recentTransactions.length > 0 ? (
            <List sx={{ p: 0 }}>
              {recentTransactions.map((transaction) => (
                <ListItem key={transaction.id} sx={{ px: 0, py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Receipt color="primary" sx={{ fontSize: { xs: '1.2rem', md: '1.5rem' } }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
                        {transaction.category}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                        {`${formatCurrency(transaction.amount)} - ${new Date(transaction.transaction_date).toLocaleDateString()}`}
                      </Typography>
                    }
                  />
                  <Chip 
                    label={transaction.payment_method_id || 'N/A'} 
                    size="small" 
                    variant="outlined"
                    sx={{ fontSize: { xs: '0.7rem', md: '0.75rem' } }}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No transactions yet
            </Typography>
          )}
        </Paper>

        {/* Property Status */}
        <Paper sx={{ p: { xs: 2, md: 3 }, height: 'fit-content' }}>
          <Typography 
            variant="h6" 
            gutterBottom 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              fontSize: { xs: '1rem', md: '1.25rem' }
            }}
          >
            <Home sx={{ mr: 1, fontSize: { xs: '1.2rem', md: '1.5rem' } }} />
            Property Status
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {properties.length > 0 ? (
            <List sx={{ p: 0 }}>
              {properties.map((property) => (
                <ListItem key={property.id} sx={{ px: 0, py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Home color="primary" sx={{ fontSize: { xs: '1.2rem', md: '1.5rem' } }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
                        {property.name}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                        {`${property.address_line1}, ${property.city}`}
                      </Typography>
                    }
                  />
                  <Chip 
                    label={getPropertyStatus(property.id)}
                    color={getPropertyStatus(property.id) === 'Occupied' ? 'success' : 'error'}
                    size="small"
                    sx={{ fontSize: { xs: '0.7rem', md: '0.75rem' } }}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No properties added yet
            </Typography>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default Dashboard; 