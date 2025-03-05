import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 2),
}));

const NavButtons = styled('div')({
  display: 'flex',
  gap: '1rem',
  alignItems: 'center',
});

const WalletButton = styled(WalletMultiButton)(({ theme }) => ({
  backgroundColor: 'transparent',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
}));

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { connected, publicKey } = useWallet();

  return (
    <AppBar position="static">
      <StyledToolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          Solana App
        </Typography>
        <NavButtons>
          <Button
            color="inherit"
            onClick={() => navigate('/create')}
          >
            Create Record
          </Button>
          <Button
            color="inherit"
            onClick={() => navigate('/records')}
          >
            View Records
          </Button>
          <Box sx={{ ml: 2 }}>
            <WalletButton />
          </Box>
        </NavButtons>
      </StyledToolbar>
    </AppBar>
  );
};

export default Navbar;
