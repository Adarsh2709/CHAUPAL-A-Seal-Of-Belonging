import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import { keccak256 } from 'viem';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { communityId, credential } = body;
    
    if (!communityId || !credential) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }
    
    // Simulate slight delay for dramatic effect in UI
    await new Promise(resolve => setTimeout(resolve, 800));

    // For demo purposes, the credential is just the 32-char hex memberSecret
    // In a real app we would want 0x prefixed hex
    const formattedCredential = credential.startsWith('0x') ? credential : `0x${credential}`;
    
    const treePath = path.join(process.cwd(), 'data', 'trees', `${communityId}.json`);
    
    if (!fs.existsSync(treePath)) {
      return NextResponse.json({ error: 'Community tree not found' }, { status: 404 });
    }
    
    try {
      const treeFileContent = JSON.parse(fs.readFileSync(treePath, 'utf-8'));
      const tree = StandardMerkleTree.load(treeFileContent.tree);
      
      // Recreate the leaf that we are searching for
      // Our tree leaf structure is [string, bytes32]
      const memberCommitment = keccak256(formattedCredential as `0x${string}`);
      const searchLeaf = [communityId, memberCommitment];
      
      let proof = null;
      let leafIndex = -1;
      
      for (const [i, v] of tree.entries()) {
        if (v[0] === searchLeaf[0] && v[1] === searchLeaf[1]) {
          proof = tree.getProof(i);
          leafIndex = i;
          break;
        }
      }
      
      if (!proof) {
        return NextResponse.json({ error: 'Membership not found. Invalid credential.' }, { status: 404 });
      }
      
      // Valid proof found!
      const commIdBytes32 = keccak256(Buffer.from(communityId));
      
      return NextResponse.json({
        success: true,
        communityId: commIdBytes32,
        communityIdRaw: communityId,
        memberCommitment,
        proof,
        root: tree.root
      });
      
    } catch (e) {
      console.error('Error generating proof:', e);
      return NextResponse.json({ error: 'Error generating cryptographic proof' }, { status: 500 });
    }
    
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
