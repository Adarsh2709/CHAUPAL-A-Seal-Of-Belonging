// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@anon-aadhaar/contracts/interfaces/IAnonAadhaar.sol";

contract MockAnonAadhaar is IAnonAadhaar {
    bool public shouldPass;

    constructor(bool _shouldPass) {
        shouldPass = _shouldPass;
    }

    function setShouldPass(bool _shouldPass) external {
        shouldPass = _shouldPass;
    }

    function verifyAnonAadhaarProof(
        uint nullifierSeed,
        uint nullifier,
        uint timestamp,
        uint signal,
        uint[4] memory revealArray,
        uint[8] memory groth16Proof
    ) external view override returns (bool) {
        // If groth16Proof[0] is 999, it simulates an invalid proof regardless of state
        if (groth16Proof[0] == 999) {
            return false;
        }
        return shouldPass;
    }
}
