import React, { useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  useTheme
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const theme = useTheme();

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { xs: '100%', md: `calc(100% - 280px)` },
          ml: { xs: 0, md: '280px' },
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleSidebarToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography 
            variant="h6" 
            noWrap 
            component="div"
            sx={{ 
              fontSize: { xs: '1rem', sm: '1.25rem' },
              flexGrow: 1
            }}
          >
            Rent Buddy - Property Management
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        onClose={handleSidebarClose}
        onToggle={handleSidebarToggle}
      />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { xs: '100%', md: `calc(100% - 280px)` },
          minHeight: '100vh',
          bgcolor: 'background.default'
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }} /> {/* Spacer for AppBar */}
        <Box sx={{ 
          p: { xs: 1, sm: 2, md: 3 },
          maxWidth: '100%',
          overflow: 'hidden'
        }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout; 