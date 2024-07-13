// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {VoteTracker} from "../src/VoteTracker.sol";

contract VoteTrackerTest is Test, VoteTracker {
	VoteTracker public tracker;

	string[] public projectIdsTest = ["project0", "project1", "project2", "project3", "project4"];
	string[] public finalistsTest = ["project1", "project2"];

	function setUp() public {
		tracker = new VoteTracker();
	}

	function test_SubmitShowcaseData() public {
		tracker.submitShowcaseData(projectIdsTest);
		assertEq(tracker.getProjectId(projectIdsTest[2]), 2);
	}

	function test_submitVote() public {
		test_SubmitShowcaseData();
		tracker.startVotingPeriod();
		uint256[] memory votes;
		votes = new uint256[](2);
		votes[0] = 1;
		votes[1] = 2;
		tracker.submitVotes(votes);
		assertEq(tracker.getVoteCountForProject(1), 1);
		assertEq(tracker.getVoteCountForProject(0), 0);
	}

	function test_getLeaderboard() public {
		test_submitVote();
		Leader[] memory leaderboardTest = tracker.getLeaderboard();
		console("Leaderboard: ");
	}
}