// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract VoteTracker {
	address[] public voters;
	mapping (address => uint256[]) public votes;
	mapping (string => uint256) public projects;
	uint256[] public finalists;
	bool public isVotingActive = false;

	uint256 constant public POSITIVE_POINTS = 10;
	uint256 constant public NEGATIVE_POINTS = 5;

	struct Leader {
		address addr;
		uint256 points;
	}

	// address private _owner; 
	
	// Sets the original owner of  
	// contract when it is deployed 
	// constructor() 
	// {
	// 	_owner = msg.sender; 
	// }

	// start voting period
	function startVotingPeriod() public {
		// require(msg.sender == _owner);
		isVotingActive = true;
	}

	// end voting period
	function endVotingPeriod() public {
		// require(msg.sender == _owner);
		isVotingActive = false;
	}

	// Submit showcase data
	function submitShowcaseData(string[] memory projectIds) public {
		// require(msg.sender == _owner);
		require(!isVotingActive, "Voting period already started");

		for (uint256 i = 0; i < projectIds.length; i++) {
			projects[projectIds[i]] = i;
		}
	}

	function isNumDouble(uint256[] memory arr) public pure returns (bool) {
		for (uint i = 0; i < arr.length; i++) {
			for (uint j = 0; j < arr.length; j++) {
				if (arr[i] == arr[j] && i != j) {
					return true;
				}
			}
		}
		return false;
	}

	// Submit votes
	function submitVotes(uint256[] memory _votes) public {
		require(isVotingActive, "Voting period is not active");

		if (isNumDouble(_votes)) {
			revert("Duplicate votes");
		}
		voters.push(msg.sender);
		votes[msg.sender] = _votes;
	}

	// submit finalists
	function submitFinalists(uint256[] memory finalistIds) public {
		// require(msg.sender == _owner);
		require(!isVotingActive, "Voting period still active");

		for (uint256 i = 0; i < finalistIds.length; i++) {
			finalists.push(finalistIds[i]);
		}
	}

	function isNumInArr(uint256 num, uint256[] memory arr) public pure returns (bool) {
		for (uint i = 0; i < arr.length; i++) {
			if (arr[i] == num) {
				return true;
			}
		}
		return false;
	}

	// get current leaderboard
	function getLeaderboard() public view returns (Leader[] memory leaderboard) {
		for (uint256 i = 0; i < voters.length; i++) {
			leaderboard[i].addr = voters[i];
			for (uint256 j = 0; j < votes[voters[i]].length; j++) {
				if (isNumInArr(votes[voters[i]][j], finalists)) {
					leaderboard[i].points += POSITIVE_POINTS;
				} else {
					leaderboard[i].points -= NEGATIVE_POINTS;
				}
			}
		}
		return leaderboard;
	}

	// get project id from project id string
	function getProjectId(string memory projectId) public view returns (uint256) {
		return projects[projectId];
	}

	// get vote count for project
	function getVoteCountForProject(uint256 projectId) public view returns (uint256 voteCount) {
		for (uint256 i = 0; i < voters.length; i++) {
			if (isNumInArr(projectId, votes[voters[i]])) {
				voteCount++;
			}
		}
		return voteCount;
	}

}