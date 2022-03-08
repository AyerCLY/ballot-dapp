// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Ballot{

    address public DAOOwner;
    string public proposal;
    event NewProposal(string name);

    constructor() {
        DAOOwner = msg.sender;
    }

    function setProposal(string memory _proposal) external {
        require (msg.sender == DAOOwner);
        proposal = _proposal; 
        emit NewProposal(_proposal);
    }

    mapping(string => uint256) Yes;
    function voteYes(string memory yes) public {
        Yes[yes]++;
    }
    function getYesCount(string memory yes) public view returns (uint256) {
        return Yes[yes];
    }

    mapping(string => uint256) No;
    function voteNo(string memory no) public {
        No[no]++;
    }
    function getNoCount(string memory no) public view returns (uint256) {
        return No[no];
    }

}