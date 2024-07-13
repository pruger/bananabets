pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/Test.sol";
import {VoteTracker} from "../src/VoteTracker.sol";

contract StatusScript is Script {
    function run(address addr) external view {
        VoteTracker tracker = VoteTracker(addr);

        console.log("positiveFactor:");
        console.logInt(tracker.positiveFactor());
        console.log("negativeFactor:");
        console.logInt(tracker.negativeFactor());
        console.log("voting is active:", tracker.isVotingActive());
        // console.log("vote Counts:");
        // console.log(tracker.getVotersCount());
        console.log("Leaderboard:");
        VoteTracker.Leader[] memory leaderboard = tracker.getLeaderboard();
        for (uint256 i = 0; i < leaderboard.length; i++) {
            console.log(leaderboard[i].addr);
            console.log(leaderboard[i].points);
        }
    }
}
