# CHAUPAL — A Seal of Belonging

> *"Prove you belong, without opening the cupboard."*

## About

**Chaupal** is a privacy-preserving community membership verification protocol built on Ethereum. It lets real-world Indian communities — artisan guilds, farmer cooperatives, tribal networks — maintain private membership registers off-chain while allowing any member to cryptographically prove their belonging and claim a non-transferable **soulbound seal** on-chain.

No wallet address, email, device fingerprint, or IP address is used as identity. Instead, Chaupal combines **Merkle proof–based membership verification** with **Anon Aadhaar zero-knowledge proofs** to enforce a "One Human, One Claim" guarantee: a member can prove they're part of a community and that they're a unique human — all without revealing any personal data.

### The Problem

India's communities — Kashmir's pashmina weavers, Bastar's tribal artisans, Kerala's spice cooperatives — lack a way to digitally prove membership without exposing sensitive registers or relying on centralized authorities. Existing identity solutions demand personal data, while blockchain solutions often substitute wallet addresses for real identity.

### The Solution

Chaupal provides a **three-layer verification architecture**:

```
PRIVATE REGISTER  →  COMMITMENT  →  MERKLE PROOF  →  ROOT VERIFICATION  →  COMMUNITY SEAL
   (Off-chain)        (Hashed)        (Private)         (On-chain)          (Soulbound)
```

1. **Community Stewards** maintain private membership lists off-chain and publish only a cryptographic Merkle root on-chain.
2. **Members** prove belonging by generating a Merkle proof from their private credential — no raw data ever touches the chain.
3. **Anon Aadhaar** generates a Zero-Knowledge proof of unique personhood using India's Aadhaar system, ensuring one-human-one-seal without exposing any Aadhaar data.
4. A **Soulbound ERC-721 Seal** is minted — non-transferable, permanently bound to the member's wallet.

### Privacy Guarantees

| Data | Where it lives | Who sees it |
|------|----------------|-------------|
| Member names & identifiers | Off-chain only | Community steward |
| Raw Aadhaar QR data | User's device only | Nobody (processed in-browser) |
| Private credential / secret | User's device only | User only |
| Merkle root (fingerprint) | On-chain | Public (reveals nothing) |
| Soulbound seal | On-chain | Public (proves membership) |
| Nullifier (anti-sybil) | On-chain | Public (prevents double-claim) |

## Technology Stack

- **Smart Contracts:** Solidity, Foundry, ERC-721 (Soulbound implementation)
- **Identity:** [Anon Aadhaar](https://github.com/anon-aadhaar/anon-aadhaar) (Zero-Knowledge Proofs over India's Aadhaar)
- **Cryptography:** `@openzeppelin/merkle-tree`, Groth16 ZK-SNARKs
- **Frontend:** Next.js 14, TypeScript, React, Tailwind CSS
- **Web3:** wagmi, viem, Ethereum (Sepolia testnet)

## Key Features

- **Zero-Knowledge Identity:** Prove you're a unique Indian resident without revealing name, age, gender, or address.
- **Steward Isolation:** Only a community's designated steward can update its membership Merkle root.
- **Soulbound Seals:** Community seals are non-transferable ERC-721 tokens permanently bound to the claimer's wallet.
- **One Human, One Claim:** Anon Aadhaar nullifiers prevent the same person from claiming multiple seals in a community.
- **12 Indian Communities:** Kashmir Handicraft Circle, Bastar Tribal Art Collective, Kerala Spice Cooperative, and 9 more — each with independent governance.

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

4. **Open** `http://localhost:3000` and follow the verification flow:
   - Select a community → Enter your private credential → Generate Merkle Proof
   - Connect wallet → Verify identity via Anon Aadhaar → Claim your Seal

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

## Built For

**Road to Devcon IV** — Loops House Hackathon

## License

This project is licensed under the MIT License.
