// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {VoteTracker} from "../src/VoteTracker.sol";

contract VoteTrackerTest is Test {
    VoteTracker public tracker;

    string[] public projectIdsTest = [
        "project0",
        "project1",
        "project2",
        "project3",
        "project4"
    ];
    uint16[] public finalistsTest = [0, 1];

    function setUp() public {
        tracker = new VoteTracker(20, -1);
    }

    function test_SubmitShowcaseData() public {
        tracker.submitShowcaseData(projectIdsTest);
        assertEq(tracker.getProjectIds()[0], "project0");
    }

    function test_submitVote() public {
        test_SubmitShowcaseData();
        tracker.startVotingPeriod();
        // uint256[] memory votes;
        // votes = new uint256[](2);
        // votes[0] = 1;
        // votes[1] = 2;

        bytes32 r = 0xeb2b3b575960f3d46a04f5c08356a1f10487bca2afaad98a3a8fc034fcee477e;
        bytes32 s = 0x48d433732063deb22c5219b59fdf07b2ac86405ed09e0d580af8316a531e6496;
        uint8 v = 27;
        bytes32 hash = 0xe3657a49450cc2675d49a82cc79b82ecb9e839e14f85c1e00744d9c289cf58ae;
        bytes memory message = hex"000100020003";
        tracker.submitVote(v, r, s, hash, message);

        assertEq(tracker.getVoteCountForProject(1), 1);
        assertEq(tracker.getVoteCountForProject(0), 0);

        uint16 testVotes = tracker.addrToVote(
            address(0x0d88350DCBa99a3089510432d7E1A5b89Dd9FD10), 1
        );
		console.log("2nd vote should be 2: ", testVotes);
    }

    function test_getLeaderboard() public {
        test_submitVote();
        tracker.endVotingPeriod();
        tracker.submitFinalists(finalistsTest);
        VoteTracker.Leader[] memory leaderboardTest = tracker.getLeaderboard();
		console.log(leaderboardTest.length);
		console.log(leaderboardTest[0].addr);
        assertEq(leaderboardTest[0].points, 18);
    }
}
