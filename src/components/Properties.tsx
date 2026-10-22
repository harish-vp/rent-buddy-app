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
  Fab
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { storageService } from '../services/storageService';
import { Property, PropertyType } from '../types';

const Properties: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'India',
    property_type_id: '',
    number_of_bedrooms: '',
    number_of_bathrooms: '',
    area_sq_ft: '',
    description: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allProperties = storageService.getProperties();
    const allPropertyTypes = storageService.getPropertyTypes();
    setProperties(allProperties);
    setPropertyTypes(allPropertyTypes);
  };

  const handleOpenDialog = (property?: Property) => {
    if (property) {
      setEditingProperty(property);
      setFormData({
        name: property.name,
        address_line1: property.address_line1,
        address_line2: property.address_line2 || '',
        city: property.city,
        state: property.state,
        postal_code: property.postal_code,
        country: property.country,
        property_type_id: property.property_type_id,
        number_of_bedrooms: property.number_of_bedrooms?.toString() || '',
        number_of_bathrooms: property.number_of_bathrooms?.toString() || '',
        area_sq_ft: property.area_sq_ft?.toString() || '',
        description: property.description || ''
      });
    } else {
      setEditingProperty(null);
      setFormData({
        name: '',
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'India',
        property_type_id: '',
        number_of_bedrooms: '',
        number_of_bathrooms: '',
        area_sq_ft: '',
        description: ''
      });
    }
    setOpenDialog(true);
    setError('');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProperty(null);
    setError('');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Validation
    if (!formData.name.trim() || !formData.address_line1.trim() || 
        !formData.city.trim() || !formData.state.trim() || 
        !formData.postal_code.trim() || !formData.property_type_id) {
      setError('Please fill in all required fields');
      return;
    }

    const propertyData = {
      name: formData.name.trim(),
      address_line1: formData.address_line1.trim(),
      address_line2: formData.address_line2.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      postal_code: formData.postal_code.trim(),
      country: formData.country,
      property_type_id: formData.property_type_id,
      number_of_bedrooms: formData.number_of_bedrooms ? parseInt(formData.number_of_bedrooms) : undefined,
      number_of_bathrooms: formData.number_of_bathrooms ? parseInt(formData.number_of_bathrooms) : undefined,
      area_sq_ft: formData.area_sq_ft ? parseFloat(formData.area_sq_ft) : undefined,
      description: formData.description.trim(),
      is_active: true
    };

    if (editingProperty) {
      const updated = storageService.updateProperty(editingProperty.id, propertyData);
      if (updated) {
        loadData();
        handleCloseDialog();
      }
    } else {
      storageService.addProperty(propertyData);
      loadData();
      handleCloseDialog();
    }
  };

  const handleDelete = (propertyId: string) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      storageService.deleteProperty(propertyId);
      loadData();
    }
  };

  const getPropertyTypeName = (typeId: string) => {
    const type = propertyTypes.find(t => t.id === typeId);
    return type ? type.name : 'Unknown';
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
          <HomeIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Properties
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
          Add Property
        </Button>
      </Box>

      {properties.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 4 }}>
          <CardContent>
            <HomeIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Properties Added
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Start by adding your first property to manage
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Add Your First Property
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
          gap: { xs: 2, md: 3 }
        }}>
          {properties.map((property) => (
            <Card key={property.id} sx={{ height: '100%' }}>
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
                    {property.name}
                  </Typography>
                  <Chip 
                    label={getPropertyTypeName(property.property_type_id)} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                    sx={{ fontSize: { xs: '0.7rem', md: '0.75rem' } }}
                  />
                </Box>
                
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    mb: 2,
                    fontSize: { xs: '0.8rem', md: '0.875rem' }
                  }}
                >
                  {property.address_line1}
                  {property.address_line2 && `, ${property.address_line2}`}
                  <br />
                  {property.city}, {property.state} {property.postal_code}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  {property.number_of_bedrooms && (
                    <Chip 
                      label={`${property.number_of_bedrooms} Beds`} 
                      size="small"
                      sx={{ fontSize: { xs: '0.7rem', md: '0.75rem' } }}
                    />
                  )}
                  {property.number_of_bathrooms && (
                    <Chip 
                      label={`${property.number_of_bathrooms} Baths`} 
                      size="small"
                      sx={{ fontSize: { xs: '0.7rem', md: '0.75rem' } }}
                    />
                  )}
                  {property.area_sq_ft && (
                    <Chip 
                      label={`${property.area_sq_ft} sq ft`} 
                      size="small"
                      sx={{ fontSize: { xs: '0.7rem', md: '0.75rem' } }}
                    />
                  )}
                </Box>

                {property.description && (
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}
                  >
                    {property.description}
                  </Typography>
                )}
              </CardContent>
              
              <CardActions sx={{ 
                justifyContent: 'flex-end', 
                p: { xs: 2, md: 3 }, 
                pt: 0,
                gap: 1
              }}>
                <IconButton 
                  size="small" 
                  onClick={() => handleOpenDialog(property)}
                  color="primary"
                  sx={{ p: { xs: 0.5, md: 1 } }}
                >
                  <EditIcon sx={{ fontSize: { xs: '1.2rem', md: '1.5rem' } }} />
                </IconButton>
                <IconButton 
                  size="small" 
                  onClick={() => handleDelete(property.id)}
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
        aria-label="add property"
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

      {/* Add/Edit Property Dialog */}
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
          {editingProperty ? 'Edit Property' : 'Add New Property'}
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
            <TextField
              fullWidth
              label="Property Name *"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
              size="small"
            />
            
            <FormControl fullWidth required size="small">
              <InputLabel>Property Type *</InputLabel>
              <Select
                value={formData.property_type_id}
                label="Property Type *"
                onChange={(e) => handleInputChange('property_type_id', e.target.value)}
              >
                {propertyTypes.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Address Line 1 *"
              value={formData.address_line1}
              onChange={(e) => handleInputChange('address_line1', e.target.value)}
              required
              size="small"
            />

            <TextField
              fullWidth
              label="Address Line 2"
              value={formData.address_line2}
              onChange={(e) => handleInputChange('address_line2', e.target.value)}
              size="small"
            />

            <TextField
              fullWidth
              label="City *"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              required
              size="small"
            />

            <TextField
              fullWidth
              label="State *"
              value={formData.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              required
              size="small"
            />

            <TextField
              fullWidth
              label="Postal Code *"
              value={formData.postal_code}
              onChange={(e) => handleInputChange('postal_code', e.target.value)}
              required
              size="small"
            />

            <TextField
              fullWidth
              label="Country"
              value={formData.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
              size="small"
            />

            <TextField
              fullWidth
              label="Number of Bedrooms"
              type="number"
              value={formData.number_of_bedrooms}
              onChange={(e) => handleInputChange('number_of_bedrooms', e.target.value)}
              size="small"
            />

            <TextField
              fullWidth
              label="Number of Bathrooms"
              type="number"
              value={formData.number_of_bathrooms}
              onChange={(e) => handleInputChange('number_of_bathrooms', e.target.value)}
              size="small"
            />

            <TextField
              fullWidth
              label="Area (sq ft)"
              type="number"
              value={formData.area_sq_ft}
              onChange={(e) => handleInputChange('area_sq_ft', e.target.value)}
              size="small"
            />

            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}
              size="small"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: { xs: 2, md: 3 } }}>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingProperty ? 'Update' : 'Add'} Property
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Properties; 