pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/Test.sol";
import {VoteTracker} from "../src/VoteTracker.sol";

contract VoteTrackerScript is Script {
    function run() external {
        vm.startBroadcast();
        VoteTracker tracker = new VoteTracker(10, -5);
        vm.stopBroadcast();

        console.log("MyContract deployed at:", address(tracker));
    }
}