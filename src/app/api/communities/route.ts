import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const communitiesDir = path.join(process.cwd(), 'data', 'communities');
    const treesDir = path.join(process.cwd(), 'data', 'trees');
    
    if (!fs.existsSync(communitiesDir)) {
      return NextResponse.json({ error: 'Communities not found' }, { status: 404 });
    }
    
    const files = fs.readdirSync(communitiesDir);
    const communities = [];
    
    for (const file of files) {
      const data = JSON.parse(fs.readFileSync(path.join(communitiesDir, file), 'utf-8'));
      
      let root = null;
      try {
        const treeData = JSON.parse(fs.readFileSync(path.join(treesDir, `${data.communityId}.json`), 'utf-8'));
        root = treeData.root;
      } catch (e) {
        // Tree might not exist yet
      }
      
      // DO NOT RETURN MEMBER DATA
      communities.push({
        id: data.communityId,
        name: data.name,
        region: data.region,
        description: data.description,
        stewardName: data.stewardName,
        memberCount: data.members.length,
        currentRoot: root
      });
    }
    
    return NextResponse.json({ communities });
  } catch (error) {
    console.error('Error fetching communities:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
