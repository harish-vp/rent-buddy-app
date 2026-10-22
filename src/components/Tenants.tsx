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
  People as PeopleIcon,
  Email as EmailIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';
import { storageService } from '../services/storageService';
import { Tenant } from '../types';

const Tenants: React.FC = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    contact_email: '',
    contact_phone: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allTenants = storageService.getTenants();
    setTenants(allTenants);
  };

  const handleOpenDialog = (tenant?: Tenant) => {
    if (tenant) {
      setEditingTenant(tenant);
      setFormData({
        full_name: tenant.full_name,
        contact_email: tenant.contact_email || '',
        contact_phone: tenant.contact_phone || ''
      });
    } else {
      setEditingTenant(null);
      setFormData({
        full_name: '',
        contact_email: '',
        contact_phone: ''
      });
    }
    setOpenDialog(true);
    setError('');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTenant(null);
    setError('');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Validation
    if (!formData.full_name.trim()) {
      setError('Please enter the tenant\'s full name');
      return;
    }

    const tenantData = {
      full_name: formData.full_name.trim(),
      contact_email: formData.contact_email.trim() || undefined,
      contact_phone: formData.contact_phone.trim() || undefined,
      is_active: true
    };

    if (editingTenant) {
      const updated = storageService.updateTenant(editingTenant.id, tenantData);
      if (updated) {
        loadData();
        handleCloseDialog();
      }
    } else {
      storageService.addTenant(tenantData);
      loadData();
      handleCloseDialog();
    }
  };

  const handleDelete = (tenantId: string) => {
    if (window.confirm('Are you sure you want to delete this tenant?')) {
      storageService.deleteTenant(tenantId);
      loadData();
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
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
          <PeopleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Tenants
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
          Add Tenant
        </Button>
      </Box>

      {tenants.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 4 }}>
          <CardContent>
            <PeopleIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Tenants Added
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Start by adding your first tenant to manage
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Add Your First Tenant
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
          gap: { xs: 2, md: 3 } 
        }}>
          {tenants.map((tenant) => (
            <Card key={tenant.id} sx={{ height: '100%' }}>
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar 
                    sx={{ 
                      bgcolor: 'primary.main', 
                      mr: 2,
                      width: { xs: 40, md: 48 },
                      height: { xs: 40, md: 48 },
                      fontSize: { xs: '0.875rem', md: '1rem' }
                    }}
                  >
                    {getInitials(tenant.full_name)}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography 
                      variant="h6" 
                      component="h2"
                      sx={{ 
                        fontSize: { xs: '1rem', md: '1.25rem' }
                      }}
                    >
                      {tenant.full_name}
                    </Typography>
                    <Chip 
                      label={tenant.is_active ? 'Active' : 'Inactive'} 
                      size="small" 
                      color={tenant.is_active ? 'success' : 'default'}
                      variant="outlined"
                      sx={{ fontSize: { xs: '0.7rem', md: '0.75rem' } }}
                    />
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {tenant.contact_email && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EmailIcon fontSize="small" color="action" />
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}
                      >
                        {tenant.contact_email}
                      </Typography>
                    </Box>
                  )}
                  
                  {tenant.contact_phone && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PhoneIcon fontSize="small" color="action" />
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}
                      >
                        {tenant.contact_phone}
                      </Typography>
                    </Box>
                  )}
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
                  onClick={() => handleOpenDialog(tenant)}
                  color="primary"
                  sx={{ p: { xs: 0.5, md: 1 } }}
                >
                  <EditIcon sx={{ fontSize: { xs: '1.2rem', md: '1.5rem' } }} />
                </IconButton>
                <IconButton 
                  size="small" 
                  onClick={() => handleDelete(tenant.id)}
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
        aria-label="add tenant"
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

      {/* Add/Edit Tenant Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
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
          {editingTenant ? 'Edit Tenant' : 'Add New Tenant'}
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 2, md: 3 } }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              label="Full Name *"
              value={formData.full_name}
              onChange={(e) => handleInputChange('full_name', e.target.value)}
              required
              size="small"
            />
            
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={formData.contact_email}
              onChange={(e) => handleInputChange('contact_email', e.target.value)}
              size="small"
            />

            <TextField
              fullWidth
              label="Phone Number"
              type="tel"
              value={formData.contact_phone}
              onChange={(e) => handleInputChange('contact_phone', e.target.value)}
              size="small"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: { xs: 2, md: 3 } }}>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingTenant ? 'Update' : 'Add'} Tenant
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Tenants; 