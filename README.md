# Chaupal — A Seal of Belonging

Privacy-preserving community membership verification on Ethereum. Members prove they belong using Merkle proofs and receive a non-transferable on-chain seal, without revealing the membership list.

Built for Road to Devcon IV.

## How It Works

Each community keeps its membership register off-chain. Only a Merkle root is published on-chain. A member presents their private credential to generate a proof, the smart contract verifies it against the root, and a soulbound (non-transferable) seal is minted.

No member data touches the chain.

## Stack

- **Contract**: Solidity, Foundry, ERC-721 (soulbound)
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Wallet**: wagmi, viem
- **Proofs**: @openzeppelin/merkle-tree

## Setup

```bash
npm install
forge install
npx ts-node scripts/generate-tree.ts all
```

## Build & Test

```bash
forge build
forge test       # 7 tests
npm run lint
npm run build
npm run dev      # http://localhost:3000
```

## Deploy

```bash
cp .env.example .env   # fill in keys
forge script script/Deploy.s.sol --broadcast --rpc-url $RPC_URL
```

## License

MIT