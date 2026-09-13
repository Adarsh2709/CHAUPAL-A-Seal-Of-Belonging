// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ChaupalMembership is ERC721 {
    
    struct Community {
        bytes32 id;
        string name;
        address steward;
        bytes32 merkleRoot;
        uint256 rootVersion;
        bool exists;
    }

    mapping(bytes32 => Community) public communities;
    bytes32[] public communityIds;
    
    // Mapping from seal token ID to community ID
    mapping(uint256 => bytes32) public sealCommunity;
    
    // Track if an address has claimed a seal for a community
    mapping(address => mapping(bytes32 => bool)) public hasSeal;
    
    // Token ID counter
    uint256 private _nextTokenId;

    event CommunityRegistered(bytes32 indexed id, string name, address indexed steward, bytes32 initialRoot);
    event RootUpdated(bytes32 indexed id, bytes32 oldRoot, bytes32 newRoot, uint256 version);
    event SealClaimed(address indexed member, bytes32 indexed communityId, uint256 tokenId);

    constructor() ERC721("Chaupal Seal", "CHPL") {}

    // -----------------------------------------
    // COMMUNITY MANAGEMENT
    // -----------------------------------------

    function registerCommunity(
        bytes32 id, 
        string memory name, 
        address steward, 
        bytes32 initialRoot
    ) external {
        require(!communities[id].exists, "Chaupal: Community already exists");
        
        communities[id] = Community({
            id: id,
            name: name,
            steward: steward,
            merkleRoot: initialRoot,
            rootVersion: 1,
            exists: true
        });
        
        communityIds.push(id);
        
        emit CommunityRegistered(id, name, steward, initialRoot);
    }

    function updateRoot(bytes32 id, bytes32 newRoot) external {
        require(communities[id].exists, "Chaupal: Community does not exist");
        require(communities[id].steward == msg.sender, "Chaupal: Only steward can update");

        bytes32 oldRoot = communities[id].merkleRoot;
        communities[id].merkleRoot = newRoot;
        communities[id].rootVersion += 1;

        emit RootUpdated(id, oldRoot, newRoot, communities[id].rootVersion);
    }
    
    function getAllCommunityIds() external view returns (bytes32[] memory) {
        return communityIds;
    }

    // -----------------------------------------
    // MEMBERSHIP VERIFICATION
    // -----------------------------------------

    function verifyMembership(
        bytes32 communityId,
        bytes32 memberCommitment,
        bytes32[] calldata proof
    ) public view returns (bool) {
        require(communities[communityId].exists, "Chaupal: Community does not exist");
        
        // Canonical hashing: keccak256(leaf_data) is generally keccak256(abi.encodePacked(...))
        // Here we use abi.encode to prevent hash collisions and ensure exact matching with OpenZeppelin's standardMerkleTree
        bytes32 leaf = keccak256(bytes.concat(keccak256(abi.encode(communityId, memberCommitment))));
        
        return MerkleProof.verify(proof, communities[communityId].merkleRoot, leaf);
    }

    // -----------------------------------------
    // SEAL CLAIMING & SOULBOUND LOGIC
    // -----------------------------------------

    function claimSeal(
        bytes32 communityId,
        bytes32 memberCommitment,
        bytes32[] calldata proof
    ) external {
        require(!hasSeal[msg.sender][communityId], "Chaupal: Seal already claimed for this community");
        require(verifyMembership(communityId, memberCommitment, proof), "Chaupal: Invalid membership proof");

        uint256 tokenId = _nextTokenId++;
        
        sealCommunity[tokenId] = communityId;
        hasSeal[msg.sender][communityId] = true;
        
        _safeMint(msg.sender, tokenId);
        
        emit SealClaimed(msg.sender, communityId, tokenId);
    }

    // Prevents transfers, making seals Soulbound (non-transferable)
    function _update(address to, uint256 tokenId, address auth) internal virtual override returns (address) {
        address from = _ownerOf(tokenId);
        
        // Allow minting (from == address(0))
        // Reject all other transfers
        require(from == address(0), "Chaupal: Community seals are non-transferable");
        
        return super._update(to, tokenId, auth);
    }
    
    // For rendering off-chain
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        bytes32 commId = sealCommunity[tokenId];
        
        // In a real app we would return a JSON containing SVG for the seal.
        // For the prototype we're relying on frontend displaying the event data + contract verification.
        return string(abi.encodePacked("chaupal://seal/", communities[commId].name));
    }
}
