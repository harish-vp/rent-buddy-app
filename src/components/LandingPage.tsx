import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  useTheme
} from '@mui/material';
import {
  Home as HomeIcon,
  People as PeopleIcon,
  Receipt as ReceiptIcon,
  Assignment as AssignmentIcon,
  Security as SecurityIcon,
  Analytics as AnalyticsIcon,
  Login as LoginIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const features = [
    {
      icon: <HomeIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Property Management',
      description: 'Efficiently manage multiple properties with detailed information, maintenance tracking, and occupancy status.'
    },
    {
      icon: <PeopleIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Tenant Management',
      description: 'Keep track of all your tenants with contact information, lease history, and communication logs.'
    },
    {
      icon: <AssignmentIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Lease Management',
      description: 'Streamline lease agreements with automated renewal reminders, flexible terms, and digital documentation.'
    },
    {
      icon: <ReceiptIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Financial Tracking',
      description: 'Comprehensive transaction management including rent collection, maintenance charges, and utility bills.'
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Security Deposits',
      description: 'Track security deposits, advance payments, and refunds with detailed audit trails.'
    },
    {
      icon: <AnalyticsIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Analytics & Reports',
      description: 'Get insights into your rental business with detailed reports and performance analytics.'
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Navigation Bar */}
      <AppBar position="static" elevation={0} sx={{ bgcolor: 'white', color: 'text.primary' }}>
        <Toolbar>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1,
              fontWeight: 'bold',
              color: 'primary.main'
            }}
          >
            Rent Buddy
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<LoginIcon />}
            onClick={() => navigate('/login')}
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              px: 3
            }}
          >
            Login
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box sx={{ 
        bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        py: { xs: 8, md: 12 },
        textAlign: 'center'
      }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 'bold',
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
              mb: 3
            }}
          >
            Simplify Your Rental Business
          </Typography>
          <Typography 
            variant="h5" 
            component="p" 
            sx={{ 
              mb: 4,
              opacity: 0.9,
              fontSize: { xs: '1.1rem', md: '1.3rem' },
              maxWidth: '800px',
              mx: 'auto'
            }}
          >
            Rent Buddy is a comprehensive property management solution designed to help landlords 
            and property managers streamline their operations, increase efficiency, and maximize returns.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button 
              variant="contained" 
              size="large"
              startIcon={<LoginIcon />}
              onClick={() => navigate('/login')}
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                bgcolor: 'white',
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'grey.100'
                }
              }}
            >
              Get Started
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                borderColor: 'white',
                color: 'white',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              Learn More
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Typography 
          variant="h3" 
          component="h2" 
          align="center" 
          gutterBottom
          sx={{ 
            fontWeight: 'bold',
            mb: 6,
            fontSize: { xs: '2rem', md: '2.5rem' }
          }}
        >
          Why Choose Rent Buddy?
        </Typography>
        
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
          gap: 4
        }}>
          {features.map((feature, index) => (
            <Box key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8]
                  }
                }}
              >
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography 
                    variant="h6" 
                    component="h3" 
                    gutterBottom
                    sx={{ fontWeight: 'bold' }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ lineHeight: 1.6 }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </Container>

      {/* About Section */}
      <Box sx={{ bgcolor: 'grey.50', py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: 6,
            alignItems: 'center'
          }}>
            <Box>
              <Typography 
                variant="h3" 
                component="h2" 
                gutterBottom
                sx={{ 
                  fontWeight: 'bold',
                  fontSize: { xs: '2rem', md: '2.5rem' }
                }}
              >
                About Rent Buddy
              </Typography>
              <Typography 
                variant="body1" 
                paragraph
                sx={{ fontSize: '1.1rem', lineHeight: 1.7, mb: 3 }}
              >
                Rent Buddy was founded with a simple mission: to make property management 
                effortless and profitable. We understand the challenges that landlords and 
                property managers face daily, from tracking rent payments to managing 
                maintenance requests.
              </Typography>
              <Typography 
                variant="body1" 
                paragraph
                sx={{ fontSize: '1.1rem', lineHeight: 1.7, mb: 3 }}
              >
                Our platform combines powerful features with an intuitive interface, 
                helping you focus on what matters most - growing your rental business 
                and providing excellent service to your tenants.
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ fontSize: '1.1rem', lineHeight: 1.7 }}
              >
                Whether you manage a single property or a large portfolio, Rent Buddy 
                provides the tools you need to succeed in today's competitive rental market.
              </Typography>
            </Box>
            <Box>
              <Box sx={{ 
                bgcolor: 'primary.main', 
                borderRadius: 3, 
                p: 4,
                color: 'white',
                textAlign: 'center'
              }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Trusted by Property Managers
                </Typography>
                <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
                  500+
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  Properties Managed
                </Typography>
                <Typography variant="body1" sx={{ mt: 2, opacity: 0.8 }}>
                  Join hundreds of satisfied property managers who trust Rent Buddy 
                  to streamline their operations and increase their profits.
                </Typography>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ 
        bgcolor: 'primary.main', 
        color: 'white', 
        py: { xs: 6, md: 8 },
        textAlign: 'center'
      }}>
        <Container maxWidth="md">
          <Typography 
            variant="h3" 
            component="h2" 
            gutterBottom
            sx={{ 
              fontWeight: 'bold',
              fontSize: { xs: '2rem', md: '2.5rem' }
            }}
          >
            Ready to Transform Your Rental Business?
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 4,
              opacity: 0.9,
              fontSize: { xs: '1.1rem', md: '1.2rem' }
            }}
          >
            Start managing your properties more efficiently today. 
            Join thousands of property managers who trust Rent Buddy.
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            startIcon={<LoginIcon />}
            onClick={() => navigate('/login')}
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              px: 6,
              py: 2,
              fontSize: '1.2rem',
              bgcolor: 'white',
              color: 'primary.main',
              '&:hover': {
                bgcolor: 'grey.100'
              }
            }}
          >
            Start Free Trial
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: 'grey.900', color: 'white', py: 4 }}>
        <Container maxWidth="lg">
          <Typography variant="body2" align="center" sx={{ opacity: 0.7 }}>
            © 2024 Rent Buddy. All rights reserved. | 
            Simplifying property management for landlords and property managers.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage; 