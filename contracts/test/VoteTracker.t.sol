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

    function vote() public {
        bytes32 r = 0xeb2b3b575960f3d46a04f5c08356a1f10487bca2afaad98a3a8fc034fcee477e;
        bytes32 s = 0x48d433732063deb22c5219b59fdf07b2ac86405ed09e0d580af8316a531e6496;
        uint8 v = 27;
        bytes32 hash = 0xe3657a49450cc2675d49a82cc79b82ecb9e839e14f85c1e00744d9c289cf58ae;
        bytes memory message = hex"000100020003";
        tracker.submitVote(v, r, s, hash, message, "qqwe");
    }

    function testSubmitShowcaseData() public {
        tracker.submitShowcaseData(projectIdsTest);
        assertEq(tracker.getProjectIds()[0], "project0");
    }

    function testVoteOutsidePeriod() public {
        vm.expectRevert();
        vote();
    }

    function testVoteOutsidePeriod2() public {
        tracker.startVotingPeriod();
        tracker.stopVotingPeriod();
        vm.expectRevert();
        vote();
    }

    function testDoubleVote() public {
        tracker.startVotingPeriod();
        vote();
        vm.expectRevert();
        vote();
    }


    function testVoteWrongHash() public {
        tracker.startVotingPeriod();
        bytes32 r = 0xeb2b3b575960f3d46a04f5c08356a1f10487bca2afaad98a3a8fc034fcee477e;
        bytes32 s = 0x48d433732063deb22c5219b59fdf07b2ac86405ed09e0d580af8316a531e6496;
        uint8 v = 27;
        bytes32 hash = 0xffff7a49450cc2675d49a82cc79b82ecb9e839e14f85c1e00744d9c289cfffff;
        bytes memory message = hex"000100020003";
        vm.expectRevert();
        tracker.submitVote(v, r, s, hash, message, "kartik");
    }

    function testSubmitVote() public {
        testSubmitShowcaseData();
        tracker.startVotingPeriod();
        vote();

        uint256[] memory votes = tracker.getVoteCountsForProjects();
        assertEq(votes[0], 0);
        assertEq(votes[1], 1);

        uint16 testVotes = tracker.addrToVote(
            address(0x0d88350DCBa99a3089510432d7E1A5b89Dd9FD10),
            1
        );
        assertEq(testVotes, 2);
    }

    function testVoteCount() public {
        tracker.startVotingPeriod();
        require(tracker.getVotersCount() == 0, "should be 0 voter");
        vote();
        require(tracker.getVotersCount() == 1, "should be 1 voter");
        tracker.stopVotingPeriod();
    }

    function testLeaderboard() public {
        tracker.startVotingPeriod();
        vote();
        tracker.stopVotingPeriod();
        tracker.submitFinalists(finalistsTest);
        VoteTracker.Leader[] memory leaderboardTest = tracker.getLeaderboard();
        console.log(leaderboardTest.length);
        console.log(leaderboardTest[0].addr);
        console.log(leaderboardTest[0].name);
        assertEq(leaderboardTest[0].points, 18);
        tracker.startVotingPeriod();
        VoteTracker.Leader[] memory leaderboardTest2 = tracker.getLeaderboard();
        assertEq(leaderboardTest2[0].points, 0);
    }

    function testOnlyOwner() public {
        vm.startPrank(address(1));

        vm.expectRevert();
        tracker.startVotingPeriod();

        vm.expectRevert();
        tracker.submitShowcaseData(projectIdsTest);

        vm.expectRevert();
        tracker.submitFinalists(finalistsTest);

        vm.stopPrank();
        tracker.startVotingPeriod();
        vm.startPrank(address(1));
        vm.expectRevert();
        tracker.stopVotingPeriod();
    }
}
