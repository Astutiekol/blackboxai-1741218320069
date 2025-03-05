import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CreateRecord from './pages/CreateRecord';
import ViewRecords from './pages/ViewRecords';

// Import wallet styles
require('@solana/wallet-adapter-react-ui/styles.css');

const Root = styled('div')(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
}));

const Main = styled('main')(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

const App: React.FC = () => {
  // Set up Solana network and wallet
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = clusterApiUrl(network);
  const wallets = [new PhantomWalletAdapter()];

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Root>
            <Navbar />
            <Container component={Main}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/create" element={<CreateRecord />} />
                <Route path="/records" element={<ViewRecords />} />
              </Routes>
            </Container>
          </Root>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;
