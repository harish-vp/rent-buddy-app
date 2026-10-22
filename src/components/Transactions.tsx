import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Chip,
  Alert,
  Fab,
  Divider,
  List,
  Paper
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material';
import { storageService } from '../services/storageService';
import { Transaction, Property, Lease, TransactionCategory } from '../types';

const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [leases, setLeases] = useState<Lease[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [formData, setFormData] = useState({
    property_id: '',
    lease_id: '',
    category: 'Rent Payment' as TransactionCategory,
    amount: '',
    transaction_date: new Date().toISOString().split('T')[0],
    payment_method_id: '',
    transaction_reference: '',
    description: '',
    // Split payment fields
    isSplit: false,
    rentAmount: '',
    maintenanceAmount: ''
  });
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [propertyFilter, setPropertyFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allTransactions = storageService.getTransactions();
    const allProperties = storageService.getProperties();
    const allLeases = storageService.getActiveLeases();
    setTransactions(allTransactions);
    setProperties(allProperties);
    setLeases(allLeases);
  };

  const handleOpenDialog = (transaction?: Transaction) => {
    if (transaction) {
      setEditingTransaction(transaction);
      setFormData({
        property_id: transaction.property_id,
        lease_id: transaction.lease_id || '',
        category: transaction.category,
        amount: transaction.amount.toString(),
        transaction_date: transaction.transaction_date.split('T')[0],
        payment_method_id: transaction.payment_method_id || '',
        transaction_reference: transaction.transaction_reference || '',
        description: transaction.description || '',
        isSplit: transaction.category === 'Split Payment',
        rentAmount: '',
        maintenanceAmount: ''
      });
    } else {
      setEditingTransaction(null);
      setFormData({
        property_id: '',
        lease_id: '',
        category: 'Rent Payment',
        amount: '',
        transaction_date: new Date().toISOString().split('T')[0],
        payment_method_id: '',
        transaction_reference: '',
        description: '',
        isSplit: false,
        rentAmount: '',
        maintenanceAmount: ''
      });
    }
    setOpenDialog(true);
    setError('');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTransaction(null);
    setError('');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Validation
    if (!formData.property_id || !formData.transaction_date || 
        !formData.payment_method_id || !formData.amount) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.isSplit) {
      if (!formData.rentAmount || !formData.maintenanceAmount) {
        setError('Please enter both rent and maintenance amounts for split payment');
        return;
      }
      const totalSplit = parseFloat(formData.rentAmount) + parseFloat(formData.maintenanceAmount);
      if (Math.abs(totalSplit - parseFloat(formData.amount)) > 0.01) {
        setError('Split amounts must equal the total amount');
        return;
      }
    }

    const transactionData = {
      property_id: formData.property_id,
      lease_id: formData.lease_id || undefined,
      transaction_type: 'income' as const,
      category: formData.category,
      amount: parseFloat(formData.amount),
      transaction_date: formData.transaction_date,
      payment_method_id: formData.payment_method_id,
      transaction_reference: formData.transaction_reference || undefined,
      description: formData.description || undefined,
      status: 'recorded' as const,
      is_split: formData.isSplit
    };

    if (editingTransaction) {
      // For editing, we'll need to handle this differently since we can't easily update transactions
      setError('Editing transactions is not supported. Please delete and recreate.');
      return;
    } else {
      const newTransaction = storageService.addTransaction(transactionData);
      
      // Handle split payment
      if (formData.isSplit) {
        storageService.addTransactionSplit({
          transaction_id: newTransaction.id,
          category: 'Rent',
          amount: parseFloat(formData.rentAmount),
          description: 'Rent portion of split payment'
        });
        
        storageService.addTransactionSplit({
          transaction_id: newTransaction.id,
          category: 'Maintenance',
          amount: parseFloat(formData.maintenanceAmount),
          description: 'Maintenance portion of split payment'
        });
      }
      
      loadData();
      handleCloseDialog();
    }
  };

  const handleDelete = (transactionId: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      // Note: In a real app, you'd want to handle this more carefully
      // For now, we'll just remove it from the list
      const updatedTransactions = transactions.filter(t => t.id !== transactionId);
      setTransactions(updatedTransactions);
    }
  };

  const getPaymentMethodName = (paymentMethodId: string) => {
    const paymentMethod = storageService.getPaymentMethods().find(m => m.id === paymentMethodId);
    return paymentMethod ? paymentMethod.name : 'N/A';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getLeasedProperties = () => {
    return properties.filter(p => {
      const lease = leases.find(l => l.property_id === p.id);
      return lease && lease.is_active && lease.status === 'active';
    });
  };

  const getLeaseForProperty = (propertyId: string) => {
    return leases.find(l => l.property_id === propertyId && l.is_active && l.status === 'active');
  };

  return (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'stretch', sm: 'center' }, 
        mb: 3,
        gap: { xs: 2, sm: 0 }
      }}>
        <Typography 
          variant="h4" 
          component="h1"
          sx={{ 
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
          }}
        >
          <ReceiptIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Transactions
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ 
            width: { xs: '100%', sm: 'auto' },
            minWidth: { sm: '200px' }
          }}
        >
          Record Payment
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: { xs: 2, md: 3 }, mb: 3 }}>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          gap: { xs: 2, md: 2 }
        }}>
          <TextField
            fullWidth
            label="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
          />
          <FormControl fullWidth size="small">
            <InputLabel>Property</InputLabel>
            <Select
              value={propertyFilter}
              label="Property"
              onChange={(e) => setPropertyFilter(e.target.value)}
            >
              <MenuItem value="">All Properties</MenuItem>
              {getLeasedProperties().map((property) => (
                <MenuItem key={property.id} value={property.id}>
                  {property.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <InputLabel>Category</InputLabel>
            <Select
              value={categoryFilter}
              label="Category"
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <MenuItem value="">All Categories</MenuItem>
              {storageService.getTransactionTypeConfigs().map((config) => (
                <MenuItem key={config.id} value={config.category}>
                  {config.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <InputLabel>Payment Method</InputLabel>
            <Select
              value={paymentMethodFilter}
              label="Payment Method"
              onChange={(e) => setPaymentMethodFilter(e.target.value)}
            >
              <MenuItem value="">All Methods</MenuItem>
              {storageService.getPaymentMethods().map((method) => (
                <MenuItem key={method.id} value={method.id}>
                  {method.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {transactions.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No transactions found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Start by recording your first payment
          </Typography>
        </Paper>
      ) : (
        <List sx={{ p: 0 }}>
          {transactions.map((transaction) => (
            <Card key={transaction.id} sx={{ mb: 2, p: { xs: 2, md: 3 } }}>
              <CardContent sx={{ p: 0, pb: 2 }}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', sm: 'row' },
                  justifyContent: 'space-between', 
                  alignItems: { xs: 'flex-start', sm: 'center' },
                  mb: 2,
                  gap: { xs: 1, sm: 0 }
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                    <Typography 
                      variant="h6" 
                      component="div"
                      sx={{ 
                        fontSize: { xs: '1rem', md: '1.25rem' },
                        fontWeight: 500
                      }}
                    >
                      {transaction.category}
                    </Typography>
                    <Chip 
                      label={getPaymentMethodName(transaction.payment_method_id || '')}
                      color="primary" 
                      size="small"
                      sx={{ fontSize: { xs: '0.7rem', md: '0.75rem' } }}
                    />
                  </Box>
                  <Typography 
                    variant="h6" 
                    component="div"
                    sx={{ 
                      color: 'primary.main',
                      fontWeight: 'bold',
                      fontSize: { xs: '1.1rem', md: '1.25rem' }
                    }}
                  >
                    {formatCurrency(transaction.amount)}
                  </Typography>
                </Box>
                
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', sm: 'row' },
                  justifyContent: 'space-between', 
                  alignItems: { xs: 'flex-start', sm: 'center' },
                  gap: { xs: 1, sm: 0 }
                }}>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}
                  >
                    {formatDate(transaction.transaction_date)}
                  </Typography>
                  {transaction.transaction_reference && (
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}
                    >
                      Ref: {transaction.transaction_reference}
                    </Typography>
                  )}
                </Box>

                {transaction.description && (
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      mt: 1,
                      fontSize: { xs: '0.8rem', md: '0.875rem' }
                    }}
                  >
                    {transaction.description}
                  </Typography>
                )}
              </CardContent>
              
              <CardActions sx={{ 
                justifyContent: 'flex-end', 
                p: 0, 
                pt: 0,
                gap: 1
              }}>
                <IconButton 
                  size="small" 
                  onClick={() => handleOpenDialog(transaction)}
                  color="primary"
                  sx={{ p: { xs: 0.5, md: 1 } }}
                >
                  <EditIcon sx={{ fontSize: { xs: '1.2rem', md: '1.5rem' } }} />
                </IconButton>
                <IconButton 
                  size="small" 
                  onClick={() => handleDelete(transaction.id)}
                  color="error"
                  sx={{ p: { xs: 0.5, md: 1 } }}
                >
                  <DeleteIcon sx={{ fontSize: { xs: '1.2rem', md: '1.5rem' } }} />
                </IconButton>
              </CardActions>
            </Card>
          ))}
        </List>
      )}

      {/* Floating Action Button for Mobile */}
      <Fab
        color="primary"
        aria-label="record payment"
        onClick={() => handleOpenDialog()}
        sx={{ 
          position: 'fixed', 
          bottom: 16, 
          right: 16,
          display: { xs: 'flex', sm: 'none' }
        }}
      >
        <AddIcon />
      </Fab>

      {/* Add Transaction Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingTransaction ? 'Edit Transaction' : 'Record New Payment'}
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2, mt: 1 }}>
            <FormControl fullWidth required>
              <InputLabel>Property *</InputLabel>
              <Select
                value={formData.property_id}
                label="Property *"
                onChange={(e) => {
                  handleInputChange('property_id', e.target.value);
                  const lease = getLeaseForProperty(e.target.value);
                  handleInputChange('lease_id', lease?.id || '');
                }}
              >
                {getLeasedProperties().map((property) => (
                  <MenuItem key={property.id} value={property.id}>
                    {property.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Payment Category</InputLabel>
              <Select
                value={formData.category}
                label="Payment Category"
                onChange={(e) => {
                  const category = e.target.value as TransactionCategory;
                  handleInputChange('category', category);
                  handleInputChange('isSplit', category === 'Split Payment' ? 'true' : 'false');
                }}
              >
                {storageService.getTransactionTypeConfigs().map((config) => (
                  <MenuItem key={config.id} value={config.category}>
                    {config.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Total Amount (₹) *"
              type="number"
              value={formData.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
              required
            />

            <TextField
              fullWidth
              label="Payment Date *"
              type="date"
              value={formData.transaction_date}
              onChange={(e) => handleInputChange('transaction_date', e.target.value)}
              required
              InputLabelProps={{ shrink: true }}
            />

            <FormControl fullWidth required>
              <InputLabel>Payment Method *</InputLabel>
              <Select
                value={formData.payment_method_id}
                label="Payment Method *"
                onChange={(e) => handleInputChange('payment_method_id', e.target.value)}
              >
                {storageService.getPaymentMethods().map((method) => (
                  <MenuItem key={method.id} value={method.id}>
                    {method.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Transaction Reference"
              value={formData.transaction_reference}
              onChange={(e) => handleInputChange('transaction_reference', e.target.value)}
              placeholder="Transaction ID, Cheque number, etc."
            />

            <TextField
              fullWidth
              label="Description"
              multiline
              rows={2}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}
            />

            {/* Split Payment Fields */}
            {formData.category === 'Split Payment' && (
              <>
                <Divider sx={{ gridColumn: { xs: '1', sm: '1 / -1' }, my: 2 }} />
                <Typography variant="h6" sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
                  Split Payment Details
                </Typography>
                
                <TextField
                  fullWidth
                  label="Rent Amount (₹)"
                  type="number"
                  value={formData.rentAmount}
                  onChange={(e) => handleInputChange('rentAmount', e.target.value)}
                />

                <TextField
                  fullWidth
                  label="Maintenance Amount (₹)"
                  type="number"
                  value={formData.maintenanceAmount}
                  onChange={(e) => handleInputChange('maintenanceAmount', e.target.value)}
                />
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingTransaction ? 'Update' : 'Record'} Payment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Transactions; 