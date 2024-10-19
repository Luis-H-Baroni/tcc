// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract Validator {
    struct Record {
        bytes32 hash;
        bytes32 publicKey;
        bool exists;
        Status status;
        MecConformityStatus mecConformityStatus;
        uint256 createdAt;
        uint256 statusUpdatedAt;
        uint256 mecConformityStatusUpdatedAt;
    }

    // documentHash => Record
    mapping(bytes32 => Record[]) records;

    // VALID:0, INVALID:1, CANCELLED:2, NULL:3
    enum Status {
        VALID,
        INVALID,
        CANCELLED,
        NULL
    }
    // VALID:0, INVALID:1, INDETERMINATE:2, NULL:3
    enum MecConformityStatus {
        VALID,
        INVALID,
        INDETERMINATE,
        NULL
    }

    function checkRecordOwner(
        bytes32 documentHash,
        bytes32 publicKey
    ) public view returns (bool) {
        Record[] memory record = records[documentHash];
        for (uint i = 0; i < record.length; i++) {
            if (record[i].publicKey == publicKey) {
                return true;
            }
        }
        return false;
    }

    function storeRecord(
        bytes32 documentHash,
        bytes32 publicKey,
        MecConformityStatus mecConformityStatus
    ) public {
        bool alreadyRegistered = checkRecordOwner(documentHash, publicKey);
        require(!alreadyRegistered, 'Document already registered for this public key');

        records[documentHash].push(
            Record(
                documentHash,
                publicKey,
                true,
                Status.VALID,
                mecConformityStatus,
                block.timestamp,
                block.timestamp,
                mecConformityStatus == MecConformityStatus.NULL ? 0 : block.timestamp
            )
        );
    }

    function getRecords(bytes32 documentHash) public view returns (Record[] memory) {
        return records[documentHash];
    }

    function updateRecordStatus(
        bytes32 documentHash,
        bytes32 publicKey,
        Status status,
        MecConformityStatus mecConformityStatus
    ) public {
        Record[] storage record = records[documentHash];
        for (uint i = 0; i < record.length; i++) {
            if (record[i].publicKey == publicKey) {
                if (status != Status.NULL && record[i].status != status) {
                    record[i].status = status;
                    record[i].statusUpdatedAt = block.timestamp;
                    emit StatusUpdated(documentHash, publicKey, status);
                }

                if (mecConformityStatus != MecConformityStatus.NULL) {
                    record[i].mecConformityStatusUpdatedAt = block.timestamp;

                    if (record[i].mecConformityStatus != mecConformityStatus) {
                        record[i].mecConformityStatus = mecConformityStatus;
                    }
                    emit MecConformityStatusUpdated(
                        documentHash,
                        publicKey,
                        mecConformityStatus
                    );
                }

                break;
            }
        }
    }

    event StatusUpdated(
        bytes32 indexed documentHash,
        bytes32 indexed publicKey,
        Status status
    );
    event MecConformityStatusUpdated(
        bytes32 indexed documentHash,
        bytes32 indexed publicKey,
        MecConformityStatus mecConformityStatus
    );
}
