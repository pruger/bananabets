// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {MessageValidator} from "./MessageValidator.sol";

contract VoteTracker {
    MessageValidator public messageValidator;

    address[] public voters;
    mapping(address => uint16[]) public addrToVote;
    string[] public projectIdArr;
    uint16[] public finalistIds;
    bool public isVotingActive = false;

    int256 public positiveFactor;
    int256 public negativeFactor;

    struct Leader {
        address addr;
        int256 points;
    }

    address private _owner;
    constructor(int256 _positiveFactor, int256 _negativeFactor) {
        positiveFactor = _positiveFactor;
        negativeFactor = _negativeFactor;
        _owner = msg.sender;
        messageValidator = new MessageValidator();
    }

    modifier onlyOwner() {
        require(msg.sender == _owner);
        _;
    }

    modifier votingActive() {
        require(isVotingActive, "Voting period is not active");
        _;
    }

    modifier votingNotActive() {
        require(!isVotingActive, "Voting period is active");
        _;
    }

    //
    // public
    //

    function submitVote(
        uint8 v,
        bytes32 r,
        bytes32 s,
        bytes32 hash,
        bytes calldata message
    ) external votingActive {
        address sender;
        uint16[] memory addressToVote;
        (sender, addressToVote) = messageValidator.validateAndExtractData(
            v,
            r,
            s,
            hash,
            message
        );
        if (isNumDouble(addressToVote)) {
            revert("Duplicate addressToVote");
        }
        voters.push(sender);
        addrToVote[sender] = addressToVote;
    }

    function getLeaderboard()
        external
        view
        returns (Leader[] memory leaderboard)
    {
        leaderboard = new Leader[](voters.length);
        for (uint256 i = 0; i < voters.length; i++) {
            leaderboard[i].addr = voters[i];
            for (uint256 j = 0; j < addrToVote[voters[i]].length; j++) {
                if (isNumInArr(addrToVote[voters[i]][j], finalistIds)) {
                    leaderboard[i].points += positiveFactor;
                } else {
                    leaderboard[i].points += negativeFactor;
                }
            }
        }
        return leaderboard;
    }

    function getProjectIds()
        external
        view
        returns (string[] memory projectIds)
    {
        return projectIdArr;
    }

    function getVoteCountForProject(
        uint16 projectId
    ) external view returns (uint256 voteCount) {
        for (uint256 i = 0; i < voters.length; i++) {
            if (isNumInArr(projectId, addrToVote[voters[i]])) {
                voteCount++;
            }
        }
        return voteCount;
    }

    function getVotersCount() public view returns (uint count) {
        return voters.length;
    }

    //
    // only Owner
    //

    function startVotingPeriod() external onlyOwner votingNotActive {
        isVotingActive = true;
    }

    function stopVotingPeriod() external onlyOwner votingActive {
        isVotingActive = false;
    }

    function submitShowcaseData(
        string[] memory projectIds
    ) external onlyOwner votingNotActive {
        for (uint16 i = 0; i < projectIds.length; i++) {
            projectIdArr.push(projectIds[i]);
        }
    }

    function submitFinalists(
        uint16[] memory _finalistIds
    ) external onlyOwner votingNotActive {
        for (uint256 i = 0; i < _finalistIds.length; i++) {
            finalistIds.push(_finalistIds[i]);
        }
    }

    //
    // internal
    //

    function isNumDouble(uint16[] memory arr) internal pure returns (bool) {
        for (uint i = 0; i < arr.length; i++) {
            for (uint j = 0; j < arr.length; j++) {
                if (arr[i] == arr[j] && i != j) {
                    return true;
                }
            }
        }
        return false;
    }

    function isNumInArr(
        uint16 num,
        uint16[] memory arr
    ) internal pure returns (bool) {
        for (uint i = 0; i < arr.length; i++) {
            if (arr[i] == num) {
                return true;
            }
        }
        return false;
    }
}
