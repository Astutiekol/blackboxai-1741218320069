import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { solanaApi } from '../services/api';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 600,
  margin: '0 auto',
  marginTop: theme.spacing(4),
}));

const Form = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  marginTop: theme.spacing(3),
}));

const CreateRecord: React.FC = () => {
  const [data, setData] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await solanaApi.createRecord({
        data,
        walletAddress,
      });

      if (response.success) {
        setSuccess('Record created successfully!');
        setData('');
        setWalletAddress('');
      } else {
        setError(response.error || 'Failed to create record');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledPaper elevation={3}>
      <Typography variant="h5" component="h2" gutterBottom>
        Create New Record
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        Enter your data and wallet address to create a new record on the Solana blockchain.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <TextField
          label="Data"
          value={data}
          onChange={(e) => setData(e.target.value)}
          required
          fullWidth
          multiline
          rows={4}
          placeholder="Enter your record data here"
        />

        <TextField
          label="Wallet Address"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          required
          fullWidth
          placeholder="Enter your Solana wallet address"
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={loading}
          >
            {loading ? (
              <>
                <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                Creating...
              </>
            ) : (
              'Create Record'
            )}
          </Button>
        </Box>
      </Form>
    </StyledPaper>
  );
};

export default CreateRecord;
