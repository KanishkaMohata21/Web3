// SPDX-License-Identifier: MIT
pragma solidity ^0.4.26;

contract Lottery {
    address public manager;
    address[] public players;

    // Constructor
    constructor() public {
        manager = msg.sender;
    }

    modifier onlyManager() {
        require(msg.sender == manager);
        _;
    }

    function enter() public payable {
        require(msg.value > .0001 ether);
        players.push(msg.sender);
    }

    function getAllPlayers() public view returns (address[]) {
        return players;
    }

    function randomNumber() private view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.difficulty, now, players)));
    }

    function pickWinner() public onlyManager {
        require(players.length > 0);
        uint index = randomNumber() % players.length;
        address winner = players[index];
        winner.transfer(address(this).balance);
        players = new address[](0) ;  
    }
}
