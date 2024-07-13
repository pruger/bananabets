pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/Test.sol";
import {VoteTracker} from "../src/VoteTracker.sol";

contract StartVoteScript is Script {
    function run(address addr) external {
        VoteTracker tracker = VoteTracker(addr);
        vm.broadcast();
        tracker.startVotingPeriod();
    }
}
