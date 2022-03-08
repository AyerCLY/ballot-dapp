// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Ballot{
    
    uint256 YesCounter = 0;
    uint256 NoCounter = 0;
    address public DAOOwner;
    string public proposal;
    event NewProposal(string name);
    event votedYes (address voter); //who voted yes
    event votedNo (address voter);//who voted no

    constructor() {
        DAOOwner = msg.sender;
    }

    function setProposal(string memory _proposal) external {
        require (msg.sender == DAOOwner);
        proposal = _proposal; 
        emit NewProposal(_proposal);
    }

    function voteYes() public {
        YesCounter++;
        emit votedYes(msg.sender);
    }
    function getYesCount() public view returns (uint256) {
        return YesCounter;
    }
    function voteNo() public {
        NoCounter++;
        emit votedNo(msg.sender);
    }
    function getNoCount() public view returns (uint256) {
        return NoCounter;
    }

}