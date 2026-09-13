# CHAUPAL — A Seal of Belonging

A privacy-preserving community membership verification system built on Ethereum, developed for the Road to Devcon IV Hackathon.

Chaupal enables Indian communities to maintain private membership registers off-chain while allowing members to cryptographically prove their belonging and claim a non-transferable (soulbound) on-chain seal.

## Architecture & Privacy Model

The core architecture is designed to completely separate private membership data from public on-chain verification.

```text
PRIVATE REGISTER  →  COMMITMENT  →  MERKLE PROOF  →  ROOT VERIFICATION  →  COMMUNITY SEAL
   (Off-chain)        (Hashed)        (Private)         (On-chain)          (Soulbound)
```

**Off-Chain Data (Private):**
- Member names, identifiers, and private credentials
- Complete community membership lists
- Internal community records

**On-Chain Data (Public):**
- Cryptographic Merkle roots (fingerprints of membership lists)
- Designated steward address per community
- Non-transferable soulbound membership seals
- Historical root versions

## Technology Stack

- **Smart Contracts:** Solidity, Foundry, ERC-721 (Soulbound implementation)
- **Frontend App:** Next.js 14, TypeScript, React Query
- **Styling:** Tailwind CSS (Custom Design System)
- **Web3 Integration:** wagmi, viem
- **Cryptography:** `@openzeppelin/merkle-tree`

## Key Features

- **Steward Isolation:** Only a community's designated steward can update its Merkle root.
- **Soulbound Seals:** Community seals cannot be transferred between wallets after claiming.
- **Zero-Knowledge Architecture:** No sensitive member data is ever stored on the blockchain.
- **Independent Governance:** 12 distinct communities managing their own independent verification trees.

## Getting Started

### Prerequisites
- Node.js (v18+)
- Foundry toolkit

### Installation & Setup

1. **Clone and install dependencies:**
   ```bash
   git clone https://github.com/Adarsh2709/CHAUPAL-A-Seal-Of-Belonging.git
   cd CHAUPAL-A-Seal-Of-Belonging
   npm install
   forge install
   ```

2. **Generate cryptographic trees:**
   ```bash
   npx ts-node scripts/generate-tree.ts all
   ```

3. **Run local environment:**
   ```bash
   npm run dev
   ```

### Smart Contract Deployment

Configure your environment variables, then deploy the contract using Foundry:

```bash
cp .env.example .env
# Configure PRIVATE_KEY and RPC_URL in .env
forge script script/Deploy.s.sol --broadcast --rpc-url $RPC_URL
```

## Testing

The project includes a comprehensive Foundry test suite verifying the smart contract invariants.

```bash
forge test
```

## License

This project is licensed under the MIT License.
