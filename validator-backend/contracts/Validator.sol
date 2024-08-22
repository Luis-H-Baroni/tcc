// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "hardhat/console.sol";

contract Validator {
    struct Document {
        bytes32 hash;
        bytes32 publicKey;
        bool exists;
        bool valid;
    }

    // documentHash => Document
    mapping (bytes32 => Document) documents;    

   
    

    function storeHash(bytes32 documentHash, bytes32 publicKey) public {
        
        console.logBytes32(publicKey);
        console.logBytes32(documentHash);

        bytes32 ownerPublicKey = documents[documentHash].publicKey;
        require(ownerPublicKey != publicKey, "Document already registered by this public key");
        require(ownerPublicKey == 0x0, "Document already exists");

        documents[documentHash] = Document(documentHash, publicKey, true, true);
    }

     function verifyHash(bytes32 documentHash) public view returns (bool, bool, bytes32) {
        Document memory document = documents[documentHash];
        return (document.exists, document.valid, document.publicKey);
    }

}
