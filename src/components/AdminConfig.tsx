import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Switch,
  FormControlLabel,
  Alert,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Upload as UploadIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { storageService } from '../services/storageService';
import { 
  PaymentMethod, 
  TransactionTypeConfig, 
  UtilityConfig,
  CSVTransaction 
} from '../types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const AdminConfig: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [transactionTypes, setTransactionTypes] = useState<TransactionTypeConfig[]>([]);
  const [utilityConfigs, setUtilityConfigs] = useState<UtilityConfig[]>([]);
  
  // Dialog states
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [openTransactionDialog, setOpenTransactionDialog] = useState(false);
  const [openUtilityDialog, setOpenUtilityDialog] = useState(false);
  const [openImportDialog, setOpenImportDialog] = useState(false);
  
  // Form states
  const [editingPayment, setEditingPayment] = useState<PaymentMethod | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<TransactionTypeConfig | null>(null);
  const [editingUtility, setEditingUtility] = useState<UtilityConfig | null>(null);
  
  // Form data
  const [paymentForm, setPaymentForm] = useState({
    name: '',
    type: 'UPI' as 'UPI' | 'Net Banking' | 'Cash' | 'Cheque' | 'Other',
    destination_account: '',
    is_default: false,
    is_active: true
  });

  const [transactionForm, setTransactionForm] = useState({
    name: '',
    category: 'Rent Payment' as any,
    default_payment_method_id: '',
    requires_property: true,
    requires_lease: true,
    allows_splits: false,
    is_active: true
  });

  const [utilityForm, setUtilityForm] = useState({
    name: '',
    type: 'Water' as 'Water' | 'Electricity' | 'Gas' | 'Other',
    unit: '',
    default_rate: 0,
    is_active: true
  });

  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [importStatus, setImportStatus] = useState<string>('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setPaymentMethods(storageService.getPaymentMethods());
    setTransactionTypes(storageService.getTransactionTypeConfigs());
    setUtilityConfigs(storageService.getUtilityConfigs());
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Payment Methods
  const handlePaymentSubmit = () => {
    if (editingPayment) {
      storageService.updatePaymentMethod(editingPayment.id, paymentForm);
    } else {
      storageService.addPaymentMethod(paymentForm);
    }
    loadData();
    handlePaymentClose();
  };

  const handlePaymentClose = () => {
    setOpenPaymentDialog(false);
    setEditingPayment(null);
    setPaymentForm({
      name: '',
      type: 'UPI',
      destination_account: '',
      is_default: false,
      is_active: true
    });
  };

  const handlePaymentEdit = (payment: PaymentMethod) => {
    setEditingPayment(payment);
    setPaymentForm({
      name: payment.name,
      type: payment.type,
      destination_account: payment.destination_account || '',
      is_default: payment.is_default,
      is_active: payment.is_active
    });
    setOpenPaymentDialog(true);
  };

  const handlePaymentDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this payment method?')) {
      storageService.updatePaymentMethod(id, { is_active: false });
      loadData();
    }
  };

  // Transaction Types
  const handleTransactionSubmit = () => {
    if (editingTransaction) {
      storageService.updateTransactionTypeConfig(editingTransaction.id, transactionForm);
    } else {
      storageService.addTransactionTypeConfig(transactionForm);
    }
    loadData();
    handleTransactionClose();
  };

  const handleTransactionClose = () => {
    setOpenTransactionDialog(false);
    setEditingTransaction(null);
    setTransactionForm({
      name: '',
      category: 'Rent Payment',
      default_payment_method_id: '',
      requires_property: true,
      requires_lease: true,
      allows_splits: false,
      is_active: true
    });
  };

  const handleTransactionEdit = (config: TransactionTypeConfig) => {
    setEditingTransaction(config);
    setTransactionForm({
      name: config.name,
      category: config.category,
      default_payment_method_id: config.default_payment_method_id || '',
      requires_property: config.requires_property,
      requires_lease: config.requires_lease,
      allows_splits: config.allows_splits,
      is_active: config.is_active
    });
    setOpenTransactionDialog(true);
  };

  // Utility Configs
  const handleUtilitySubmit = () => {
    if (editingUtility) {
      storageService.updateUtilityConfig(editingUtility.id, utilityForm);
    } else {
      storageService.addUtilityConfig(utilityForm);
    }
    loadData();
    handleUtilityClose();
  };

  const handleUtilityClose = () => {
    setOpenUtilityDialog(false);
    setEditingUtility(null);
    setUtilityForm({
      name: '',
      type: 'Water',
      unit: '',
      default_rate: 0,
      is_active: true
    });
  };

  const handleUtilityEdit = (config: UtilityConfig) => {
    setEditingUtility(config);
    setUtilityForm({
      name: config.name,
      type: config.type,
      unit: config.unit,
      default_rate: config.default_rate || 0,
      is_active: config.is_active
    });
    setOpenUtilityDialog(true);
  };

  // CSV Import
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setCsvFile(file);
    } else {
      alert('Please select a valid CSV file');
    }
  };

  const handleCSVImport = async () => {
    if (!csvFile) return;

    try {
      setImportStatus('Importing...');
      const text = await csvFile.text();
      const lines = text.split('\n');
      const headers = lines[0].split(',');
      
      const csvData: CSVTransaction[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
          const values = lines[i].split(',');
          const row: any = {};
          
          headers.forEach((header, index) => {
            const value = values[index]?.trim() || '';
            if (header === 'date' || header === 'start_date') {
              row[header] = value;
            } else if (['advance', 'advance_return', 'advance_balance_cumulative', 'rent', 'rent_cumulative', 
                       'water', 'electricity', 'maintainance', 'maintainance_sum', 'maintainance_cumulative',
                       'total', 'total_cumulative', 'actual_spent', 'spent_split', 'spent_cumulative',
                       'inward_minus_outward', 'maintainance_recovery_balance', 'account_should_hold'].includes(header)) {
              row[header] = parseFloat(value) || 0;
            } else {
              row[header] = value;
            }
          });
          
          csvData.push(row);
        }
      }

      storageService.importCSVData(csvData);
      setImportStatus('Import completed successfully!');
      setTimeout(() => {
        setOpenImportDialog(false);
        setImportStatus('');
        setCsvFile(null);
      }, 2000);
      
    } catch (error) {
      setImportStatus('Error importing CSV: ' + error);
    }
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
          <SettingsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Admin Configuration
        </Typography>
        <Button
          variant="contained"
          startIcon={<UploadIcon />}
          onClick={() => setOpenImportDialog(true)}
          sx={{ 
            width: { xs: '100%', sm: 'auto' },
            minWidth: { sm: '200px' }
          }}
        >
          Import CSV Data
        </Button>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ 
            '& .MuiTab-root': {
              minWidth: { xs: 'auto', sm: 120 },
              fontSize: { xs: '0.875rem', md: '1rem' }
            }
          }}
        >
          <Tab label="Payment Methods" />
          <Tab label="Transaction Types" />
          <Tab label="Utility Configurations" />
        </Tabs>
      </Box>

      {/* Payment Methods Tab */}
      <TabPanel value={tabValue} index={0}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'stretch', sm: 'center' }, 
          mb: 2,
          gap: { xs: 2, sm: 0 }
        }}>
          <Typography 
            variant="h6"
            sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' } }}
          >
            Payment Methods
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenPaymentDialog(true)}
            sx={{ 
              width: { xs: '100%', sm: 'auto' },
              minWidth: { sm: '180px' }
            }}
          >
            Add Payment Method
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>Name</TableCell>
                <TableCell sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>Type</TableCell>
                <TableCell sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>Destination Account</TableCell>
                <TableCell sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>Default</TableCell>
                <TableCell sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>Status</TableCell>
                <TableCell sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paymentMethods.map((method) => (
                <TableRow key={method.id}>
                  <TableCell sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>{method.name}</TableCell>
                  <TableCell sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>{method.type}</TableCell>
                  <TableCell sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>{method.destination_account || '-'}</TableCell>
                  <TableCell>
                    <Chip 
                      label={method.is_default ? 'Default' : 'No'} 
                      color={method.is_default ? 'primary' : 'default'}
                      size="small"
                      sx={{ fontSize: { xs: '0.65rem', md: '0.75rem' } }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={method.is_active ? 'Active' : 'Inactive'} 
                      color={method.is_active ? 'success' : 'error'}
                      size="small"
                      sx={{ fontSize: { xs: '0.65rem', md: '0.75rem' } }}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      onClick={() => handlePaymentEdit(method)}
                      size="small"
                      sx={{ p: { xs: 0.5, md: 1 } }}
                    >
                      <EditIcon sx={{ fontSize: { xs: '1.1rem', md: '1.5rem' } }} />
                    </IconButton>
                    <IconButton 
                      onClick={() => handlePaymentDelete(method.id)}
                      size="small"
                      sx={{ p: { xs: 0.5, md: 1 } }}
                    >
                      <DeleteIcon sx={{ fontSize: { xs: '1.1rem', md: '1.5rem' } }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Transaction Types Tab */}
      <TabPanel value={tabValue} index={1}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'stretch', sm: 'center' }, 
          mb: 2,
          gap: { xs: 2, sm: 0 }
        }}>
          <Typography 
            variant="h6"
            sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' } }}
          >
            Transaction Types
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenTransactionDialog(true)}
            sx={{ 
              width: { xs: '100%', sm: 'auto' },
              minWidth: { sm: '180px' }
            }}
          >
            Add Transaction Type
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>Name</TableCell>
                <TableCell sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>Category</TableCell>
                <TableCell sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>Requires Property</TableCell>
                <TableCell sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>Requires Lease</TableCell>
                <TableCell sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>Allows Splits</TableCell>
                <TableCell sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>Status</TableCell>
                <TableCell sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactionTypes.map((config) => (
                <TableRow key={config.id}>
                  <TableCell sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>{config.name}</TableCell>
                  <TableCell sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>{config.category}</TableCell>
                  <TableCell>
                    <Chip 
                      label={config.requires_property ? 'Yes' : 'No'} 
                      color={config.requires_property ? 'primary' : 'default'}
                      size="small"
                      sx={{ fontSize: { xs: '0.65rem', md: '0.75rem' } }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={config.requires_lease ? 'Yes' : 'No'} 
                      color={config.requires_lease ? 'primary' : 'default'}
                      size="small"
                      sx={{ fontSize: { xs: '0.65rem', md: '0.75rem' } }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={config.allows_splits ? 'Yes' : 'No'} 
                      color={config.allows_splits ? 'primary' : 'default'}
                      size="small"
                      sx={{ fontSize: { xs: '0.65rem', md: '0.75rem' } }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={config.is_active ? 'Active' : 'Inactive'} 
                      color={config.is_active ? 'success' : 'error'}
                      size="small"
                      sx={{ fontSize: { xs: '0.65rem', md: '0.75rem' } }}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      onClick={() => handleTransactionEdit(config)}
                      size="small"
                      sx={{ p: { xs: 0.5, md: 1 } }}
                    >
                      <EditIcon sx={{ fontSize: { xs: '1.1rem', md: '1.5rem' } }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Utility Configurations Tab */}
      <TabPanel value={tabValue} index={2}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'stretch', sm: 'center' }, 
          mb: 2,
          gap: { xs: 2, sm: 0 }
        }}>
          <Typography 
            variant="h6"
            sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' } }}
          >
            Utility Configurations
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenUtilityDialog(true)}
            sx={{ 
              width: { xs: '100%', sm: 'auto' },
              minWidth: { sm: '180px' }
            }}
          >
            Add Utility Type
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>Name</TableCell>
                <TableCell sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>Type</TableCell>
                <TableCell sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>Unit</TableCell>
                <TableCell sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>Default Rate</TableCell>
                <TableCell sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>Status</TableCell>
                <TableCell sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {utilityConfigs.map((config) => (
                <TableRow key={config.id}>
                  <TableCell sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>{config.name}</TableCell>
                  <TableCell sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>{config.type}</TableCell>
                  <TableCell sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>{config.unit}</TableCell>
                  <TableCell sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>{config.default_rate || '-'}</TableCell>
                  <TableCell>
                    <Chip 
                      label={config.is_active ? 'Active' : 'Inactive'} 
                      color={config.is_active ? 'success' : 'error'}
                      size="small"
                      sx={{ fontSize: { xs: '0.65rem', md: '0.75rem' } }}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      onClick={() => handleUtilityEdit(config)}
                      size="small"
                      sx={{ p: { xs: 0.5, md: 1 } }}
                    >
                      <EditIcon sx={{ fontSize: { xs: '1.1rem', md: '1.5rem' } }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Payment Method Dialog */}
      <Dialog 
        open={openPaymentDialog} 
        onClose={handlePaymentClose} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: { 
            width: { xs: '95%', sm: 'auto' },
            maxWidth: { xs: '95%', sm: 600 }
          }
        }}
      >
        <DialogTitle sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
          {editingPayment ? 'Edit Payment Method' : 'Add Payment Method'}
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 2, md: 3 } }}>
          <Box sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Name"
              value={paymentForm.name}
              onChange={(e) => setPaymentForm({ ...paymentForm, name: e.target.value })}
              sx={{ mb: 2 }}
              size="small"
            />
            <FormControl fullWidth sx={{ mb: 2 }} size="small">
              <InputLabel>Type</InputLabel>
              <Select
                value={paymentForm.type}
                label="Type"
                onChange={(e) => setPaymentForm({ ...paymentForm, type: e.target.value as any })}
              >
                <MenuItem value="UPI">UPI</MenuItem>
                <MenuItem value="Net Banking">Net Banking</MenuItem>
                <MenuItem value="Cash">Cash</MenuItem>
                <MenuItem value="Cheque">Cheque</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Destination Account"
              value={paymentForm.destination_account}
              onChange={(e) => setPaymentForm({ ...paymentForm, destination_account: e.target.value })}
              sx={{ mb: 2 }}
              size="small"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={paymentForm.is_default}
                  onChange={(e) => setPaymentForm({ ...paymentForm, is_default: e.target.checked })}
                />
              }
              label="Set as Default"
              sx={{ mb: 1 }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={paymentForm.is_active}
                  onChange={(e) => setPaymentForm({ ...paymentForm, is_active: e.target.checked })}
                />
              }
              label="Active"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: { xs: 2, md: 3 } }}>
          <Button onClick={handlePaymentClose}>Cancel</Button>
          <Button onClick={handlePaymentSubmit} variant="contained">
            {editingPayment ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Transaction Type Dialog */}
      <Dialog 
        open={openTransactionDialog} 
        onClose={handleTransactionClose} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: { 
            width: { xs: '95%', sm: 'auto' },
            maxWidth: { xs: '95%', sm: 600 }
          }
        }}
      >
        <DialogTitle sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
          {editingTransaction ? 'Edit Transaction Type' : 'Add Transaction Type'}
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 2, md: 3 } }}>
          <Box sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Name"
              value={transactionForm.name}
              onChange={(e) => setTransactionForm({ ...transactionForm, name: e.target.value })}
              sx={{ mb: 2 }}
              size="small"
            />
            <FormControl fullWidth sx={{ mb: 2 }} size="small">
              <InputLabel>Category</InputLabel>
              <Select
                value={transactionForm.category}
                label="Category"
                onChange={(e) => setTransactionForm({ ...transactionForm, category: e.target.value })}
              >
                <MenuItem value="Advance Payment">Advance Payment</MenuItem>
                <MenuItem value="Advance Return">Advance Return</MenuItem>
                <MenuItem value="Rent Payment">Rent Payment</MenuItem>
                <MenuItem value="Maintenance Payment">Maintenance Payment</MenuItem>
                <MenuItem value="Security Deposit">Security Deposit</MenuItem>
                <MenuItem value="Security Deposit Return">Security Deposit Return</MenuItem>
                <MenuItem value="Utility Payment">Utility Payment</MenuItem>
                <MenuItem value="Split Payment">Split Payment</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Switch
                  checked={transactionForm.requires_property}
                  onChange={(e) => setTransactionForm({ ...transactionForm, requires_property: e.target.checked })}
                />
              }
              label="Requires Property"
              sx={{ mb: 1 }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={transactionForm.requires_lease}
                  onChange={(e) => setTransactionForm({ ...transactionForm, requires_lease: e.target.checked })}
                />
              }
              label="Requires Lease"
              sx={{ mb: 1 }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={transactionForm.allows_splits}
                  onChange={(e) => setTransactionForm({ ...transactionForm, allows_splits: e.target.checked })}
                />
              }
              label="Allows Split Payments"
              sx={{ mb: 1 }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={transactionForm.is_active}
                  onChange={(e) => setTransactionForm({ ...transactionForm, is_active: e.target.checked })}
                />
              }
              label="Active"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: { xs: 2, md: 3 } }}>
          <Button onClick={handleTransactionClose}>Cancel</Button>
          <Button onClick={handleTransactionSubmit} variant="contained">
            {editingTransaction ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Utility Config Dialog */}
      <Dialog 
        open={openUtilityDialog} 
        onClose={handleUtilityClose} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: { 
            width: { xs: '95%', sm: 'auto' },
            maxWidth: { xs: '95%', sm: 600 }
          }
        }}
      >
        <DialogTitle sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
          {editingUtility ? 'Edit Utility Configuration' : 'Add Utility Configuration'}
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 2, md: 3 } }}>
          <Box sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Name"
              value={utilityForm.name}
              onChange={(e) => setUtilityForm({ ...utilityForm, name: e.target.value })}
              sx={{ mb: 2 }}
              size="small"
            />
            <FormControl fullWidth sx={{ mb: 2 }} size="small">
              <InputLabel>Type</InputLabel>
              <Select
                value={utilityForm.type}
                label="Type"
                onChange={(e) => setUtilityForm({ ...utilityForm, type: e.target.value as any })}
              >
                <MenuItem value="Water">Water</MenuItem>
                <MenuItem value="Electricity">Electricity</MenuItem>
                <MenuItem value="Gas">Gas</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Unit"
              value={utilityForm.unit}
              onChange={(e) => setUtilityForm({ ...utilityForm, unit: e.target.value })}
              placeholder="e.g., liters, units, cubic meters"
              sx={{ mb: 2 }}
              size="small"
            />
            <TextField
              fullWidth
              label="Default Rate per Unit"
              type="number"
              value={utilityForm.default_rate}
              onChange={(e) => setUtilityForm({ ...utilityForm, default_rate: parseFloat(e.target.value) || 0 })}
              sx={{ mb: 2 }}
              size="small"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={utilityForm.is_active}
                  onChange={(e) => setUtilityForm({ ...utilityForm, is_active: e.target.checked })}
                />
              }
              label="Active"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: { xs: 2, md: 3 } }}>
          <Button onClick={handleUtilityClose}>Cancel</Button>
          <Button onClick={handleUtilitySubmit} variant="contained">
            {editingUtility ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* CSV Import Dialog */}
      <Dialog 
        open={openImportDialog} 
        onClose={() => setOpenImportDialog(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: { 
            width: { xs: '95%', sm: 'auto' },
            maxWidth: { xs: '95%', sm: 600 }
          }
        }}
      >
        <DialogTitle sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
          Import CSV Data
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 2, md: 3 } }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This will clear all existing data and import from the CSV file. Make sure to backup your data first.
          </Alert>
          
          <input
            accept=".csv"
            style={{ display: 'none' }}
            id="csv-file-input"
            type="file"
            onChange={handleFileUpload}
          />
          <label htmlFor="csv-file-input">
            <Button 
              variant="outlined" 
              component="span" 
              fullWidth
              sx={{ 
                py: { xs: 1.5, md: 2 },
                fontSize: { xs: '0.875rem', md: '1rem' }
              }}
            >
              {csvFile ? csvFile.name : 'Choose CSV File'}
            </Button>
          </label>
          
          {importStatus && (
            <Alert severity={importStatus.includes('Error') ? 'error' : 'success'} sx={{ mt: 2 }}>
              {importStatus}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ p: { xs: 2, md: 3 } }}>
          <Button onClick={() => setOpenImportDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleCSVImport} 
            variant="contained"
            disabled={!csvFile || importStatus === 'Importing...'}
          >
            Import
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminConfig; 