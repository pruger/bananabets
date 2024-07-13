pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/Test.sol";
import {VoteTracker} from "../src/VoteTracker.sol";

contract SubmitProjectsScript is Script {
    string[] public projects;

    function run(address addr) external {
        VoteTracker tracker = VoteTracker(addr);
        bytes32 r = 0xeb2b3b575960f3d46a04f5c08356a1f10487bca2afaad98a3a8fc034fcee477e;
        bytes32 s = 0x48d433732063deb22c5219b59fdf07b2ac86405ed09e0d580af8316a531e6496;
        uint8 v = 27;
        bytes32 hash = 0xe3657a49450cc2675d49a82cc79b82ecb9e839e14f85c1e00744d9c289cf58ae;
        bytes memory message = hex"000100020003";
        vm.broadcast();
        tracker.submitVote(v, r, s, hash, message, "qqqwe");
    }
}
