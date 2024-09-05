// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "hardhat/console.sol";

contract Validator {
    struct Register {
        bytes32 hash;
        bytes32 publicKey;
        bool exists;
        bool valid;
    }

    // documentHash => Register
    mapping (bytes32 => Register[]) registers;    

   
    function checkRegisterOwner(bytes32 documentHash, bytes32 publicKey) public view returns (bool) {
        Register[] memory register = registers[documentHash];
        for (uint i = 0; i < register.length; i++) {
            if (register[i].publicKey == publicKey) {
                return true;
            }
        }
        return false;
    }

    function storeHash(bytes32 documentHash, bytes32 publicKey) public {
        
        console.logBytes32(publicKey);
        console.logBytes32(documentHash);

        bool alreadyRegistered = checkRegisterOwner(documentHash, publicKey);
        require(!alreadyRegistered, "Document already registered for this public key");
        

        registers[documentHash].push(Register(documentHash, publicKey, true, true));
    }

    function verifyHash(bytes32 documentHash) public view returns (Register[] memory) {
        return registers[documentHash];
    }

    function updateStatus(bytes32 documentHash, bytes32 publicKey, bool status) public {
        console.logBool(status);
        Register[] storage register = registers[documentHash];
        for (uint i = 0; i < register.length; i++) {
            if (register[i].publicKey == publicKey) {
                register[i].valid = status;
            }
        }
    }

}
