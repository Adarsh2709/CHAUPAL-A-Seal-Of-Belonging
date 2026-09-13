import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import * as fs from 'fs';
import * as path from 'path';
import { keccak256, encodeAbiParameters, parseAbiType } from 'viem';

const communitiesDir = './data/communities';
const treesDir = './data/trees';

if (!fs.existsSync(treesDir)) fs.mkdirSync(treesDir);

const files = fs.readdirSync(communitiesDir);

for (const file of files) {
  const comm = JSON.parse(fs.readFileSync(path.join(communitiesDir, file), 'utf-8'));
  
  const leaves = comm.members.map((member: any) => {
    // Canonical leaf: keccak256(abi.encode(communityId, memberCommitment))
    const memberCommitment = keccak256(Buffer.from(member.memberSecret, 'hex')); 
    // Simplified for prototype: memberCommitment is hash(secret)
    // Actually the contract expects hash(keccak256(abi.encode(communityId, memberCommitment)))
    // Let's adjust to match contract:
    return [comm.communityId, memberCommitment];
  });

  const tree = StandardMerkleTree.of(leaves, ["bytes32", "bytes32"]);
  
  fs.writeFileSync(path.join(treesDir, `${comm.communityId}.json`), JSON.stringify({
    root: tree.root,
    tree: tree.dump()
  }, null, 2));
  
  console.log(`Generated tree for ${comm.name}: ${tree.root}`);
}
