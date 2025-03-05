import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import { solanaApi } from '../services/api';
import { Record } from '../types';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 900,
  margin: '0 auto',
  marginTop: theme.spacing(4),
}));

const SearchContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(4),
}));

const ViewRecords: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecords = async () => {
    if (!walletAddress) return;

    setLoading(true);
    setError(null);

    try {
      const response = await solanaApi.getRecords(walletAddress);

      if (response.success && response.data) {
        setRecords(response.data);
      } else {
        setError(response.error || 'Failed to fetch records');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <StyledPaper elevation={3}>
      <Typography variant="h5" component="h2" gutterBottom>
        View Records
      </Typography>

      <SearchContainer>
        <TextField
          label="Wallet Address"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          fullWidth
          placeholder="Enter wallet address to view records"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={fetchRecords}
          disabled={!walletAddress || loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Search'}
        </Button>
      </SearchContainer>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {records.length > 0 ? (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Author</TableCell>
                <TableCell>Data</TableCell>
                <TableCell>Timestamp</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {records.map((record, index) => (
                <TableRow key={index}>
                  <TableCell>{truncateAddress(record.author)}</TableCell>
                  <TableCell>{record.data}</TableCell>
                  <TableCell>{formatDate(record.timestamp)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="textSecondary">
            {loading
              ? 'Loading records...'
              : walletAddress
              ? 'No records found for this wallet address'
              : 'Enter a wallet address to view records'}
          </Typography>
        </Box>
      )}
    </StyledPaper>
  );
};

export default ViewRecords;
