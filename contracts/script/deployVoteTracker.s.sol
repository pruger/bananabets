pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/Test.sol";
import {VoteTracker} from "../src/VoteTracker.sol";

contract DeployScript is Script {
    function run() external {
        vm.broadcast();
        VoteTracker tracker = new VoteTracker(10, -5);

        console.log("MyContract deployed at:", address(tracker));
    }
}
