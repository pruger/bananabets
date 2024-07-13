pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/Test.sol";
import {VoteTracker} from "../src/VoteTracker.sol";

contract SubmitProjectsScript is Script {
    string[] public projects;

    function run(address addr) external {
        VoteTracker tracker = VoteTracker(addr);
        string[3] memory const_projects = ["fake", "fake1", "fake2"];
        projects = const_projects;
        vm.broadcast();
        tracker.submitShowcaseData(projects);
    }
}
