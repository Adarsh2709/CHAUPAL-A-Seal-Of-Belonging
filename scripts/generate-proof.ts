import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import * as fs from 'fs';
import { keccak256 } from 'viem';

const communityId = process.argv[2];
const memberSecret = process.argv[3];

if (!communityId || !memberSecret) {
  console.error('Usage: ts-node scripts/generate-proof.ts <communityId> <memberSecret>');
  process.exit(1);
}

const treeFile = `./data/trees/${communityId}.json`;
if (!fs.existsSync(treeFile)) {
  console.error(`Tree not found for community: ${communityId}`);
  process.exit(1);
}

const { tree: treeData } = JSON.parse(fs.readFileSync(treeFile, 'utf-8'));
const tree = StandardMerkleTree.load(treeData);

const memberCommitment = keccak256(Buffer.from(memberSecret, 'hex'));
const searchValue = [communityId, memberCommitment];

let proof = null;
for (const [i, v] of tree.entries()) {
  if (v[0] === searchValue[0] && v[1] === searchValue[1]) {
    proof = tree.getProof(i);
    break;
  }
}

if (!proof) {
  console.error('Member not found in tree');
  process.exit(1);
}

console.log(JSON.stringify({
  communityId,
  memberCommitment,
  proof,
  root: tree.root
}, null, 2));
