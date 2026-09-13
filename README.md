# CHAUPAL — A Seal of Belonging

> Prove you belong to your community without revealing the membership list.

**Road to Devcon IV — Hackathon Submission**

---

## What is Chaupal?

Chaupal is a privacy-preserving community membership verification system built on Ethereum. Twelve Indian communities maintain private membership registers off-chain. Members prove their belonging using cryptographic Merkle proofs and receive a non-transferable (soulbound) on-chain seal — without revealing who else is on the list.

### The Privacy Model

```
PRIVATE REGISTER → COMMITMENT → MERKLE PROOF → ROOT VERIFIED → COMMUNITY SEAL
     off-chain       hashed        private        on-chain        soulbound
```

**What stays private:**
- Member names, identifiers, credentials
- Full membership lists
- Community internal records

**What goes on-chain:**
- Community Merkle root (cryptographic fingerprint only)
- Steward address per community
- Soulbound membership seals (non-transferable)
- Root version history

---

## Architecture

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Smart Contract | Solidity (Foundry) | Community registration, root management, seal minting |
| Frontend | Next.js 14 + TypeScript | Application UI |
| Wallet Integration | wagmi + viem | Wallet connection and contract interaction |
| Merkle Trees | @openzeppelin/merkle-tree | Proof generation and verification |
| Styling | Tailwind CSS | Design system |

### Smart Contract — `ChaupalMembership.sol`

- Community registration with independent stewards
- Merkle root publishing (steward-isolated — Steward A cannot update Community B)
- On-chain proof verification via `MerkleProof.verify()`
- Non-transferable (soulbound) seal minting via ERC-721 with transfer override
- Duplicate seal prevention per community per wallet
- Root versioning

### Key Invariants

- **Steward isolation**: Only the registered steward can update a community's root
- **Non-transferable seals**: `_update()` override prevents all transfers after minting
- **No private data on-chain**: Member lists, credentials, and identities stay off-chain
- **Real cryptographic verification**: No mocked proofs, no hardcoded results

---

## Project Structure

```
contracts/                  Solidity smart contracts
  ChaupalMembership.sol     Main contract (ERC-721 soulbound)
test/
  ChaupalMembership.t.sol   Foundry tests (7 tests)
script/
  Deploy.s.sol              Deployment script
data/
  communities/              12 community JSON files (private member data)
  trees/                    Generated Merkle trees (gitignored)
scripts/
  generate-tree.ts          Merkle tree generation
  generate-proof.ts         Proof generation utility
  seed-communities.ts       Community data seeder
src/
  app/                      Next.js pages
    api/communities/         Community listing API (public data only)
    api/proof/               Merkle proof generation API
    communities/             Community directory + detail pages
    verify/                  Membership verification flow
    seals/                   My Seals page
    steward/                 Steward Console
    events/                  Community events
  components/
    Navbar.tsx               Navigation with wallet indicator
    Providers.tsx            wagmi + React Query providers
  lib/
    utils.ts                 Utility functions
```

---

## Setup

### Prerequisites

- Node.js ≥ 18
- [Foundry](https://book.getfoundry.sh/getting-started/installation)

### Install

```bash
git clone https://github.com/Adarsh2709/CHAUPAL-A-Seal-Of-Belonging.git
cd CHAUPAL-A-Seal-Of-Belonging

# Install Node dependencies
npm install

# Install Foundry dependencies
forge install
```

### Generate Merkle Trees

```bash
npx ts-node scripts/generate-tree.ts all
```

### Build & Test

```bash
# Smart contract
forge build
forge test

# Frontend
npm run lint
npm run build
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Deploy Contract

```bash
cp .env.example .env
# Fill in PRIVATE_KEY, RPC_URL, ETHERSCAN_API_KEY

forge script script/Deploy.s.sol --broadcast --rpc-url $RPC_URL
```

Set `NEXT_PUBLIC_CONTRACT_ADDRESS` in `.env.local` after deployment.

---

## Demo Flow

1. **Community Directory** → Browse 12 communities
2. **Select a community** → View public metadata (member count, steward, root)
3. **Prove Membership** → Enter private credential → Generate Merkle proof
4. **Connect Wallet** → Sign transaction
5. **Claim Seal** → Receive non-transferable community seal
6. **My Seals** → View soulbound seals bound to your wallet
7. **Steward Console** → Update Merkle root (steward only)

---

## Smart Contract Tests

All 7 tests pass:

| Test | Description |
|------|-------------|
| `test_RegisterCommunity` | Community registration with steward |
| `test_StewardCanUpdateRoot` | Steward can publish new Merkle root |
| `test_WrongStewardCannotUpdate` | Non-steward update is rejected |
| `test_VerifyValidProof` | Valid Merkle proof passes verification |
| `test_VerifyInvalidProof` | Invalid proof is rejected |
| `test_ClaimSeal` | Member can claim a non-transferable seal |
| `test_CannotTransferSeal` | Seal transfer is blocked (soulbound) |

---

## The Twelve Communities

| Community | Region |
|-----------|--------|
| Punjabi Sangat | Punjab |
| Ganesh Mandal | Maharashtra |
| Nagaland Weavers Collective | Nagaland |
| Bengali Durga Committee | West Bengal |
| Kerala Reading Circle | Kerala |
| Tamil Arts Sabha | Tamil Nadu |
| Rajasthan Craft Guild | Rajasthan |
| Kashmir Handicraft Circle | Kashmir |
| Assam Bihu Committee | Assam |
| Odisha Folk Collective | Odisha |
| Delhi Community Katta | Delhi |
| Goa Cultural Mandal | Goa |

---

## License

MIT