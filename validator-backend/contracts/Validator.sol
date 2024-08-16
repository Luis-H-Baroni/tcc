// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "hardhat/console.sol";

contract Validator {
    
    address public owner;

    mapping (bytes32 => bytes32) hashes;

    constructor() payable {
        owner = msg.sender;
    }

    function storeHash(bytes32 documentHash, bytes32 publicKey) public {
        
        console.logBytes32(publicKey);
        console.logBytes32(documentHash);

        bytes32 existingHash = hashes[publicKey];
        require(existingHash != documentHash, "Hash already registered for this public key");

        hashes[publicKey] = documentHash;
    }
}
