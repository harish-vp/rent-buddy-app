import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Dashboard,
  Home,
  People,
  Receipt,
  Assignment,
  Logout,
  Settings
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  onToggle: () => void;
}

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
  { text: 'Properties', icon: <Home />, path: '/properties' },
  { text: 'Tenants', icon: <People />, path: '/tenants' },
  { text: 'Leases', icon: <Assignment />, path: '/leases' },
  { text: 'Transactions', icon: <Receipt />, path: '/transactions' },
  { text: 'Admin Config', icon: <Settings />, path: '/admin-config' },
];

const Sidebar: React.FC<SidebarProps> = ({ open, onClose, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    if (isMobile) {
      onClose();
    }
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ 
        p: 2, 
        bgcolor: 'primary.main', 
        color: 'white',
        textAlign: 'center'
      }}>
        <Typography variant="h6" component="div">
          Rent Buddy
        </Typography>
        <Typography variant="body2">
          Property Management
        </Typography>
      </Box>

      <Divider />

      {/* Navigation Menu */}
      <List sx={{ flexGrow: 1, pt: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              selected={location.pathname === item.path}
              sx={{
                mx: 1,
                borderRadius: 1,
                '&.Mui-selected': {
                  bgcolor: 'primary.light',
                  color: 'primary.contrastText',
                  '&:hover': {
                    bgcolor: 'primary.light',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ 
                color: location.pathname === item.path ? 'inherit' : 'text.secondary',
                minWidth: 40
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      {/* Logout */}
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout} sx={{ mx: 1, borderRadius: 1 }}>
            <ListItemIcon sx={{ color: 'error.main', minWidth: 40 }}>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Logout" sx={{ color: 'error.main' }} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  if (isMobile) {
    return (
      <>
        <Drawer
          variant="temporary"
          open={open}
          onClose={onClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: { xs: 280, sm: 320 },
              bgcolor: 'background.paper'
            },
          }}
        >
          {drawerContent}
        </Drawer>
      </>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 280,
        flexShrink: 0,
        display: { xs: 'none', md: 'block' },
        '& .MuiDrawer-paper': {
          width: 280,
          boxSizing: 'border-box',
          bgcolor: 'background.paper',
          borderRight: `1px solid ${theme.palette.divider}`,
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar; 