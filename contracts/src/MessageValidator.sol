// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract MessageValidator {
    function validateAndExtractData(
        uint8 v,
        bytes32 r,
        bytes32 s,
        bytes32 hash,
        bytes calldata message
    ) external pure returns (address, uint16[] memory) {
        require(messageToHash(message) == hash, "invalid message Hash");
        return (ecrecover(hash, v, r, s), unpack(message));
    }

    function messageToHash(
        bytes memory message
    ) internal pure returns (bytes32) {
        bytes memory messageBytes = bytes(message);
        bytes memory prefix = "\x19Ethereum Signed Message:\n";
        string memory lengthAsString = uintToStr(messageBytes.length);
        bytes memory combined = abi.encodePacked(
            prefix,
            lengthAsString,
            messageBytes
        );
        return keccak256(combined);
    }

    function uintToStr(uint v) internal pure returns (string memory) {
        if (v == 0) {
            return "0";
        }
        uint maxlength = 100;
        bytes memory reversed = new bytes(maxlength);
        uint i = 0;
        while (v != 0) {
            uint remainder = v % 10;
            v = v / 10;
            reversed[i++] = bytes1(uint8(48 + remainder));
        }
        bytes memory s = new bytes(i);
        for (uint j = 0; j < i; j++) {
            s[j] = reversed[i - j - 1];
        }
        return string(s);
    }

    function unpack(
        bytes calldata _packed
    ) internal pure returns (uint16[] memory) {
        require(_packed.length % 2 == 0, "Invalid packed array length");
        uint16[] memory unpacked = new uint16[](_packed.length / 2);
        for (uint i = 0; i < unpacked.length; i++) {
            unpacked[i] =
                (uint16(uint8(_packed[i * 2])) << 8) |
                uint16(uint8(_packed[i * 2 + 1]));
        }
        return unpacked;
    }
}
