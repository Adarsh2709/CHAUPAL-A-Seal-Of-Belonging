// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../contracts/ChaupalMembership.sol";

contract DeployChaupal is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address verifierAddress = vm.envOr("VERIFIER_ADDRESS", address(0));
        uint256 appSeed = vm.envOr("APP_NULLIFIER_SEED", uint256(123456789));

        vm.startBroadcast(deployerPrivateKey);

        ChaupalMembership chaupal = new ChaupalMembership(verifierAddress, appSeed);
        console.log("ChaupalMembership deployed to:", address(chaupal));

        vm.stopBroadcast();
    }
}
