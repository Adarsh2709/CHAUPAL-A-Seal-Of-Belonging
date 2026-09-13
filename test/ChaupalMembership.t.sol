// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../contracts/ChaupalMembership.sol";
import "./MockAnonAadhaar.sol";

contract ChaupalMembershipTest is Test {
    ChaupalMembership public chaupal;
    MockAnonAadhaar public mockAnonAadhaar;
    
    address public steward1 = address(0x111);
    address public steward2 = address(0x222);
    address public member = address(0x333);
    address public other = address(0x444);

    bytes32 public comm1 = keccak256("comm1");
    bytes32 public comm2 = keccak256("comm2");
    
    // Test data from small tree
    bytes32 public root1;
    bytes32 public validCommitment;
    bytes32 public invalidCommitment;
    bytes32[] public validProof;
    bytes32[] public invalidProof;
    // Test data for Anon Aadhaar
    uint256 public testAppNullifierSeed = 123456789;
    
    function setUp() public {
        mockAnonAadhaar = new MockAnonAadhaar(true);
        chaupal = new ChaupalMembership(address(mockAnonAadhaar), testAppNullifierSeed);
        
        // We will test the logic. We will populate mock proof data
        // For actual valid proof testing, we will use forge ffi or precomputed values.
        
        // Pre-computed Merkle Tree for simple test
        // Let's create a known valid merkle setup
        
        validCommitment = keccak256("secret1");
        invalidCommitment = keccak256("secret2");
        
        bytes32 leaf1 = keccak256(bytes.concat(keccak256(abi.encode(comm1, validCommitment))));
        bytes32 leaf2 = keccak256(bytes.concat(keccak256(abi.encode(comm1, keccak256("secret3")))));
        
        // Simple 2-leaf tree
        if (leaf1 < leaf2) {
            root1 = keccak256(abi.encodePacked(leaf1, leaf2));
            validProof.push(leaf2);
        } else {
            root1 = keccak256(abi.encodePacked(leaf2, leaf1));
            validProof.push(leaf2);
        }
        
        invalidProof.push(keccak256("wrong"));
    }

    function test_RegisterCommunity() public {
        chaupal.registerCommunity(comm1, "Test Comm", steward1, root1);
        
        (bytes32 id, string memory name, address st, bytes32 rt, uint256 ver, bool exists) = chaupal.communities(comm1);
        assertEq(id, comm1);
        assertEq(name, "Test Comm");
        assertEq(st, steward1);
        assertEq(rt, root1);
        assertEq(ver, 1);
        assertTrue(exists);
    }
    
    function test_StewardCanUpdateRoot() public {
        chaupal.registerCommunity(comm1, "Test Comm", steward1, root1);
        
        vm.prank(steward1);
        chaupal.updateRoot(comm1, keccak256("newroot"));
        
        (,,, bytes32 rt, uint256 ver,) = chaupal.communities(comm1);
        assertEq(rt, keccak256("newroot"));
        assertEq(ver, 2);
    }
    
    function test_WrongStewardCannotUpdate() public {
        chaupal.registerCommunity(comm1, "Test Comm", steward1, root1);
        
        vm.prank(steward2);
        vm.expectRevert("Chaupal: Only steward can update");
        chaupal.updateRoot(comm1, keccak256("newroot"));
    }
    
    function test_VerifyValidProof() public {
        chaupal.registerCommunity(comm1, "Test Comm", steward1, root1);
        
        bool isValid = chaupal.verifyMembership(comm1, validCommitment, validProof);
        assertTrue(isValid);
    }
    
    function test_VerifyInvalidProof() public {
        chaupal.registerCommunity(comm1, "Test Comm", steward1, root1);
        
        bool isValid = chaupal.verifyMembership(comm1, invalidCommitment, validProof);
        assertFalse(isValid);
        
        bool isValid2 = chaupal.verifyMembership(comm1, validCommitment, invalidProof);
        assertFalse(isValid2);
    }
    
    function test_ClaimSeal() public {
        chaupal.registerCommunity(comm1, "Test Comm", steward1, root1);
        
        uint256 nullifier = 1111;
        uint256 timestamp = 12345;
        uint256 signal = uint256(uint160(member));
        uint256[4] memory revealArray = [uint256(0), 0, 0, 0];
        uint256[8] memory groth16Proof = [uint256(0), 0, 0, 0, 0, 0, 0, 0];
        
        vm.prank(member);
        chaupal.claimSeal(comm1, validCommitment, validProof, nullifier, timestamp, signal, revealArray, groth16Proof);
        
        assertTrue(chaupal.hasSeal(member, comm1));
        assertEq(chaupal.ownerOf(0), member);
    }
    
    function test_CannotTransferSeal() public {
        chaupal.registerCommunity(comm1, "Test Comm", steward1, root1);
        
        uint256 nullifier = 1111;
        uint256 timestamp = 12345;
        uint256 signal = uint256(uint160(member));
        uint256[4] memory revealArray = [uint256(0), 0, 0, 0];
        uint256[8] memory groth16Proof = [uint256(0), 0, 0, 0, 0, 0, 0, 0];
        
        vm.prank(member);
        chaupal.claimSeal(comm1, validCommitment, validProof, nullifier, timestamp, signal, revealArray, groth16Proof);
        
        vm.prank(member);
        vm.expectRevert("Chaupal: Community seals are non-transferable");
        chaupal.transferFrom(member, other, 0);
    }

    function test_DuplicateNullifierFails() public {
        chaupal.registerCommunity(comm1, "Test Comm", steward1, root1);
        
        uint256 nullifier = 1111;
        uint256 timestamp = 12345;
        uint256 signal = uint256(uint160(member));
        uint256[4] memory revealArray = [uint256(0), 0, 0, 0];
        uint256[8] memory groth16Proof = [uint256(0), 0, 0, 0, 0, 0, 0, 0];
        
        vm.prank(member);
        chaupal.claimSeal(comm1, validCommitment, validProof, nullifier, timestamp, signal, revealArray, groth16Proof);
        
        // Attempt to claim again with the same nullifier from a different member address (to bypass the msg.sender check)
        vm.prank(other);
        vm.expectRevert("Chaupal: Human already claimed a seal");
        chaupal.claimSeal(comm1, validCommitment, validProof, nullifier, timestamp, uint256(uint160(other)), revealArray, groth16Proof);
    }

    function test_InvalidSignalFails() public {
        chaupal.registerCommunity(comm1, "Test Comm", steward1, root1);
        
        uint256 nullifier = 1111;
        uint256 timestamp = 12345;
        uint256 signal = uint256(uint160(other)); // Signal doesn't match msg.sender
        uint256[4] memory revealArray = [uint256(0), 0, 0, 0];
        uint256[8] memory groth16Proof = [uint256(0), 0, 0, 0, 0, 0, 0, 0];
        
        vm.prank(member);
        vm.expectRevert("Chaupal: Signal must be the sender address");
        chaupal.claimSeal(comm1, validCommitment, validProof, nullifier, timestamp, signal, revealArray, groth16Proof);
    }
    
    function test_InvalidAnonAadhaarProofFails() public {
        chaupal.registerCommunity(comm1, "Test Comm", steward1, root1);
        
        uint256 nullifier = 1111;
        uint256 timestamp = 12345;
        uint256 signal = uint256(uint160(member));
        uint256[4] memory revealArray = [uint256(0), 0, 0, 0];
        // groth16Proof[0] = 999 is our mock way of triggering a failure
        uint256[8] memory groth16Proof = [uint256(999), 0, 0, 0, 0, 0, 0, 0];
        
        vm.prank(member);
        vm.expectRevert("Chaupal: Invalid Anon Aadhaar proof");
        chaupal.claimSeal(comm1, validCommitment, validProof, nullifier, timestamp, signal, revealArray, groth16Proof);
    }
}
