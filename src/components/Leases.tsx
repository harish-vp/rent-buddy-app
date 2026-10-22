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
  Avatar
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Assignment as AssignmentIcon //,
  // Home as HomeIcon,
  // People as PeopleIcon
} from '@mui/icons-material';
import { storageService } from '../services/storageService';
import { Lease, Property, Tenant } from '../types';

const Leases: React.FC = () => {
  const [leases, setLeases] = useState<Lease[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingLease, setEditingLease] = useState<Lease | null>(null);
  const [formData, setFormData] = useState({
    property_id: '',
    tenant_id: '',
    start_date: '',
    end_date: '',
    monthly_rent: '',
    security_deposit: '',
    maintenance_charge: '0'
  });
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allLeases = storageService.getLeases();
    const allProperties = storageService.getProperties();
    const allTenants = storageService.getTenants();
    setLeases(allLeases);
    setProperties(allProperties);
    setTenants(allTenants);
  };

  const handleOpenDialog = (lease?: Lease) => {
    if (lease) {
      setEditingLease(lease);
      setFormData({
        property_id: lease.property_id,
        tenant_id: lease.tenant_id,
        start_date: lease.start_date.split('T')[0],
        end_date: lease.end_date.split('T')[0],
        monthly_rent: lease.monthly_rent.toString(),
        security_deposit: lease.security_deposit.toString(),
        maintenance_charge: lease.maintenance_charge.toString()
      });
    } else {
      setEditingLease(null);
      setFormData({
        property_id: '',
        tenant_id: '',
        start_date: '',
        end_date: '',
        monthly_rent: '',
        security_deposit: '',
        maintenance_charge: '0'
      });
    }
    setOpenDialog(true);
    setError('');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingLease(null);
    setError('');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Validation
    if (!formData.property_id || !formData.tenant_id || 
        !formData.start_date || !formData.end_date || 
        !formData.monthly_rent || !formData.security_deposit) {
      setError('Please fill in all required fields');
      return;
    }

    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);
    
    if (startDate >= endDate) {
      setError('End date must be after start date');
      return;
    }

    // Check if property is already leased
    const existingLease = leases.find(l => 
      l.property_id === formData.property_id && 
      l.is_active && 
      l.status === 'active' &&
      (!editingLease || l.id !== editingLease.id)
    );
    
    if (existingLease) {
      setError('This property is already leased to another tenant');
      return;
    }

    const leaseData = {
      property_id: formData.property_id,
      tenant_id: formData.tenant_id,
      start_date: formData.start_date,
      end_date: formData.end_date,
      monthly_rent: parseFloat(formData.monthly_rent),
      security_deposit: parseFloat(formData.security_deposit),
      maintenance_charge: parseFloat(formData.maintenance_charge),
      is_active: true,
      status: 'active' as const
    };

    if (editingLease) {
      const updated = storageService.updateLease(editingLease.id, leaseData);
      if (updated) {
        loadData();
        handleCloseDialog();
      }
    } else {
      storageService.addLease({
        ...leaseData,
        maintenance_type: 'fixed',
        renewal_reminder_days: 15
      });
      loadData();
      handleCloseDialog();
    }
  };

  const handleDelete = (leaseId: string) => {
    if (window.confirm('Are you sure you want to delete this lease?')) {
      storageService.updateLease(leaseId, { is_active: false, status: 'terminated' });
      loadData();
    }
  };

  const getPropertyName = (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId);
    return property ? property.name : 'Unknown Property';
  };

  const getTenantName = (tenantId: string) => {
    const tenant = tenants.find(t => t.id === tenantId);
    return tenant ? tenant.full_name : 'Unknown Tenant';
  };

  const getTenantInitials = (tenantId: string) => {
    const tenant = tenants.find(t => t.id === tenantId);
    if (!tenant) return '?';
    return tenant.full_name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
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

  const getAvailableProperties = () => {
    const leasedPropertyIds = leases
      .filter(l => l.is_active && l.status === 'active')
      .map(l => l.property_id);
    
    return properties.filter(p => !leasedPropertyIds.includes(p.id));
  };

  const getAvailableTenants = () => {
    return tenants.filter(t => t.is_active);
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
          <AssignmentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Leases
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ 
            width: { xs: '100%', sm: 'auto' },
            minWidth: { sm: '180px' }
          }}
        >
          Add Lease
        </Button>
      </Box>

      {leases.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 4 }}>
          <CardContent>
            <AssignmentIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Leases Added
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Start by adding your first lease agreement
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Add Your First Lease
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
          gap: { xs: 2, md: 3 } 
        }}>
          {leases.map((lease) => (
            <Card key={lease.id} sx={{ height: '100%' }}>
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', sm: 'row' },
                  justifyContent: 'space-between', 
                  alignItems: { xs: 'flex-start', sm: 'center' }, 
                  mb: 2,
                  gap: { xs: 1, sm: 0 }
                }}>
                  <Typography 
                    variant="h6" 
                    component="h2" 
                    sx={{ 
                      flex: 1,
                      fontSize: { xs: '1rem', md: '1.25rem' }
                    }}
                  >
                    {getPropertyName(lease.property_id)}
                  </Typography>
                  <Chip 
                    label={lease.status} 
                    size="small" 
                    color={lease.status === 'active' ? 'success' : 'default'}
                    variant="outlined"
                    sx={{ fontSize: { xs: '0.7rem', md: '0.75rem' } }}
                  />
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar 
                    sx={{ 
                      bgcolor: 'primary.main', 
                      mr: 2,
                      width: { xs: 28, md: 32 },
                      height: { xs: 28, md: 32 },
                      fontSize: { xs: '0.75rem', md: '0.875rem' }
                    }}
                  >
                    {getTenantInitials(lease.tenant_id)}
                  </Avatar>
                  <Typography 
                    variant="body1"
                    sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
                  >
                    {getTenantName(lease.tenant_id)}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}
                  >
                    <strong>Rent:</strong> {formatCurrency(lease.monthly_rent)}/month
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}
                  >
                    <strong>Security Deposit:</strong> {formatCurrency(lease.security_deposit)}
                  </Typography>
                  {lease.maintenance_charge > 0 && (
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}
                    >
                      <strong>Maintenance:</strong> {formatCurrency(lease.maintenance_charge)}/month
                    </Typography>
                  )}
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}
                  >
                    <strong>Start:</strong> {formatDate(lease.start_date)}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}
                  >
                    <strong>End:</strong> {formatDate(lease.end_date)}
                  </Typography>
                </Box>
              </CardContent>
              
              <CardActions sx={{ 
                justifyContent: 'flex-end', 
                p: { xs: 2, md: 3 }, 
                pt: 0,
                gap: 1
              }}>
                <IconButton 
                  size="small" 
                  onClick={() => handleOpenDialog(lease)}
                  color="primary"
                  sx={{ p: { xs: 0.5, md: 1 } }}
                >
                  <EditIcon sx={{ fontSize: { xs: '1.2rem', md: '1.5rem' } }} />
                </IconButton>
                <IconButton 
                  size="small" 
                  onClick={() => handleDelete(lease.id)}
                  color="error"
                  sx={{ p: { xs: 0.5, md: 1 } }}
                >
                  <DeleteIcon sx={{ fontSize: { xs: '1.2rem', md: '1.5rem' } }} />
                </IconButton>
              </CardActions>
            </Card>
          ))}
        </Box>
      )}

      {/* Floating Action Button for Mobile */}
      <Fab
        color="primary"
        aria-label="assign lease"
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

      {/* Add/Edit Lease Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: { 
            width: { xs: '95%', sm: 'auto' },
            maxWidth: { xs: '95%', sm: 800 }
          }
        }}
      >
        <DialogTitle sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
          {editingLease ? 'Edit Lease' : 'Assign New Lease'}
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 2, md: 3 } }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, 
            gap: { xs: 2, md: 2 }, 
            mt: 1 
          }}>
            <FormControl fullWidth required size="small">
              <InputLabel>Property *</InputLabel>
              <Select
                value={formData.property_id}
                label="Property *"
                onChange={(e) => handleInputChange('property_id', e.target.value)}
              >
                {getAvailableProperties().map((property) => (
                  <MenuItem key={property.id} value={property.id}>
                    {property.name} - {property.address_line1}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth required size="small">
              <InputLabel>Tenant *</InputLabel>
              <Select
                value={formData.tenant_id}
                label="Tenant *"
                onChange={(e) => handleInputChange('tenant_id', e.target.value)}
              >
                {getAvailableTenants().map((tenant) => (
                  <MenuItem key={tenant.id} value={tenant.id}>
                    {tenant.full_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Start Date *"
              type="date"
              value={formData.start_date}
              onChange={(e) => handleInputChange('start_date', e.target.value)}
              required
              InputLabelProps={{ shrink: true }}
              size="small"
            />

            <TextField
              fullWidth
              label="End Date *"
              type="date"
              value={formData.end_date}
              onChange={(e) => handleInputChange('end_date', e.target.value)}
              required
              InputLabelProps={{ shrink: true }}
              size="small"
            />

            <TextField
              fullWidth
              label="Monthly Rent (₹) *"
              type="number"
              value={formData.monthly_rent}
              onChange={(e) => handleInputChange('monthly_rent', e.target.value)}
              required
              size="small"
            />

            <TextField
              fullWidth
              label="Security Deposit (₹) *"
              type="number"
              value={formData.security_deposit}
              onChange={(e) => handleInputChange('security_deposit', e.target.value)}
              required
              size="small"
            />

            <TextField
              fullWidth
              label="Monthly Maintenance (₹)"
              type="number"
              value={formData.maintenance_charge}
              onChange={(e) => handleInputChange('maintenance_charge', e.target.value)}
              size="small"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: { xs: 2, md: 3 } }}>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingLease ? 'Update' : 'Assign'} Lease
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Leases; 