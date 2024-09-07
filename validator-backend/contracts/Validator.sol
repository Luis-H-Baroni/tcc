// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract Validator {
    struct Register {
        bytes32 hash;
        bytes32 publicKey;
        bool exists;
        Status status;
        MecConformityStatus mecConformityStatus;
    }

    // documentHash => Register
    mapping (bytes32 => Register[]) registers;    

    // VALID:0, INVALID:1, CANCELLED:2, NULL:3
    enum Status { VALID, INVALID, CANCELLED, NULL}
    // VALID:0, INVALID:1, INDETERMINATE:2, NULL:3
    enum MecConformityStatus { VALID, INVALID, INDETERMINATE, NULL }
   
    function checkRegisterOwner(bytes32 documentHash, bytes32 publicKey) public view returns (bool) {
        Register[] memory register = registers[documentHash];
        for (uint i = 0; i < register.length; i++) {
            if (register[i].publicKey == publicKey) {
                return true;
            }
        }
        return false;
    }

    function storeHash(bytes32 documentHash, bytes32 publicKey, MecConformityStatus mecConformityStatus) public {
        bool alreadyRegistered = checkRegisterOwner(documentHash, publicKey);
        require(!alreadyRegistered, "Document already registered for this public key");
        
        registers[documentHash].push(Register(documentHash, publicKey, true, Status.VALID, mecConformityStatus));
    }

    function verifyHash(bytes32 documentHash) public view returns (Register[] memory) {
        return registers[documentHash];
    }

    function updateStatus(
    bytes32 documentHash, 
    bytes32 publicKey, 
    Status status, 
    MecConformityStatus mecConformityStatus
    ) public {
        Register[] storage register = registers[documentHash];
        for (uint i = 0; i < register.length; i++) {
            if (register[i].publicKey == publicKey) {
                if (status != Status.NULL && register[i].status != status) {
                    register[i].status = status;
                    emit StatusUpdated(documentHash, publicKey, status);
                }
                
                if (mecConformityStatus != MecConformityStatus.NULL && register[i].mecConformityStatus != mecConformityStatus) {
                    register[i].mecConformityStatus = mecConformityStatus;
                    emit MecConformityStatusUpdated(documentHash, publicKey, mecConformityStatus);
                }

                break;  
            }
        }
    }


    event StatusUpdated(bytes32 indexed documentHash, bytes32 indexed publicKey, Status status);
    event MecConformityStatusUpdated(bytes32 indexed documentHash, bytes32 indexed publicKey, MecConformityStatus mecConformityStatus);

   

}
