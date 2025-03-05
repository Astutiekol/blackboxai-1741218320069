# Solana Full-stack Application

A full-stack application built with Solana blockchain, Node.js backend, and React frontend.

## Project Structure

```
solana-fullstack/
├── backend/           # Node.js Express backend
├── frontend/         # React TypeScript frontend
└── contracts/        # Solana smart contracts
```

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Solana CLI tools
- Rust and Cargo (for smart contract development)

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

The backend server will start on http://localhost:3001

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm start
```

The frontend application will start on http://localhost:3000

## Features

- Create and store records on Solana blockchain
- View records associated with a wallet address
- Modern Material-UI interface
- TypeScript support
- RESTful API backend

## API Endpoints

### Solana Records

- `POST /api/solana/record` - Create a new record
- `PUT /api/solana/record` - Update an existing record
- `GET /api/solana/records/:walletAddress` - Get records for a wallet address

## Environment Variables

### Backend
```
PORT=3001
SOLANA_NETWORK=devnet
SOLANA_RPC_URL=https://api.devnet.solana.com
PROGRAM_ID=your_program_id
```

### Frontend
```
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_SOLANA_NETWORK=devnet
REACT_APP_SOLANA_RPC_URL=https://api.devnet.solana.com
```

## Development

### Code Style

- Backend uses ESLint and Prettier for code formatting
- Frontend follows TypeScript best practices
- Material-UI components for consistent design

### Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
