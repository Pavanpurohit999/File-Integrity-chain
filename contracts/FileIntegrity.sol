// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract FileIntegrity {
    struct Record {
        address issuer;
        string purpose;
        uint256 issuedAt;
        uint256 expiresAt; // 0 = never expires
        bool exists;
    }

    mapping(bytes32 => Record) private records;

    function registerFile(
        bytes32 fileHash,
        string calldata purpose,
        uint256 expiresAt
    ) external {
        require(!records[fileHash].exists, "Already registered");
        require(
            expiresAt == 0 || expiresAt > block.timestamp,
            "Invalid expiry"
        );

        records[fileHash] = Record({
            issuer: msg.sender,
            purpose: purpose,
            issuedAt: block.timestamp,
            expiresAt: expiresAt,
            exists: true
        });
    }

    function verifyFile(bytes32 fileHash)
        external
        view
        returns (
            bool valid,
            address issuer,
            string memory purpose,
            uint256 issuedAt,
            uint256 expiresAt
        )
    {
        Record memory r = records[fileHash];

        if (!r.exists) {
            return (false, address(0), "", 0, 0);
        }

        if (r.expiresAt != 0 && block.timestamp > r.expiresAt) {
            return (false, r.issuer, r.purpose, r.issuedAt, r.expiresAt);
        }

        return (true, r.issuer, r.purpose, r.issuedAt, r.expiresAt);
    }
}
