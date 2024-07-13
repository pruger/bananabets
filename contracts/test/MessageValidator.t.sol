// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {MessageValidator} from "../src/MessageValidator.sol";

contract MessageValidatorTest is Test {
    MessageValidator public messageValidator;

    function setUp() public {
        messageValidator = new MessageValidator();
    }

    function test_signature() public view {
        bytes32 r = 0xeb2b3b575960f3d46a04f5c08356a1f10487bca2afaad98a3a8fc034fcee477e;
        bytes32 s = 0x48d433732063deb22c5219b59fdf07b2ac86405ed09e0d580af8316a531e6496;
        uint8 v = 27;
        bytes32 hash = 0xe3657a49450cc2675d49a82cc79b82ecb9e839e14f85c1e00744d9c289cf58ae;
        bytes memory message = hex"000100020003";

        address signer;
        uint16[] memory data;
        (signer, data) = messageValidator.validateAndExtractData(
            v,
            r,
            s,
            hash,
            message
        );
        console.log(signer);
        require(
            signer == address(0x0d88350DCBa99a3089510432d7E1A5b89Dd9FD10),
            "invalid signer"
        );
        for (uint i = 0; i < data.length; i++) {
            require(data[i] == i + 1, "wrong id");
        }
    }
}
