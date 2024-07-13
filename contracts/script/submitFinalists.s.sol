pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/Test.sol";
import {VoteTracker} from "../src/VoteTracker.sol";

contract SubmitFinalistsScript is Script {
    uint16[] public finalists;

    function run(address addr) external {
        VoteTracker tracker = VoteTracker(addr);
        uint16[3] memory const_finalists = [uint16(1), 2, 3];
        finalists = const_finalists;
        vm.broadcast();
        tracker.submitFinalists(finalists);
    }
}
