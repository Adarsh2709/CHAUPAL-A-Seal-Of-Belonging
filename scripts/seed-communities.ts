import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import * as fs from 'fs';
import * as path from 'path';
import { keccak256 } from 'viem';

const communitiesDir = './data/communities';
const treesDir = './data/trees';
const outputFile = './data/seed-data.json';

if (!fs.existsSync(treesDir)) fs.mkdirSync(treesDir, { recursive: true });

const files = fs.readdirSync(communitiesDir);
const seedData = [];

for (const file of files) {
  const comm = JSON.parse(fs.readFileSync(path.join(communitiesDir, file), 'utf-8'));
  
  const leaves = comm.members.map((member: any) => {
    const memberCommitment = keccak256(`0x${member.memberSecret}`);
    return [comm.communityId, memberCommitment];
  });

  const tree = StandardMerkleTree.of(leaves, ["string", "bytes32"]);
  
  fs.writeFileSync(path.join(treesDir, `${comm.communityId}.json`), JSON.stringify({
    root: tree.root,
    tree: tree.dump()
  }, null, 2));
  
  const commIdBytes32 = keccak256(Buffer.from(comm.communityId));
  
  seedData.push({
    id: commIdBytes32,
    name: comm.name,
    region: comm.region,
    description: comm.description,
    stewardName: comm.stewardName,
    root: tree.root,
    memberCount: comm.members.length
  });
  
  console.log(`Generated tree for ${comm.name}: ${tree.root}`);
}

fs.writeFileSync(outputFile, JSON.stringify(seedData, null, 2));
console.log(`\nSeed data written to ${outputFile}`);
