pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/Test.sol";
import {VoteTracker} from "../src/VoteTracker.sol";

contract VoteTrackerScript is Script {
	address public trackerAddr = address(0xf7aDef4252fbba21ba8274E02cceB9F25f4f6FE4);
	string[] public projectIdsTest = [
		"project0",
		"project1",
		"project2",
		"project3",
		"project4"
	];
	uint16[] public finalistsTest = [0, 1];

    function run() external {
        vm.startBroadcast();
        VoteTracker tracker = VoteTracker(trackerAddr);
		tracker.submitShowcaseData(projectIdsTest);
		tracker.startVotingPeriod();
		bytes32 r = 0xeb2b3b575960f3d46a04f5c08356a1f10487bca2afaad98a3a8fc034fcee477e;
        bytes32 s = 0x48d433732063deb22c5219b59fdf07b2ac86405ed09e0d580af8316a531e6496;
        uint8 v = 27;
        bytes32 hash = 0xe3657a49450cc2675d49a82cc79b82ecb9e839e14f85c1e00744d9c289cf58ae;
        bytes memory message = hex"000100020003";
        tracker.submitVote(v, r, s, hash, message);
        vm.stopBroadcast();
    }
}