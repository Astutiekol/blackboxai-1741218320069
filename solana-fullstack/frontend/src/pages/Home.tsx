import React from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  maxWidth: 600,
  margin: '0 auto',
  marginTop: theme.spacing(4),
}));

const ButtonContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  justifyContent: 'center',
  marginTop: theme.spacing(4),
}));

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <StyledPaper elevation={3}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome to Solana Record Manager
      </Typography>
      <Typography variant="body1" paragraph>
        This application allows you to create and manage records on the Solana blockchain.
        Get started by creating a new record or viewing existing ones.
      </Typography>
      <ButtonContainer>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate('/create')}
        >
          Create New Record
        </Button>
        <Button
          variant="outlined"
          color="primary"
          size="large"
          onClick={() => navigate('/records')}
        >
          View Records
        </Button>
      </ButtonContainer>
    </StyledPaper>
  );
};

export default Home;
